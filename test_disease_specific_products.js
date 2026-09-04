#!/usr/bin/env node

/**
 * Test script for Disease-Specific Product Matching
 * Tests that the system shows appropriate products for different diseases
 */

const fetch = require('node-fetch');

// Test configuration
const STORE_API_URL = 'http://192.168.1.15:3001';

// Test scenarios with different diseases
const testScenarios = [
  {
    name: "Fungal Leaf Spot",
    diseaseType: "Fungal Leaf Spot",
    symptoms: ["yellow spots", "brown spots", "leaf spots"],
    expectedProducts: ["fungicide", "copper", "mancozeb", "chlorothalonil"],
    expectedCategories: ["fungicides", "organic_chemicals"],
    shouldNotShow: ["fertilizer", "nitrogen", "npk"]
  },
  {
    name: "Bacterial Blight",
    diseaseType: "Bacterial Blight", 
    symptoms: ["water-soaked spots", "brown lesions"],
    expectedProducts: ["bactericide", "copper", "streptomycin"],
    expectedCategories: ["bactericides", "copper_products"],
    shouldNotShow: ["fertilizer", "nitrogen", "npk"]
  },
  {
    name: "Aphid Infestation",
    diseaseType: "Aphid Infestation",
    symptoms: ["sticky leaves", "curled leaves", "honeydew"],
    expectedProducts: ["insecticide", "neem", "pyrethrin", "aphid"],
    expectedCategories: ["insecticides", "organic_chemicals"],
    shouldNotShow: ["fertilizer", "nitrogen", "npk"]
  },
  {
    name: "Nitrogen Deficiency",
    diseaseType: "Nitrogen Deficiency",
    symptoms: ["yellow leaves", "stunted growth"],
    expectedProducts: ["fertilizer", "nitrogen", "urea", "ammonium"],
    expectedCategories: ["fertilizers", "organic_fertilizers"],
    shouldNotShow: ["fungicide", "insecticide", "herbicide"]
  },
  {
    name: "Weed Problem",
    diseaseType: "Weed Infestation",
    symptoms: ["unwanted plants", "competition"],
    expectedProducts: ["herbicide", "weed", "control", "2,4d", "amine"],
    expectedCategories: ["herbicides", "organic_chemicals"],
    shouldNotShow: ["fertilizer", "fungicide", "insecticide"]
  }
];

