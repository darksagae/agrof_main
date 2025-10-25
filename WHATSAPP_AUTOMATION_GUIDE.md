# 🤖 WhatsApp Bot & Automation Engine Guide

## 📊 Current Status (Oct 17, 2025)

### ✅ WhatsApp Bot
- **Status**: RUNNING (PID: 398628)
- **Configuration**: ✅ .env file created with correct URLs
- **Needs**: Restart to load new configuration

### ✅ Automation Engine  
- **Status**: RUNNING (PID: 678863)
- **Port**: 3002
- **URL**: http://192.168.0.105:3002
- **Configuration**: ✅ Connected to Store Backend
- **Templates**: 6 workflow templates loaded

---

## 🚀 Quick Start

### 1. Restart WhatsApp Bot (to load new config)
```bash
# Stop current bot
pkill -f "node bot.js"

# Start with new configuration
cd /home/darksagae/Desktop/agrof-auto/whatsapp-bot
node bot.js

# Or run in background:
nohup node bot.js > /tmp/whatsapp-bot.log 2>&1 &
```

### 2. Access Automation Engine
```bash
# Web UI (open in browser)
http://192.168.0.105:3002

# Health check
curl http://192.168.0.105:3002/api/health

# List workflows
curl http://192.168.0.105:3002/api/workflows
```

---

## 📱 WhatsApp Bot Features

### What It Does:
- ✅ Automatically responds to customer messages
- ✅ Answers product queries
- ✅ Processes orders
- ✅ Sends notifications to admins
- ✅ Integrates with Store Backend for product info
- ✅ Triggers Automation Engine workflows

### Customer Commands (send via WhatsApp):
```
hi / hello          - Greeting & menu
products            - List available products
order               - Start order process
help                - Show available commands
status              - Check order status
contact             - Get support contact
```

### Configuration File: `whatsapp-bot/.env`
```env
STORE_API=http://192.168.0.105:3001
AUTOMATION_API=http://192.168.0.105:3002
ADMIN_NUMBERS=256XXXXXXXXX,256XXXXXXXXX
BOT_NAME=AGROF Assistant
```

### Add Admin Numbers:
```bash
# Edit the .env file
nano /home/darksagae/Desktop/agrof-auto/whatsapp-bot/.env

# Add your phone numbers (with country code, no +)
# Example: ADMIN_NUMBERS=256701234567,256789876543
```

### First-Time Setup:
1. Run the bot: `node bot.js`
2. Scan QR code with WhatsApp Business app
3. Go to: Settings > Linked Devices > Link a Device
4. Scan the displayed QR code
5. Bot will authenticate and start listening

---

## ⚙️ Automation Engine Features

### What It Does:
- ✅ Workflow automation (like n8n/Zapier)
- ✅ Scheduled tasks (cron jobs)
- ✅ Low stock alerts
- ✅ Inventory monitoring
- ✅ Automated reports
- ✅ Webhook triggers
- ✅ WhatsApp notifications

### API Endpoints:

#### Health Check
```bash
curl http://192.168.0.105:3002/api/health
```

#### List All Workflows
```bash
curl http://192.168.0.105:3002/api/workflows
```

#### Execute a Workflow
```bash
curl -X POST http://192.168.0.105:3002/api/workflows/execute \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "workflow_id_here",
    "data": {}
  }'
```

#### List Scheduled Tasks
```bash
curl http://192.168.0.105:3002/api/schedules
```

#### Get Workflow Executions
```bash
curl http://192.168.0.105:3002/api/executions?limit=10
```

### Pre-loaded Workflow Templates:

1. **Low Stock Alert** - Monitor inventory and notify when low
2. **Daily Sales Report** - Generate daily sales summary
3. **Order Notification** - Alert admin when new order arrives
4. **Product Restock Reminder** - Schedule restock reminders
5. **Customer Follow-up** - Send follow-up messages
6. **Automated Backup** - Schedule data backups

---

## 🔗 Integration Examples

### Example 1: Low Stock Alert via WhatsApp

**Flow:**
```
Store Backend → Detects low stock
    ↓
Automation Engine → Triggers workflow
    ↓
WhatsApp Bot → Sends alert to admin
```

**Test:**
```bash
# Trigger low stock workflow
curl -X POST http://192.168.0.105:3002/api/workflows/execute \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "low_stock_alert",
    "data": {
      "product": "Fertilizer XYZ",
      "current_stock": 5,
      "minimum_stock": 20
    }
  }'
```

### Example 2: Daily Inventory Report

**Create Schedule:**
```bash
curl -X POST http://192.168.0.105:3002/api/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "daily_report",
    "cronExpression": "0 18 * * *",
    "timezone": "Africa/Kampala",
    "name": "Daily Inventory Report"
  }'
```

This runs every day at 6 PM East Africa Time.

### Example 3: Order Processing

**When customer orders via WhatsApp:**
```
Customer → WhatsApp Bot → Receives order
    ↓
Bot → Store Backend → Checks availability
    ↓
Bot → Automation Engine → Creates order workflow
    ↓
Workflow → Processes payment
    ↓
Workflow → Updates inventory
    ↓
Workflow → Sends confirmation (WhatsApp & Email)
```

---

## 🛠️ Administration

### View Logs

**WhatsApp Bot:**
```bash
tail -f /tmp/whatsapp-bot.log
```

**Automation Engine:**
```bash
tail -f /tmp/automation-engine.log
```

### Check Running Services:
```bash
ps aux | grep -E "node.*(bot|automation)"
```

### Check Ports:
```bash
ss -tlnp | grep -E "(3002)"
```

### Restart Services:

