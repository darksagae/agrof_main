#!/bin/bash

# Start AGROF Store Backend locally for testing
echo "🚀 Starting AGROF Store Backend locally..."

# Navigate to store backend directory
cd /home/darksagae/Desktop/agrof-auto/store-backend

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the store backend
echo "🏪 Starting Store Backend on port 10000..."
echo "📱 Mobile app will connect to: http://localhost:10000"
echo "🤖 WhatsApp bot will connect to: http://localhost:10000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm start








