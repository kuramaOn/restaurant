# 🌐 Deployed Application URLs

## Frontend Applications (Vercel)

### 📱 Customer Menu
**URL:** https://customer-menu-1cih7hgj5-sukiorg0-gmailcoms-projects.vercel.app  
**Status:** ✅ Deployed  
**Purpose:** Customer-facing menu and ordering interface

### 👨‍💼 Admin Panel  
**URL:** https://admin-panel-johx3yie0-sukiorg0-gmailcoms-projects.vercel.app  
**Status:** ✅ Deployed  
**Purpose:** Restaurant management dashboard

### 🍳 Kitchen Display
**URL:** https://kitchen-display-9vzpx1z6s-sukiorg0-gmailcoms-projects.vercel.app  
**Status:** ✅ Deployed  
**Purpose:** Kitchen order display system

### 💰 Cashier Terminal
**URL:** https://cashier-terminal-pjst2wszm-sukiorg0-gmailcoms-projects.vercel.app  
**Status:** ✅ Deployed  
**Purpose:** Point of sale / cashier interface

---

## ⚠️ Next Steps Required

### 1. Deploy Backend API
The backend (NestJS) needs to be deployed separately. Recommended platforms:
- **Render** (Free tier available): https://render.com
- **Railway** (Simple deployment): https://railway.app
- **Heroku** (Established platform): https://heroku.com

See [DEPLOYMENT.md](./DEPLOYMENT.md) for backend deployment instructions.

### 2. Deploy Database
Choose a MySQL hosting provider:
- **PlanetScale** (Free tier): https://planetscale.com
- **Railway** (Integrated): https://railway.app
- **AWS RDS** (Scalable): https://aws.amazon.com/rds/

### 3. Configure Environment Variables
After deploying the backend, update environment variables in Vercel:

For each project, go to:
`Vercel Dashboard → Project → Settings → Environment Variables`

Add:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
NEXT_PUBLIC_WS_URL=wss://your-backend-url.onrender.com
```

Then redeploy each application.

---

## 📊 Vercel Dashboard

View all deployments: https://vercel.com/sukiorg0-gmailcoms-projects

---

## 🔐 Test Credentials

Once backend is deployed and connected:
- **Email:** admin@restaurant.com
- **Password:** admin123

---

## 📝 Notes

- All apps are currently deployed WITHOUT backend connection
- They will show errors until backend is deployed and env variables are configured
- URLs may change if you redeploy (use custom domains for stable URLs)

---

*Deployed on: December 2025*
*Platform: Vercel*
*Account: sukiorg0-7260*
