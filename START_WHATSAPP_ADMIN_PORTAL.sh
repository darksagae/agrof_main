#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 STARTING AGROF WHATSAPP ADMIN PORTAL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Admin Number: 256743232441"
echo "🔐 Secret Triggers Ready:"
echo "   👁️  godeye  - News Control"
echo "   🌀 void    - Store Management"
echo "   ✨ destiny - Market Control"
echo "   🔮 oracle  - Analytics"
echo "   🛡️  guardian - Customer Management"
echo "   🔥 phoenix - System Operations"
echo "   ⚡ nexus   - Automation Control"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd /home/darksagae/Desktop/agrof-auto/whatsapp-bot

echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "🔄 Starting WhatsApp Bot..."
echo ""
echo "⏳ Wait for QR code to appear..."
echo "📱 Then scan with WhatsApp Business app"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

node bot.js
