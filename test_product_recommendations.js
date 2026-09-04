#!/usr/bin/env node

/**
 * Test script for AGROF Product Recommendation System
 * This script tests the integration between AI disease detection and product recommendations
 */

const fetch = require('node-fetch');

// Test configuration
const STORE_API_URL = 'http://localhost:3001'; // Store backend URL
const AI_API_URL = 'http://localhost:5000'; // AI backend URL

// Test data
const testDiseases = [
  'Fungal Leaf Spot',
  'Bacterial Blight',
  'Powdery Mildew',
  'Root Rot',
  'Aphid Infestation'
];

const testSymptoms = [
  'Yellow spots on leaves',
  'Wilting',
  'Brown patches',
  'Stunted growth',
  'Leaf curling'
];

async function testStoreAPI() {
  console.log('🧪 Testing Store API...');
  
  try {
    // Test health check
    const healthResponse = await fetch(`${STORE_API_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Store API Health:', healthData.status);
    
    // Test categories
    const categoriesResponse = await fetch(`${STORE_API_URL}/api/categories`);
    const categories = await categoriesResponse.json();
    console.log(`✅ Found ${categories.length} categories:`, categories.map(c => c.name));
    
    // Test products
    const productsResponse = await fetch(`${STORE_API_URL}/api/products?limit=10`);
    const products = await productsResponse.json();
    console.log(`✅ Found ${products.length} products`);
    
    // Test search functionality
    for (const disease of testDiseases.slice(0, 2)) {
      const searchResponse = await fetch(`${STORE_API_URL}/api/search?q=${encodeURIComponent(disease)}`);
      const searchResults = await searchResponse.json();
      console.log(`🔍 Search for "${disease}": ${searchResults.length} results`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Store API Test Failed:', error.message);
    return false;
  }
}

async function testAIAPI() {
  console.log('🧪 Testing AI API...');
  
  try {
    // Test AI health check
    const healthResponse = await fetch(`${AI_API_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ AI API Health:', healthData.status);
    
    return true;
  } catch (error) {
    console.error('❌ AI API Test Failed:', error.message);
    return false;
  }
}

async function testProductRecommendationLogic() {
  console.log('🧪 Testing Product Recommendation Logic...');
  
  try {
    // Simulate the product recommendation logic
    const diseaseType = 'Fungal Leaf Spot';
    const symptoms = ['Yellow spots', 'Leaf wilting'];
    
    // Search for products based on disease
    const searchQuery = [diseaseType, ...symptoms].join(' ');
    const searchResponse = await fetch(`${STORE_API_URL}/api/search?q=${encodeURIComponent(searchQuery)}`);
    const products = await searchResponse.json();
    
    console.log(`✅ Found ${products.length} products for "${diseaseType}"`);
    
    // Test relevance scoring
    const relevanceScores = products.map(product => {
      let score = 0;
      const productText = `${product.name} ${product.description || ''}`.toLowerCase();
      const diseaseLower = diseaseType.toLowerCase();
      
      if (product.name.toLowerCase().includes(diseaseLower)) score += 10;
      if (product.description && product.description.toLowerCase().includes(diseaseLower)) score += 5;
      
      return { product: product.name, score };
    });
    
    // Sort by relevance
    relevanceScores.sort((a, b) => b.score - a.score);
    console.log('📊 Top 3 most relevant products:');
    relevanceScores.slice(0, 3).forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.product} (score: ${item.score})`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Product Recommendation Logic Test Failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting AGROF Product Recommendation System Tests\n');
  
  const storeTest = await testStoreAPI();
  const aiTest = await testAIAPI();
  const logicTest = await testProductRecommendationLogic();
  
  console.log('\n📊 Test Results Summary:');
  console.log(`Store API: ${storeTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`AI API: ${aiTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Recommendation Logic: ${logicTest ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = storeTest && aiTest && logicTest;
  console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log('\n🎉 Product Recommendation System is ready!');
    console.log('The system will now show product cards after AI disease detection.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the error messages above.');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testStoreAPI, testAIAPI, testProductRecommendationLogic };
