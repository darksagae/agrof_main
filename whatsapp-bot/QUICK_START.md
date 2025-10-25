# 🚀 WhatsApp Bot - Quick Start (5 Minutes)

## Step 1: Install (2 minutes)

```bash
cd /home/darksagae/Desktop/agrof-auto/whatsapp-bot
npm install
```

## Step 2: Configure (1 minute)

```bash
cp .env.example .env
nano .env
```

Add your WhatsApp number (with country code, no spaces):
```
ADMIN_NUMBERS=256700123456
```
Save and exit (Ctrl+X, Y, Enter)

## Step 3: Start (1 minute)

```bash
npm start
```

## Step 4: Connect (1 minute)

1. **QR code will appear in terminal** 📱
2. **Open WhatsApp Business on your phone**
3. **Go to**: Settings → Linked Devices
4. **Tap**: "Link a Device"
5. **Scan the QR code** ✅

## ✅ DONE!

Your bot is now LIVE! 🎉

## 🧪 Test It

Send yourself a message:

```
You: Hi
Bot: 👋 Hello! Welcome to AGROF!

You: MENU
Bot: [Shows full menu]

You: STOCK
Bot: [Shows available products]

You: Order 50kg DAP
Bot: [Processes order]
```

## 📱 Customer Commands

Tell your customers to use:
- `MENU` - See options
- `STOCK` - Check products
- `ORDER` - Place order
- `PRICE` - See prices
- Natural text: "I want 50kg fertilizer"

## 🎯 Next Steps

1. ✅ Share your WhatsApp number with customers
2. ✅ Test ordering process
3. ✅ Monitor incoming orders
4. ✅ Reply to customers directly

## ⚡ Quick Commands

```bash
# Start bot
npm start

# View logs
tail -f logs/bot.log

# Check status
curl http://localhost:3003/health

# Restart if needed
pkill -f "node bot.js"
npm start
```

## 🆘 Problems?

**QR code not showing?**
```bash
rm -rf whatsapp-session
npm start
```

**Bot not responding?**
- Check store backend: `curl http://localhost:3001/api/health`
- Check automation: `curl http://localhost:3002/api/health`

**Connection lost?**
- Restart bot: `npm start`
- Scan QR again

## That's It! 🎉

You now have a **24/7 WhatsApp assistant** for your business!

Customers can order anytime, and you'll get instant notifications! 📱✨



