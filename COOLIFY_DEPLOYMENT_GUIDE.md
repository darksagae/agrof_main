# 🚀 AGROF Coolify Deployment on STI Server - Step by Step Guide

## ✅ Pre-Deployment Checklist

- [x] Docker image built successfully: `agrof-backend:latest` (844MB)
- [x] All Docker files committed to Git
- [x] Code pushed to GitHub: `darksagae/agrof_main` (branch: `feature/mobile-api-config`)
- [x] Dockerfile location: Root directory (`/Dockerfile`)
- [ ] VPN connection to STI server (WireGuard `agrof.conf`)
- [ ] Coolify dashboard access

---

## 📡 Step 1: Connect to STI Server via VPN

### Activate WireGuard VPN

```bash
# Navigate to VPN config location
cd /home/darksagae/Desktop/agrof-auto/data

# Start WireGuard VPN
sudo wg-quick up ./agrof.conf

# Verify connection
sudo wg show

# Test connection to STI server
ping <STI_SERVER_IP>
```

### Verify VPN Status
```bash
# Check if interface is up
ip addr show wg0

# Check routing
ip route | grep wg0
```

---

## 🎛️ Step 2: Access Coolify Dashboard

1. **Open Coolify in Browser**
   - URL: `http://<STI_SERVER_IP>:8000` or your Coolify domain
   - Login with your credentials

2. **Verify Workspace**
   - Ensure you're in the correct workspace/team
   - Check server status is "Connected"

---

## 🔧 Step 3: Create New Application in Coolify

### 3.1 Start New Resource

1. Click **"+ New"** or **"Add Resource"**
2. Select **"Application"**
3. Choose **"Git Repository"**

### 3.2 Connect GitHub Repository

1. **Source**: GitHub
2. **Repository**: `darksagae/agrof_main`
3. **Branch**: `feature/mobile-api-config`
4. Click **"Continue"**

### 3.3 Configure Build Settings

#### **General Settings:**
- **Name**: `agrof-backend` or `agrof-flask-api`
- **Server**: Select your STI server
- **Destination**: Select appropriate destination

#### **Build Configuration:**
- **Build Pack**: `Dockerfile`
- **Dockerfile Location**: `Dockerfile` (just the filename, not path)
- **Base Directory**: `.` or `/` or leave empty
- **Port**: `5000`

#### **Important Settings:**
```
Build Pack: Dockerfile
Dockerfile: Dockerfile
Base Directory: . (or empty)
Port Exposes: 5000
Port Mappings: 5000:5000
```

---

## 🔐 Step 4: Set Environment Variables

In Coolify's **Environment Variables** section, add:

### Required Variables:

```bash
FLASK_ENV=production
GEMINI_API_KEY=AIzaSyBE2b1nKpQd6LseRIVXfh10O_O3Pm0fvM0
PORT=5000
PYTHONUNBUFFERED=1
```

### Optional Variables:

```bash
WORKERS=4
WORKER_TIMEOUT=120
LOG_LEVEL=INFO
CORS_ORIGINS=*
```

### How to Add:
1. Click **"Environment Variables"** tab
2. Click **"+ Add Variable"**
3. Enter **Key** and **Value**
4. Click **"Save"**
5. Repeat for all variables

---

## 🚀 Step 5: Deploy!

1. **Click "Deploy"** button
2. **Monitor Build Logs** in real-time
3. **Wait for deployment** (~3-5 minutes for first build)

### Expected Build Process:

```
✅ Cloning repository from GitHub
✅ Checking out branch: feature/mobile-api-config
✅ Finding Dockerfile in root
✅ Building Docker image
   - Installing system dependencies (gcc, g++, curl, etc.)
   - Installing Python dependencies
   - Copying source code
   - Creating non-root user
   - Setting up health checks
✅ Creating container
✅ Starting application
✅ Health check passing
✅ Deployment successful!
```

---

## 🔍 Step 6: Verify Deployment

### Check Application Status

In Coolify Dashboard:
- **Status**: Should show "Running" (green)
- **Health Check**: Should show "Healthy"
- **Logs**: Should show gunicorn workers starting

### Test the API

```bash
# Get the application URL from Coolify
# It will be something like: https://agrof-backend.sti.yourdomain.com

# Test health endpoint
curl https://your-app-url/health

# Expected response:
# {"status": "OK", "service": "agrof-backend"}
```

---

## 📋 Coolify Configuration Checklist

### ✅ Git Source Settings:
- [ ] Repository: `darksagae/agrof_main` ✓
- [ ] Branch: `feature/mobile-api-config` ✓
- [ ] Auto-deploy on push: Enabled (optional)

### ✅ Build Settings:
- [ ] Build Pack: `Dockerfile` ✓
- [ ] Dockerfile Location: `Dockerfile` ✓
- [ ] Base Directory: `.` or empty ✓
- [ ] Docker Build Args: None needed ✓

### ✅ Network Settings:
- [ ] Port: `5000` ✓
- [ ] Public: Enabled ✓
- [ ] Domain: Auto-generated or custom ✓