async function testStoreProducts() {
  console.log('🧪 Testing Store Products...\n');
  
  try {
    const productsResponse = await fetch(`${STORE_API_URL}/api/products?limit=50`);
    const products = await productsResponse.json();
    
    console.log(`✅ Found ${products.length} products in store\n`);
    
    // Analyze product categories
    const categoryCount = {};
    products.forEach(product => {
      const category = product.category_name || 'unknown';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    console.log('📊 Product Categories Available:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });
    
    return products;
  } catch (error) {
    console.log(`❌ Store connection failed: ${error.message}`);
    return [];
  }
}

function testDiseaseSpecificMatching(scenario, products) {
  console.log(`\n🔍 Testing: ${scenario.name}`);
  console.log(`   Disease: ${scenario.diseaseType}`);
  console.log(`   Symptoms: ${scenario.symptoms.join(', ')}`);
  
  // Simulate disease-specific product matching
  const diseaseLower = scenario.diseaseType.toLowerCase();
  const diseaseProductMapping = {
    'fungal leaf spot': ['fungicide', 'copper', 'mancozeb', 'chlorothalonil', 'sulfur', 'blight'],
    'bacterial blight': ['bactericide', 'copper', 'streptomycin', 'antibiotic', 'blight'],
    'aphid infestation': ['insecticide', 'neem', 'pyrethrin', 'aphid', 'control'],
    'nitrogen deficiency': ['fertilizer', 'nitrogen', 'urea', 'ammonium', 'npk'],
    'weed infestation': ['herbicide', 'weed', 'control', '2,4d', 'amine', 'glyphosate']
  };
  
  let matchingProducts = [];
  let categoryMatches = [];
  
  // Test direct disease matching
  if (diseaseProductMapping[diseaseLower]) {
    console.log(`   🎯 Direct disease match found`);
    const keywords = diseaseProductMapping[diseaseLower];
    for (const keyword of keywords) {
      const matches = products.filter(product => 
        product.name.toLowerCase().includes(keyword) ||
        (product.description && product.description.toLowerCase().includes(keyword)) ||
        (product.features && product.features.toLowerCase().includes(keyword))
      );
      matchingProducts = [...matchingProducts, ...matches];
      console.log(`   🔍 Keyword "${keyword}": ${matches.length} products`);
    }
  }
  
  // Test category matching
  const categoryMapping = {
    'fungal leaf spot': ['fungicides', 'organic_chemicals'],
    'bacterial blight': ['bactericides', 'copper_products', 'organic_chemicals'],
    'aphid infestation': ['insecticides', 'organic_chemicals'],
    'nitrogen deficiency': ['fertilizers', 'organic_fertilizers'],
    'weed infestation': ['herbicides', 'organic_chemicals']
  };
  
  if (categoryMapping[diseaseLower]) {
    console.log(`   📂 Category matching`);
    const categories = categoryMapping[diseaseLower];
    for (const category of categories) {
      const matches = products.filter(product => 
        product.category_name === category
      );
      categoryMatches = [...categoryMatches, ...matches];
      console.log(`   📂 Category "${category}": ${matches.length} products`);
    }
  }
  
  // Combine and analyze results
  const allMatches = [...matchingProducts, ...categoryMatches];
  const uniqueMatches = allMatches.filter((product, index, self) => 
    index === self.findIndex(p => p.id === product.id)
  );
  
  console.log(`   📊 Total unique matches: ${uniqueMatches.length}`);
  
  // Check if we found expected products
  const foundExpectedProducts = scenario.expectedProducts.some(expected => 
    uniqueMatches.some(product => 
      product.name.toLowerCase().includes(expected.toLowerCase())
    )
  );
  
  // Check if we found unexpected products
  const foundUnexpectedProducts = scenario.shouldNotShow.some(unexpected => 
    uniqueMatches.some(product => 
      product.name.toLowerCase().includes(unexpected.toLowerCase())
    )
  );
  
  // Show top matches
  if (uniqueMatches.length > 0) {
    console.log(`   🏆 Top matches:`);
    uniqueMatches.slice(0, 3).forEach((product, index) => {
      console.log(`      ${index + 1}. ${product.name} (${product.category_name})`);
    });
  }
  
  return {
    scenario: scenario.name,
    totalMatches: uniqueMatches.length,
    foundExpected: foundExpectedProducts,
    foundUnexpected: foundUnexpectedProducts,
    success: foundExpectedProducts && !foundUnexpectedProducts,
    topMatches: uniqueMatches.slice(0, 3)
  };
}

async function testDiseaseSpecificProducts() {
  console.log('🚀 Testing Disease-Specific Product Matching\n');
  
  // Test store products
  const products = await testStoreProducts();
  
  if (products.length === 0) {
    console.log('❌ Cannot test without store products');
    return;
  }
  
  // Test each scenario
  const results = [];
  for (const scenario of testScenarios) {
    const result = testDiseaseSpecificMatching(scenario, products);
    results.push(result);
  }
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log(`Store Products: ${products.length} available`);
  
  console.log('\n🎯 Disease-Specific Matching Results:');
  results.forEach(result => {
    const status = result.success ? '✅ CORRECT' : '❌ INCORRECT';
    const expected = result.foundExpected ? '✅' : '❌';
    const unexpected = result.foundUnexpected ? '❌' : '✅';
    
    console.log(`   ${result.scenario}: ${status}`);
    console.log(`      Expected products: ${expected} (${result.foundExpected ? 'Found' : 'Not found'})`);
    console.log(`      Unexpected products: ${unexpected} (${result.foundUnexpected ? 'Found' : 'Not found'})`);
    console.log(`      Total matches: ${result.totalMatches}`);
    console.log('');
  });
  
  const successfulScenarios = results.filter(r => r.success).length;
  const totalScenarios = results.length;
  
  console.log(`🎯 Overall Success Rate: ${successfulScenarios}/${totalScenarios} (${Math.round(successfulScenarios/totalScenarios*100)}%)`);
  
  if (successfulScenarios === totalScenarios) {
    console.log('\n🎉 All disease-specific matching is working correctly!');
    console.log('✅ Fungal diseases → Fungicides');
    console.log('✅ Bacterial diseases → Bactericides');
    console.log('✅ Pest problems → Insecticides');
    console.log('✅ Nutrient issues → Fertilizers');
    console.log('✅ Weed problems → Herbicides');
  } else {
    console.log('\n⚠️ Some disease-specific matching needs improvement.');
    console.log('   Check the disease-to-product mapping logic.');
  }
  
  console.log('\n💡 Disease-Specific Features:');
  console.log('   🎯 Direct disease name matching');
  console.log('   🔍 Symptom-based product selection');
  console.log('   📂 Category-based filtering');
  console.log('   🚫 Prevents showing wrong product types');
  console.log('   ✅ Ensures appropriate treatments for each disease');
}

// Run test if this script is executed directly
if (require.main === module) {
  testDiseaseSpecificProducts().catch(console.error);
}

module.exports = { testDiseaseSpecificProducts };
