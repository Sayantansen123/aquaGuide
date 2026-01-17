import { io, Socket } from "socket.io-client";
import config from "../api/config";

const SOCKET_URL = config.baseUrl;

console.log("Private Socket URL:", `${SOCKET_URL}/api/chat/private`);

// Private chat socket (new namespace)
export const privateSocket: Socket = io(`${SOCKET_URL}/api/chat/private`, {
    autoConnect: false,
    transports: ["websocket", "polling"],
});

// Connect private socket when user logs in
export const connectPrivateSocket = () => {
    // Get token - check both possible keys
    const token = localStorage.getItem("accessToken");

    console.log("Token available:", !!token);
    console.log("Token value (first 20 chars):", token?.substring(0, 20));

    if (token && !privateSocket.connected) {
        console.log("Connecting private socket with token...");
        // Update auth object with fresh token
        privateSocket.auth = { token };
        privateSocket.connect();
    } else if (!token) {
        console.warn("No token available for private socket");
        console.log("LocalStorage keys:", Object.keys(localStorage));
    } else if (privateSocket.connected) {
        console.log("Private socket already connected");
    }
};

// Disconnect private socket on logout
export const disconnectPrivateSocket = () => {
    if (privateSocket.connected) {
        console.log("Disconnecting private socket...");
        privateSocket.disconnect();
    }
};