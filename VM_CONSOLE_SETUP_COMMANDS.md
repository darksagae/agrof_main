# 🖥️ VM Console Setup Commands - Copy & Paste

**VM Console URL:** https://console.sti.go.ug/customer/sti_industry__1/cloudspaces/dWcta2xhLWRjMDEtMDAxOjY0MA/vms/23568/console

---

## 📋 Step-by-Step Instructions

### **Step 1: Login to VM**
```
Username: user
Password: ncd.7Z-n;Ha)zYT1jB
```

---

### **Step 2: Change Password**
Copy and paste each command one at a time:

```bash
# Change password
passwd
```
When prompted, enter:
- New password: `007Darksagae@!`
- Retype password: `007Darksagae@!`

---

### **Step 3: Create SSH Directory**
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

---

### **Step 4: Add SSH Public Key**
```bash
cat > ~/.ssh/authorized_keys << 'EOF'
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIyTC98uWOJpCKm/FAPgbTgvP4b0FajKGIfAjo6Mji98 coolify-server-access
EOF
```

---

### **Step 5: Set Correct Permissions**
```bash
chmod 600 ~/.ssh/authorized_keys
```

---

### **Step 6: Verify SSH Service**
```bash
# Check SSH status
sudo systemctl status ssh
```

If SSH is not running, start it:
```bash
sudo systemctl enable ssh
sudo systemctl start ssh
```

---

### **Step 7: Check Firewall (if any)**
```bash
# Check if UFW firewall is active
sudo ufw status

# If active and blocking SSH, allow it:
sudo ufw allow 22/tcp
```

---

### **Step 8: Verify Configuration**
```bash
# Check authorized_keys file
cat ~/.ssh/authorized_keys

# Check SSH is listening
sudo netstat -tlnp | grep :22
```

You should see:
```
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      XXX/sshd
tcp6       0      0 :::22                   :::*                    LISTEN      XXX/sshd
```

---

### **Step 9: Get System Info**
```bash
# Check hostname and IP
hostname
ip addr show

# Check disk space
df -h

# Check memory
free -h
```

---

## ✅ Verification Checklist

After running all commands, verify:
- [ ] Password changed to `007Darksagae@!`
- [ ] SSH key added to `~/.ssh/authorized_keys`
- [ ] SSH service is running
- [ ] Port 22 is listening

---

## 🚀 After VM Console Setup

Once you've completed all the steps above, **test SSH from your local machine**:

```bash
# Make sure WireGuard is connected
sudo wg show AGROF

# Try SSH
ssh user@10.100.100.180
```

If it works, you're ready to install Docker! 🎉

---

## 📝 Notes

- **VM IP:** 10.100.100.180
- **Username:** user
- **Password:** 007Darksagae@!
- **SSH Key:** Already configured (coolify-server-access)

---

## 🆘 If SSH Still Doesn't Work

If SSH still times out after this setup, it might be an **Ingress rule** issue. You may need to:

1. Go to: STI Console → Networking → Ingress/Firewall Rules
2. Add rule to allow TCP port 22 from your VPN IP (10.100.101.13)

But try the SSH connection first - it might just work! 🤞


