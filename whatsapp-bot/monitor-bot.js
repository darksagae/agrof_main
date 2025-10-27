#!/usr/bin/env node

/**
 * WhatsApp Bot Monitor
 * Monitors bot status and provides management commands
 */

const fetch = require('node-fetch');
const readline = require('readline');

const BOT_URL = process.env.BOT_URL || 'http://localhost:10000';

class BotMonitor {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async checkStatus() {
    try {
      const response = await fetch(`${BOT_URL}/whatsapp-status`);
      const status = await response.json();
      
      console.log('\n📊 WhatsApp Bot Status:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Status: ${status.connected ? '🟢 ONLINE' : '🔴 OFFLINE'}`);
      console.log(`Reconnect Attempts: ${status.reconnectAttempts}/${status.maxReconnectAttempts}`);
      console.log(`Last Disconnection: ${status.lastDisconnection || 'Never'}`);
      console.log(`Last Check: ${status.lastCheck}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      return status;
    } catch (error) {
      console.error('❌ Error checking status:', error.message);
      return null;
    }
  }

  async forceReconnect() {
    try {
      console.log('🔄 Forcing reconnection...');
      const response = await fetch(`${BOT_URL}/whatsapp-force-reconnect`, {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Force reconnection initiated');
      } else {
        console.log('❌ Force reconnection failed:', result.message);
      }
    } catch (error) {
      console.error('❌ Error forcing reconnection:', error.message);
    }
  }

  async manualReconnect() {
    try {
      console.log('🔄 Manual reconnection...');
      const response = await fetch(`${BOT_URL}/whatsapp-reconnect`, {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Manual reconnection initiated');
      } else {
        console.log('❌ Manual reconnection failed:', result.message);
      }
    } catch (error) {
      console.error('❌ Error manual reconnection:', error.message);
    }
  }

  async getDashboard() {
    try {
      const response = await fetch(`${BOT_URL}/admin/dashboard`);
      const dashboard = await response.json();
      
      console.log('\n📊 Admin Dashboard:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('WhatsApp Status:');
      console.log(`  Connected: ${dashboard.whatsapp.connected ? '✅' : '❌'}`);
      console.log(`  Reconnect Attempts: ${dashboard.whatsapp.reconnectAttempts}`);
      console.log(`  Last Disconnection: ${dashboard.whatsapp.lastDisconnection || 'Never'}`);
      console.log('\nSystem Status:');
      console.log(`  Uptime: ${Math.floor(dashboard.system.uptime / 60)} minutes`);
      console.log(`  Memory: ${Math.round(dashboard.system.memory.heapUsed / 1024 / 1024)} MB`);
      console.log(`  Node Version: ${dashboard.system.nodeVersion}`);
      console.log(`  Platform: ${dashboard.system.platform}`);
      console.log(`  Timestamp: ${dashboard.timestamp}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      return dashboard;
    } catch (error) {
      console.error('❌ Error getting dashboard:', error.message);
      return null;
    }
  }

  async startMonitoring() {
    console.log('🤖 WhatsApp Bot Monitor Started');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Commands:');
    console.log('  status, s    - Check bot status');
    console.log('  dashboard, d - Show admin dashboard');
    console.log('  reconnect, r - Manual reconnection');
    console.log('  force, f     - Force reconnection (clears session)');
    console.log('  monitor, m   - Start continuous monitoring');
    console.log('  help, h      - Show this help');
    console.log('  quit, q      - Exit monitor');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    this.showPrompt();
  }

  showPrompt() {
    this.rl.question('bot-monitor> ', async (input) => {
      const command = input.trim().toLowerCase();
      
      switch (command) {
        case 'status':
        case 's':
          await this.checkStatus();
          break;
          
        case 'dashboard':
        case 'd':
          await this.getDashboard();
          break;
          
        case 'reconnect':
        case 'r':
          await this.manualReconnect();
          break;
          
        case 'force':
        case 'f':
          await this.forceReconnect();
          break;
          
        case 'monitor':
        case 'm':
          await this.startContinuousMonitoring();
          break;
          
        case 'help':
        case 'h':
          this.showHelp();
          break;
          
        case 'quit':
        case 'q':
          console.log('👋 Goodbye!');
          this.rl.close();
          process.exit(0);
          break;
          
        default:
          console.log('❌ Unknown command. Type "help" for available commands.');
      }
      
      this.showPrompt();
    });
  }

  async startContinuousMonitoring() {
    console.log('🔄 Starting continuous monitoring (press Ctrl+C to stop)...\n');
    
    const monitorInterval = setInterval(async () => {
      const status = await this.checkStatus();
      if (status && !status.connected) {
        console.log('⚠️ Bot is offline! Attempting reconnection...');
        await this.manualReconnect();
      }
    }, 30000); // Check every 30 seconds
    
    // Handle Ctrl+C
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping continuous monitoring...');
      clearInterval(monitorInterval);
      this.showPrompt();
    });
  }

  showHelp() {
    console.log('\n📖 WhatsApp Bot Monitor Help:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Commands:');
    console.log('  status, s    - Check current bot status');
    console.log('  dashboard, d - Show detailed admin dashboard');
    console.log('  reconnect, r - Try to reconnect the bot');
    console.log('  force, f     - Force reconnection (clears session)');
    console.log('  monitor, m   - Start continuous monitoring');
    console.log('  help, h      - Show this help message');
    console.log('  quit, q      - Exit the monitor');
    console.log('\nTips:');
    console.log('  - Use "monitor" to automatically reconnect when offline');
    console.log('  - Use "force" if the bot is stuck and needs a fresh start');
    console.log('  - Check "dashboard" for detailed system information');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
}

// Start the monitor
const monitor = new BotMonitor();
monitor.startMonitoring();





