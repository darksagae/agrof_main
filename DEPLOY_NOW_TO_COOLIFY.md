# 🚀 DEPLOY AGROF TO COOLIFY NOW - Quick Guide

## ✅ Current Status

- ✅ **VPN Connected**: `10.100.101.13` (AGROF interface UP)
- ✅ **Docker Image Built**: `agrof-backend:latest` (844MB)
- ✅ **Code Pushed to GitHub**: `darksagae/agrof_main` branch `feature/mobile-api-config`
- ✅ **Dockerfile Ready**: In repository root
- ✅ **All Configuration Files**: Committed and pushed

---

## 🎯 STEP-BY-STEP DEPLOYMENT (Do This Now!)

### 📋 Step 1: Access Coolify Dashboard

**Open your browser and navigate to Coolify:**

```
Possible URLs (try these in order):
1. http://10.100.100.1:8000
2. http://10.100.101.1:8000
3. https://coolify.sti.ac.ug (if custom domain exists)
4. Check your STI server documentation for exact URL
```

**Login** with your STI Coolify credentials.

---

### 🆕 Step 2: Create New Application

1. **Click**: `+ New` or `Add Resource` button (usually top-right)
2. **Select**: `Application`
3. **Choose**: `Public Repository (GitHub)`

---

### 🔗 Step 3: Configure Git Source

**Repository Configuration:**

```
Git Provider: GitHub
Repository URL: https://github.com/darksagae/agrof_main
Branch: feature/mobile-api-config
```

Click **"Continue"** or **"Next"**

---

### ⚙️ Step 4: Build Configuration

**CRITICAL SETTINGS - Enter Exactly:**

```
Application Name: agrof-backend
Build Pack: Dockerfile
Dockerfile Location: Dockerfile
Base Directory: . (or leave EMPTY - do NOT put /)
Port Exposes: 5000
Port Mappings: 5000:5000
```

**Important:**
- ✅ DO: Set `Base Directory` to `.` or leave it EMPTY
- ❌ DON'T: Set it to `/` or `/agrof-main`
- ✅ DO: Set `Dockerfile Location` to just `Dockerfile`
- ❌ DON'T: Use paths like `/Dockerfile` or `./Dockerfile`

---

### 🔐 Step 5: Environment Variables

Click **"Environment Variables"** tab, then add these one by one:

**Click "+ Add Variable"** for each:

| Key | Value |
|-----|-------|
| `FLASK_ENV` | `production` |
| `GEMINI_API_KEY` | `AIzaSyBE2b1nKpQd6LseRIVXfh10O_O3Pm0fvM0` |
| `PORT` | `5000` |
| `PYTHONUNBUFFERED` | `1` |
| `WORKERS` | `4` |

**After adding all variables**, click **"Save"**

---

### 🌐 Step 6: Domain/Network Settings

**Port Configuration:**
- Exposed Port: `5000`
- Public: ✅ Enable (check the box)

**Domain** (optional):
- Let Coolify auto-generate: `agrof-backend-xxxxx.yourdomain`
- Or set custom: `agrof-api.sti.ac.ug`

**SSL/HTTPS:**
- ✅ Enable if available (Coolify usually auto-configures)

---

### ❤️ Step 7: Health Check Configuration

```
Health Check Enabled: ✅ Yes
Health Check Path: /health
Health Check Method: GET
Interval: 30s
Timeout: 10s
Retries: 3
Start Period: 40s
```

---

### 🚀 Step 8: DEPLOY!

1. **Review all settings** (scroll through tabs)
2. **Click the BIG "Deploy" button**
3. **Watch the build logs** in real-time

---

## 📊 What to Expect During Build

### Build Log Timeline (~3-5 minutes):

```
[0:00] 🔄 Cloning repository...
[0:10] ✅ Repository cloned
[0:15] 📁 Checking out branch: feature/mobile-api-config
[0:20] 🐳 Building Docker image...
[0:25] 📦 Pulling base image: python:3.9-slim
[1:00] 🔧 Installing system dependencies (gcc, g++, curl...)
[2:00] 🐍 Installing Python packages (flask, gunicorn...)
[2:30] 📋 Copying source code
[3:00] 👤 Creating non-root user
[3:30] ✅ Image built successfully
[3:40] 🚀 Starting container
[4:00] ❤️ Running health checks...
[4:30] ✅ DEPLOYMENT SUCCESSFUL!
```

### Success Indicators:
- ✅ Status changes to "Running" (green)
- ✅ Health check shows "Healthy"
- ✅ Logs show: `Listening at: http://0.0.0.0:5000`

