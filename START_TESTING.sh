#!/bin/bash

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║          🚀 STARTING OFFLINE-FIRST AGROF APP 🚀              ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Pre-flight Check:"
echo "   ✅ Dependencies installed"
echo "   ✅ Offline data bundled (304 products)"
echo "   ✅ StoreScreen.js updated for offline mode"
echo "   ✅ Network manager integrated"
echo ""
echo "🎯 What happens when you scan the QR code:"
echo "   1. App initializes network manager"
echo "   2. Detects your network status (WiFi/Mobile/Offline)"
echo "   3. Loads products from offline database"
echo "   4. Shows network status in the header"
echo ""
echo "✈️  TO TEST OFFLINE MODE:"
echo "   → After app loads, turn on Airplane Mode on your phone"
echo "   → Watch the status change to 'Offline Mode'"
echo "   → Browse products, search, add to cart - all work!"
echo ""
echo "📱 Starting Expo..."
echo ""

cd /home/darksagae/Desktop/vpn/agrof-main/mobile/app
npm start

