# 🏠 Localhost Setup Guide

## Quick Start with Localhost APIs

### 1. Switch to Development Mode
```bash
# Switch to localhost APIs
npm run env:dev

# Check current environment
npm run env:status
```

### 2. Start Required Services

#### Start Store Backend (Port 3001)
```bash
cd /home/darksagae/Desktop/agrof-auto/store-backend
npm start
# or
docker-compose up store-backend
```

#### Start Automation Engine (Port 3002)
```bash
cd /home/darksagae/Desktop/agrof-auto/automation-engine
npm start
# or
docker-compose up automation-engine
```

### 3. Start WhatsApp Bot
```bash
cd /home/darksagae/Desktop/agrof-auto/whatsapp-bot
npm start
```

## 🔧 Configuration

### Current Settings (Development)
- **Store API**: `http://localhost:3001/api`
- **Automation API**: `http://localhost:3002/api`
- **Bot Port**: `10000`
- **Session Directory**: `./whatsapp-session`

### Environment Variables
```bash
# Optional: Override default settings
export NODE_ENV=development
export STORE_API_URL=http://localhost:3001/api
export PORT=10000
```

## 📱 Testing the Bot

### 1. Check Bot Status
```bash
# Check if bot is running
curl http://localhost:10000/health

# Check WhatsApp connection status
curl http://localhost:10000/whatsapp-status
```

### 2. Monitor Bot
```bash
# Interactive monitoring
npm run monitor

# Test reconnection
npm run test-reconnect
```

### 3. Test Admin Commands
Send these messages to your WhatsApp bot:
- `godeye` - News management
- `void` - Store management
- `admin help` - Show all commands

## 🔄 Switching Environments

### To Localhost (Development)
```bash
npm run env:dev
```

### To Production (Render)
```bash
npm run env:prod
```

### Check Current Environment
```bash
npm run env:status
```

## 🚨 Troubleshooting

### Bot Won't Connect
1. **Check if store backend is running:**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Check if automation engine is running:**
   ```bash
   curl http://localhost:3002/api/health
   ```

3. **Check bot status:**
   ```bash
   curl http://localhost:10000/whatsapp-status
   ```

### QR Code Issues
1. **Clear session and restart:**
   ```bash
   rm -rf ./whatsapp-session
   npm start
   ```

2. **Force reconnection:**
   ```bash
   curl -X POST http://localhost:10000/whatsapp-force-reconnect
   ```

### API Connection Issues
1. **Verify environment:**
   ```bash
   npm run env:status
   ```

2. **Check if services are running:**
   ```bash
   # Store backend
   curl http://localhost:3001/api/products?limit=1
   
   # Automation engine
   curl http://localhost:3002/api/health
   ```

## 📊 Monitoring

### Health Check Endpoints
- **Bot Health**: `http://localhost:10000/health`
- **WhatsApp Status**: `http://localhost:10000/whatsapp-status`
- **Admin Dashboard**: `http://localhost:10000/admin/dashboard`

### Logs
- **Bot Logs**: Check console output
- **Admin Notifications**: `./admin-notifications.log`
- **Session Data**: `./whatsapp-session/`

## 🎯 Quick Commands

```bash
# Start everything
npm run env:dev && npm start

# Monitor bot
npm run monitor

# Test reconnection
npm run test-reconnect

# Switch to production
npm run env:prod

# Check status
npm run env:status
```

## ✅ Success Indicators

When everything is working correctly, you should see:

1. **Bot starts successfully:**
   ```
   🚀 Initializing WhatsApp client...
   🔧 WhatsApp Bot Configuration:
      Environment: development
      Store API: http://localhost:3001/api
      Automation API: http://localhost:3002/api
      Bot Port: 10000
   ```

2. **QR code appears:**
   ```
   📱 New QR code generated - phone needs to scan again
   [QR CODE DISPLAYED]
   ```

3. **Bot connects:**
   ```
   ✅ AGROF WhatsApp Bot is ready!
   🤖 Bot is listening for admin commands...
   ```

4. **Health check passes:**
   ```bash
   curl http://localhost:10000/health
   # Should return: {"status":"OK",...}
   ```

## 🚀 Ready for Production

When you're ready to deploy to production:

1. **Switch to production mode:**
   ```bash
   npm run env:prod
   ```

2. **Deploy to Render:**
   ```bash
   git add .
   git commit -m "Switch to production APIs"
   git push origin main
   ```

The bot will automatically use the Render APIs in production! 🎉





