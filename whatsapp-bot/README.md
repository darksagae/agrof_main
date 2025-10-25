# 📱 AGROF WhatsApp Bot

Automated WhatsApp bot for receiving orders, answering customer inquiries, and sending notifications.

## ✨ Features

### Customer Features
- 🛍️ **Place Orders** - Customers can order directly via WhatsApp
- 📦 **Check Stock** - Real-time inventory availability
- 💰 **Check Prices** - View product prices
- 📋 **Track Orders** - Check order status
- 💬 **Auto-Replies** - Instant responses 24/7
- 🤖 **Smart Parsing** - Understands natural language orders

### Admin Features
- 📊 **Order Notifications** - Instant alerts for new orders
- 📈 **Real-time Updates** - Bot status monitoring
- 🔄 **Two-way Communication** - Reply to customers
- 📱 **Mobile Friendly** - Works on your phone

### Commands Customers Can Use
- `MENU` - Show all options
- `STOCK` - View available products
- `ORDER` - Place an order
- `PRICE` - Check prices
- `TRACK` - Track order
- `CONTACT` - Get support info
- `HELP` - Show help

### Natural Language Orders
Customers can order like this:
- "I want 50kg DAP fertilizer"
- "Order 2 bags of Urea"
- "Buy 100kg NPK"

## 🚀 Quick Start (5 Minutes!)

### Step 1: Install Dependencies

```bash
cd /home/darksagae/Desktop/agrof-auto/whatsapp-bot
npm install
```

### Step 2: Configure

```bash
# Copy environment file
cp .env.example .env

# Edit configuration
nano .env
```

Add your admin WhatsApp number:
```env
ADMIN_NUMBERS=256700123456
```

### Step 3: Start the Bot

```bash
npm start
```

### Step 4: Scan QR Code

1. A QR code will appear in your terminal
2. Open **WhatsApp Business** on your phone
3. Go to **Settings** > **Linked Devices**
4. Tap **"Link a Device"**
5. Scan the QR code
6. ✅ Done! Bot is now connected!

## 📱 Test Your Bot

Send a message to the connected WhatsApp number:

```
Customer: Hi
Bot: 👋 Hello! Welcome to AGROF! 🌾
     How can I help you today?
     Type MENU to see all options

Customer: STOCK
Bot: 📦 AVAILABLE STOCK 🌾
     FERTILIZERS
     • DAP: 500 bags
     • Urea: 300 bags
     ...

Customer: Order 50kg DAP
Bot: ✅ Got it! You want: 50kg DAP
     ⏳ Let me check availability...
     
Bot: ✅ ORDER CONFIRMATION
     📦 Product: DAP Fertilizer
     🔢 Quantity: 50 kg
     💰 Unit Price: UGX 120,000
     💵 Total: UGX 6,000,000
     
     Reply YES to confirm or NO to cancel

Customer: YES
Bot: 🎉 ORDER SUCCESSFUL!
     📋 Order Number: #ORD123456
     ...
```

## 🔗 Integration with Automation System

The bot automatically integrates with your automation workflows!

### Send WhatsApp Messages from Workflows

In your automation workflows, add a "Send WhatsApp" action:

```bash
# Send message via API
curl -X POST http://localhost:3003/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "256700123456",
    "message": "📦 Your order is ready for pickup!"
  }'
```

### Add WhatsApp Action to Workflow Engine

Edit `automation-engine/workflow-engine.js` and add:

```javascript
async sendWhatsAppAction(config, data, state) {
  const { phoneNumber, message } = config;
  
  try {
    const response = await fetch('http://localhost:3003/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: phoneNumber,
        message: message
      })
    });
    
    state.logs.push({ 
      message: `WhatsApp sent to ${phoneNumber}`,
      timestamp: new Date().toISOString()
    });
    
    return { data: { ...data, whatsappSent: true } };
  } catch (error) {
    throw new Error(`WhatsApp send failed: ${error.message}`);
  }
}
```

Register it:
```javascript
this.registerExecutor('send_whatsapp', this.sendWhatsAppAction.bind(this));
```

## 🎯 Example Workflows

### 1. Order Confirmation
```
Trigger: WhatsApp Order Received
├─ Create Order in Database
├─ Reduce Inventory
├─ Send WhatsApp Confirmation
└─ Notify Admin
```

### 2. Low Stock Alert
```
Trigger: Daily at 6 AM
├─ Check Stock Levels
├─ IF stock low
│  ├─ Send WhatsApp to Supplier
│  └─ Notify Admin
```

### 3. Order Ready Notification
```
Trigger: Order Status = Ready
├─ Get Customer WhatsApp
└─ Send WhatsApp: "Your order is ready!"
```

## 🔧 Configuration Options

### Admin Numbers
Add multiple admin numbers to receive notifications:
```env
ADMIN_NUMBERS=256700111111,256700222222,256700333333
```

### API Endpoints
Point to your services:
```env
STORE_API=http://localhost:3001
AUTOMATION_API=http://localhost:3002
API_PORT=3003
```

## 📊 Monitoring

### Check Bot Status
```bash
# Via API
curl http://localhost:3003/health

# Via logs
tail -f logs/bot.log
```

### View Messages
All messages are logged to console in real-time

## 🛠️ Customization

### Add Custom Commands

Edit `bot.js` and add to `handleMessage()`:

```javascript
else if (command.match(/^delivery/i)) {
    await msg.reply('🚚 Delivery available within Kampala!\nCost: UGX 10,000\nType ORDER to continue');
}
```

### Modify Auto-Replies

Edit message templates in `bot.js`:

```javascript
const greeting = `Your custom greeting here`;
```

### Add Product Categories

The bot automatically detects and displays categories from your inventory!

## 🔒 Security

- ✅ Session data stored locally
- ✅ No message content stored
- ✅ Secure API endpoints
- ✅ Admin-only notifications

## ⚠️ Important Notes

### WhatsApp Terms of Service
- This uses whatsapp-web.js (unofficial)
- For production, use official WhatsApp Business API
- Account might get banned if used for spam

### Best Practices
- ✅ Don't spam customers
- ✅ Reply within 24 hours
- ✅ Use for business only
- ✅ Keep conversations professional
- ✅ Respect customer privacy

### Limitations
- Requires computer running 24/7
- One WhatsApp account only
- No WhatsApp Web open on phone
- Session expires if phone disconnected

## 🚀 Production Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start bot.js --name agrof-whatsapp-bot
pm2 save
pm2 startup
```

### Using Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

### Keep Alive
```bash
# Add to crontab
@reboot cd /home/darksagae/Desktop/agrof-auto/whatsapp-bot && npm start
```

## 🐛 Troubleshooting

### QR Code Not Showing
```bash
# Clear session
rm -rf whatsapp-session
npm start
```

### Connection Lost
```bash
# Restart bot
npm start
# Scan QR code again
```

### Messages Not Receiving
- Check WhatsApp is connected
- Check phone has internet
- Restart bot

### Bot Not Responding
- Check store backend is running
- Check automation engine is running
- View logs for errors

## 📞 Support

- Check logs: `tail -f logs/bot.log`
- Test API: `curl http://localhost:3003/health`
- Restart: `npm start`

## 🎉 You're All Set!

Your WhatsApp bot is now ready to:
- ✅ Receive customer orders 24/7
- ✅ Answer inquiries automatically
- ✅ Check stock in real-time
- ✅ Send order confirmations
- ✅ Notify you of new orders
- ✅ Integrate with automation workflows

**Start the bot and scan the QR code!** 📱🚀



