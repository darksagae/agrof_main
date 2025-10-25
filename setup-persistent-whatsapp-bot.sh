#!/bin/bash

echo "🤖 Setting up Persistent WhatsApp Bot"
echo "===================================="

# Kill existing processes
echo "🔄 Stopping existing processes..."
sudo pkill -f "node server.js"
sudo pkill -f "whatsapp-bot"
sleep 3

# Create systemd service for backend
echo "📦 Creating systemd service for backend..."
sudo tee /etc/systemd/system/agrof-backend.service > /dev/null << EOF
[Unit]
Description=AGROF Store Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/darksagae/Desktop/agrof-auto/store-backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

# Create systemd service for WhatsApp bot
echo "📱 Creating systemd service for WhatsApp bot..."
sudo tee /etc/systemd/system/agrof-whatsapp-bot.service > /dev/null << EOF
[Unit]
Description=AGROF WhatsApp Bot
After=network.target agrof-backend.service
Requires=agrof-backend.service

[Service]
Type=simple
User=root
WorkingDirectory=/home/darksagae/Desktop/agrof-auto/whatsapp-bot
ExecStart=/usr/bin/node bot.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
echo "🔄 Reloading systemd..."
sudo systemctl daemon-reload

# Enable services
echo "✅ Enabling services..."
sudo systemctl enable agrof-backend.service
sudo systemctl enable agrof-whatsapp-bot.service

# Start services
echo "🚀 Starting services..."
sudo systemctl start agrof-backend.service
sleep 5
sudo systemctl start agrof-whatsapp-bot.service

# Check status
echo "📊 Checking service status..."
echo ""
echo "Backend Status:"
sudo systemctl status agrof-backend.service --no-pager -l
echo ""
echo "WhatsApp Bot Status:"
sudo systemctl status agrof-whatsapp-bot.service --no-pager -l

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📋 Service Management Commands:"
echo "• sudo systemctl start agrof-backend.service"
echo "• sudo systemctl start agrof-whatsapp-bot.service"
echo "• sudo systemctl stop agrof-backend.service"
echo "• sudo systemctl stop agrof-whatsapp-bot.service"
echo "• sudo systemctl restart agrof-backend.service"
echo "• sudo systemctl restart agrof-whatsapp-bot.service"
echo "• sudo systemctl status agrof-backend.service"
echo "• sudo systemctl status agrof-whatsapp-bot.service"
echo ""
echo "📱 WhatsApp Bot will now:"
echo "• Start automatically on boot"
echo "• Restart if it crashes"
echo "• Run continuously without logout"
echo "• Persist across server reboots"
echo ""
echo "🔧 To check logs:"
echo "• sudo journalctl -u agrof-backend.service -f"
echo "• sudo journalctl -u agrof-whatsapp-bot.service -f"
