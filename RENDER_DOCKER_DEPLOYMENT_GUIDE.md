# 🚀 Render Docker Deployment Guide

## 🎯 **Deploy Backend API + WhatsApp Bot to Render**

### **What We're Deploying:**
- ✅ **Backend API** - Seller request management endpoints
- ✅ **WhatsApp Bot** - Admin commands for seller requests
- ✅ **Docker containers** - Professional deployment
- ✅ **24/7 uptime** - Cloud infrastructure

---

## 📋 **Step 1: Prepare for Render Deployment**

### **Push to GitHub:**
```bash
cd /home/darksagae/Desktop/agrof-auto
git add .
git commit -m "Add Docker support for Render deployment"
git push origin main
```

---

## 🚀 **Step 2: Deploy Backend API to Render**

### **2.1 Create Backend Service:**
1. **Go to [render.com](https://render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect GitHub Repository**
4. **Select Repository:** `agrof-auto`
5. **Root Directory:** `store-backend`
6. **Dockerfile Path:** `store-backend/Dockerfile`

### **2.2 Configure Backend Service:**
```
Name: agrof-backend
Runtime: Docker
Build Command: (leave empty - uses Dockerfile)
Start Command: (leave empty - uses Dockerfile)
```

### **2.3 Environment Variables:**
```
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://xtklayjpdpfykjbttaac.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0a2xheWpwZHBmeWtqYnR0YWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTI2NTcsImV4cCI6MjA3NTY2ODY1N30.GXPo5n_MlOWqIe5lEKcgVJD_A3wyx2IPNyH9DmgXtWM
ADMIN_TOKEN=agrof-admin-2024
```

### **2.4 Deploy Backend:**
- **Click "Create Web Service"**
- **Wait for deployment** (2-3 minutes)
- **Note the URL:** `https://agrof-backend.onrender.com`

---

## 📱 **Step 3: Deploy WhatsApp Bot to Render**

### **3.1 Create WhatsApp Bot Service:**
1. **Click "New +" → "Web Service"**
2. **Connect GitHub Repository**
3. **Select Repository:** `agrof-auto`
4. **Root Directory:** `whatsapp-bot`
5. **Dockerfile Path:** `whatsapp-bot/Dockerfile`

### **3.2 Configure WhatsApp Bot Service:**
```
Name: agrof-whatsapp-bot
Runtime: Docker
Build Command: (leave empty - uses Dockerfile)
Start Command: (leave empty - uses Dockerfile)
```

### **3.3 Environment Variables:**
```
NODE_ENV=production
ADMIN_NUMBERS=256700123456
ADMIN_TOKEN=agrof-admin-2024
STORE_API=https://agrof-backend.onrender.com/api
WHATSAPP_SESSION_PATH=/app/session
```

### **3.4 Deploy WhatsApp Bot:**
- **Click "Create Web Service"**
- **Wait for deployment** (2-3 minutes)
- **Note the URL:** `https://agrof-whatsapp-bot.onrender.com`

---

## 🔧 **Step 4: Configure Services**

### **4.1 Update Backend Environment:**
After backend deploys, update WhatsApp bot environment:
```
STORE_API=https://agrof-backend.onrender.com/api
```

### **4.2 Test Services:**
```bash
# Test Backend API
curl https://agrof-backend.onrender.com/api/health

# Test WhatsApp Bot
curl https://agrof-whatsapp-bot.onrender.com/health
```

---

## 📱 **Step 5: WhatsApp Bot Setup**

### **5.1 Access Bot Logs:**
1. **Go to Render Dashboard**
2. **Select agrof-whatsapp-bot service**
3. **Click "Logs" tab**
4. **Look for QR code** in logs

### **5.2 Scan QR Code:**
1. **Open WhatsApp Business** on your phone
2. **Go to Settings → Linked Devices**
3. **Tap "Link a Device"**
4. **Scan the QR code** from Render logs
5. **✅ Bot is now connected!**

---

## 🎯 **Step 6: Test Seller Request Management**

### **6.1 Test WhatsApp Commands:**
Send these messages to your WhatsApp bot:

```
#listsellers
```
**Expected:** List of pending seller requests

```
#approve 286f1293-40e8-466b-922c-ebb903e2823c
```
**Expected:** Approval confirmation

```
#sellerstats
```
**Expected:** Statistics about requests

---

## 🌐 **Step 7: Update Mobile App**

### **7.1 Update API URLs:**
Update your mobile app to use the new cloud endpoints:

```javascript
// In your mobile app config
const API_BASE_URL = 'https://agrof-backend.onrender.com/api';
const WHATSAPP_BOT_URL = 'https://agrof-whatsapp-bot.onrender.com';
```

### **7.2 Deploy Updated Mobile App:**
```bash
cd /home/darksagae/Desktop/agrof-auto/agrof-main/mobile
npx eas update --branch production --message "Updated to use cloud APIs"
```

---

## 🎉 **Expected Result**

After deployment:
- ✅ **Backend API** running 24/7 on Render
- ✅ **WhatsApp Bot** running 24/7 on Render
- ✅ **Seller request management** via WhatsApp
- ✅ **Professional cloud setup**
- ✅ **No local server dependency**
- ✅ **Global accessibility**

---

## 📊 **Service URLs**

| Service | URL | Purpose |
|---------|-----|---------|
| **Backend API** | `https://agrof-backend.onrender.com` | Seller request management |
| **WhatsApp Bot** | `https://agrof-whatsapp-bot.onrender.com` | WhatsApp commands |
| **Health Check** | `https://agrof-backend.onrender.com/api/health` | API status |
| **Bot Health** | `https://agrof-whatsapp-bot.onrender.com/health` | Bot status |

---

## 🔧 **Management Commands**

### **View Logs:**
- **Backend:** Render Dashboard → agrof-backend → Logs
- **WhatsApp Bot:** Render Dashboard → agrof-whatsapp-bot → Logs

### **Restart Services:**
- **Backend:** Render Dashboard → agrof-backend → Manual Deploy
- **WhatsApp Bot:** Render Dashboard → agrof-whatsapp-bot → Manual Deploy

### **Update Services:**
- **Push to GitHub** → Automatic deployment
- **Manual Deploy** → Force immediate deployment

---

## 🎯 **WhatsApp Bot Commands Available**

```
#listsellers - List pending requests
#approve <id> - Approve request
#reject <id> [reason] - Reject request
#view <id> - View details
#sellerstats - View statistics
admin help - Show all commands
```

**🎊 Your WhatsApp bot will now run 24/7 in the cloud with professional monitoring and management!**
