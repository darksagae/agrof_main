# 🔄 App Restart Instructions - IP Address Change

## ✅ **What I Just Did:**

1. **Killed all Expo/Metro processes** - To force a clean restart
2. **Cleared all caches** - Removed `.expo` cache and `node_modules/.cache`
3. **Started Expo with `--clear` flag** - Fresh bundler start

## 📱 **What You Need To Do:**

### **Step 1: Wait for Expo to Start**
Look for this message in the terminal:
```
› Metro waiting on exp://...
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### **Step 2: Reload Your App**
**On Android:**
- Shake your device
- OR press `R` key twice quickly
- OR tap "Reload" in the dev menu

**In Expo Go:**
- Pull down from the top to reload
- OR shake device and tap "Reload"

**In Terminal:**
- Press `r` to reload the app

### **Step 3: Verify the New IP**
After reloading, check the logs for:
```
LOG  🔍 Current API_BASE_URL: http://10.0.0.1:3001/api  ✅
```

Instead of:
```
LOG  🔍 Current API_BASE_URL: http://192.168.0.113:3001/api  ❌
```

## 🎯 **Expected Results:**

### **Before (Old IP):**
```
ERROR  ❌ API request failed for /products
ERROR  🔄 Network error detected, using offline fallback...
```

### **After (New IP):**
```
LOG  ✅ Store backend connected successfully!
LOG  📦 Loaded products from backend
LOG  🏷️ Categories: Seeds, Fertilizers, Pesticides, etc.
```

## 🚨 **If Still Not Working:**

### **Option 1: Full App Restart**
1. Close the app completely on your device
2. Reopen it from Expo Go
3. Wait for it to load with the new config

### **Option 2: Check Your Device's Network**
Make sure your phone/device is on the **same network** as your computer:
```
Computer IP: 10.0.0.1
Device must be on: Same WiFi network (10.0.0.x range)
```

### **Option 3: Test Backend Connection**
From your computer, test if the backend is accessible:
```bash
curl http://10.0.0.1:3001/api/health
```

Should return:
```json
{"status":"OK","message":"AGROF Store API is running"}
```

## 📱 **Quick Checklist:**

- [ ] Expo server restarted with `--clear`
- [ ] App reloaded on device (press R or shake)
- [ ] Check logs for new IP: `10.0.0.1`
- [ ] Device on same WiFi as computer
- [ ] Backend running on port 3001

## 💡 **Pro Tip:**

If you see the **old IP** (`192.168.0.113`) in logs after reload:
- The cache wasn't fully cleared
- Try **uninstalling and reinstalling** the app on your device
- Or close Expo Go completely and reopen

---

**The Expo server is now starting with clean cache. Wait for it to finish, then reload your app!** 🚀



## ✅ **What I Just Did:**

1. **Killed all Expo/Metro processes** - To force a clean restart
2. **Cleared all caches** - Removed `.expo` cache and `node_modules/.cache`
3. **Started Expo with `--clear` flag** - Fresh bundler start

## 📱 **What You Need To Do:**

### **Step 1: Wait for Expo to Start**
Look for this message in the terminal:
```
› Metro waiting on exp://...
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### **Step 2: Reload Your App**
**On Android:**
- Shake your device
- OR press `R` key twice quickly
- OR tap "Reload" in the dev menu

**In Expo Go:**
- Pull down from the top to reload
- OR shake device and tap "Reload"

**In Terminal:**
- Press `r` to reload the app

### **Step 3: Verify the New IP**
After reloading, check the logs for:
```
LOG  🔍 Current API_BASE_URL: http://10.0.0.1:3001/api  ✅
```

Instead of:
```
LOG  🔍 Current API_BASE_URL: http://192.168.0.113:3001/api  ❌
```

## 🎯 **Expected Results:**

### **Before (Old IP):**
```
ERROR  ❌ API request failed for /products
ERROR  🔄 Network error detected, using offline fallback...
```

### **After (New IP):**
```
LOG  ✅ Store backend connected successfully!
LOG  📦 Loaded products from backend
LOG  🏷️ Categories: Seeds, Fertilizers, Pesticides, etc.
```

## 🚨 **If Still Not Working:**

### **Option 1: Full App Restart**
1. Close the app completely on your device
2. Reopen it from Expo Go
3. Wait for it to load with the new config

### **Option 2: Check Your Device's Network**
Make sure your phone/device is on the **same network** as your computer:
```
Computer IP: 10.0.0.1
Device must be on: Same WiFi network (10.0.0.x range)
```

### **Option 3: Test Backend Connection**
From your computer, test if the backend is accessible:
```bash
curl http://10.0.0.1:3001/api/health
```

Should return:
```json
{"status":"OK","message":"AGROF Store API is running"}
```

## 📱 **Quick Checklist:**

- [ ] Expo server restarted with `--clear`
- [ ] App reloaded on device (press R or shake)
- [ ] Check logs for new IP: `10.0.0.1`
- [ ] Device on same WiFi as computer
- [ ] Backend running on port 3001

## 💡 **Pro Tip:**

If you see the **old IP** (`192.168.0.113`) in logs after reload:
- The cache wasn't fully cleared
- Try **uninstalling and reinstalling** the app on your device
- Or close Expo Go completely and reopen

---

**The Expo server is now starting with clean cache. Wait for it to finish, then reload your app!** 🚀



