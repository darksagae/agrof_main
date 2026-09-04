# 🔐 ABQ Africa VPN & Coolify Connection Status

## ✅ VPN Configuration Found!

### **Location:** `/home/darksagae/DATA/wg.conf`

### **Your VPN Details:**
```ini
[Interface]
Address = 10.100.101.13/32
PrivateKey = 4TWwK73sS6acTzfRuiRcuziGGhNXkm4mX0LM6mdO7F0=

[Peer]
PublicKey = +IoBKkn9InA2zljAPwMMWKU13moVcqCkh/9ACT86t2Y=
Endpoint = 41.220.3.53:51820
AllowedIPs = 10.100.101.1/32, 10.100.100.0/24
```

---

## ✅ VPN Status: CONNECTED!

### **Current Connection:**
- **Interface:** `wg`
- **Your VPN IP:** `10.100.101.13/32`
- **Server Endpoint:** `41.220.3.53:51820` ✅
- **Allowed Networks:** `10.100.101.1/32`, `10.100.100.0/24`
- **Status:** Active with recent handshake ✅

### **Server Details:**
- **Organization:** ABQ Africa
- **Domain:** developer.abq.africa
- **Server IP:** 41.220.3.53
- **Platform:** Coolify (Industry 4.0+ Hackathon)

---

## 🌐 What's Accessible:

### ✅ **Working:**
1. **Web Dashboard:** https://developer.abq.africa
   - Coolify login page accessible
   - HTTPS working
   - Public access via internet

2. **Your Project URLs:**
   - **Project:** https://developer.abq.africa/project/w4sk844cs4g8cssk4o8840ss
   - **Environment:** f4og8so0oowwco8g8owcko8k
   - **Application:** g8c4s8080000wko84ccs48og
   - **Terminal:** /terminal endpoint available

### ❌ **Not Working:**
1. **Internal VPN Gateway:** 10.100.100.1
   - Ping fails
   - SSH access blocked
   - Internal routing issues

---

## 🎯 How to Access Your Coolify:

### **Method 1: Web Dashboard (Recommended) ✅**

```bash
# Open in browser:
https://developer.abq.africa/login

# Your project direct link:
https://developer.abq.africa/project/w4sk844cs4g8cssk4o8840ss/environment/f4og8so0oowwco8g8owcko8k
```

**Login with your organization credentials.**

### **Method 2: SSH to Specific Hosts (If Provided)**

Your organization may have specific SSH targets. Common options:
```bash
# Try these if provided by your org:
ssh user@10.100.100.X  # Specific VM in VPN network
ssh user@developer.abq.africa  # If SSH enabled on main server
```

---

## 📋 Your Coolify Application Structure:

```
ABQ Africa Coolify Platform
├── Project ID: w4sk844cs4g8cssk4o8840ss
│   └── Environment: f4og8so0oowwco8g8owcko8k (production)
│       └── Application: g8c4s8080000wko84ccs48og
│           ├── Terminal Access ✅
│           ├── Logs ✅
│           ├── Environment Variables ✅
│           └── Deployment Settings ✅
```

---

## 🚀 Next Steps to Deploy AGROF:

### **Step 1: Login to Coolify Dashboard**
```
URL: https://developer.abq.africa/login
Credentials: Your organization account
```

### **Step 2: Check Existing Application**
Navigate to your application:
```
https://developer.abq.africa/project/w4sk844cs4g8cssk4o8840ss/environment/f4og8so0oowwco8g8owcko8k/application/g8c4s8080000wko84ccs48og
```

### **Step 3: Configure Your AGROF Services**

You need to deploy TWO applications:

#### **Application 1: AGROF AI API**
```yaml
Name: agrof-ai-api
Build Pack: Dockerfile
Dockerfile Path: agrof-main/src/api/Dockerfile
Port: 5000
Environment Variables:
  - GEMINI_API_KEY=AIzaSyBE2b1nKpQd6LseRIVXfh10O_O3Pm0fvM0
  - PORT=5000
  - FLASK_ENV=production
```

#### **Application 2: AGROF Store Backend**
```yaml
Name: agrof-store-backend
Build Pack: Dockerfile
Dockerfile Path: store-backend/Dockerfile
Port: 3000
Environment Variables:
  - PORT=3000
  - NODE_ENV=production
```

