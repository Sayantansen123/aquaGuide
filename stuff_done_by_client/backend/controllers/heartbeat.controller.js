import User from "../models/user.model.js";
import Guest from "../models/guestModel.js";
import { getClientIp,getGeoFromRequest } from "../utils/location.util.js";

export const heartbeat = async (req, res) => {
  try {
    const now = new Date();
    const ipAddress = getClientIp(req);

    if (!ipAddress) {
      return res.status(400).json({
        message: "Unable to determine IP address",
      });
    }

    const location = getGeoFromRequest(req);
    let updated = false;

    /* ================= USER HEARTBEAT ================= */
    if (req.user?.id) {
      const user = await User.findByPk(req.user.id);

      // 🔁 Update ONLY if IP is different or missing
      if (!user.ip_address || user.ip_address !== ipAddress) {
        await User.update(
          {
            last_seen: now,
            ip_address: ipAddress,
            country_code: location?.country_code ?? null,
            region: location?.region ?? null,
            latitude: location?.latitude ?? null,
            longitude: location?.longitude ?? null,
          },
          { where: { id: req.user.id } }
        );

        updated = true;
      }
    }

    /* ================= GUEST HEARTBEAT ================= */
    const guest = await Guest.findOne({
      where: { ip_address: ipAddress },
    });

    // 🔁 Only create if NOT exists
    if (!guest) {
      await Guest.create({
        ip_address: ipAddress,
        country_code: location?.country_code ?? null,
        region: location?.region ?? null,
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
        last_seen: now,
      });

      updated = true;
    }

    return res.status(200).json({
      status: "ok",
      message: updated
        ? "Heartbeat processed (new IP detected)"
        : "Heartbeat ignored (same IP)",
      timestamp: now,
    });
  } catch (error) {
    console.error("Heartbeat error:", error);
    return res.status(500).json({
      message: "Failed to update heartbeat",
    });
  }
};
