# Deployment Guide

## Table of Contents
1. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Backend Deployment (Railway)](#backend-deployment-railway)
4. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
5. [Production Checklist](#production-checklist)

---

## Frontend Deployment (Vercel)

Vercel is the creator of Next.js and offers the easiest deployment experience.

### Step 1: Prepare Frontend

```bash
cd frontend
# Ensure everything works locally
npm run build
```

### Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/messaging-app.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Sign In" with GitHub
3. Click "Add New ..." → "Project"
4. Select your repository
5. Configure project:
   - **Framework**: Next.js
   - **Root Directory**: `./frontend`
6. Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.com/api
   NEXT_PUBLIC_SOCKET_URL=https://your-backend.com
   ```
   (Update these after backend is deployed)
7. Click "Deploy"

### Step 4: Update Backend URL

After backend is deployed:
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Update:
   - `NEXT_PUBLIC_API_URL=https://your-backend.com/api`
   - `NEXT_PUBLIC_SOCKET_URL=https://your-backend.com`
5. Click "Save and Redeploy"

**Your frontend is now live at**: `https://<your-project>.vercel.app`

---

## Backend Deployment (Render)

### Step 1: Prepare Backend

```bash
cd backend

# Ensure everything works locally
npm test # (if you have tests)
```

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Backend ready for deployment"
git push origin main
```

### Step 3: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (easiest)
3. Grant access to your repositories

### Step 4: Deploy Backend

1. Click "New +" → "Web Service"
2. Select your repository
3. Configure:
   - **Name**: `messaging-app-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: 
     ```
     npm install
     ```
   - **Start Command**: 
     ```
     npm start
     ```
4. Copy your service URL (e.g., `https://messaging-app-backend.onrender.com`)

### Step 5: Add Environment Variables

In Render dashboard:
1. Go to your Web Service
2. Click "Environment"
3. Add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/messaging_app?retryWrites=true&w=majority

JWT_SECRET=(generate a secure random string)
- Go to: https://www.random.org/strings/
- Generate a string and paste it here

PORT=10000

NODE_ENV=production

FRONTEND_URL=https://your-vercel-domain.vercel.app

CORS_ORIGIN=https://your-vercel-domain.vercel.app

CLOUDINARY_NAME=(optional)
CLOUDINARY_API_KEY=(optional)
CLOUDINARY_API_SECRET=(optional)
```

4. Click "Save Changes"
5. Render will auto-redeploy

**Your backend is now live at**: `https://messaging-app-backend.onrender.com`

---

## Backend Deployment (Railway)

Alternative to Render with similar features.

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Grant repository access

### Step 2: Create New Project

1. Click "New Project"
2. Select "GitHub Repository"
3. Select your messaging-app repository
4. Select `backend` folder (or configure later)

### Step 3: Configure Deployment

1. Click "Deploy" and wait for initial setup
2. Go to project Settings
3. Set **Root Directory** to `backend`

### Step 4: Add Environment Variables

1. Go to Variables tab
2. Add all the same variables as Render (see above)
3. Save

3. Railway will auto-deploy

**Your backend is now live at**: `https://<your-service>.railway.app`

---

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Start Free"
3. Sign Up (use Google for faster signup)

### Step 2: Create Cluster

1. Create a project (name it "messaging-app")
2. Create a cluster:
   - Select "Shared" (free tier)
   - Choose a region close to you
   - Click "Create Cluster"
3. Wait 3-5 minutes for creation

### Step 3: Create Database User

1. Click "Database Access"
2. Click "Add New Database User"
3. Create username and password (save these!)
4. Click "Add User"

### Step 4: Get Connection String

1. Click "Connect" on your cluster
2. Select "Drivers"
3. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace:
   - `username` with your DB username
   - `password` with your DB password
   - Add database name: `...mongodb.net/messaging_app?...`

### Step 5: Whitelist IP Address

1. Click "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (for development)
   - For production, use your server's IP
4. Click "Confirm"

### Step 6: Use Connection String

Add to your backend environment variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/messaging_app?retryWrites=true&w=majority
```

---

## Production Checklist

### Before Going Live

- [ ] **Database**
  - [ ] MongoDB cluster created and verified
  - [ ] Database user created with strong password
  - [ ] Connection string in environment variables
  - [ ] IP whitelist configured (production IP)

- [ ] **Backend**
  - [ ] All environment variables set
  - [ ] JWT_SECRET is strong and random
  - [ ] CORS_ORIGIN matches frontend domain
  - [ ] NODE_ENV=production
  - [ ] Error handling tested
  - [ ] Logging enabled

- [ ] **Frontend**
  - [ ] Environment variables updated with production URLs
  - [ ] API endpoints updated
  - [ ] Socket URL updated
  - [ ] Build succeeds without errors
  - [ ] No console errors in production

- [ ] **Security**
  - [ ] HTTPS enabled everywhere
  - [ ] API keys not committed to git
  - [ ] JWT secret is secure
  - [ ] CORS properly configured
  - [ ] Rate limiting enabled
  - [ ] Input validation enabled

- [ ] **Performance**
  - [ ] Frontend builds and loads quickly
  - [ ] Backend responds promptly
  - [ ] Database queries optimized
  - [ ] Compression enabled (gzip)
  - [ ] Caching implemented

- [ ] **Monitoring**
  - [ ] Render/Railway monitoring enabled
  - [ ] Error tracking set up
  - [ ] Logs accessible
  - [ ] Uptime monitoring enabled
  - [ ] Alert notifications set up

### Domain Setup (Optional)

To use a custom domain instead of vercel.app or onrender.com:

1. Buy domain from Namecheap, GoDaddy, etc.
2. Vercel: Add domain in project settings
3. Railway/Render: Add custom domain in settings
4. Update DNS records as instructed
5. Wait 24-48 hours for propagation

### DNS Configuration Example

For `messaging.yourcompany.com`:

**For Vercel Frontend:**
```
CNAME: www  →  cname.vercel-dns.com
```

**For Render Backend:**
```
CNAME: api  →  your-service.onrender.com
```

Then update frontend variables:
```
NEXT_PUBLIC_API_URL=https://api.yourcompany.com/api
NEXT_PUBLIC_SOCKET_URL=https://api.yourcompany.com
```

---

## Rolling Back Deployments

### Vercel
1. Deployments tab
2. Select previous deployment
3. Click "Redeploy"

### Render/Railway
1. Deployments tab
2. Click previous deployment
3. Click "Redeploy"

---

## Troubleshooting Deployment

### Frontend Won't Build
```bash
# Check locally
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### Backend Won't Start
```bash
# Check logs in Render/Railway dashboard
# Verify all environment variables are set
# Test database connection
```

### Socket.IO Connection Fails
- Verify backend is running
- Check CORS_ORIGIN in backend env
- Verify frontend has correct socket URL
- Check firewall/network settings

### High Memory Usage
- Check for memory leaks in code
- Monitor database queries
- Consider upgrading plan
- Optimize images and assets

### Slow Response Times
- Check database indexes
- Add caching headers
- Enable gzip compression
- Monitor slow queries
- Upgrade server resources

---

## Cost Estimation (Free Tier)

| Service | Cost |
|---------|------|
| Vercel (Frontend) | Free (up to 100GB/month) |
| Render (Backend) | Free (spins down after 15 min inactivity) |
| Railway | $5 credit/month + usage |
| MongoDB Atlas | Free (up to 512MB) |

**Total for small project**: **$0-5/month**

---

## Next Steps

1. Deploy frontend to Vercel
2. Deploy backend to Render
3. Test all features work in production
4. Set up monitoring and logging
5. Configure custom domain (optional)
6. Enable SSL/HTTPS (automatic)
7. Set up backups for database
8. Plan scaling strategy

---

For questions or issues, check the README.md or API_DOCS.md files.
