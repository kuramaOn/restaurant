@echo off
echo ========================================
echo   Preparing to Push to GitHub
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo Step 1: Checking current directory...
echo Current directory: %CD%
echo.

REM Check if .git exists
if exist ".git" (
    echo Git repository already initialized.
    echo.
) else (
    echo Initializing Git repository...
    git init
    echo.
)

REM Check for remote
git remote -v | findstr "origin" >nul 2>&1
if %errorlevel% neq 0 (
    echo Step 2: Adding GitHub remote...
    git remote add origin https://github.com/kuramaOn/restaurant.git
    echo Remote added!
    echo.
) else (
    echo GitHub remote already exists:
    git remote -v
    echo.
)

echo Step 3: Checking for sensitive data...
echo Searching for potential secrets (this may take a moment)...
echo.

REM Quick check for common secret patterns
findstr /S /I /C:"password" /C:"secret" /C:"api_key" *.env 2>nul
if %errorlevel% equ 0 (
    echo WARNING: Found potential secrets in .env files!
    echo Make sure .env files are in .gitignore
    echo Press Ctrl+C to cancel, or any key to continue...
    pause >nul
)

echo Step 4: Staging all files...
git add .
echo.

echo Step 5: Creating commit...
git commit -m "Initial commit: Restaurant Management System with mobile features"
echo.

echo Step 6: Setting main branch...
git branch -M main
echo.

echo ========================================
echo   Ready to Push!
echo ========================================
echo.
echo This will push to: https://github.com/kuramaOn/restaurant.git
echo.
echo Press any key to PUSH to GitHub, or Ctrl+C to cancel...
pause >nul

echo.
echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo.
    echo Your project has been pushed to GitHub!
    echo View it at: https://github.com/kuramaOn/restaurant
    echo.
) else (
    echo.
    echo ========================================
    echo   PUSH FAILED
    echo ========================================
    echo.
    echo Common issues:
    echo 1. Authentication failed - You may need to use a Personal Access Token
    echo    Go to: GitHub Settings ^> Developer settings ^> Personal access tokens
    echo.
    echo 2. Repository doesn't exist - Create it first on GitHub
    echo    Go to: https://github.com/new
    echo.
    echo 3. Remote already exists - Run: git remote remove origin
    echo.
)

echo.
echo Press any key to exit...
pause >nul
