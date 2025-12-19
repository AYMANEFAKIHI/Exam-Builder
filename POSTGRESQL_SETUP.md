# 🐘 PostgreSQL Setup Guide for Windows

Complete guide to install and configure PostgreSQL for the Exam Builder Platform.

---

## Table of Contents
1. [Download and Install PostgreSQL](#download-and-install-postgresql)
2. [Initial Configuration](#initial-configuration)
3. [Create Database and User](#create-database-and-user)
4. [Configure Backend Environment](#configure-backend-environment)
5. [Initialize Database Schema](#initialize-database-schema)
6. [Verify Connection](#verify-connection)
7. [Troubleshooting](#troubleshooting)

---

## Download and Install PostgreSQL

### Step 1: Download PostgreSQL

1. Visit the official PostgreSQL download page:
   ```
   https://www.postgresql.org/download/windows/
   ```

2. Click on **"Download the installer"** (by EnterpriseDB)

3. Choose the latest stable version:
   - **Recommended**: PostgreSQL 16.x or 15.x
   - Select **Windows x86-64** for 64-bit systems

4. Download the installer (approximately 300-400 MB)

### Step 2: Run the Installer

1. **Double-click** the downloaded `.exe` file

2. **Installation wizard steps:**

   **a. Setup Window**
   - Click **Next** to begin

   **b. Installation Directory**
   - Default: `C:\Program Files\PostgreSQL\16`
   - Click **Next** (keep default unless you have a reason to change)

   **c. Select Components**
   - ✅ PostgreSQL Server (required)
   - ✅ pgAdmin 4 (graphical management tool - recommended)
   - ✅ Stack Builder (optional - for extensions)
   - ✅ Command Line Tools (required for our project)
   - Click **Next**

   **d. Data Directory**
   - Default: `C:\Program Files\PostgreSQL\16\data`
   - Click **Next** (keep default)

   **e. Password** ⚠️ **IMPORTANT**
   - Set a password for the **postgres** superuser
   - **Write this down!** You'll need it later
   - Example: `admin123` (use a stronger password in production)
   - Re-enter password to confirm
   - Click **Next**

   **f. Port**
   - Default: `5432`
   - Click **Next** (keep default unless port is in use)

   **g. Locale**
   - Default: [Default locale]
   - Click **Next**

   **h. Summary**
   - Review your settings
   - Click **Next** to install

3. **Wait for installation** (2-5 minutes)

4. **Finish**
   - Uncheck "Launch Stack Builder" (not needed now)
   - Click **Finish**

---

## Initial Configuration

### Step 3: Verify Installation

1. **Open PowerShell** (regular user is fine for checking status)
   - Press `Win + X`
   - Select "Windows PowerShell" or "Terminal"

2. **Check PostgreSQL is running:**
   ```powershell
   Get-Service -Name postgresql*
   ```

   **Expected output:**
   ```
   Status   Name               DisplayName
   ------   ----               -----------
   Running  postgresql-x64-16  postgresql-x64-16 - PostgreSQL Server 16
   ```

3. **If service is not running, start it:**
   
   ⚠️ **Note:** Starting/stopping services requires Administrator privileges
   
   - Close PowerShell
   - Press `Win + X`
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"
   - Click "Yes" on UAC prompt
   - Then run:
   ```powershell
   Start-Service postgresql-x64-16
   ```

### Step 4: Add PostgreSQL to PATH (Optional but Recommended)

1. **Open Environment Variables:**
   - Press `Win + R`
   - Type `sysdm.cpl` and press Enter
   - Go to **Advanced** tab
   - Click **Environment Variables**

2. **Edit System PATH:**
   - Under "System variables", find **Path**
   - Click **Edit**
   - Click **New**
   - Add: `C:\Program Files\PostgreSQL\16\bin`
   - Click **OK** on all windows

3. **Restart PowerShell** to apply changes

4. **Test psql command:**
   ```powershell
   psql --version
   ```

   **Expected output:**
   ```
   psql (PostgreSQL) 16.x
   ```

---

## Create Database and User

### Step 5: Connect to PostgreSQL

**Option A: Using PowerShell (Command Line)**

1. **Open PowerShell** (regular user, not admin needed)

2. **Connect as postgres user:**
   
   **If you completed Step 4 (added PostgreSQL to PATH):**
   ```powershell
   psql -U postgres
   ```
   
   **If you skipped Step 4 or get "psql is not recognized" error:**
   ```powershell
   & "C:\Program Files\PostgreSQL\16\bin\psql" -U postgres
   ```

3. **Enter the password** you set during installation

4. You should see:
   ```
   psql (16.x)
   Type "help" for help.

   postgres=#
   ```

**Option B: Using pgAdmin 4 (Graphical Interface)**

1. **Launch pgAdmin 4** from Start Menu

2. **Set Master Password** (first time only)
   - Choose a password for pgAdmin
   - This is different from your PostgreSQL password

3. **Expand Servers** in left sidebar
   - Click on **PostgreSQL 16**
   - Enter your postgres password

4. **Open Query Tool:**
   - Right-click on **PostgreSQL 16**
   - Select **Query Tool**

### Step 6: Create Database and User

⚠️ **Important:** Make sure you're at the `postgres=#` prompt. If you see `postgres-#` or `postgres(#`, you have an incomplete command. Press `Ctrl+C` to cancel it.

**In psql or pgAdmin Query Tool, run these commands ONE BY ONE:**

```sql
-- Create the database
CREATE DATABASE exam_builder;

-- Create a dedicated user (replace 'your_secure_password_here' with your actual password)
CREATE USER exam_user WITH PASSWORD 'your_secure_password_here';

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE exam_builder TO exam_user;
```

**Now connect to the new database:**

⚠️ **Use `\c` command (backslash c), NOT `psql`**

```sql
\c exam_builder
```

**You should see:**
```
You are now connected to database "exam_builder" as user "postgres".
```

**Continue with schema privileges:**

```sql
-- Grant schema privileges (PostgreSQL 15+)
GRANT ALL ON SCHEMA public TO exam_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO exam_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO exam_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO exam_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO exam_user;
```

**Expected output after each command:**
```
CREATE DATABASE
CREATE ROLE
GRANT
You are now connected to database "exam_builder" as user "postgres".
GRANT
GRANT
GRANT
ALTER DEFAULT PRIVILEGES
ALTER DEFAULT PRIVILEGES
```

### Step 7: Verify Database Creation

**List all databases:**
```sql
\l
```

**You should see:**
```
                                                List of databases
     Name      |  Owner   | Encoding |   Collate   |    Ctype    | Access privileges
---------------+----------+----------+-------------+-------------+-------------------
 exam_builder  | postgres | UTF8     | English_... | English_... | =Tc/postgres     +
               |          |          |             |             | postgres=CTc/... +
               |          |          |             |             | exam_user=CTc/...
```

**Exit psql:**
```sql
\q
```

---

## Configure Backend Environment

### Step 8: Create .env File

1. **Navigate to backend folder:**
   ```powershell
   cd C:\Users\fayma\OneDrive\Desktop\professeur\backend
   ```

2. **Create .env file:**
   ```powershell
   New-Item -ItemType File -Name .env
   ```

3. **Open .env in your editor** (VS Code, Notepad, etc.)

4. **Add the following configuration:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=exam_builder
DB_USER=exam_user
DB_PASSWORD=your_secure_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_please
JWT_EXPIRES_IN=7d

# CORS Configuration (Frontend URL)
CORS_ORIGIN=http://localhost:5173

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

5. **Replace these values:**
   - `DB_PASSWORD`: Use the password you set for `exam_user`
   - `JWT_SECRET`: Generate a secure random string (see below)

### Step 9: Generate JWT Secret

**Option A: Using PowerShell**
```powershell
# Generate a random 64-character string
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

**Option B: Using Node.js**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option C: Online Generator**
- Visit: https://www.uuidgenerator.net/
- Generate a random string
- Use as JWT_SECRET

**Copy the generated string** and paste it as your `JWT_SECRET` value.

---

## Initialize Database Schema

### Step 10: Run Database Initialization

⚠️ **Important:** If you get "running scripts is disabled" error when running npm commands, see [Issue 0 in Troubleshooting](#issue-0-running-scripts-is-disabled-on-this-system-npmnode-commands) first.

1. **Ensure you're in the backend folder:**
   ```powershell
   cd C:\Users\fayma\OneDrive\Desktop\professeur\backend
   ```

2. **Install dependencies** (if not already done):
   ```powershell
   npm install
   ```
   
   **If you get execution policy error:**
   - Open PowerShell as Administrator
   - Run: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
   - Type `Y` to confirm
   - Close and reopen PowerShell as regular user
   - Try again

3. **Start the backend server:**
   ```powershell
   npm run dev
   ```

   **Expected output:**
   ```
   [nodemon] starting `ts-node src/index.ts`
   Database connected successfully
   Database initialized successfully
   Server running on http://localhost:5000
   ```

4. **Database tables are now created automatically!**

   The following tables have been created:
   - ✅ `users` - User accounts
   - ✅ `exams` - Exam papers
   - ✅ `question_bank` - Question library
   - ✅ `templates` - Header templates

### Step 11: Verify Tables Were Created

**Option A: Using psql**

**If PostgreSQL is in PATH:**
```powershell
psql -U exam_user -d exam_builder
```

**If not in PATH, use full path:**
```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql" -U exam_user -d exam_builder
```

Then run:
```sql
\dt
```

**Expected output:**
```
              List of relations
 Schema |      Name      | Type  |   Owner
--------+----------------+-------+-----------
 public | exams          | table | exam_user
 public | question_bank  | table | exam_user
 public | templates      | table | exam_user
 public | users          | table | exam_user
```

**Option B: Using pgAdmin 4**

1. Open pgAdmin 4
2. Navigate to: **PostgreSQL 16** > **Databases** > **exam_builder** > **Schemas** > **public** > **Tables**
3. You should see all 4 tables listed

---

## Verify Connection

### Step 12: Test the Full Setup

1. **Start Backend** (if not already running):
   ```powershell
   cd C:\Users\fayma\OneDrive\Desktop\professeur\backend
   npm run dev
   ```

2. **In a new terminal, start Frontend:**
   ```powershell
   cd C:\Users\fayma\OneDrive\Desktop\professeur\frontend
   npm run dev
   ```

3. **Open browser and go to:**
   ```
   http://localhost:5173
   ```

4. **Test Registration:**
   - Click "Register" or go to http://localhost:5173/register
   - Fill in the form:
     - Email: test@example.com
     - Password: test123
     - First Name: Test
     - Last Name: User
     - Institution: Test School
   - Click "Register"

5. onnect to database:**

**If PostgreSQL is in PATH:**
```powershell
psql -U exam_user -d exam_builder
```

**If not in PATH:**
```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql" -U exam_user -d exam_builder
```

**Then view users:**
```sqlVerify User in Database

**Check the users table:**
```sql
-- Connect to database
psql -U exam_user -d exam_builder

-- View users
SELECT id, email, first_name, last_name, institution, created_at FROM users;
```

**You should see your test user:**
```
                  id                  |      email       | first_name | last_name | institution | created_at
--------------------------------------+------------------+------------+-----------+-------------+------------
 123e4567-e89b-12d3-a456-426614174000 | test@example.com | Test       | User      | Test School | 2025-12-18...
```

---

## Troubleshooting

### Issue 0: "running scripts is disabled on this system" (npm/node commands)

**Error Message:**
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running 
scripts is disabled on this system.
```

**Cause:** Windows PowerShell execution policy blocks script execution for security.

**Solutions:**

**Option A: Change Execution Policy (Recommended for Development)**

1. **Open PowerShell as Administrator:**
   - Press `Win + X`
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"

2. **Check current policy:**
   ```powershell
   Get-ExecutionPolicy
   ```

3. **Set execution policy to RemoteSigned:**
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

4. **Confirm when prompted:** Type `Y` and press Enter

5. **Verify the change:**
   ```powershell
   Get-ExecutionPolicy
   ```
   Should show: `RemoteSigned`

6. **Close and reopen PowerShell** (regular user, not admin)

7. **Test npm command:**
   ```powershell
   npm --version
   ```

**Option B: Bypass for Current Session Only**

If you don't want to change the permanent policy:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

This only affects the current PowerShell window.

**Option C: Use Command Prompt Instead**

1. Open **Command Prompt** (cmd.exe) instead of PowerShell
2. Navigate to your project folder:
   ```cmd
   cd C:\Users\fayma\OneDrive\Desktop\professeur\backend
   ```
3. Run npm commands normally:
   ```cmd
   npm install
   npm run dev
   ```

**Option D: Use VS Code Terminal**

1. Open VS Code
2. Open Terminal (Ctrl + `)
3. If it uses PowerShell, switch to Command Prompt:
   - Click dropdown next to `+` in terminal
   - Select "Command Prompt"
4. Run npm commands

**Verification:**

After applying any solution, test with:
```powershell
npm --version
node --version or "psql is not recognized"

**Error Message:**
```
psql : The term 'psql' is not recognized as the name of a cmdlet, function, 
script file, or operable program.
```

**Cause:** PostgreSQL bin folder is not in your system PATH.

**Solutions:**

**Option A: Use Full Path (Quick Fix)**

Instead of `psql -U postgres`, use:

```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql" -U postgres
```

The `&` operator is required in PowerShell when the path contains spaces.

**Option B: Add to PATH Permanently (Recommended)**

Follow [Step 4](#step-4-add-postgresql-to-path-optional-but-recommended) to add PostgreSQL to your PATH. After that:
1. Close and reopen PowerShell
2. Run: `psql -U postgres` (without full path)

**Verification:**
```powershell
# Test if psql is accessible
psql --version
```

Should display: `psql (PostgreSQL) 16.x`

### Issue 1: "psql: command not found"

**Solution:**
- PostgreSQL bin folder not in PATH
- Use full path: `"C:\Program Files\PostgreSQL\16\bin\psql" -U postgres`
- Or follow [Step 4](#step-4-add-postgresql-to-path-optional-but-recommended) to add to PATH

### Issue 2: "Cannot open postgresql-x64-16 service" (Service management requires admin)

**Error Message:**
```
Stop-Service : Service 'postgresql-x64-16 (postgresql-x64-16)' cannot be 
stopped due to the following error: Cannot open postgresql-x64-16 service 
on computer '.'.
```

**Cause:** Managing Windows services (start, stop, restart) requires Administrator privileges.

**Solution:**

**Option A: Use PowerShell as Administrator**

1. **Close current PowerShell window**

2. **Open PowerShell as Administrator:**
   - Press `Win + X`
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"
   - Click "Yes" on UAC prompt

3. **Now you can manage the service:**
   ```powershell
   # Check status
   Get-Service postgresql*
   
   # Start if needed
   Start-Service postgresql-x64-16
   
   # Stop if needed
   Stop-Service postgresql-x64-16
   
   # Restart if needed
   Restart-Service postgresql-x64-16
   ```

**Option B: Use Services GUI (No Admin Needed)**

1. **Open Services:**
   - Press `Win + R`
   - Type `services.msc`
   - Press Enter

2. **Find PostgreSQL:**
   - Scroll to find "postgresql-x64-16"
   - Right-click on it
   - Select "Start", "Stop", or "Restart"

**Option C: Check if PostgreSQL is Already Running**

Before trying to manage the service, check if it's already working:

```powershell
# Test connection (no admin needed)
psql -U postgres
```

**If you get "psql is not recognized" error:**

PostgreSQL bin folder is not in your PATH. Use the full path instead:

```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql" -U postgres
```

Or add PostgreSQL to PATH by following [Step 4](#step-4-add-postgresql-to-path-optional-but-recommended), then try again.

**Important:** If the psql command works (with or without full path), your PostgreSQL is running correctly and you don't need to manage the service at all.

---

### Issue 3: "Connection refused" or "Could not connect to server"

**Solutions:**

**A. Check if PostgreSQL service is running:**
```powershell
# View service status (no admin needed)
Get-Service postgresql*
```

If status shows "Stopped", start it with admin rights:
```powershell
# Run PowerShell as Administrator, then:
Start-Service postgresql-x64-16
```

**B. Check if port 5432 is in use:**
```powershell
netstat -ano | findstr :5432
```

**C. Check Windows Firewall:**
- Open Windows Defender Firewall
- Allow PostgreSQL through firewall
- Or temporarily disable to test

### Issue 4: "password authentication failed for user"

**Solutions:**

**A. Reset postgres password:**
```powershell
# Run PowerShell as Administrator for service commands

# Stop PostgreSQL service
Stop-Service postgresql-x64-16

# Edit pg_hba.conf to trust local connections temporarily
# File location: C:\Program Files\PostgreSQL\16\data\pg_hba.conf
# Change: host all all 127.0.0.1/32 md5
# To:     host all all 127.0.0.1/32 trust

# Start service
Start-Service postgresql-x64-16

# Connect without password (in regular PowerShell)
psql -U postgres

# Change password
ALTER USER postgres WITH PASSWORD 'new_password';

# Exit
\q

# Revert pg_hba.conf changes back to md5

# Restart service (as Administrator)
Restart-Service postgresql-x64-16
```

**B. Verify .env has correct password:**
- Check backend/.env file
- Ensure DB_PASSWORD matches the password you set

### Issue 5: "Database initialization failed"

**Solution:**

**Manually run the initialization script:**

```sql
-- Connect to database
psql -U exam_user -d exam_builder

-- Run schema creation (copy from backend/src/database/init.ts)
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  institution VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  components JSONB NOT NULL DEFAULT '[]',
  total_points INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question Bank table
CREATE TABLE IF NOT EXISTS question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  component JSONB NOT NULL,
  tags TEXT[] DEFAULT '{}',
  difficulty VARCHAR(20),
  subject VARCHAR(255),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  header_component JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_exams_user_id ON exams(user_id);
CREATE INDEX IF NOT EXISTS idx_question_bank_user_id ON question_bank(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_is_public ON templates(is_public);
```

### Issue 6: "relation does not exist" errors

**Solution:**
- Tables not created properly
- Run the manual initialization from Issue 5 above
- Or restart backend server to trigger auto-initialization

### Issue 7: Port 5432 already in use

**Solution:**

**A. Change PostgreSQL port:**
1. Open: `C:\Program Files\PostgreSQL\16\data\postgresql.conf`
2. Find line: `port = 5432`
3. Change to: `port = 5433` (or another free port)
4. Restart PostgreSQL service (as Administrator)
5. Update backend/.env: `DB_PORT=5433`

**B. Or find and close the conflicting application:**
```powershell
netstat -ano | findstr :5432
# Note the PID (last column)
taskkill /PID <PID> /F
```

### Issue 8: Permission denied errors

**Solution:**
- Run PowerShell as Administrator when needed
- Or check user permissions:

```sql
-- Grant all privileges again
GRANT ALL PRIVILEGES ON DATABASE exam_builder TO exam_user;
\c exam_builder
GRANT ALL ON SCHEMA public TO exam_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO exam_user;
```

### Issue 9: "erreur de syntaxe sur ou près de « psql »" (Syntax error near psql)

**Error Message:**
```
ERREUR:  erreur de syntaxe sur ou près de « psql »
LIGNE 1 : psql -U exam_user -d exam_builder
```

**Cause:** You tried to run a PowerShell/terminal command inside the psql prompt.

**Explanation:**
- `psql -U exam_user -d exam_builder` is a **terminal command** (run in PowerShell)
- You're already **inside psql** (you see `postgres=#` prompt)
- You cannot run terminal commands inside psql

**Solution:**

**Option A: Switch Database Inside psql (Recommended)**

If you want to connect to a different database while in psql:

```sql
-- Use backslash-c command to switch databases
\c exam_builder

-- Or specify user and database
\c exam_builder exam_user
```

**Option B: Exit and Reconnect**

1. **Exit psql:**
   ```sql
   \q
   ```

2. **Reconnect to specific database:**
   ```powershell
   # If PostgreSQL is in PATH:
   psql -U exam_user -d exam_builder
   
   # If not in PATH:
   & "C:\Program Files\PostgreSQL\16\bin\psql" -U exam_user -d exam_builder
   ```

**Quick Reference:**

| You Want To... | Run In | Command |
|----------------|--------|---------|
| Connect to PostgreSQL | PowerShell | `psql -U postgres` |
| Switch database | Inside psql | `\c exam_builder` |
| Run SQL commands | Inside psql | `CREATE DATABASE ...;` |
| Exit psql | Inside psql | `\q` |
| Check where you are | Inside psql | `\conninfo` |

**How to Know Where You Are:**

```
PowerShell prompt:  PS C:\Users\fayma>         ← Run terminal commands here
psql prompt:        postgres=#                 ← Run SQL/psql commands here
Incomplete command: postgres-#  or postgres(#  ← Press Ctrl+C to cancel
```

---

## Additional Configuration (Optional)

### Enable Remote Connections

If you want to access PostgreSQL from another computer:

**1. Edit postgresql.conf:**
```
File: C:\Program Files\PostgreSQL\16\data\postgresql.conf

Find and change:
#listen_addresses = 'localhost'
To:
listen_addresses = '*'
```

**2. Edit pg_hba.conf:**
```
File: C:\Program Files\PostgreSQL\16\data\pg_hba.conf

Add this line:
host    all    all    0.0.0.0/0    md5
```

**3. Restart PostgreSQL:**
```powershell
Restart-Service postgresql-x64-16
```

### Install pgAdmin 4 Separately (if not installed)

1. Download from: https://www.pgadmin.org/download/pgadmin-4-windows/
2. Install and connect using:
   - Host: localhost
   - Port: 5432
   - Username: exam_user
   - Password: (your password)
   - Database: exam_builder

---

## Quick Reference Commands

### PowerShell Commands
```powershell
# Check PostgreSQL service status
Get-Service postgresql*

# Start PostgreSQL
Start-Service postgresql-x64-16

# Stop PostgreSQL
Stop-Service postgresql-x64-16

# Restart PostgreSQL
Restart-Service postgresql-x64-16

# Connect to database
psql -U exam_user -d exam_builder
```

### psql Commands (inside psql terminal)

⚠️ **Important:** These commands work ONLY when you're inside psql (at the `postgres=#` prompt)

**Meta Commands (start with backslash):**
```sql
-- List all databases
\l

-- Connect to a database
\c exam_builder

-- Connect to a database as specific user
\c exam_builder exam_user

-- List all tables
\dt

-- Describe a table
\d users

-- List all users/roles
\du

-- Show current connection info
\conninfo

-- Execute SQL file
\i path/to/file.sql

-- Quit psql
\q
```

**Note:** Commands starting with `\` are psql meta-commands, not SQL. They don't need semicolons.

### Useful SQL Queries
```sql
-- Count users
SELECT COUNT(*) FROM users;

-- View recent exams
SELECT id, title, created_at FROM exams ORDER BY created_at DESC LIMIT 10;

-- Clear all data (CAREFUL!)
TRUNCATE TABLE exams, question_bank, templates, users CASCADE;

-- Delete specific user and all their data
DELETE FROM users WHERE email = 'test@example.com';
```

---

## Next Steps

✅ PostgreSQL installed and configured  
✅ Database and user created  
✅ Backend environment configured  
✅ Database schema initialized  
✅ Connection verified  

**Now you can:**
1. Start building exams in the platform
2. Add questions to your question bank
3. Create reusable templates
4. Export exams as PDFs

**For more information:**
- Main README: [README.md](README.md)
- Quick Start: [QUICKSTART.md](QUICKSTART.md)
- Development Guide: [DEVELOPMENT.md](DEVELOPMENT.md)
- User Guide: [USER_GUIDE.md](USER_GUIDE.md)

---

**Happy teaching! 🎓📝**
