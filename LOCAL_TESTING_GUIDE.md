# 🧪 AGROF Local Testing Guide

## 🚀 Quick Start

```bash
# Start all services locally
./start-local-testing.sh
```

## 📱 WhatsApp Bot Testing

### 1. Start WhatsApp Bot
```bash
cd whatsapp-bot
npm start
```

### 2. Test All Secret Triggers

#### 👁️ **GODEYE** - News Management
```
godeye
```
- Create news/alerts
- View active news
- Delete old news
- News analytics

#### 🌀 **VOID** - Store Management  
```
void
```
- List all products
- Add new product
- Update product
- Delete product
- Product analytics

#### ✨ **DESTINY** - Market Management
```
destiny
```
- View P2P market
- Manage sellers
- Market analytics
- Trading insights

#### 🔮 **ORACLE** - Analytics
```
oracle
```
- Sales analytics
- User statistics
- Performance metrics
- Revenue reports

#### 🛡️ **GUARDIAN** - Customer Management
```
guardian
```
- Customer list
- Support tickets
- Customer analytics
- Support management

#### 🔥 **PHOENIX** - System Operations
```
phoenix
```
- System status
- Restart services
- System analytics
- Backup system

#### ⚡ **NEXUS** - Workflow Management
```
nexus
```
- View workflows
- Create workflow
- Start/stop workflows
- Workflow analytics

#### ☁️ **CLOUD** - User Activation
```
cloud
```
- View pending buyers
- View pending sellers
- Activate users
- Reject users
- User statistics

## 🧪 Testing Workflow

### 1. Test Customer Features
```
# Send to WhatsApp bot:
Hi
MENU
PRODUCTS
ORDER 50kg DAP fertilizer
PRICE
CONTACT
```

### 2. Test Admin Features
```
# Send to WhatsApp bot:
godeye
void
destiny
oracle
guardian
phoenix
nexus
cloud
```

### 3. Test Registration Flow
1. Register as buyer in mobile app
2. Register as seller in mobile app
3. Check WhatsApp bot for notifications
4. Use `cloud` trigger to activate users

## 🔧 Service URLs

- **WhatsApp Bot**: http://localhost:10000
- **Store Backend**: http://localhost:3001
- **AI Backend**: http://localhost:5000
- **Automation Engine**: http://localhost:3002

## 🧪 Health Checks

```bash
# Test all services
curl http://localhost:10000/health  # WhatsApp Bot
curl http://localhost:3001/api/health  # Store Backend
curl http://localhost:5000/health  # AI Backend
curl http://localhost:3002/api/health  # Automation Engine
```

## 🚀 Production Mode

To switch back to Render URLs:

1. Edit `agrof-main/mobile/app/config/apiConfig.js`:
```javascript
const LOCAL_TESTING = false; // Set to false for production
```

2. Edit `agrof-main/mobile/app/services/whatsappNotificationService.js`:
```javascript
// this.botApiUrl = 'http://localhost:10000'; // Local WhatsApp bot API
this.botApiUrl = 'https://agrof-whatsapp-bot.onrender.com'; // WhatsApp bot API
```

## 🐛 Troubleshooting

### WhatsApp Bot Not Responding
```bash
# Check if bot is running
curl http://localhost:10000/health

# Restart bot
cd whatsapp-bot
npm start
```

### Services Not Starting
```bash
# Check ports
netstat -tulpn | grep :10000
netstat -tulpn | grep :3001
netstat -tulpn | grep :5000
netstat -tulpn | grep :3002

# Kill processes on ports
sudo kill -9 $(lsof -t -i:10000)
sudo kill -9 $(lsof -t -i:3001)
sudo kill -9 $(lsof -t -i:5000)
sudo kill -9 $(lsof -t -i:3002)
```

### Mobile App Not Connecting
- Check `LOCAL_TESTING = true` in `apiConfig.js`
- Ensure all services are running on localhost
- Check network connectivity

## 📝 Notes

- All services run on localhost for easy testing
- WhatsApp bot requires QR code scan to connect
- Mobile app uses localhost URLs when `LOCAL_TESTING = true`
- Switch to production URLs when ready to deploy
