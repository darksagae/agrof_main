#!/bin/bash

echo "🧹 AGROF Project Cleanup Script"
echo "==============================="

# Navigate to project directory
cd "$(dirname "$0")"

echo "📋 Files to be removed:"
echo ""

# Remove test files (development/testing only)
echo "🗑️  Removing test files..."
rm -f test_*.js
rm -f test-language-switcher.html

# Remove documentation files (keep only essential ones)
echo "🗑️  Removing redundant documentation..."
rm -f ADVANCED_SYSTEM_IMPLEMENTATION.md
rm -f AGROF_SYSTEM_ANALYSIS_DOCUMENTATION.md
rm -f AI_COMMAND_SYSTEM_DOCUMENTATION.md
rm -f AI_REQUIREMENTS_SUMMARY.md
rm -f CHATBOT_API_CONFIGURATION.md
rm -f CHATBOT_GEMINI_FIX.md
rm -f CHATBOT_IMPORT_FIX.md
rm -f CHATBOT_IMPORT_FIX_SUMMARY.md
rm -f DEPLOYMENT_READY_SUMMARY.md
rm -f ENHANCED_AI_IMPLEMENTATION_SUMMARY.md
rm -f ENHANCED_DISEASE_DETECTION_AI_SYSTEM.md
rm -f GOOGLE_VISION_API_INTEGRATION.md
rm -f INSTALL_AI_REQUIREMENTS.md
rm -f LANGUAGE_SWITCHER_ACCESS_GUIDE.md
rm -f LANGUAGE_SWITCHER_FINAL_SUMMARY.md
rm -f LANGUAGE_SWITCHER_FINAL_WORKING_SOLUTION.md
rm -f LANGUAGE_SWITCHER_GUIDE.md
rm -f LANGUAGE_SWITCHER_SOLUTION.md
rm -f LANGUAGE_SWITCHER_SUCCESS_GUIDE.md
rm -f LANGUAGE_SWITCHER_WORKING_SOLUTION.md
rm -f MULTILINGUAL_IMPLEMENTATION_GUIDE.md
rm -f MULTILINGUAL_TROUBLESHOOTING.md
rm -f PRODUCT_RECOMMENDATION_IMPLEMENTATION.md
rm -f SETUP_INSTRUCTIONS.md
rm -f START_APP_GUIDE.md
rm -f supabase-migration-plan.md

# Remove old deployment scripts (keep Firebase deployment)
echo "🗑️  Removing old deployment scripts..."
rm -f deploy_render_enhanced.sh
rm -f deploy-render.sh
rm -f install_ai_requirements.sh
rm -f setup_enhanced_ai.sh

# Remove zip files
echo "🗑️  Removing zip files..."
rm -f console-sti-go-ug.zip

# Remove log files
echo "🗑️  Removing log files..."
rm -f store-backend/server.log

# Remove SSL certificates (if not needed for production)
echo "🗑️  Removing SSL certificates..."
rm -f client_private_key
rm -f client_public_key
rm -f client.conf

# Clean up node_modules in store-backend if it exists
if [ -d "store-backend/node_modules" ]; then
    echo "🗑️  Removing store-backend node_modules..."
    rm -rf store-backend/node_modules
fi

# Remove Python virtual environments (they can be recreated)
echo "🗑️  Removing Python virtual environments..."
rm -rf agrof-main/src/api/enhanced_ai_env
rm -rf agrof-main/src/api/venv

# Remove build artifacts
echo "🗑️  Removing build artifacts..."
rm -rf agrof-main/mobile/app/.expo
rm -rf agrof-main/mobile/app/dist

echo ""
echo "✅ Cleanup completed!"
echo ""
echo "📁 Essential files preserved:"
echo "   - agrof-main/ (main application)"
echo "   - store-backend/ (store backend)"
echo "   - firebase.json (Firebase config)"
echo "   - .firebaserc (Firebase project)"
echo "   - deploy-firebase.sh (deployment script)"
echo "   - FIREBASE_DEPLOYMENT_GUIDE.md (deployment guide)"
echo "   - README.md (main documentation)"
echo "   - package.json (dependencies)"
echo ""
echo "💡 To rebuild the app:"
echo "   cd agrof-main/mobile/app && npm run build:web"
echo ""
echo "🚀 To deploy:"
echo "   ./deploy-firebase.sh"
