import { io } from "socket.io-client";

// In production, this should be the full URL of the backend.
// In dev, it's localhost:5000.
// We can try to infer it or just hardcode for this environment.
//const SOCKET_URL = "https://theaquaguide.com";
const SOCKET_URL = import.meta.env.PROD 
  ? "https://theaquaguide.com" 
  : "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: true,
  path: "/socket.io/",
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
