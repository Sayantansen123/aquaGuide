import User from "../models/user.model.js";
import Guest from "../models/guestModel.js";
import { getClientIp } from "../utils/location.util.js";

export const heartbeat = async (req, res) => {
  try {
    const now = new Date();
    let updated = false;

    /* ---------------- USER HEARTBEAT ---------------- */
    if (req.user?.id) {
      await User.update(
        { last_seen: now },
        { where: { id: req.user.id } }
      );
      updated = true;
    }

    /* ---------------- GUEST HEARTBEAT ---------------- */
    const ipAddress = getClientIp(req);

    if (ipAddress) {
      const [count] = await Guest.update(
        { last_seen: now },
        { where: { ip_address: ipAddress } }
      );

      if (count > 0) {
        updated = true;
      }
    }

    return res.status(200).json({
      status: "ok",
      message: updated
        ? "Heartbeat received"
        : "No matching user or guest found",
      timestamp: now,
    });
  } catch (error) {
    console.error("Heartbeat error:", error);
    return res.status(500).json({
      message: "Failed to update heartbeat",
    });
  }
};
