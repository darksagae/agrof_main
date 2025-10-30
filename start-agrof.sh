#!/bin/bash

# AGROF Quick Start Launcher
# One-command startup for AGROF app

echo "🚀 AGROF Quick Start"
echo "==================="

# Navigate to app directory
cd /home/darksagae/Desktop/agrof-auto/agrof-main/mobile/app

# Check if auto-start script exists
if [ -f "auto-start.sh" ]; then
    echo "✅ Found auto-start script"
    echo "🌐 Starting AGROF in web mode..."
    echo ""
    ./auto-start.sh --web
else
    echo "❌ Auto-start script not found"
    echo "🔄 Falling back to manual start..."
    npm start
fi

