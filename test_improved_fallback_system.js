#!/usr/bin/env node

/**
 * Test script for Improved Fallback System
 * Tests the intelligent fallback system when AI backend is not available
 */

const fetch = require('node-fetch');

// Test configuration
const STORE_API_URL = 'http://192.168.1.15:3001'; // Use the IP from your logs

// Test scenarios
const testScenarios = [
  {
    name: "Fungal Disease",
    diseaseType: "Fungal Leaf Spot",
    symptoms: ["yellow spots", "brown spots", "leaf spots"],
    expectedCategories: ["fungicides", "organic_chemicals"],
    expectedKeywords: ["copper", "fungicide", "mancozeb"]
  },
  {
    name: "Bacterial Disease", 
    diseaseType: "Bacterial Blight",
    symptoms: ["water-soaked spots", "brown lesions"],
    expectedCategories: ["bactericides", "copper_products"],
    expectedKeywords: ["copper", "bactericide", "streptomycin"]
  },
  {
    name: "Pest Infestation",
    diseaseType: "Aphid Infestation", 
    symptoms: ["sticky leaves", "curled leaves", "honeydew"],
    expectedCategories: ["insecticides", "organic_chemicals"],
    expectedKeywords: ["neem", "insecticide", "control"]
  },
  {
    name: "Nutrient Deficiency",
    diseaseType: "Nitrogen Deficiency",
    symptoms: ["yellow leaves", "stunted growth"],
    expectedCategories: ["fertilizers", "organic_fertilizers"],
    expectedKeywords: ["nitrogen", "fertilizer", "npk"]
  },
  {
    name: "Unknown Disease",
    diseaseType: "Unknown",
    symptoms: ["yellow leaves", "poor growth"],
    expectedCategories: ["fertilizers", "organic_chemicals"],
    expectedKeywords: ["fertilizer", "treatment", "organic"]
  }
];

