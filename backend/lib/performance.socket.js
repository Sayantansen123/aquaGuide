import { performanceMonitor } from "../services/performance.monitor.js";
import { socketAuthMiddleware,socketAdminOrSupportMiddleware } from "../middleware/auth.middleware.js";

export const setupPerformanceSocket = (io) => {
  const nsp = io.of("/performance");
  nsp.use(socketAuthMiddleware);
  nsp.use(socketAdminOrSupportMiddleware);

  nsp.on("connection", (socket) => {
    console.log("[Performance WS] connected:", socket.id);

    const interval = setInterval(async () => {
      const metrics = await performanceMonitor.collect();
      socket.emit("metrics", metrics);
    }, 1000);

    socket.on("disconnect", () => {
      clearInterval(interval);
      console.log("[Performance WS] disconnected:", socket.id);
    });
  });
};
