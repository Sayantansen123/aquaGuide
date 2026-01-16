import { io } from "socket.io-client";

const socket = io("http://localhost:5000/performance", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjI5ODBkNS02NmQ2LTRiYjgtYTRjMC1mMmJmYWJjMDNlZjgiLCJpYXQiOjE3NjgyMzgwMzIsImV4cCI6MTc2ODMyNDQzMn0.YYFuLE2ph8tdU8A8B4lEmo1cTY4cK0vIxBYv2DTLvU0", // RAW JWT
  },
});
socket.on("metrics", data => {
  console.log("Live metrics:", data);
});
socket.on("connect_error", (err) => {
  console.error(err.message);
});

