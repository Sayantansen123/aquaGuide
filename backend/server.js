import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";
import setupAssociations from "./models/associations.js";
import sequelize from "./lib/db.js"; // Sequelize connection

import authRoutes from "./routes/auth.route.js"; // only auth route
import communityRoutes from "./routes/community_forum.route.js";
import communityChatsRoutes from "./routes/community_chat.route.js";
import videoRoutes from "./routes/video.route.js";
import manageUserRoutes from "./routes/admin.manageuser.route.js";
import speciesRoutes from "./routes/species.route.js";
import speciesPublicRoutes from "./routes/species.public.route.js";
import textGuideRoutes from "./routes/text_guide.route.js";
import privateChatRoutes from "./routes/privateconversation.route.js";
import { setupChatSocket } from "./lib/socket-handlers.js";
import faqRoutes from "./routes/faq.route.js";
import performanceRoutes from "./routes/performance.route.js";
import { setupPerformanceSocket } from "./lib/performance.socket.js";
import { setupPrivateChat } from "./lib/socket-handlers-private.js";

dotenv.config();

// Create express app
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// cors error fix
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

setupAssociations();

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/manage_users", manageUserRoutes);
app.use("/api/manage_species", speciesRoutes);
app.use("/api", speciesPublicRoutes);
app.use("/api/textguides", textGuideRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/community/chat", communityChatsRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/faqs", faqRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/conversation/private", privateChatRoutes);

app.get("/", (req, res) => {
  res.send(
    'Welcome to Aqua Guide API — visit <a href="/api-docs">/api-docs</a> for documentation'
  );
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected");
    if (process.env.ENVIRONMENT == "DEV") {
      await sequelize.sync({ alter: true });
      console.log("Models synced");
    }
    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "*",
        credentials: true,
        methods: ["GET", "POST"],
      },
      transports: ["websocket", "polling"],
    });

    // Setup chat socket handlers
    setupPerformanceSocket(io);

    // Default Socket.IO connection handler (for backward compatibility)
    io.on("connection", (socket) => {
      console.log("[Socket.IO] Default connection:", socket.id);

      socket.on("disconnect", () => {
        console.log("[Socket.IO] Default disconnect:", socket.id);
      });
    });

    setupChatSocket(io);
    setupPrivateChat(io);

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Socket.IO active on same port`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
