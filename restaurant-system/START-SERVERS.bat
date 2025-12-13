@echo off
echo ========================================
echo Starting Restaurant Management System
echo ========================================
echo.

echo Starting Backend Server (Port 3000)...
start "Backend Server" cmd /k "cd backend && npm run start:dev"
timeout /t 3

echo Starting Admin Panel (Port 3001)...
start "Admin Panel" cmd /k "cd admin-panel && npm run dev"
timeout /t 2

echo Starting Kitchen Display (Port 3002)...
start "Kitchen Display" cmd /k "cd kitchen-display && npm run dev"
timeout /t 2

echo Starting Customer Menu (Port 3003)...
start "Customer Menu" cmd /k "cd customer-menu && npm run dev"

echo.
echo ========================================
echo All servers started!
echo ========================================
echo Backend API: http://localhost:3000/api
echo Admin Panel: http://localhost:3001
echo Kitchen Display: http://localhost:3002
echo Customer Menu: http://localhost:3003
echo.
echo Press any key to exit...
pause > nul
