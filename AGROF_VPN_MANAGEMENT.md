# 🔧 AGROF VPN Management Guide

## ✅ Current Status
- **Active VPN**: AGROF interface
- **Local IP**: 10.100.101.13
- **STI Server**: 41.220.3.53:51820
- **Configuration**: `/home/darksagae/DATA/AGROF.conf`

---

## 🎯 Quick Commands

### Connect AGROF VPN
```bash
# Use the script (recommended)
./connect-agrof-vpn.sh

# Or manually
sudo wg-quick up /home/darksagae/DATA/AGROF.conf
```

### Disconnect All VPNs
```bash
sudo wg-quick down wg0
sudo wg-quick down AGROF
```

### Check VPN Status
```bash
sudo wg show
```

---

## 🔧 VPN Configuration Details

### AGROF Configuration File
- **Location**: `/home/darksagae/DATA/AGROF.conf`
- **Interface**: AGROF
- **Local IP**: 10.100.101.13/32
- **STI Server**: 41.220.3.53:51820
- **Allowed IPs**: 10.100.101.1/32, 10.100.100.0/24

### Network Details
- **Your IP**: 10.100.101.13
- **STI Gateway**: 10.100.101.1
- **STI Network**: 10.100.100.0/24
- **Coolify Access**: http://10.100.100.1:8000 or http://10.100.101.1:8000

---

## 🚀 For Coolify Deployment

### Ensure VPN is Connected
```bash
# Check if AGROF is connected
sudo wg show AGROF

# If not connected, run:
./connect-agrof-vpn.sh
```

### Access Coolify
- **Primary URL**: http://10.100.100.1:8000
- **Secondary URL**: http://10.100.101.1:8000

---

## 🔍 Troubleshooting

### If VPN Won't Connect
```bash
# Check if WireGuard is installed
sudo wg --version

# Check configuration file
cat /home/darksagae/DATA/AGROF.conf

# Restart WireGuard service
sudo systemctl restart wg-quick@AGROF
```

### If Multiple VPNs are Running
```bash
# Disconnect all
sudo wg-quick down wg0
sudo wg-quick down AGROF
sudo wg-quick down agrof

# Connect only AGROF
sudo wg-quick up /home/darksagae/DATA/AGROF.conf
```

### Check Network Routes
```bash
# View routing table
ip route show

# Test connectivity
ping -c 3 10.100.101.1
```

---

## 📋 VPN Management Script

The `connect-agrof-vpn.sh` script:
1. Disconnects any existing VPN connections
2. Connects using AGROF.conf
3. Verifies the connection
4. Shows connection status

### Usage
```bash
cd /home/darksagae/Desktop/agrof-auto
./connect-agrof-vpn.sh
```

---

## 🎯 For Coolify Deployment

### Pre-Deployment Checklist
- [ ] AGROF VPN connected (10.100.101.13)
- [ ] Can access Coolify dashboard
- [ ] Base Directory set to `agrof-main`
- [ ] Port set to 5000
- [ ] Environment variables configured

### Coolify Settings
```
Repository: darksagae/agrof_main
Branch: feature/mobile-api-config
Base Directory: agrof-main
Dockerfile Location: Dockerfile
Port: 5000
```

---

## 🔧 Advanced VPN Management

### Auto-Connect on Boot
```bash
# Enable AGROF VPN on system startup
sudo systemctl enable wg-quick@AGROF
```

### Manual Connection
```bash
# Connect manually
sudo wg-quick up /home/darksagae/DATA/AGROF.conf

# Disconnect manually
sudo wg-quick down AGROF
```

### Check Connection Quality
```bash
# Monitor handshake
sudo wg show AGROF

# Check transfer statistics
sudo wg show AGROF transfer
```

---

## 📞 Support

If you encounter issues:
1. Check VPN status: `sudo wg show`
2. Verify configuration: `cat /home/darksagae/DATA/AGROF.conf`
3. Test connectivity: `ping 10.100.101.1`
4. Restart VPN: `./connect-agrof-vpn.sh`

---

**Current Status**: ✅ AGROF VPN Connected and Ready for Coolify Deployment!

