#!/usr/bin/env pwsh
# Start both frontend and backend servers

Write-Host "🚀 Starting Autonomous Compliance AI for Visa" -ForegroundColor Cyan
Write-Host ""

# Check if virtual environment exists
if (-not (Test-Path ".venv")) {
    Write-Host "❌ Virtual environment not found. Please run setup first." -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

# Start backend in a new PowerShell window
Write-Host "🔧 Starting Backend API (http://localhost:8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\.venv\Scripts\Activate.ps1; cd backend; python run.py"

# Wait for backend to start
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Test backend connection
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend may still be starting..." -ForegroundColor Yellow
}

# Start frontend in a new PowerShell window
Write-Host "🎨 Starting Frontend (http://localhost:3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✨ Autonomous Compliance AI is starting!" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Backend API:  http://localhost:8000" -ForegroundColor White
Write-Host "📍 Frontend UI:  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📖 API Docs:     http://localhost:8000/docs" -ForegroundColor Gray
Write-Host "🏥 Health:       http://localhost:8000/health" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop" -ForegroundColor Yellow
Write-Host ""
