# Quick Reference Guide

## Start Here 🚀

### 1. First Time Setup (5 minutes)
```bash
# Read these in order:
1. SETUP.md              <- Step-by-step guide
2. Backend/.env.example  <- Copy and fill .env
3. Run setup.sh or setup.bat
```

### 2. Start Development
```bash
# Terminal 1 - Backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev

# Open: http://localhost:3000
```

### 3. Create Test Accounts
- Open http://localhost:3000 in 2 browser windows
- Create different accounts
- Start messaging!

---

## Project Structure

```
messaging-app/
├── backend/              ← Node.js + Express server
│   ├── config/           ← Database & Cloudinary config
│   ├── models/           ← MongoDB schemas (User, Message, Conversation)
│   ├── controllers/      ← Business logic (auth, users, messages)
│   ├── routes/           ← API endpoints
│   ├── middleware/       ← Auth & error handling
│   ├── utils/            ← Helpers (JWT, validation)
│   ├── server.js         ← Main server file with Socket.IO
│   ├── package.json      ← Dependencies
│   ├── .env.example      ← Template for environment variables
│   └── Dockerfile        ← Docker configuration
│
├── frontend/             ← Next.js + React frontend
│   ├── pages/            ← Next.js pages (index, login, register)
│   ├── components/       ← React components (ChatWindow, ConversationList, etc.)
│   ├── context/          ← State management (AuthContext, ChatContext)
│   ├── utils/            ← API client, Socket.IO, auth service
│   ├── styles/           ← Global CSS & Tailwind
│   ├── public/           ← Static assets
│   ├── package.json      ← Dependencies
│   ├── .env.local.example← Environment variables
│   ├── tailwind.config.js← Tailwind CSS config
│   ├── next.config.js    ← Next.js config
│   └── Dockerfile        ← Docker configuration
│
├── README.md             ← Full documentation
├── SETUP.md              ← Setup instructions (start here!)
├── API_DOCS.md           ← Complete API reference
├── DEPLOYMENT.md         ← Deployment to Vercel/Render
├── TROUBLESHOOTING.md    ← Common issues & solutions
├── docker-compose.yml    ← Docker multi-container setup
└── setup.sh / setup.bat  ← Automated setup script
```

---

## Key Files Explained

### Backend
| File | Purpose |
|------|---------|
| `server.js` | Main Express server with Socket.IO |
| `config/database.js` | MongoDB connection |
| `models/User.js` | User schema (profile, friends, auth) |
| `models/Message.js` | Message schema (content, reactions, status) |
| `models/Conversation.js` | Conversation schema (chat rooms) |
| `controllers/authController.js` | Login, register, auth logic |
| `controllers/messageController.js` | Send, edit, delete messages |
| `routes/authRoutes.js` | `/auth/*` endpoints |
| `routes/messageRoutes.js` | `/messages/*` endpoints |
| `middleware/auth.js` | JWT token verification |

### Frontend
| File | Purpose |
|------|---------|
| `pages/_app.js` | App wrapper with Auth & Chat contexts |
| `pages/index.js` | Main chat interface |
| `pages/login.js` | Login page |
| `pages/register.js` | Sign up page |
| `components/ChatWindow.js` | Message display & input |
| `components/ConversationList.js` | Conversation list sidebar |
| `components/MessageItem.js` | Individual message component |
| `context/AuthContext.js` | Authentication state |
| `context/ChatContext.js` | Messages & conversations state |
| `utils/api.js` | Axios HTTP client |
| `utils/socket.js` | Socket.IO connection |

---

## Common Commands

### Backend
```bash
cd backend

# Development with auto-reload
npm run dev

# Production
npm start

# Install new package
npm install package-name

# Check if running
curl http://localhost:5000/api/health
```

### Frontend
```bash
cd frontend

# Development (hot reload)
npm run dev

# Build for production
npm run build

# Start production build
npm start

# Check for lint errors
npm run lint

# Install new package
npm install package-name
```

### MongoDB
```bash
# View all data in MongoDB Compass
1. Go to mongodb.com/products/compass
2. Download and install
3. Paste your connection string
4. Browse collections visually
5. Create test data
```

### Docker
```bash
# Build and run all services
docker-compose up

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Remove volumes (deletes data)
docker-compose down -v
```

---

## Environment Variables

### Backend `.backend/.env`
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/messaging_app
JWT_SECRET=your_super_secret_key_12345
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
CLOUDINARY_NAME=optional
CLOUDINARY_API_KEY=optional
CLOUDINARY_API_SECRET=optional
```

### Frontend `frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## Features Implemented

### ✅ User Features
- [x] Sign up / Register
- [x] Login / Logout
- [x] User profiles with profile pictures
- [x] Online status & last seen
- [x] Search and add friends
- [x] Block users

