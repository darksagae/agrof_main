#!/bin/bash
echo "🖼️ Testing Image Serving - AGROF Store Backend"
echo "=============================================="
echo ""

IP="192.168.0.105"
PORT="3001"

echo "Testing: http://$IP:$PORT"
echo ""

# Test health
echo "1️⃣ Health Check:"
curl -s http://$IP:$PORT/api/health | python3 -m json.tool
echo ""

# Test a product
echo "2️⃣ Get Product with Image URL:"
curl -s http://$IP:$PORT/api/products?limit=1 | python3 -c "
import sys, json
p = json.load(sys.stdin)[0]
print(f'Product: {p[\"name\"]}')
print(f'Image URL: {p[\"image_url\"]}')
"
echo ""

# Test image serving
echo "3️⃣ Test Image Serving (with spaces):"
IMAGE_URL="http://$IP:$PORT/api/images/FUNGICIDES/1Kg%20Sulcop-tomatoes%20Fungicide/SULCOP_OSHO.jpeg"
echo "URL: $IMAGE_URL"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$IMAGE_URL")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Status: $HTTP_CODE OK - Images are working!"
else
    echo "❌ Status: $HTTP_CODE - Images NOT working!"
fi
echo ""

echo "✅ Test complete!"
