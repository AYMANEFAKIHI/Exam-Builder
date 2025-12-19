# Quick Start Guide

## 🎯 Getting Started in 5 Minutes

### Step 1: Prerequisites Check
Ensure you have installed:
- ✅ Node.js 18+ ([Download](https://nodejs.org/))
- ✅ PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- ✅ Git (optional)

### Step 2: Install Dependencies

**Option A - Using PowerShell script:**
```powershell
.\install.ps1
```

**Option B - Manual installation:**
```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd shared && npm install && cd ..
```

### Step 3: Setup PostgreSQL Database

1. Open PostgreSQL command line or pgAdmin
2. Create the database:
```sql
CREATE DATABASE exam_builder;
CREATE USER exam_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE exam_builder TO exam_user;
```

### Step 4: Configure Backend

1. Navigate to backend folder: `cd backend`
2. Copy environment file: `copy .env.example .env`
3. Edit `.env` with your settings:

```env
PORT=5000
NODE_ENV=development

# Update these with your PostgreSQL credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=exam_builder
DB_USER=exam_user
DB_PASSWORD=your_password

# Generate a random secret (e.g., use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_random_32_character_secret_here
JWT_EXPIRES_IN=24h

MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

CORS_ORIGIN=http://localhost:5173
```

### Step 5: Run the Application

**Development mode (both frontend & backend):**
```bash
npm run dev
```

**Or run separately:**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Step 6: Access the Application

- 🌐 Frontend: http://localhost:5173
- 🔧 Backend API: http://localhost:5000
- 📊 Health Check: http://localhost:5000/api/health

### Step 7: Create Your First Account

1. Navigate to http://localhost:5173
2. Click "Sign up"
3. Fill in your information
4. Start creating exams!

## 🛠️ Troubleshooting

### Database Connection Errors
```
Error: connect ECONNREFUSED
```
**Solution:** Ensure PostgreSQL is running and credentials in `.env` are correct.

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution:** Change PORT in `backend/.env` to a different number (e.g., 5001)

### Module Not Found
```
Error: Cannot find module
```
**Solution:** Run `npm install` in the project root and each package folder.

### CORS Errors
```
Access to fetch blocked by CORS policy
```
**Solution:** Ensure `CORS_ORIGIN` in `backend/.env` matches your frontend URL.

## 📚 Common Tasks

### Reset Database
```bash
cd backend
# Stop the server, then restart it
# Tables will be recreated automatically
npm run dev
```

### Check Database Tables
```sql
\c exam_builder  -- Connect to database
\dt              -- List all tables
SELECT * FROM users LIMIT 5;
```

### Clear Browser Cache
If you see outdated UI:
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### View Backend Logs
Backend logs appear in the terminal where you ran `npm run dev`

## 🎓 Next Steps

1. ✅ Create your first exam template
2. ✅ Add questions to your question bank
3. ✅ Try the LaTeX math feature
4. ✅ Export your first PDF
5. ✅ Explore advanced features

## 📞 Need Help?

- 📖 Full documentation: See README.md
- 🐛 Found a bug? Create an issue
- 💡 Have an idea? We'd love to hear it!

---

**Happy Exam Building! 📝✨**
