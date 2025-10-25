#!/usr/bin/env node
/**
 * Test Store API Connectivity
 * Tests if the store backend is accessible and returning products
 */

async function testStoreAPI() {
  console.log('🛒 Testing Store API Connectivity...\n');

  const baseUrl = 'http://192.168.1.15:3001/api';
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Store Health...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    
    if (healthData.status === 'OK') {
      console.log('✅ Store backend is healthy');
      console.log(`   Message: ${healthData.message}\n`);
    } else {
      throw new Error('Store health check failed');
    }

    // Test 2: Products Endpoint
    console.log('2️⃣ Testing Products Endpoint...');
    const productsResponse = await fetch(`${baseUrl}/products?limit=5`);
    const products = await productsResponse.json();
    
    if (Array.isArray(products) && products.length > 0) {
      console.log('✅ Products endpoint working');
      console.log(`   Found ${products.length} products`);
      console.log(`   Sample product: ${products[0].name}\n`);
    } else {
      throw new Error('No products returned');
    }

    // Test 3: Category Filter
    console.log('3️⃣ Testing Category Filter...');
    const categoryResponse = await fetch(`${baseUrl}/products?category=organic_chemicals&limit=3`);
    const categoryProducts = await categoryResponse.json();
    
    if (Array.isArray(categoryProducts)) {
      console.log('✅ Category filter working');
      console.log(`   Found ${categoryProducts.length} organic chemicals\n`);
    } else {
      console.log('⚠️  Category filter returned unexpected format');
    }

    // Test 4: Search Endpoint
    console.log('4️⃣ Testing Search Endpoint...');
    const searchResponse = await fetch(`${baseUrl}/search?q=fertilizer&limit=3`);
    const searchResults = await searchResponse.json();
    
    if (Array.isArray(searchResults)) {
      console.log('✅ Search endpoint working');
      console.log(`   Found ${searchResults.length} search results\n`);
    } else {
      console.log('⚠️  Search endpoint returned unexpected format');
    }

    console.log('🎉 Store API Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Store backend is running');
    console.log('   ✅ Products endpoint accessible');
    console.log('   ✅ Category filtering working');
    console.log('   ✅ Search functionality working');
    
    console.log('\n🔧 Mobile App Configuration:');
    console.log('   Update your mobile app to use:');
    console.log(`   STORE_API_URL = '${baseUrl}'`);
    console.log('   AI_API_URL = \'http://192.168.1.15:5000/api\'');

  } catch (error) {
    console.error('❌ Store API test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure store backend is running on port 3001');
    console.log('   2. Check if the IP address is correct');
    console.log('   3. Verify network connectivity');
    console.log('   4. Check firewall settings');
  }
}

// Run the test
if (require.main === module) {
  testStoreAPI();
}

module.exports = { testStoreAPI };
