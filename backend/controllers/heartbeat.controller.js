import User from "../models/user.model.js";

export const heartbeat = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.update(
      { last_seen: new Date() },
      { where: { id: userId } }
    );

    return res.status(200).json({
      status: "ok",
      message: "Heartbeat received",
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Heartbeat error:", error);
    return res.status(500).json({
      message: "Failed to update heartbeat",
    });
  }
};
