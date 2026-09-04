# 🔧 Fix Docker Installation on STI VM

**Issue:** Package dependency conflicts preventing Docker installation  
**Solution:** Fix broken packages and update package lists  

---

## 🚨 Current Error
```
git : Depends: liberror-perl but it is not installable
E: Unable to correct problems, you have held broken packages.
```

---

## 📋 Manual Fix Commands

**Run these commands in your STI VM (via SSH or VM Console):**

### **Step 1: Update Package Lists**
```bash
sudo apt update
```

### **Step 2: Fix Broken Packages**
```bash
sudo apt --fix-broken install
```

### **Step 3: Clean Package Cache**
```bash
sudo apt clean
sudo apt autoclean
```

### **Step 4: Remove Held Packages**
```bash
sudo apt-mark showhold
```
If any packages are held, unhold them:
```bash
sudo apt-mark unhold <package-name>
```

### **Step 5: Install Missing Dependencies**
```bash
sudo apt install liberror-perl
```

### **Step 6: Install Git and Dependencies**
```bash
sudo apt install git
```

### **Step 7: Install Docker (Official Method)**
```bash
# Remove any old Docker installations
sudo apt remove docker docker-engine docker.io containerd runc

# Install prerequisites
sudo apt update
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### **Step 8: Start Docker Service**
```bash
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### **Step 9: Install Docker Compose**
```bash
sudo apt install docker-compose-plugin
```

### **Step 10: Verify Installation**
```bash
docker --version
docker compose version
sudo docker run hello-world
```

---

## 🎯 Alternative: Use Coolify's Manual Setup

If the automatic installation fails, you can:

1. **Cancel the current setup** in Coolify
2. **Manually fix the VM** using the commands above
3. **Re-run the Coolify setup** once Docker is working

---

## 🚀 Quick Fix Summary

The main issue is that `liberror-perl` package is missing. Run:

```bash
sudo apt update
sudo apt --fix-broken install
sudo apt install liberror-perl git
```

Then retry the Coolify Docker installation.

---

## 📞 If You Need Help

If you're still in the Coolify interface, you can:

1. **Cancel the current setup**
2. **SSH into the VM** (if SSH is working now)
3. **Run the fix commands**
4. **Restart Coolify setup**

---

**The good news: You've successfully connected to the VM and Coolify is working! We just need to fix the package dependencies.** 🎉


