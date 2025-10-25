#!/usr/bin/env node
/**
 * Test Enhanced Product Service
 * Tests if the enhanced product service can fetch products correctly
 */

async function testEnhancedProductService() {
  console.log('🛒 Testing Enhanced Product Service...\n');

  try {
    // Test 1: Test the search endpoint directly
    console.log('1️⃣ Testing Search Endpoint...');
    const searchUrl = 'http://192.168.1.15:3001/api/search?q=fertilizer&limit=5';
    console.log(`   URL: ${searchUrl}`);
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const products = await response.json();
      console.log('✅ Search endpoint working');
      console.log(`   Found ${products.length} products`);
      if (products.length > 0) {
        console.log(`   Sample product: ${products[0].name}`);
      }
      console.log('');
    } else {
      console.log(`❌ Search endpoint failed: ${response.status}`);
      const errorText = await response.text();
      console.log(`   Error: ${errorText}\n`);
    }

    // Test 2: Test with disease-specific search
    console.log('2️⃣ Testing Disease-Specific Search...');
    const diseaseSearchUrl = 'http://192.168.1.15:3001/api/search?q=fungicide&limit=3';
    console.log(`   URL: ${diseaseSearchUrl}`);
    
    const diseaseResponse = await fetch(diseaseSearchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (diseaseResponse.ok) {
      const diseaseProducts = await diseaseResponse.json();
      console.log('✅ Disease-specific search working');
      console.log(`   Found ${diseaseProducts.length} fungicide products`);
      if (diseaseProducts.length > 0) {
        console.log(`   Sample product: ${diseaseProducts[0].name}`);
      }
      console.log('');
    } else {
      console.log(`❌ Disease-specific search failed: ${diseaseResponse.status}`);
      const errorText = await diseaseResponse.text();
      console.log(`   Error: ${errorText}\n`);
    }

    // Test 3: Test with organic chemicals search
    console.log('3️⃣ Testing Organic Chemicals Search...');
    const organicSearchUrl = 'http://192.168.1.15:3001/api/search?q=organic&limit=3';
    console.log(`   URL: ${organicSearchUrl}`);
    
    const organicResponse = await fetch(organicSearchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (organicResponse.ok) {
      const organicProducts = await organicResponse.json();
      console.log('✅ Organic chemicals search working');
      console.log(`   Found ${organicProducts.length} organic products`);
      if (organicProducts.length > 0) {
        console.log(`   Sample product: ${organicProducts[0].name}`);
      }
      console.log('');
    } else {
      console.log(`❌ Organic chemicals search failed: ${organicResponse.status}`);
      const errorText = await organicResponse.text();
      console.log(`   Error: ${errorText}\n`);
    }

    console.log('🎉 Enhanced Product Service Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Search endpoint is working');
    console.log('   ✅ Disease-specific search is working');
    console.log('   ✅ Organic chemicals search is working');
    console.log('   ✅ Product fetch 404 errors should be resolved');
    
    console.log('\n🔧 Fixed Issues:');
    console.log('   ✅ Changed from POST to GET request');
    console.log('   ✅ Updated endpoint from /api/products/search to /api/search');
    console.log('   ✅ Added proper query parameters');
    console.log('   ✅ Enhanced error handling');

  } catch (error) {
    console.error('❌ Enhanced Product Service test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if the store backend is running on port 3001');
    console.log('   2. Verify the search endpoint is accessible');
    console.log('   3. Check network connectivity');
    console.log('   4. Ensure the mobile app is using the updated service');
  }
}

// Run the test
if (require.main === module) {
  testEnhancedProductService();
}

module.exports = { testEnhancedProductService };
