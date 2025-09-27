#!/usr/bin/env node

// Test script to verify store backend is running and has correct endpoints
const fetch = require('node-fetch');

const API_URLS = [
  'http://192.168.1.14:3001/api',
  'http://192.168.0.105:3001/api',
  'http://localhost:3001/api',
  'http://127.0.0.1:3001/api'
];

async function testStoreBackend() {
  console.log('🔍 Testing Store Backend Endpoints...\n');
  
  for (const baseUrl of API_URLS) {
    console.log(`Testing: ${baseUrl}`);
    
    try {
      // Test products endpoint
      const productsResponse = await fetch(`${baseUrl}/products?limit=1`, {
        method: 'GET',
        timeout: 3000
      });
      
      if (productsResponse.ok) {
        console.log(`✅ Products endpoint working: ${baseUrl}`);
        
        // Test categories endpoint
        const categoriesResponse = await fetch(`${baseUrl}/categories`, {
          method: 'GET',
          timeout: 3000
        });
        
        if (categoriesResponse.ok) {
          console.log(`✅ Categories endpoint working: ${baseUrl}`);
          console.log(`🎉 Store backend is working on: ${baseUrl}\n`);
          return baseUrl;
        } else {
          console.log(`❌ Categories endpoint failed: ${baseUrl}`);
        }
      } else {
        console.log(`❌ Products endpoint failed: ${baseUrl}`);
      }
    } catch (error) {
      console.log(`❌ Connection failed: ${baseUrl} - ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('❌ No working store backend found!');
  console.log('💡 Make sure to start the store backend:');
  console.log('   cd store-backend');
  console.log('   npm install');
  console.log('   npm run dev');
  
  return null;
}

// Run the test
testStoreBackend().then(result => {
  if (result) {
    console.log(`🚀 Use this URL in your mobile app: ${result}`);
  }
  process.exit(result ? 0 : 1);
});