### ✅ Environment Variables:
- [ ] `FLASK_ENV=production` ✓
- [ ] `GEMINI_API_KEY=<your-key>` ✓
- [ ] `PORT=5000` ✓
- [ ] `PYTHONUNBUFFERED=1` ✓

### ✅ Health Check:
- [ ] Enabled: Yes ✓
- [ ] Path: `/health` ✓
- [ ] Interval: 30s ✓

### ✅ Resources:
- [ ] Memory Limit: 2GB (recommended)
- [ ] CPU Limit: 2 cores (recommended)

---

## 🐛 Troubleshooting Common Issues

### Issue 1: "Dockerfile not found"

**Solutions:**
1. Verify Dockerfile is in repository root
2. Check Coolify settings:
   - Base Directory: `.` or empty
   - Dockerfile Location: `Dockerfile` (no leading slash)
3. Try creating a new application from scratch
4. Check branch is correct: `feature/mobile-api-config`

**Verify on GitHub:**
```bash
# Check the file exists in GitHub
https://github.com/darksagae/agrof_main/blob/feature/mobile-api-config/Dockerfile
```

### Issue 2: Build timeout

**Solutions:**
1. Increase build timeout in Coolify settings
2. Check build logs for specific errors
3. Verify internet connectivity from STI server

### Issue 3: Container fails to start

**Check logs in Coolify:**
- Look for Python errors
- Check if port 5000 is available
- Verify environment variables are set
- Check gunicorn workers are starting

### Issue 4: Health check failing

**Solutions:**
1. Wait 30-60 seconds after start
2. Check if app is listening on correct port
3. Verify `/health` endpoint exists
4. Check firewall rules on STI server

---

## 📊 Post-Deployment Verification

### 1. Check Application Logs

In Coolify:
- Go to your application
- Click "Logs" tab
- Look for:
  ```
  Starting gunicorn 23.0.0
  Listening at: http://0.0.0.0:5000
  Using worker: sync
  Booting worker with pid: ...
  ```

### 2. Test All Endpoints

```bash
# Health check
curl https://your-app-url/health

# API status
curl https://your-app-url/api/status

# Disease detection (requires image upload)
curl -X POST https://your-app-url/api/detect \
  -F "image=@/path/to/plant-image.jpg"
```

### 3. Monitor Resources

In Coolify Dashboard:
- CPU usage
- Memory usage
- Network traffic
- Response times

---

## 🔄 Update and Redeploy

### To update the application:

1. **Make changes locally**
2. **Commit and push:**
   ```bash
   cd /home/darksagae/Desktop/agrof-auto/agrof-main
   git add .
   git commit -m "Your update message"
   git push origin feature/mobile-api-config
   ```

3. **Coolify will auto-deploy** (if enabled)
   - Or click "Redeploy" button manually

---

## 🌐 Domain Configuration

### Option 1: Use Coolify's Auto-Generated Domain
- Default: `https://agrof-backend-xxxxx.sti.domain.com`
- Already SSL-enabled via Coolify

### Option 2: Custom Domain
1. In Coolify, go to **"Domains"** tab
2. Click **"+ Add Domain"**
3. Enter your custom domain: `api.agrof.com`
4. Coolify will generate SSL certificate automatically
5. Update DNS records to point to STI server

---

## 📱 Connect Mobile App to Deployed Backend

Once deployed, update your mobile app configuration:

**File**: `agrof-main/mobile/app/config/api.js` or similar

```javascript
const API_BASE_URL = 'https://your-deployed-url.sti.domain.com';

export default {
  baseURL: API_BASE_URL,
  diseaseDetection: `${API_BASE_URL}/api/detect`,
  plantAnalysis: `${API_BASE_URL}/api/analyze`,
  health: `${API_BASE_URL}/health`
};
```

---

## 📈 Monitoring and Maintenance

### View Real-Time Logs
```bash
# In Coolify dashboard
1. Go to your application
2. Click "Logs" tab
3. Logs will stream in real-time
```

### Restart Application
```bash
# In Coolify dashboard
1. Click "Restart" button
2. Wait for health check to pass
```

### Scale Resources
```bash
# In Coolify dashboard
1. Go to "Resources" tab
2. Adjust memory/CPU limits
3. Click "Save"
4. Redeploy
```

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Build completes without errors
- ✅ Container starts and stays running
- ✅ Health check passes (green status)
- ✅ `/health` endpoint returns 200 OK
- ✅ Application accessible via public URL
- ✅ API endpoints respond correctly
- ✅ Logs show gunicorn workers running

---

## 📞 Support and Resources

- **Coolify Docs**: https://coolify.io/docs
- **Docker Logs**: Available in Coolify dashboard
- **STI Server Access**: Via WireGuard VPN
- **GitHub Repo**: https://github.com/darksagae/agrof_main

---

## 🚨 Emergency Rollback

If deployment fails:

1. **In Coolify**: Click "Previous Deployments"
2. Select the last working deployment
3. Click "Redeploy this version"

Or:

1. **Revert Git commit locally**:
   ```bash
   git revert HEAD
   git push origin feature/mobile-api-config
   ```
2. **Coolify will auto-deploy** the reverted version

---

**Ready to Deploy!** 🚀

Follow the steps above one by one. Start with Step 1 (VPN connection) and proceed sequentially.


