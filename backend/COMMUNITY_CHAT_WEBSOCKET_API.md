# Community Chat WebSocket API Documentation

## Overview

The community chat feature uses **Socket.IO** for real-time bidirectional communication. All real-time messaging operations (send, edit, delete, typing) are handled via WebSockets on the `/api/community/chat` namespace.

## Connection

### Connect to WebSocket

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:5000/api/community/chat", {
  auth: {
    userId: "user-uuid-here", // Optional: Send user ID in auth
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Connected to chat server");
});
```

## Events

### Client → Server Events

#### 1. **authenticate-user**

Authenticate the user when connecting. Must be called before sending messages.

```javascript
socket.emit("authenticate-user", { userId: "user-uuid-here" }, (response) => {
  if (response.success) {
    console.log("Authenticated:", response.data);
  } else {
    console.error(response.error);
  }
});
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userid": "username",
    "name": "User Name",
    "email": "email@example.com",
    "community_rating": 0
  },
  "message": "Authenticated successfully"
}
```

---

#### 2. **load-messages**

Load chat history with pagination.

```javascript
socket.emit("load-messages", { page: 1, limit: 50 }, (response) => {
  if (response.success) {
    console.log("Messages:", response.data);
    console.log("Pagination:", response.pagination);
  }
});
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "message": "Hello everyone!",
      "edited_at": null,
      "is_deleted": false,
      "created_at": "2024-12-20T10:30:00Z",
      "updated_at": "2024-12-20T10:30:00Z",
      "User": {
        "id": "uuid",
        "userid": "john_doe",
        "name": "John Doe"
      }
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "totalPages": 3
  }
}
```

---

#### 3. **send-message**

Send a new message to the chat.

```javascript
socket.emit("send-message", { message: "Hello everyone!" }, (response) => {
  if (response.success) {
    console.log("Message sent:", response.data);
  } else {
    console.error(response.error);
  }
});
```

**Message Constraints:**

- Minimum length: 1 character
- Maximum length: 5000 characters
- Cannot be empty or whitespace only

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "message": "Hello everyone!",
    "edited_at": null,
    "is_deleted": false,
    "created_at": "2024-12-20T10:30:00Z",
    "updated_at": "2024-12-20T10:30:00Z",
    "User": {
      "id": "uuid",
      "userid": "john_doe",
      "name": "John Doe"
    }
  },
  "message": "Message sent successfully"
}
```

---

#### 4. **edit-message**

Edit an existing message (only by the message owner).

```javascript
socket.emit(
  "edit-message",
  { messageId: "uuid", message: "Updated message" },
  (response) => {
    if (response.success) {
      console.log("Message edited:", response.data);
    } else {
      console.error(response.error);
    }
  }
);
```

**Constraints:**

- User can only edit their own messages
- Message cannot be empty
- Same length constraints as send-message

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "message": "Updated message",
    "edited_at": "2024-12-20T10:35:00Z",
    "is_deleted": false,
    "created_at": "2024-12-20T10:30:00Z",
    "updated_at": "2024-12-20T10:35:00Z",
    "User": { ... }
  },
  "message": "Message updated successfully"
}
```

---

#### 5. **delete-message**

Delete a message (soft delete, only by owner).

```javascript
socket.emit("delete-message", { messageId: "uuid" }, (response) => {
  if (response.success) {
    console.log("Message deleted");
  } else {
    console.error(response.error);
  }
});
```

**Constraints:**

- User can only delete their own messages
- Soft delete: message content is replaced with "[Message deleted]"

**Response:**

```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

#### 6. **typing**

Broadcast typing status to other users.

```javascript
// User is typing
socket.emit("typing", { isTyping: true });

// User stopped typing
socket.emit("typing", { isTyping: false });
```

---

### Server → Client Events

#### 1. **message-received**

Emitted when a new message is sent by any user.

```javascript
socket.on("message-received", (message) => {
  console.log("New message:", message);
  // Add message to UI
});
```

