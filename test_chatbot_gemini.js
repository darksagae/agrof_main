#!/usr/bin/env node

/**
 * Test script to verify chatbot is using Gemini API
 * This script tests the chatbot service directly
 */

const CHATBOT_API_KEY = "AIzaSyDUMB5H8bzSIbaECO2CmVk3hfoNj7zfU60";
const CHATBOT_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${CHATBOT_API_KEY}`;

async function testChatbotAPI() {
  console.log('🤖 Testing Chatbot Gemini API...');
  console.log('=====================================');
  
  try {
    const testMessage = "Hello, are you working? Please respond with a short greeting and confirm you're using Gemini AI.";
    
    const enhancedPrompt = `You are AgrofBot, an expert AI agricultural assistant for the AGROF platform. You help farmers with:

🌱 Crop disease identification and treatment
💊 Agricultural advice and best practices
🌾 Farming techniques and methods
🌿 Pest control and management
📚 General agricultural knowledge
🌤️ Weather-based farming advice
💰 Market insights and pricing
🏪 AGROF store product recommendations

You have access to AGROF's comprehensive agricultural database including:
- 102 fungicide products for disease treatment
- 119 seed varieties for different crops
- 50+ fertilizer products for crop nutrition
- 156 herbicide products for weed control
- 94 organic chemical products

Context: Test connection

User Message: ${testMessage}

Please provide a helpful, accurate, and detailed response. If recommending products, mention they're available in the AGROF store. Use emojis to make your response engaging and easy to read. Keep responses concise but informative.`;

    const payload = {
      contents: [{
        parts: [{
          text: enhancedPrompt
        }]
      }]
    };

    console.log('📤 Sending request to Gemini API...');
    console.log('🔑 API Key:', CHATBOT_API_KEY.substring(0, 10) + '...');
    
    const response = await fetch(CHATBOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('📊 Response Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('📋 Response received:', JSON.stringify(result, null, 2));
    
    if (result.candidates && result.candidates.length > 0) {
      const botResponse = result.candidates[0].content.parts[0].text;
      console.log('✅ Chatbot Response:');
      console.log('==================');
      console.log(botResponse);
      console.log('==================');
      console.log('🎉 Chatbot is successfully using Gemini API!');
    } else {
      console.log('❌ No response from Gemini API');
      console.log('Response structure:', JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error('❌ Chatbot API test failed:', error.message);
    console.log('🔍 Error details:', error);
  }
}

// Run the test
testChatbotAPI();
