# 🖥️ STI VM Access Guide - Quick Reference

**VM IP:** 10.100.100.180  
**Status:** WireGuard VPN ✅ Connected | SSH ⚠️ Blocked  

---

## 🎯 IMMEDIATE ACTION REQUIRED

You need to access your VM via the **STI Console** (web-based terminal) to configure SSH access.

---

## 📋 Step-by-Step Instructions

### **Step 1: Login to STI Console**
1. Open browser and go to: https://console.sti.go.ug
2. Login with:
   - Email: `sagacrytospace@gmail.com`
   - Password: `007Darksagae@!`

### **Step 2: Access VM Console**
1. Click: **"Compute"** → **"Virtual Machines"**
2. Find your VM with IP: `10.100.100.180`
3. Click the **"Console"** button (looks like a terminal icon)
4. A web-based terminal will open

### **Step 3: Login to VM**
In the web console, login with:
```
Username: user
Password: ncd.7Z-n;Ha)zYT1jB
```

### **Step 4: Change Password**
```bash
# Change password to your preferred one
passwd

# Enter new password: 007Darksagae@!
# Confirm password: 007Darksagae@!
```

### **Step 5: Add SSH Key**
```bash
# Create SSH directory
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Create authorized_keys file
nano ~/.ssh/authorized_keys
```

**Paste your SSH public key** (from your local machine):
```bash
# On your LOCAL machine, get your SSH public key:
cat ~/.ssh/id_rsa.pub
# Or if you use ed25519:
cat ~/.ssh/id_ed25519.pub

# Copy the output and paste it into the VM's authorized_keys file
```

Then save and exit (Ctrl+X, Y, Enter)

```bash
# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
```

### **Step 6: Verify SSH Service**
```bash
# Check if SSH is running
sudo systemctl status ssh

# If not running, start it:
sudo systemctl enable ssh
sudo systemctl start ssh

# Check if port 22 is listening
sudo netstat -tlnp | grep :22
```

### **Step 7: Test SSH from Your Computer**
Open a new terminal on your local machine:
```bash
# Make sure WireGuard is connected
sudo wg show AGROF

# Try SSH connection
ssh user@10.100.100.180

# Should now work! 🎉
```

---

## 🔑 Your SSH Public Key

If you don't have an SSH key yet, create one on your **local machine**:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "sagacrytospace@gmail.com"

# Press Enter for default location
# Press Enter for no passphrase (or set one if you prefer)

# Display your public key
cat ~/.ssh/id_ed25519.pub

# Copy this entire line - it should look like:
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... sagacrytospace@gmail.com
```

---

## 🆘 Troubleshooting

### "I can't see the Console button"
- Make sure you're logged in to https://console.sti.go.ug
- Go to: Compute → Virtual Machines
- Look for a terminal/monitor icon next to your VM

### "Console is not responding"
- Try refreshing the browser
- Try a different browser (Chrome/Firefox)
- Make sure your VM is running (should show "RUNNING" status)

### "SSH still doesn't work after adding key"
1. Check WireGuard is connected:
   ```bash
   sudo wg show AGROF
   ```
2. Check routing:
   ```bash
   ip route get 10.100.100.180
   ```
3. Try SSH with verbose mode:
   ```bash
   ssh -vvv user@10.100.100.180
   ```

### "Can't login to VM Console"
- Username: `user` (lowercase)
- Password: `ncd.7Z-n;Ha)zYT1jB` (case-sensitive, exact)

---

## 📊 Connection Diagram

```
Your Computer
     |
     | WireGuard VPN (AGROF)
     | ✅ Connected
     |
     v
STI Network (10.100.100.0/24)
     |
     v
Your VM (10.100.100.180)
     |
     | Method 1: STI Web Console ✅ (Use this now)
     | Method 2: SSH via VPN ⚠️ (After Step 5)
     |
     v
VM Terminal Access
```

---

## 🎯 After SSH is Working

Once you can SSH into the VM, you can:

1. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

2. **Install Docker Compose:**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Deploy AGROF Platform:**
   - Pull code from GitHub
   - Configure environment variables
   - Run docker-compose up

---

## 🚀 Quick Command Reference

### Check WireGuard Status
```bash
sudo wg show AGROF
```

### SSH to VM (after setup)
```bash
ssh user@10.100.100.180
```

### Get Your Local SSH Public Key
```bash
cat ~/.ssh/id_ed25519.pub
# or
cat ~/.ssh/id_rsa.pub
```

---

**⏰ Estimated Time:** 10-15 minutes  
**Difficulty:** Easy  
**Prerequisites:** WireGuard VPN connected ✅

---

**🎯 START NOW:** Go to https://console.sti.go.ug and follow Step 1!


