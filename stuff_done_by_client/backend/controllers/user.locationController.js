import User from "../models/user.model.js";
import {
  getClientIp,
  getGeoFromRequest,
} from "../utils/location.util.js";

export const getUserLocations = async (req, res) => {
  try {
    const userId = req.user.id;

    const ipAddress = getClientIp(req);
    const location = getGeoFromRequest(req);

    // Update user location info
    await User.update(
      {
        ip_address: ipAddress,
        country_code: location?.country_code ?? null,
        region: location?.region ?? null,
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
        last_seen: new Date(),
      },
      { where: { id: userId } }
    );

    return res.status(200).json({
      message: "User location updated successfully",
      location: {
        ip_address: ipAddress,
        country_code: location?.country_code ?? null,
        region: location?.region ?? null,
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
      },
    });
  } catch (error) {
    console.error("Error fetching user location:", error);
    return res.status(500).json({
      message: "Failed to get user location",
    });
  }
};
