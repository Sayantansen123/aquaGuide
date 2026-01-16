import { broadcastStats, getStatsCache } from "../lib/statsBroadcaster.js";

export const getStats = async (req, res) => {
  try {
    await broadcastStats(false); 
    const data = await getStatsCache();
    res.status(200).json(data); 
  } catch (error) {
    console.error("Stats Controller Error:", error);
    res.status(500).json({ message: "Error" });
  }
};