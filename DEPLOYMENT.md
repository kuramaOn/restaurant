# Deployment Guide: Render (Backend) + Vercel (Frontend)

This guide explains how to deploy the Restaurant Management System with a NestJS backend on Render and a Next.js frontend on Vercel. The database is MySQL hosted on Railway.

## Overview
- Backend: NestJS + Prisma + MySQL (Railway)
- Frontend: Next.js 14 + TypeScript + Tailwind CSS
- DB: Railway (MySQL)

---

## 1) Backend on Render

### Prerequisites
- You have a Railway MySQL connection URL.
- Repo is pushed to GitHub.

### Files you must have (already added by this change):
- `restaurant-system/backend/Dockerfile`
- `restaurant-system/backend/render.yaml`
- `restaurant-system/backend/.dockerignore`
- `restaurant-system/backend/.env.example`
- Updated `restaurant-system/backend/package.json` (postinstall + start:prod)
- Updated `restaurant-system/backend/src/main.ts` (CORS via FRONTEND_URL)

### Render Setup Steps
1. Go to https://render.com and create a new Web Service.
2. Connect your GitHub repository.
3. In the service creation:
   - Root directory: `restaurant-system/backend`
   - Environment: Docker (Render will use Dockerfile)
   - Region: closest to DB
4. Add Environment Variables (Settings → Environment):
   - `DATABASE_URL` = your Railway URL
   - `JWT_SECRET` = a strong secret
   - `FRONTEND_URL` = your Vercel URL (e.g., https://restaurant-customer-menu.vercel.app)
   - `NODE_ENV` = production
   - `PORT` = 3000
5. Pre-deploy command (Deploy → Advanced):
   - `npx prisma migrate deploy`
6. Deploy the service.

### Notes
- Dockerfile installs openssl and runs `prisma generate` before building.
- Render health check can be `/api`.
- CORS is restricted to FRONTEND_URL plus local dev ports.

---

## 2) Frontend on Vercel (customer-menu)

### Files added:
- `restaurant-system/customer-menu/.env.local`
- `restaurant-system/customer-menu/.env.example`
- `restaurant-system/customer-menu/lib/api.ts`
- `restaurant-system/customer-menu/vercel.json`

### Vercel Setup Steps
1. Go to https://vercel.com/new and import the same GitHub repo.
2. Configure Project:
   - Framework: Next.js
   - Root Directory: `restaurant-system/customer-menu`
3. Environment Variables (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com/api` (replace)
   - `NEXT_PUBLIC_WS_URL` = `wss://your-backend.onrender.com`
4. Deploy.

### Update API Calls
- Import from `lib/api` and use the `API_URL` or `apiFetch` helper instead of hardcoding URLs.

---

## 3) Testing Checklist
- [ ] Render backend deploys successfully; logs show app listening on port 3000
- [ ] `GET https://<render-backend>/api/menu/items` returns data
- [ ] Vercel frontend builds and loads the app
- [ ] API calls use `NEXT_PUBLIC_API_URL`
- [ ] CORS works (no errors in browser console)
- [ ] WebSocket connects using `NEXT_PUBLIC_WS_URL`

---

## 4) Common Issues & Fixes
- CORS blocked: Ensure `FRONTEND_URL` on backend matches your Vercel domain exactly.
- Prisma errors: Run `npx prisma generate` and `npx prisma migrate deploy`; confirm `DATABASE_URL` is valid.
- 404 on API: Confirm backend global prefix `/api` and correct base URL on frontend.
- WebSocket failed: Use `wss://` in production.

---

## 5) Environment Variables Summary

Backend (Render):
- `DATABASE_URL` (Railway): mysql://root:***@switchyard.proxy.rlwy.net:41173/railway
- `JWT_SECRET`
- `FRONTEND_URL` (e.g., https://restaurant-customer-menu.vercel.app)
- `NODE_ENV=production`
- `PORT=3000`

Frontend (Vercel):
- `NEXT_PUBLIC_API_URL` (e.g., https://your-backend.onrender.com/api)
- `NEXT_PUBLIC_WS_URL` (e.g., wss://your-backend.onrender.com)

---

Done! Your backend is ready for Render with Docker, and your frontend is ready for Vercel using env-based API URLs.