### **Step 4: Connect GitHub Repository**

In Coolify Dashboard:
1. Go to Settings → Git Sources
2. Add your GitHub repository
3. Authorize Coolify to access it
4. Select the repository for each application

### **Step 5: Deploy**

1. Click "Deploy" button
2. Wait for build to complete
3. Get your public URLs (e.g., `https://agrof-api.abq.africa`)
4. Test the APIs

### **Step 6: Update Mobile App Configuration**

Once deployed, update your mobile app's API config:

```javascript
// agrof-main/mobile/app/config/apiConfig.js
const BASE_DOMAIN = 'abq.africa';  // Or whatever domain provided

export const API_CONFIG = {
  AI: {
    BASE_URL: `https://agrof-api.${BASE_DOMAIN}`,
    API_URL: `https://agrof-api.${BASE_DOMAIN}/api`,
  },
  STORE: {
    BASE_URL: `https://agrof-store.${BASE_DOMAIN}`,
    API_URL: `https://agrof-store.${BASE_DOMAIN}/api`,
  }
};
```

### **Step 7: Build with EAS**

```bash
cd agrof-main/mobile/app
eas build --platform android --profile production
```

---

## 🔧 Troubleshooting:

### **Cannot Access Dashboard:**
```bash
# Check VPN is active:
sudo wg show

# Expected output should show:
# - interface: wg
# - endpoint: 41.220.3.53:51820
# - latest handshake: recent timestamp
```

### **VPN Not Connected:**
```bash
# Copy correct config:
sudo cp /home/darksagae/DATA/wg.conf /etc/wireguard/wg.conf

# Start VPN:
sudo wg-quick up wg

# Check status:
sudo wg show
```

### **Still Can't Connect:**
Contact your organization's IT support with:
- Your VPN IP: 10.100.101.13
- Error messages
- What you're trying to access

---

## 📊 Network Architecture:

```
┌─────────────────────────────────────────────────┐
│  Your Computer                                   │
│  └── WireGuard VPN (10.100.101.13)             │
└──────────────────┬──────────────────────────────┘
                   │
                   │ VPN Tunnel (51820)
                   ↓
┌─────────────────────────────────────────────────┐
│  ABQ Africa Server (41.220.3.53)                │
│  └── VPN Network: 10.100.100.0/24               │
│      ├── Gateway: 10.100.101.1                  │
│      └── VPN Clients: 10.100.101.x              │
└──────────────────┬──────────────────────────────┘
                   │
                   │ Public Internet
                   ↓
┌─────────────────────────────────────────────────┐
│  Public Access                                   │
│  └── https://developer.abq.africa               │
│      └── Coolify Platform                        │
│          └── Your Applications                   │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Summary:

| Component | Status | Details |
|-----------|--------|---------|
| **VPN Connection** | ✅ Active | Connected to 41.220.3.53 |
| **Your VPN IP** | ✅ Assigned | 10.100.101.13/32 |
| **Web Dashboard** | ✅ Accessible | https://developer.abq.africa |
| **SSH Access** | ❌ Blocked | Internal network not routed |
| **Coolify Project** | ✅ Exists | w4sk844cs4g8cssk4o8840ss |
| **Application** | ✅ Created | g8c4s8080000wko84ccs48og |

---

## 🔑 Important Information:

### **Your Credentials (Keep Secure):**
- VPN Config: `/home/darksagae/DATA/wg.conf`
- VPN Private Key: `4TWwK73sS6acTzfRuiRcuziGGhNXkm4mX0LM6mdO7F0=`
- Coolify Dashboard: https://developer.abq.africa

### **Support Contact:**
For access issues, contact your organization's IT team with:
- Project ID: w4sk844cs4g8cssk4o8840ss
- Your name and role in the hackathon

---

**Status:** Ready to Deploy! 🚀  
**Last Updated:** October 19, 2025

---

## Quick Commands Reference:

```bash
# Check VPN status
sudo wg show

# Restart VPN
sudo wg-quick down wg && sudo wg-quick up wg

# Test connectivity
curl -I https://developer.abq.africa

# Open dashboard
xdg-open https://developer.abq.africa
```


