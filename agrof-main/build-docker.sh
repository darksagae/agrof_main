#!/bin/bash

# ===================================
# AGROF Docker Build Script
# ===================================

set -e  # Exit on error

echo "🚀 AGROF Docker Build Script"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="agrof-backend"
IMAGE_TAG="${1:-latest}"
BUILD_MODE="${2:-production}"

echo -e "${BLUE}📦 Building Docker Image${NC}"
echo "  Image: $IMAGE_NAME:$IMAGE_TAG"
echo "  Mode: $BUILD_MODE"
echo ""

# Check if Dockerfile exists
if [ ! -f "Dockerfile" ]; then
    echo -e "${RED}❌ Dockerfile not found!${NC}"
    exit 1
fi

# Build the Docker image
echo -e "${YELLOW}🔨 Building image...${NC}"
docker build \
    -t "$IMAGE_NAME:$IMAGE_TAG" \
    -t "$IMAGE_NAME:latest" \
    --build-arg BUILD_DATE="$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
    --build-arg VCS_REF="$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')" \
    .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker image built successfully!${NC}"
    echo ""
    echo -e "${BLUE}📊 Image Details:${NC}"
    docker images | grep "$IMAGE_NAME" | head -2
    echo ""
    echo -e "${GREEN}✅ Build complete!${NC}"
    echo ""
    echo -e "${BLUE}📝 Next steps:${NC}"
    echo "  1. Test locally:"
    echo "     docker run -p 5000:5000 $IMAGE_NAME:$IMAGE_TAG"
    echo ""
    echo "  2. Or use Docker Compose:"
    echo "     docker-compose -f docker-compose.prod.yml up -d"
    echo ""
    echo "  3. Push to registry (if needed):"
    echo "     docker tag $IMAGE_NAME:$IMAGE_TAG your-registry/$IMAGE_NAME:$IMAGE_TAG"
    echo "     docker push your-registry/$IMAGE_NAME:$IMAGE_TAG"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

