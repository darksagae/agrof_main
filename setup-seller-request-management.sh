#!/bin/bash

echo "🚀 Setting up Seller Request Management for WhatsApp Bot"
echo "=================================================="

# Install Supabase client in backend
echo "📦 Installing Supabase client in backend..."
cd /home/darksagae/Desktop/agrof-auto/store-backend
npm install @supabase/supabase-js

echo "✅ Backend dependencies installed"

# Create environment file for backend
echo "🔧 Creating environment configuration..."
cat > /home/darksagae/Desktop/agrof-auto/store-backend/.env << EOF
# Supabase Configuration
SUPABASE_URL=https://xtklayjpdpfykjbttaac.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0a2xheWpwZHBmeWtqYnR0YWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTI2NTcsImV4cCI6MjA3NTY2ODY1N30.GXPo5n_MlOWqIe5lEKcgVJD_A3wyx2IPNyH9DmgXtWM

# Admin Authentication
ADMIN_TOKEN=agrof-admin-2024

# Store API URL
STORE_API_URL=http://localhost:3001/api
EOF

echo "✅ Environment configuration created"

# Create environment file for WhatsApp bot
echo "🔧 Creating WhatsApp bot environment configuration..."
cat > /home/darksagae/Desktop/agrof-auto/whatsapp-bot/.env << EOF
# Admin Configuration
ADMIN_NUMBERS=256700123456
ADMIN_TOKEN=agrof-admin-2024

# Store API Configuration
STORE_API=http://localhost:3001/api

# WhatsApp Configuration
WHATSAPP_SESSION_PATH=./session
EOF

echo "✅ WhatsApp bot environment configuration created"

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Start the backend server:"
echo "   cd /home/darksagae/Desktop/agrof-auto/store-backend"
echo "   npm start"
echo ""
echo "2. Start the WhatsApp bot:"
echo "   cd /home/darksagae/Desktop/agrof-auto/whatsapp-bot"
echo "   npm start"
echo ""
echo "3. Test the seller request approval:"
echo "   Send to WhatsApp: #approve 286f1293-40e8-466b-922c-ebb903e2823c"
echo ""
echo "🔧 Available WhatsApp Commands:"
echo "   #listsellers - List pending requests"
echo "   #approve <id> - Approve request"
echo "   #reject <id> [reason] - Reject request"
echo "   #view <id> - View request details"
echo "   #sellerstats - View statistics"
echo "   admin help - Show all commands"
echo ""
echo "✅ Ready to manage seller requests via WhatsApp!"