---

## 🧪 Step 9: Test Your Deployment

### Get Your App URL

In Coolify dashboard, look for your application URL:
- Usually shown at top of application page
- Format: `https://agrof-backend-xxxxx.yourdomain.com`

### Test the Health Endpoint

```bash
# Replace with your actual URL
curl https://your-app-url/health

# Expected Response:
{"status": "OK", "service": "agrof-backend"}
```

### Test from Browser

Open in browser:
```
https://your-app-url/health
```

You should see JSON response!

---

## 🐛 If Deployment Fails

### Check Build Logs

1. In Coolify, click **"Deployments"** tab
2. Click on the failed deployment
3. Read the error logs carefully

### Common Errors & Fixes:

#### Error: "Dockerfile not found"
**Fix:**
1. Go to **"Configuration"** tab
2. Set `Base Directory` to `.` (or empty)
3. Set `Dockerfile Location` to `Dockerfile`
4. Click **"Save"**
5. Click **"Redeploy"**

#### Error: "Port already in use"
**Fix:**
1. Change port to `5001` or another available port
2. Update environment variable `PORT=5001`
3. Redeploy

#### Error: "Build timeout"
**Fix:**
1. Go to **"Advanced"** settings
2. Increase build timeout to 600 seconds (10 minutes)
3. Redeploy

#### Error: "Health check failing"
**Fix:**
1. Disable health check temporarily
2. Check application logs for startup errors
3. Once app is running, re-enable health check

---

## 📱 Step 10: Update Mobile App Configuration

Once deployed successfully, update your mobile app to use the new backend URL:

**File to edit**: `agrof-main/mobile/app/config/api.js` or environment config

```javascript
// Replace localhost with your Coolify deployment URL
const BACKEND_URL = 'https://your-coolify-app-url.com';

export const API_ENDPOINTS = {
  baseURL: BACKEND_URL,
  diseaseDetection: `${BACKEND_URL}/api/detect`,
  plantAnalysis: `${BACKEND_URL}/api/analyze`,
  health: `${BACKEND_URL}/health`
};
```

---

## 🎉 Success Checklist

Your deployment is complete when you can check ALL these boxes:

- [ ] Coolify shows application status as "Running" (green)
- [ ] Health check shows "Healthy"
- [ ] Can access `https://your-app-url/health` and get JSON response
- [ ] Build logs show "Listening at: http://0.0.0.0:5000"
- [ ] No errors in application logs
- [ ] Application URL is accessible from browser
- [ ] Can curl the API successfully

---

## 🔑 Quick Reference

**GitHub Repository:**
```
https://github.com/darksagae/agrof_main
Branch: feature/mobile-api-config
```

**Dockerfile Location:**
```
Repository Root: /Dockerfile
Size: 844MB when built
Base Image: python:3.9-slim
```

**Environment Variables Needed:**
```bash
FLASK_ENV=production
GEMINI_API_KEY=AIzaSyBE2b1nKpQd6LseRIVXfh10O_O3Pm0fvM0
PORT=5000
PYTHONUNBUFFERED=1
WORKERS=4
```

**Exposed Port:**
```
5000
```

---

## 📞 If You Get Stuck

1. **Screenshot the error** from Coolify
2. **Copy the build logs** (especially error lines)
3. **Check these files exist on GitHub:**
   - `Dockerfile` (in root)
   - `requirements.txt` (in root)
   - `src/api/app.py`

4. **Verify Git push was successful:**
   ```bash
   cd /home/darksagae/Desktop/agrof-auto/agrof-main
   git log --oneline -3
   git remote -v
   ```

---

## 🎯 Your Current Position

**You Are Here:**
```
✅ 1. VPN Connected (10.100.101.13)
✅ 2. Docker Image Built (agrof-backend:latest)
✅ 3. Code Pushed to GitHub
➡️ 4. NOW: Open Coolify Dashboard and Deploy!
⏳ 5. NEXT: Test deployment
⏳ 6. NEXT: Update mobile app config
```

---

## 🚀 GO TO COOLIFY NOW!

**Access Coolify at one of these URLs:**
- http://10.100.100.1:8000
- http://10.100.101.1:8000
- Your custom Coolify domain

**Then follow Steps 2-8 above!**

---

**VPN Status**: ✅ **ACTIVE**  
**Docker Image**: ✅ **READY**  
**GitHub Repo**: ✅ **UPDATED**  
**Your Action**: 🎯 **DEPLOY IN COOLIFY NOW!**

---

*Good luck! You're 99% there! 🚀*


