# 🍽️ Restaurant Management System

A comprehensive, full-stack restaurant management system with mobile-optimized interfaces for customers, staff, and management.

## 🌟 Features

### **Customer-Facing**
- 📱 Mobile-optimized menu browsing
- 🛒 Shopping cart with customizations
- 🔄 Pull-to-refresh functionality
- 📍 QR code table ordering
- 💳 Real-time order tracking

### **Staff Management**
- 💰 Cashier terminal with payment processing
- 👨‍🍳 Kitchen display system
- 📊 Admin dashboard
- 👥 Customer management
- 🪑 Table management

### **Payment System**
- 💵 Multiple payment methods (Cash, Card, Mobile)
- 💡 Tips calculator
- 🔢 Change calculator
- 📈 Payment status tracking

## 🏗️ Tech Stack

### **Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Socket.IO Client (Real-time updates)

### **Backend**
- NestJS
- Prisma ORM
- MySQL Database
- JWT Authentication
- Socket.IO (WebSockets)

## 📁 Project Structure

```
restaurant-system/
├── backend/              # NestJS API Server
│   ├── src/
│   │   ├── modules/     # Feature modules
│   │   │   ├── auth/    # Authentication
│   │   │   ├── menu/    # Menu management
│   │   │   ├── orders/  # Order processing
│   │   │   ├── tables/  # Table management
│   │   │   └── users/   # User management
│   │   └── prisma/      # Database service
│   └── prisma/          # Database schema
│
├── admin-panel/         # Admin Dashboard (Next.js)
├── cashier-terminal/    # Cashier Interface (Next.js)
├── customer-menu/       # Customer Menu (Next.js)
└── kitchen-display/     # Kitchen Display (Next.js)
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- MySQL 8+
- npm or yarn

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/kuramaOn/restaurant.git
cd restaurant
```

2. **Setup Backend**
```bash
cd restaurant-system/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start backend
npm run start:dev
```

3. **Setup Frontend Applications**

**Admin Panel:**
```bash
cd restaurant-system/admin-panel
npm install
npm run dev
```

**Cashier Terminal:**
```bash
cd restaurant-system/cashier-terminal
npm install
npm run dev
```

**Customer Menu:**
```bash
cd restaurant-system/customer-menu
npm install
npm run dev
```

**Kitchen Display:**
```bash
cd restaurant-system/kitchen-display
npm install
npm run dev
```

### **Quick Start (All Servers)**
```bash
cd restaurant-system
./START-SERVERS.bat  # Windows
```

## 🌐 Access Points

| Application | URL | Credentials |
|------------|-----|-------------|
| Backend API | http://localhost:3000/api | - |
| Admin Panel | http://localhost:3001 | admin@restaurant.com / admin123 |
| Cashier Terminal | http://localhost:3002 | admin@restaurant.com / admin123 |
| Customer Menu | http://localhost:3003 | No login required |
| Kitchen Display | http://localhost:3004 | chef@restaurant.com / chef123 |

## 📱 Mobile Features

The customer menu is fully optimized for mobile devices with:

- ✅ Responsive layouts (mobile/tablet/desktop)
- ✅ Touch-friendly buttons (44x44px minimum)
- ✅ Bottom navigation bar
- ✅ Pull-to-refresh functionality
- ✅ Swipeable bottom sheets
- ✅ Floating action button
- ✅ Gesture support
- ✅ iOS safe area support

## 🔧 Configuration

### **Environment Variables**

**Backend (.env)**
```env
DATABASE_URL="mysql://user:password@localhost:3306/restaurant"
JWT_SECRET="your-secret-key"
PORT=3000
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

## 🗄️ Database Schema

The system uses MySQL with Prisma ORM. Key entities:

- **Users** (Admin, Manager, Chef, Waiter, Customer)
- **Menu Items** (Categories, Items, Pricing)
- **Orders** (Order management, Status tracking)
- **Tables** (Table management, QR codes)
- **Payments** (Payment processing, Methods)

## 🔐 Authentication

- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing (bcrypt)
- Token refresh mechanism

## 🎨 Key Features

### **Payment Processing**
- Beautiful payment modal with order summary
- Multiple payment methods
- Tips calculator with quick % buttons
- Change calculator for cash payments
- Payment status tracking (PAID/UNPAID)

### **Real-time Updates**
- Live order updates via WebSockets
- Kitchen display real-time notifications
- Order status synchronization

### **Mobile Optimization**
- Pull-to-refresh on menu
- Bottom navigation for easy access
- Floating cart button with badge
- Touch-optimized interactions
- Gesture support

## 📊 API Endpoints

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### **Menu**
- `GET /api/menu/categories` - Get categories
- `GET /api/menu/items` - Get menu items
- `POST /api/menu/items` - Create item (Admin)

### **Orders**
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update status
- `PATCH /api/orders/:id/payment` - Process payment

### **Tables**
- `GET /api/tables` - Get all tables
- `POST /api/tables` - Create table
- `PATCH /api/tables/:id` - Update table

## 🧪 Testing

```bash
# Backend tests
cd restaurant-system/backend
npm run test

# Frontend tests
cd restaurant-system/customer-menu
npm run test
```

## 🚢 Deployment

### **Backend (Node.js)**
Deploy to:
- Heroku
- Railway
- DigitalOcean
- AWS EC2

### **Frontend (Next.js)**
Deploy to:
- Vercel (Recommended)
- Netlify
- AWS Amplify

### **Database**
- MySQL on Railway
- PlanetScale
- AWS RDS

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

Created by kuramaOn

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@restaurant.com or open an issue in the repository.

## 🎯 Roadmap

- [ ] PWA support (offline mode)
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Multi-restaurant support
- [ ] Loyalty program
- [ ] Online payment integration (Stripe, PayPal)
- [ ] Delivery tracking

## 🙏 Acknowledgments

Built with modern web technologies and best practices for restaurant management.

---

**⭐ Star this repo if you find it helpful!**
