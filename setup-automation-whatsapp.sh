#!/bin/bash

echo "🔧 Setting up Automation Engine & WhatsApp Bot"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create .env files
echo "📝 Creating .env files..."

# WhatsApp Bot .env
cat > whatsapp-bot/.env << 'EOF'
STORE_API=http://192.168.0.105:3001
AUTOMATION_API=http://192.168.0.105:3002
ADMIN_NUMBERS=
BOT_NAME=AGROF Assistant
RESPONSE_DELAY=1000
DEBUG=false
EOF

if [ -f "whatsapp-bot/.env" ]; then
    echo -e "${GREEN}✅ WhatsApp Bot .env created${NC}"
else
    echo -e "${YELLOW}⚠️  Failed to create whatsapp-bot/.env${NC}"
fi

# Automation Engine .env
cat > automation-engine/.env << 'EOF'
PORT=3002
STORE_BACKEND_URL=http://192.168.0.105:3001
WHATSAPP_ENABLED=false
SCHEDULER_ENABLED=true
SCHEDULER_TIMEZONE=Africa/Kampala
DEBUG=false
EOF

if [ -f "automation-engine/.env" ]; then
    echo -e "${GREEN}✅ Automation Engine .env created${NC}"
else
    echo -e "${YELLOW}⚠️  Failed to create automation-engine/.env${NC}"
fi

echo ""
echo "🎯 Configuration complete!"
echo ""
echo "Next steps:"
echo "  1. Start Automation Engine:"
echo "     cd automation-engine && node server.js"
echo ""
echo "  2. Restart WhatsApp Bot:"
echo "     pkill -f bot.js && cd whatsapp-bot && node bot.js"
echo ""
echo "  3. (Optional) Add admin numbers to whatsapp-bot/.env"
echo ""
