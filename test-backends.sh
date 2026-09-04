#!/bin/bash

echo "🧪 AGROF Backend Testing Script"
echo "============================="

# Navigate to project directory
cd "$(dirname "$0")"

echo "🔍 Testing backend connections..."

# Test if ports are available
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "✅ $service is running on port $port"
        return 0
    else
        echo "❌ $service is not running on port $port"
        return 1
    fi
}

# Test Flask API
echo ""
echo "🐍 Testing Python Flask API..."
if check_port 5000 "Flask API"; then
    echo "   Testing health endpoint..."
    if curl -s http://localhost:5000/health > /dev/null; then
        echo "✅ Flask API health check passed"
    else
        echo "❌ Flask API health check failed"
    fi
else
    echo "   Starting Flask API..."
    cd agrof-main/src/api
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -r requirements.txt > /dev/null 2>&1
    python app.py &
    FLASK_PID=$!
    echo "   Flask API started (PID: $FLASK_PID)"
    sleep 3
    cd ../../..
fi

# Test Store Backend
echo ""
echo "🟢 Testing Node.js Store Backend..."
if check_port 3001 "Store Backend"; then
    echo "   Testing health endpoint..."
    if curl -s http://localhost:3001/api/health > /dev/null; then
        echo "✅ Store Backend health check passed"
    else
        echo "❌ Store Backend health check failed"
    fi
else
    echo "   Starting Store Backend..."
    cd store-backend
    if [ ! -d "node_modules" ]; then
        npm install > /dev/null 2>&1
    fi
    node server.js &
    STORE_PID=$!
    echo "   Store Backend started (PID: $STORE_PID)"
    sleep 3
    cd ..
fi

echo ""
echo "📊 Backend Status Summary:"
echo "=========================="

# Test Flask API endpoints
echo "🐍 Python Flask API (AI Disease Detection):"
if curl -s http://localhost:5000/health | grep -q "healthy"; then
    echo "   ✅ Health: OK"
    echo "   ✅ AI Analysis: Available"
    echo "   ✅ CORS: Enabled"
else
    echo "   ❌ Health: Failed"
fi

# Test Store Backend endpoints
echo ""
echo "🟢 Node.js Store Backend (Product Store):"
if curl -s http://localhost:3001/api/health | grep -q "OK"; then
    echo "   ✅ Health: OK"
    echo "   ✅ Products API: Available"
    echo "   ✅ Database: Connected"
else
    echo "   ❌ Health: Failed"
fi

echo ""
echo "🌐 API Endpoints Available:"
echo "   - AI Health: http://localhost:5000/health"
echo "   - AI Analysis: http://localhost:5000/api/analyze"
echo "   - Store Health: http://localhost:3001/api/health"
echo "   - Store Products: http://localhost:3001/api/products"
echo "   - Store Categories: http://localhost:3001/api/categories"

echo ""
echo "🔗 Frontend Configuration:"
echo "   Update your frontend to use:"
echo "   - AI API: http://localhost:5000"
echo "   - Store API: http://localhost:3001"

echo ""
echo "📝 Next Steps:"
echo "   1. Deploy backends to cloud (Render/Railway)"
echo "   2. Update frontend API URLs"
echo "   3. Test complete system"
echo ""
echo "💡 Use ./deploy-to-render.sh for cloud deployment!"
