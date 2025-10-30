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
    
    // Reconnection settings - INFINITE RECONNECTION for persistent connection
    maxReconnectAttempts: Infinity, // Never stop trying to reconnect
    reconnectDelay: 10000, // 10 seconds between attempts
    
    // QR code timeout - Longer timeout for persistent connection
    qrTimeoutMs: 0, // No timeout - keep trying forever
    
    // Puppeteer options for persistent connection
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    }
  },
  
  // Admin Configuration
  admin: {
    // Primary admin number - ALWAYS ALLOWED
    primaryNumber: '256705223777', // Your number with country code
    
    // Allow all numbers for testing (empty array = no restrictions)
    allowedNumbers: ['256705223777'], // Your number is always allowed
    
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

