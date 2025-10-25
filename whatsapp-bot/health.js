// Health check endpoint for WhatsApp bot
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AGROF WhatsApp Bot is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = app;
