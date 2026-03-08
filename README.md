# Instagram-Style Messaging Web App

A complete, fully-functional real-time messaging application inspired by Instagram's chat feature. Built with modern web technologies, it supports multiple users, real-time messaging, media sharing, and rich features for an engaging messaging experience.

## 🚀 Features

### User Features
- ✅ **User Authentication**: Sign up, login, logout
- ✅ **User Profiles**: Username, profile picture, online status
- ✅ **Contacts/Friends**: Add, remove, and search for friends
- ✅ **Real-Time Messaging**: Instant text messages using WebSockets
- ✅ **Message Status**: Sent, delivered, read indicators
- ✅ **Typing Indicators**: See when someone is typing
- ✅ **Message Management**: Edit and delete messages
- ✅ **Message Reactions**: Add emoji reactions to messages
- ✅ **Dark/Light Mode**: Toggle between themes
- ✅ **Online Status**: See who's online and last seen time
- ✅ **Responsive Design**: Works on desktop and mobile

### Technical Stack
- **Frontend**: Next.js with React, TailwindCSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Real-Time**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: TailwindCSS + Custom CSS

## 📋 Prerequisites

Before getting started, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas cloud)
- Git

## 🏗️ Project Structure

```
messaging-app/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── cloudinary.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Conversation.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── messageController.js
│   │   └── conversationController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── messageRoutes.js
│   │   └── conversationRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── validation.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── pages/
    │   ├── _app.js
    │   ├── _document.js
    │   ├── index.js
    │   ├── login.js
    │   └── register.js
    ├── components/
    │   ├── ChatWindow.js
    │   ├── ConversationList.js
    │   ├── MessageItem.js
    │   ├── Header.js
    │   └── ThemeToggle.js
    ├── context/
    │   ├── AuthContext.js
    │   └── ChatContext.js
    ├── utils/
    │   ├── api.js
    │   ├── socket.js
    │   ├── authService.js
    ├── styles/
    │   └── globals.css
    ├── public/
    ├── package.json
    ├── tailwind.config.js
    ├── next.config.js
    └── .env.local.example
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd messaging-app
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Variables
Create a `.env` file in the `backend` directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Then edit `.env` and add your values:
```
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/messaging_app?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server
PORT=5000
NODE_ENV=development

# Cloudinary (optional for media - get free account at cloudinary.com)
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3000
```

#### MongoDB Setup (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Create a database user with password
5. Get the connection string and replace in `.env`

#### Start Backend Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Environment Variables
Create a `.env.local` file in the `frontend` directory:

```bash
cp .env.local.example .env.local
```

The default values should work:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

#### Start Frontend Development Server
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Testing the App

1. Open [http://localhost:3000](http://localhost:3000)
2. Create a new account or use demo credentials
3. Open another browser/incognito window and create a second account
4. Start messaging between accounts!

**Demo Credentials** (after creating first account):
- Email: test@example.com
- Password: password123

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile/update` - Update user profile
- `GET /api/users/search/users?query=` - Search users
- `POST /api/users/friend/add` - Add friend
- `POST /api/users/friend/accept` - Accept friend request
- `GET /api/users/friends/all` - Get all friends
- `POST /api/users/friend/remove` - Remove friend
- `POST /api/users/user/block` - Block user

### Messages
- `POST /api/messages/send` - Send message
- `GET /api/messages/:conversationId` - Get messages
- `PUT /api/messages/:messageId` - Edit message
- `DELETE /api/messages/:messageId` - Delete message
- `POST /api/messages/:messageId/react` - Add reaction
- `GET /api/messages/:conversationId/search?query=` - Search messages

### Conversations
- `GET /api/conversations/all` - Get all conversations
- `GET /api/conversations/:userId` - Get or create conversation with user
- `PUT /api/conversations/:conversationId/archive` - Archive conversation
- `DELETE /api/conversations/:conversationId` - Delete conversation
- `PUT /api/conversations/:conversationId/mute` - Mute conversation

## 🔌 Socket.IO Events

### Client to Server
- `user:online` - User comes online
- `conversation:join` - Join conversation room
- `conversation:leave` - Leave conversation room
- `message:send` - Send message
- `user:typing` - Typing indicator
- `message:read` - Mark message as read

### Server to Client
- `message:received` - Receive new message
- `user:typing` - User typing indicator
- `message:read` - Message read receipt
- `user:status` - User online/offline status

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project" and select your repository
4. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.com/api
   NEXT_PUBLIC_SOCKET_URL=https://your-backend.com
   ```
5. Click "Deploy"

### Backend Deployment (Render or Railway)

#### Using Render:
1. Push code to GitHub
2. Go to [Render](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: `messaging-app-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables:
   ```
   MONGODB_URI=your_connection_string
   JWT_SECRET=your_secret
   CORS_ORIGIN=https://your-vercel-domain.com
   PORT=10000 (or as Render suggests)
   ```
7. Click "Create Web Service"

#### Using Railway:
1. Go to [Railway](https://railway.app)
2. Click "New Project" → "GitHub Repo"
3. Select your repository
4. Add environment variables
5. Deploy

### Update Frontend API URLs

After deployment, update `.env.local` in frontend:
```
NEXT_PUBLIC_API_URL=https://your-backend.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend.com
```

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env` files. Always use `.env.example`
2. **JWT Secret**: Use a strong, random secret key in production
3. **CORS**: Configure CORS properly for your domain
4. **Password Hashing**: Passwords are hashed with bcryptjs
5. **Token Expiration**: Tokens expire after 30 days
6. **HTTPS**: Always use HTTPS in production

## 🐛 Troubleshooting

### Connection Issues
- Make sure backend is running on port 5000
- Check CORS settings in `server.js`
- Verify MongoDB connection string

### Socket.IO Connection Fails
- Clear browser cache and cookies
- Check firewall settings
- Ensure both servers are running

### Messages Not Sending
- Check browser console for errors
- Verify authentication token is valid
- Ensure conversation ID is correct

### MongoDB Connection Error
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

## 📚 Additional Features You Can Add

1. **Group Chats**: Modify Conversation model to support multiple participants
2. **Voice Messages**: Add audio recording and playback
3. **Video Calls**: Integrate WebRTC or Twilio
4. **Media Upload**: Integrate Cloudinary for image/video uploads
5. **Notifications**: Add browser push notifications
6. **Message Search**: Full-text search across all messages
7. **User Presence**: Activity status and last seen
8. **Private/Public Chats**: Add privacy settings
9. **Emoji Support**: Full emoji picker integration
10. **Message Encryption**: End-to-End encryption (E2EE)

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console for errors
4. Review backend server logs

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

**Built with ❤️ using Node.js, React, and Socket.IO**
