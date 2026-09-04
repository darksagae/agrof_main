#!/usr/bin/env node

/**
 * Test script for Single API Address Configuration
 * Verifies that all services use the same consistent address: 192.168.1.15
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const EXPECTED_IP = '192.168.1.15';
const EXPECTED_STORE_PORT = '3001';
const EXPECTED_AI_PORT = '5000';

// Files to check for API addresses
const filesToCheck = [
  'agrof-main/mobile/app/config/apiConfig.js',
  'agrof-main/mobile/app/services/storeApi.js',
  'agrof-main/mobile/app/services/aiCommandService.js',
  'agrof-main/mobile/app/services/advancedProductService.js',
  'agrof-main/mobile/app/components/ProductRecommendationCards.js'
];

function testSingleApiAddress() {
  console.log('🧪 Testing Single API Address Configuration...\n');
  
  console.log(`📋 Expected Configuration:`);
  console.log(`   Store API: http://${EXPECTED_IP}:${EXPECTED_STORE_PORT}`);
  console.log(`   AI API: http://${EXPECTED_IP}:${EXPECTED_AI_PORT}`);
  console.log('');
  
  let allCorrect = true;
  
  for (const filePath of filesToCheck) {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${filePath}`);
      allCorrect = false;
      continue;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    console.log(`📄 Checking: ${filePath}`);
    
    // Check for hardcoded localhost addresses
    const localhostMatches = content.match(/localhost/g);
    if (localhostMatches) {
      console.log(`   ❌ Found ${localhostMatches.length} localhost references`);
      allCorrect = false;
    } else {
      console.log(`   ✅ No localhost references found`);
    }
    
    // Check for correct IP address
    const ipMatches = content.match(/192\.168\.1\.15/g);
    if (ipMatches) {
      console.log(`   ✅ Found ${ipMatches.length} correct IP references`);
    } else {
      console.log(`   ⚠️  No IP references found (may be using config)`);
    }
    
    // Check for wrong IP addresses
    const wrongIpMatches = content.match(/192\.168\.\d+\.\d+/g);
    if (wrongIpMatches) {
      const uniqueWrongIps = [...new Set(wrongIpMatches)];
      if (uniqueWrongIps.length > 1 || !uniqueWrongIps.includes(EXPECTED_IP)) {
        console.log(`   ❌ Found wrong IP addresses: ${uniqueWrongIps.join(', ')}`);
        allCorrect = false;
      }
    }
    
    console.log('');
  }
  
  return allCorrect;
}

function testApiConfigFile() {
  console.log('🧪 Testing API Configuration File...\n');
  
  const configPath = path.join(__dirname, '..', 'agrof-main/mobile/app/config/apiConfig.js');
  
  if (!fs.existsSync(configPath)) {
    console.log('❌ API configuration file not found');
    return false;
  }
  
  const content = fs.readFileSync(configPath, 'utf8');
  console.log('📄 API Configuration File Content:');
  
  // Check for base IP configuration
  const baseIpMatch = content.match(/BASE_IP.*=.*['"](.*?)['"]/);
  if (baseIpMatch) {
    console.log(`   ✅ Base IP: ${baseIpMatch[1]}`);
    if (baseIpMatch[1] !== EXPECTED_IP) {
      console.log(`   ❌ Expected ${EXPECTED_IP}, got ${baseIpMatch[1]}`);
      return false;
    }
  } else {
    console.log('   ❌ Base IP not found in configuration');
    return false;
  }
  
  // Check for store API configuration
  const storeApiMatch = content.match(/STORE.*API_URL.*=.*['"](.*?)['"]/);
  if (storeApiMatch) {
    console.log(`   ✅ Store API URL: ${storeApiMatch[1]}`);
    if (!storeApiMatch[1].includes(EXPECTED_IP) || !storeApiMatch[1].includes(EXPECTED_STORE_PORT)) {
      console.log(`   ❌ Store API URL should contain ${EXPECTED_IP}:${EXPECTED_STORE_PORT}`);
      return false;
    }
  } else {
    console.log('   ❌ Store API URL not found in configuration');
    return false;
  }
  
  // Check for AI API configuration
  const aiApiMatch = content.match(/AI.*API_URL.*=.*['"](.*?)['"]/);
  if (aiApiMatch) {
    console.log(`   ✅ AI API URL: ${aiApiMatch[1]}`);
    if (!aiApiMatch[1].includes(EXPECTED_IP) || !aiApiMatch[1].includes(EXPECTED_AI_PORT)) {
      console.log(`   ❌ AI API URL should contain ${EXPECTED_IP}:${EXPECTED_AI_PORT}`);
      return false;
    }
  } else {
    console.log('   ❌ AI API URL not found in configuration');
    return false;
  }
  
  console.log('');
  return true;
}

function testServiceImports() {
  console.log('🧪 Testing Service Imports...\n');
  
  const servicesToCheck = [
    'agrof-main/mobile/app/services/storeApi.js',
    'agrof-main/mobile/app/services/aiCommandService.js',
    'agrof-main/mobile/app/services/advancedProductService.js'
  ];
  
  let allCorrect = true;
  
  for (const servicePath of servicesToCheck) {
    const fullPath = path.join(__dirname, '..', servicePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Service file not found: ${servicePath}`);
      allCorrect = false;
      continue;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    console.log(`📄 Checking: ${servicePath}`);
    
    // Check for config import
    const configImportMatch = content.match(/import.*from.*['"]\.\.\/config\/apiConfig['"]/);
    if (configImportMatch) {
      console.log(`   ✅ Config import found`);
    } else {
      console.log(`   ❌ Config import not found`);
      allCorrect = false;
    }
    
    // Check for hardcoded URLs
    const hardcodedUrlMatch = content.match(/http:\/\/\d+\.\d+\.\d+\.\d+:\d+/g);
    if (hardcodedUrlMatch) {
      console.log(`   ⚠️  Found ${hardcodedUrlMatch.length} hardcoded URLs: ${hardcodedUrlMatch.join(', ')}`);
      // Check if they're using the correct IP
      const wrongUrls = hardcodedUrlMatch.filter(url => !url.includes(EXPECTED_IP));
      if (wrongUrls.length > 0) {
        console.log(`   ❌ Found wrong URLs: ${wrongUrls.join(', ')}`);
        allCorrect = false;
      }
    } else {
      console.log(`   ✅ No hardcoded URLs found (using config)`);
    }
    
    console.log('');
  }
  
  return allCorrect;
}

function testComponentConfiguration() {
  console.log('🧪 Testing Component Configuration...\n');
  
  const componentPath = path.join(__dirname, '..', 'agrof-main/mobile/app/components/ProductRecommendationCards.js');
  
  if (!fs.existsSync(componentPath)) {
    console.log('❌ Component file not found');
    return false;
  }
  
  const content = fs.readFileSync(componentPath, 'utf8');
  console.log('📄 ProductRecommendationCards.js:');
  
  // Check for config import
  const configImportMatch = content.match(/import.*from.*['"]\.\.\/config\/apiConfig['"]/);
  if (configImportMatch) {
    console.log(`   ✅ Config import found`);
  } else {
    console.log(`   ❌ Config import not found`);
    return false;
  }
  
  // Check for AI API URL usage
  const aiApiUsageMatch = content.match(/AI_API_URL/);
  if (aiApiUsageMatch) {
    console.log(`   ✅ AI_API_URL from config is being used`);
  } else {
    console.log(`   ❌ AI_API_URL from config not found`);
    return false;
  }
  
  // Check for hardcoded URLs
  const hardcodedUrlMatch = content.match(/http:\/\/\d+\.\d+\.\d+\.\d+:\d+/g);
  if (hardcodedUrlMatch) {
    console.log(`   ⚠️  Found ${hardcodedUrlMatch.length} hardcoded URLs: ${hardcodedUrlMatch.join(', ')}`);
    // Check if they're using the correct IP
    const wrongUrls = hardcodedUrlMatch.filter(url => !url.includes(EXPECTED_IP));
    if (wrongUrls.length > 0) {
      console.log(`   ❌ Found wrong URLs: ${wrongUrls.join(', ')}`);
      return false;
    }
  } else {
    console.log(`   ✅ No hardcoded URLs found (using config)`);
  }
  
  console.log('');
  return true;
}

async function testSingleApiAddressConfiguration() {
  console.log('🚀 Testing Single API Address Configuration\n');
  
  // Test 1: Check all files for consistent addresses
  const filesCorrect = testSingleApiAddress();
  
  // Test 2: Check API configuration file
  const configCorrect = testApiConfigFile();
  
  // Test 3: Check service imports
  const servicesCorrect = testServiceImports();
  
  // Test 4: Check component configuration
  const componentCorrect = testComponentConfiguration();
  
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Files Check: ${filesCorrect ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Config File: ${configCorrect ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Service Imports: ${servicesCorrect ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Component Config: ${componentCorrect ? 'PASS' : 'FAIL'}`);
  
  const allTestsPass = filesCorrect && configCorrect && servicesCorrect && componentCorrect;
  
  console.log('\n🎯 Final Result:');
  if (allTestsPass) {
    console.log('✅ ALL TESTS PASSED - Single API Address Configuration is CORRECT');
    console.log(`   🎯 All services use: ${EXPECTED_IP}`);
    console.log(`   🏪 Store API: http://${EXPECTED_IP}:${EXPECTED_STORE_PORT}`);
    console.log(`   🤖 AI API: http://${EXPECTED_IP}:${EXPECTED_AI_PORT}`);
    console.log('   📁 Centralized configuration in apiConfig.js');
    console.log('   🔧 All services import from centralized config');
    console.log('   🚫 No hardcoded localhost addresses found');
  } else {
    console.log('❌ SOME TESTS FAILED - Configuration needs attention');
    console.log('   🔧 Check the failed components above');
    console.log('   📝 Ensure all services use the centralized config');
    console.log('   🚫 Remove any hardcoded localhost addresses');
  }
  
  console.log('\n💡 Benefits of Single API Address:');
  console.log('   🎯 Consistency: All services use the same address');
  console.log('   🔧 Maintainability: Easy to change address in one place');
  console.log('   🚀 Performance: No confusion about which address to use');
  console.log('   🛡️ Reliability: Centralized configuration prevents errors');
  console.log('   📱 User Experience: Consistent behavior across the app');
  
  return allTestsPass;
}

// Run test if this script is executed directly
if (require.main === module) {
  testSingleApiAddressConfiguration().catch(console.error);
}

module.exports = { testSingleApiAddressConfiguration };
