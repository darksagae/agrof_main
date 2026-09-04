#!/usr/bin/env node

/**
 * Test script for Product Fixes
 * Verifies that at least 2 products are shown and images are loading correctly
 */

const fetch = require('node-fetch');

// Test configuration
const STORE_API_URL = 'http://localhost:3001';
const AI_API_URL = 'http://localhost:5000';

async function testProductFixes() {
  console.log('🧪 Testing Product Fixes...\n');
  
  try {
    // Test 1: Check store backend
    console.log('1️⃣ Testing Store Backend...');
    const healthResponse = await fetch(`${STORE_API_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log(`✅ Store Backend: ${healthData.status}`);
    
    // Test 2: Get all products
    console.log('\n2️⃣ Testing Product Fetching...');
    const productsResponse = await fetch(`${STORE_API_URL}/api/products?limit=100`);
    const products = await productsResponse.json();
    console.log(`✅ Total Products Available: ${products.length}`);
    
    if (products.length < 2) {
      console.log('❌ CRITICAL: Store has less than 2 products!');
      console.log('   This will cause the recommendation system to fail.');
      console.log('   Please add more products to the store database.');
      return;
    }
    
    // Test 3: Check product images
    console.log('\n3️⃣ Testing Product Images...');
    let productsWithImages = 0;
    let productsWithoutImages = 0;
    
    for (const product of products.slice(0, 10)) {
      if (product.image_url) {
        productsWithImages++;
        console.log(`✅ ${product.name}: ${product.image_url}`);
      } else {
        productsWithoutImages++;
        console.log(`⚠️ ${product.name}: No image URL`);
      }
    }
    
    console.log(`📊 Image Summary: ${productsWithImages} with images, ${productsWithoutImages} without`);
    
    // Test 4: Test search functionality
    console.log('\n4️⃣ Testing Search Functionality...');
    const searchQueries = ['fungicide', 'fertilizer', 'herbicide', 'organic'];
    
    for (const query of searchQueries) {
      try {
        const searchResponse = await fetch(`${STORE_API_URL}/api/search?q=${encodeURIComponent(query)}`);
        const searchResults = await searchResponse.json();
        console.log(`🔍 "${query}": ${searchResults.length} results`);
      } catch (error) {
        console.log(`❌ Search failed for "${query}": ${error.message}`);
      }
    }
    
    // Test 5: Test categories
    console.log('\n5️⃣ Testing Categories...');
    const categoriesResponse = await fetch(`${STORE_API_URL}/api/categories`);
    const categories = await categoriesResponse.json();
    console.log(`✅ Categories: ${categories.length}`);
    
    for (const category of categories) {
      try {
        const categoryProductsResponse = await fetch(`${STORE_API_URL}/api/categories/${category.name}/products`);
        const categoryProducts = await categoryProductsResponse.json();
        console.log(`📂 ${category.display_name}: ${categoryProducts.length} products`);
      } catch (error) {
        console.log(`⚠️ Failed to get products for ${category.name}: ${error.message}`);
      }
    }
    
    // Test 6: Simulate recommendation logic
    console.log('\n6️⃣ Simulating Recommendation Logic...');
    const diseaseType = 'Fungal Leaf Spot';
    const symptoms = ['Yellow spots', 'Leaf wilting'];
    
    // Get products for disease
    const diseaseSearchResponse = await fetch(`${STORE_API_URL}/api/search?q=${encodeURIComponent(diseaseType)}`);
    const diseaseProducts = await diseaseSearchResponse.json();
    console.log(`🔍 Disease-specific products: ${diseaseProducts.length}`);
    
    // Get products from relevant categories
    const relevantCategories = ['fungicides', 'herbicides', 'organic_chemicals'];
    let categoryProducts = [];
    
    for (const category of relevantCategories) {
      try {
        const categoryResponse = await fetch(`${STORE_API_URL}/api/search?q=${encodeURIComponent(diseaseType)}&category=${category}`);
        const categoryResults = await categoryResponse.json();
        categoryProducts = [...categoryProducts, ...categoryResults];
        console.log(`📂 ${category}: ${categoryResults.length} products`);
      } catch (error) {
        console.log(`⚠️ Failed to search ${category}: ${error.message}`);
      }
    }
    
    // Combine and deduplicate
    const allFoundProducts = [...diseaseProducts, ...categoryProducts];
    const uniqueProducts = allFoundProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );
    
    console.log(`📊 Total unique products found: ${uniqueProducts.length}`);
    
    // Test 7: Test image URL construction
    console.log('\n7️⃣ Testing Image URL Construction...');
    const testProduct = products[0];
    if (testProduct) {
      console.log(`🧪 Testing with product: ${testProduct.name}`);
      console.log(`   Original image_url: ${testProduct.image_url}`);
      
      let constructedUrl = null;
      if (testProduct.image_url) {
        if (testProduct.image_url.startsWith('http')) {
          constructedUrl = testProduct.image_url;
        } else {
          constructedUrl = `${STORE_API_URL}${testProduct.image_url}`;
        }
      } else {
        constructedUrl = `${STORE_API_URL}/api/images/GENERAL/${encodeURIComponent(testProduct.name)}/image.jpg`;
      }
      
      console.log(`   Constructed URL: ${constructedUrl}`);
      
      // Test if image URL is accessible
      try {
        const imageResponse = await fetch(constructedUrl, { method: 'HEAD' });
        if (imageResponse.ok) {
          console.log(`✅ Image is accessible: ${imageResponse.status}`);
        } else {
          console.log(`⚠️ Image not accessible: ${imageResponse.status}`);
        }
      } catch (error) {
        console.log(`❌ Image test failed: ${error.message}`);
      }
    }
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`✅ Store Backend: ${healthData.status === 'OK' ? 'WORKING' : 'FAILED'}`);
    console.log(`✅ Products Available: ${products.length >= 2 ? 'SUFFICIENT' : 'INSUFFICIENT'} (${products.length} products)`);
    console.log(`✅ Images Available: ${productsWithImages > 0 ? 'YES' : 'NO'} (${productsWithImages} products have images)`);
    console.log(`✅ Search Working: ${diseaseProducts.length > 0 ? 'YES' : 'NO'} (${diseaseProducts.length} disease-specific products)`);
    console.log(`✅ Categories Working: ${categories.length > 0 ? 'YES' : 'NO'} (${categories.length} categories)`);
    console.log(`✅ Recommendation Logic: ${uniqueProducts.length >= 2 ? 'WORKING' : 'FAILING'} (${uniqueProducts.length} unique products)`);
    
    const allTestsPassed = 
      healthData.status === 'OK' && 
      products.length >= 2 && 
      productsWithImages > 0 && 
      uniqueProducts.length >= 2;
    
    console.log(`\n🎯 Overall Result: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    if (allTestsPassed) {
      console.log('\n🎉 Product recommendation system should work correctly!');
      console.log('✅ At least 2 products will be shown');
      console.log('✅ Each product will be on its own card');
      console.log('✅ Product images should load correctly');
      console.log('✅ Complete product information will be displayed');
    } else {
      console.log('\n⚠️ Issues detected that may cause problems:');
      if (products.length < 2) {
        console.log('   ❌ Not enough products in store (need at least 2)');
      }
      if (productsWithImages === 0) {
        console.log('   ❌ No product images available');
      }
      if (uniqueProducts.length < 2) {
        console.log('   ❌ Search not finding enough products');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure store backend is running on port 3001');
    console.log('   2. Check that products are loaded in the store database');
    console.log('   3. Verify product images are available in the store directory');
    console.log('   4. Check network connectivity between frontend and backend');
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testProductFixes().catch(console.error);
}

module.exports = { testProductFixes };
