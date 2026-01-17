import { io } from "socket.io-client";
import config from "../api/config";

// The backend expects a JWT token for authentication in the optional 'auth' object
// middleware: socketAuthMiddleware, socketAdminOrSupportMiddleware
export const performanceSocket = io(`${config.baseUrl}/performance`, {
    auth: {
        token: localStorage.getItem("accessToken"), // Required by socketAuthMiddleware
    },
    autoConnect: false, // We'll connect manually when the dashboard loads
    transports: ["websocket"],
});
