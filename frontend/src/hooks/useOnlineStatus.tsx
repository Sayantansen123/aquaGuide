import { useEffect, useState } from "react";
import { privateSocket, connectPrivateSocket } from "@/socket/privateInstance";
import { onlineStatusApi } from "@/api/modules/online_status";

export const useOnlineStatus = (userId: string | null) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Ensure private socket is connected
    if (!privateSocket.connected) {
      connectPrivateSocket();
    }

    // Fetch initial status
    const fetchStatus = async () => {
      try {
        const res = await onlineStatusApi.getUserStatus(userId);
        setIsOnline(res.data.data.isOnline);
        setLastSeen(res.data.data.lastSeen);
      } catch (error) {
        console.error("Failed to fetch online status:", error);
      }
    };

    fetchStatus();

    // Listen for real-time status changes
    const handleStatusChange = (data: { userId: string; isOnline: boolean }) => {
      console.log("Received status change:", data);
      if (data.userId === userId) {
        setIsOnline(data.isOnline);
        setLastSeen(new Date().toISOString());
      }
    };

    privateSocket.on("user-status-changed", handleStatusChange);

    // Refresh status every 1 minute (reduced from 2)
    const interval = setInterval(fetchStatus, 60 * 1000);

    return () => {
      privateSocket.off("user-status-changed", handleStatusChange);
      clearInterval(interval);
    };
  }, [userId]);

  return { isOnline, lastSeen };
};
