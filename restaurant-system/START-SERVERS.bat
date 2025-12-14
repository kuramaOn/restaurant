@echo off
setlocal enabledelayedexpansion

:: ========================================
:: Restart and Start Restaurant System (Windows)
:: ========================================

echo ========================================
echo Restarting Restaurant Management System
echo ========================================
echo.

:: Optional: Kill existing Node.js processes (uncomment if needed)
:: echo Stopping existing Node.js processes...
:: taskkill /F /IM node.exe >nul 2>&1
:: timeout /t 2 >nul

:: Backend (NestJS) - Port 3000
set BACKEND_DIR=backend
echo Starting Backend Server (Port 3000)...
start "Backend Server" cmd /k "cd %BACKEND_DIR% && npm run start:dev"
timeout /t 3 >nul

:: Admin Panel (Next.js) - Port 3001
set ADMIN_DIR=admin-panel
echo Starting Admin Panel (Port 3001)...
start "Admin Panel" cmd /k "cd %ADMIN_DIR% && npm run dev -- -p 3001"
timeout /t 2 >nul

:: Kitchen Display (Next.js) - Port 3002
set KITCHEN_DIR=kitchen-display
echo Starting Kitchen Display (Port 3002)...
start "Kitchen Display" cmd /k "cd %KITCHEN_DIR% && npm run dev -- -p 3002"
timeout /t 2 >nul

:: Customer Menu (Next.js) - Port 3003
set CUSTOMER_DIR=customer-menu
echo Starting Customer Menu (Port 3003)...
start "Customer Menu" cmd /k "cd %CUSTOMER_DIR% && npm run dev -- -p 3003"
timeout /t 2 >nul

:: Cashier Terminal (Next.js) - Port 3005
set CASHIER_DIR=cashier-terminal
echo Starting Cashier Terminal (Port 3005)...
start "Cashier Terminal" cmd /k "cd %CASHIER_DIR% && npm run dev -- -p 3005"

echo.
echo ========================================
echo All servers started!
echo ========================================
echo Backend API:    http://localhost:3000/api
echo Admin Panel:    http://localhost:3001
echo Kitchen Display: http://localhost:3002
echo Customer Menu:  http://localhost:3003
echo Cashier:        http://localhost:3005
echo.
echo Tips:
echo - If ports are busy, close existing terminals or uncomment the taskkill block at the top.
echo - Make sure each app has its .env configured.
echo.
echo Press any key to exit this launcher...
pause >nul
endlocal
