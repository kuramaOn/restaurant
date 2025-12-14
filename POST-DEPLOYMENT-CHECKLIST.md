# Post-Deployment Checklist

## ✅ Frontend Deployment (Vercel)

After deploying each application to Vercel, you'll get URLs like:
- Customer Menu: `https://customer-menu-xxxxx.vercel.app`
- Admin Panel: `https://admin-panel-xxxxx.vercel.app`
- Kitchen Display: `https://kitchen-display-xxxxx.vercel.app`
- Cashier Terminal: `https://cashier-terminal-xxxxx.vercel.app`

## 🔧 Backend Deployment (Required!)

**Important:** The backend (NestJS API) cannot be deployed to Vercel. You must deploy it to:
- **Render** (recommended - see DEPLOYMENT.md)
- **Railway** 
- **Heroku**
- **AWS/DigitalOcean**

### Backend Deployment Steps:

1. **Go to [Render.com](https://render.com)**
2. **Create New Web Service**
3. **Connect your GitHub repository**
4. **Configure:**
   - Root Directory: `restaurant-system/backend`
   - Environment: Docker
   - Add Environment Variables:
     ```
     DATABASE_URL=<your-database-url>
     JWT_SECRET=<your-secret-key>
     FRONTEND_URL=https://customer-menu-xxxxx.vercel.app
     NODE_ENV=production
     PORT=3000
     ```

5. **Deploy and get your backend URL** (e.g., `https://restaurant-backend.onrender.com`)

## 🔐 Update Environment Variables in Vercel

For **each** Vercel project (Customer Menu, Admin Panel, Kitchen Display, Cashier Terminal):

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the project
3. Go to **Settings → Environment Variables**
4. Add these variables:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com/api`
   - `NEXT_PUBLIC_WS_URL` = `wss://your-backend.onrender.com`
5. Click **Save**
6. Go to **Deployments** tab
7. Click **Redeploy** for the latest deployment

## 📊 Database Setup

If you haven't already:

1. **Deploy database to Railway or another MySQL host**
2. **Get the connection string**
3. **Run migrations:**
   ```bash
   cd restaurant-system/backend
   npx prisma migrate deploy
   npx prisma db seed
   ```

## 🧪 Testing Your Deployment

### 1. Test Backend API
```bash
curl https://your-backend.onrender.com/api
```
Should return: `{"message":"Restaurant Management API"}`

### 2. Test Frontend Apps
- Visit each Vercel URL
- Check browser console for errors
- Try to login with: `admin@restaurant.com` / `admin123`

### 3. Test WebSocket Connection
- Open Kitchen Display
- Create an order from Customer Menu
- Verify order appears in Kitchen Display in real-time

## ⚠️ Common Issues

### CORS Errors
- **Solution:** Make sure `FRONTEND_URL` in backend matches your Vercel URLs exactly

### API Not Found (404)
- **Solution:** Verify `NEXT_PUBLIC_API_URL` ends with `/api`

### WebSocket Connection Failed
- **Solution:** Use `wss://` (not `ws://`) for production

### Prisma Errors
- **Solution:** Run `npx prisma generate` and `npx prisma migrate deploy` on backend

### Build Failures
- **Solution:** Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`

## 🎉 Success Checklist

- [ ] All 4 frontend apps deployed to Vercel
- [ ] Backend deployed to Render/Railway
- [ ] Database deployed and seeded
- [ ] Environment variables configured in all Vercel projects
- [ ] All apps redeployed after env variable updates
- [ ] Can access each app via its URL
- [ ] Can login with admin credentials
- [ ] API calls work (no CORS errors)
- [ ] WebSocket real-time updates work
- [ ] Orders flow through the system correctly

## 📝 Your Deployment URLs

Fill in your URLs after deployment:

```
Backend API:      https://_____________________________.onrender.com
Customer Menu:    https://_____________________________.vercel.app
Admin Panel:      https://_____________________________.vercel.app
Kitchen Display:  https://_____________________________.vercel.app
Cashier Terminal: https://_____________________________.vercel.app
Database:         mysql://____________________________
```

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Render Dashboard](https://dashboard.render.com)
- [Railway Dashboard](https://railway.app/dashboard)
- [Deployment Guide](./DEPLOYMENT.md)
