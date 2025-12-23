
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

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
import { setupChatSocket } from "./lib/socket-handlers.js";

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

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Aqua Guide API",
      version: "1.0.0",
      description: "API documentation for Aqua Guide backend",
      contact: {
        name: "Aqua Guide Team",
        email: "support@aquaguide.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            role: { type: "string", example: "user" },
            dob: { type: "string", example: "1995-08-25" },
            gender: { type: "string", example: "male" },
          },
        },
        SignupRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "John Doe" },
            userid: { type: "string", example: "john_doe" },
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "12345678" },
            dob: { type: "string", example: "1990-05-15" },
            gender: { type: "string", example: "male" },
            role: { type: "string", example: "user" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "12345678" },
          },
        },
        CreateForumRequest: {
          type: "object",
          required: ["title", "content"],
          properties: {
            title: { type: "string", example: "ABC" },
            content: { type: "string", example: "XYZ" },
          },
        },
        AddCommentRequest: {
          parameters: [
            {
              name: "forum_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
                example: "550e8400-e29b-41d4-a716-446655440000",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["content"],
                  properties: {
                    content: {
                      type: "string",
                      example: "This is a comment",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

setupAssociations();
const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/manage_users", manageUserRoutes);
app.use("/api/manage_species", speciesRoutes);
app.use("/api", speciesPublicRoutes);
app.use("/api/textguides", textGuideRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/community/chat", communityChatsRoutes);
app.use("/uploads", express.static("uploads"));

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

    await sequelize.sync({ alter: true });
    console.log("Models synced");

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
    setupChatSocket(io);

    // Default Socket.IO connection handler (for backward compatibility)
    io.on("connection", (socket) => {
      console.log("[Socket.IO] Default connection:", socket.id);

      socket.on("disconnect", () => {
        console.log("[Socket.IO] Default disconnect:", socket.id);
      });
    });

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
