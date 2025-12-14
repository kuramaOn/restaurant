# 🍽️ Restaurant Management System - Unified App

A single Next.js application that combines all restaurant management interfaces into one deployment.

## 🎯 Features

This unified app includes:
- **Customer Menu** (`/`) - Browse menu and place orders
- **Admin Panel** (`/admin`) - Manage menu, orders, and tables
- **Kitchen Display** (`/kitchen`) - Real-time order preparation
- **Cashier Terminal** (`/cashier`) - Payment processing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Backend API running (see `restaurant-system/backend`)

### Installation

```bash
npm install
```

### Configuration

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Visit:
- Customer Menu: http://localhost:3004
- Admin Panel: http://localhost:3004/admin
- Kitchen Display: http://localhost:3004/kitchen
- Cashier Terminal: http://localhost:3004/cashier
- Login: http://localhost:3004/login

## 📁 Structure

```
unified-app/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Customer menu (/)
│   ├── cart/                # Shopping cart
│   ├── order/[id]/          # Order tracking
│   ├── login/               # Authentication
│   ├── admin/               # Admin panel routes
│   │   ├── page.tsx         # Dashboard
│   │   ├── menu/            # Menu management
│   │   ├── orders/          # Orders management
│   │   └── tables/          # Tables management
│   ├── kitchen/             # Kitchen display
│   └── cashier/             # Cashier terminal
│
├── components/              # Reusable components
│   ├── admin/              # Admin-specific
│   ├── customer/           # Customer-specific
│   ├── kitchen/            # Kitchen-specific
│   ├── cashier/            # Cashier-specific
│   └── shared/             # Shared components
│
└── lib/                    # Utilities
    ├── api.ts              # API client
    ├── auth.ts             # Authentication
    └── store.ts            # State management
```

## 🔒 Authentication

Protected routes:
- `/admin/*` - Requires ADMIN or MANAGER role
- `/kitchen` - Requires CHEF role
- `/cashier` - Requires CASHIER or WAITER role

Demo accounts:
- Admin: `admin@restaurant.com` / `admin123`
- Chef: `chef@restaurant.com` / `chef123`
- Cashier: `cashier@restaurant.com` / `cashier123`

## 🌐 Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_WS_URL`
4. Deploy!

The app will be available at:
- `https://your-app.vercel.app` - Customer menu
- `https://your-app.vercel.app/admin` - Admin panel
- `https://your-app.vercel.app/kitchen` - Kitchen display
- `https://your-app.vercel.app/cashier` - Cashier terminal

## 📱 Mobile Optimization

The customer menu is fully optimized for mobile devices with:
- Bottom navigation
- Touch-friendly interface
- Pull-to-refresh
- Responsive design

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Real-time**: Socket.io Client
- **Deployment**: Vercel

## 🤝 Contributing

See the main repository CONTRIBUTING.md for guidelines.

## 📄 License

MIT License - see LICENSE file for details.
