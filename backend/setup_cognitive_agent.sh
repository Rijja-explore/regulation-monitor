#!/bin/bash

# Cognitive Compliance Agent - Quick Setup Script
# For VISA Hackathon Demo

echo "🚀 Setting up Cognitive Compliance Agent Backend..."
echo ""

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Start the backend: uvicorn main:app --reload --port 8000"
echo "   2. Visit API docs: http://localhost:8000/docs"
echo "   3. Run tests: python test_cognitive_agent.py"
echo ""
echo "📚 Documentation:"
echo "   - Main README: ../README.md"
echo "   - Cognitive Agent: COGNITIVE_AGENT_README.md"
echo ""
