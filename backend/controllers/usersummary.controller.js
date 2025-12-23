import User from "../models/user.model.js";
import Guest from "../models/guestModel.js";
import { Op } from "sequelize";

export const getUserSummaryStats = async (req, res) => {
  try {
    const [
      totalRegisteredUsers,
      inactiveUsers,
      activeUsers,
      lockedUsers,
      supportUsers,
      adminUsers,
      guestUsers,
    ] = await Promise.all([
      // Total users
      User.count(),

      // Status based
      User.count({ where: { status: "inactive" } }),
      User.count({ where: { status: "active" } }),
      User.count({ where: { status: "locked" } }),

      // Role based
      User.count({ where: { role: "support" } }),
      User.count({ where: { role: "admin" } }),

      // Guests
      Guest.count(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        total_registered_users: totalRegisteredUsers,
        inactive_users: inactiveUsers,
        active_users: activeUsers,
        locked_users: lockedUsers,
        support_users: supportUsers,
        admin_users: adminUsers,
        guest_users: guestUsers,
      },
    });
  } catch (error) {
    console.error("User summary stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
