#!/bin/bash

echo "🚀 AGROF Backend Deployment Script"
echo "================================="

# Navigate to project directory
cd "$(dirname "$0")"

echo "📋 Available backend services:"
echo "   1. Python Flask API (AI Disease Detection) - Port 5000"
echo "   2. Node.js Store Backend (Product Store) - Port 3001"
echo ""

# Check if we're in the right directory
if [ ! -f "agrof-main/src/api/app.py" ] || [ ! -f "store-backend/server.js" ]; then
    echo "❌ Backend files not found. Please run from project root."
    exit 1
fi

echo "🔧 Setting up Python Flask API..."

# Install Python dependencies
cd agrof-main/src/api
if [ ! -d "venv" ]; then
    echo "   Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "   Activating virtual environment..."
source venv/bin/activate

echo "   Installing Python dependencies..."
pip install -r requirements.txt

echo "   Starting Flask API on port 5000..."
python app.py &
FLASK_PID=$!

echo "✅ Flask API started (PID: $FLASK_PID)"

# Go back to project root
cd ../../..

echo "🔧 Setting up Node.js Store Backend..."

# Install Node.js dependencies
cd store-backend
if [ ! -d "node_modules" ]; then
    echo "   Installing Node.js dependencies..."
    npm install
fi

echo "   Starting Store Backend on port 3001..."
node server.js &
STORE_PID=$!

echo "✅ Store Backend started (PID: $STORE_PID)"

# Go back to project root
cd ..

echo ""
echo "🎉 Both backends are now running!"
echo ""
echo "📊 Backend Status:"
echo "   - Flask API (AI): http://localhost:5000"
echo "   - Store Backend: http://localhost:3001"
echo ""
echo "🔗 API Endpoints:"
echo "   - Health Check: http://localhost:5000/health"
echo "   - Disease Analysis: http://localhost:5000/api/analyze"
echo "   - Store Products: http://localhost:3001/api/products"
echo "   - Store Health: http://localhost:3001/api/health"
echo ""
echo "🌐 Frontend Connection:"
echo "   - Update your frontend API URLs to point to these backends"
echo "   - AI API: http://localhost:5000"
echo "   - Store API: http://localhost:3001"
echo ""
echo "🛑 To stop backends:"
echo "   kill $FLASK_PID $STORE_PID"
echo ""
echo "📝 Logs:"
echo "   - Flask API logs will appear above"
echo "   - Store Backend logs will appear above"
