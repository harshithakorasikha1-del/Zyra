# Setup Guide - Messaging App

## Quick Start (5 minutes)

### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org))
- MongoDB Account ([Create Free Account](https://www.mongodb.com/cloud/atlas))
- Code Editor (VS Code recommended)

## Step-by-Step Setup

### 1. MongoDB Setup (2 minutes)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up with Google (easiest)
3. Create a project
4. Create a cluster (select "M0 Shared")
5. Create a database user (save username & password)
6. Get connection string: Cluster → Connect → Copy connection string
7. Replace `<password>` with your database password

Example (your values):
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/messaging_app?retryWrites=true&w=majority
```

### 2. Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` and add:
```
MONGODB_URI=mongodb+srv://your_user:your_password@cluster0.abc123.mongodb.net/messaging_app?retryWrites=true&w=majority
JWT_SECRET=MySuperSecretKey123456!
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### 3. Start Backend

```bash
npm run dev
```

You should see: `Server running on port 5000`

### 4. Frontend Setup (1 minute)

In a new terminal:
```bash
cd frontend

# Install dependencies
npm install
```

The `.env.local` file is already configured for local development.

### 5. Start Frontend

```bash
npm run dev
```

You should see: `Application running! http://localhost:3000`

### 6. Test the App

1. Open http://localhost:3000
2. Click "Sign Up"
3. Create account with:
   - Username: `testuser1`
   - Email: `test1@example.com`
   - Password: `password123`
4. Open another browser/window
5. Create second account:
   - Username: `testuser2`
   - Email: `test2@example.com`
   - Password: `password123`
6. Start messaging!

## Common Issues & Solutions

### "Cannot connect to MongoDB"
- Check connection string in `.env`
- Verify password is correct
- Make sure MongoDB Atlas cluster is running
- Check IP whitelist (allow all: `0.0.0.0/0`)

### "Port 5000 already in use"
```bash
# Kill process on port 5000
# On Windows Command Prompt:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### "Module not found" error
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Messages not sending
- Check browser console (F12)
- Ensure both backend and frontend are running
- Reload the page
- Check network tab in DevTools

## File Structure Overview

```
messaging-app/
├── backend/
│   ├── server.js          ← Main server file
│   ├── package.json       ← Dependencies
│   ├── .env               ← Environment (create this)
│   ├── config/
│   │   └── database.js    ← MongoDB connection
│   ├── models/            ← Database schemas
│   ├── controllers/       ← Business logic
│   ├── routes/            ← API endpoints
│   └── middleware/        ← Auth & errors
│
└── frontend/
    ├── pages/             ← Next.js pages
    │   ├── index.js       ← Main chat page
    │   ├── login.js       ← Login page
    │   └── register.js    ← Signup page
    ├── components/        ← React components
    ├── context/           ← State management
    ├── utils/             ← API & socket utilities
    ├── package.json       ← Dependencies
    └── .env.local         ← Config (already set up)
```

## Next Steps

### Deploy to Production

#### Option 1: Free Hosting (Recommended for testing)

**Frontend on Vercel:**
1. Push code to GitHub
2. Go to vercel.com → Import repository
3. Deploy (takes 1 minute)

**Backend on Render:**
1. Push code to GitHub
2. Go to render.com → New Web Service
3. Select repository, set environment variables, deploy

See README.md for detailed deployment instructions.

### Add More Features

- ✅ Group chats
- ✅ File uploads
- ✅ Voice messages
- ✅ Video calls
- ✅ Message encryption

## Environment Variables Reference

### Backend (.env)
```
# Database
MONGODB_URI=             # MongoDB connection string (required)

# Security
JWT_SECRET=              # Secret key for JWT (required)

# Server
PORT=5000                # Server port
NODE_ENV=development     # development|production

# URLs
FRONTEND_URL=http://localhost:3000  # Frontend domain
CORS_ORIGIN=http://localhost:3000   # Allowed origins

# Media (Optional)
CLOUDINARY_NAME=         # Cloudinary name for image uploads
CLOUDINARY_API_KEY=      # Cloudinary API key
CLOUDINARY_API_SECRET=   # Cloudinary API secret
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api         # Backend API
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000          # WebSocket URL
```

## For Production

### Security Checklist
- [ ] Change JWT_SECRET to something random
- [ ] Use strong MongoDB password
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Use environment-specific CORS_ORIGIN
- [ ] Enable MongoDB IP whitelist
- [ ] Use production API URLs in frontend

### Performance Tips
- [ ] Enable caching
- [ ] Compress responses (gzip)
- [ ] Use CDN for static assets
- [ ] Optimize database queries
- [ ] Set up monitoring and logging

## Additional Commands

```bash
# Backend
npm run dev              # Development mode with hot reload
npm start                # Production mode

# Frontend
npm run dev              # Development mode
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Check code quality
```

## Getting Help

1. Check server logs (terminal) for errors
2. Check browser console (F12 → Console)
3. Check Network tab for failed requests
4. Review README.md for more details
5. Check MongoDB Atlas status

---

**Happy messaging! 🚀**
