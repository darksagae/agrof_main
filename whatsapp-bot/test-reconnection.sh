#!/bin/bash

echo "🧪 WhatsApp Bot Reconnection Test"
echo "=================================="
echo ""

BOT_URL="http://localhost:10000"

# Function to check bot status
check_status() {
    echo "📊 Checking bot status..."
    curl -s "$BOT_URL/whatsapp-status" | python3 -m json.tool
    echo ""
}

# Function to test reconnection
test_reconnection() {
    echo "🔄 Testing manual reconnection..."
    curl -s -X POST "$BOT_URL/whatsapp-reconnect" | python3 -m json.tool
    echo ""
}

# Function to test force reconnection
test_force_reconnection() {
    echo "🔄 Testing force reconnection..."
    curl -s -X POST "$BOT_URL/whatsapp-force-reconnect" | python3 -m json.tool
    echo ""
}

# Function to show dashboard
show_dashboard() {
    echo "📊 Admin Dashboard:"
    curl -s "$BOT_URL/admin/dashboard" | python3 -m json.tool
    echo ""
}

# Main test sequence
echo "1️⃣ Initial Status Check"
check_status

echo "2️⃣ Testing Manual Reconnection"
test_reconnection

echo "3️⃣ Waiting 5 seconds..."
sleep 5

echo "4️⃣ Status After Manual Reconnection"
check_status

echo "5️⃣ Testing Force Reconnection"
test_force_reconnection

echo "6️⃣ Waiting 5 seconds..."
sleep 5

echo "7️⃣ Final Status Check"
check_status

echo "8️⃣ Admin Dashboard"
show_dashboard

echo "✅ Reconnection test completed!"
echo ""
echo "💡 Tips:"
echo "  - If bot is offline, try: curl -X POST $BOT_URL/whatsapp-reconnect"
echo "  - For emergency reset: curl -X POST $BOT_URL/whatsapp-force-reconnect"
echo "  - Monitor continuously: node monitor-bot.js"





