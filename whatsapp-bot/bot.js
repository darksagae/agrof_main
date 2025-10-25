// AGROF WhatsApp Bot for Render Deployment
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
// Use advanced admin commands with secret triggers
const AdminCommandsV2 = require('./admin-commands-v2');
const adminHandler = new AdminCommandsV2('https://agrof-store-api.onrender.com/api', []);

// Create WhatsApp client
const client = new Client({
    puppeteer: {
        headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Health check server
const healthApp = require('./health');
const express = require('express');
const app = express();

// Use health check
app.use('/', healthApp);

// Start health server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🏥 Health server running on port ${PORT}`);
});

// WhatsApp client events
client.on('qr', (qr) => {
  console.log('📱 QR Code generated - scan with WhatsApp Business');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ AGROF WhatsApp Bot is ready!');
  console.log('🤖 Bot is listening for admin commands...');
});

client.on('message', async (msg) => {
    try {
    const text = msg.body.trim();
    const sender = msg.from;
    
    console.log(`📩 Message from ${sender}: ${text}`);
    
    // Handle admin commands (secret triggers + legacy)
    const adminHandled = await adminHandler.handleAdminMessage(msg, text);
    if (adminHandled) return;
    
    // Handle other messages
    if (text.toLowerCase().includes('help')) {
      await msg.reply('🤖 AGROF WhatsApp Bot\n\nAdmin Commands:\n• #listsellers - List pending requests\n• #approve <id> - Approve request\n• #reject <id> [reason] - Reject request\n• #view <id> - View details\n• #sellerstats - View statistics\n• admin help - Show all commands');
    }
        
    } catch (error) {
    console.error('❌ Error handling message:', error);
  }
});

// Initialize WhatsApp client
client.initialize();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🔄 Shutting down WhatsApp bot...');
  client.destroy();
    process.exit(0);
});

module.exports = client;