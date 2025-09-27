#!/bin/bash

# AGROF Store Backend Server Status Checker

echo "🔍 Checking AGROF Store Backend Server Status..."
echo "================================================"

# Check if server process is running
if pgrep -f "node server.js" > /dev/null; then
    echo "✅ Server process is running"
    echo "   PID: $(pgrep -f 'node server.js')"
else
    echo "❌ Server process is NOT running"
    echo "   Start with: ./start-server.sh"
    exit 1
fi

# Test localhost connectivity
echo ""
echo "🌐 Testing server connectivity..."

# Test health endpoint
if curl -s "http://localhost:3001/api/health" > /dev/null; then
    echo "✅ localhost:3001 - Health check passed"
else
    echo "❌ localhost:3001 - Health check failed"
fi

# Test products endpoint
if curl -s "http://localhost:3001/api/products?category=fertilizers" | jq -e '. | length > 0' > /dev/null 2>&1; then
    echo "✅ localhost:3001 - Products API working"
    PRODUCT_COUNT=$(curl -s "http://localhost:3001/api/products?category=fertilizers" | jq 'length')
    echo "   📦 Found $PRODUCT_COUNT fertilizer products"
else
    echo "❌ localhost:3001 - Products API failed"
fi

# Test network IP (if available)
NETWORK_IP=$(hostname -I | awk '{print $1}')
if [ ! -z "$NETWORK_IP" ]; then
    echo ""
    echo "🌐 Testing network connectivity..."
    if curl -s "http://$NETWORK_IP:3001/api/health" > /dev/null 2>&1; then
        echo "✅ $NETWORK_IP:3001 - Network accessible"
        echo "   Your React Native app can use: http://$NETWORK_IP:3001/api"
    else
        echo "⚠️  $NETWORK_IP:3001 - Not accessible from network"
        echo "   App will use localhost fallback"
    fi
fi

echo ""
echo "📱 React Native App Status:"
echo "   - Should connect to localhost:3001 automatically"
echo "   - All APIs should work now"
echo "   - Cart, products, and health checks should pass"

echo ""
echo "🛠️  Troubleshooting:"
echo "   - If app still fails, restart the React Native app"
echo "   - Check that you're on the same network"
echo "   - Use NetworkConfigScreen to test URLs manually"
