# 🔐 WIREGUARD VPN SETUP FOR STI HACKATHON

**Following the STI Hackathon 2025 Guide**

---

## 🎯 **CURRENT STATUS**

From your screenshot, I can see you're in the WIREGUARD VPNS section with these available VPNs:

```
┌─────────────────┬─────────────────────┬─────────┬─────────┐
│ VPN Name        │ Address             │ Port    │ MTU     │
├─────────────────┼─────────────────────┼─────────┼─────────┤
│ external-mgmt   │ 10.100.101.1/24     │ 51820   │ 1420    │
│ sti-access      │ 172.16.0.1/24       │ 51821   │ 1420    │
│ access-2        │ 172.16.1.1/24       │ 51822   │ 1420    │
│ access03        │ 172.16.2.1/24       │ 51823   │ 1420    │
│ educreds        │ 172.16.3.1/24       │ 5100    │ 1420    │
│ edcrds          │ 172.16.4.1/24       │ 51824   │ 1420    │
└─────────────────┴─────────────────────┴─────────┴─────────┘
```

---

## 📋 **STEP-BY-STEP SETUP**

### **STEP 1: Click on 'external-mgmt'**

This is the main VPN for external management access. Click on it to open its configuration.

**Expected to see:**
- VPN details
- List of existing peers
- "Add Peer" or "Create Peer" button

---

### **STEP 2: Add New Peer**

When you click on 'external-mgmt', look for:

1. **"Add Peer" button** - Click this
2. **Peer configuration form** with fields like:
   - Name/Description
   - Public Key (auto-generated)
   - Allowed IPs
   - Endpoint settings

---

### **STEP 3: Configure Peer Settings**

Follow the STI guide exactly:

1. **First Page**: Accept all default settings, click "Next"

2. **Public Key**: Accept the auto-generated public key, click "Next"

3. **Network Options**: 
   - Choose **"NAT option"** for Allowed IPs
   - Click "Next"

4. **Endpoint & Keep Alive**:
   - Accept default values
   - Click "Next"

5. **Peer Naming**:
   - Give it a descriptive name like: `"darksagae-hackathon"` or `"agrof-vpn"`
   - Click "Add" to create

---

### **STEP 4: Download Configuration**

**CRITICAL STEP**: After creating the peer:

1. Look for **"Download Config"** button
2. Click it to download the `.conf` file
3. Save it as: `"darksagae-hackathon.conf"`

**This file contains your unique VPN credentials!**

---

### **STEP 5: Install WireGuard Client**

**For Linux (your current system):**

```bash
# Install WireGuard
sudo apt update
sudo apt install wireguard

# Import the configuration
sudo cp /path/to/darksagae-hackathon.conf /etc/wireguard/

# Activate the VPN
sudo wg-quick up darksagae-hackathon

# Check status
sudo wg show
```

**For other platforms:**
- Download from: https://www.wireguard.com/install/
- Import the `.conf` file
- Connect

---

## 🔍 **WHAT TO LOOK FOR**

When you click on 'external-mgmt', you should see:

```
┌─────────────────────────────────────────────────────────────┐
│ external-mgmt VPN Configuration                            │
├─────────────────────────────────────────────────────────────┤
│ Address: 10.100.101.1/24                                   │
│ Port: 51820                                                │
│ MTU: 1420                                                  │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Existing Peers:                                        │ │
│ │ (List of current peers, if any)                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [Add Peer] [Download Config] [Actions]                     │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ **TROUBLESHOOTING**

### **"Cannot see Add Peer button"**
- Make sure you clicked on 'external-mgmt'
- Look for "Create Peer", "New Peer", or similar
- Check if you have permissions (contact STI support if needed)

### **"Download Config not working"**
- Try right-clicking and "Save as"
- Check browser downloads folder
- Ensure peer was created successfully first

### **"VPN connection fails"**
- Verify the `.conf` file was downloaded completely
- Check if WireGuard is installed: `sudo which wg`
- Try: `sudo wg-quick up /path/to/config.conf`

---

## 🎯 **NEXT STEPS AFTER VPN**

Once WireGuard is connected:

1. **Test VPN Connection**:
   ```bash
   ping 10.100.101.1  # Should work
   ```

2. **Access Coolify via VPN**:
   ```bash
   # Should be accessible via VPN IP
   curl http://10.100.101.1:8000
   ```

3. **Then Configure Ingress Rules**:
   - With VPN active, you might have access to Ingress configuration
   - Or Ingress rules might be visible in a different section

---

## 📞 **NEED HELP?**

**If you can't find "Add Peer" or "Download Config":**

Email STI Support:
```
To: support@abq.africa
Subject: WireGuard VPN Setup Help - Hackathon 2025

Hi STI Team,

I need help setting up WireGuard VPN for external management.

Account: sagacrypotspace@gmail.com
Cloudspace: hackathon 2025

I can see the external-mgmt VPN but cannot find where to add peers.

Thank you!
```

---

**Start by clicking on 'external-mgmt' and tell me what you see!** 🚀





