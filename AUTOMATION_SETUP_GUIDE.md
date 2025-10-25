# 🤖 AGROF Automation System - Complete Setup Guide

## Overview

The AGROF Automation System is a powerful workflow automation platform similar to n8n, Make (formerly Integromat), or Zapier. It allows you to automate repetitive tasks in your agricultural business without writing code.

## 🎯 What Can You Automate?

### Inventory Management
- ✅ Auto-alert suppliers when stock is low
- ✅ Generate purchase orders automatically
- ✅ Monitor expiry dates and apply discounts
- ✅ Track inventory turnover

### Customer Communications
- ✅ Send order confirmations via SMS
- ✅ Welcome new customers
- ✅ Re-engage inactive customers
- ✅ Send promotional campaigns

### Business Intelligence
- ✅ Generate daily/weekly/monthly reports
- ✅ Email reports to management
- ✅ Track sales trends
- ✅ Monitor supplier performance

### Operations
- ✅ Process orders automatically
- ✅ Update prices from suppliers
- ✅ Notify warehouse staff
- ✅ Sync data between systems

## 📦 Installation

### Option 1: Docker (Recommended)

The automation engine is already configured in your `docker-compose.yml`.

```bash
# Navigate to project directory
cd /home/darksagae/Desktop/agrof-auto

# Start all services including automation engine
docker-compose up -d

# Check that automation service is running
docker-compose ps

# View logs
docker-compose logs -f automation-engine
```

Access the automation dashboard at: **http://localhost:3002**

### Option 2: Manual Installation

```bash
# Navigate to automation engine directory
cd /home/darksagae/Desktop/agrof-auto/automation-engine

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start the service
npm start

# Or for development with auto-reload
npm run dev
```

## ⚙️ Configuration

### 1. Basic Configuration

Edit `automation-engine/.env`:

```env
# Server Configuration
PORT=3002
NODE_ENV=production

# Database (SQLite)
DB_PATH=./automation.db

# Integration URLs
STORE_BACKEND_URL=http://localhost:3001
API_BACKEND_URL=http://localhost:5000
```

### 2. SMS Configuration (Optional but Recommended)

#### Using Africa's Talking (Recommended for Africa)

1. Sign up at https://africastalking.com
2. Get your API Key from the dashboard
3. Add to `.env`:

```env
SMS_PROVIDER=africas_talking
AFRICAS_TALKING_USERNAME=your_username
AFRICAS_TALKING_API_KEY=your_api_key
```

#### Using Twilio (Alternative)

1. Sign up at https://twilio.com
2. Get your credentials from the dashboard
3. Add to `.env`:

```env
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. Email Configuration (Optional)

#### Using SendGrid

1. Sign up at https://sendgrid.com
2. Create an API key
3. Add to `.env`:

```env
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@agrof.com
```

### 4. Push Notifications (Optional)

#### Using Firebase Cloud Messaging

1. Get your Firebase credentials from Firebase Console
2. Add to `.env`:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

## 🚀 Getting Started

### Step 1: Access the Dashboard

Open your browser and navigate to:
```
http://localhost:3002
```

You'll see the AGROF Automation Dashboard with:
- **Dashboard** - Overview and statistics
- **My Workflows** - Your created workflows
- **Templates** - Pre-built workflow templates
- **Executions** - Workflow execution history

### Step 2: Create Your First Workflow from a Template

1. Click on the **Templates** tab
2. Browse available templates
3. Click on "Auto Restock Alert" (Popular template)
4. Enter a name for your workflow
5. Click **Create**

Your workflow is now created! Let's customize it:

### Step 3: Customize Your Workflow

Currently, workflows can be customized via API. A visual editor is coming soon!

#### Example: Customize SMS Phone Number

```bash
curl -X PUT http://localhost:3002/api/workflows/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Custom Restock Alert",
    "is_active": true
  }'
```

### Step 4: Test Your Workflow

Click the **Run** button on your workflow card to test it immediately!

Or use the API:

```bash
curl -X POST http://localhost:3002/api/workflows/1/execute \
  -H "Content-Type: application/json" \
  -d '{"triggeredBy": "manual-test"}'
