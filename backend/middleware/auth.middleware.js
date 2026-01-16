import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import TextModel from "../models/text.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // ✅ Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    const accessToken = authHeader.split(" ")[1];

    try {
      // ✅ Verify JWT
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      // ✅ Fetch user from DB (exclude password)
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(401).json({
          message: "Unauthorized - User not found",
        });
      }

      // ✅ Attach user to request
      req.user = user;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Unauthorized - Token expired",
        });
      }

      return res.status(401).json({
        message: "Unauthorized - Invalid token",
      });
    }
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// -------------------------
// ADMIN ROUTE MIDDLEWARE
// -------------------------
export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};

export const supportOrAdminRoute = (req, res, next) => {
  // The original code allowed either 'admin' OR 'support' to unlock a user.
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "support")) {
    return res
      .status(403)
      .json({ message: "Admin or Support privileges required." });
  }
  next();
};

export const supportOnlyRoute = (req, res, next) => {
  // The original code allowed either 'admin' OR 'support' to unlock a user.
  if (!req.user || req.user.role !== "support") {
    return res
      .status(403)
      .json({ message: "Support only route." });
  }
  next();
};


export const canEditGuideMiddleware = async (req, res, next) => {
  try {
    const guideId = req.params.id;
    const user = req.user;

    const guide = await TextModel.findByPk(guideId);
    if (!guide) {
      return res.status(404).json({ message: "Text guide not found" });
    }

    const isAdmin = user.role === "admin";
    const isOwner = guide.author === user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "You are not allowed to modify this text guide",
      });
    }

    // attach guide to request so controller doesn't fetch again
    req.textGuide = guide;

    next();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      message: "Error verifying guide access permissions",
    });
  }
};

export const optionalProtectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No token → guest request
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const accessToken = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );

      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ["password"] },
      });

      if (user) {
        req.user = user; // 👈 attach ONLY if valid
      }
    } catch (error) {
      // Ignore token errors → treat as guest
    }

    next();
  } catch (error) {
    console.error("Error in optionalProtectRoute:", error.message);
    next();
  }
};


export const socketAuthMiddleware = async (socket, next) => {
  try {
    // ✅ 1. Get token from handshake (preferred)
    let token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization;

    // ✅ 2. Handle "Bearer <token>"
    if (token?.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!token) {
      return next(new Error("Unauthorized - No token provided"));
    }

    // ✅ 3. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(new Error("Unauthorized - Token expired"));
      }
      return next(new Error("Unauthorized - Invalid token"));
    }

    // ✅ 4. Fetch user from DB (exclude password)
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return next(new Error("Unauthorized - User not found"));
    }

    // ✅ 5. Attach user to socket
    socket.user = user;

    next();
  } catch (error) {
    console.error("Error in socketAuthMiddleware:", error.message);
    next(new Error("Internal server error"));
  }
};

export const socketAdminOrSupportMiddleware = (socket, next) => {
  try {
    if (!socket.user) {
      return next(new Error("Unauthorized - User not authenticated"));
    }

    if (socket.user.role !== "admin" && socket.user.role !== "support") {
      return next(new Error("Access denied - Admin or Support only"));
    }

    next();
  } catch (error) {
    console.error("Error in socketAdminMiddleware:", error.message);
    next(new Error("Internal server error"));
  }
};