**WhatsApp Bot:**
```bash
pkill -f "node bot.js"
cd /home/darksagae/Desktop/agrof-auto/whatsapp-bot
nohup node bot.js > /tmp/whatsapp-bot.log 2>&1 &
```

**Automation Engine:**
```bash
pkill -f "automation.*server"
cd /home/darksagae/Desktop/agrof-auto/automation-engine
nohup node server.js > /tmp/automation-engine.log 2>&1 &
```

---

## 🧪 Testing

### Test WhatsApp Bot Integration:

**1. Send test message via WhatsApp**
Send "hi" to your connected WhatsApp number

**Expected Response:**
```
Hello! 👋 Welcome to AGROF!

I can help you with:
🛍️ Browse products
📦 Place orders
📊 Check order status
💬 Get support

Just type what you need!
```

**2. Query products:**
Send "products" or "show products"

**Expected Response:**
List of available products from Store Backend

### Test Automation Engine:

**1. Health Check:**
```bash
curl http://192.168.0.105:3002/api/health
# Expected: {"status":"OK","service":"AGROF Automation Engine",...}
```

**2. List Workflows:**
```bash
curl http://192.168.0.105:3002/api/workflows | python3 -m json.tool
```

**3. Test Store Integration:**
```bash
curl http://192.168.0.105:3002/api/integrations/store/inventory
```

---

## 🔧 Troubleshooting

### WhatsApp Bot Issues

**Problem: QR Code not appearing**
```bash
# Delete session and restart
rm -rf /home/darksagae/Desktop/agrof-auto/whatsapp-bot/whatsapp-session
cd /home/darksagae/Desktop/agrof-auto/whatsapp-bot
node bot.js
```

**Problem: Bot not responding**
```bash
# Check if running
ps aux | grep "node bot.js"

# Check logs
tail -50 /tmp/whatsapp-bot.log

# Verify .env configuration
cat /home/darksagae/Desktop/agrof-auto/whatsapp-bot/.env
```

**Problem: Can't connect to Store API**
```bash
# Test Store Backend from bot location
curl http://192.168.0.105:3001/api/health
```

### Automation Engine Issues

**Problem: Workflow not executing**
```bash
# Check logs
tail -50 /tmp/automation-engine.log

# Verify workflow exists
curl http://192.168.0.105:3002/api/workflows
```

**Problem: Can't connect to Store Backend**
```bash
# Check .env configuration
cat /home/darksagae/Desktop/agrof-auto/automation-engine/.env

# Test connection
curl http://192.168.0.105:3001/api/health
```

---

## 📋 Use Case Examples

### 1. Automated Low Stock Alerts
```javascript
// Workflow: Check stock every hour
{
  "name": "Hourly Stock Check",
  "trigger": "schedule",
  "schedule": "0 * * * *",  // Every hour
  "steps": [
    {
      "action": "get_low_stock",
      "source": "store_backend"
    },
    {
      "action": "send_whatsapp",
      "if": "stock_items.length > 0",
      "message": "⚠️ Low stock alert: {{product_name}} - {{quantity}} remaining"
    }
  ]
}
```

### 2. Order Confirmation Workflow
```javascript
// Workflow: When customer orders via WhatsApp
{
  "name": "Order Confirmation",
  "trigger": "whatsapp_message",
  "filter": "message.contains('order')",
  "steps": [
    {
      "action": "parse_order",
      "extract": ["product", "quantity"]
    },
    {
      "action": "check_availability",
      "source": "store_backend"
    },
    {
      "action": "create_order",
      "if": "product.available"
    },
    {
      "action": "send_whatsapp",
      "message": "✅ Order confirmed! Order #{{order_id}}"
    },
    {
      "action": "notify_admin",
      "message": "New order: {{product}} x {{quantity}}"
    }
  ]
}
```

### 3. Daily Sales Report
```javascript
// Workflow: Generate and send daily report
{
  "name": "Daily Sales Report",
  "trigger": "schedule",
  "schedule": "0 18 * * *",  // 6 PM daily
  "steps": [
    {
      "action": "get_daily_sales",
      "source": "store_backend"
    },
    {
      "action": "generate_report",
      "template": "daily_sales"
    },
    {
      "action": "send_whatsapp",
      "to": "admin",
      "message": "📊 Daily Sales Report\n\nTotal: UGX {{total}}\nOrders: {{count}}"
    }
  ]
}
```

---

## 🎯 Next Steps

1. **Restart WhatsApp Bot** to load new configuration:
   ```bash
   pkill -f bot.js && cd whatsapp-bot && node bot.js
   ```

2. **Add admin numbers** to receive notifications:
   ```bash
   nano whatsapp-bot/.env
   # Add: ADMIN_NUMBERS=256XXXXXXXXX
   ```

3. **Test bot** by sending WhatsApp message

4. **Create workflows** in Automation Engine UI:
   - Open: http://192.168.0.105:3002
   - Or use API to create workflows

5. **Set up schedules** for automated tasks

6. **Monitor logs** for any issues

---

## 📚 Additional Resources

- **Automation Engine UI**: http://192.168.0.105:3002
- **API Docs**: http://192.168.0.105:3002/api/health
- **Store Backend**: http://192.168.0.105:3001/api
- **Logs**: 
  - WhatsApp: `/tmp/whatsapp-bot.log`
  - Automation: `/tmp/automation-engine.log`

---

✅ **Both services are configured and running!**

**Status Summary:**
- ✅ Automation Engine: Running on port 3002
- ✅ WhatsApp Bot: Running (needs restart for new config)
- ✅ Store Integration: Connected
- ✅ Workflow Templates: Loaded

**Ready for:** Customer messaging, order automation, scheduled tasks, and workflow automation!
