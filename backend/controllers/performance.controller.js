import { performanceMonitor } from "../services/performance.monitor.js";

export const getMetrics = async (req, res) => {
  const data = await performanceMonitor.collect();
  res.json(data);
};

export const getHistory = (req, res) => {
  const minutes = Number(req.query.minutes || 60);
  res.json(performanceMonitor.historyLast(minutes));
};

export const getSummary = async (req, res) => {
  const current = await performanceMonitor.collect();
  res.json({
    current,
    history_count: performanceMonitor.history.length,
  });
};
