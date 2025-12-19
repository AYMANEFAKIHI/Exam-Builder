# Deployment Guide

## Overview
This application consists of two parts:
- **Frontend**: React + Vite application
- **Backend**: Node.js + Express API with PostgreSQL

## Option 1: Deploy Backend and Frontend Separately (Recommended)

### Backend Deployment (Railway/Render/Heroku)

1. **Deploy to Railway** (Recommended):
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   cd backend
   railway init
   railway up
   
   # Add PostgreSQL database
   railway add postgresql
   
   # Set environment variables in Railway dashboard
   ```

2. **Required Environment Variables for Backend**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Your JWT secret key
   - `PORT`: 3000 (or Railway assigns automatically)

3. **Get your backend URL** (e.g., `https://your-app.railway.app`)

### Frontend Deployment (Vercel)

1. **Configure Environment Variable in Vercel**:
   - Go to your Vercel project settings
   - Add Environment Variable:
     - Name: `VITE_API_URL`
     - Value: `https://your-backend-url.railway.app/api`

2. **Deploy**:
   - Vercel will auto-deploy from GitHub
   - Or trigger manually from Vercel dashboard

## Option 2: Deploy Everything on One Platform

### Deploy on Render

1. Create a new Web Service for the backend
2. Create a new Static Site for the frontend
3. Add PostgreSQL database
4. Configure environment variables

## Environment Variables Summary

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=production
```

### Frontend (Vercel Environment Variables)
```env
VITE_API_URL=https://your-backend-url.com/api
```

## Testing Your Deployment

1. Visit your frontend URL
2. Try to register/login
3. Check browser console for any API errors
4. Verify backend logs for incoming requests

## Common Issues

### API 404 Errors
- Ensure `VITE_API_URL` is set in Vercel
- Verify backend is running and accessible
- Check CORS settings in backend

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL database is running
- Check firewall/network settings

## Quick Start for Local Development

```bash
# Install dependencies
npm run install-all

# Start backend (in one terminal)
npm run dev:backend

# Start frontend (in another terminal)
npm run dev:frontend

# Or start both together
npm run dev
```
