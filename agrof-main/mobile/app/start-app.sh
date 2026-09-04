#!/bin/bash

# AGROF App Startup Script
# Fixes file watchers limit and starts the app

echo "🚀 Starting AGROF App..."

# Increase file watchers limit temporarily
echo "📁 Increasing file watchers limit..."
echo 524288 | sudo tee /proc/sys/fs/inotify/max_user_watches > /dev/null

# Check if the limit was set
CURRENT_LIMIT=$(cat /proc/sys/fs/inotify/max_user_watches)
echo "✅ File watchers limit set to: $CURRENT_LIMIT"

# Start the app
echo "🌐 Starting web version on port 19006..."
echo "📱 App will be available at: http://localhost:19006"
echo ""

npx expo start --web --port 19006














