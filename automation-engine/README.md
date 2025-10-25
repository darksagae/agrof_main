# 🤖 AGROF Workflow Automation Engine

A powerful workflow automation system similar to n8n, Make, or Zapier, specifically designed for the AGROF agricultural platform. Automate inventory management, customer communications, reporting, and more!

## 🌟 Features

### Core Capabilities
- **Visual Workflow Builder** - User-friendly web interface for creating workflows
- **Pre-built Templates** - Ready-to-use workflows for common agricultural tasks
- **Multiple Trigger Types**:
  - ⏰ **Schedule** - Run workflows at specific times (cron-based)
  - 🔗 **Webhook** - Trigger from external services
  - 📢 **Event** - Respond to system events (low stock, new orders, etc.)
  - 👆 **Manual** - Execute workflows on-demand

### Action Nodes
- **Inventory Management** - Update stock levels, track transactions
- **Notifications** - Send SMS, Email, Push notifications, WhatsApp
- **Database Operations** - Query and update data
- **HTTP Requests** - Integrate with external APIs
- **Product Management** - Update prices, availability, etc.
- **Report Generation** - Create automated reports
- **Data Transformation** - Process and transform data

### Conditional Logic
- **If/Else Conditions** - Branch workflows based on conditions
- **Switch Nodes** - Multi-way branching
- **Filters** - Filter arrays of data
- **Data Transformation** - Map and transform data

## 📦 Pre-built Workflow Templates

1. **Auto Restock Alert** ⭐
   - Daily check for low stock
   - Send SMS/Email to suppliers
   - Create purchase orders automatically

2. **New Order Processing** ⭐
   - Reduce inventory when order placed
   - Send confirmation SMS to customer
   - Notify warehouse staff

3. **Weekly Sales Report** ⭐
   - Generate reports every Monday
   - Email to management
   - Include charts and analytics

4. **Product Expiry Alert** ⚠️
   - Monitor expiring products
   - Apply automatic discounts
   - Alert staff

5. **Customer Re-engagement** 💌
   - Find inactive customers
   - Send promotional messages
   - Track engagement

6. **Price Update Automation** 💰
   - Update from supplier webhook
   - Sync prices automatically
   - Notify admin of changes

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Navigate to project root
cd /home/darksagae/Desktop/agrof-auto

# Start all services including automation engine
docker-compose up -d

# Access the automation dashboard
open http://localhost:3002
```

### Manual Setup

```bash
# Navigate to automation engine directory
cd automation-engine

# Install dependencies
npm install

# Start the service
npm start

# Or for development with auto-reload
npm run dev
```

## 🔧 Configuration

Create a `.env` file in the `automation-engine` directory:

```env
# Server
PORT=3002
NODE_ENV=production

# Database
DB_PATH=./automation.db

# Integration URLs
STORE_BACKEND_URL=http://localhost:3001
API_BACKEND_URL=http://localhost:5000

# SMS Provider (Africa's Talking)
SMS_PROVIDER=africas_talking
AFRICAS_TALKING_USERNAME=sandbox
AFRICAS_TALKING_API_KEY=your_api_key

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@agrof.com

# Firebase Cloud Messaging
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

## 📚 API Documentation

### Base URL
```
http://localhost:3002/api
```

### Workflows

#### Get all workflows
```bash
GET /api/workflows
```

#### Get single workflow
```bash
GET /api/workflows/:id
```

#### Create workflow
```bash
POST /api/workflows
Content-Type: application/json

{
  "name": "My Workflow",
  "description": "Description here",
  "trigger_type": "schedule",
  "trigger_config": {
    "schedule": "daily_6am"
  },
  "nodes": [],
  "connections": []
}
```

#### Update workflow
```bash
PUT /api/workflows/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "is_active": true
}
```

#### Execute workflow manually
```bash
POST /api/workflows/:id/execute
Content-Type: application/json

{
  "data": {},
  "triggeredBy": "manual"
}
```

### Templates

#### Get all templates
```bash
GET /api/templates
```

#### Create workflow from template
```bash
POST /api/templates/:id/create-workflow
Content-Type: application/json

{
  "name": "My Custom Workflow"
}
```

### Executions

#### Get workflow executions
```bash
GET /api/workflows/:id/executions
```

#### Get single execution
```bash
GET /api/executions/:executionId
```

### Events

#### Trigger event-based workflows
```bash
POST /api/events/:eventType
Content-Type: application/json

{
  "eventData": {}
}
```

### Webhooks

#### Create webhook for workflow
```bash
POST /api/workflows/:id/webhook
```

