/**
 * WhatsApp Bot Configuration
 * Easy switching between localhost and production
 */

const config = {
  // Environment: 'development' or 'production'
  environment: process.env.NODE_ENV || 'production',
  
  // API Configuration
  api: {
    // Development (localhost)
    development: {
      storeApi: 'http://localhost:3002/api',
      automationApi: 'http://localhost:3003/api',
      botPort: 10000
    },
    
    // Production (Render)
    production: {
      storeApi: 'https://agrof-store-api.onrender.com/api',
      automationApi: 'https://agrof-automation.onrender.com/api',
      botPort: process.env.PORT || 10000
    }
  },
  
  // WhatsApp Configuration
  whatsapp: {
    // Session persistence
    sessionDir: './whatsapp-session',
    
    // Reconnection settings
    maxReconnectAttempts: 5,
    reconnectDelay: 30000, // 30 seconds
    
    // QR code timeout
    qrTimeoutMs: 60000,
    
    // Puppeteer options
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  },
  
  // Admin Configuration
  admin: {
    // Allow all numbers for testing (empty array = no restrictions)
    allowedNumbers: [],
    
    // Secret triggers
    triggers: ['godeye', 'void', 'destiny', 'oracle', 'guardian', 'phoenix', 'nexus', 'cloud']
  },
  
  // Monitoring Configuration
  monitoring: {
    // Health check interval (milliseconds)
    healthCheckInterval: 60000, // 1 minute
    
    // Admin notification settings
    notifications: {
      enabled: true,
      logFile: './admin-notifications.log'
    }
  }
};

// Get current API configuration based on environment
function getApiConfig() {
  return config.api[config.environment];
}

// Get current store API URL
function getStoreApiUrl() {
  return getApiConfig().storeApi;
}

// Get current automation API URL
function getAutomationApiUrl() {
  return getApiConfig().automationApi;
}

// Get current bot port
function getBotPort() {
  return getApiConfig().botPort;
}

// Log current configuration
function logConfig() {
  console.log('🔧 WhatsApp Bot Configuration:');
  console.log(`   Environment: ${config.environment}`);
  console.log(`   Store API: ${getStoreApiUrl()}`);
  console.log(`   Automation API: ${getAutomationApiUrl()}`);
  console.log(`   Bot Port: ${getBotPort()}`);
  console.log(`   Session Dir: ${config.whatsapp.sessionDir}`);
  console.log(`   Max Reconnect Attempts: ${config.whatsapp.maxReconnectAttempts}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

module.exports = {
  config,
  getApiConfig,
  getStoreApiUrl,
  getAutomationApiUrl,
  getBotPort,
  logConfig
};

