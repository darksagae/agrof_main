#!/bin/bash

echo "🚀 Starting AGROF Mobile App..."
echo "📍 Location: /home/darksagae/Desktop/saga/agrof1/agrof-main/mobile/app"
echo ""

cd /home/darksagae/Desktop/saga/agrof1/agrof-main/mobile/app

echo "🔧 Installing dependencies..."
npm install

echo "🌍 Starting development server on port 8086..."
echo "📱 Language Switcher will be available in the top-right corner of the welcome screen"
echo ""

# Try different methods to start the app
echo "Method 1: Using npx expo start"
npx expo start --port 8086 --clear || {
    echo "Method 1 failed, trying Method 2..."
    echo "Method 2: Using npx react-native start"
    npx react-native start --port 8086 || {
        echo "Method 2 failed, trying Method 3..."
        echo "Method 3: Using npm start"
        npm start
    }
}
