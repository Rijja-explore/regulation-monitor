@echo off
REM Complete System Setup Script for Windows
REM Run this to set up both frontend and backend

echo.
echo ========================================
echo   Agentic Compliance Platform Setup
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: Please run this script from the project root directory
    exit /b 1
)

REM Install Frontend Dependencies
echo.
echo [1/3] Installing Frontend Dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo Error: Frontend installation failed
    exit /b 1
)

echo Frontend dependencies installed successfully
echo.

REM Install Backend Dependencies
echo [2/3] Installing Backend Dependencies...
cd backend

REM Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Python is not installed
    echo Please install Python 3.9+ from https://www.python.org/
    exit /b 1
)

echo Using Python:
python --version

REM Install requirements
python -m pip install -r requirements.txt

if %ERRORLEVEL% NEQ 0 (
    echo Error: Backend installation failed
    exit /b 1
)

echo Backend dependencies installed successfully
echo.

REM Create .env file if it doesn't exist
echo [3/3] Configuring environment...
if not exist ".env" (
    copy .env.example .env
    echo Created .env from .env.example
)

cd ..

REM Summary
echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To start the system:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   python main.py
echo.
echo Terminal 2 (Frontend):
echo   npm start
echo.
echo Then visit:
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:8000/docs
echo.
echo Happy Compliance Monitoring!
echo.
pause
