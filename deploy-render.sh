#!/bin/bash

# AGROF Deployment Script for Render
echo "🚀 Deploying AGROF to Render..."

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI not found. Installing..."
    curl -fsSL https://cli.render.com/install | sh
    export PATH="$PATH:$HOME/.render/bin"
fi

# Login to Render (if not already logged in)
echo "🔐 Logging into Render..."
render auth login

echo ""
echo "📋 Deployment Options:"
echo "1. Deploy AI Backend (Python Flask)"
echo "2. Deploy Store Backend (Node.js)"
echo "3. Deploy Both Backends"
echo "4. Exit"
echo ""

read -p "Choose an option (1-4): " choice

case $choice in
    1)
        echo "🚀 Deploying AI Backend to Render..."
        cd agrof-main/src/api
        render services create --name agrof-ai-api --type web --env python --build-command "pip install -r requirements.txt" --start-command "gunicorn app:app --bind 0.0.0.0:\$PORT"
        ;;
    2)
        echo "🚀 Deploying Store Backend to Render..."
        cd store-backend
        render services create --name agrof-store-api --type web --env node --build-command "npm install" --start-command "npm start"
        ;;
    3)
        echo "🚀 Deploying Both Backends to Render..."
        
        echo "📦 Deploying AI Backend..."
        cd agrof-main/src/api
        render services create --name agrof-ai-api --type web --env python --build-command "pip install -r requirements.txt" --start-command "gunicorn app:app --bind 0.0.0.0:\$PORT"
        
        echo "📦 Deploying Store Backend..."
        cd ../../store-backend
        render services create --name agrof-store-api --type web --env node --build-command "npm install" --start-command "npm start"
        ;;
    4)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid option. Please choose 1-4."
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment initiated!"
echo "🌐 Check your Render dashboard for deployment status"
echo "📝 Note: You may need to configure environment variables in the Render dashboard"
echo "🔗 Your services will be available at:"
echo "   - AI Backend: https://agrof-ai-api.onrender.com"
echo "   - Store Backend: https://agrof-store-api.onrender.com"
