#!/usr/bin/env node

/**
 * Test if the ChatbotService can be imported correctly
 */

console.log('🧪 Testing ChatbotService import...');

try {
  // Try to import the service
  const ChatbotService = require('./agrof-main/mobile/app/services/chatbotService.js');
  console.log('✅ ChatbotService imported successfully');
  console.log('📋 Service type:', typeof ChatbotService);
  console.log('📋 Service methods:', Object.getOwnPropertyNames(ChatbotService));
  
  // Test if sendMessage method exists
  if (typeof ChatbotService.sendMessage === 'function') {
    console.log('✅ sendMessage method exists');
  } else {
    console.log('❌ sendMessage method not found');
  }
  
} catch (error) {
  console.error('❌ Import failed:', error.message);
  console.log('🔍 Error details:', error);
}
