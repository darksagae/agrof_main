# 🔗 VM CONNECTION GUIDE

**VM Details:**
- **IP Address**: 10.100.100.180
- **Username**: user
- **Initial Password**: ncd.7Z-n;Ha)zYT1jB

---

## 🎯 **CONNECT TO YOUR VM**

### **Step 1: SSH Connection**
```bash
ssh user@10.100.100.180
```

### **Step 2: Enter Password**
When prompted, enter:
```
ncd.7Z-n;Ha)zYT1jB
```

---

## ✅ **AFTER SUCCESSFUL CONNECTION**

### **Step 1: Change Password (IMMEDIATE)**
```bash
passwd
```
**Choose a strong new password for security!**

### **Step 2: Add Your SSH Key**
```bash
# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add your public key
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCmCExLW163EordpirQUrbiJ+hGhDhseAdbxRGF14LIlNpc7n80m7/5yB1FYJE2JMqkqJx4IRO+v2R+V0qwb/v8IP96CiCKlpOzqsS7tcAA1MsJXbPoydQiEPXnQbsZ7fiCIQ4RehIL+Lv6cR/9qCa0fUR7gEXq2QzSNPvmE8e5CmkTmykSOBQ9YWEdT1GUBI13VqZWKtMTApuIaejdX6Hsf31AUkzk9aLYcSyvGsxUEIFa2u0mcIWsLsFo6gZ1UVkOyHc316ahc+i2JIs3CTY7CdfNPHImJR140ihBR7gqfKO7XdpkgqlSVYrBr5if7FWAUIg46FMoYUqhUHE5raU37w6BrIzly/poj9lKDxMyz5jjivrjDdDR3Y0OpX0ASY6EuoMT2yBAkhbL0VI8jG3zMCg8SOClU5flhR8DBZfgQu5+xs6+utI6/mk3qYV713gPBRiR1M82A+XB2K4A+6+uhJ6UzGUbz2kk8WOYC0+VAzYyTWU5TciBXxekagEX2L/byf+Gc7SAr/Yyv2z+JqXvzJCfxyxGTO7HdlCyV1ziy+BpD3t/xBf1kQp/StJFL4znfbzOhQyJwUZ9Fc5z22EB/N4EwxRAjaCyWiSPIRSsp4KaHHg1SwpaU2AstyE3N5yUdukFKCicgvsLuSpSgoNkseYHD1jI6FbmodN5fRaztw== darksagae@darksagae" >> ~/.ssh/authorized_keys

# Set proper permissions
chmod 600 ~/.ssh/authorized_keys
```

### **Step 3: Update System**
```bash
sudo apt update && sudo apt upgrade -y
```

### **Step 4: Install Docker**
```bash
# Download Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh

# Install Docker
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

---

## 🎯 **NEXT STEPS FOR AGROF DEPLOYMENT**

### **Step 5: Install Coolify**
```bash
# Install Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash

# Check Coolify status
sudo docker ps | grep coolify
```

### **Step 6: Configure Firewall**
```bash
# Allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # AGROF Store
sudo ufw allow 5000/tcp  # AGROF API
sudo ufw allow 8000/tcp  # Coolify
sudo ufw allow 51820/udp # WireGuard

# Enable firewall
sudo ufw enable
```

### **Step 7: Test Services**
```bash
# Check if services are running
sudo systemctl status docker
sudo docker ps

# Test local connectivity
curl localhost:8000  # Coolify
curl localhost:5000  # AGROF API (when deployed)
curl localhost:3000  # AGROF Store (when deployed)
```

---

## 🔧 **TROUBLESHOOTING**

### **If SSH Connection Fails:**
1. **Check VM Status**: Ensure VM is "Running" in STI Console
2. **Verify IP**: Confirm 10.100.100.180 is correct
3. **Try Different User**: 
   ```bash
   ssh ubuntu@10.100.100.180
   ssh root@10.100.100.180
   ```
4. **Use STI Console**: Access VM through web terminal if SSH fails

### **If Password Authentication Fails:**
1. **Check Password**: Ensure you're typing the exact password
2. **Copy-Paste**: Use copy-paste to avoid typos
3. **Try Again**: Sometimes takes a few attempts

### **If Docker Installation Fails:**
```bash
# Alternative Docker installation
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
```

---

## 📋 **VERIFICATION CHECKLIST**

After successful connection and setup:

- [ ] ✅ SSH connection working
- [ ] ✅ Password changed
- [ ] ✅ SSH key added
- [ ] ✅ System updated
- [ ] ✅ Docker installed
- [ ] ✅ Docker Compose installed
- [ ] ✅ Firewall configured
- [ ] ✅ Coolify installed
- [ ] ✅ Services running

---

## 🚀 **READY FOR AGROF DEPLOYMENT**

Once all steps are complete, you'll have:

- ✅ **Secure VM access** with SSH keys
- ✅ **Docker environment** ready for deployment
- ✅ **Coolify platform** for easy app deployment
- ✅ **Firewall configured** for security
- ✅ **All ports open** for AGROF services

**Next**: Configure Ingress rules and deploy AGROF! 🌾🚀

---

**Connect now with: `ssh user@10.100.100.180`** 💪



