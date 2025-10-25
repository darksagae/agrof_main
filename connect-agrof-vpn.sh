#!/bin/bash

echo "🔧 AGROF VPN CONNECTION SCRIPT"
echo "=============================="

# Disconnect any existing VPN connections
echo "📴 Disconnecting existing VPN connections..."
sudo wg-quick down wg0 2>/dev/null || echo "  - wg0 not running"
sudo wg-quick down AGROF 2>/dev/null || echo "  - AGROF not running"
sudo wg-quick down agrof 2>/dev/null || echo "  - agrof not running"

# Wait a moment
sleep 2

# Connect using AGROF.conf
echo "🔗 Connecting to STI server using AGROF.conf..."
sudo wg-quick up /home/darksagae/DATA/AGROF.conf

# Verify connection
echo "✅ Verifying AGROF VPN connection..."
sudo wg show AGROF

echo ""
echo "🎯 AGROF VPN Status:"
echo "  - Interface: AGROF"
echo "  - Local IP: 10.100.101.13"
echo "  - STI Server: 41.220.3.53:51820"
echo "  - Allowed IPs: 10.100.101.1/32, 10.100.100.0/24"
echo ""
echo "✅ Ready for Coolify deployment!"

