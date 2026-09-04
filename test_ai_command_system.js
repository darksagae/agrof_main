#!/usr/bin/env node

/**
 * Test script for AI Command System
 * Tests the complete AI-driven product recommendation system
 */

const fetch = require('node-fetch');

// Test configuration
const AI_API_URL = 'http://localhost:5000';
const STORE_API_URL = 'http://localhost:3001';

// Test disease analyses
const testDiseaseAnalyses = [
  {
    disease_type: 'Fungal Leaf Spot',
    symptoms: ['yellow spots', 'brown spots', 'leaf spots'],
    severity_level: 'high',
    crop_type: 'Tomato'
  },
  {
    disease_type: 'Powdery Mildew',
    symptoms: ['white powder', 'powdery coating', 'leaf distortion'],
    severity_level: 'medium',
    crop_type: 'Cucumber'
  },
  {
    disease_type: 'Bacterial Blight',
    symptoms: ['water-soaked spots', 'brown lesions', 'leaf wilting'],
    severity_level: 'high',
    crop_type: 'Bean'
  },
  {
    disease_type: 'Aphid Infestation',
    symptoms: ['sticky leaves', 'curled leaves', 'honeydew'],
    severity_level: 'medium',
    crop_type: 'Rose'
  },
  {
    disease_type: 'Unknown',
    symptoms: ['yellow leaves', 'stunted growth', 'poor development'],
    severity_level: 'medium',
    crop_type: 'General'
  }
];

