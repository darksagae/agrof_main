# 🚀 AGROF DEPLOYMENT TO STI - COMPLETE PLAN

**Date**: October 16, 2025  
**Server**: STI VM @ 102.209.111.68 (2 vCPU, 2 GB RAM, 100 GB disk)  
**Status**: Ready for deployment

---

## 📊 CURRENT STATUS

### ✅ COMPLETED
- [x] STI Console account created (sagacrypotspace@gmail.com)
- [x] Ubuntu VM provisioned (102.209.111.68)
- [x] Coolify installed and running (http://10.0.0.1:8000)
- [x] WireGuard VPN configured (wg0 interface)
- [x] AGROF services tested locally via Docker Compose
- [x] SSH key added to STI IAM
- [x] Project size analysis completed
- [x] TensorFlow Lite impact assessed

### ⏳ PENDING
- [ ] Configure STI Ingress (Firewall Rules)
- [ ] Deploy AGROF API to Coolify
- [ ] Deploy AGROF Store to Coolify
- [ ] Configure custom domains
- [ ] Set up SSL certificates
- [ ] Configure mobile app endpoints
- [ ] Set up monitoring and logging

---

## 🎯 DEPLOYMENT APPROACH

### **Your Setup vs Standard Hackathon Setup**

| Aspect | Standard Hackathon | Your Advanced Setup |
|--------|-------------------|---------------------|
| **Coolify** | Shared (developer.abq.africa) | Private (your VM) |
| **Control** | Limited | Full control |
| **Resources** | Shared | Dedicated 2GB RAM |
| **Flexibility** | Basic | Advanced |
| **SSL** | Auto-configured | Self-managed |

**Advantage**: You have full control over your infrastructure! 🎉

---

## 📝 DEPLOYMENT STEPS

### **PHASE 1: CONFIGURE STI INGRESS (CRITICAL!)**

**What is Ingress?**
Ingress is STI's firewall/port forwarding system that exposes your VM services to the internet.

**Required Ingress Rules:**

```
┌─────────────────────────────────────────────────────────────┐
│  Rule Name       │  Public Port  │  Private IP    │  Private Port │
├─────────────────────────────────────────────────────────────┤
│  ssh-access      │  22           │  10.100.100.X  │  22           │
│  http-traffic    │  80           │  10.100.100.X  │  80           │
│  https-traffic   │  443          │  10.100.100.X  │  443          │
│  coolify-web     │  8000         │  10.100.100.X  │  8000         │
│  agrof-api       │  5000         │  10.100.100.X  │  5000         │
│  agrof-store     │  3000         │  10.100.100.X  │  3000         │
│  wireguard-vpn   │  51820        │  10.100.100.X  │  51820        │
└─────────────────────────────────────────────────────────────┘
```

**How to Add Ingress Rules:**

1. **Login to STI Console**: https://console.sti.go.ug
2. **Navigate**: Resources → Cloudspaces → [Your Cloudspace] → Ingress
3. **Add Each Rule**:
   - Click "Add Ingress Rule"
   - Fill in the details from the table above
   - Select your VM from the dropdown
   - Click "Create"

**Important**: Replace `10.100.100.X` with your actual private IP (check VM details in STI Console)

---

### **PHASE 2: VERIFY EXTERNAL ACCESS**

After adding Ingress rules, verify external access:

```bash
# From your local machine (not the VM):

# Test HTTP access
curl http://102.209.111.68:8000

# Test SSH access
ssh user@102.209.111.68

# Test Coolify (should redirect to login)
curl -I http://102.209.111.68:8000
```

**Expected**: You should be able to access services from outside the VPN!

---

### **PHASE 3: PUSH CODE TO GITHUB**

Coolify deploys from Git repositories. Your code needs to be on GitHub.

```bash
# Initialize Git repository (if not already done)
cd /home/darksagae/Desktop/agrof-up
git init

# Add GitHub remote
git remote add origin https://github.com/YOUR-USERNAME/agrof-up.git

# Add all files
git add .

# Commit
git commit -m "Initial AGROF deployment"

# Push to GitHub
git push -u origin main
```

**Create Repository**: https://github.com/new
- Name: `agrof-up`
- Visibility: Private (recommended)

---

### **PHASE 4: DEPLOY AGROF API TO COOLIFY**

1. **Access Coolify**: http://102.209.111.68:8000 (after Ingress is configured)
2. **Login**: admin@coolify.local / coolify123
3. **Create New Project**:
   - Click "Create New Project"
   - Name: "AGROF Platform"
4. **Add Application**:
   - Click "Add New Resource" → "Application"
   - Select "Public Repository" or connect GitHub
   - Repository: `https://github.com/YOUR-USERNAME/agrof-up`
   - Build Pack: "Docker Compose"
   - Docker Compose file: `/docker-compose.yml`
   - Branch: `main`
5. **Environment Variables**:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   DATABASE_URL=postgresql://user:password@postgres:5432/agrof_db
   PORT=5000
   ```
6. **Deploy**: Click "Deploy" and wait for build to complete

---

### **PHASE 5: CONFIGURE DOMAINS (OPTIONAL)**

For production, set up custom domains:

**Option A: Use Cloudflare**
1. Add your domain to Cloudflare
2. Add DNS A records:
   ```
   api.yourdomain.com    →  102.209.111.68
   store.yourdomain.com  →  102.209.111.68
   app.yourdomain.com    →  102.209.111.68
   ```
3. Configure in Coolify under "Domains"

**Option B: Use IP addresses**
- Access directly via: `http://102.209.111.68:5000` (API)
- Access directly via: `http://102.209.111.68:3000` (Store)

---

### **PHASE 6: SSL CERTIFICATES**

**Option A: Let's Encrypt (Free)**
- Requires domain name
- Coolify can auto-configure
- Recommended for production

**Option B: Self-Signed**
- Works with IP addresses
- Browser warnings
- OK for testing

**Configure in Coolify**:
- Go to Application Settings → SSL
- Enable "Let's Encrypt" (if using domain)
- Or upload custom certificate

---

### **PHASE 7: UPDATE MOBILE APP**

Update `apiConfig.js` to point to your deployed services:

```javascript
// agrof-main/mobile/app/config/apiConfig.js

const BASE_IPS = [
  '102.209.111.68',     // STI Production Server - HIGHEST PRIORITY
  '10.0.0.1',           // WireGuard VPN
  'localhost',          // Local development
  '127.0.0.1',
];

let BASE_IP = '102.209.111.68';  // Production deployment

export const API_CONFIG = {
  STORE: {
    BASE_URL: `http://${BASE_IP}:3000`,
    API_URL: `http://${BASE_IP}:3000/api`,
  },
  AI: {
    BASE_URL: `http://${BASE_IP}:5000`,
    API_URL: `http://${BASE_IP}:5000/api`,
  }
};
```

---

### **PHASE 8: MONITORING & LOGGING**

**Monitor in Coolify**:
- Application logs: Click on app → Logs tab
- Resource usage: Dashboard shows CPU/RAM
- Deployment history: Track all deployments

**Monitor on Server**:
```bash
# SSH into server
ssh user@102.209.111.68

