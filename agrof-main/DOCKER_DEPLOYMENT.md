# 🐳 AGROF Docker Deployment Guide

Complete guide for building and deploying AGROF using Docker.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Building the Image](#building-the-image)
- [Running with Docker](#running-with-docker)
- [Running with Docker Compose](#running-with-docker-compose)
- [Deploying to Coolify](#deploying-to-coolify)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## 📦 Prerequisites

- Docker 20.10+ installed
- Docker Compose 2.0+ (optional, for multi-container setup)
- 2GB+ free disk space
- Internet connection for pulling base images

### Install Docker (if needed)

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

---

## 🚀 Quick Start

### 1. Build the Docker Image

```bash
# Simple build
./build-docker.sh

# Or manually
docker build -t agrof-backend:latest .
```

### 2. Run the Container

```bash
docker run -d \
  --name agrof-backend \
  -p 5000:5000 \
  -e GEMINI_API_KEY="your-api-key" \
  agrof-backend:latest
```

### 3. Test the API

```bash
# Check health
curl http://localhost:5000/health

# Test disease detection endpoint
curl http://localhost:5000/api/detect
```

---

## 🔨 Building the Image

### Option 1: Using the Build Script (Recommended)

```bash
# Build latest version
./build-docker.sh

# Build with custom tag
./build-docker.sh v1.0.0

# Build for development
./build-docker.sh dev development
```

### Option 2: Manual Docker Build

```bash
docker build \
  -t agrof-backend:latest \
  --build-arg BUILD_DATE="$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
  .
```

### View Built Images

```bash
docker images | grep agrof
```

---

## 🏃 Running with Docker

### Production Mode

```bash
docker run -d \
  --name agrof-backend \
  --restart unless-stopped \
  -p 5000:5000 \
  -e GEMINI_API_KEY="your-api-key" \
  -v $(pwd)/uploads:/app/uploads \
  -v $(pwd)/logs:/app/logs \
  agrof-backend:latest
```

### Development Mode

```bash
docker run -d \
  --name agrof-backend-dev \
  -p 5000:5000 \
  -e FLASK_ENV=development \
  -e FLASK_DEBUG=1 \
  -v $(pwd)/src:/app/src \
  agrof-backend:latest \
  python src/api/app.py
```

### View Logs

```bash
# Follow logs
docker logs -f agrof-backend

# Last 100 lines
docker logs --tail 100 agrof-backend
```

### Stop and Remove

```bash
docker stop agrof-backend
docker rm agrof-backend
```

---

## 🎼 Running with Docker Compose

### Production Deployment

```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Development Deployment

```bash
# Start with hot-reload
docker-compose -f docker-compose.dev.yml up

# Run in background
docker-compose -f docker-compose.dev.yml up -d
```

### Useful Docker Compose Commands

```bash
# View running services
docker-compose -f docker-compose.prod.yml ps

# Restart a service
docker-compose -f docker-compose.prod.yml restart backend

# View resource usage
docker-compose -f docker-compose.prod.yml top

# Remove all (including volumes)
docker-compose -f docker-compose.prod.yml down -v
```

---

## ☁️ Deploying to Coolify

### Step 1: Prepare Repository

```bash
# Ensure all Docker files are committed
git add Dockerfile .dockerignore docker-compose.prod.yml
git commit -m "Add Docker configuration"
git push origin main
```

### Step 2: Coolify Configuration

1. **Create New Resource** in Coolify
2. **Select Git Source**: Connect your GitHub repository
3. **Configuration**:
   - **Build Pack**: Docker
   - **Dockerfile Path**: `Dockerfile`
   - **Base Directory**: `/` or `.`
   - **Port**: `5000`

### Step 3: Environment Variables in Coolify

Add these in Coolify's Environment Variables section:

```
FLASK_ENV=production
GEMINI_API_KEY=your-actual-api-key-here
PORT=5000
WORKERS=4
```

### Step 4: Deploy

Click "Deploy" in Coolify dashboard. It will:
1. Clone your repository
2. Build the Docker image
3. Run the container
4. Expose it via reverse proxy

### Step 5: Verify Deployment

```bash
# Test the health endpoint
curl https://your-app.yourdomain.com/health
```

---

## 🔧 Environment Variables

### Required

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | *Required* |
| `PORT` | Application port | `5000` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_ENV` | Environment mode | `production` |
| `FLASK_DEBUG` | Debug mode | `0` |
| `WORKERS` | Gunicorn workers | `4` |
| `WORKER_TIMEOUT` | Worker timeout (seconds) | `120` |
| `LOG_LEVEL` | Logging level | `INFO` |
| `CORS_ORIGINS` | Allowed origins | `*` |

### Setting Environment Variables

**Docker Run:**
```bash
docker run -e GEMINI_API_KEY="your-key" -e WORKERS=8 agrof-backend:latest
```

**Docker Compose:**
```yaml
environment:
  - GEMINI_API_KEY=your-key
  - WORKERS=8
```

**From .env file:**
```bash
docker run --env-file env.production agrof-backend:latest
```

---

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs agrof-backend

# Check if port is already in use
lsof -i:5000

# Inspect container
docker inspect agrof-backend
```

### Build Fails

```bash
# Clean build cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t agrof-backend:latest .
```

### Can't Connect to API

```bash
# Check if container is running
docker ps | grep agrof

# Check port mapping
docker port agrof-backend

# Test from inside container
docker exec agrof-backend curl http://localhost:5000/health
```

### High Memory Usage

```bash
# Check resource usage
docker stats agrof-backend

# Limit resources
docker run --memory="2g" --cpus="2" agrof-backend:latest
```

### Permission Issues

```bash
# Fix volume permissions
sudo chown -R 1000:1000 uploads/ logs/ data/

# Or run as root (not recommended for production)
docker run --user root agrof-backend:latest
```

---

## 📊 Monitoring

### Health Checks

```bash
# Docker built-in health check
docker ps
# HEALTHY status indicates successful health checks

# Manual health check
curl http://localhost:5000/health
```

### Resource Usage

```bash
# Real-time stats
docker stats agrof-backend

# Disk usage
docker system df

# Container size
docker inspect agrof-backend --format='{{.Size}}'
```

---

## 🔄 Updates and Maintenance

### Update to Latest Version

```bash
# Pull latest code
git pull origin main

# Rebuild image
./build-docker.sh latest

# Recreate container
docker-compose -f docker-compose.prod.yml up -d --force-recreate
```

### Backup Data

```bash
# Backup volumes
docker run --rm \
  -v agrof-uploads:/data \
  -v $(pwd)/backup:/backup \
  alpine tar czf /backup/uploads-$(date +%Y%m%d).tar.gz /data
```

### Clean Up

```bash
# Remove unused images
docker image prune -a

# Remove stopped containers
docker container prune

# Full cleanup
docker system prune -a --volumes
```

---

## 📚 Additional Resources

- [Official Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Coolify Documentation](https://coolify.io/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)

---

## 🆘 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Docker logs: `docker logs agrof-backend`
3. Verify environment variables are set correctly
4. Ensure Docker and Docker Compose are up to date

---

**Happy Deploying! 🚀**

