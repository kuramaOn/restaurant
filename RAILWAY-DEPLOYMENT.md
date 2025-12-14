# 🚂 Railway Deployment Guide

## Step-by-Step Backend & Database Deployment

### Prerequisites
- GitHub account (already have ✅)
- Railway account (free to create)

---

## Part 1: Setup Railway Account

1. **Go to:** https://railway.app
2. **Click:** "Login" or "Start a New Project"
3. **Sign up with GitHub** (recommended - auto-connects your repos)
4. **Verify email** if required

You'll get **$5 free credit** to start!

---

## Part 2: Deploy MySQL Database

### Step 1: Create Database
1. In Railway dashboard, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add MySQL"**
4. Wait for provisioning (~30 seconds)

### Step 2: Get Database Connection String
1. Click on the **MySQL service**
2. Go to **"Variables"** tab
3. Copy the **`DATABASE_URL`** value
   - Format: `mysql://user:password@host:port/database`
4. **Save this!** You'll need it for the backend

---

## Part 3: Deploy Backend (NestJS API)

### Step 1: Create New Project
1. Click **"+ New"** → **"GitHub Repo"**
2. Select your repository: **`kuramaOn/restaurant`**
3. Railway will detect the repo

### Step 2: Configure Root Directory
1. After selecting the repo, click **"Settings"**
2. Scroll to **"Root Directory"**
3. Set to: **`restaurant-system/backend`**
4. Click **"Save"**

### Step 3: Add Environment Variables
1. Go to **"Variables"** tab
2. Click **"+ Add Variable"**
3. Add the following variables:

```
DATABASE_URL = <paste your MySQL connection string from Part 2>
JWT_SECRET = your-super-secret-jwt-key-change-this
NODE_ENV = production
PORT = 3000
CORS_ORIGIN = *
FRONTEND_URL = https://customer-menu-1cih7hgj5-sukiorg0-gmailcoms-projects.vercel.app
```

**Important:** Replace `your-super-secret-jwt-key-change-this` with a random secure string!

### Step 4: Deploy
1. Railway will **auto-detect Dockerfile** and start building
2. Wait for deployment (~3-5 minutes)
3. Check **"Deployments"** tab for status
4. Once complete, you'll see **"Success"** ✅

### Step 5: Get Your Backend URL
1. Go to **"Settings"** tab
2. Scroll to **"Public Networking"**
3. Click **"Generate Domain"**
4. Copy your URL (e.g., `restaurant-backend-production.up.railway.app`)
5. **Save this URL!** You'll need it for frontend apps

---

## Part 4: Initialize Database

### Run Migrations & Seed Data

You have two options:

#### Option A: Using Railway CLI (if installed)
```bash
railway link
cd restaurant-system/backend
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

#### Option B: Using Railway Dashboard
1. Click on your **backend service**
2. Go to **"Deployments"** tab
3. Click the **latest deployment**
4. Click **"View Logs"**
5. Wait for build to complete
6. The Dockerfile should auto-run migrations

If migrations don't run automatically, you'll need to:
1. Install Railway CLI: `npm install -g @railway/cli`
2. Run: `railway login`
3. Run: `railway link` (select your project)
4. Run: `cd restaurant-system/backend`
5. Run: `railway run npx prisma migrate deploy`
6. Run: `railway run npm run prisma:seed`

---

## Part 5: Update Frontend Environment Variables

Now that your backend is deployed, update your Vercel apps:

### For Each Frontend App:
1. Go to: https://vercel.com/sukiorg0-gmailcoms-projects
2. Click on each project (Customer Menu, Admin Panel, etc.)
3. Go to **Settings → Environment Variables**
4. Add these variables:

```
NEXT_PUBLIC_API_URL = https://your-backend.up.railway.app/api
NEXT_PUBLIC_WS_URL = wss://your-backend.up.railway.app
```

**Replace** `your-backend.up.railway.app` with your actual Railway URL!

5. Click **"Save"**
6. Go to **"Deployments"** tab
7. Click **"..."** on latest deployment → **"Redeploy"**

Repeat for all 4 apps:
- ✅ Customer Menu
- ✅ Admin Panel  
- ✅ Kitchen Display
- ✅ Cashier Terminal

---

## Part 6: Test Your Deployment

### 1. Test Backend API
Open in browser:
```
https://your-backend.up.railway.app/api/menu/items
```

Should return JSON with menu items.

### 2. Test Frontend Login
1. Go to Admin Panel: https://admin-panel-johx3yie0-sukiorg0-gmailcoms-projects.vercel.app/login
2. Login with:
   - Email: `admin@restaurant.com`
   - Password: `admin123`
3. Should successfully login and redirect to dashboard!

### 3. Test Order Flow
1. Open Customer Menu
2. Add items to cart
3. Place an order
4. Check Kitchen Display - order should appear!
5. Process payment in Cashier Terminal

---

## 💰 Pricing Information

### Free Tier Includes:
- ✅ $5 free credit (good for ~1 month)
- ✅ 512MB RAM per service
- ✅ 1GB disk space
- ✅ Unlimited projects
- ✅ Auto SSL certificates

### After Free Credit:
- Backend: ~$5-10/month
- Database: ~$5-10/month
- **Total: ~$10-20/month**

Much cheaper than separate hosting!

---

## 🔧 Troubleshooting

### "Build Failed"
- Check **"Deployments"** → **"View Logs"**
- Common issues:
  - Missing environment variables
  - Wrong root directory
  - Docker build errors

### "DATABASE_URL not found"
- Make sure you copied the full connection string from MySQL service
- Format should be: `mysql://user:password@host:port/database`

### "CORS Error" in Frontend
- Update `CORS_ORIGIN` in backend env variables
- Add your Vercel URLs or use `*` for testing

### "Port already in use"
- Railway auto-detects port from `PORT` env variable
- Make sure backend uses `process.env.PORT || 3000`

---

## 📊 Railway Dashboard Overview

### Services You'll Have:
```
┌─────────────────────────────────────┐
│  🗄️  MySQL Database                 │
│  URL: mysql://...railway.app        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  🔧 Backend API (NestJS)            │
│  URL: https://...railway.app        │
└─────────────────────────────────────┘
```

---

## 🎯 Quick Start Commands

If you have Railway CLI installed:

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations
cd restaurant-system/backend
railway run npx prisma migrate deploy

# Seed database
railway run npm run prisma:seed

# View logs
railway logs

# Open in browser
railway open
```

---

## 📝 What's Next After Deployment?

1. ✅ Custom domain (optional) - Configure in Railway Settings
2. ✅ Monitoring - Railway provides built-in metrics
3. ✅ Backups - Railway auto-backups your database
4. ✅ Scaling - Upgrade plan if needed
5. ✅ CI/CD - Auto-deploy on git push (already enabled!)

---

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Your repo: https://github.com/kuramaOn/restaurant

---

**Ready to deploy? Follow the steps above and let me know if you need help!** 🚀