#### Trigger webhook
```bash
POST /api/webhooks/:webhookId
X-Webhook-Secret: your_secret
Content-Type: application/json

{
  "data": {}
}
```

## 🔗 Integration with Store Backend

The automation engine integrates seamlessly with the existing store backend:

### Triggering Workflows from Store Events

In your store backend (`store-backend/server.js`), add event triggers:

```javascript
// Add this to store-backend/server.js
const triggerAutomationEvent = async (eventType, eventData) => {
  try {
    await fetch('http://automation-engine:3002/api/events/' + eventType, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
  } catch (error) {
    console.error('Failed to trigger automation:', error);
  }
};

// Example: Trigger on low stock
app.post('/api/inventory/update-stock', async (req, res) => {
  // ... existing code ...
  
  // After updating stock, check if low
  if (newQuantity <= minimumStockLevel) {
    await triggerAutomationEvent('low_stock', {
      productId,
      productName,
      currentStock: newQuantity,
      minimumStock: minimumStockLevel
    });
  }
  
  // ... rest of code ...
});
```

## 🎯 Use Cases

### 1. Automated Inventory Management
- Monitor stock levels continuously
- Alert when products run low
- Auto-generate purchase orders
- Track supplier performance

### 2. Customer Communication
- Welcome new customers
- Send order confirmations
- Re-engage inactive customers
- Promotional campaigns

### 3. Business Intelligence
- Automated daily/weekly/monthly reports
- Sales analytics
- Inventory turnover reports
- Supplier performance metrics

### 4. Operational Efficiency
- Automatic price updates
- Expiry date monitoring
- Order processing automation
- Warehouse notifications

## 🏗️ Architecture

```
┌─────────────────┐
│  Web UI (React) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  Automation API │◄────►│  Workflow    │
│  (Express.js)   │      │  Engine      │
└────────┬────────┘      └──────┬───────┘
         │                      │
         ▼                      ▼
┌─────────────────┐      ┌──────────────┐
│  SQLite DB      │      │  Scheduler   │
│  (Workflows)    │      │  (node-cron) │
└─────────────────┘      └──────────────┘
         │
         │
         ▼
┌─────────────────────────────────────┐
│         Integrations                │
├─────────────────────────────────────┤
│  • Store Backend (Inventory)        │
│  • SMS (Africa's Talking / Twilio)  │
│  • Email (SendGrid)                 │
│  • Push (Firebase)                  │
│  • WhatsApp Business API            │
│  • External APIs                    │
└─────────────────────────────────────┘
```

## 🛠️ Development

### Adding Custom Node Types

Create a new node executor in `workflow-engine.js`:

```javascript
// In WorkflowEngine class
async customAction(config, data, state) {
  const { param1, param2 } = config;
  
  // Your custom logic here
  console.log(`Executing custom action with ${param1}`);
  
  // Update state
  state.logs.push({
    message: 'Custom action executed',
    timestamp: new Date().toISOString()
  });
  
  // Return updated data
  return { data: { ...data, customResult: true } };
}
```

Register it in `registerBuiltInExecutors()`:

```javascript
this.registerExecutor('custom_action', this.customAction.bind(this));
```

### Adding New Templates

Edit `workflow-templates.json` and add your template:

```json
{
  "name": "My Custom Template",
  "description": "Description of what it does",
  "category": "operations",
  "icon": "🎯",
  "is_popular": false,
  "workflow_definition": {
    "nodes": [...],
    "connections": [...]
  }
}
```

## 📊 Monitoring & Logging

- All workflow executions are logged in the database
- Access execution logs via API or Web UI
- Monitor workflow success/failure rates
- Track execution times and performance

## 🔒 Security

- Webhook secret validation
- Environment variable configuration
- No sensitive data in logs
- Database stored locally
- CORS protection

## 🐛 Troubleshooting

### Workflows not executing on schedule
```bash
# Check scheduler status
curl http://localhost:3002/api/scheduler/status
```

### Database issues
```bash
# Reset database (warning: deletes all workflows)
rm automation.db
npm start
```

### Integration errors
- Check that store-backend is running
- Verify URLs in .env file
- Check API credentials for SMS/Email services

## 📝 License

This automation engine is part of the AGROF project and follows the same licensing terms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
- Check the execution logs
- Verify all dependencies are installed
- Ensure services are running
- Check API credentials

## 🎉 Success!

You now have a powerful workflow automation system integrated into your AGROF platform! Start by exploring the templates and creating your first workflow.

**Happy Automating! 🌱🤖**



