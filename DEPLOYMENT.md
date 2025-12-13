# 🚀 Deployment Guide

This guide will help you deploy your Restaurant Management System to production.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database schema migrated
- [ ] Initial data seeded
- [ ] All tests passing
- [ ] CORS configured for production domains
- [ ] JWT secrets changed from defaults
- [ ] API rate limiting configured
- [ ] Error monitoring setup (optional)

## 🗄️ Database Deployment

### **Option 1: Railway (Recommended)**

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy MySQL Database**
   ```bash
   # From Railway Dashboard
   1. New Project → Database → MySQL
   2. Copy DATABASE_URL
   ```

3. **Setup Database**
   ```bash
   cd restaurant-system/backend
   
   # Update .env with Railway DATABASE_URL
   DATABASE_URL="mysql://user:pass@host:port/database"
   
   # Push schema
   npx prisma db push
   
   # Seed data
   npx prisma db seed
   ```

### **Option 2: PlanetScale**

1. Create account at https://planetscale.com
2. Create database
3. Get connection string
4. Use with Prisma

## 🖥️ Backend Deployment

### **Option 1: Railway**

1. **Deploy Backend**
   ```bash
   # From restaurant-system/backend
   railway login
   railway init
   railway up
   ```

2. **Add Environment Variables**
   ```
   DATABASE_URL=your_railway_mysql_url
   JWT_SECRET=your_secure_secret_key
   PORT=3000
   NODE_ENV=production
   ```

3. **Your API will be at**: `https://your-app.railway.app/api`

### **Option 2: Heroku**

1. **Install Heroku CLI**
   ```bash
   # Install from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy**
   ```bash
   cd restaurant-system/backend
   
   # Login
   heroku login
   
   # Create app
   heroku create restaurant-backend
   
   # Add MySQL addon
   heroku addons:create jawsdb:kitefin
   
   # Set environment variables
   heroku config:set JWT_SECRET=your_secret
   heroku config:set NODE_ENV=production
   
   # Deploy
   git push heroku main
   
   # Run migrations
   heroku run npx prisma db push
   heroku run npx prisma db seed
   ```

### **Option 3: DigitalOcean App Platform**

1. Connect your GitHub repository
2. Select `restaurant-system/backend` as root directory
3. Add environment variables
4. Deploy

## 🌐 Frontend Deployment

### **Option 1: Vercel (Recommended for Next.js)**

1. **Deploy Admin Panel**
   ```bash
   cd restaurant-system/admin-panel
   
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Deploy
   vercel
   
   # Add environment variables in Vercel dashboard
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_WS_URL=https://your-backend.railway.app
   ```

2. **Deploy Other Frontends**
   - Repeat for `cashier-terminal`, `customer-menu`, `kitchen-display`

### **Option 2: Netlify**

1. **Connect Repository**
   - Go to https://netlify.com
   - New site from Git
   - Select your repository

2. **Configure Build Settings**
   ```
   Base directory: restaurant-system/admin-panel
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_WS_URL=https://your-backend.railway.app
   ```

## 🔒 Security Configuration

### **Update CORS Settings**

Edit `restaurant-system/backend/src/main.ts`:

```typescript
app.enableCors({
  origin: [
    'https://admin.yourdomain.com',
    'https://cashier.yourdomain.com',
    'https://menu.yourdomain.com',
    'https://kitchen.yourdomain.com',
  ],
  credentials: true,
});
```

### **Change JWT Secret**

```bash
# Generate strong secret
openssl rand -base64 32

# Update in production environment
```

### **Update Environment Variables**

**Backend:**
```env
DATABASE_URL=production_mysql_url
JWT_SECRET=secure_random_secret
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_WS_URL=https://api.yourdomain.com
NODE_ENV=production
```

## 🌍 Custom Domain Setup

### **Backend Domain**
1. Add custom domain in Railway/Heroku
2. Point DNS to provided CNAME/A record
3. SSL automatically provisioned

### **Frontend Domains**
1. Add custom domains in Vercel/Netlify
2. Update DNS records:
   ```
   admin.yourdomain.com → CNAME → vercel-dns
   menu.yourdomain.com  → CNAME → vercel-dns
   ```

## 📊 Monitoring & Logging

### **Error Tracking (Optional)**

**Sentry Integration:**

```bash
npm install @sentry/nextjs @sentry/node
```

**Backend (main.ts):**
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**Frontend (next.config.js):**
```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig({
  // your config
});
```

### **Performance Monitoring**

- Vercel Analytics (built-in)
- Google Analytics
- LogRocket

## 🔄 CI/CD Setup

### **GitHub Actions**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd restaurant-system/backend && npm install
      - run: cd restaurant-system/backend && npm run test
      - uses: railway/deploy@v1
        with:
          service: backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
```

## 🧪 Production Testing

After deployment, test:

1. **Backend API**
   ```bash
   curl https://api.yourdomain.com/api/menu/categories
   ```

2. **Frontend Apps**
   - Visit each deployed URL
   - Test login functionality
   - Verify API connections

3. **WebSocket Connection**
   - Test real-time updates
   - Check kitchen display
   - Verify order notifications

## 📱 Mobile Testing

Test production URLs on:
- Real mobile devices
- Browser DevTools (mobile emulation)
- Different screen sizes

## 🔄 Update Deployment

```bash
# Backend
cd restaurant-system/backend
railway up

# Frontend (Vercel auto-deploys on git push)
git add .
git commit -m "Update"
git push origin main
```

## 🆘 Troubleshooting

### **Database Connection Issues**
```bash
# Test connection
npx prisma db push

# Check logs
railway logs
```

### **CORS Errors**
- Verify production URLs in CORS config
- Check environment variables
- Ensure HTTPS in production

### **Build Failures**
- Check Node.js version compatibility
- Verify all dependencies installed
- Review build logs

## 📞 Support

For deployment issues:
1. Check logs in Railway/Vercel/Netlify dashboard
2. Review environment variables
3. Verify database connectivity
4. Check CORS configuration

## 🎉 Post-Deployment

- [ ] Test all features in production
- [ ] Monitor error logs
- [ ] Set up backups
- [ ] Configure SSL/HTTPS
- [ ] Add monitoring alerts
- [ ] Update documentation with production URLs

---

**Your restaurant system is now live! 🚀**
