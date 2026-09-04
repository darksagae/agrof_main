#!/bin/bash

echo "🔥 Firebase Connection Script"
echo "============================"

# Navigate to project directory
cd "$(dirname "$0")"

echo "📋 Prerequisites check:"
echo ""

# Check if Firebase CLI is available
if command -v npx &> /dev/null; then
    echo "✅ npx is available"
else
    echo "❌ npx not found. Please install Node.js first."
    exit 1
fi

# Check Firebase CLI version
echo "🔧 Firebase CLI version:"
npx firebase-tools@latest --version

echo ""
echo "📋 Next steps to connect to Firebase:"
echo ""
echo "1️⃣  Create Firebase project:"
echo "   - Go to: https://console.firebase.google.com"
echo "   - Click 'Create a project' or 'Add project'"
echo "   - Name it: 'agrof-ai-app'"
echo "   - Enable Google Analytics (optional)"
echo ""
echo "2️⃣  Enable Firebase Hosting:"
echo "   - In Firebase Console, click 'Hosting'"
echo "   - Click 'Get started'"
echo "   - Follow the setup wizard"
echo ""
echo "3️⃣  Authenticate with Firebase CLI:"
echo "   npx firebase-tools@latest login"
echo ""
echo "4️⃣  Connect to your project:"
echo "   npx firebase-tools@latest use agrof-ai-app"
echo ""
echo "5️⃣  Deploy your app:"
echo "   ./deploy-firebase.sh"
echo ""
echo "🌐 Your app will be available at: https://agrof-ai-app.web.app"
echo ""
echo "💡 Need help? Check FIREBASE_CONNECTION_GUIDE.md for detailed instructions"
