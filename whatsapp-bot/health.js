// Health check endpoint for WhatsApp bot
const express = require('express');
const app = express();

// QR code endpoints
let currentQR = null;

app.get('/qr', (req, res) => {
  if (!currentQR) {
    return res.status(404).json({ error: 'No QR code available' });
  }
  res.json({
    qr: currentQR,
    instructions: [
      '1. Open WhatsApp Business on your phone',
      '2. Go to Settings > Linked Devices',
      '3. Tap "Link a Device"',
      '4. Scan the QR code',
      '5. Wait for "Bot is ready!" message'
    ]
  });
});

app.get('/qr-display', (req, res) => {
  if (!currentQR) {
    return res.send(`
      <html>
        <head><title>AGROF WhatsApp Bot - QR Code</title></head>
        <body style="font-family: Arial; text-align: center; padding: 20px;">
          <h1>📱 AGROF WhatsApp Bot</h1>
          <p>No QR code available. Bot may already be connected.</p>
          <p><a href="/health">Check Bot Status</a></p>
        </body>
      </html>
    `);
  }
  res.send(`
    <html>
      <head>
        <title>AGROF WhatsApp Bot - QR Code</title>
        <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
        <style>
          body { font-family: Arial; text-align: center; padding: 20px; background: #f5f5f5; }
          .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
          #qrcode { margin: 20px 0; }
          .instructions { text-align: left; margin: 20px 0; }
          .instructions li { margin: 10px 0; }
          .status { color: #666; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📱 AGROF WhatsApp Bot</h1>
          <h2>Scan QR Code to Connect</h2>
          <div id="qrcode"></div>
          <div class="instructions">
            <h3>Instructions:</h3>
            <ol>
              <li>Open WhatsApp Business on your phone</li>
              <li>Go to Settings > Linked Devices</li>
              <li>Tap "Link a Device"</li>
              <li>Scan the QR code above</li>
              <li>Wait for "Bot is ready!" message</li>
            </ol>
          </div>
          <div class="status">
            <p><a href="/health">Check Bot Status</a> | <a href="/qr">Get QR Data (JSON)</a></p>
          </div>
        </div>
        <script>
          QRCode.toCanvas(document.getElementById('qrcode'), '${currentQR}', {
            width: 300,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          }, function (error) {
            if (error) console.error(error);
          });
        </script>
      </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AGROF WhatsApp Bot is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Function to set QR code (called from bot.js)
app.setQR = (qr) => {
  currentQR = qr;
};

module.exports = app;
