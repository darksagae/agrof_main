#!/bin/bash

# AGROF Docker Management Script
# Easy commands to manage your AGROF Docker containers

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
cat << 'EOF'
╔════════════════════════════════════════════╗
║        AGROF Docker Manager v1.0           ║
║     AI-Powered Agricultural Platform       ║
╚════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Function to check if Docker is running
check_docker() {
    if ! sudo docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
}

# Function to start containers
start() {
    echo -e "${GREEN}🚀 Starting AGROF services...${NC}"
    check_docker
    sudo docker compose up -d api store-backend automation-engine
    echo -e "${YELLOW}⏳ Waiting for services to initialize...${NC}"
    sleep 5
    status
}

# Function to stop containers
stop() {
    echo -e "${YELLOW}⏹️  Stopping AGROF services...${NC}"
    sudo docker compose down
    echo -e "${GREEN}✅ All services stopped${NC}"
}

# Function to restart containers
restart() {
    echo -e "${YELLOW}🔄 Restarting AGROF services...${NC}"
    stop
    sleep 2
    start
}

# Function to show status
status() {
    echo -e "${BLUE}📊 AGROF Services Status:${NC}"
    echo ""
    sudo docker compose ps
    echo ""
    
    echo -e "${BLUE}💾 Resource Usage:${NC}"
    sudo docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep agrof-auto
    echo ""
}

# Function to show logs
logs() {
    SERVICE=${1:-api}
    LINES=${2:-50}
    echo -e "${BLUE}📋 Showing logs for ${SERVICE} (last ${LINES} lines):${NC}"
    sudo docker compose logs --tail=${LINES} ${SERVICE}
}

# Function to test services
test() {
    echo -e "${BLUE}🧪 Testing AGROF Services:${NC}"
    echo ""
    
    # Test API
    echo -e "${YELLOW}Testing API Service (port 5000)...${NC}"
    if curl -f -s http://localhost:5000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ API Service: HEALTHY${NC}"
        curl -s http://localhost:5000/health | jq -r '"   Status: " + .status + " | " + .message'
    else
        echo -e "${RED}❌ API Service: FAILED${NC}"
    fi
    echo ""
    
    # Test Store Backend
    echo -e "${YELLOW}Testing Store Backend (port 3001)...${NC}"
    if curl -f -s http://localhost:3001/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Store Backend: HEALTHY${NC}"
        PRODUCT_COUNT=$(curl -s http://localhost:3001/api/products | jq 'length')
        echo -e "   Products loaded: ${PRODUCT_COUNT}"
    else
        echo -e "${RED}❌ Store Backend: FAILED${NC}"
    fi
    echo ""
    
    # Test Automation Engine
    echo -e "${YELLOW}Testing Automation Engine (port 3002)...${NC}"
    if curl -f -s --max-time 2 http://localhost:3002/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Automation Engine: HEALTHY${NC}"
    else
        echo -e "${YELLOW}⚠️  Automation Engine: Starting or Not Ready${NC}"
    fi
    echo ""
}

# Function to rebuild containers
rebuild() {
    echo -e "${YELLOW}🔨 Rebuilding AGROF services...${NC}"
    check_docker
    sudo docker compose down
    sudo docker compose build api store-backend automation-engine
    sudo docker compose up -d api store-backend automation-engine
    echo -e "${GREEN}✅ Rebuild complete${NC}"
    status
}

# Function to clean up
clean() {
    echo -e "${YELLOW}🧹 Cleaning up Docker resources...${NC}"
    sudo docker compose down -v
    echo -e "${GREEN}✅ Cleanup complete (volumes removed)${NC}"
}

# Function to show help
help() {
    echo -e "${GREEN}Usage:${NC} ./docker.sh [command]"
    echo ""
    echo -e "${YELLOW}Available commands:${NC}"
    echo "  start       - Start all AGROF services"
    echo "  stop        - Stop all AGROF services"
    echo "  restart     - Restart all AGROF services"
    echo "  status      - Show service status and resource usage"
    echo "  logs [svc]  - Show logs (api, store-backend, automation-engine)"
    echo "  test        - Test all service health endpoints"
    echo "  rebuild     - Rebuild and restart all services"
    echo "  clean       - Stop and remove all containers and volumes"
    echo "  help        - Show this help message"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./docker.sh start"
    echo "  ./docker.sh logs api"
    echo "  ./docker.sh logs store-backend 100"
    echo "  ./docker.sh test"
    echo ""
    echo -e "${GREEN}Service URLs:${NC}"
    echo "  API:        http://localhost:5000"
    echo "  Store:      http://localhost:3001"
    echo "  Automation: http://localhost:3002"
}

# Main command handler
case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    logs)
        logs $2 $3
        ;;
    test)
        test
        ;;
    rebuild)
        rebuild
        ;;
    clean)
        clean
        ;;
    help|--help|-h)
        help
        ;;
    *)
        if [ -z "$1" ]; then
            help
        else
            echo -e "${RED}❌ Unknown command: $1${NC}"
            echo ""
            help
            exit 1
        fi
        ;;
esac

