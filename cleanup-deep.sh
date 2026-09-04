#!/bin/bash

echo "🧹 AGROF Deep Cleanup Script"
echo "============================"

# Navigate to project directory
cd "$(dirname "$0")"

echo "📊 Current project size:"
du -sh .

echo ""
echo "🗑️  Removing regeneratable files..."

# Remove node_modules (can be reinstalled)
echo "   - Removing node_modules..."
rm -rf agrof-main/mobile/app/node_modules

# Remove build artifacts
echo "   - Removing build artifacts..."
rm -rf agrof-main/mobile/app/.expo
rm -rf agrof-main/mobile/app/dist

# Remove Python cache and virtual environments
echo "   - Removing Python artifacts..."
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "*.pyc" -type f -delete 2>/dev/null || true
rm -rf agrof-main/src/api/enhanced_ai_env
rm -rf agrof-main/src/api/venv

# Remove store-backend node_modules
echo "   - Removing store-backend node_modules..."
rm -rf store-backend/node_modules

# Remove log files
echo "   - Removing log files..."
find . -name "*.log" -type f -delete 2>/dev/null || true

# Remove temporary files
echo "   - Removing temporary files..."
find . -name "*.tmp" -type f -delete 2>/dev/null || true
find . -name "*.temp" -type f -delete 2>/dev/null || true

echo ""
echo "📊 Project size after cleanup:"
du -sh .

echo ""
echo "✅ Deep cleanup completed!"
echo ""
echo "💡 To restore dependencies:"
echo "   cd agrof-main/mobile/app && npm install"
echo "   cd ../../../store-backend && npm install"
echo ""
echo "🚀 To build and deploy:"
echo "   ./deploy-firebase.sh"
