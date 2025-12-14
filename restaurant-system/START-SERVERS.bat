@echo off
setlocal enabledelayedexpansion

:: ========================================
:: Restaurant Management System Launcher
:: ========================================

echo ========================================
echo Restaurant Management System Launcher
echo ========================================
echo.

:: Optional: Kill existing Node.js processes (uncomment if needed)
echo Stopping existing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

:: Backend (NestJS) - Port 3000
set BACKEND_DIR=backend
echo [1/5] Starting Backend Server (Port 3000)...
start "Backend API Server" cmd /k "cd %BACKEND_DIR% && npm run start:dev"
timeout /t 5 >nul

:: Admin Panel (Next.js) - Port 3001
set ADMIN_DIR=admin-panel
echo [2/5] Starting Admin Panel (Port 3001)...
start "Admin Panel" cmd /k "cd %ADMIN_DIR% && npm run dev"
timeout /t 3 >nul

:: Kitchen Display (Next.js) - Port 3002
set KITCHEN_DIR=kitchen-display
echo [3/5] Starting Kitchen Display (Port 3002)...
start "Kitchen Display" cmd /k "cd %KITCHEN_DIR% && npm run dev"
timeout /t 3 >nul

:: Customer Menu (Next.js) - Port 3003 or 3004
set CUSTOMER_DIR=customer-menu
echo [4/5] Starting Customer Menu (Port 3004)...
start "Customer Menu" cmd /k "cd %CUSTOMER_DIR% && npm run dev -- -p 3004"
timeout /t 3 >nul

:: Cashier Terminal (Next.js) - Port 3005
set CASHIER_DIR=cashier-terminal
echo [5/5] Starting Cashier Terminal (Port 3005)...
start "Cashier Terminal" cmd /k "cd %CASHIER_DIR% && npm run dev"

echo.
timeout /t 5 >nul
cls

:: ========================================
:: APPLICATION URLS AND FEATURES
:: ========================================

echo ================================================================================
echo                    RESTAURANT MANAGEMENT SYSTEM - READY
echo ================================================================================
echo.
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                           LOCAL DEVELOPMENT URLS                          ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
echo [BACKEND API]
echo   URL:  http://localhost:3000/api
echo   Docs: http://localhost:3000/api (REST API endpoints)
echo.
echo [ADMIN PANEL] - Restaurant Management
echo   URL:  http://localhost:3001
echo   Pages:
echo     - Dashboard           : /dashboard
echo     - Menu Management     : /dashboard/menu
echo     - Orders Management   : /dashboard/orders
echo     - Tables Management   : /dashboard/tables
echo     - QR Codes Generator  : /dashboard/qr-codes
echo     - Customer Management : /dashboard/customers
echo   Login: admin credentials required
echo.
echo [KITCHEN DISPLAY] - Order Preparation
echo   URL:  http://localhost:3002
echo   Features:
echo     - Real-time order updates (WebSocket)
echo     - Order status tracking (Pending, Preparing, Ready)
echo     - Timer for each order
echo     - Audio notifications
echo   Login: kitchen staff credentials
echo.
echo [CUSTOMER MENU] - Customer Ordering
echo   URL:  http://localhost:3004
echo   Pages:
echo     - Menu Browsing       : / (home)
echo     - Cart                : /cart
echo     - Order Tracking      : /order/[id]
echo   Features:
echo     - Browse menu by categories
echo     - Add items to cart with customizations
echo     - Place orders
echo     - Real-time order status updates
echo     - Mobile-responsive design
echo.
echo [CASHIER TERMINAL] - Point of Sale
echo   URL:  http://localhost:3005
echo   Features:
echo     - Process payments
echo     - Generate receipts
echo     - View active orders
echo     - Update order status
echo   Login: cashier credentials
echo.
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                           PRODUCTION URLS                                 ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
echo [BACKEND API - Render]
echo   https://restaurant-backend-v7lk.onrender.com/api
echo.
echo [CUSTOMER MENU - Vercel]
echo   https://customer-menu-324j08lx4-sukiorg0-gmailcoms-projects.vercel.app
echo.
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                           IMPORTANT NOTES                                 ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
echo 1. ENVIRONMENT FILES:
echo    - Each app needs .env or .env.local configured
echo    - Customer menu .env.local uses: http://localhost:3000/api
echo.
echo 2. DATABASE:
echo    - Backend connects to MySQL database
echo    - Run migrations: cd backend && npx prisma migrate dev
echo    - Seed data: cd backend && npm run prisma:seed
echo.
echo 3. CORS CONFIGURATION:
echo    - Backend allows origins: 3001, 3002, 3003, 3004, 3005
echo    - Production: configured via FRONTEND_URL env variable
echo.
echo 4. WEBSOCKET:
echo    - Orders module uses WebSocket for real-time updates
echo    - Kitchen display and customer menu receive live updates
echo.
echo 5. TROUBLESHOOTING:
echo    - If ports are busy, close terminal windows and restart
echo    - Check console logs in each terminal for errors
echo    - Verify .env files are properly configured
echo.
echo ================================================================================
echo.
echo All servers are running! Keep this window open.
echo Press any key to stop all servers and exit...
pause >nul

echo.
echo Stopping all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
echo All servers stopped.
timeout /t 2 >nul
endlocal
