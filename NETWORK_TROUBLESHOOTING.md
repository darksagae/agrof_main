# Network Troubleshooting Guide

## Problem: API Connection Fails When Network Changes

### Symptoms:
- `ERROR API request failed: [TypeError: Network request failed]`
- App loses connection to backend server
- Cart, health check, and product APIs fail

### Root Cause:
The React Native app was hardcoded to use a single IP address (`192.168.1.14:3001`). When you disconnect from the network or change networks, this IP becomes unreachable.

## ✅ Solution Implemented

### 1. **Automatic Failover System**
The app now tries multiple API URLs in order:
- `http://192.168.1.14:3001/api` (Primary - your current network)
- `http://localhost:3001/api` (Localhost fallback)
- `http://127.0.0.1:3001/api` (Alternative localhost)
- `http://10.0.2.2:3001/api` (Android emulator fallback)

### 2. **Network Status Component**
Added `NetworkStatus.js` component that shows:
- Current connection status
- Working API URLs
- Manual reset option

### 3. **Network Configuration Screen**
Added `NetworkConfigScreen.js` for advanced troubleshooting:
- Test custom API URLs
- View all working URLs
- Reset to primary URL
- Real-time network testing

## 🔧 How to Use

### Quick Fix:
1. **Restart your React Native app** - it will automatically find a working API URL
2. **Check the NetworkStatus component** (if added to your app) for connection info

### Advanced Troubleshooting:
1. **Add NetworkConfigScreen to your app navigation**
2. **Use the network configuration screen** to:
   - Test different API URLs
   - See which URLs are working
   - Reset to primary URL

### Manual API URL Testing:
```javascript
import { testAllApiUrls, getCurrentApiUrl, resetApiUrl } from './services/storeApi';

// Test all URLs
const workingUrls = await testAllApiUrls();
console.log('Working URLs:', workingUrls);

// Get current URL
const currentUrl = getCurrentApiUrl();
console.log('Current URL:', currentUrl);

// Reset to primary
resetApiUrl();
```

## 🚀 Backend Server Requirements

Make sure your backend server is running on:
- **Port 3001** (configurable in server.js)
- **Accessible from your network** (not just localhost)
- **Health endpoint available** at `/api/health`

## 📱 Testing Different Scenarios

### Scenario 1: Same Network
- App should connect to `192.168.1.14:3001`
- All APIs should work normally

### Scenario 2: Network Disconnect
- App should automatically try localhost URLs
- May show "No working URLs found" if server not running locally

### Scenario 3: Different Network
- App should try all URLs until it finds a working one
- You may need to update the primary URL in the code

## 🔍 Debugging Tips

1. **Check server logs** for incoming requests
2. **Use NetworkConfigScreen** to test URLs manually
3. **Check network connectivity** with the NetworkStatus component
4. **Verify server is running** on the expected port

## 📝 Code Changes Made

### Files Modified:
- `storeApi.js` - Added failover logic and network testing
- `FertilizerProductsScreen.js` - Added cache clearing

### Files Added:
- `NetworkStatus.js` - Network status indicator component
- `NetworkConfigScreen.js` - Advanced network configuration screen

## 🎯 Next Steps

1. **Test the app** with network changes
2. **Add NetworkStatus component** to your main screens if needed
3. **Consider adding NetworkConfigScreen** to your app navigation
4. **Update primary URL** if you change your network setup

The app should now be much more resilient to network changes! 🌐✨
