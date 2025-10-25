#!/bin/bash

echo "🛑 Stopping any running WhatsApp bot processes..."
pkill -9 -f "node bot.js" 2>/dev/null
lsof -ti:3003 | xargs -r kill -9 2>/dev/null
pkill -9 -f "chrome.*whatsapp" 2>/dev/null

sleep 3

echo "🧹 Cleaning session data..."
cd /home/darksagae/Desktop/agrof-auto/whatsapp-bot
rm -rf whatsapp-session

sleep 2

echo "🚀 Starting AGROF WhatsApp Bot..."
echo "📱 A QR code will appear in ~10-15 seconds"
echo "⏰ You'll have 60 seconds to scan it before it refreshes"
echo ""

node bot.js


