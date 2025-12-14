# 🎨 Render Deployment Guide

## Quick Deployment via Web Interface

Render doesn't have a CLI for deployment, but their web interface is very user-friendly!

---

## 🚀 Step-by-Step Deployment

### Step 1: Create Render Account

1. Go to: https://render.com
2. Click **"Get Started"** or **"Sign Up"**
3. **Sign up with GitHub** (recommended - auto-connects repos)
4. Authorize Render to access your GitHub

---

### Step 2: Deploy Backend API

#### 2.1 Create New Web Service
1. In Render Dashboard, click **"New +"** (top right)
2. Select **"Web Service"**

#### 2.2 Connect Repository
1. Click **"Connect a repository"**
2. If you don't see your repo:
   - Click **"Configure account"**
   - Select repositories to give Render access
   - Choose: **`kuramaOn/restaurant`**
3. Click **"Connect"** next to your repository

#### 2.3 Configure Web Service
Fill in the following:

**Basic Settings:**
```
Name: restaurant-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: restaurant-system/backend
```

**Build Settings:**
```
Environment: Docker
Docker Command: (leave empty, uses Dockerfile)
```

**Advanced Settings - Environment Variables:**
Click **"Add Environment Variable"** and add these:

```
NODE_ENV = production
PORT = 3000
JWT_SECRET = your-super-secret-jwt-key-here-change-this
CORS_ORIGIN = *
```

**For DATABASE_URL:** We'll add this after creating the database (Step 3)

**Instance Type:**
```
Free (512 MB RAM, enough for testing)
```

#### 2.4 Create Service
- Click **"Create Web Service"**
- Render will start building (takes 3-5 minutes)
- Watch the logs for any errors

---

### Step 3: Create MySQL Database

Unfortunately, **Render only offers PostgreSQL databases** natively. You have two options:

#### Option A: Use Railway for MySQL Database (Recommended)
1. Go to: https://railway.app
2. Create account and new project
3. Add MySQL database
4. Copy the `DATABASE_URL`
5. Add it to Render backend environment variables

#### Option B: Use PlanetScale for MySQL (Free Tier)
1. Go to: https://planetscale.com
2. Create account
3. Create new database: `restaurant-db`
4. Get connection string
5. Add it to Render backend environment variables

#### Option C: Convert to PostgreSQL (Requires code changes)
If you want everything on Render, you'd need to:
1. Update Prisma schema from MySQL to PostgreSQL
2. Update DATABASE_URL format
3. Redeploy

**For this guide, I recommend Option A or B to keep things simple.**

---

### Step 4: Add Database URL to Backend

1. Go to your **restaurant-backend** service in Render
2. Click **"Environment"** in left sidebar
3. Click **"Add Environment Variable"**
4. Add:
   ```
   DATABASE_URL = <paste your MySQL connection string>
   ```
   Example format: `mysql://user:password@host:port/database`
5. Click **"Save Changes"**
6. Service will automatically redeploy

---

### Step 5: Run Database Migrations

After deployment is complete, you need to run migrations:

#### Using Render Shell:
1. Go to your **restaurant-backend** service
2. Click **"Shell"** tab (in the service page)
3. Click **"Launch Shell"**
4. Run these commands:
   ```bash
   npx prisma migrate deploy
   npm run prisma:seed
   ```

#### Alternative: Using Local Terminal with DATABASE_URL
```bash
cd restaurant-system/backend
DATABASE_URL="<your-database-url>" npx prisma migrate deploy
DATABASE_URL="<your-database-url>" npm run prisma:seed
```

---

### Step 6: Get Your Backend URL

1. In your **restaurant-backend** service
2. Look at the top - you'll see a URL like:
   ```
   https://restaurant-backend-xxxx.onrender.com
   ```
3. **Copy this URL** - you'll need it for frontend apps!

---

### Step 7: Test Your Backend

Open in browser:
```
https://your-backend-url.onrender.com/api/menu/items
```

Should return JSON with menu items if everything works! ✅

---

### Step 8: Update Frontend Apps on Vercel

Now update your 4 Vercel apps with the backend URL:

