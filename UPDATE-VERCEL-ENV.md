# 🔧 Update Vercel Environment Variables

## Why Frontend Apps Can't Login

Your Vercel apps need to know where the backend API is located. Right now they don't have the backend URL configured.

---

## 📋 What You Need

**Backend URL from either:**
- Render: `https://restaurant-backend.onrender.com` (or similar)
- Railway: `https://restaurant-production.up.railway.app` (or similar)

---

## ✅ Step-by-Step: Update Vercel Apps

### For EACH of the 4 apps, do this:

1. Go to: https://vercel.com/sukiorg0-gmailcoms-projects
2. Click on the app:
   - **customer-menu**
   - **admin-panel**
   - **kitchen-display**
   - **cashier-terminal**

3. Click **"Settings"** (in top menu)
4. Click **"Environment Variables"** (left sidebar)
5. Click **"Add New"** button

### Add These Variables:

#### For Customer Menu, Kitchen Display:
```
Variable Name: NEXT_PUBLIC_API_URL
Value: https://YOUR-BACKEND-URL.onrender.com/api

Variable Name: NEXT_PUBLIC_WS_URL
Value: wss://YOUR-BACKEND-URL.onrender.com
```

#### For Admin Panel, Cashier Terminal:
```
Variable Name: NEXT_PUBLIC_API_URL
Value: https://YOUR-BACKEND-URL.onrender.com/api
```

**Important:** Replace `YOUR-BACKEND-URL` with your actual backend URL!

6. Click **"Save"**
7. Go to **"Deployments"** tab
8. Click **"..."** on latest deployment → **"Redeploy"**
9. Wait for redeploy to finish (~1-2 minutes)

---

## 🎯 Example with Real URLs

If your backend is: `https://restaurant-api.onrender.com`

Then add:
```
NEXT_PUBLIC_API_URL = https://restaurant-api.onrender.com/api
NEXT_PUBLIC_WS_URL = wss://restaurant-api.onrender.com
```

---

## ✅ After Updating All 4 Apps

1. ✅ Customer Menu - Redeployed
2. ✅ Admin Panel - Redeployed  
3. ✅ Kitchen Display - Redeployed
4. ✅ Cashier Terminal - Redeployed

---

## 🧪 Test Login

1. Go to Admin Panel: https://admin-panel-johx3yie0-sukiorg0-gmailcoms-projects.vercel.app/login
2. Login with:
   - Email: `admin@restaurant.com`
   - Password: `admin123`
3. Should successfully login! ✅

---

## 🆘 If Login Still Fails

Check:
1. Backend is actually running (visit backend URL in browser)
2. Environment variables saved correctly in Vercel
3. Apps were redeployed after adding variables
4. No typos in the URLs
5. Backend has `/api` prefix in routes
6. Database is connected and seeded

---

## 🔐 Database Note

The frontend apps **DO NOT** need database credentials. They only need:
- ✅ Backend API URL
- ✅ WebSocket URL (for real-time features)

The backend handles all database connections.

---

**Next Step:** Get your backend URL from Render or Railway, then update Vercel!
