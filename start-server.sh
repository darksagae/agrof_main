#!/bin/bash

# AGROF Store Backend Server Management Script

echo "🚀 Starting AGROF Store Backend Server..."
echo "=========================================="

# Change to the backend directory
cd /home/darksagae/Desktop/saga/agrof1/store-backend

# Check if server is already running
if pgrep -f "node server.js" > /dev/null; then
    echo "⚠️  Server is already running!"
    echo "   PID: $(pgrep -f 'node server.js')"
    echo "   To stop: pkill -f 'node server.js'"
    echo "   To restart: pkill -f 'node server.js' && node server.js"
    exit 1
fi

# Start the server
echo "📦 Starting Node.js server..."
node server.js &

# Wait a moment for server to start
sleep 2

# Test the server
echo "🔍 Testing server connectivity..."
if curl -s "http://localhost:3001/api/health" > /dev/null; then
    echo "✅ Server is running successfully!"
    echo "   Health: http://localhost:3001/api/health"
    echo "   Products: http://localhost:3001/api/products"
    echo "   Cart: http://localhost:3001/api/cart"
    echo ""
    echo "🌐 Server accessible on:"
    echo "   - localhost:3001"
    echo "   - 127.0.0.1:3001"
    echo "   - Your network IP (if accessible)"
    echo ""
    echo "📱 Your React Native app should now work!"
else
    echo "❌ Server failed to start or is not responding"
    echo "   Check the server logs above for errors"
    exit 1
fi

echo ""
echo "🛑 To stop the server: pkill -f 'node server.js'"
echo "🔄 To restart: ./start-server.sh"
