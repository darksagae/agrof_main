# Network Configuration Fixed - Oct 17, 2025

## ✅ Current Working Configuration

### Server IP Addresses
- **WiFi IP**: `192.168.0.105` ✅ (Use this for mobile device testing)
- **Docker Bridge**: `10.0.1.1`
- **WireGuard VPN**: `10.100.101.13`
- **Localhost**: `127.0.0.1` / `localhost`

### Service Ports
- **Store Backend API**: Port **3001** ✅ (UPDATED: with image fix)
  - Health: `http://192.168.0.105:3001/api/health`
  - Categories: `http://192.168.0.105:3001/api/categories`
  - Products: `http://192.168.0.105:3001/api/products`
  - Images: `http://192.168.0.105:3001/api/images/CATEGORY/PRODUCT/FILE.jpg`
  
- **AI Backend API**: Port **5000** ✅
  - Health: `http://192.168.0.105:5000/health`
  - Analyze: `http://192.168.0.105:5000/api/analyze`

## 🔧 Changes Made

### 1. Fixed `storeApi.js`
**Before**: `http://192.168.1.15:3001/api`  
**After**: `http://192.168.0.105:3001/api` ✅ (PORT 3001 with image encoding)

### 2. Fixed `apiConfig.js`
- Updated `BASE_IP` to `192.168.0.105`
- Reordered `BASE_IPS` array to prioritize current WiFi IP
- Updated priority order for auto-discovery

### 3. Fixed `api.js`
**Before**: `http://192.168.0.107:5000`  
**After**: `http://192.168.0.105:5000` ✅

### 4. Fixed `enhancedImageAnalysisService.js`
**Before**: `http://192.168.1.15:5000`  
**After**: `http://192.168.0.105:5000` ✅

## 🧪 Test Commands

### Test Store Backend (Port 3001)
```bash
# Health check
curl http://192.168.0.105:3001/api/health

# Get categories
curl http://192.168.0.105:3001/api/categories

# Get products
curl http://192.168.0.105:3001/api/products?limit=5

# Test image serving (with spaces encoded)
curl -I "http://192.168.0.105:3001/api/images/FUNGICIDES/1Kg%20Sulcop-tomatoes%20Fungicide/SULCOP_OSHO.jpeg"
```

### Test AI Backend (Port 5000)
```bash
# Health check
curl http://192.168.0.105:5000/health

# Test connection
curl http://192.168.0.105:5000/api/test
```

## 📱 Mobile App Connection

### Your mobile device should:
1. Be connected to the **same WiFi network** as the server
2. Use IP: `192.168.0.105`
3. Store API on port `3001` ⚠️ **UPDATED from 3000 to 3001**
4. AI API on port `5000`

### If WiFi IP changes:
Run this command to find your new IP:
```bash
ip addr show wlp3s0 | grep 'inet ' | awk '{print $2}' | cut -d/ -f1
```

Then update these files with the new IP:
- `agrof-main/mobile/app/services/storeApi.js` (line 14)
- `agrof-main/mobile/app/config/apiConfig.js` (lines 9, 20)
- `agrof-main/mobile/app/api.js` (line 4)
- `agrof-main/mobile/app/services/enhancedImageAnalysisService.js` (line 8)

## 🔍 Auto-Discovery Feature

The mobile app has auto-discovery built in (`apiConfig.js`). It will try these IPs in order:
1. `192.168.0.105` (current)
2. `localhost`
3. `127.0.0.1`
4. `10.0.0.1` (WireGuard)
5. Other fallback IPs

The app should automatically find the working endpoint on startup.

## 🎯 Quick Verification

Run this to verify everything is accessible:
```bash
# Store backend
curl -I http://192.168.0.105:3000/api/health

# AI backend
curl -I http://192.168.0.105:5000/health
```

Both should return `HTTP/1.1 200 OK`

## 🚀 Restart Mobile App

After these changes:
1. Stop the Expo dev server (Ctrl+C)
2. Clear the app cache: `npx expo start -c`
3. Restart your mobile app
4. Check logs for: `✅ Found working API endpoint: http://192.168.0.105:3000`

## 🐛 Troubleshooting

### If mobile app still can't connect:

1. **Check firewall** (allow ports 3000 and 5000):
   ```bash
   sudo ufw allow 3000/tcp
   sudo ufw allow 5000/tcp
   ```

2. **Verify services are listening on all interfaces** (0.0.0.0):
   ```bash
   ss -tlnp | grep -E '(3000|5000)'
   ```
   Should show `0.0.0.0:3000` and `0.0.0.0:5000`

3. **Test from mobile device browser**:
   - Open: `http://192.168.0.105:3000/api/health`
   - Should see: `{"status":"OK","message":"AGROF Store Backend is running"}`

4. **Check WiFi network**:
   - Ensure mobile device is on the same network
   - Some WiFi routers have AP isolation - disable it if needed

## 📝 Notes

- Store backend defaults to port 3001 in `server.js` but was overridden by environment variable to 3000
- Both backends are listening on all interfaces (0.0.0.0), so they're accessible from WiFi
- Auto-discovery feature helps when IP changes
- Services are running and verified accessible ✅


