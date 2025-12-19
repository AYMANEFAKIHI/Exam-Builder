# Installation Script for Windows PowerShell

Write-Host "🚀 Installing Exam Builder Platform..." -ForegroundColor Cyan

# Install root dependencies
Write-Host "`n📦 Installing root dependencies..." -ForegroundColor Yellow
npm install

# Install backend dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

# Install frontend dependencies
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

# Install shared dependencies
Write-Host "`n📦 Installing shared dependencies..." -ForegroundColor Yellow
Set-Location shared
npm install
Set-Location ..

Write-Host "`n✅ Installation complete!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Set up PostgreSQL database (see README.md)"
Write-Host "2. Configure backend/.env file"
Write-Host "3. Run: npm run dev"
