# 🤖 WhatsApp Bot Accessibility on STI with WireGuard

## 🎯 Current STI Setup Status

### **✅ What You Have:**
- **STI VM**: `10.100.100.180` (internal) / `102.209.111.210` (public)
- **WireGuard VPN**: Connected to STI network
- **Your VPN IP**: `10.100.101.13/32`
- **Coolify Platform**: Running on STI VM
- **AGROF Services**: Deployed via Coolify

### **❌ Current Limitation:**
- **WhatsApp Bot**: Currently running locally only
- **Not accessible** from STI VM
- **No cloud deployment** yet

---

## 🚀 WhatsApp Bot Accessibility Options

### **Option 1: Deploy Bot to STI VM (RECOMMENDED)**

#### **Benefits:**
- ✅ **24/7 Uptime** - Runs on STI infrastructure
- ✅ **VPN Access** - Accessible via WireGuard
- ✅ **No External Dependencies** - Self-contained
- ✅ **Cost Effective** - Uses existing STI resources

#### **Setup Steps:**

1. **SSH to STI VM:**
   ```bash
   ssh user@10.100.100.180
   ```

2. **Deploy WhatsApp Bot:**
   ```bash
   # Clone your repository
   git clone https://github.com/your-repo/agrof-auto.git
   cd agrof-auto/whatsapp-bot
   
   # Install dependencies
   npm install
   
   # Configure environment
   cp .env.example .env
   nano .env
   ```

3. **Environment Configuration:**
   ```bash
   # .env file
   ADMIN_NUMBERS=256700123456
   ADMIN_TOKEN=agrof-admin-2024
   STORE_API=http://localhost:3001/api
   WHATSAPP_SESSION_PATH=./session
   ```

4. **Run as Service:**
   ```bash
   # Create systemd service
   sudo nano /etc/systemd/system/agrof-whatsapp-bot.service
   ```

5. **Service Configuration:**
   ```ini
   [Unit]
   Description=AGROF WhatsApp Bot
   After=network.target

   [Service]
   Type=simple
   User=user
   WorkingDirectory=/home/user/agrof-auto/whatsapp-bot
   ExecStart=/usr/bin/node bot.js
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

6. **Start Service:**
   ```bash
   sudo systemctl enable agrof-whatsapp-bot.service
   sudo systemctl start agrof-whatsapp-bot.service
   ```

---

### **Option 2: Deploy Bot to External Cloud (Alternative)**

#### **Benefits:**
- ✅ **Public Access** - No VPN required
- ✅ **Global Availability** - Accessible from anywhere
- ✅ **Professional Setup** - Cloud infrastructure

#### **Platforms:**
- **Render.com** (Free tier available)
- **Railway.app** (Easy deployment)
- **Heroku** (Popular choice)
- **DigitalOcean** (Good performance)

---

## 🔧 STI Network Configuration for Bot Access

### **Current Network Setup:**
```
┌─────────────────────────────────────────────────────────┐
│                  Your Computer                           │
│                                                          │
│  WireGuard AGROF Interface                              │
│  IP: 10.100.101.13/32                                   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ Encrypted Tunnel
                   │ Endpoint: 41.220.3.53:51820
                   │
┌──────────────────▼──────────────────────────────────────┐
│              STI Network                                 │
│                                                          │
│  Gateway: 10.100.101.1/32                               │
│                                                          │
│  VM Network: 10.100.100.0/24                            │
│    └─ STI VM: 10.100.100.180                             │
│       └─ WhatsApp Bot: Port 3000                         │
│       └─ Backend API: Port 3001                          │
│       └─ Coolify: Port 80/443                            │
└─────────────────────────────────────────────────────────┘
```

### **Bot Accessibility Scenarios:**

#### **Scenario 1: Bot on STI VM**
- ✅ **Accessible via VPN**: `10.100.100.180:3000`
- ✅ **Internal communication**: Bot ↔ Backend API
- ❌ **External access**: Requires Ingress configuration

#### **Scenario 2: Bot on External Cloud**
- ✅ **Public access**: `https://your-bot-domain.com`
- ✅ **No VPN required**: Direct internet access
- ✅ **Global availability**: Works from anywhere

---

## 🎯 Recommended Deployment Strategy

### **Phase 1: Deploy to STI VM (Immediate)**
```bash
# 1. SSH to STI VM
ssh user@10.100.100.180

# 2. Deploy WhatsApp Bot
cd /home/user
git clone https://github.com/your-repo/agrof-auto.git
cd agrof-auto/whatsapp-bot
npm install

# 3. Configure and start
sudo systemctl start agrof-whatsapp-bot.service
```

### **Phase 2: Configure Ingress (Optional)**
```bash
# Make bot accessible from internet
# Configure STI Ingress rules
# Add domain name
# Set up SSL certificates
```

### **Phase 3: External Cloud (Future)**
```bash
# Deploy to Render.com or Railway.app
# For better global accessibility
# No VPN dependency
```

---

## 📱 WhatsApp Bot Commands (Once Deployed)

### **Seller Request Management:**
```
#listsellers - List pending requests
#approve <id> - Approve request
#reject <id> [reason] - Reject request
#view <id> - View details
#sellerstats - View statistics
```

### **News Management:**
```
#addnews - Create news
#listnews - List news
#deletenews <id> - Delete news
#resolvenews <id> - Mark resolved
```

---

## 🔍 Testing Bot Accessibility

### **From Your Computer (via VPN):**
```bash
# Test bot API
curl http://10.100.100.180:3000/health

# Test backend API
curl http://10.100.100.180:3001/api/health
```

### **From STI VM:**
```bash
# Test local services
curl http://localhost:3000/health
curl http://localhost:3001/api/health
```

---

## 🎉 Expected Result

After deployment to STI VM:
- ✅ **WhatsApp Bot runs 24/7** on STI infrastructure
- ✅ **Accessible via WireGuard VPN** from your computer
- ✅ **Seller request management** available
- ✅ **No external dependencies** required
- ✅ **Cost effective** solution

The bot will be accessible through the STI network and can manage seller requests via WhatsApp commands!