# Check Docker containers
sudo docker ps

# View logs
sudo docker logs agrof-api -f
sudo docker logs agrof-store -f

# Check resource usage
htop
```

---

## 🔧 TROUBLESHOOTING

### **Cannot Access Coolify Externally**
- ✅ Check Ingress rules are configured
- ✅ Verify public IP is correct
- ✅ Check VM firewall: `sudo ufw status`
- ✅ Restart Coolify: `sudo docker restart coolify`

### **Docker Compose Build Fails**
- ✅ Check Dockerfiles exist
- ✅ Verify requirements.txt is valid
- ✅ Check build logs in Coolify
- ✅ Ensure sufficient disk space

### **Services Not Starting**
- ✅ Check environment variables
- ✅ Verify database connection
- ✅ Check port conflicts
- ✅ Review application logs

### **High Memory Usage**
- ✅ Restart containers: `sudo docker restart <container>`
- ✅ Clear Docker cache: `sudo docker system prune`
- ✅ Monitor: `sudo docker stats`

---

## 📊 RESOURCE MONITORING

**Keep an eye on these metrics:**

```bash
# Check overall system resources
free -h                  # RAM usage
df -h                    # Disk usage
top                      # CPU usage

# Check Docker resources
sudo docker stats        # Container resources
sudo docker system df    # Docker disk usage
```

**Thresholds:**
- 🟢 **RAM < 1.5 GB**: Good
- 🟡 **RAM 1.5-1.8 GB**: Warning
- 🔴 **RAM > 1.8 GB**: Critical - Consider upgrade

---

## 🎯 SUCCESS CRITERIA

Deployment is successful when:

- ✅ Coolify accessible at http://102.209.111.68:8000
- ✅ AGROF API responding at http://102.209.111.68:5000/health
- ✅ AGROF Store responding at http://102.209.111.68:3000/health
- ✅ Mobile app can connect to APIs
- ✅ AI disease detection working
- ✅ Store products loading correctly
- ✅ No critical errors in logs

---

## 🚀 NEXT STEPS

1. **Configure STI Ingress Rules** (CRITICAL - Do this first!)
2. **Push code to GitHub**
3. **Deploy via Coolify**
4. **Test all endpoints**
5. **Update mobile app configuration**
6. **Monitor performance**
7. **(Optional) Add TensorFlow Lite later**

---

## 📞 SUPPORT

**STI Support**: support@abq.africa  
**STI Console**: https://console.sti.go.ug  
**STI IAM**: https://iam.sti.go.ug

---

**Ready to deploy? Let's start with configuring those Ingress rules!** 🎉







