# 🖥️ COMPLETE VM CONFIGURATION GUIDE

**VM Name**: kiucsa  
**Purpose**: AGROF Agricultural AI Platform - Hackathon 2025

---

## 🔧 **FINAL VM CONFIGURATION**

### **1. BASIC SETTINGS**
```
✅ Name: kiucsa (or change to 'agrof-vm')
✅ Boot type: bios
✅ Description: AGROF Agricultural AI Platform - Hackathon 2025
✅ Private IP: 10.100.100.77 (perfect - within range)
```

### **2. ADVANCED SETTINGS**
```
🔄 Advanced user data: TURN ON (toggle switch)
🔑 SSH Key: [Copy the key below]
```

---

## 🔑 **SSH PUBLIC KEY TO ADD**

**Copy this entire key into the SSH Key field:**

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCmCExLW163EordpirQUrbiJ+hGhDhseAdbxRGF14LIlNpc7n80m7/5yB1FYJE2JMqkqJx4IRO+v2R+V0qwb/v8IP96CiCKlpOzqsS7tcAA1MsJXbPoydQiEPXnQbsZ7fiCIQ4RehIL+Lv6cR/9qCa0fUR7gEXq2QzSNPvmE8e5CmkTmykSOBQ9YWEdT1GUBI13VqZWKtMTApuIaejdX6Hsf31AUkzk9aLYcSyvGsxUEIFa2u0mcIWsLsFo6gZ1UVkOyHc316ahc+i2JIs3CTY7CdfNPHImJR140ihBR7gqfKO7XdpkgqlSVYrBr5if7FWAUIg46FMoYUqhUHE5raU37w6BrIzly/poj9lKDxMyz5jjivrjDdDR3Y0OpX0ASY6EuoMT2yBAkhbL0VI8jG3zMCg8SOClU5flhR8DBZfgQu5+xs6+utI6/mk3qYV713gPBRiR1M82A+XB2K4A+6+uhJ6UzGUbz2kk8WOYC0+VAzYyTWU5TciBXxekagEX2L/byf+Gc7SAr/Yyv2z+JqXvzJCfxyxGTO7HdlCyV1ziy+BpD3t/xBf1kQp/StJFL4znfbzOhQyJwUZ9Fc5z22EB/N4EwxRAjaCyWiSPIRSsp4KaHHg1SwpaU2AstyE3N5yUdukFKCicgvsLuSpSgoNkseYHD1jI6FbmodN5fRaztw== darksagae@darksagae
```

---

## 📋 **STEP-BY-STEP INSTRUCTIONS**

### **Step 1: Fill in the Form**
1. **Name**: Keep "kiucsa" or change to "agrof-vm"
2. **Boot type**: Keep "bios" 
3. **Description**: Add "AGROF Agricultural AI Platform - Hackathon 2025"
4. **Private IP**: Keep "10.100.100.77"

### **Step 2: Enable Advanced Settings**
1. **Turn ON** the "Advanced user data" toggle switch
2. **Copy the SSH key** above into the SSH Key field

### **Step 3: Verify Disk Size**
- **IMPORTANT**: Make sure disk size is **50 GB** (not 100 GB)
- This avoids the quota issue we encountered earlier

### **Step 4: Create VM**
1. Click **"Create"** or **"Next"** button
2. Wait for VM creation (5-10 minutes)
3. Note the VM status changes to "Running"

---

## ✅ **EXPECTED RESULT**

After successful creation, you should see:
- ✅ VM status: "Running"
- ✅ Private IP: 10.100.100.77
- ✅ SSH access enabled
- ✅ Ready for AGROF deployment

---

## 🔗 **AFTER VM CREATION**

### **Test SSH Connection**
```bash
ssh user@10.100.100.77
```

### **Update Your WireGuard VPN**
You'll need to add this VM's IP to your Ingress rules:
- **Private IP**: 10.100.100.77
- **Public IP**: Will be assigned by STI

---

## 🎯 **NEXT STEPS AFTER VM CREATION**

1. ✅ **Test SSH access**
2. ✅ **Configure Ingress rules** (expose ports)
3. ✅ **Deploy Coolify**
4. ✅ **Deploy AGROF services**
5. ✅ **Configure mobile app**

---

## 💡 **PRO TIPS**

### **VM Name Suggestions:**
- `kiucsa` (current)
- `agrof-vm` (descriptive)
- `agrof-ai-platform` (detailed)

### **Description Ideas:**
- "AGROF Agricultural AI Platform - Hackathon 2025"
- "Disease Detection & E-commerce for Uganda Farmers"
- "AI-Powered Agricultural Platform"

### **SSH Key Security:**
- ✅ **Public key** is safe to share (goes in VM)
- ✅ **Private key** stays on your local machine
- ✅ **Enables secure access** without passwords

---

## 🚨 **TROUBLESHOOTING**

### **If VM Creation Fails:**
1. **Check disk size** - Should be 50 GB, not 100 GB
2. **Verify quota** - Go to Spendings section
3. **Contact support** - If quota issues persist

### **If SSH Connection Fails:**
1. **Wait 5 minutes** - VM needs time to boot
2. **Check IP address** - Verify 10.100.100.77
3. **Try different user** - Try "ubuntu" or "root"

---

## 🎉 **SUCCESS INDICATORS**

**VM Creation Successful When:**
- ✅ Status shows "Running"
- ✅ No error messages
- ✅ SSH key accepted
- ✅ Can connect via SSH

**Ready for AGROF Deployment When:**
- ✅ VM accessible via SSH
- ✅ Ingress rules configured
- ✅ External access working

---

**Now go back to your VM creation page and complete the configuration!** 🚀

**Copy the SSH key above and create your AGROF server!** 💪