### ✅ Messaging
- [x] Real-time text messages (Socket.IO)
- [x] Message status (sent, delivered, read)
- [x] Edit messages
- [x] Delete messages
- [x] Emoji reactions
- [x] Typing indicators
- [x] Message timestamps

### ✅ UI/UX
- [x] Dark/Light mode toggle
- [x] Responsive design (mobile & desktop)
- [x] Chat list on left, messages on right
- [x] Real-time UI updates
- [x] Smooth animations
- [x] Clean Instagram-style interface

### ✅ Technical
- [x] JWT authentication
- [x] Secure password hashing (bcryptjs)
- [x] MongoDB database
- [x] Socket.IO WebSockets
- [x] CORS configured
- [x] Error handling
- [x] Input validation

---

## Features You Can Add

### Easy (1-2 hours)
```
- [ ] Message search by content
- [ ] Emoji picker
- [ ] User settings page
- [ ] Profile edit modal
- [ ] Message grouping by date
- [ ] Unread message counter
- [ ] Mute notifications
```

### Medium (2-4 hours)
```
- [ ] Group chats (multiple participants)
- [ ] Image upload & display
- [ ] Video thumbnail preview
- [ ] Message forwarding
- [ ] Favorite/bookmark messages
- [ ] User online indicator animation
- [ ] Notification badges
```

### Advanced (4+ hours)
```
- [ ] Voice messages (audio recording)
- [ ] File attachment download
- [ ] Video call integration (Twilio/Jitsi)
- [ ] Message encryption (E2EE)
- [ ] Read receipts with timestamps
- [ ] Admin controls & moderation
- [ ] Analytics & usage stats
```

---

## Testing Accounts

After running the app, create accounts with:
- **User 1**: username: `alice`, email: `alice@example.com`, password: `password123`
- **User 2**: username: `bob`, email: `bob@example.com`, password: `password123`

Then open 2 browser windows, login with each account, and message between them!

---

## Deployment Quick Links

### Frontend (Vercel)
1. Push to GitHub
2. Go to vercel.com
3. Import repository → Deploy
4. Set `NEXT_PUBLIC_API_URL` & `NEXT_PUBLIC_SOCKET_URL`

### Backend (Render)
1. Push to GitHub
2. Go to render.com
3. New Web Service → Select repo
4. Set all environment variables
5. Deploy

See `DEPLOYMENT.md` for detailed steps.

---

## Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| MongoDB won't connect | Check connection string & IP whitelist |
| Port 5000 in use | Kill process: `lsof -ti:5000 \| xargs kill -9` |
| Messages not sending | Check both apps are running & browser console |
| Socket.IO fails | Verify CORS_ORIGIN and connection URLs |
| Login fails | Check backend logs, verify email in database |
| Dark mode doesn't work | Verify TailwindCSS config has `darkMode: 'class'` |

See `TROUBLESHOOTING.md` for more fixes.

---

## Production Checklist

Before deploying:
- [ ] Change JWT_SECRET to something random
- [ ] Update CORS_ORIGIN to your domain
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS everywhere
- [ ] Configure MongoDB backup
- [ ] Set up monitoring/logging
- [ ] Test on production-like environment
- [ ] Clear sensitive data from git history
- [ ] Document deployment steps
- [ ] Set up CI/CD pipeline

---

## Support & Documentation

| Document | Purpose |
|----------|---------|
| README.md | Complete feature overview |
| SETUP.md | Step-by-step setup (START HERE) |
| API_DOCS.md | All API endpoints & Socket events |
| DEPLOYMENT.md | Vercel, Render, Railway instructions |
| TROUBLESHOOTING.md | Common issues & solutions |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, React, TailwindCSS |
| Backend | Node.js, Express |
| Real-time | Socket.IO, WebSockets |
| Database | MongoDB |
| Authentication | JWT, bcryptjs |
| Styling | TailwindCSS, CSS3 |
| Icons | React Icons |
| HTTP Client | Axios |
| Cookies | js-cookie |
| Date | date-fns |

---

## File Sizes

- Backend: ~100 KB (code only)
- Frontend: ~200 KB (code only)
- node_modules: ~500 MB (will be deleted: `npm install`)
- MongoDB: Free 512 MB tier included

---

## Getting Started NOW

```bash
# 1. Clone/download project
cd messaging-app

# 2. Backend setup
cd backend
cp .env.example .env
# Edit .env - add your MongoDB URI
npm install
npm run dev

# 3. Frontend setup (new terminal)
cd ../frontend
npm install
npm run dev

# 4. Open browser
# http://localhost:3000

# 5. Create 2 accounts and message!
```

---

**Happy coding! 🚀 Questions? Check the docs or TROUBLESHOOTING.md**
