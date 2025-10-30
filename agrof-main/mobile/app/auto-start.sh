#!/bin/bash

# AGROF Auto-Start Script
# Automatically sets up environment and starts the app

echo "🚀 AGROF Auto-Start Script"
echo "=========================="

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $port is already in use"
        return 1
    else
        echo "✅ Port $port is available"
        return 0
    fi
}

# Function to kill existing processes on ports
kill_port_processes() {
    local port=$1
    echo "🔍 Checking for processes on port $port..."
    local pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo "🔄 Killing existing processes on port $port..."
        echo $pids | xargs kill -9 2>/dev/null
        sleep 2
    fi
}

# Function to increase file watchers limit
setup_file_watchers() {
    echo "📁 Setting up file watchers..."
    
    # Check current limit
    local current_limit=$(cat /proc/sys/fs/inotify/max_user_watches 2>/dev/null || echo "0")
    echo "Current file watchers limit: $current_limit"
    
    # Set new limit if needed
    if [ "$current_limit" -lt 524288 ]; then
        echo "🔧 Increasing file watchers limit to 524288..."
        echo 524288 | sudo tee /proc/sys/fs/inotify/max_user_watches > /dev/null 2>&1
        
        # Verify the change
        local new_limit=$(cat /proc/sys/fs/inotify/max_user_watches 2>/dev/null || echo "0")
        if [ "$new_limit" -ge 524288 ]; then
            echo "✅ File watchers limit set to: $new_limit"
        else
            echo "⚠️  Could not set file watchers limit. You may need to run with sudo."
        fi
    else
        echo "✅ File watchers limit is already sufficient: $current_limit"
    fi
}

# Function to install dependencies if needed
check_dependencies() {
    echo "📦 Checking dependencies..."
    
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing dependencies..."
        npm install
    else
        echo "✅ Dependencies already installed"
    fi
}

# Function to start the app
start_app() {
    local port=$1
    local mode=$2
    
    echo "🌐 Starting AGROF app on port $port in $mode mode..."
    echo "📱 App will be available at: http://localhost:$port"
    echo ""
    echo "🔄 Starting Metro bundler..."
    echo "⏳ Please wait for the app to load..."
    echo ""
    
    if [ "$mode" = "web" ]; then
        npx expo start --web --port $port
    elif [ "$mode" = "mobile" ]; then
        npx expo start --port $port
    else
        npx expo start --port $port
    fi
}

# Main execution
main() {
    # Parse command line arguments
    local mode="web"
    local port=19006
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --mobile)
                mode="mobile"
                port=8086
                shift
                ;;
            --web)
                mode="web"
                port=19006
                shift
                ;;
            --port)
                port="$2"
                shift 2
                ;;
            --help)
                echo "Usage: $0 [--mobile|--web] [--port PORT]"
                echo "  --mobile    Start in mobile development mode (port 8086)"
                echo "  --web       Start in web mode (port 19006) - default"
                echo "  --port      Specify custom port"
                echo "  --help      Show this help message"
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    echo "🎯 Starting in $mode mode on port $port"
    echo ""
    
    # Setup environment
    setup_file_watchers
    check_dependencies
    
    # Clean up any existing processes
    kill_port_processes $port
    
    # Wait a moment for ports to be released
    sleep 1
    
    # Check if port is available
    if check_port $port; then
        start_app $port $mode
    else
        echo "❌ Port $port is still in use. Please try again or use a different port."
        exit 1
    fi
}

# Run main function with all arguments
main "$@"

