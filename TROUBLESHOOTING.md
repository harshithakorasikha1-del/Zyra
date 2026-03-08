# Troubleshooting Guide

*Common issues and their solutions*

## General Issues

### "Cannot find module" error
**Symptom**: Error like `Cannot find module 'express'`

**Solutions**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or clear npm cache
npm cache clean --force
npm install
```

### Port already in use
**Symptom**: `EADDRINUSE: address already in use :::5000`

**Windows**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=5001
```

**Mac/Linux**:
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
PORT=5001
```

### Node version issues
**Symptom**: Compatibility errors with npm packages

**Solution**:
```bash
# Check current version
node --version

# Update Node.js from nodejs.org or:
# macOS with Homebrew
brew upgrade node

# Windows with Chocolatey
choco upgrade nodejs

# Use Node Version Manager (nvm)
nvm install 18
nvm use 18
```

---

## Backend Issues

### MongoDB Connection Error

**Symptom**: 
```
MongoNetworkError: connect ENOTFOUND cluster0.mongodb.net
```

**Solutions**:
1. Check connection string format:
   ```
   mongodb+srv://username:password@cluster0.abc123.mongodb.net/messaging_app?retryWrites=true&w=majority
   ```
   
2. Verify credentials:
   - Username and password are correct
   - No special characters causing issues (@ needs to be URL encoded)
   - If password has special chars, encode it: `password123` = `password123`, `p@ss!word` = `p%40ss%21word`

3. Check IP Whitelist in MongoDB Atlas:
   - Go to Network Access
   - Add your IP: `0.0.0.0/0` for development
   - For production, add specific server IP

4. Verify database exists:
   - Go to Databases in MongoDB Atlas
   - Create database if it doesn't exist
   - Name it `messaging_app`

5. Connection timeout:
   ```bash
   # Add timeout to connection string
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/messaging_app?retryWrites=true&w=majority&serverSelectionTimeoutMS=5000
   ```

6. Try using MongoDB Compass (GUI):
   - Download from mongodb.com/products/compass
   - Test connection string
   - If it fails, the connection string is wrong

### Backend won't start

**Symptom**: Server doesn't start or crashes immediately

**Solutions**:
1. Check environment variables:
   ```bash
   # Verify all required env vars are set
   echo $MONGODB_URI
   echo $JWT_SECRET
   ```

2. Check for syntax errors:
   ```bash
   # Run without nodemon
   node server.js
   ```

3. Check logs more carefully:
   ```bash
   # Run with more verbose output
   DEBUG=* npm run dev
   ```

4. Verify port isn't blocked:
   ```bash
   # Try different port
   PORT=5001 npm run dev
   ```

### Socket.IO connection fails on backend

**Symptom**: WebSocket connection error in console

**Solutions**:
1. Verify CORS is configured:
   ```javascript
   // Check server.js has correct CORS
   const io = socketIO(server, {
     cors: {
       origin: process.env.CORS_ORIGIN,
       methods: ['GET', 'POST']
     }
   });
   ```

2. Check frontend is using correct Socket URL:
   ```javascript
   // In utils/socket.js
   const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL; // Should be http://localhost:5000
   ```

3. Check firewall allows WebSocket:
   - Port 5000 should be open
   - Try passing `--allow-public` flag

---

## Frontend Issues

### Blank page or "Loading..." doesn't go away

**Symptom**: Frontend loads but stays blank or on loading screen

**Solutions**:
1. Check browser console (F12):
   - Look for errors
   - Check Network tab for failed requests
   - Check if API calls are succeeding

2. Check backend is running:
   ```bash
   # Try accessing backend directly (should return JSON)
   curl http://localhost:5000/api/health
   ```

3. Verify .env.local is correct:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

4. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

5. Hard reload browser: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

### API calls returning 401 (Unauthorized)

**Symptom**: Login works but other pages show 401 error

**Solutions**:
1. Token not being sent:
   ```javascript
   // Check utils/api.js includes token in header
   api.interceptors.request.use((config) => {
     const token = Cookies.get('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

2. Token expired:
   - Clear cookies: `Ctrl+Shift+Delete`
   - Log in again
   - Check token expiration time

3. Invalid token format:
   - Token should start with `eyJ...`
   - Check Bearer prefix is included: `Bearer <token>`

4. Backend JWT secret changed:
   - All tokens become invalid
   - Users must log in again

### Messages not appearing

**Symptom**: Send message but nothing happens

**Solutions**:
1. Check browser console for errors (F12)

2. Verify Socket.IO connection:
   ```javascript
   // In console
   const socket = getSocket();
   console.log('Socket connected:', socket.connected);
   ```

3. Check messages are being saved:
   - Open MongoDB Compass
   - Check `messages` collection
   - Verify record exists

4. Ensure conversation exists:
   ```javascript
   // Check ChatContext has currentConversation set
   console.log('Current conversation:', currentConversation);
   ```

5. Check network tab:
   - Verify POST to `/messages/send` succeeds (201 status)
   - Verify Socket events are emitted

### Dark mode not working

**Symptom**: Dark mode toggle doesn't change theme

**Solutions**:
1. Check localStorage is enabled in browser
2. Verify theme script runs:
   ```javascript
   // Should be in _app.js
   useEffect(() => {
     const savedTheme = localStorage.getItem('theme');
     if (savedTheme === 'dark') {
       document.documentElement.classList.add('dark');
     }
   }, []);
   ```

3. Verify TailwindCSS dark mode config:
   ```javascript
   // tailwind.config.js
   module.exports = {
     darkMode: 'class',
     // ...
   }
   ```

4. Hard refresh browser cache

### Build errors

**Symptom**: `npm run build` fails

**Solutions**:
1. Check for TypeScript errors:
   ```bash
   npm run lint
   ```

2. Delete .next folder:
   ```bash
   rm -rf .next
   npm run build
   ```

3. Check Next.js version compatibility:
   ```bash
   npm list next
   # Should be ^14.0.0 or compatible version
   ```

---

## Authentication Issues

### "Invalid email or password" on login

**Symptom**: Correct credentials but login fails

**Solutions**:
1. Verify account exists in database:
   ```
   # In MongoDB Compass
   - Database: messaging_app
   - Collection: users
   - Search for email
   ```

2. Check password hashing works:
   ```bash
   # Test locally with bcrypt
   node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('password123', 10));"
   ```

3. Ensure backend receives request:
   - Check Network tab shows POST to `/auth/login`
   - Check backend logs
   - Verify request body is JSON

4. Check database connection works:
   ```bash
   # Test connection string in separate script
   const mongoose = require('mongoose');
   mongoose.connect(process.env.MONGODB_URI);
   ```

### Token not saving

**Symptom**: Login succeeds but not logged in on refresh

**Solutions**:
1. Check cookies are being saved:
   ```javascript
   // In browser console
   document.cookie; // Should show 'token=...'
   ```

2. Verify `js-cookie` is working:
   ```javascript
   // In console
   Cookies.set('test', 'value');
   Cookies.get('test');
   ```

3. Check secure cookie settings:
   ```javascript
   // Make sure production doesn't use secure flag in dev
   Cookies.set('token', token, { /* no secure flag for localhost */ });
   ```

### Friend requests not working

**Symptom**: Can't add friends or see friend requests

**Solutions**:
1. Both users should exist in database
2. Can't add yourself as friend (check user ID comparison)
3. Check `friend/add` endpoint returns 200 status
4. Verify database saves friend data:
   ```
   # In MongoDB
   - Check friendRequests field in User collection
   ```

---

## Real-time Issues

### Messages delay or don't update in real-time

**Symptom**: Messages appear after F5 or take long time

**Solutions**:
1. Check Socket.IO bridge:
   ```bash
   # Backend logs should show "New user connected"
   # And "User joined conversation"
   ```

2. Verify Socket events:
   ```javascript
   // Check if emit events work
   const socket = getSocket();
   socket.emit('test-event', {data: 'test'});
   // Check backend receives
   ```

3. Check conversation is correct:
   ```javascript
   // Verify currentConversation._id matches message.conversationId
   ```

4. Ensure both users joined room:
   ```javascript
   // Both should emit conversation:join with same conversationId
   ```

5. Slow database queries:
   - Check MongoDB indexes
   - Monitor query performance
   - Consider pagination for older messages

### Typing indicator doesn't work

**Symptom**: No "User is typing..." indicator

**Solutions**:
1. Check backend emits typing event:
   ```javascript
   socket.on('user:typing', (data) => {
     io.to(`conversation:${conversationId}`).emit('user:typing', data);
   });
   ```

2. Verify frontend handles event:
   ```javascript
   socket.on('user:typing', (data) => {
     setIsTyping(data.isTyping);
   });
   ```

3. Check throttling isn't preventing emit:
   - Add debounce to typing event
   - Verify frequent emissions

### Offline/Online status wrong

**Symptom**: Users show as online when offline

**Solutions**:
1. Check `user:online` event is emitted on connect:
   ```javascript
   // In utils/socket.js
   socket.emit('user:online', userId);
   ```

2. Verify disconnect handler:
   ```javascript
   socket.on('disconnect', async () => {
     // Update user.isOnline = false in database
   });
   ```

3. Check database updates:
   ```
   # Verify lastSeen and isOnline fields update in MongoDB
   ```

---

## Performance Issues

### Slow message loading

**Solutions**:
1. Add pagination (limit=50 by default):
   ```bash
   GET /messages/:conversationId?limit=30&skip=0
   ```

2. Add database index:
   ```javascript
   // In Message model
   messageSchema.index({ conversationId: 1, createdAt: -1 });
   ```

3. Cache older messages on client:
   - Don't re-fetch 1000+ messages
   - Load in chunks of 50

### High CPU usage

**Solutions**:
1. Check for memory leaks:
   - Monitor Node process
   - Look for growing memory usage

2. Reduce update frequency:
   - Don't emit events too often
   - Add debouncing/throttling

3. Optimize database queries:
   - Check slow query log
   - Add proper indexes

### Frontend slow

**Solutions**:
1. Optimize renders:
   ```javascript
   // Use React.memo for MessageItem
   export default React.memo(MessageItem);
   ```

2. Reduce re-renders:
   ```javascript
   // Use useCallback for event handlers
   const handleSend = useCallback(() => { ... }, []);
   ```

3. Code split:
   ```javascript
   const ChatWindow = dynamic(() => import('./ChatWindow'));
   ```

---

## Deployment Issues

### Can't connect to MongoDB in production

**Solutions**:
1. Check IP whitelist:
   - MongoDB Atlas → Network Access
   - Add server IP address
   - Or allow `0.0.0.0/0` (not recommended for production)

2. Connection string format:
   ```
   mongodb+srv://user:pass@cluster.mongodb.net/messaging_app?retryWrites=true&w=majority
   ```

3. Environment variables:
   - Verify set in production platform
   - Check for typos
   - Ensure not in .env (should be in platform settings)

### Frontend shows CORS error

**Symptom**: `No 'Access-Control-Allow-Origin' header`

**Solutions**:
1. Update CORS_ORIGIN:
   ```
   # In backend .env or production settings
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

2. Reload/redeploy backend

### Vercel deployment fails

**Solutions**:
1. Check build logs:
   - Click deployment
   - Go to "Logs"
   - Look for errors

2. Common issues:
   ```bash
   # Clear build cache
   # In Vercel: Settings → Git → Clear Cache
   
   # Check next.config.js
   # Remove React strict mode if causing issues
   ```

3. Environment variables:
   - Verify all needed vars are set
   - Check for typos

---

## Debug Tips

### View Backend Logs

```bash
# With timestamps
npm run dev 2>&1 | tee backend.log

# Check specific errors
grep "error" backend.log
grep "ERROR" backend.log
```

### View Frontend Errors

```
Browser Console: F12 → Console
Network Tab: F12 → Network → Filter by XHR/Fetch
Application: F12 → Application → Cookies/LocalStorage
```

### Test API Directly

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get conversations with token
curl -X GET http://localhost:5000/api/conversations/all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Monitor Database

```
# Using MongoDB Compass (GUI tool)
# Download from mongodb.com/products/compass
# Connect with your connection string
# Browse collections in real-time
```

---

## Getting More Help

1. **Check Documentation**:
   - README.md - General overview
   - API_DOCS.md - API endpoints
   - SETUP.md - Setup instructions
   - DEPLOYMENT.md - Deployment guide

2. **Search Issues**: Google the error message

3. **Stack Overflow**: Tag with [node.js] [mongodb] [socket.io]

4. **Official Docs**:
   - Express: expressjs.com
   - Next.js: nextjs.org
   - Socket.IO: socket.io
   - MongoDB: mongodb.com/docs

5. **Community**: GitHub Discussions or Reddit

---

**Remember**: Most issues have simple solutions - check error messages carefully and follow the steps systematically! 🚀
