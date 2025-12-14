# 🚀 Deployment Guide - Unified Restaurant App

## 📋 Overview

This guide covers deploying the unified restaurant management system as a **single application** instead of 4 separate apps.

## 🎯 Benefits of Unified Deployment

- ✅ **One URL**: All interfaces accessible from one domain
- ✅ **Single Deployment**: Deploy once, update everything
- ✅ **Shared Resources**: Common authentication and state
- ✅ **Cost Effective**: Only one deployment to maintain
- ✅ **Simpler Management**: One set of environment variables

## 🌐 URL Structure

```
https://your-restaurant-app.vercel.app
├── /                    → Customer Menu
├── /cart                → Shopping Cart
├── /order/[id]          → Order Tracking
├── /login               → Staff Login
├── /admin               → Admin Dashboard
├── /admin/menu          → Menu Management
├── /admin/orders        → Orders Management
├── /admin/tables        → Tables Management
├── /kitchen             → Kitchen Display
└── /cashier             → Cashier Terminal
```

## 📦 Prerequisites

1. **Backend API Deployed**
   - Railway, Render, or Heroku
   - Get your API URL: `https://your-api.railway.app`

2. **Vercel Account**
   - Sign up at vercel.com
   - Connect your GitHub account

## 🚀 Deployment Steps

### Step 1: Prepare Environment Variables

Create `.env.local` for local testing:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
NEXT_PUBLIC_WS_URL=https://your-backend.railway.app
```

### Step 2: Test Locally

```bash
cd restaurant-system/unified-app
npm install
npm run dev
```

Test all routes:
- http://localhost:3004 (Customer)
- http://localhost:3004/admin (Admin)
- http://localhost:3004/kitchen (Kitchen)
- http://localhost:3004/cashier (Cashier)

### Step 3: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd restaurant-system/unified-app
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_WS_URL production

# Deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add unified restaurant app"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Set **Root Directory**: `restaurant-system/unified-app`
   - Click "Deploy"

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL = https://your-backend.railway.app/api
     NEXT_PUBLIC_WS_URL = https://your-backend.railway.app
     ```
   - Click "Save"

4. **Redeploy**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment

### Step 4: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain: `restaurant.yourdomain.com`
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

## 🔒 Security Configuration

### Backend CORS Setup

Update your backend to allow the unified app domain:

```typescript
// backend/src/main.ts
app.enableCors({
  origin: [
    'http://localhost:3004',
    'https://your-restaurant-app.vercel.app',
    'https://restaurant.yourdomain.com'
  ],
  credentials: true,
})
```

## 📱 Access Points

After deployment, share these links with your team:

### For Customers
- **Main Menu**: `https://your-app.vercel.app`
- **QR Code**: Generate QR codes pointing to menu

### For Staff
- **Login**: `https://your-app.vercel.app/login`
- **Admin Panel**: `https://your-app.vercel.app/admin`
- **Kitchen Display**: `https://your-app.vercel.app/kitchen`
- **Cashier Terminal**: `https://your-app.vercel.app/cashier`

## 🎨 Customization

### Update Branding

Edit `app/layout.tsx`:
```tsx
export const metadata: Metadata = {
  title: 'Your Restaurant Name',
  description: 'Your custom description',
}
```

### Add Logo

1. Add logo to `public/logo.png`
2. Update components to use the logo

### Custom Colors

Edit `tailwind.config.js`:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color',
      }
    }
  }
}
```

## 🔧 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://api.railway.app/api` |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | `https://api.railway.app` |

## 📊 Monitoring

### Vercel Analytics

1. Go to Project Settings → Analytics
2. Enable analytics
3. View real-time metrics

### Error Tracking

Add Sentry or similar:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## 🐛 Troubleshooting

### Issue: API calls failing

**Solution**: Check CORS configuration on backend

### Issue: WebSocket not connecting

**Solution**: Ensure `NEXT_PUBLIC_WS_URL` is set correctly

### Issue: 404 on routes

**Solution**: Vercel should auto-detect Next.js. Check `vercel.json`

### Issue: Environment variables not working

**Solution**: 
1. Variables must start with `NEXT_PUBLIC_` for client-side
2. Redeploy after adding variables
3. Check they're added to correct environment (Production)

## 🔄 CI/CD Setup

Vercel automatically deploys on:
- **Push to main**: Production deployment
- **Pull requests**: Preview deployments

### GitHub Actions (Optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 Scaling

### Vercel Limits (Free Plan)
- 100 GB Bandwidth/month
- Unlimited deployments
- Automatic scaling

### Upgrade for Production
- Consider Vercel Pro for:
  - Higher bandwidth
  - Better performance
  - Team features

## ✅ Post-Deployment Checklist

- [ ] All routes accessible
- [ ] Login working for all roles
- [ ] Orders can be created
- [ ] Kitchen display updating in real-time
- [ ] Payment processing working
- [ ] Mobile responsive
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Team members trained on new URLs
- [ ] QR codes updated with new URL

## 🎉 Success!

Your unified restaurant management system is now live!

Share these bookmarks with your team:
- 📱 Customer Menu
- 👨‍💼 Admin Dashboard
- 👨‍🍳 Kitchen Display
- 💰 Cashier Terminal

---

Need help? Check the main README.md or create an issue on GitHub.
