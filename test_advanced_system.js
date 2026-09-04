#!/usr/bin/env node

/**
 * Advanced AGROF System Test
 * Tests JavaScript-Python integration for advanced training and product recommendations
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
  'Wilting and drooping',
  'Brown patches on stems',
  'Stunted growth',
  'Leaf curling'
];

async function testStoreBackend() {
  console.log('🧪 Testing Store Backend...');
  
  try {
    // Test health check
    const healthResponse = await fetch(`${STORE_API_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Store Backend Health:', healthData.status);
    
    // Test categories
    const categoriesResponse = await fetch(`${STORE_API_URL}/api/categories`);
    const categories = await categoriesResponse.json();
    console.log(`✅ Found ${categories.length} categories`);
    
    // Test all products
    const productsResponse = await fetch(`${STORE_API_URL}/api/products?limit=1000`);
    const products = await productsResponse.json();
    console.log(`✅ Found ${products.length} total products`);
    
    return { success: true, products, categories };
  } catch (error) {
    console.error('❌ Store Backend Test Failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testAIBackend() {
  console.log('🧪 Testing AI Backend...');
  
  try {
    // Test health check
    const healthResponse = await fetch(`${AI_API_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ AI Backend Health:', healthData.status);
    
    // Test advanced training endpoint
    const trainingResponse = await fetch(`${AI_API_URL}/api/training-status`);
    const trainingData = await trainingResponse.json();
    console.log('✅ Advanced Training Status:', trainingData.status);
    
    return { success: true, trainingStatus: trainingData };
  } catch (error) {
    console.error('❌ AI Backend Test Failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testAdvancedTraining() {
  console.log('🧪 Testing Advanced Training...');
  
  try {
    const diseaseType = 'Fungal Leaf Spot';
    const symptoms = ['Yellow spots', 'Leaf wilting'];
    
    // Prepare training data
    const trainingPayload = {
      disease_type: diseaseType,
      products: [
        {
          id: 1,
          name: 'Fungicide Spray',
          description: 'Effective against fungal diseases',
          category_name: 'fungicides',
          features: 'Broad spectrum fungicide',
          usage_instructions: 'Apply every 7-10 days'
        },
        {
          id: 2,
          name: 'Organic Fungicide',
          description: 'Natural fungal control',
          category_name: 'organic_chemicals',
          features: 'Organic and safe',
          usage_instructions: 'Apply as needed'
        }
      ],
      training_mode: 'advanced'
    };
    
    // Test training endpoint
    const trainingResponse = await fetch(`${AI_API_URL}/api/train-advanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trainingPayload)
    });
    
    if (!trainingResponse.ok) {
      throw new Error(`Training request failed: ${trainingResponse.status}`);
    }
    
    const trainingResult = await trainingResponse.json();
    console.log('✅ Advanced Training Result:', trainingResult.success);
    
    if (trainingResult.success) {
      console.log(`   Training ID: ${trainingResult.training_id}`);
      console.log(`   Products Processed: ${trainingResult.products_processed}`);
      console.log(`   Model Accuracy: ${trainingResult.model_accuracy}`);
    }
    
    return trainingResult;
  } catch (error) {
    console.error('❌ Advanced Training Test Failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testEnhancedRecommendations() {
  console.log('🧪 Testing Enhanced Recommendations...');
  
  try {
    const diseaseType = 'Fungal Leaf Spot';
    const symptoms = ['Yellow spots', 'Leaf wilting'];
    
    // Prepare recommendation request
    const recommendationPayload = {
      disease_type: diseaseType,
      symptoms: symptoms,
      products: [
        {
          id: 1,
          name: 'Fungicide Spray',
          description: 'Effective against fungal diseases',
          category_name: 'fungicides',
          features: 'Broad spectrum fungicide',
          usage_instructions: 'Apply every 7-10 days'
        },
        {
          id: 2,
          name: 'Organic Fungicide',
          description: 'Natural fungal control',
          category_name: 'organic_chemicals',
          features: 'Organic and safe',
          usage_instructions: 'Apply as needed'
        },
        {
          id: 3,
          name: 'Plant Fertilizer',
          description: 'General plant nutrition',
          category_name: 'fertilizers',
          features: 'NPK balanced',
          usage_instructions: 'Apply monthly'
        }
      ],
      model_type: 'advanced_trained'
    };
    
    // Test recommendation endpoint
    const recommendationResponse = await fetch(`${AI_API_URL}/api/recommend-enhanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recommendationPayload)
    });
    
    if (!recommendationResponse.ok) {
      throw new Error(`Recommendation request failed: ${recommendationResponse.status}`);
    }
    
    const recommendationResult = await recommendationResponse.json();
    console.log('✅ Enhanced Recommendations Result:', recommendationResult.success);
    
    if (recommendationResult.success) {
      console.log(`   Recommendations: ${recommendationResult.recommendations.length}`);
      console.log(`   Model Used: ${recommendationResult.model_used}`);
      console.log(`   Confidence: ${recommendationResult.confidence}`);
      
      // Show top recommendations
      recommendationResult.recommendations.slice(0, 3).forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (Score: ${product.model_score || product.basic_score || 'N/A'})`);
      });
    }
    
    return recommendationResult;
  } catch (error) {
    console.error('❌ Enhanced Recommendations Test Failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testJavaScriptIntegration() {
  console.log('🧪 Testing JavaScript Integration...');
  
  try {
    // Simulate JavaScript advanced product service
    const mockAdvancedService = {
      async fetchAllProducts() {
        const response = await fetch(`${STORE_API_URL}/api/products?limit=1000`);
        const products = await response.json();
        return {
          success: true,
          products: products,
          total: products.length
        };
      },
      
      async getTrainingProducts(diseaseType) {
        const response = await fetch(`${STORE_API_URL}/api/search?q=${encodeURIComponent(diseaseType)}`);
        const products = await response.json();
        return {
          success: true,
          training_products: products,
          disease_type: diseaseType
        };
      },
      
      async getEnhancedRecommendations(diseaseType, symptoms) {
        const trainingData = await this.getTrainingProducts(diseaseType);
        const recommendationPayload = {
          disease_type: diseaseType,
          symptoms: symptoms,
          products: trainingData.training_products,
          model_type: 'advanced_trained'
        };
        
        const response = await fetch(`${AI_API_URL}/api/recommend-enhanced`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recommendationPayload)
        });
        
        return await response.json();
      }
    };
    
    // Test JavaScript service
    const allProducts = await mockAdvancedService.fetchAllProducts();
    console.log(`✅ JavaScript Service - All Products: ${allProducts.total}`);
    
    const trainingProducts = await mockAdvancedService.getTrainingProducts('Fungal Leaf Spot');
    console.log(`✅ JavaScript Service - Training Products: ${trainingProducts.training_products.length}`);
    
    const recommendations = await mockAdvancedService.getEnhancedRecommendations('Fungal Leaf Spot', ['Yellow spots']);
    console.log(`✅ JavaScript Service - Recommendations: ${recommendations.success ? 'Success' : 'Failed'}`);
    
    return { success: true };
  } catch (error) {
    console.error('❌ JavaScript Integration Test Failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function runAdvancedTests() {
  console.log('🚀 Starting Advanced AGROF System Tests\n');
  
  const storeTest = await testStoreBackend();
  const aiTest = await testAIBackend();
  const trainingTest = await testAdvancedTraining();
  const recommendationTest = await testEnhancedRecommendations();
  const jsIntegrationTest = await testJavaScriptIntegration();
  
  console.log('\n📊 Advanced Test Results Summary:');
  console.log(`Store Backend: ${storeTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`AI Backend: ${aiTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Advanced Training: ${trainingTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Enhanced Recommendations: ${recommendationTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`JavaScript Integration: ${jsIntegrationTest.success ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = storeTest.success && aiTest.success && trainingTest.success && 
                   recommendationTest.success && jsIntegrationTest.success;
  
  console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL ADVANCED TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log('\n🎉 Advanced AGROF System is ready!');
    console.log('✅ JavaScript-Python integration working');
    console.log('✅ Advanced training system operational');
    console.log('✅ Enhanced product recommendations active');
    console.log('✅ Complete product data fetching implemented');
  } else {
    console.log('\n⚠️  Some advanced tests failed. Please check the error messages above.');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAdvancedTests().catch(console.error);
}

module.exports = { 
  testStoreBackend, 
  testAIBackend, 
  testAdvancedTraining, 
  testEnhancedRecommendations,
  testJavaScriptIntegration 
};