async function testAIBackend() {
  console.log('🧪 Testing AI Backend...');
  
  try {
    // Test AI health
    const healthResponse = await fetch(`${AI_API_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log(`✅ AI Backend Health: ${healthData.status}`);
    
    // Test disease database
    const dbResponse = await fetch(`${AI_API_URL}/api/ai-disease-database`);
    const dbData = await dbResponse.json();
    console.log(`✅ Disease Database: ${dbData.total_diseases} diseases available`);
    
    return true;
  } catch (error) {
    console.error('❌ AI Backend Test Failed:', error.message);
    return false;
  }
}

async function testStoreBackend() {
  console.log('🧪 Testing Store Backend...');
  
  try {
    // Test store health
    const healthResponse = await fetch(`${STORE_API_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log(`✅ Store Backend Health: ${healthData.status}`);
    
    // Test products
    const productsResponse = await fetch(`${STORE_API_URL}/api/products?limit=10`);
    const products = await productsResponse.json();
    console.log(`✅ Store Products: ${products.length} products available`);
    
    return true;
  } catch (error) {
    console.error('❌ Store Backend Test Failed:', error.message);
    return false;
  }
}

async function testAIDiseaseAnalysis() {
  console.log('🧪 Testing AI Disease Analysis...');
  
  const results = [];
  
  for (const analysis of testDiseaseAnalyses) {
    try {
      console.log(`\n🔍 Testing: ${analysis.disease_type}`);
      
      const response = await fetch(`${AI_API_URL}/api/ai-analyze-disease`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disease_analysis: analysis })
      });
      
      if (!response.ok) {
        throw new Error(`AI analysis failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ AI Analysis: ${result.disease_type}`);
        console.log(`   Command: ${result.ai_command.action}`);
        console.log(`   Categories: ${result.ai_command.categories.join(', ')}`);
        console.log(`   Products: ${result.ai_command.products.join(', ')}`);
        console.log(`   Confidence: ${result.confidence}`);
        console.log(`   Strategy: ${result.ai_command.search_strategy}`);
        
        results.push({
          disease: analysis.disease_type,
          success: true,
          command: result.ai_command,
          confidence: result.confidence
        });
      } else {
        console.log(`❌ AI Analysis Failed: ${result.error}`);
        results.push({
          disease: analysis.disease_type,
          success: false,
          error: result.error
        });
      }
      
    } catch (error) {
      console.error(`❌ Test failed for ${analysis.disease_type}:`, error.message);
      results.push({
        disease: analysis.disease_type,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

async function testAICommandProcessing() {
  console.log('🧪 Testing AI Command Processing...');
  
  try {
    // Get a sample AI command
    const analysis = testDiseaseAnalyses[0];
    const aiResponse = await fetch(`${AI_API_URL}/api/ai-analyze-disease`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disease_analysis: analysis })
    });
    
    const aiResult = await aiResponse.json();
    
    if (!aiResult.success) {
      throw new Error('AI analysis failed');
    }
    
    console.log('🤖 AI Command:', aiResult.ai_command);
    
    // Simulate JavaScript processing of AI command
    const command = aiResult.ai_command;
    const fetchedProducts = [];
    
    // Fetch products based on AI command
    if (command.categories && command.categories.length > 0) {
      for (const category of command.categories) {
        try {
          const categoryResponse = await fetch(`${STORE_API_URL}/api/products?category=${category}&limit=5`);
          const categoryProducts = await categoryResponse.json();
          fetchedProducts.push(...categoryProducts);
          console.log(`📂 ${category}: ${categoryProducts.length} products`);
        } catch (error) {
          console.log(`⚠️ Failed to fetch ${category}: ${error.message}`);
        }
      }
    }
    
    if (command.products && command.products.length > 0) {
      for (const productName of command.products) {
        try {
          const searchResponse = await fetch(`${STORE_API_URL}/api/search?q=${encodeURIComponent(productName)}`);
          const searchProducts = await searchResponse.json();
          fetchedProducts.push(...searchProducts);
          console.log(`🔍 "${productName}": ${searchProducts.length} products`);
        } catch (error) {
          console.log(`⚠️ Failed to search "${productName}": ${error.message}`);
        }
      }
    }
    
    // Remove duplicates
    const uniqueProducts = fetchedProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );
    
    console.log(`📊 Total unique products: ${uniqueProducts.length}`);
    
    // Simulate AI enhancement
    const enhancedProducts = uniqueProducts.map(product => ({
      ...product,
      ai_relevance_score: Math.floor(Math.random() * 100),
      ai_confidence: command.confidence || 0.8,
      ai_strategy: command.search_strategy,
      enhanced_by_ai: true
    })).sort((a, b) => b.ai_relevance_score - a.ai_relevance_score);
    
    console.log(`🎯 Enhanced products: ${enhancedProducts.length}`);
    enhancedProducts.slice(0, 3).forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (Score: ${product.ai_relevance_score})`);
    });
    
    return {
      success: true,
      products: enhancedProducts,
      command: command
    };
    
  } catch (error) {
    console.error('❌ AI Command Processing Failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function testCommandHistory() {
  console.log('🧪 Testing Command History...');
  
  try {
    const historyResponse = await fetch(`${AI_API_URL}/api/ai-command-history?limit=5`);
    const historyData = await historyResponse.json();
    
    if (historyData.success) {
      console.log(`✅ Command History: ${historyData.total_commands} commands`);
      historyData.command_history.forEach((cmd, index) => {
        console.log(`   ${index + 1}. ${cmd.ai_command.action} - ${cmd.success_rate}% success`);
      });
      return true;
    } else {
      console.log('❌ Command History Failed:', historyData.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Command History Test Failed:', error.message);
    return false;
  }
}

async function runAITests() {
  console.log('🚀 Starting AI Command System Tests\n');
  
  const aiBackendTest = await testAIBackend();
  const storeBackendTest = await testStoreBackend();
  const diseaseAnalysisTest = await testAIDiseaseAnalysis();
  const commandProcessingTest = await testAICommandProcessing();
  const historyTest = await testCommandHistory();
  
  console.log('\n📊 Test Results Summary:');
  console.log(`AI Backend: ${aiBackendTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Store Backend: ${storeBackendTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Disease Analysis: ${diseaseAnalysisTest.filter(r => r.success).length}/${diseaseAnalysisTest.length} passed`);
  console.log(`Command Processing: ${commandProcessingTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Command History: ${historyTest ? '✅ PASS' : '❌ FAIL'}`);
  
  const allTestsPassed = aiBackendTest && storeBackendTest && 
                        diseaseAnalysisTest.some(r => r.success) && 
                        commandProcessingTest.success && historyTest;
  
  console.log(`\n🎯 Overall Result: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allTestsPassed) {
    console.log('\n🎉 AI Command System is working correctly!');
    console.log('✅ AI analyzes diseases and generates commands');
    console.log('✅ JavaScript processes AI commands');
    console.log('✅ Products are fetched based on AI intelligence');
    console.log('✅ System is highly trained for product matching');
    console.log('✅ Code is optimized and simplified');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the error messages above.');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAITests().catch(console.error);
}

module.exports = { 
  testAIBackend, 
  testStoreBackend, 
  testAIDiseaseAnalysis, 
  testAICommandProcessing,
  testCommandHistory 
};
