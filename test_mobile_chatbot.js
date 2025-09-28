#!/usr/bin/env node

/**
 * Test the mobile app ChatbotService integration
 */

console.log('🧪 Testing Mobile App ChatbotService...');

// Simulate React Native environment
const mockFetch = async (url, options) => {
  console.log('📤 Mock fetch called with:', url);
  console.log('📋 Options:', JSON.stringify(options, null, 2));
  
  // Simulate a successful Gemini API response
  return {
    ok: true,
    json: async () => ({
      candidates: [{
        content: {
          parts: [{
            text: "Hello! I'm AgrofBot, your AI agricultural assistant powered by Gemini AI. I can help you with farming questions, disease identification, and AGROF store product recommendations. What would you like to know today? 🌱"
          }]
        }
      }]
    })
  };
};

// Mock global fetch
global.fetch = mockFetch;

// Import the service
const ChatbotService = require('./agrof-main/mobile/app/services/chatbotService.js');

console.log('📋 ChatbotService imported:', typeof ChatbotService);
console.log('📋 ChatbotService methods:', Object.getOwnPropertyNames(ChatbotService));

// Test the service
async function testService() {
  try {
    console.log('🧪 Testing sendMessage method...');
    
    if (typeof ChatbotService.sendMessage === 'function') {
      console.log('✅ sendMessage method exists');
      
      const response = await ChatbotService.sendMessage('Hello, test message', 'test context');
      console.log('📊 Response:', response);
      
      if (response.success) {
        console.log('🎉 ChatbotService is working correctly!');
        console.log('📝 Response message:', response.message);
      } else {
        console.log('❌ ChatbotService failed:', response.error);
      }
    } else {
      console.log('❌ sendMessage method not found');
      console.log('📋 Available methods:', Object.getOwnPropertyNames(ChatbotService));
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('🔍 Error details:', error);
  }
}

testService();