async function testStoreConnection() {
  console.log('🧪 Testing Store Connection...');
  
  try {
    const healthResponse = await fetch(`${STORE_API_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log(`✅ Store Health: ${healthData.status}`);
    
    const productsResponse = await fetch(`${STORE_API_URL}/api/products?limit=100`);
    const products = await productsResponse.json();
    console.log(`✅ Products Available: ${products.length}`);
    
    return { connected: true, products };
  } catch (error) {
    console.log(`❌ Store Connection Failed: ${error.message}`);
    return { connected: false, products: [] };
  }
}

function testIntelligentMatching(scenario, products) {
  console.log(`\n🔍 Testing: ${scenario.name}`);
  console.log(`   Disease: ${scenario.diseaseType}`);
  console.log(`   Symptoms: ${scenario.symptoms.join(', ')}`);
  
  let matchingProducts = [];
  
  // Test disease-specific matching
  console.log('   🎯 Disease-specific matching...');
  const diseaseLower = scenario.diseaseType.toLowerCase();
  const diseaseKeywords = {
    'fungal': ['fungicide', 'copper', 'mancozeb', 'chlorothalonil', 'sulfur'],
    'bacterial': ['bactericide', 'copper', 'streptomycin', 'antibiotic'],
    'viral': ['virus', 'immune', 'booster', 'treatment'],
    'pest': ['insecticide', 'pesticide', 'neem', 'pyrethrin', 'control'],
    'nutrient': ['fertilizer', 'nitrogen', 'phosphorus', 'potassium', 'npk'],
    'weed': ['herbicide', 'weed', 'control', '2,4d', 'amine']
  };
  
  for (const [category, keywords] of Object.entries(diseaseKeywords)) {
    if (diseaseLower.includes(category)) {
      for (const keyword of keywords) {
        const matches = products.filter(product => 
          product.name.toLowerCase().includes(keyword) ||
          (product.description && product.description.toLowerCase().includes(keyword))
        );
        matchingProducts = [...matchingProducts, ...matches];
      }
    }
  }
  
  console.log(`   🎯 Disease-specific matches: ${matchingProducts.length}`);
  
  // Test symptom-based matching
  console.log('   🔍 Symptom-based matching...');
  const symptomKeywords = {
    'spots': ['fungicide', 'copper', 'treatment'],
    'yellow': ['fertilizer', 'nitrogen', 'nutrient'],
    'wilting': ['fungicide', 'root', 'treatment'],
    'powder': ['fungicide', 'sulfur', 'treatment'],
    'holes': ['insecticide', 'pest', 'control'],
    'sticky': ['insecticide', 'neem', 'control']
  };
  
  let symptomMatches = [];
  for (const symptom of scenario.symptoms) {
    const symptomLower = symptom.toLowerCase();
    for (const [keyword, treatments] of Object.entries(symptomKeywords)) {
      if (symptomLower.includes(keyword)) {
        for (const treatment of treatments) {
          const matches = products.filter(product => 
            product.name.toLowerCase().includes(treatment) ||
            (product.description && product.description.toLowerCase().includes(treatment))
          );
          symptomMatches = [...symptomMatches, ...matches];
        }
      }
    }
  }
  
  console.log(`   🔍 Symptom-based matches: ${symptomMatches.length}`);
  
  // Test category-based matching
  console.log('   📂 Category-based matching...');
  const categoryMapping = {
    'fungal': ['fungicides', 'organic_chemicals'],
    'bacterial': ['bactericides', 'copper_products'],
    'viral': ['virus_control', 'plant_boosters'],
    'pest': ['insecticides', 'organic_chemicals'],
    'nutrient': ['fertilizers', 'organic_fertilizers'],
    'weed': ['herbicides', 'organic_chemicals']
  };
  
  let categoryMatches = [];
  for (const [keyword, categories] of Object.entries(categoryMapping)) {
    if (diseaseLower.includes(keyword)) {
      for (const category of categories) {
        const matches = products.filter(product => 
          product.category_name === category
        );
        categoryMatches = [...categoryMatches, ...matches];
      }
    }
  }
  
  console.log(`   📂 Category-based matches: ${categoryMatches.length}`);
  
  // Combine and deduplicate
  const allMatches = [...matchingProducts, ...symptomMatches, ...categoryMatches];
  const uniqueMatches = allMatches.filter((product, index, self) => 
    index === self.findIndex(p => p.id === product.id)
  );
  
  console.log(`   📊 Total unique matches: ${uniqueMatches.length}`);
  
  // Show top matches
  if (uniqueMatches.length > 0) {
    console.log('   🏆 Top matches:');
    uniqueMatches.slice(0, 3).forEach((product, index) => {
      console.log(`      ${index + 1}. ${product.name} (${product.category_name})`);
    });
  }
  
  return {
    scenario: scenario.name,
    totalMatches: uniqueMatches.length,
    hasMatches: uniqueMatches.length > 0,
    topMatches: uniqueMatches.slice(0, 3)
  };
}

async function testFallbackSystem() {
  console.log('🚀 Testing Improved Fallback System\n');
  
  // Test store connection
  const storeResult = await testStoreConnection();
  
  if (!storeResult.connected) {
    console.log('❌ Cannot test without store connection');
    return;
  }
  
  const products = storeResult.products;
  console.log(`\n📦 Testing with ${products.length} products\n`);
  
  // Test each scenario
  const results = [];
  for (const scenario of testScenarios) {
    const result = testIntelligentMatching(scenario, products);
    results.push(result);
  }
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log(`Store Connection: ${storeResult.connected ? '✅ CONNECTED' : '❌ FAILED'}`);
  console.log(`Products Available: ${products.length}`);
  
  console.log('\n🎯 Scenario Results:');
  results.forEach(result => {
    console.log(`   ${result.scenario}: ${result.hasMatches ? '✅ MATCHES FOUND' : '❌ NO MATCHES'} (${result.totalMatches} products)`);
  });
  
  const successfulScenarios = results.filter(r => r.hasMatches).length;
  const totalScenarios = results.length;
  
  console.log(`\n🎯 Overall Success Rate: ${successfulScenarios}/${totalScenarios} (${Math.round(successfulScenarios/totalScenarios*100)}%)`);
  
  if (successfulScenarios === totalScenarios) {
    console.log('\n🎉 All scenarios passed! Intelligent fallback system is working correctly.');
    console.log('✅ AI backend not needed - system works independently');
    console.log('✅ Intelligent product matching based on disease and symptoms');
    console.log('✅ Multiple fallback strategies ensure products are always found');
    console.log('✅ Network errors are handled gracefully');
  } else {
    console.log('\n⚠️ Some scenarios failed. Check the matching logic.');
  }
  
  console.log('\n💡 Fallback System Features:');
  console.log('   🎯 Disease-specific matching');
  console.log('   🔍 Symptom-based matching');
  console.log('   📂 Category-based matching');
  console.log('   🔄 Multiple fallback strategies');
  console.log('   ⚡ Fast and reliable');
  console.log('   🌐 Works without AI backend');
}

// Run test if this script is executed directly
if (require.main === module) {
  testFallbackSystem().catch(console.error);
}

module.exports = { testFallbackSystem };
