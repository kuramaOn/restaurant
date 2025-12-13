# 🚀 Vercel Deployment Guide

Complete guide to deploy your Restaurant Management System to Vercel.

## 📋 Prerequisites

1. **Vercel Account**
   - Sign up at: https://vercel.com
   - Connect your GitHub account

2. **Backend API Deployed**
   - Deploy backend first (Railway/Heroku)
   - Get your API URL (e.g., `https://your-backend.railway.app`)

## 🌐 Deploy Frontend Applications

You have 4 Next.js applications to deploy:
1. Customer Menu (Main customer-facing app)
2. Admin Panel (Management dashboard)
3. Cashier Terminal (POS system)
4. Kitchen Display (Kitchen orders)

### **Method 1: Deploy via Vercel Dashboard (Recommended)**

#### **Step 1: Deploy Customer Menu**

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Click "Import Project"

2. **Import from GitHub**
   - Select repository: `kuramaOn/restaurant`
   - Click "Import"

3. **Configure Project**
   ```
   Project Name: restaurant-customer-menu
   Framework Preset: Next.js
   Root Directory: restaurant-system/customer-menu
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_WS_URL=https://your-backend.railway.app
   ```

5. **Click "Deploy"**
   - Wait 2-3 minutes
   - Your app will be at: `https://restaurant-customer-menu.vercel.app`

#### **Step 2: Deploy Admin Panel**

1. **New Project**
   - Click "New Project"
   - Select same repository

2. **Configure**
   ```
   Project Name: restaurant-admin
   Root Directory: restaurant-system/admin-panel
   ```

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_WS_URL=https://your-backend.railway.app
   ```

4. **Deploy**
   - URL: `https://restaurant-admin.vercel.app`

#### **Step 3: Deploy Cashier Terminal**

1. **New Project**
   ```
   Project Name: restaurant-cashier
   Root Directory: restaurant-system/cashier-terminal
   ```

2. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_WS_URL=https://your-backend.railway.app
   ```

3. **Deploy**
   - URL: `https://restaurant-cashier.vercel.app`

#### **Step 4: Deploy Kitchen Display**

1. **New Project**
   ```
   Project Name: restaurant-kitchen
   Root Directory: restaurant-system/kitchen-display
   ```

2. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_WS_URL=https://your-backend.railway.app
   ```

3. **Deploy**
   - URL: `https://restaurant-kitchen.vercel.app`

---

### **Method 2: Deploy via Vercel CLI**

#### **Install Vercel CLI**

```bash
npm install -g vercel
```

#### **Login to Vercel**

```bash
vercel login
```

#### **Deploy Each Application**

**Customer Menu:**
```bash
cd restaurant-system/customer-menu
vercel --prod
# Follow prompts, add environment variables
```

**Admin Panel:**
```bash
cd restaurant-system/admin-panel
vercel --prod
```

**Cashier Terminal:**
```bash
cd restaurant-system/cashier-terminal
vercel --prod
```

**Kitchen Display:**
```bash
cd restaurant-system/kitchen-display
vercel --prod
```

---

## 🔧 Post-Deployment Configuration

### **1. Update Backend CORS**

Edit `restaurant-system/backend/src/main.ts`:

```typescript
app.enableCors({
  origin: [
    'https://restaurant-customer-menu.vercel.app',
    'https://restaurant-admin.vercel.app',
    'https://restaurant-cashier.vercel.app',
    'https://restaurant-kitchen.vercel.app',
  ],
  credentials: true,
});
```

Redeploy your backend after this change.

### **2. Test All Applications**

| Application | URL | Test |
|------------|-----|------|
| Customer Menu | https://restaurant-customer-menu.vercel.app | Browse menu, add to cart |
| Admin Panel | https://restaurant-admin.vercel.app | Login, view dashboard |
| Cashier Terminal | https://restaurant-cashier.vercel.app | Login, process payment |
| Kitchen Display | https://restaurant-kitchen.vercel.app | Login, view orders |

### **3. Custom Domains (Optional)**

Add custom domains in Vercel:

```
menu.yourdomain.com → Customer Menu
admin.yourdomain.com → Admin Panel
cashier.yourdomain.com → Cashier Terminal
kitchen.yourdomain.com → Kitchen Display
```

**DNS Configuration:**
```
Type: CNAME
Name: menu
Value: cname.vercel-dns.com
```

---

## 🔒 Security Checklist

- [ ] Environment variables configured
- [ ] Backend CORS updated with Vercel URLs
- [ ] JWT secrets are secure
- [ ] Database has firewall rules
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Test authentication on all apps

---

## 📊 Monitoring

### **Vercel Analytics**

Enable analytics in Vercel dashboard:
1. Go to project settings
2. Enable "Analytics"
3. Track performance and usage

### **Error Tracking**

Add Sentry for error monitoring:
```bash
npm install @sentry/nextjs
```

---

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel will automatically deploy all apps
```

### **Preview Deployments**

Every pull request gets a preview URL:
- Test changes before merging
- Share with team for review

---

## 🆘 Troubleshooting

### **Build Fails**

```bash
# Common issues:
1. Missing environment variables → Add in Vercel dashboard
2. Dependencies missing → Check package.json
3. Build command wrong → Verify vercel.json
```

### **API Connection Fails**

```bash
# Check:
1. Environment variables are correct
2. Backend CORS includes Vercel URLs
3. Backend is running and accessible
4. WebSocket connection allowed
```

### **404 Errors**

```bash
# Ensure:
1. Root directory is set correctly
2. Build completed successfully
3. Output directory is .next
```

---

## 📱 Mobile Testing

Test production URLs on mobile:
1. Open on real mobile device
2. Test pull-to-refresh
3. Verify touch gestures
4. Check responsive layout

---

## 🎯 Performance Optimization

### **Enable Features:**

1. **Image Optimization**
   - Automatic with Next.js
   - Images served as WebP

2. **Edge Functions**
   - API routes run at edge
   - Lower latency worldwide

3. **Caching**
   - Static pages cached at CDN
   - Faster load times

---

## 📈 Post-Deployment

### **Update README**

Add deployment URLs to README.md:

```markdown
## 🌐 Live Demo

- Customer Menu: https://restaurant-customer-menu.vercel.app
- Admin Panel: https://restaurant-admin.vercel.app
- Cashier Terminal: https://restaurant-cashier.vercel.app
- Kitchen Display: https://restaurant-kitchen.vercel.app
```

### **Share Your Project**

- Tweet about it
- Post on LinkedIn
- Add to portfolio
- Share on Dev.to

---

## 🎉 Success!

Your restaurant system is now live on Vercel! All 4 applications deployed with:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments
- ✅ Preview URLs
- ✅ Analytics

**Deployment URLs:**
- Customer Menu: `https://restaurant-customer-menu.vercel.app`
- Admin Panel: `https://restaurant-admin.vercel.app`
- Cashier Terminal: `https://restaurant-cashier.vercel.app`
- Kitchen Display: `https://restaurant-kitchen.vercel.app`

---

**Need help? Contact Vercel support or check their documentation.**
