import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";
import setupAssociations from "./models/associations.js";
import sequelize from "./lib/db.js"; 
import { initIO } from "./lib/io.js";
import { setupHooks } from "./models/hooks.js";
import geoip from 'geoip-lite';
import authRoutes from "./routes/auth.route.js";
import communityRoutes from "./routes/community_forum.route.js";
import communityChatsRoutes from "./routes/community_chat.route.js";
import videoRoutes from "./routes/video.route.js";
import manageUserRoutes from "./routes/admin.manageuser.route.js";
import speciesRoutes from "./routes/species.route.js";
import speciesPublicRoutes from "./routes/species.public.route.js";
import textGuideRoutes from "./routes/text_guide.route.js";
import { setupChatSocket } from "./lib/socket-handlers.js";
import faqRoutes from "./routes/faq.route.js";
import statsRoutes from "./routes/stats.route.js";

// IMPORT YOUR MODELS HERE
import User from "./models/user.model.js"; 
import Guest from "./models/guestModel.js"; 

dotenv.config();

const app = express();
const activeUsers = new Map(); // FIXED: Added missing activeUsers map
export const getActiveUsersMap = () => Array.from(activeUsers.values());

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
/*const allowedOrigins = ['https://www.theaquaguide.com', 'https://theaquaguide.com'];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'] 
}));
*/


setupAssociations();

// Routes
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
app.use("/api/stats", statsRoutes);


// Helper function fixed to handle socket object correctly
  const getGeoFromRequest = (socket) => {
  const forwarded = socket.handshake.headers["x-forwarded-for"];
  const ip = forwarded ? forwarded.split(",")[0] : socket.handshake.address;
  const cleanIp = ip.replace(/^.*:/, "");
  const geo = geoip.lookup(cleanIp);
  
  if (geo) {
    return {
      latitude: geo.ll[0],
      longitude: geo.ll[1],
      region: `${geo.city || 'Unknown'}, ${geo.country}`,
      country_code: geo.country
    };
  }
  return { latitude: 20, longitude: 0, region: "Unknown", country_code: "?? "};
};

// Placeholder for broadcast function (ensure this is defined in your stats logic)
const broadcastStats = async () => {
    // Implement your stats broadcasting logic here if needed
};

app.get("/", (req, res) => res.send('Aqua Guide API Active'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected");
    
    const server = http.createServer(app);
    const io = initIO(server);

    setupChatSocket(io);
    setupHooks();

    io.on("connection", async (socket) => {
      // FIXED: Passing the full socket object
      const geo = getGeoFromRequest(socket);
      const ipAddress = socket.handshake.headers["x-forwarded-for"]?.split(",")[0] || socket.handshake.address;

      let userName = "Guest";
      let userType = "Guest";
      const userId = socket.handshake.auth?.userId;

      try {
        if (userId) {
          const user = await User.findByPk(userId);
          if (user) {
            userName = user.name;
            userType = user.role === "admin" ? "Staff" : "Registered";

            await User.update({
              last_seen: new Date(),
              ip_address: ipAddress,
              region: geo?.region,
              latitude: geo?.latitude,
              longitude: geo?.longitude
            }, { where: { id: userId } });
          }
        } else {
          const [guest, created] = await Guest.findOrCreate({
            where: { ip_address: ipAddress },
            defaults: {
              last_seen: new Date(),
              region: geo?.region,
              latitude: geo?.latitude,
              longitude: geo?.longitude
            }
          });
          if (!created) await guest.update({ last_seen: new Date() });
          userName = guest.guest_name || "Guest";
        }
      } catch (err) {
        console.error("Socket Tracking DB Error:", err);
      }

      activeUsers.set(socket.id, {
        socketId: socket.id,
        name: userName,
        type: userType,
        coords: [geo?.latitude || 20, geo?.longitude || 0],
        city: geo?.region || "Unknown"
      });

      io.emit("live-tracking-update", Array.from(activeUsers.values()));

      socket.on("disconnect", () => {
        activeUsers.delete(socket.id);
        io.emit("live-tracking-update", Array.from(activeUsers.values()));
      });
    });

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
