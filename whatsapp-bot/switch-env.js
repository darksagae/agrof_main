#!/usr/bin/env node

/**
 * Environment Switcher
 * Easy switching between localhost and production
 */

const fs = require('fs');
const path = require('path');

const configFile = path.join(__dirname, 'config.js');

function switchEnvironment(env) {
  if (!['development', 'production'].includes(env)) {
    console.error('❌ Invalid environment. Use "development" or "production"');
    process.exit(1);
  }

  try {
    // Read current config
    let configContent = fs.readFileSync(configFile, 'utf8');
    
    // Update environment
    configContent = configContent.replace(
      /environment: process\.env\.NODE_ENV \|\| '[^']+'/,
      `environment: process.env.NODE_ENV || '${env}'`
    );
    
    // Write updated config
    fs.writeFileSync(configFile, configContent);
    
    console.log(`✅ Switched to ${env} environment`);
    console.log(`   Store API: ${env === 'development' ? 'http://localhost:3001/api' : 'https://agrof-store-api.onrender.com/api'}`);
    console.log(`   Automation API: ${env === 'development' ? 'http://localhost:3002/api' : 'https://agrof-automation.onrender.com/api'}`);
    
  } catch (error) {
    console.error('❌ Error switching environment:', error.message);
    process.exit(1);
  }
}

function showCurrentEnvironment() {
  try {
    const configContent = fs.readFileSync(configFile, 'utf8');
    const match = configContent.match(/environment: process\.env\.NODE_ENV \|\| '([^']+)'/);
    
    if (match) {
      const currentEnv = match[1];
      console.log(`🔧 Current environment: ${currentEnv}`);
      
      if (currentEnv === 'development') {
        console.log('   Store API: http://localhost:3001/api');
        console.log('   Automation API: http://localhost:3002/api');
        console.log('   Bot Port: 10000');
      } else {
        console.log('   Store API: https://agrof-store-api.onrender.com/api');
        console.log('   Automation API: https://agrof-automation.onrender.com/api');
        console.log('   Bot Port: 10000 (or PORT env var)');
      }
    } else {
      console.log('❌ Could not determine current environment');
    }
  } catch (error) {
    console.error('❌ Error reading config:', error.message);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'dev':
  case 'development':
    switchEnvironment('development');
    break;
    
  case 'prod':
  case 'production':
    switchEnvironment('production');
    break;
    
  case 'status':
  case 'current':
    showCurrentEnvironment();
    break;
    
  case 'help':
  case '--help':
  case '-h':
    console.log('🔧 Environment Switcher');
    console.log('');
    console.log('Usage:');
    console.log('  node switch-env.js dev        - Switch to development (localhost)');
    console.log('  node switch-env.js prod       - Switch to production (Render)');
    console.log('  node switch-env.js status     - Show current environment');
    console.log('  node switch-env.js help       - Show this help');
    console.log('');
    console.log('Examples:');
    console.log('  node switch-env.js dev        # Use localhost APIs');
    console.log('  node switch-env.js prod       # Use Render APIs');
    console.log('  node switch-env.js status     # Check current setting');
    break;
    
  default:
    console.log('❌ Unknown command. Use "help" for usage information.');
    process.exit(1);
}