**Data Structure:**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "message": "Hello everyone!",
  "edited_at": null,
  "is_deleted": false,
  "created_at": "2024-12-20T10:30:00Z",
  "updated_at": "2024-12-20T10:30:00Z",
  "User": {
    "id": "uuid",
    "userid": "john_doe",
    "name": "John Doe"
  }
}
```

---

#### 2. **message-edited**

Emitted when a message is edited.

```javascript
socket.on("message-edited", (message) => {
  console.log("Message edited:", message);
  // Update message in UI
});
```

---

#### 3. **message-deleted**

Emitted when a message is deleted.

```javascript
socket.on("message-deleted", (data) => {
  console.log("Message deleted:", data.id);
  // Remove or update message in UI
});
```

**Data Structure:**

```json
{
  "id": "uuid",
  "is_deleted": true
}
```

---

#### 4. **user-typing**

Emitted when a user is typing.

```javascript
socket.on("user-typing", (data) => {
  console.log(
    `${data.user.name} is ${data.isTyping ? "typing" : "not typing"}`
  );
  // Update typing indicator in UI
});
```

**Data Structure:**

```json
{
  "userId": "uuid",
  "isTyping": true,
  "user": {
    "id": "uuid",
    "userid": "john_doe",
    "name": "John Doe"
  }
}
```

---

#### 5. **user-joined**

Emitted when a user joins the chat.

```javascript
socket.on("user-joined", (data) => {
  console.log(data.message);
  // Update UI to show user joined
});
```

---

#### 6. **user-left**

Emitted when a user leaves the chat.

```javascript
socket.on("user-left", (data) => {
  console.log(data.message);
  // Update UI to show user left
});
```

---

## Error Handling

```javascript
socket.on("error", (error) => {
  console.error("Socket error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
  // Attempt to reconnect
});
```

---

## REST API Endpoints (for history and statistics)

### Get All Messages

```
GET /api/community/chat?page=1&limit=50
Auth: Required
```

### Get Recent Messages

```
GET /api/community/chat/recent?limit=50
Auth: Not required
```

### Get User's Messages

```
GET /api/community/chat/:userId?page=1&limit=50
Auth: Required
```

### Get Chat Statistics

```
GET /api/community/chat/stats
Auth: Not required
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalMessages": 1500,
    "totalUsers": 45,
    "messagesPerDay": [
      { "date": "2024-12-20", "count": 125 },
      { "date": "2024-12-19", "count": 98 }
    ]
  }
}
```

---

## Example Implementation

```javascript
import io from "socket.io-client";

class ChatClient {
  constructor(userId) {
    this.socket = io("http://localhost:5000/api/community/chat", {
      auth: { userId },
      reconnection: true,
      transports: ["websocket", "polling"],
    });

    this.setupListeners();
  }

  setupListeners() {
    this.socket.on("connect", () => {
      console.log("Connected to chat");
      this.loadHistory();
    });

    this.socket.on("message-received", (message) => {
      this.displayMessage(message);
    });

    this.socket.on("message-edited", (message) => {
      this.updateMessage(message);
    });

    this.socket.on("message-deleted", (data) => {
      this.removeMessage(data.id);
    });

    this.socket.on("user-typing", (data) => {
      this.showTypingIndicator(data);
    });
  }

  loadHistory() {
    this.socket.emit("load-messages", { page: 1, limit: 50 }, (response) => {
      if (response.success) {
        response.data.forEach((msg) => this.displayMessage(msg));
      }
    });
  }

  sendMessage(text) {
    this.socket.emit("send-message", { message: text }, (response) => {
      if (!response.success) {
        console.error(response.error);
      }
    });
  }

  editMessage(messageId, newText) {
    this.socket.emit(
      "edit-message",
      { messageId, message: newText },
      (response) => {
        if (!response.success) {
          console.error(response.error);
        }
      }
    );
  }

  deleteMessage(messageId) {
    this.socket.emit("delete-message", { messageId }, (response) => {
      if (!response.success) {
        console.error(response.error);
      }
    });
  }

  notifyTyping(isTyping) {
    this.socket.emit("typing", { isTyping });
  }

  displayMessage(message) {
    // Update UI with message
  }

  updateMessage(message) {
    // Update existing message in UI
  }

  removeMessage(messageId) {
    // Remove message from UI
  }

  showTypingIndicator(data) {
    // Show who is typing
  }

  disconnect() {
    this.socket.disconnect();
  }
}

// Usage
const chat = new ChatClient("user-uuid");
chat.sendMessage("Hello!");
```

---

## Features

✅ Real-time message sending and receiving
✅ Message editing with edit timestamp
✅ Soft message deletion
✅ Typing indicators
✅ User authentication
✅ Message history loading
✅ User join/leave notifications
✅ Automatic reconnection
✅ WebSocket and polling fallback
✅ Error handling and validation

---

## Security Notes

- All WebSocket operations validate user authentication
- Users can only edit/delete their own messages
- Message content is sanitized and validated
- User IDs should be UUIDs
- Rate limiting should be implemented on frontend
