import { useEffect, useState } from 'react';
import { privateSocket } from '@/socket/privateInstance';

interface UserStatusChange {
  userId: string;
  isOnline: boolean;
}

/**
 * Hook to manage and track online status of users in private chat
 * Listens to real-time status changes from the socket
 */
export const useOnlineStatus = () => {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleStatusChange = (data: UserStatusChange) => {
      console.log('[useOnlineStatus] Status change:', data);
      
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (data.isOnline) {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    };

    // Listen for user status changes
    privateSocket.on('user-status-changed', handleStatusChange);

    // Cleanup listener on unmount
    return () => {
      privateSocket.off('user-status-changed', handleStatusChange);
    };
  }, []);

  /**
   * Check if a specific user is online
   * @param userId - The user ID to check
   * @returns boolean - true if user is online
   */
  const isUserOnline = (userId: string): boolean => {
    return onlineUsers.has(userId);
  };

  /**
   * Get array of all online user IDs
   * @returns string[] - Array of online user IDs
   */
  const getOnlineUserIds = (): string[] => {
    return Array.from(onlineUsers);
  };

  /**
   * Get count of online users
   * @returns number - Number of online users
   */
  const getOnlineCount = (): number => {
    return onlineUsers.size;
  };

  return {
    onlineUsers,
    isUserOnline,
    getOnlineUserIds,
    getOnlineCount,
  };
};
