#!/bin/bash

echo "🚀 AGROF Firebase Deployment Script"
echo "=================================="

# Check if Firebase CLI is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js and npm first."
    exit 1
fi

# Navigate to project directory
cd "$(dirname "$0")"

echo "📦 Building Expo app for web..."
cd agrof-main/mobile/app
npm run build:web

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Go back to project root
cd ../../..

echo "🔧 Firebase configuration:"
echo "   - Project: agrof-ai-app"
echo "   - Public directory: agrof-main/mobile/app/dist"
echo "   - Configuration: firebase.json"

echo ""
echo "📋 Next steps:"
echo "1. Run: npx firebase-tools@latest login"
echo "2. Run: npx firebase-tools@latest use agrof-ai-app"
echo "3. Run: npx firebase-tools@latest deploy --only hosting"
echo ""
echo "🌐 Your app will be available at: https://agrof-ai-app.web.app"
echo ""
echo "💡 Alternative: Use Firebase Console at https://console.firebase.google.com"
echo "   - Create a new project named 'agrof-ai-app'"
echo "   - Enable Firebase Hosting"
echo "   - Upload the contents of 'agrof-main/mobile/app/dist' folder"