1. Go to: https://vercel.com/sukiorg0-gmailcoms-projects
2. For **each** of these projects:
   - Customer Menu
   - Admin Panel
   - Kitchen Display
   - Cashier Terminal

3. Do this for each:
   - Click the project
   - Go to **Settings → Environment Variables**
   - Add these variables:
     ```
     NEXT_PUBLIC_API_URL = https://your-backend.onrender.com/api
     NEXT_PUBLIC_WS_URL = wss://your-backend.onrender.com
     ```
   - Click **"Save"**
   - Go to **"Deployments"** tab
   - Click **"..."** on latest deployment → **"Redeploy"**

---

## 💰 Render Pricing

### Free Tier Includes:
- ✅ 750 hours/month per service (always on if only 1 service)
- ✅ 512MB RAM
- ✅ Auto-deploy from GitHub
- ✅ Free SSL certificates
- ⚠️ Spins down after 15min inactivity (cold start ~30s)

### Paid Plans:
- **Starter ($7/month):** Always on, 512MB RAM
- **Standard ($25/month):** 2GB RAM, faster
- **Pro ($85/month):** 4GB RAM, priority support

**Note:** Free tier is great for testing, but you'll want Starter ($7) for production to avoid cold starts.

---

## 🔧 Troubleshooting

### Build Failed
1. Check **"Logs"** tab in Render dashboard
2. Common issues:
   - Wrong root directory (should be `restaurant-system/backend`)
   - Missing Dockerfile
   - Syntax errors in code

### Database Connection Error
1. Verify `DATABASE_URL` format: `mysql://user:pass@host:port/db`
2. Make sure database is running
3. Check if firewall allows connections from Render IPs

### Cold Starts (Free Tier)
- Free tier spins down after 15 minutes
- First request after spin-down takes ~30 seconds
- Upgrade to Starter ($7) to stay always on

### CORS Errors
1. Check `CORS_ORIGIN` environment variable
2. Add your Vercel URLs:
   ```
   CORS_ORIGIN = https://customer-menu-*.vercel.app,https://admin-panel-*.vercel.app
   ```
   Or use `*` for testing

---

## 📊 Architecture After Deployment

```
┌─────────────────────────────────────────┐
│  Frontend Apps (Vercel)                 │
│  - Customer Menu                        │
│  - Admin Panel                          │
│  - Kitchen Display                      │
│  - Cashier Terminal                     │
└────────────┬────────────────────────────┘
             │ HTTPS/WSS
             ▼
┌─────────────────────────────────────────┐
│  Backend API (Render)                   │
│  https://restaurant-backend.onrender.com│
└────────────┬────────────────────────────┘
             │ MySQL
             ▼
┌─────────────────────────────────────────┐
│  Database (Railway/PlanetScale)         │
│  MySQL Connection                       │
└─────────────────────────────────────────┘
```

---

## 🎯 Quick Checklist

- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create web service (backend)
- [ ] Set root directory: `restaurant-system/backend`
- [ ] Add environment variables (except DATABASE_URL)
- [ ] Create MySQL database (Railway or PlanetScale)
- [ ] Add DATABASE_URL to Render
- [ ] Run migrations via Shell
- [ ] Seed database
- [ ] Test backend API endpoint
- [ ] Update Vercel environment variables (all 4 apps)
- [ ] Redeploy Vercel apps
- [ ] Test complete flow (order → kitchen → payment)

---

## 🆘 Need Help?

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **Support:** support@render.com

---

## 🔐 Test Credentials

After seeding the database:
- **Email:** admin@restaurant.com
- **Password:** admin123

---

## 📝 Important Notes

1. **Free Tier Cold Starts:** First request after inactivity takes ~30 seconds
2. **Database:** Render doesn't provide MySQL - use Railway or PlanetScale
3. **Auto Deploy:** Render auto-deploys on every push to `main` branch
4. **Environment Variables:** Changes require manual redeploy
5. **Logs:** Available in real-time in the Render dashboard

---

**Ready to deploy? Follow the steps above!** 🚀

If you get stuck at any step, let me know and I'll help you troubleshoot!
