#!/bin/bash

# Setup SSH key for Coolify
VM_IP="10.100.100.180"
VM_USER="user"
VM_PASS="007Darksagae@!"

# Coolify SSH public key
COOLIFY_KEY="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC3XHK9BkA+0dx8dWkY7GGTJEIo1jkKWMC/lizTBv/i9CV5B15FJ09BDJYVhIk49snDWdSVW5d/3TnSB7j3/9KiSD9EGZabCXgiSVtX2yeGOq181KUSTImgF+IOtFaKCJGZ1TT60FT/QZzhYdA1fcfLVD4c83rCjWJZYBPNWsY+QqS9Dr/9b8ufGqt2TpRxwG1IIzsLpxes5VKTnM6q7wE8Z4Xl/0q3S62JfT5LyVffEQfM4i9AfHkNZZDSyLj2ss5k1LCg5sF2VyHB+SU/8TDd9l5fcRabo8wU4jvMCXByNATHEgsQ8WSDAjH4JFKfxuLagUVapTxG8QiIfWy4chVh coolify-generated-ssh-key"

echo "🔧 Setting up SSH key for Coolify on VM: $VM_IP"

# Connect and setup SSH key
sshpass -p "$VM_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o IdentitiesOnly=yes -o PasswordAuthentication=yes "$VM_USER@$VM_IP" << 'EOF'
# Switch to root and setup SSH directory
sudo -i << 'ROOT_EOF'
mkdir -p /root/.ssh
chmod 700 /root/.ssh

# Add Coolify SSH key
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC3XHK9BkA+0dx8dWkY7GGTJEIo1jkKWMC/lizTBv/i9CV5B15FJ09BDJYVhIk49snDWdSVW5d/3TnSB7j3/9KiSD9EGZabCXgiSVtX2yeGOq181KUSTImgF+IOtFaKCJGZ1TT60FT/QZzhYdA1fcfLVD4c83rCjWJZYBPNWsY+QqS9Dr/9b8ufGqt2TpRxwG1IIzsLpxes5VKTnM6q7wE8Z4Xl/0q3S62JfT5LyVffEQfM4i9AfHkNZZDSyLj2ss5k1LCg5sF2VyHB+SU/8TDd9l5fcRabo8wU4jvMCXByNATHEgsQ8WSDAjH4JFKfxuLagUVapTxG8QiIfWy4chVh coolify-generated-ssh-key" >> /root/.ssh/authorized_keys

# Set correct permissions
chmod 600 /root/.ssh/authorized_keys

# Verify the key was added
echo "✅ SSH key added successfully!"
echo "📋 Current authorized_keys content:"
cat /root/.ssh/authorized_keys

ROOT_EOF
EOF

if [ $? -eq 0 ]; then
    echo "🎉 SSH key setup completed successfully!"
else
    echo "❌ SSH key setup failed. Please try manual setup."
fi



