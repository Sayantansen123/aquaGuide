import { io } from "socket.io-client";
import sequelize from "./lib/db.js";
import User from "./models/user.model.js";
import SupportChat from "./models/support_chat.model.js";
import SupportMember from "./models/support_member.model.js";
import jwt from "jsonwebtoken";

const PORT = process.env.PORT || 5000;
const SOCKET_URL = `http://localhost:${PORT}/support`;

async function testSupportChat() {
    try {
        console.log("1. Connecting to Database...");
        await sequelize.authenticate();
        console.log("   Database connected.");

        console.log("2. Creating Test Data...");
        // Create or find a test user
        const [user] = await User.findOrCreate({
            where: { email: "test_socket_user@example.com" },
            defaults: {
                username: "SocketTester",
                password: "password123",
                role: "user",
                name: "Socket Tester",
                dob: "2000-01-01",
                gender: "male",
                userid: "socket_tester_001"
            },
        });
        console.log(`   User ID: ${user.id}`);

        // Generate Token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );
        console.log(`   User Token Generated.`);

        // Create Support Agent
        const [supportUser] = await User.findOrCreate({
            where: { email: "support_agent@example.com" },
            defaults: {
                username: "SupportAgent01",
                password: "password123",
                role: "admin",
                name: "Support Agent",
                dob: "1990-01-01",
                gender: "female",
                userid: "support_agent_001"
            },
        });
        console.log(`   Support Agent ID: ${supportUser.id}`);

        const supportToken = jwt.sign(
            { userId: supportUser.id, role: supportUser.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        // Create a support chat
        const chat = await SupportChat.create({
            initiated_by: user.id,
        });

        // Add support agent to chat members
        await SupportMember.create({
            support_chat_id: chat.id,
            user_id: supportUser.id,
            is_locked: false
        });

        console.log(`   Chat ID: ${chat.id}`);

        console.log(`3. Connecting User Socket...`);
        const userSocket = io(SOCKET_URL, { auth: { token: token } });

        console.log(`4. Connecting Support Socket...`);
        const supportSocket = io(SOCKET_URL, { auth: { token: supportToken } });

        // Helper to wrap socket connection
        const waitForConnect = (socket, name) => new Promise((resolve, reject) => {
            const onConnect = () => {
                console.log(`   ✅ ${name} connected! ${socket.id}`);
                socket.off("connect", onConnect);
                resolve();
            };
            socket.on("connect", onConnect);
            socket.on("connect_error", (err) => reject(new Error(`${name} connection failed: ${err.message}`)));
        });

        await Promise.all([waitForConnect(userSocket, "User"), waitForConnect(supportSocket, "Support")]);

        // Join Rooms
        userSocket.emit("join_support_chat", { chatId: chat.id, userId: user.id });
        supportSocket.emit("join_support_chat", { chatId: chat.id, userId: supportUser.id });

        // Wait for joins
        await new Promise(r => setTimeout(r, 1000));

        // Setup message listeners
        userSocket.on("receive_support_message", (data) => {
            console.log(`   📩 User received: "${data.message}" from ${data.sender_id}`);
            if (data.message === "Hello from Support!") {
                console.log("   🎉 SUCCESS: Support -> User message received!");
                process.exit(0);
            }
        });

        supportSocket.on("receive_support_message", (data) => {
            console.log(`   📩 Support received: "${data.message}" from ${data.sender_id}`);

            // If message is from user, reply
            if (data.sender_id === user.id) {
                console.log("   🔄 Support replying...");
                supportSocket.emit("send_support_message", {
                    chatId: chat.id,
                    senderId: supportUser.id,
                    message: "Hello from Support!",
                });
            }
        });

        // Start flow: User sends message
        console.log("5. User sending message...");
        userSocket.emit("send_support_message", {
            chatId: chat.id,
            senderId: user.id,
            message: "Help me please!",
        });

        // Timeout
        setTimeout(() => {
            console.log("   ❌ Timeout waiting for exchange.");
            process.exit(1);
        }, 10000);

    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
}

testSupportChat();
