#!/bin/bash

# AGROF Local Testing Setup
# Starts all services locally for easy testing

echo "🚀 Starting AGROF Local Testing Environment"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the agrof-auto root directory"
    exit 1
fi

echo "📱 Starting WhatsApp Bot (Port 10000)..."
cd whatsapp-bot
npm start &
WHATSAPP_PID=$!
cd ..

echo "🏪 Starting Store Backend (Port 3001)..."
cd store-backend  
npm start &
STORE_PID=$!
cd ..

echo "🤖 Starting AI Backend (Port 5000)..."
cd agrof-main/src/api
python app.py &
AI_PID=$!
cd ../../..

echo "⚡ Starting Automation Engine (Port 3002)..."
cd automation-engine
npm start &
AUTOMATION_PID=$!
cd ..

echo ""
echo "✅ All services started!"
echo ""
echo "📊 Service Status:"
echo "• WhatsApp Bot: http://localhost:10000"
echo "• Store Backend: http://localhost:3001" 
echo "• AI Backend: http://localhost:5000"
echo "• Automation Engine: http://localhost:3002"
echo ""
echo "🧪 Testing Commands:"
echo "• Test WhatsApp Bot: curl http://localhost:10000/health"
echo "• Test Store API: curl http://localhost:3001/api/health"
echo "• Test AI API: curl http://localhost:5000/health"
echo "• Test Automation: curl http://localhost:3002/api/health"
echo ""
echo "📱 WhatsApp Bot Triggers:"
echo "• godeye - News Management"
echo "• void - Store Management"
echo "• destiny - Market Management"
echo "• oracle - Analytics"
echo "• guardian - Customer Management"
echo "• phoenix - System Operations"
echo "• nexus - Workflow Management"
echo "• cloud - User Activation"
echo ""
echo "🛑 To stop all services:"
echo "kill $WHATSAPP_PID $STORE_PID $AI_PID $AUTOMATION_PID"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap 'echo "🛑 Stopping all services..."; kill $WHATSAPP_PID $STORE_PID $AI_PID $AUTOMATION_PID 2>/dev/null; exit 0' INT

# Keep script running
wait
