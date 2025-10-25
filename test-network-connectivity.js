#!/usr/bin/env node
/**
 * Network Connectivity Test
 * Tests if the backend is accessible from different network configurations
 */

const os = require('os');

// Get network interfaces
function getNetworkInterfaces() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const [name, nets] of Object.entries(interfaces)) {
    for (const net of nets) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push({
          interface: name,
          address: net.address,
          netmask: net.netmask,
          mac: net.mac
        });
      }
    }
  }
  
  return addresses;
}

// Test backend connectivity
async function testBackendConnectivity(ip, port = 5000) {
  const url = `http://${ip}:${port}/health`;
  
  try {
    console.log(`🔍 Testing: ${url}`);
    const response = await fetch(url, {
      method: 'GET',
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ SUCCESS: ${url}`);
      console.log(`   Status: ${data.status}`);
      console.log(`   AI Status: ${data.ai_status}`);
      return { success: true, data };
    } else {
      console.log(`❌ FAILED: ${url} - HTTP ${response.status}`);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.log(`❌ FAILED: ${url} - ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main test function
async function runNetworkTest() {
  console.log('🌐 Network Connectivity Test\n');
  
  // Get network interfaces
  const interfaces = getNetworkInterfaces();
  console.log('📡 Available Network Interfaces:');
  interfaces.forEach(iface => {
    console.log(`   ${iface.interface}: ${iface.address} (${iface.mac})`);
  });
  console.log('');
  
  // Test localhost
  console.log('1️⃣ Testing localhost...');
  const localhostResult = await testBackendConnectivity('localhost');
  console.log('');
  
  // Test 127.0.0.1
  console.log('2️⃣ Testing 127.0.0.1...');
  const localResult = await testBackendConnectivity('127.0.0.1');
  console.log('');
  
  // Test each network interface
  console.log('3️⃣ Testing network interfaces...');
  const interfaceResults = [];
  
  for (const iface of interfaces) {
    const result = await testBackendConnectivity(iface.address);
    interfaceResults.push({
      interface: iface.interface,
      address: iface.address,
      ...result
    });
    console.log('');
  }
  
  // Summary
  console.log('📊 Test Summary:');
  console.log(`   Localhost: ${localhostResult.success ? '✅' : '❌'}`);
  console.log(`   127.0.0.1: ${localResult.success ? '✅' : '❌'}`);
  
  interfaceResults.forEach(result => {
    console.log(`   ${result.interface} (${result.address}): ${result.success ? '✅' : '❌'}`);
  });
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  
  const workingAddresses = interfaceResults.filter(r => r.success);
  
  if (workingAddresses.length > 0) {
    console.log('✅ Backend is accessible on:');
    workingAddresses.forEach(result => {
      console.log(`   - ${result.address}:5000`);
    });
    console.log('\n📱 For mobile app, use one of these IPs in your API configuration.');
  } else if (localhostResult.success || localResult.success) {
    console.log('✅ Backend is running but only accessible locally.');
    console.log('📱 For mobile app, you need to use the computer\'s IP address.');
    console.log('🔧 Update your mobile app API configuration with one of these IPs:');
    interfaces.forEach(iface => {
      console.log(`   - ${iface.address}:5000`);
    });
  } else {
    console.log('❌ Backend is not accessible. Please check:');
    console.log('   1. Backend is running on port 5000');
    console.log('   2. Firewall is not blocking the port');
    console.log('   3. Backend is bound to 0.0.0.0 (not just localhost)');
  }
  
  // Mobile app configuration
  console.log('\n📱 Mobile App Configuration:');
  console.log('Update your API configuration in:');
  console.log('   agrof-main/mobile/app/config/apiConfig.js');
  console.log('\nChange the BASE_IP to one of the working addresses above.');
}

// Run the test
if (require.main === module) {
  runNetworkTest().catch(error => {
    console.error('❌ Test failed:', error);
  });
}

module.exports = { runNetworkTest, testBackendConnectivity, getNetworkInterfaces };
