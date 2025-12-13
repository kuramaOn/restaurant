# Restaurant Management System

A complete restaurant management solution with backend API and customer menu frontend.

## 🚀 Quick Start

### Backend (NestJS)

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npx ts-node prisma/seed.ts
npm run start:dev
```

Backend will run on: http://localhost:3000

### Customer Menu (Next.js)

```bash
cd customer-menu
npm install
npm run dev
```

Customer menu will run on: http://localhost:3003

## 🔑 Default Credentials

- **Admin**: admin@restaurant.com / admin123
- **Chef**: chef@restaurant.com / chef123

## 📚 API Endpoints

- **Auth**: `/api/auth/login`, `/api/auth/register`
- **Menu**: `/api/menu/items`, `/api/menu/categories`
- **Orders**: `/api/orders`
- **Tables**: `/api/tables`

## 🗄️ Database

MySQL database on Railway:
- Host: switchyard.proxy.rlwy.net:41173
- Database: railway

## 📁 Project Structure

```
restaurant-system/
├── backend/              # NestJS backend API
│   ├── src/
│   │   ├── modules/     # Feature modules
│   │   ├── prisma/      # Database service
│   │   └── main.ts
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
├── customer-menu/        # Next.js customer frontend
│   ├── app/
│   │   ├── page.tsx     # Home page with menu
│   │   └── cart/        # Shopping cart
│   └── components/
└── README.md
```

## 🎯 Features Implemented

### Backend
- ✅ User authentication (JWT)
- ✅ Menu management (CRUD)
- ✅ Order management
- ✅ Table management
- ✅ Real-time updates (WebSocket)
- ✅ MySQL database with Prisma ORM

### Customer Menu
- ✅ Browse menu items
- ✅ Category filtering
- ✅ Responsive design
- ✅ Featured items
- ✅ Item details (dietary tags, spice level, calories)

## 🔜 Next Steps

1. Implement shopping cart functionality
2. Create checkout flow
3. Add order tracking
4. Build admin panel
5. Build kitchen display system
6. Add payment integration

## 🛠️ Technologies

- **Backend**: NestJS, Prisma, MySQL, Socket.IO, JWT
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Database**: MySQL (Railway)
