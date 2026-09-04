#!/usr/bin/env node

// AGROF Health Monitoring System
// Monitors all services and provides comprehensive health reports

const https = require('https');
const http = require('http');

// Service URLs
const SERVICES = {
  store: 'https://agrof-store-api.onrender.com',
  ai: 'https://agrof-ai-api.onrender.com',
  whatsapp: 'https://agrof-whatsapp-bot.onrender.com',
  automation: 'https://agrof-automation-engine.onrender.com'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class HealthMonitor {
  constructor() {
    this.results = {};
    this.startTime = Date.now();
  }

  // Make HTTP request with timeout
  async makeRequest(url, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      const request = client.get(url, { timeout }, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          resolve({
            status: response.statusCode,
            data: data,
            headers: response.headers
          });
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  // Check individual service health
  async checkService(name, url) {
    const startTime = Date.now();
    
    try {
      console.log(`${colors.blue}🔍 Checking ${name}...${colors.reset}`);
      
      const response = await this.makeRequest(`${url}/health`);
      const responseTime = Date.now() - startTime;
      
      if (response.status === 200) {
        this.results[name] = {
          status: 'healthy',
          responseTime: responseTime,
          statusCode: response.status,
          data: response.data,
          timestamp: new Date().toISOString()
        };
        
        console.log(`${colors.green}✅ ${name}: HEALTHY (${responseTime}ms)${colors.reset}`);
        return true;
      } else {
        this.results[name] = {
          status: 'unhealthy',
          responseTime: responseTime,
          statusCode: response.status,
          error: `HTTP ${response.status}`,
          timestamp: new Date().toISOString()
        };
        
        console.log(`${colors.red}❌ ${name}: UNHEALTHY (HTTP ${response.status})${colors.reset}`);
        return false;
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      this.results[name] = {
        status: 'error',
        responseTime: responseTime,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      
      console.log(`${colors.red}❌ ${name}: ERROR (${error.message})${colors.reset}`);
      return false;
    }
  }

  // Check all services
  async checkAllServices() {
    console.log(`${colors.bright}${colors.cyan}🏥 AGROF Health Monitor${colors.reset}`);
    console.log(`${colors.cyan}================================${colors.reset}`);
    console.log('');

    const promises = Object.entries(SERVICES).map(([name, url]) => 
      this.checkService(name, url)
    );

    const results = await Promise.all(promises);
    const healthyCount = results.filter(Boolean).length;
    const totalCount = results.length;

    console.log('');
    console.log(`${colors.cyan}📊 Health Summary:${colors.reset}`);
    console.log(`${colors.green}✅ Healthy: ${healthyCount}/${totalCount}${colors.reset}`);
    console.log(`${colors.red}❌ Unhealthy: ${totalCount - healthyCount}/${totalCount}${colors.reset}`);
    
    return this.results;
  }

  // Generate detailed health report
  generateReport() {
    const totalTime = Date.now() - this.startTime;
    
    console.log('');
    console.log(`${colors.bright}${colors.magenta}📋 Detailed Health Report${colors.reset}`);
    console.log(`${colors.magenta}==============================${colors.reset}`);
    console.log(`Generated: ${new Date().toLocaleString()}`);
    console.log(`Total Check Time: ${totalTime}ms`);
    console.log('');

    Object.entries(this.results).forEach(([name, result]) => {
      const statusColor = result.status === 'healthy' ? colors.green : colors.red;
      const statusIcon = result.status === 'healthy' ? '✅' : '❌';
      
      console.log(`${statusIcon} ${colors.bright}${name.toUpperCase()}${colors.reset}`);
      console.log(`   Status: ${statusColor}${result.status.toUpperCase()}${colors.reset}`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Timestamp: ${result.timestamp}`);
      
      if (result.statusCode) {
        console.log(`   HTTP Status: ${result.statusCode}`);
      }
      
      if (result.error) {
        console.log(`   Error: ${colors.red}${result.error}${colors.reset}`);
      }
      
      if (result.data) {
        try {
          const healthData = JSON.parse(result.data);
          console.log(`   Health Data: ${JSON.stringify(healthData, null, 2)}`);
        } catch (e) {
          console.log(`   Response: ${result.data.substring(0, 100)}...`);
        }
      }
      
      console.log('');
    });
  }

  // Test specific functionality
  async testFunctionality() {
    console.log(`${colors.bright}${colors.yellow}🧪 Testing Functionality${colors.reset}`);
    console.log(`${colors.yellow}========================${colors.reset}`);
    console.log('');

    // Test Store Backend endpoints
    try {
      console.log(`${colors.blue}🔍 Testing Store Backend endpoints...${colors.reset}`);
      
      // Test products endpoint
      const productsResponse = await this.makeRequest(`${SERVICES.store}/api/products?limit=5`);
      if (productsResponse.status === 200) {
        console.log(`${colors.green}✅ Products endpoint: OK${colors.reset}`);
      } else {
        console.log(`${colors.red}❌ Products endpoint: FAILED${colors.reset}`);
      }

      // Test categories endpoint
      const categoriesResponse = await this.makeRequest(`${SERVICES.store}/api/categories`);
      if (categoriesResponse.status === 200) {
        console.log(`${colors.green}✅ Categories endpoint: OK${colors.reset}`);
      } else {
        console.log(`${colors.red}❌ Categories endpoint: FAILED${colors.reset}`);
      }

      // Test stats endpoint
      const statsResponse = await this.makeRequest(`${SERVICES.store}/api/products/stats`);
      if (statsResponse.status === 200) {
        console.log(`${colors.green}✅ Stats endpoint: OK${colors.reset}`);
      } else {
        console.log(`${colors.red}❌ Stats endpoint: FAILED${colors.reset}`);
      }

    } catch (error) {
      console.log(`${colors.red}❌ Store Backend functionality test failed: ${error.message}${colors.reset}`);
    }

    // Test AI Backend endpoints
    try {
      console.log(`${colors.blue}🔍 Testing AI Backend endpoints...${colors.reset}`);
      
      const aiResponse = await this.makeRequest(`${SERVICES.ai}/health`);
      if (aiResponse.status === 200) {
        console.log(`${colors.green}✅ AI Backend: OK${colors.reset}`);
      } else {
        console.log(`${colors.red}❌ AI Backend: FAILED${colors.reset}`);
      }

    } catch (error) {
      console.log(`${colors.red}❌ AI Backend functionality test failed: ${error.message}${colors.reset}`);
    }

    // Test WhatsApp Bot
    try {
      console.log(`${colors.blue}🔍 Testing WhatsApp Bot...${colors.reset}`);
      
      const whatsappResponse = await this.makeRequest(`${SERVICES.whatsapp}/health`);
      if (whatsappResponse.status === 200) {
        console.log(`${colors.green}✅ WhatsApp Bot: OK${colors.reset}`);
      } else {
        console.log(`${colors.red}❌ WhatsApp Bot: FAILED${colors.reset}`);
      }

    } catch (error) {
      console.log(`${colors.red}❌ WhatsApp Bot functionality test failed: ${error.message}${colors.reset}`);
    }

    // Test Automation Engine
    try {
      console.log(`${colors.blue}🔍 Testing Automation Engine...${colors.reset}`);
      
      const automationResponse = await this.makeRequest(`${SERVICES.automation}/health`);
      if (automationResponse.status === 200) {
        console.log(`${colors.green}✅ Automation Engine: OK${colors.reset}`);
      } else {
        console.log(`${colors.red}❌ Automation Engine: FAILED${colors.reset}`);
      }

    } catch (error) {
      console.log(`${colors.red}❌ Automation Engine functionality test failed: ${error.message}${colors.reset}`);
    }
  }

  // Generate recommendations
  generateRecommendations() {
    console.log('');
    console.log(`${colors.bright}${colors.cyan}💡 Recommendations${colors.reset}`);
    console.log(`${colors.cyan}=================${colors.reset}`);

    const unhealthyServices = Object.entries(this.results)
      .filter(([name, result]) => result.status !== 'healthy');

    if (unhealthyServices.length === 0) {
      console.log(`${colors.green}🎉 All services are healthy!${colors.reset}`);
      console.log(`${colors.green}✅ System is ready for production use${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠️  ${unhealthyServices.length} service(s) need attention:${colors.reset}`);
      
      unhealthyServices.forEach(([name, result]) => {
        console.log(`${colors.red}❌ ${name}: ${result.error || 'Unknown error'}${colors.reset}`);
        
        if (result.error && result.error.includes('timeout')) {
          console.log(`   💡 Recommendation: Check if service is starting up (Render free tier can be slow)`);
        } else if (result.error && result.error.includes('ECONNREFUSED')) {
          console.log(`   💡 Recommendation: Service may be down, check Render dashboard`);
        } else if (result.statusCode && result.statusCode >= 500) {
          console.log(`   💡 Recommendation: Check service logs for internal errors`);
        }
      });
    }

    console.log('');
    console.log(`${colors.cyan}📱 WhatsApp Bot Testing:${colors.reset}`);
    console.log(`${colors.blue}• Send 'void' to test admin store management${colors.reset}`);
    console.log(`${colors.blue}• Send 'godeye' to test news management${colors.reset}`);
    console.log(`${colors.blue}• Send 'destiny' to test market management${colors.reset}`);
    console.log(`${colors.blue}• Send 'oracle' to test system operations${colors.reset}`);
    console.log('');
    console.log(`${colors.cyan}🔗 Service URLs:${colors.reset}`);
    Object.entries(SERVICES).forEach(([name, url]) => {
      const status = this.results[name]?.status === 'healthy' ? '✅' : '❌';
      console.log(`${status} ${name}: ${url}`);
    });
  }
}

// Main execution
async function main() {
  const monitor = new HealthMonitor();
  
  try {
    // Check all services
    await monitor.checkAllServices();
    
    // Generate detailed report
    monitor.generateReport();
    
    // Test functionality
    await monitor.testFunctionality();
    
    // Generate recommendations
    monitor.generateRecommendations();
    
  } catch (error) {
    console.error(`${colors.red}❌ Health monitoring failed: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = HealthMonitor;








