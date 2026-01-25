import { io, Socket } from "socket.io-client";

let supportSocket: Socket | null = null;

export const connectSupportSocket = (accessToken: string) => {
  if (supportSocket) return supportSocket;

  supportSocket = io("http://localhost:5000/support", {
    auth: {
      token: accessToken
    },
    transports: ["websocket"],
    autoConnect: true
  });

  supportSocket.on("connect", () => {
    console.log("[SupportSocket] connected:", supportSocket?.id);
  });

  supportSocket.on("disconnect", () => {
    console.log("[SupportSocket] disconnected");
  });

  supportSocket.on("support_error", (err) => {
    console.error("[SupportSocket] support_error:", err);
  });

  supportSocket.on("error", (err) => {
    console.error("[SupportSocket] error:", err);
  });

  return supportSocket;
};

export const joinSupportChat = (chatId: string, userId: string) => {
  if (!supportSocket) return;

  supportSocket.emit("join_support_chat", {
    chatId,
    userId
  });
};

export const sendSupportMessage = (
  chatId: string,
  senderId: string,
  message: string
) => {
  if (!supportSocket) return;

  supportSocket.emit("send_support_message", {
    chatId,
    senderId,
    message
  });
};

export const onSupportMessage = (
  callback: (message: any) => void
) => {
  if (!supportSocket) return;

  supportSocket.on("receive_support_message", callback);
};

export const disconnectSupportSocket = () => {
  if (!supportSocket) return;

  supportSocket.disconnect();
  supportSocket = null;
};

export const onChatResolved = (
  callback: (payload: { chatId: string }) => void
) => {
  if (!supportSocket) return;

  supportSocket.on("support:chat_resolved", callback);
};
export const onChatTakenOver = (
  callback: (payload: { chatId: string; by: string; role: string, byName:string }) => void
) => {
  if (!supportSocket) return;
  supportSocket.on("support:chat_taken_over", callback);
};

export const onSupportError = (
  callback: (err: { message: string }) => void
) => {
  if (!supportSocket) return;
  supportSocket.on("support_error", callback);
};

