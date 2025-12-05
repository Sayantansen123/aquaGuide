import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js"; // Sequelize model

// --------------------
// Token Helpers
// --------------------

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m", // 15 minutes
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      userid,
      email,
      password: hashedPassword,
      dob,
      gender,
      role,
    });

    const { accessToken, refreshToken } = generateTokens(user.id);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "User created successfully",
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
    const { email, password } = req.body;

    // Step 1: Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("❌ No user found with email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 💥 ADDED: Step 2: Check Account Status
    if (user.status !== "active") {
      const message =
        user.status === "locked"
          ? "Account is locked due to too many failed attempts."
          : "Account is currently inactive.";

      return res.status(403).json({ message }); // 403 Forbidden is appropriate here
    }

    // Step 3: Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // 💥 ADDED: Increment failed attempts on incorrect password
      user.failed_login_attempts += 1;

      // 💥 ADDED: Check if account should be locked
      if (user.failed_login_attempts >= 5) {
        user.status = "locked";
      }

      await user.save(); // Save the updated attempts and potentially the new status

      const remainingAttempts = 5 - user.failed_login_attempts;

      if (user.status === "locked") {
        return res.status(403).json({
          message: "Invalid email or password. Account has been locked.",
        });
      }

      return res.status(400).json({
        message: `Invalid email or password. ${remainingAttempts} attempts remaining.`,
      });
    }

    // 💥 ADDED: Step 4: Reset failed attempts on successful login
    if (user.failed_login_attempts > 0) {
      user.failed_login_attempts = 0;
      await user.save();
    }

    // Step 5: generate JWT (using the existing generateTokens/setCookies pattern for consistency)
    const { accessToken, refreshToken } = generateTokens(user.id);
    setCookies(res, accessToken, refreshToken);

    // Step 6: respond with user data
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        accessToken: accessToken,
        refreshToken: refreshToken,
        tokenExpiry: Date.now() + 60 * 60 * 1000,
      },
    });
  } catch (error) {
    console.error("💥 Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
      attributes: ["id", "name", "email", "role", "dob", "gender"],
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
      attributes: ["id", "name", "email", "role", "dob", "gender"],
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
    const userId = req.user.id; // from protectRoute JWT middleware

    // Basic validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New password must be different" });
    }

    // Fetch user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    // Hash & update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
