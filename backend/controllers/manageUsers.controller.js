import User from "../models/user.model.js"; // Adjust the path to your User model
import { Op, fn, col, where } from "sequelize";
// Helper function to send status messages (like Flask's flash)
const sendResponseAndRedirect = (
  res,
  success,
  message,
  redirectPath = "/admin/manage-users"
) => {
  // In a REST API, you'd usually just send JSON.
  // Since the original code redirects, we'll send a message and tell the client where to go.
  return res.status(success ? 200 : 400).json({
    success,
    message,
    redirect: redirectPath,
  });
};
// Simple helper to enforce admin seniority rule
const assertCanActOnTargetAdmin = (currentUser, targetUser) => {
  // only applies when BOTH are admins
  if (currentUser.role === "admin" && targetUser.role === "admin") {
    // older admin = smaller createdAt
    if (targetUser.createdAt < currentUser.createdAt) {
      const err = new Error("You cannot modify an admin who is older than you");
      err.status = 403;
      throw err;
    }
  }
};

// GET /manage-users
export const manageUsers = async (req, res, next) => {
  try {
    const statusFilter = req.query.status;
    const validStatuses = ["active", "inactive", "locked"];

    // pagination
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.limit) || 3;
    const offset = (page - 1) * per_page;

    let queryOptions = {
      order: [["createdAt", "ASC"]],
      where: {},
      limit: per_page,
      offset,
    };

    let pageTitle = "Manage All Users";

    if (validStatuses.includes(statusFilter)) {
      queryOptions.where.status = statusFilter;
      pageTitle = `Manage ${
        statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
      } Users`;
    }

    // find + count for pagination
    const { count, rows } = await User.findAndCountAll(queryOptions);

    return res.json({
      title: pageTitle,
      users: rows,
      pagination: {
        total_items: count,
        current_page: page,
        totalPages: Math.ceil(count / per_page),
        pageSize: per_page,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /user/:id/activate
export const activateUser = async (req, res, next) => {
  try {
    const { userId } = req.params; // was userId
    const currentUser = req.user; // logged-in admin

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prevent admin from modifying their own account status
    if (user.id === currentUser.id) {
      return sendResponseAndRedirect(
        res,
        false,
        "You cannot activate your own account."
      );
    }

    // 🔴 AGE-BASED ADMIN CHECK
    assertCanActOnTargetAdmin(currentUser, user);

    user.status = "active";
    user.failed_login_attempts = 0;
    await user.save();

    sendResponseAndRedirect(
      res,
      true,
      `User '${user.username || user.email}' has been activated.`
    );
  } catch (error) {
    next(error);
  }
};

// POST /user/:id/deactivate
export const deactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.id === currentUser.id) {
      return sendResponseAndRedirect(
        res,
        false,
        "You cannot deactivate your own account."
      );
    }

    // 🔴 AGE-BASED ADMIN CHECK
    assertCanActOnTargetAdmin(currentUser, user);

    user.status = "inactive";
    await user.save();

    sendResponseAndRedirect(
      res,
      true,
      `User '${user.username || user.email}' has been deactivated.`
    );
  } catch (error) {
    next(error);
  }
};

// POST /user/:id/unlock
export const unlockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 🔴 AGE-BASED ADMIN CHECK (only matters if both are admins)
    assertCanActOnTargetAdmin(currentUser, user);

    if (user.status === "locked") {
      user.status = "active";
      user.failed_login_attempts = 0;
      await user.save();
      sendResponseAndRedirect(
        res,
        true,
        `User '${user.username || user.email}' has been unlocked.`
      );
    } else {
      sendResponseAndRedirect(
        res,
        false,
        `User '${user.username || user.email}' was not locked.`
      );
    }
  } catch (error) {
    next(error);
  }
};

// POST /user/:id/toggle_admin
export const toggleAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prevent self-modification
    if (user.id === currentUser.id) {
      return sendResponseAndRedirect(
        res,
        false,
        "You can't change your own admin rights."
      );
    }

    // 🔴 AGE-BASED ADMIN CHECK
    assertCanActOnTargetAdmin(currentUser, user);

    // Optional safety: prevent removing the last admin
    if (user.role === "admin") {
      const remainingAdminsCount = await User.count({
        where: { role: "admin" },
      });
      if (remainingAdminsCount <= 1) {
        return sendResponseAndRedirect(
          res,
          false,
          "You can't remove the last remaining admin."
        );
      }
    }

    // Toggle logic
    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    sendResponseAndRedirect(
      res,
      true,
      `Admin status for ${user.username || user.email} set to ${
        user.role === "admin"
      }.`
    );
  } catch (error) {
    next(error);
  }
};

// POST /user/:id/toggle_support
export const toggleSupport = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.id === currentUser.id) {
      return sendResponseAndRedirect(
        res,
        false,
        "You can't change your own support rights."
      );
    }

    // 🔴 AGE-BASED ADMIN CHECK
    assertCanActOnTargetAdmin(currentUser, user);

    // Assuming support is toggled between 'support' and 'user'
    user.role = user.role === "support" ? "user" : "support";
    await user.save();

    sendResponseAndRedirect(
      res,
      true,
      `Support Agent status for ${user.username || user.email} set to ${
        user.role === "support"
      }.`
    );
  } catch (error) {
    next(error);
  }
};

// POST /user/:id/delete
export const deleteUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const { userId } = req.params;

    const targetUser = await User.findByPk(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't let an admin delete themselves
    if (targetUser.id === currentUser.id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    // 🔴 AGE-BASED ADMIN CHECK
    assertCanActOnTargetAdmin(currentUser, targetUser);

    await targetUser.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Server error" });
  }
};

export const searchUser = async (req, res, next) => {
  try {
    const { userName } = req.query;
    const currentUserId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * per_page;

    if (!userName || !userName.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const searchValue = `%${userName.toLowerCase()}%`;

    const { count, rows } = await User.findAndCountAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              where(fn("LOWER", col("userid")), {
                [Op.like]: searchValue,
              }),
            ],
          },
          {
            id: { [Op.ne]: currentUserId },
          },
        ],
      },
      attributes: ["id", "userid", "email", "role", "createdAt"],
      limit: per_page,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      data: rows,
      pagination: {
        total_items: count,
        current_page: page,
        totalPages: Math.ceil(count / per_page),
        pageSize: per_page,
      },
    });
  } catch (error) {
    console.error("User search error:", error);
    next(error);
  }
};
