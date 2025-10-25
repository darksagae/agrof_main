#!/usr/bin/env node
/**
 * Test Mobile App API Configuration
 * Verifies that the mobile app's API configuration matches the working backend
 */

// Simulate the mobile app's API configuration
const BASE_IP = '192.168.1.15';
const API_CONFIG = {
  STORE: {
    BASE_URL: `http://${BASE_IP}:3001`,
    API_URL: `http://${BASE_IP}:3001/api`
  },
  AI: {
    BASE_URL: `http://${BASE_IP}:5000`,
    API_URL: `http://${BASE_IP}:5000/api`
  }
};

async function testMobileAPIConfig() {
  console.log('📱 Testing Mobile App API Configuration...\n');

  const tests = [
    {
      name: 'Store Health Check',
      url: `${API_CONFIG.STORE.API_URL}/health`,
      method: 'GET'
    },
    {
      name: 'Store Products',
      url: `${API_CONFIG.STORE.API_URL}/products?limit=3`,
      method: 'GET'
    },
    {
      name: 'Store Categories',
      url: `${API_CONFIG.STORE.API_URL}/products?category=organic_chemicals&limit=2`,
      method: 'GET'
    },
    {
      name: 'AI Health Check',
      url: `${API_CONFIG.AI.BASE_URL}/health`,  // AI backend uses /health not /api/health
      method: 'GET'
    }
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`🧪 Testing ${test.name}...`);
      console.log(`   URL: ${test.url}`);
      
      const response = await fetch(test.url, {
        method: test.method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        results.push({
          name: test.name,
          status: 'SUCCESS',
          statusCode: response.status,
          dataType: Array.isArray(data) ? 'Array' : typeof data,
          dataLength: Array.isArray(data) ? data.length : 'N/A'
        });
        console.log(`   ✅ SUCCESS (${response.status})`);
        if (Array.isArray(data)) {
          console.log(`   📊 Found ${data.length} items`);
        } else if (data.status) {
          console.log(`   📊 Status: ${data.status}`);
        }
      } else {
        results.push({
          name: test.name,
          status: 'ERROR',
          statusCode: response.status,
          error: `HTTP ${response.status}`
        });
        console.log(`   ❌ ERROR (${response.status})`);
      }
    } catch (error) {
      results.push({
        name: test.name,
        status: 'FAILED',
        error: error.message
      });
      console.log(`   ❌ FAILED: ${error.message}`);
    }
    console.log('');
  }

  // Summary
  console.log('📋 Test Results Summary:');
  console.log('========================');
  
  const successCount = results.filter(r => r.status === 'SUCCESS').length;
  const errorCount = results.filter(r => r.status === 'ERROR').length;
  const failedCount = results.filter(r => r.status === 'FAILED').length;

  results.forEach(result => {
    const status = result.status === 'SUCCESS' ? '✅' : 
                   result.status === 'ERROR' ? '❌' : '💥';
    console.log(`${status} ${result.name}: ${result.status}`);
    if (result.statusCode) {
      console.log(`   Status Code: ${result.statusCode}`);
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    if (result.dataLength !== 'N/A') {
      console.log(`   Data: ${result.dataType} (${result.dataLength} items)`);
    }
  });

  console.log('\n📊 Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   💥 Failed: ${failedCount}`);
  console.log(`   📱 Total Tests: ${results.length}`);

  if (successCount === results.length) {
    console.log('\n🎉 All API endpoints are working correctly!');
    console.log('   The mobile app should be able to fetch products successfully.');
  } else {
    console.log('\n⚠️  Some API endpoints are not working.');
    console.log('   Check the failed tests above for troubleshooting.');
  }

  // Mobile App Configuration
  console.log('\n📱 Mobile App Configuration:');
  console.log('=============================');
  console.log(`STORE_API_URL = '${API_CONFIG.STORE.API_URL}'`);
  console.log(`AI_API_URL = '${API_CONFIG.AI.API_URL}'`);
  console.log(`STORE_BASE_URL = '${API_CONFIG.STORE.BASE_URL}'`);
  console.log(`AI_BASE_URL = '${API_CONFIG.AI.BASE_URL}'`);

  return results;
}

// Run the test
if (require.main === module) {
  testMobileAPIConfig().catch(console.error);
}

module.exports = { testMobileAPIConfig };
