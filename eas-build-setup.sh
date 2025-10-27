#!/bin/bash

# EAS Build Setup Script
# This script helps you set up EAS builds when you have network connectivity issues

echo "=========================================="
echo "EAS Build Setup"
echo "=========================================="
echo ""
echo "Step 1: Get your Expo access token"
echo "Visit: https://expo.dev/accounts/agrof/settings/access-tokens"
echo "Click 'Create Token' and copy it"
echo ""
read -p "Press Enter when you have the token..."

echo ""
read -sp "Paste your Expo access token: " EXPO_TOKEN
echo ""

# Export the token for this session
export EXPO_TOKEN="$EXPO_TOKEN"

# Navigate to the mobile app directory
cd /home/darksagae/Desktop/agrof-auto/agrof-main/mobile/app

echo ""
echo "Step 2: Attempting to verify authentication..."
echo ""

# Try to verify with eas whoami
npx eas whoami

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Authentication successful!"
    echo ""
    echo "You can now run EAS build commands:"
    echo "  npx eas build --platform android --profile preview"
    echo "  npx eas build --platform android --profile production"
    echo ""
else
    echo ""
    echo "✗ Authentication failed. Please check your token."
    echo ""
fi
