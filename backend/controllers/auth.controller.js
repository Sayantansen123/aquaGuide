import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js"; // Sequelize model
import Guest from "../models/guestModel.js";
import VideoGuide from "../models/video.model.js";
import TextModel from "../models/text.model.js";
import axios from "axios";
import { getClientIp, getGeoFromRequest } from "../utils/location.util.js";
// --------------------
// Token Helpers
// --------------------

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // 7 days
  });
  return { accessToken, refreshToken };
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// --------------------
// SIGNUP
// --------------------
export const signup = async (req, res) => {
  try {
    const { name, userid, email, password, dob, gender, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const existingUserId = await User.findOne({ where: { userid } });
    if (existingUserId) {
      return res.status(400).json({ message: "This username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🌍 IP & location
    const ipAddress = getClientIp(req);
    const location = getGeoFromRequest(req);

    // 👤 Create user with location data
    const user = await User.create({
      name,
      userid,
      email,
      password: hashedPassword,
      dob,
      gender,
      role,
      ip_address: ipAddress,
      country_code: location?.country_code ?? null,
      region: location?.region ?? null,
      latitude: location?.latitude ?? null,
      longitude: location?.longitude ?? null,
      last_seen: new Date(),
    });

    // 🔑 Tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    setCookies(res, accessToken, refreshToken);

    // ✅ Response
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        userid: user.userid,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------
// LOGIN
// --------------------

export const login = async (req, res) => {
  try {
    const { identifier, email, userid, password } = req.body;

    const loginId = identifier || email || userid;

    if (!loginId || !password) {
      return res
        .status(400)
        .json({ message: "Identifier and password required" });
    }

    /* ---------------- FIND USER ---------------- */
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: loginId }, { userid: loginId }],
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    /* ---------------- ACCOUNT STATUS CHECK ---------------- */
    if (user.status !== "active") {
      const message =
        user.status === "locked"
          ? "Account is locked due to too many failed attempts."
          : "Account is currently inactive.";

      return res.status(403).json({ message });
    }

    /* ---------------- PASSWORD CHECK ---------------- */
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      user.failed_login_attempts += 1;

      if (user.failed_login_attempts >= 5) {
        user.status = "locked";
      }

      await user.save();

      const remainingAttempts = Math.max(0, 5 - user.failed_login_attempts);

      if (user.status === "locked") {
        return res.status(403).json({
          message: "Invalid email or password. Account has been locked.",
        });
      }

      return res.status(400).json({
        message: `Invalid email or password. ${remainingAttempts} attempts remaining.`,
      });
    }

    /* ---------------- RESET FAILED ATTEMPTS ---------------- */
    if (user.failed_login_attempts > 0) {
      user.failed_login_attempts = 0;
      await user.save();
    }

    /* ---------------- IP + LOCATION (LOGIN) ---------------- */
    const ipAddress = getClientIp(req);
    const location = getGeoFromRequest(req);

    // Check for guest with same IP
    const guest = await Guest.findOne({
      where: { ip_address: ipAddress },
    });

    if (ipAddress != "::1") {
      // Update user with latest IP + location
      await User.update(
        {
          ip_address: ipAddress,
          country_code: location?.country_code ?? null,
          region: location?.region ?? null,
          latitude: location?.latitude ?? null,
          longitude: location?.longitude ?? null,
          last_seen: new Date(),
        },
        { where: { id: user.id } }
      );

      // 🧹 Remove guest after successful login
      if (guest) {
        await guest.destroy();
      }
    }

    /* ---------------- TOKENS ---------------- */
    const { accessToken, refreshToken } = generateTokens(user.id);
    setCookies(res, accessToken, refreshToken);

    /* ---------------- RESPONSE ---------------- */
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        userid: user.userid,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        accessToken,
        refreshToken,
        tokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
      },
    });
  } catch (error) {
    console.error("💥 Login error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// --------------------
// LOGOUT
// --------------------
export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------
// REFRESH TOKEN
// --------------------
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(401).json({ message: "No refresh token provided" });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.error("Error in refreshToken:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------
// GET PROFILE
// --------------------
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "userid", "name", "email", "role", "dob", "gender"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// its here just to test for admin middleware
export const getProfile2 = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "userid", "name", "email", "role", "dob", "gender"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// to update existing password

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Basic validation
    if (!currentPassword || !newPassword) {
      const err = new Error("All fields required");
      err.status = 400;
      throw err;
    }

    if (currentPassword === newPassword) {
      const err = new Error("New password must be different");
      err.status = 400;
      throw err;
    }

    // Fetch user
    const user = await User.findByPk(userId);

    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      const err = new Error("Current password incorrect");
      err.status = 400;
      throw err;
    }

    // Hash + update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Update password error:", err.message);

    return res.status(err.status || 500).json({
      message: err.message || "Server error",
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: [
        "id",
        "userid",
        "name",
        "email",
        "dob",
        "gender",
        "role",
        "status",
        "community_rating",
        "createdAt", // ✅ added
      ],
    });

    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    const videosPosted = await VideoGuide.count({
      where: { submittedBy: userId },
    });

    const articlesPosted = await TextModel.count({
      where: { author: userId },
    });

    res.status(200).json({
      ...user.toJSON(),
      videos_posted: videosPosted,
      articles_posted: articlesPosted,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const getUserRole = async (req, res) => {
  try {
    const { userid } = req.query;

    if (!userid) {
      return res
        .status(400)
        .json({ message: "userid query param is required" });
    }

    const user = await User.findOne({
      where: { userid },
      attributes: ["role"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error in getUserRole:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const suggestUserIds = async (req, res) => {
  try {
    const { name, dob } = req.body; // or req.query, your choice

    if (!name || !dob) {
      return res.status(400).json({ message: "name and dob are required" });
    }

    // Parse & normalize
    const rawName = name.trim().toLowerCase();
    const nameParts = rawName.split(/\s+/).filter(Boolean);
    const first = nameParts[0] || "user";
    const last = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

    const dateObj = new Date(dob);
    if (isNaN(dateObj.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid dob format, use YYYY-MM-DD" });
    }

    const dd = String(dateObj.getDate()).padStart(2, "0");
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const yyyy = dateObj.getFullYear();
    const yy = String(yyyy).slice(-2);

    // Base patterns – you can tweak/extend these
    let baseCandidates = [
      `${first}${dd}${mm}`, // kaustav1508
      `${first}${dd}${yy}`, // kaustav1502
      `${first}${mm}${yy}`, // kaustav0802
      `${first}${yyyy}`, // kaustav2002
      `${first}${last}${dd}`, // kaustavmahata15
      `${first}${dd}`, // kaustav15
    ];

    // Clean and limit length
    baseCandidates = baseCandidates
      .map(
        (str) =>
          str
            .replace(/[^a-z0-9]/g, "") // only a-z0-9
            .slice(0, 18) // length limit
      )
      .filter(Boolean);

    // Query DB: which of these are already taken?
    const existing = await User.findAll({
      where: {
        userid: {
          [Op.in]: baseCandidates,
        },
      },
      attributes: ["userid"],
    });

    const taken = new Set(existing.map((u) => u.userid));
    const suggestions = [];

    // Add unique base candidates
    for (const cand of baseCandidates) {
      if (!taken.has(cand) && !suggestions.includes(cand)) {
        suggestions.push(cand);
      }
      if (suggestions.length >= 5) break;
    }

    // If we still have < 5, generate suffixed variants
    if (suggestions.length < 5) {
      for (const base of baseCandidates) {
        for (let i = 1; i <= 50 && suggestions.length < 5; i++) {
          const cand = `${base}${i}`;
          if (!taken.has(cand) && !suggestions.includes(cand)) {
            suggestions.push(cand);
          }
        }
        if (suggestions.length >= 5) break;
      }
    }

    return res.status(200).json({
      name,
      dob,
      suggestions,
    });
  } catch (err) {
    console.error("Error in suggestUserIds:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserLocation = async (req, res) => {
  try {
    // ✅ 1. Get IP
    const ip =
      req?.query?.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;
    // ✅ Handle localhost
    if (!ip || ip.includes("127.0.0.1") || ip.includes("::1")) {
      return res.json({
        ip,
        note: "You are running locally, real IP not available.",
      });
    }

    // ✅ 2. Get location from IP
    const geoRes = await axios.get(`http://ip-api.com/json/${ip}`);

    // ✅ 3. Send result to frontend
    res.json({
      ip,
      country: geoRes.data.country,
      state: geoRes.data.regionName,
      city: geoRes.data.city,
      isp: geoRes.data.isp,
      lat: geoRes.data.lat,
      lon: geoRes.data.lon,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get location" });
  }
};

// --------------------
// GET USER ONLINE STATUS
// --------------------
export const getUserOnlineStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId, {
      attributes: ['id', 'userid', 'name', 'last_seen', 'status']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Consider online if last_seen is within last 1 minute (more accurate)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const isOnline = user.status === 'active' && new Date(user.last_seen) > oneMinuteAgo;

    res.json({
      success: true,
      data: {
        userId: user.id,
        userid: user.userid,
        name: user.name,
        isOnline,
        lastSeen: user.last_seen
      }
    });
  } catch (error) {
    console.error("Error fetching user online status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch online status"
    });
  }
};

// --------------------
// GET BULK ONLINE STATUS
// --------------------
export const getBulkOnlineStatus = async (req, res) => {
  try {
    const { userIds } = req.body; // Array of user IDs
    
    if (!Array.isArray(userIds)) {
      return res.status(400).json({
        success: false,
        message: "userIds must be an array"
      });
    }

    const users = await User.findAll({
      where: { id: userIds },
      attributes: ['id', 'userid', 'name', 'last_seen', 'status']
    });

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    
    const statuses = users.map(user => ({
      userId: user.id,
      userid: user.userid,
      name: user.name,
      isOnline: user.status === 'active' && new Date(user.last_seen) > oneMinuteAgo,
      lastSeen: user.last_seen
    }));

    res.json({
      success: true,
      data: statuses
    });
  } catch (error) {
    console.error("Error fetching bulk online status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch online statuses"
    });
  }
};
