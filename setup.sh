#!/bin/bash

# Complete System Setup Script
# Run this to set up both frontend and backend

echo "🚀 Setting up Agentic Compliance Platform..."
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install Frontend Dependencies
echo ""
echo "📦 Installing Frontend Dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi

echo "✅ Frontend dependencies installed"

# Install Backend Dependencies
echo ""
echo "📦 Installing Backend Dependencies..."
cd backend

# Check if Python is installed
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python is not installed"
    echo "Please install Python 3.9+ from https://www.python.org/"
    exit 1
fi

# Use python3 if available, otherwise python
PYTHON_CMD="python"
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
fi

echo "Using Python: $($PYTHON_CMD --version)"

# Install requirements
$PYTHON_CMD -m pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi

echo "✅ Backend dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo ""
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "✅ Created .env from .env.example"
fi

cd ..

# Summary
echo ""
echo "=============================================="
echo "✅ Setup Complete!"
echo "=============================================="
echo ""
echo "To start the system:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  python main.py"
echo ""
echo "Terminal 2 (Frontend):"
echo "  npm start"
echo ""
echo "Then visit:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8000/docs"
echo ""
echo "🎉 Happy Compliance Monitoring!"
