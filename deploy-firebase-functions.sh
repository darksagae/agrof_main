#!/bin/bash

echo "🚀 Deploying Firebase Functions..."

# Navigate to project directory
cd "$(dirname "$0")"

echo "📦 Installing Functions dependencies..."
cd functions
npm install
cd ..

echo "🔥 Deploying Firebase Functions..."
npx firebase-tools@latest deploy --only functions

echo "🌐 Deploying Firebase Hosting..."
npx firebase-tools@latest deploy --only hosting

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your Firebase Functions URLs:"
echo "   - Store API: https://us-central1-agrof-ai-app.cloudfunctions.net/api"
echo "   - AI API: https://us-central1-agrof-ai-app.cloudfunctions.net/analyzeDisease"
echo "   - Health Check: https://us-central1-agrof-ai-app.cloudfunctions.net/aiHealth"
echo ""
echo "🔗 Update your frontend to use these URLs!"