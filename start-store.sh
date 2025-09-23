#!/bin/bash

# AGROF E-Commerce Store Quick Start Script
# This script starts both the backend and frontend for the AGROF store

echo "🚀 Starting AGROF E-Commerce Store..."
echo "=================================="

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

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BACKEND_DIR="$SCRIPT_DIR/store-backend"
FRONTEND_DIR="$SCRIPT_DIR/agrof-main/mobile/app"

echo "📁 Backend directory: $BACKEND_DIR"
echo "📁 Frontend directory: $FRONTEND_DIR"

# Check if directories exist
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found: $BACKEND_DIR"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Frontend directory not found: $FRONTEND_DIR"
    exit 1
fi

# Function to start backend
start_backend() {
    echo "🔧 Starting backend server..."
    cd "$BACKEND_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing backend dependencies..."
        npm install
    fi
    
    echo "🚀 Starting backend on http://localhost:3001"
    npm run dev &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
}

# Function to start frontend
start_frontend() {
    echo "⏳ Waiting for backend to start..."
    sleep 5
    
    echo "📱 Starting frontend..."
    cd "$FRONTEND_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
    fi
    
    echo "🚀 Starting Expo development server..."
    npm start
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "✅ Backend stopped"
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start services
start_backend
start_frontend

# Wait for user to stop
echo ""
echo "✅ Both services are running!"
echo "🌐 Backend: http://localhost:3001"
echo "📱 Frontend: Expo development server"
echo ""
echo "Press Ctrl+C to stop all services"
wait