```

### Step 5: Monitor Executions

1. Go to the **Executions** tab
2. See all workflow runs with their status
3. Click on an execution to see detailed logs

## 📋 Pre-built Templates

### 1. Auto Restock Alert ⭐ (Popular)

**What it does:**
- Runs daily at 6 AM
- Checks all products for low stock
- Sends SMS to supplier
- Emails admin with details

**Customization:**
- Change schedule time
- Update phone numbers
- Add more notification channels

### 2. New Order Processing ⭐ (Popular)

**What it does:**
- Triggers when new order is placed
- Reduces inventory automatically
- Sends confirmation SMS to customer
- Notifies warehouse staff

**Customization:**
- Add email confirmation
- Include order details in SMS
- Customize warehouse notification

### 3. Weekly Sales Report ⭐ (Popular)

**What it does:**
- Runs every Monday at 9 AM
- Generates comprehensive sales report
- Emails report to management

**Customization:**
- Change report frequency
- Add more metrics
- Customize report format

### 4. Product Expiry Alert

**What it does:**
- Runs daily at noon
- Finds products expiring in 30 days
- Applies 20% discount automatically
- Alerts staff

**Customization:**
- Change discount percentage
- Adjust warning days
- Add customer notifications

### 5. Customer Re-engagement

**What it does:**
- Runs weekly on Friday
- Finds customers inactive for 30 days
- Sends promotional SMS

**Customization:**
- Change inactivity threshold
- Customize message
- Add email channel

### 6. Price Update from Supplier

**What it does:**
- Webhook trigger from supplier
- Updates product prices
- Notifies admin

**Customization:**
- Add price change alerts
- Customize update logic
- Add approval workflow

## 🔧 Advanced Usage

### Creating Custom Workflows via API

```bash
curl -X POST http://localhost:3002/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Stock Report",
    "description": "Send daily inventory report",
    "trigger_type": "schedule",
    "trigger_config": {
      "schedule": "daily_9am"
    },
    "nodes": [
      {
        "id": "trigger_1",
        "type": "schedule",
        "config": { "schedule": "daily_9am" },
        "position": { "x": 100, "y": 100 },
        "is_trigger": true
      },
      {
        "id": "query_1",
        "type": "database_query",
        "config": {
          "query": "SELECT * FROM products WHERE quantity_in_stock > 0",
          "params": []
        },
        "position": { "x": 300, "y": 100 }
      },
      {
        "id": "email_1",
        "type": "send_email",
        "config": {
          "to": "admin@agrof.com",
          "subject": "Daily Stock Report",
          "body": "Current inventory: {{queryResult.length}} products in stock"
        },
        "position": { "x": 500, "y": 100 }
      }
    ],
    "connections": [
      { "from": "trigger_1", "to": "query_1" },
      { "from": "query_1", "to": "email_1" }
    ]
  }'
