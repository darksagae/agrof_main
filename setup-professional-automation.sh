#!/bin/bash

echo "🚀 Setting up Professional Real-Time Automation"
echo "================================================"
echo ""

AUTOMATION_URL="http://192.168.0.105:3002"

# 1. Create Customer Registration Workflow
echo "1️⃣ Creating Customer Registration Workflow (Real-time)..."
curl -s -X POST "$AUTOMATION_URL/api/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Registration & Welcome",
    "description": "Send welcome message when customer registers (No time limit - instant)",
    "trigger_type": "event",
    "trigger_config": {
      "eventType": "customer_registered"
    },
    "tags": ["customer", "registration", "realtime", "professional"],
    "nodes": [
      {
        "id": "trigger_1",
        "type": "event",
        "label": "Customer Registered Event",
        "is_trigger": true,
        "position": {"x": 100, "y": 100},
        "config": {"eventType": "customer_registered"}
      },
      {
        "id": "whatsapp_welcome",
        "type": "http_request",
        "label": "Send WhatsApp Welcome",
        "position": {"x": 300, "y": 100},
        "config": {
          "method": "POST",
          "url": "http://192.168.0.105:3003/send",
          "headers": {"Content-Type": "application/json"},
          "body": {
            "to": "{{whatsapp}}",
            "message": "Welcome to AGROF Agricultural Services! Your account is ready."
          }
        }
      },
      {
        "id": "notify_admin",
        "type": "http_request",
        "label": "Notify Admin",
        "position": {"x": 500, "y": 100},
        "config": {
          "method": "POST",
          "url": "http://192.168.0.105:3003/send",
          "headers": {"Content-Type": "application/json"},
          "body": {
            "to": "256743232441",
            "message": "NEW CUSTOMER: {{name}} ({{email}})"
          }
        }
      }
    ],
    "connections": [
      {"from": "trigger_1", "to": "whatsapp_welcome"},
      {"from": "whatsapp_welcome", "to": "notify_admin"}
    ]
  }' | python3 -m json.tool

echo ""

# 2. Create Order Completion Workflow (with full details)
echo "2️⃣ Creating Order Completion Workflow (Real-time)..."
curl -s -X POST "$AUTOMATION_URL/api/workflows" \
  -H "Content-Type": application/json" \
  -d '{
    "name": "Complete Order Processing & Admin Notification",
    "description": "Process orders with full customer details (No time limit - instant)",
    "trigger_type": "event",
    "trigger_config": {
      "eventType": "whatsapp_order"
    },
    "tags": ["orders", "whatsapp", "realtime", "professional"],
    "nodes": [
      {
        "id": "trigger_1",
        "type": "event",
        "label": "Order Event",
        "is_trigger": true,
        "position": {"x": 100, "y": 100},
        "config": {"eventType": "whatsapp_order"}
      },
      {
        "id": "inventory_update",
        "type": "inventory_update",
        "label": "Update Inventory",
        "position": {"x": 300, "y": 100},
        "config": {
          "productId": "{{product.id}}",
          "quantity": "{{quantity}}",
          "operation": "remove"
        }
      },
      {
        "id": "notify_admin_detailed",
        "type": "send_notification",
        "label": "Comprehensive Admin Alert",
        "position": {"x": 500, "y": 100},
        "config": {
          "title": "NEW ORDER",
          "body": "Complete order details with customer info, payment, and inventory impact"
        }
      }
    ],
    "connections": [
      {"from": "trigger_1", "to": "inventory_update"},
      {"from": "inventory_update", "to": "notify_admin_detailed"}
    ]
  }' | python3 -m json.tool

echo ""

# 3. Create Low Stock Alert (Continuous monitoring, not time-limited)
echo "3️⃣ Creating Continuous Low Stock Monitoring..."
curl -s -X POST "$AUTOMATION_URL/api/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Continuous Stock Monitoring",
    "description": "Check stock every hour and alert immediately when low (24/7 monitoring)",
    "trigger_type": "schedule",
    "trigger_config": {
      "cronExpression": "0 * * * *",
      "timezone": "Africa/Kampala"
    },
    "tags": ["inventory", "monitoring", "continuous", "professional"],
    "nodes": [
      {
        "id": "trigger_1",
        "type": "schedule",
        "label": "Every Hour",
        "is_trigger": true,
        "position": {"x": 100, "y": 100},
        "config": {"schedule": "0 * * * *"}
      },
      {
        "id": "query_stock",
        "type": "database_query",
        "label": "Check All Stock Levels",
        "position": {"x": 300, "y": 100},
        "config": {
          "query": "SELECT * FROM products WHERE quantity_in_stock <= minimum_stock_level AND quantity_in_stock > 0"
        }
      },
      {
        "id": "alert_admin",
        "type": "send_notification",
        "label": "Immediate WhatsApp Alert",
        "position": {"x": 500, "y": 100},
        "config": {
          "title": "STOCK ALERT",
          "body": "Low stock detected - immediate action required"
        }
      }
    ],
    "connections": [
      {"from": "trigger_1", "to": "query_stock"},
      {"from": "query_stock", "to": "alert_admin"}
    ]
  }' | python3 -m json.tool

echo ""
echo "✅ Professional automation workflows created!"
echo ""
echo "📋 Active Workflows:"
echo "  1. Customer Registration (Real-time, instant)"
echo "  2. Order Processing (Real-time, instant)"
echo "  3. Stock Monitoring (Every hour, 24/7)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 ADMIN CAPABILITIES VIA WHATSAPP:"
echo ""
echo "  • admin add product - Add products via WhatsApp"
echo "  • admin delete product [name] - Remove products"
echo "  • admin price [name] [amount] - Update pricing"
echo "  • admin stock [name] [qty] - Update inventory"
echo "  • admin orders - View recent orders"
echo "  • admin report - Generate reports"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ No time limits - everything is real-time!"
echo "🚀 Professional automation is ACTIVE!"

