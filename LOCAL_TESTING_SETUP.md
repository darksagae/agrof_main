# AGROF Local Testing Setup

## 🔄 **Switched to Localhost for Testing**

All services have been configured to use localhost instead of Render URLs for local testing.

## 📋 **Configuration Changes Made**

### 1. **WhatsApp Bot** (`whatsapp-bot/bot.js`)
```javascript
// Commented out Render URL
// const adminHandler = new AdminCommandsV2('https://agrof-store-api.onrender.com/api', []);

// Using localhost
const adminHandler = new AdminCommandsV2('http://localhost:10000/api', []);
```

### 2. **Mobile App** (`agrof-main/mobile/app/config/apiConfig.js`)
```javascript
// LOCAL TESTING MODE - ENABLED
const LOCAL_TESTING = true; // Set to false to use Render URLs

// Updated to use port 10000 for store backend
let BASE_IP = LOCAL_TESTING ? 'http://localhost:10000' : 'https://agrof-store-api.onrender.com';
```

## 🚀 **How to Start Local Testing**

### **Step 1: Start Store Backend**
```bash
# Option 1: Use the provided script
./start-local-store.sh

# Option 2: Manual start
cd store-backend
npm install
npm start
```

### **Step 2: Start WhatsApp Bot**
```bash
cd whatsapp-bot
npm install
npm start
```

### **Step 3: Start Mobile App**
```bash
cd agrof-main/mobile/app
npm install
npx expo start
```

## 🔍 **Testing the Changes**

### **1. Test WhatsApp Bot Admin Commands**
- Send `void` to test store management
- Send `void` → `Add new product` to add products
- Send `void` → `Search product` to search for "Trichoderma"
- Send `void` → `Analytics` to view store analytics

### **2. Test Mobile App**
- Open the mobile app
- Navigate to Store tab
- Search for "Trichoderma" to see the product you added
- Check if images load correctly

### **3. Test Store Backend API**
```bash
# Test health endpoint
curl http://localhost:10000/health

# Test products endpoint
curl http://localhost:10000/api/products?limit=5

# Search for Trichoderma
curl "http://localhost:10000/api/products/search?q=Trichoderma"
```

## 📊 **Expected Results**

### **WhatsApp Bot**
- ✅ Admin commands work locally
- ✅ Product management functions
- ✅ Real-time database updates
- ✅ Analytics and reporting

### **Mobile App**
- ✅ Connects to local store backend
- ✅ Displays products from local database
- ✅ Images load from local server
- ✅ Search functionality works

### **Store Backend**
- ✅ Runs on port 10000
- ✅ Serves product data
- ✅ Handles API requests
- ✅ Database operations work

## 🔄 **Switching Back to Render**

When you're ready to switch back to Render URLs:

### **1. WhatsApp Bot**
```javascript
// In whatsapp-bot/bot.js
const adminHandler = new AdminCommandsV2('https://agrof-store-api.onrender.com/api', []);
```

### **2. Mobile App**
```javascript
// In agrof-main/mobile/app/config/apiConfig.js
const LOCAL_TESTING = false; // Set to false to use Render URLs
```

## 🐛 **Troubleshooting**

### **Port Already in Use**
```bash
# Kill any process using port 10000
sudo lsof -ti:10000 | xargs kill -9
```

### **Database Issues**
```bash
# Check if store.db exists
ls -la store-backend/store.db

# If missing, the server will create it automatically
```

### **WhatsApp Bot Not Connecting**
```bash
# Check if bot is running
ps aux | grep "node bot.js"

# Restart if needed
cd whatsapp-bot
npm start
```

## 📱 **Testing Checklist**

- [ ] Store backend starts on port 10000
- [ ] WhatsApp bot connects to localhost:10000
- [ ] Mobile app connects to localhost:10000
- [ ] Products display in mobile app
- [ ] WhatsApp admin commands work
- [ ] Product search works
- [ ] Images load correctly
- [ ] Analytics work

## 🎯 **Next Steps**

1. **Test all functionality locally**
2. **Verify product management works**
3. **Check mobile app integration**
4. **Test WhatsApp bot features**
5. **Switch back to Render when ready**

---

**Note**: All changes are temporary for testing. The Render URLs are commented out but not removed, making it easy to switch back when needed.









