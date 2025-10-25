# 🔥 STI INGRESS SETUP - DO THIS NOW!

**THIS IS THE CRITICAL STEP TO EXPOSE YOUR SERVICES TO THE INTERNET!**

---

## 🎯 WHAT IS INGRESS?

Ingress is STI's **firewall/port forwarding system** that allows external internet traffic to reach your VM services.

**Without Ingress:**
- ❌ Services only accessible via VPN
- ❌ Cannot access Coolify externally
- ❌ Mobile app cannot connect
- ❌ No public deployment

**With Ingress:**
- ✅ Services accessible from anywhere
- ✅ Coolify accessible externally
- ✅ Mobile app can connect
- ✅ Full production deployment

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### **STEP 1: FIND YOUR PRIVATE IP ADDRESS**

1. Login to STI Console: https://console.sti.go.ug
   - Email: `sagacrypotspace@gmail.com`
   - Password: `007Darksagae@!`

2. Navigate: **Resources** → **Cloudspaces** → Click on your Cloudspace

3. Find your VM in the list (look for the one you created)

4. **WRITE DOWN** these details:
   ```
   VM Name: _________________________
   
   Private IP: 10.100.100.___  (IMPORTANT!)
   
   Public IP: 102.209.111.68 (should be this)
   ```

---

### **STEP 2: NAVIGATE TO INGRESS**

1. In your Cloudspace, look at the **left sidebar**

2. Click on **"Ingress"** (or **"Port Forwarding"** or **"Firewall Rules"**)

3. You should see a page to add new Ingress rules

---

### **STEP 3: ADD INGRESS RULES**

You need to add **7 rules** (one at a time). For each rule:

1. Click **"Add Ingress Rule"** or **"Create New Rule"**

2. Fill in the details from the table below

3. Click **"Create"** or **"Save"**

---

## 📊 INGRESS RULES TO ADD

**Replace `10.100.100.X` with YOUR actual private IP from Step 1!**

### **Rule 1: SSH Access**
```
Rule Name:        ssh-access
Protocol:         TCP
Public Port:      22
Private IP:       10.100.100.X
Private Port:     22
Description:      SSH access to VM
```

### **Rule 2: HTTP Traffic**
```
Rule Name:        http-traffic
Protocol:         TCP
Public Port:      80
Private IP:       10.100.100.X
Private Port:     80
Description:      HTTP web traffic
```

### **Rule 3: HTTPS Traffic**
```
Rule Name:        https-traffic
Protocol:         TCP
Public Port:      443
Private IP:       10.100.100.X
Private Port:     443
Description:      HTTPS secure web traffic
```

### **Rule 4: Coolify Web Interface**
```
Rule Name:        coolify-web
Protocol:         TCP
Public Port:      8000
Private IP:       10.100.100.X
Private Port:     8000
Description:      Coolify dashboard access
```

### **Rule 5: AGROF API Service**
```
Rule Name:        agrof-api
Protocol:         TCP
Public Port:      5000
Private IP:       10.100.100.X
Private Port:     5000
Description:      AGROF AI API service
```

### **Rule 6: AGROF Store Service**
```
Rule Name:        agrof-store
Protocol:         TCP
Public Port:      3000
Private IP:       10.100.100.X
Private Port:     3000
Description:      AGROF e-commerce store
```

### **Rule 7: WireGuard VPN**
```
Rule Name:        wireguard-vpn
Protocol:         UDP (IMPORTANT!)
Public Port:      51820
Private IP:       10.100.100.X
Private Port:     51820
Description:      WireGuard VPN access
```

---

## ✅ VERIFY INGRESS RULES

After adding all rules, you should see them listed in the Ingress page:

```
┌─────────────────┬──────────┬─────────────┬──────────────┬──────────────┐
│ Rule Name       │ Protocol │ Public Port │ Private IP   │ Private Port │
├─────────────────┼──────────┼─────────────┼──────────────┼──────────────┤
│ ssh-access      │ TCP      │ 22          │ 10.100.100.X │ 22           │
│ http-traffic    │ TCP      │ 80          │ 10.100.100.X │ 80           │
│ https-traffic   │ TCP      │ 443         │ 10.100.100.X │ 443          │
│ coolify-web     │ TCP      │ 8000        │ 10.100.100.X │ 8000         │
│ agrof-api       │ TCP      │ 5000        │ 10.100.100.X │ 5000         │
│ agrof-store     │ TCP      │ 3000        │ 10.100.100.X │ 3000         │
│ wireguard-vpn   │ UDP      │ 51820       │ 10.100.100.X │ 51820        │
└─────────────────┴──────────┴─────────────┴──────────────┴──────────────┘
```

---

## 🧪 TEST EXTERNAL ACCESS

After adding Ingress rules, **wait 2-5 minutes** for them to take effect, then test:

### **Test 1: Test from Your LOCAL Machine (NOT the VM!)**

Open a new terminal on your local computer and run:

```bash
# Test Coolify (should see HTML or redirect)
curl http://102.209.111.68:8000

# Test AGROF API health
curl http://102.209.111.68:5000/health

# Test AGROF Store health
curl http://102.209.111.68:3000/health

# Test SSH
ssh user@102.209.111.68
```

### **Test 2: Test from Browser**

Open your browser and visit:
- http://102.209.111.68:8000 (Coolify - should show login page)
- http://102.209.111.68:5000/health (API - should show JSON)
- http://102.209.111.68:3000/health (Store - should show JSON)

---

## 🐛 TROUBLESHOOTING

### **"Cannot find Ingress section"**

Try these alternative names:
- "Port Forwarding"
- "Firewall Rules"
- "Network" → "Ingress"
- "Security" → "Ingress"

If still can't find it, contact STI support: support@abq.africa

### **"Cannot add Ingress rules"**

Possible reasons:
- ❌ Not logged into correct tenant
- ❌ No permission (need admin access)
- ❌ Wrong Cloudspace

Solution: Contact STI support to grant Ingress permissions

### **"Ingress added but still cannot access"**

1. Wait 5-10 minutes for rules to propagate
2. Check if VM is running: `sudo docker ps`
3. Check VM firewall:
   ```bash
   ssh user@102.209.111.68
   sudo ufw status
   sudo ufw allow 8000/tcp
   sudo ufw allow 5000/tcp
   sudo ufw allow 3000/tcp
   ```

---

## 📞 NEED HELP?

**If you cannot find the Ingress section or add rules:**

1. **Email STI Support**: support@abq.africa
   ```
   Subject: Ingress Configuration Help - Hackathon 2025
   
   Hi STI Team,
   
   I need help configuring Ingress rules for my VM.
   
   Email: sagacrypotspace@gmail.com
   VM IP: 102.209.111.68
   
   I need to expose ports: 22, 80, 443, 3000, 5000, 8000, 51820
   
   Thank you!
   ```

2. **Check STI Documentation**: https://console.sti.go.ug/docs/en/Ingress/

---

## 🎯 AFTER INGRESS IS CONFIGURED

Once Ingress is working and you can access services externally:

### **Next Steps:**
1. ✅ Push code to GitHub
2. ✅ Deploy AGROF via Coolify
3. ✅ Configure mobile app endpoints
4. ✅ Test complete system

---

## 📝 QUICK REFERENCE

**STI Console Login:**
- URL: https://console.sti.go.ug
- Email: sagacrypotspace@gmail.com
- Password: 007Darksagae@!

**Your Server:**
- Public IP: 102.209.111.68
- Private IP: 10.100.100.X (find in console)

**Ports to Expose:**
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)
- 3000 (Store)
- 5000 (API)
- 8000 (Coolify)
- 51820 (WireGuard)

---

**NOW GO DO IT!** 🚀

Come back when you've added the Ingress rules and we'll test access!




