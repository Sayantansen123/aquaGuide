import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5001/support";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmMjU0NzgyNS03MGY0LTRmMDgtYTJlNS1hODJkMjJlZjE5Y2QiLCJpYXQiOjE3NjkwMjIwMzIsImV4cCI6MTc2OTEwODQzMn0.-95Pzks-urssQ8fipsKysJXhtMbM0lSFofdhd5lJSEo";
const CHAT_ID = "ffc1292e-0671-4b70-9687-32e278bda6f1";
const USER_ID = "fb88b776-d4aa-4b7b-9828-5b94f8b2affa";

const socket = io(SOCKET_URL, {
  auth: {
    token: TOKEN
  },
  transports: ["websocket"]
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("join_support_chat", {
    chatId: CHAT_ID,
    userId: USER_ID
  });

  setTimeout(() => {
    socket.emit("send_support_message", {
      chatId: CHAT_ID,
      senderId: USER_ID,
      message: "Test message from script"
    });
  }, 500);
});

socket.on("receive_support_message", (msg) => {
  console.log("Message received:", msg);
});

socket.on("support_error", (err) => {
  console.error("Support error:", err);
});

socket.on("error", (err) => {
  console.error("Socket error:", err);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});