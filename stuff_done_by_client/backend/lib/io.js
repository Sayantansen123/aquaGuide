import { Server } from "socket.io";

let io;

export const initIO = (server) => {
  io = new Server(server, {
	path: "/socket.io",
    cors: {
      origin: ["https://theaquaguide.com", "https://www.theaquaguide.com"],
      credentials: true,
      methods: ["GET", "POST"],
    },
	transports: ["polling","websocket"],
	allowEIO3: true,
  });
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
