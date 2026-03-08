# API Documentation

## Base URLs
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "60d5ec49c1234567890abc",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePicture": "..."
  }
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "60d5ec49c1234567890abc",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePicture": "..."
  }
}
```

### Get Current User
```
GET /auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "user": {
    "_id": "60d5ec49c1234567890abc",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePicture": "...",
    "bio": "Hello!",
    "isOnline": true,
    "friends": [...]
  }
}
```

---

## User Endpoints

### Get User Profile
```
GET /users/:userId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "user": {
    "id": "60d5ec49c1234567890abc",
    "username": "john_doe",
    "profilePicture": "...",
    "bio": "Hello!",
    "isOnline": true,
    "lastSeen": "2024-01-01T10:00:00Z",
    "friends": [...]
  }
}
```

### Update Profile
```
PUT /users/profile/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "new_username",
  "bio": "New bio",
  "profilePicture": "image_url"
}

Response (200):
{
  "success": true,
  "message": "Profile updated",
  "user": {...}
}
```

### Search Users
```
GET /users/search/users?query=john
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "users": [
    {
      "_id": "60d5ec...",
      "username": "john_doe",
      "profilePicture": "...",
      "isOnline": true
    }
  ]
}
```

### Add Friend
```
POST /users/friend/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "friendId": "60d5ec49c1234567890abc"
}

Response (200):
{
  "success": true,
  "message": "Friend request sent"
}
```

### Accept Friend Request
```
POST /users/friend/accept
Authorization: Bearer <token>
Content-Type: application/json

{
  "friendId": "60d5ec49c1234567890abc"
}

Response (200):
{
  "success": true,
  "message": "Friend request accepted"
}
```

### Get Friends
```
GET /users/friends/all
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "friends": [
    {
      "_id": "60d5ec...",
      "username": "jane_doe",
      "profilePicture": "...",
      "isOnline": true,
      "lastSeen": "..."
    }
  ]
}
```

### Remove Friend
```
POST /users/friend/remove
Authorization: Bearer <token>
Content-Type: application/json

{
  "friendId": "60d5ec49c1234567890abc"
}

Response (200):
{
  "success": true,
  "message": "Friend removed"
}
```

### Block User
```
POST /users/user/block
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "60d5ec49c1234567890abc"
}

Response (200):
{
  "success": true,
  "message": "User blocked"
}
```

---

## Conversation Endpoints

### Get All Conversations
```
GET /conversations/all
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "conversations": [
    {
      "_id": "60d5ec49c1234567890abc",
      "participants": [...],
      "isGroup": false,
      "lastMessage": {...},
      "lastMessageTime": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### Get or Create Conversation
```
GET /conversations/:userId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "conversation": {
    "_id": "60d5ec49c1234567890abc",
    "participants": [...],
    "isGroup": false,
    "lastMessage": null,
    "lastMessageTime": null
  }
}
```

### Archive Conversation
```
PUT /conversations/:conversationId/archive
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Conversation archived"
}
```

### Delete Conversation
```
DELETE /conversations/:conversationId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Conversation deleted"
}
```

### Mute Conversation
```
PUT /conversations/:conversationId/mute
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Conversation muted"
}
```

---

## Message Endpoints

### Send Message
```
POST /messages/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversationId": "60d5ec49c1234567890abc",
  "content": "Hello!",
  "media": []
}

Response (201):
{
  "success": true,
  "message": {
    "_id": "60d5ec49c1234567890xyz",
    "conversationId": "60d5ec49c1234567890abc",
    "sender": {...},
    "content": "Hello!",
    "media": [],
    "status": "sent",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

### Get Messages
```
GET /messages/:conversationId?limit=50&skip=0
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "messages": [
    {
      "_id": "60d5ec49c1234567890xyz",
      "conversationId": "60d5ec49c1234567890abc",
      "sender": {...},
      "receiver": {...},
      "content": "Hello!",
      "status": "read",
      "isRead": true,
      "readAt": "2024-01-01T10:05:00Z",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### Edit Message
```
PUT /messages/:messageId
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated message"
}

Response (200):
{
  "success": true,
  "message": {
    "_id": "60d5ec49c1234567890xyz",
    "content": "Updated message",
    "isEdited": true,
    "editedAt": "2024-01-01T10:10:00Z"
  }
}
```

### Delete Message
```
DELETE /messages/:messageId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Message deleted"
}
```

### Add Reaction
```
POST /messages/:messageId/react
Authorization: Bearer <token>
Content-Type: application/json

{
  "emoji": "❤️"
}

Response (200):
{
  "success": true,
  "message": {
    "_id": "60d5ec49c1234567890xyz",
    "reactions": [
      {
        "userId": "60d5ec49c1234567890abc",
        "emoji": "❤️"
      }
    ]
  }
}
```

### Search Messages
```
GET /messages/:conversationId/search?query=hello
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "messages": [...]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please fill all fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Socket.IO Events

### Client Events (Send)

#### user:online
```javascript
socket.emit('user:online', userId);
```

#### conversation:join
```javascript
socket.emit('conversation:join', conversationId);
```

#### message:send
```javascript
socket.emit('message:send', {
  conversationId: '...',
  senderId: '...',
  content: 'Hello!',
  media: []
});
```

#### user:typing
```javascript
socket.emit('user:typing', {
  conversationId: '...',
  userId: '...',
  isTyping: true
});
```

#### message:read
```javascript
socket.emit('message:read', {
  messageId: '...',
  conversationId: '...'
});
```

### Server Events (Receive)

#### message:received
```javascript
socket.on('message:received', (message) => {
  // {
  //   _id: '...',
  //   conversationId: '...',
  //   sender: {...},
  //   content: 'Hello!',
  //   status: 'delivered',
  //   createdAt: '...'
  // }
});
```

#### user:typing
```javascript
socket.on('user:typing', (data) => {
  // {
  //   userId: '...',
  //   isTyping: true
  // }
});
```

#### user:status
```javascript
socket.on('user:status', (data) => {
  // {
  //   userId: '...',
  //   isOnline: true
  // }
});
```

---

## Rate Limiting

All endpoints are rate-limited for security:
- Authentication: 5 requests per minute per IP
- API: 100 requests per minute per user

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Token invalid/missing |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Server-side error |
