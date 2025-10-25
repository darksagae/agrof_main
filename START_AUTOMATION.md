# 🚀 Quick Start - AGROF Automation System

## One-Command Start

```bash
cd /home/darksagae/Desktop/agrof-auto
docker-compose up -d
```

That's it! Now open: **http://localhost:3002**

## What's Running?

After running docker-compose, you'll have:

1. **Automation Engine** (Port 3002) - Main automation service
2. **Store Backend** (Port 3001) - Inventory & store management  
3. **API Backend** (Port 5000) - AI crop detection service

## First Steps

### 1. Access the Dashboard
```
http://localhost:3002
```

### 2. Create Your First Workflow

**Option A: Use a Template (Easiest)**
1. Click **Templates** tab
2. Choose "Auto Restock Alert" 
3. Click on it and enter a name
4. Done! Workflow created

**Option B: Use API**
```bash
# Create from template
curl -X POST http://localhost:3002/api/templates/1/create-workflow \
  -H "Content-Type: application/json" \
  -d '{"name": "My Restock Alert"}'
```

### 3. Test Your Workflow

**Via Dashboard:**
- Go to "My Workflows"
- Click the **Run** button

**Via API:**
```bash
curl -X POST http://localhost:3002/api/workflows/1/execute \
  -H "Content-Type: application/json" \
  -d '{"triggeredBy": "manual-test"}'
```

### 4. View Results

- Go to **Executions** tab
- See your workflow run with status and logs

## Available Templates

All templates are pre-loaded and ready to use:

1. **Auto Restock Alert** ⭐ - Alert suppliers when stock is low
2. **New Order Processing** ⭐ - Process orders automatically
3. **Weekly Sales Report** ⭐ - Email reports every Monday
4. **Product Expiry Alert** - Monitor expiring products
5. **Customer Re-engagement** - Re-engage inactive customers  
6. **Price Update Automation** - Update prices from suppliers

## Check if Everything is Working

```bash
# Check all services are running
docker-compose ps

# Expected output:
# automation-engine  Up  (healthy)
# store-backend      Up  (healthy)
# api                Up  (healthy)

# Check automation service specifically
curl http://localhost:3002/api/health

# Expected output:
# {"status":"OK","service":"AGROF Automation Engine"}
```

## Common Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Restart Automation Service
```bash
docker-compose restart automation-engine
```

### View Logs
```bash
# All services
docker-compose logs -f

# Just automation
docker-compose logs -f automation-engine
```

### Check What's Running
```bash
docker-compose ps
```

## Troubleshooting

### Port Already in Use?
```bash
# Check what's using the port
sudo lsof -i :3002

# Kill the process or change port in docker-compose.yml
```

### Service Won't Start?
```bash
# View detailed logs
docker-compose logs automation-engine

# Rebuild if needed
docker-compose build automation-engine
docker-compose up -d
```

### Can't Access Dashboard?
```bash
# Check if container is running
docker-compose ps automation-engine

# Check container health
docker inspect agrof-auto_automation-engine_1 | grep -A 10 Health

# Try accessing from container
docker-compose exec automation-engine curl localhost:3002/api/health
```

## Next Steps

1. ✅ **Configure SMS/Email** - Edit `automation-engine/.env`
2. ✅ **Integrate with Store** - See `AUTOMATION_SETUP_GUIDE.md`
3. ✅ **Create Custom Workflows** - Use the API
4. ✅ **Monitor Executions** - Check the dashboard regularly

## More Help

- **Full Guide**: Read `AUTOMATION_SETUP_GUIDE.md`
- **API Docs**: Open http://localhost:3002 and check the API tab
- **Examples**: Look in `automation-engine/workflow-templates.json`
- **Logs**: `docker-compose logs -f automation-engine`

## Quick Test Script

Save this as `test-automation.sh` and run it to test everything:

```bash
#!/bin/bash

echo "🧪 Testing AGROF Automation System..."

# Test health endpoint
echo -n "1. Health check... "
curl -s http://localhost:3002/api/health | grep -q "OK" && echo "✅" || echo "❌"

# Test templates endpoint
echo -n "2. Templates loaded... "
TEMPLATES=$(curl -s http://localhost:3002/api/templates | jq length)
echo "✅ ($TEMPLATES templates)"

# Test workflows endpoint  
echo -n "3. Workflows endpoint... "
curl -s http://localhost:3002/api/workflows > /dev/null && echo "✅" || echo "❌"

# Test scheduler status
echo -n "4. Scheduler running... "
curl -s http://localhost:3002/api/scheduler/status | grep -q "isRunning" && echo "✅" || echo "❌"

echo ""
echo "✨ All tests complete! Your automation system is ready."
echo "🌐 Dashboard: http://localhost:3002"
```

Make it executable and run:
```bash
chmod +x test-automation.sh
./test-automation.sh
```

## That's It! 🎉

Your automation system is now running. Start automating your agricultural business! 🌱🤖



