# Deploy to Vercel (All-in-One)

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

## Step 3: Create Vercel Postgres Database

1. Go to https://vercel.com/dashboard
2. Click "Storage" in the sidebar
3. Click "Create Database"
4. Select "Postgres"
5. Name it: `exam-builder-db`
6. Click "Create"

## Step 4: Get Database Connection String

1. Click on your newly created database
2. Go to ".env.local" tab
3. Copy the `POSTGRES_URL` value

## Step 5: Set Environment Variables in Vercel

In your Vercel project settings, add these environment variables:

### Required Variables:
- `POSTGRES_URL`: (paste the connection string from Step 4)
- `JWT_SECRET`: `jwt-secret-exam-builder-2024-secure-key-a8f9d7e6c5b4a3`

## Step 6: Initialize Database Tables

Connect to your Vercel Postgres and run:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exams (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  components JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS question_bank (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS templates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  components JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Step 7: Deploy to Vercel

```bash
vercel --prod
```

Or push to GitHub and let Vercel auto-deploy!

## That's It!

Your app will be live at: `https://your-project.vercel.app`

Both frontend and backend API routes will work on the same domain.