```

### Triggering Workflows from Store Backend

Add this to your `store-backend/server.js`:

```javascript
// Helper function to trigger automation workflows
const triggerAutomation = async (eventType, data) => {
  try {
    const response = await fetch('http://automation-engine:3002/api/events/' + eventType, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Automation trigger failed:', error);
  }
};

// Example: Trigger on low stock
app.post('/api/inventory/update-stock', async (req, res) => {
  // ... your existing code ...
  
  // After stock update, check if low
  if (newStock <= minStock) {
    await triggerAutomation('low_stock', {
      productId: product.id,
      productName: product.name,
      currentStock: newStock,
      minimumStock: minStock
    });
  }
  
  // ... rest of your code ...
});

// Example: Trigger on new order
app.post('/api/orders', async (req, res) => {
  // ... create order ...
  
  await triggerAutomation('order_created', {
    orderId: order.id,
    customerId: order.customerId,
    items: order.items,
    total: order.total
  });
  
  res.json(order);
});
```

### Creating Webhooks

```bash
# Create webhook for a workflow
curl -X POST http://localhost:3002/api/workflows/1/webhook

# Response:
{
  "webhookUrl": "/api/webhooks/abc-123-def",
  "webhookSecret": "secret-key-here"
}

# Use the webhook
curl -X POST http://localhost:3002/api/webhooks/abc-123-def \
  -H "X-Webhook-Secret: secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{"data": "your data here"}'
```

## 📊 Monitoring & Analytics

### View All Workflows

```bash
curl http://localhost:3002/api/workflows
```

### Check Scheduler Status

```bash
curl http://localhost:3002/api/scheduler/status
```

### View Execution History

```bash
curl http://localhost:3002/api/workflows/1/executions
```

### View Single Execution Details

```bash
curl http://localhost:3002/api/executions/exec_123456
```

## 🔍 Troubleshooting

### Problem: Workflows not executing on schedule

**Solution:**
```bash
# Check scheduler status
curl http://localhost:3002/api/scheduler/status

# Restart automation service
docker-compose restart automation-engine
```

### Problem: SMS not sending

**Solution:**
- Check your SMS provider credentials in `.env`
- Verify phone numbers are in international format (+256...)
- Check API credits/balance
- View logs: `docker-compose logs -f automation-engine`

### Problem: Database errors

**Solution:**
```bash
# Backup current database
cp automation-engine/automation.db automation-engine/automation.db.backup

# Reset database (creates fresh schema)
rm automation-engine/automation.db
docker-compose restart automation-engine
```

### Problem: Integration not working

**Solution:**
- Ensure store-backend is running: `docker-compose ps`
- Check URLs in `.env` are correct
- Verify network connectivity between services
- Check logs for both services

## 🎓 Examples & Use Cases

### Example 1: Automated Weekly Inventory Report

```javascript
// Workflow: "Weekly Inventory Report"
{
  "trigger": "schedule",
  "schedule": "weekly_monday",
  "actions": [
    "Query all products",
    "Generate PDF report",
    "Email to management",
    "Store in cloud backup"
  ]
}
```

### Example 2: Smart Reordering

```javascript
// Workflow: "Smart Reorder System"
{
  "trigger": "schedule",
  "schedule": "daily_6am",
  "logic": [
    "Check products below minimum stock",
    "Calculate optimal reorder quantity",
    "Check supplier availability",
    "Create purchase order",
    "Email to supplier",
    "SMS notification to admin"
  ]
}
```

### Example 3: Customer Lifecycle Automation

```javascript
// Workflow 1: Welcome new customers
{
  "trigger": "event:customer_registered",
  "actions": ["Send welcome SMS", "Send welcome email with discount code"]
}

// Workflow 2: Re-engage inactive customers
{
  "trigger": "schedule:weekly",
  "logic": ["Find customers inactive > 30 days", "Send promotional SMS"]
}

// Workflow 3: Reward loyal customers
{
  "trigger": "event:order_completed",
  "logic": [
    "Count customer orders",
    "If orders > 10, send loyalty reward SMS"
  ]
}
```

## 📱 Mobile Integration

The automation system works seamlessly with your mobile app:

1. **Push Notifications** - Send alerts to app users
2. **Order Updates** - Auto-update order status
3. **Stock Alerts** - Notify when products back in stock
4. **Promotions** - Send targeted deals

## 🔒 Security Best Practices

1. **Use Webhooks Secrets** - Always validate webhook signatures
2. **Environment Variables** - Store credentials in `.env`, never in code
3. **Regular Backups** - Backup `automation.db` regularly
4. **Monitor Logs** - Check for unusual activity
5. **Limit API Access** - Use firewall rules if exposing publicly

## 🚀 Production Deployment

### Using Docker (Recommended)

```bash
# On your production server
git clone your-repo
cd agrof-auto

# Edit production .env files
nano automation-engine/.env

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Using PM2 (Alternative)

```bash
# Install PM2
npm install -g pm2

# Start automation engine
cd automation-engine
pm2 start server.js --name agrof-automation

# Save PM2 configuration
pm2 save
pm2 startup
```

## 📈 Scaling

For high-volume workflows:

1. **Use Redis Queue** - Add Bull queue for job processing
2. **Separate Workers** - Run multiple worker instances
3. **Database Optimization** - Consider PostgreSQL for scale
4. **Load Balancing** - Use Nginx for multiple instances
5. **Monitoring** - Add Prometheus/Grafana

## 🆘 Support & Help

### Documentation
- Main README: `/automation-engine/README.md`
- API Documentation: Built into dashboard
- Examples: Check `workflow-templates.json`

### Logs
```bash
# Docker logs
docker-compose logs -f automation-engine

# Manual logs
tail -f automation-engine/logs/app.log
```

### Community
- Check GitHub Issues
- Join AGROF Discord/Slack
- Email support team

## 🎉 You're All Set!

Your AGROF Automation System is now ready to use! Start with the templates and customize them to fit your business needs.

**Next Steps:**
1. ✅ Access dashboard at http://localhost:3002
2. ✅ Create workflow from template
3. ✅ Test with manual execution
4. ✅ Monitor execution logs
5. ✅ Set up SMS/Email providers
6. ✅ Integrate with store backend

**Happy Automating! 🌱🤖**