## ✅ Current Working Configuration

### Server IP Addresses
- **WiFi IP**: `192.168.0.105` ✅ (Use this for mobile device testing)
- **Docker Bridge**: `10.0.1.1`
- **WireGuard VPN**: `10.100.101.13`
- **Localhost**: `127.0.0.1` / `localhost`

### Service Ports
- **Store Backend API**: Port **3001** ✅ (UPDATED: with image fix)
  - Health: `http://192.168.0.105:3001/api/health`
  - Categories: `http://192.168.0.105:3001/api/categories`
  - Products: `http://192.168.0.105:3001/api/products`
  - Images: `http://192.168.0.105:3001/api/images/CATEGORY/PRODUCT/FILE.jpg`
  
- **AI Backend API**: Port **5000** ✅
  - Health: `http://192.168.0.105:5000/health`
  - Analyze: `http://192.168.0.105:5000/api/analyze`

## 🔧 Changes Made

### 1. Fixed `storeApi.js`
**Before**: `http://192.168.1.15:3001/api`  
**After**: `http://192.168.0.105:3001/api` ✅ (PORT 3001 with image encoding)

### 2. Fixed `apiConfig.js`
- Updated `BASE_IP` to `192.168.0.105`
- Reordered `BASE_IPS` array to prioritize current WiFi IP
- Updated priority order for auto-discovery

### 3. Fixed `api.js`
**Before**: `http://192.168.0.107:5000`  
**After**: `http://192.168.0.105:5000` ✅

### 4. Fixed `enhancedImageAnalysisService.js`
**Before**: `http://192.168.1.15:5000`  
**After**: `http://192.168.0.105:5000` ✅

## 🧪 Test Commands

### Test Store Backend (Port 3001)
```bash
# Health check
curl http://192.168.0.105:3001/api/health

# Get categories
curl http://192.168.0.105:3001/api/categories

# Get products
curl http://192.168.0.105:3001/api/products?limit=5

# Test image serving (with spaces encoded)
curl -I "http://192.168.0.105:3001/api/images/FUNGICIDES/1Kg%20Sulcop-tomatoes%20Fungicide/SULCOP_OSHO.jpeg"
```

### Test AI Backend (Port 5000)
```bash
# Health check
curl http://192.168.0.105:5000/health

# Test connection
curl http://192.168.0.105:5000/api/test
```

## 📱 Mobile App Connection

### Your mobile device should:
1. Be connected to the **same WiFi network** as the server
2. Use IP: `192.168.0.105`
3. Store API on port `3001` ⚠️ **UPDATED from 3000 to 3001**
4. AI API on port `5000`

### If WiFi IP changes:
Run this command to find your new IP:
```bash
ip addr show wlp3s0 | grep 'inet ' | awk '{print $2}' | cut -d/ -f1
```

Then update these files with the new IP:
- `agrof-main/mobile/app/services/storeApi.js` (line 14)
- `agrof-main/mobile/app/config/apiConfig.js` (lines 9, 20)
- `agrof-main/mobile/app/api.js` (line 4)
- `agrof-main/mobile/app/services/enhancedImageAnalysisService.js` (line 8)

## 🔍 Auto-Discovery Feature

The mobile app has auto-discovery built in (`apiConfig.js`). It will try these IPs in order:
1. `192.168.0.105` (current)
2. `localhost`
3. `127.0.0.1`
4. `10.0.0.1` (WireGuard)
5. Other fallback IPs

The app should automatically find the working endpoint on startup.

## 🎯 Quick Verification

Run this to verify everything is accessible:
```bash
# Store backend
curl -I http://192.168.0.105:3000/api/health

# AI backend
curl -I http://192.168.0.105:5000/health
```

Both should return `HTTP/1.1 200 OK`

## 🚀 Restart Mobile App

After these changes:
1. Stop the Expo dev server (Ctrl+C)
2. Clear the app cache: `npx expo start -c`
3. Restart your mobile app
4. Check logs for: `✅ Found working API endpoint: http://192.168.0.105:3000`

## 🐛 Troubleshooting

### If mobile app still can't connect:

1. **Check firewall** (allow ports 3000 and 5000):
   ```bash
   sudo ufw allow 3000/tcp
   sudo ufw allow 5000/tcp
   ```

2. **Verify services are listening on all interfaces** (0.0.0.0):
   ```bash
   ss -tlnp | grep -E '(3000|5000)'
   ```
   Should show `0.0.0.0:3000` and `0.0.0.0:5000`

3. **Test from mobile device browser**:
   - Open: `http://192.168.0.105:3000/api/health`
   - Should see: `{"status":"OK","message":"AGROF Store Backend is running"}`

4. **Check WiFi network**:
   - Ensure mobile device is on the same network
   - Some WiFi routers have AP isolation - disable it if needed

## 📝 Notes

- Store backend defaults to port 3001 in `server.js` but was overridden by environment variable to 3000
- Both backends are listening on all interfaces (0.0.0.0), so they're accessible from WiFi
- Auto-discovery feature helps when IP changes
- Services are running and verified accessible ✅






















