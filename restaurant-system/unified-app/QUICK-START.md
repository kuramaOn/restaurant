# 🚀 Quick Start Guide - Unified Restaurant App

Get your unified restaurant management system running in 5 minutes!

## ⚡ Super Quick Start

```bash
# 1. Navigate to the unified app
cd restaurant-system/unified-app

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Update the API URL in .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3000/api

# 5. Start the development server
npm run dev
```

**Done!** Open http://localhost:3004 in your browser 🎉

---

## 📱 What You Get

One app with multiple interfaces accessible via routes:

| Interface | URL | Purpose |
|-----------|-----|---------|
| **Customer Menu** | http://localhost:3004 | Browse menu & place orders |
| **Shopping Cart** | http://localhost:3004/cart | Review & checkout |
| **Order Tracking** | http://localhost:3004/order/[id] | Track order status |
| **Login** | http://localhost:3004/login | Staff authentication |
| **Admin Dashboard** | http://localhost:3004/admin | Overview & statistics |
| **Menu Management** | http://localhost:3004/admin/menu | Manage menu items |
| **Orders Management** | http://localhost:3004/admin/orders | View all orders |
| **Tables Management** | http://localhost:3004/admin/tables | Manage tables |
| **Kitchen Display** | http://localhost:3004/kitchen | Real-time order prep |
| **Cashier Terminal** | http://localhost:3004/cashier | Payment processing |

---

## 🧪 Test the App

### 1. Test Customer Flow

1. Open http://localhost:3004
2. Browse menu items
3. Add items to cart
4. Go to cart
5. Enter table number (e.g., "A1")
6. Place order
7. Track order status

### 2. Test Staff Interfaces

**Login Credentials:**
- Admin: `admin@restaurant.com` / `admin123`
- Chef: `chef@restaurant.com` / `chef123`
- Cashier: `cashier@restaurant.com` / `cashier123`

**Test Admin Panel:**
1. Go to http://localhost:3004/login
2. Login as admin
3. View dashboard
4. Manage menu items
5. View orders
6. Manage tables

**Test Kitchen Display:**
1. Go to http://localhost:3004/login
2. Login as chef
3. Redirects to http://localhost:3004/kitchen
4. See pending orders
5. Update order status

**Test Cashier Terminal:**
1. Go to http://localhost:3004/login
2. Login as cashier
3. Redirects to http://localhost:3004/cashier
4. View unpaid orders
5. Process payments

---

## 🛠️ Configuration

### Environment Variables

Edit `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# WebSocket URL (for real-time updates)
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

### Port Configuration

Default port: `3004`

To change:
```bash
# Edit package.json scripts
"dev": "next dev -p 3005",
"start": "next start -p 3005"
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to API"

**Solution:**
1. Make sure backend is running on port 3000
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Verify CORS is configured in backend

### Issue: "Module not found"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3004 already in use"

**Solution:**
```bash
# Find and kill the process
lsof -ti:3004 | xargs kill -9

# Or use different port
npm run dev -- -p 3005
```

### Issue: "Authentication not working"

**Solution:**
1. Clear browser localStorage
2. Check backend is running
3. Verify user exists in database
4. Check browser console for errors

---

## 📦 What's Included

### Routes ✅
- ✅ Customer menu (/)
- ✅ Shopping cart (/cart)
- ✅ Order tracking (/order/[id])
- ✅ Staff login (/login)
- ✅ Admin dashboard (/admin)
- ✅ Admin menu management (/admin/menu)
- ✅ Admin orders (/admin/orders)
- ✅ Admin tables (/admin/tables)
- ✅ Kitchen display (/kitchen)
- ✅ Cashier terminal (/cashier)

### Components ✅
- ✅ Admin sidebar navigation
- ✅ Customer bottom navigation
- ✅ Item customization modal
- ✅ Bottom sheet
- ✅ Floating action button
- ✅ Pull to refresh

### Features ✅
- ✅ Real-time order updates (WebSocket)
- ✅ Role-based access control
- ✅ Mobile-responsive design
- ✅ Shopping cart with Zustand
- ✅ Order status tracking
- ✅ Payment processing
- ✅ Menu management
- ✅ Table management

---

## 📚 Next Steps

1. **Customize Branding**
   - Update colors in `tailwind.config.js`
   - Add logo in `public/`
   - Modify metadata in `app/layout.tsx`

2. **Add Features**
   - Implement QR code generation
   - Add customer reviews
   - Create analytics dashboard
   - Add reporting features

3. **Deploy to Production**
   - Follow steps in `DEPLOYMENT.md`
   - Deploy to Vercel
   - Configure custom domain

4. **Mobile Testing**
   - Test on real devices
   - Verify touch interactions
   - Test offline behavior
   - Check PWA features

---

## 🎯 Architecture Overview

```
unified-app/
│
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Customer menu (/)
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   │
│   ├── cart/                    # Shopping cart
│   │   └── page.tsx
│   │
│   ├── order/[id]/              # Order tracking
│   │   └── page.tsx
│   │
│   ├── login/                   # Authentication
│   │   └── page.tsx
│   │
│   ├── admin/                   # 🔒 Admin routes
│   │   ├── layout.tsx          # Protected layout
│   │   ├── page.tsx            # Dashboard
│   │   ├── menu/               # Menu management
│   │   ├── orders/             # Orders management
│   │   └── tables/             # Tables management
│   │
│   ├── kitchen/                 # 🔒 Kitchen display
│   │   └── page.tsx
│   │
│   └── cashier/                 # 🔒 Cashier terminal
│       └── page.tsx
│
├── components/                   # Reusable components
│   ├── admin/                   # Admin components
│   │   └── Sidebar.tsx
│   ├── customer/                # Customer components
│   │   ├── BottomNavigation.tsx
│   │   ├── ItemCustomizationModal.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── FloatingActionButton.tsx
│   │   └── PullToRefresh.tsx
│   ├── kitchen/                 # Kitchen components
│   ├── cashier/                 # Cashier components
│   └── shared/                  # Shared components
│
└── lib/                         # Utilities
    ├── api.ts                   # API client
    ├── auth.ts                  # Authentication
    └── store.ts                 # State management (Zustand)
```

---

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Real-time**: Socket.io Client
- **Deployment**: Vercel

---

## 💡 Pro Tips

### Development
- Use React DevTools to inspect component state
- Check Network tab for API calls
- Use Zustand DevTools for state debugging

### Performance
- Next.js automatically code-splits by route
- Images are optimized with next/image
- API calls are cached appropriately

### Mobile
- Test on Chrome DevTools mobile emulator
- Use iOS Safari for iOS testing
- Test pull-to-refresh on mobile

---

## ✅ Checklist

Before going to production:

- [ ] Backend API is deployed and accessible
- [ ] Environment variables are configured
- [ ] All routes are accessible
- [ ] Authentication works for all roles
- [ ] Orders can be created and tracked
- [ ] Kitchen display updates in real-time
- [ ] Payments can be processed
- [ ] Mobile interface is responsive
- [ ] Images load correctly
- [ ] Error handling is in place

---

## 🆘 Need Help?

- 📖 Check `README.md` for detailed documentation
- 🚀 See `DEPLOYMENT.md` for deployment guide
- 📊 Read `COMPARISON.md` for architecture details
- 💬 Open an issue on GitHub
- 📧 Contact the development team

---

**Happy coding!** 🎉
