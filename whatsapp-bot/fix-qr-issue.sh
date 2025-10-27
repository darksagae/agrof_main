#!/bin/bash

echo "🔧 WhatsApp Bot QR Code Issue Fixer"
echo "===================================="
echo ""

BOT_URL="http://localhost:10000"

# Function to check bot status
check_bot_status() {
    echo "📊 Checking bot status..."
    curl -s "$BOT_URL/whatsapp-status" | python3 -m json.tool
    echo ""
}

# Function to clear session and restart
clear_session() {
    echo "🗑️ Clearing session and restarting bot..."
    curl -s -X POST "$BOT_URL/whatsapp-clear-session" | python3 -m json.tool
    echo ""
}

# Function to force reconnection
force_reconnect() {
    echo "🔄 Forcing reconnection..."
    curl -s -X POST "$BOT_URL/whatsapp-force-reconnect" | python3 -m json.tool
    echo ""
}

# Function to show troubleshooting steps
show_troubleshooting() {
    echo "🔍 QR Code Troubleshooting Steps:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. 📱 PHONE SETUP:"
    echo "   • Use WhatsApp Business app (not regular WhatsApp)"
    echo "   • Make sure phone has internet connection"
    echo "   • Close and reopen WhatsApp Business"
    echo ""
    echo "2. 🔄 CLEAR SESSION:"
    echo "   • Run: curl -X POST $BOT_URL/whatsapp-clear-session"
    echo "   • Wait for new QR code to appear"
    echo "   • Scan the new QR code immediately"
    echo ""
    echo "3. ⏰ TIMING:"
    echo "   • QR codes expire in 60 seconds"
    echo "   • Scan immediately when it appears"
    echo "   • Don't wait too long between scanning"
    echo ""
    echo "4. 🌐 NETWORK:"
    echo "   • Ensure stable internet connection"
    echo "   • Check if localhost services are running"
    echo "   • Verify store-backend is accessible"
    echo ""
    echo "5. 🔧 DEBUGGING:"
    echo "   • Check bot logs for error messages"
    echo "   • Look for 'Authentication successful' message"
    echo "   • Monitor connection state changes"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Main menu
echo "What would you like to do?"
echo ""
echo "1. Check bot status"
echo "2. Clear session and restart"
echo "3. Force reconnection"
echo "4. Show troubleshooting steps"
echo "5. Run all fixes"
echo "6. Exit"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        check_bot_status
        ;;
    2)
        clear_session
        echo "⏳ Wait 5 seconds for bot to restart..."
        sleep 5
        check_bot_status
        ;;
    3)
        force_reconnect
        echo "⏳ Wait 3 seconds..."
        sleep 3
        check_bot_status
        ;;
    4)
        show_troubleshooting
        ;;
    5)
        echo "🚀 Running all fixes..."
        echo ""
        clear_session
        echo "⏳ Waiting 5 seconds..."
        sleep 5
        force_reconnect
        echo "⏳ Waiting 3 seconds..."
        sleep 3
        check_bot_status
        echo ""
        show_troubleshooting
        ;;
    6)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "💡 Next steps:"
echo "1. Watch the bot console for QR code"
echo "2. Scan QR code with WhatsApp Business"
echo "3. Wait for 'Bot is ready!' message"
echo "4. Test by sending a message to the bot"





