import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("connected:", socket.id);
  socket.emit("join-room", "test-room");
});

socket.on("receive-message", (data) => {
  console.log("received:", data);
});

setTimeout(() => {
  socket.emit("send-message", {
    roomId: "test-room",
    message: "hello"
  });
}, 3000);