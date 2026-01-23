/**
 * Online Status Service
 * Manages user online/offline status for private chat
 * Tracks multiple connections per user (multiple tabs/devices)
 */
class OnlineStatusService {
  constructor() {
    // Map of userId -> Set of socketIds
    // Allows tracking multiple connections per user
    this.onlineUsers = new Map();
  }

  /**
   * Register a user as online with a specific socket connection
   * @param {string} userId - The user's ID
   * @param {string} socketId - The socket connection ID
   */
  userConnected(userId, socketId) {
    if (!userId) {
      console.warn("Attempted to connect user with no userId");
      return;
    }

    if (!this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, new Set());
    }
    this.onlineUsers.get(userId).add(socketId);
    
    console.log(`[OnlineStatus] User ${userId} connected (socket: ${socketId})`);
    console.log(`[OnlineStatus] Total connections for user ${userId}: ${this.onlineUsers.get(userId).size}`);
  }

  /**
   * Unregister a socket connection for a user
   * If user has no more connections, they are marked offline
   * @param {string} userId - The user's ID
   * @param {string} socketId - The socket connection ID
   * @returns {boolean} - True if user is now completely offline
   */
  userDisconnected(userId, socketId) {
    if (!userId) {
      console.warn("Attempted to disconnect user with no userId");
      return false;
    }

    if (this.onlineUsers.has(userId)) {
      this.onlineUsers.get(userId).delete(socketId);
      
      // If no more connections, remove user from online map
      if (this.onlineUsers.get(userId).size === 0) {
        this.onlineUsers.delete(userId);
        console.log(`[OnlineStatus] User ${userId} is now offline (socket: ${socketId})`);
        return true; // User is completely offline
      }
      
      console.log(`[OnlineStatus] User ${userId} disconnected one socket (${socketId}), but still has ${this.onlineUsers.get(userId).size} connections`);
      return false; // User still has other connections
    }
    
    return false;
  }

  /**
   * Check if a user is currently online
   * @param {string} userId - The user's ID
   * @returns {boolean} - True if user has at least one active connection
   */
  isUserOnline(userId) {
    return this.onlineUsers.has(userId) && this.onlineUsers.get(userId).size > 0;
  }

  /**
   * Get online status for multiple users
   * @param {string[]} userIds - Array of user IDs
   * @returns {Object} - Object mapping userId to boolean online status
   */
  getOnlineUsers(userIds) {
    if (!Array.isArray(userIds)) {
      console.warn("getOnlineUsers called with non-array argument");
      return {};
    }

    return userIds.reduce((acc, userId) => {
      acc[userId] = this.isUserOnline(userId);
      return acc;
    }, {});
  }

  /**
   * Get all currently online user IDs
   * @returns {string[]} - Array of online user IDs
   */
  getAllOnlineUserIds() {
    return Array.from(this.onlineUsers.keys());
  }

  /**
   * Get the number of online users
   * @returns {number} - Count of online users
   */
  getOnlineCount() {
    return this.onlineUsers.size;
  }

  /**
   * Get detailed connection info for debugging
   * @returns {Object} - Map of userId -> connection count
   */
  getConnectionStats() {
    const stats = {};
    for (const [userId, socketSet] of this.onlineUsers.entries()) {
      stats[userId] = socketSet.size;
    }
    return stats;
  }
}

// Export singleton instance
export default new OnlineStatusService();
