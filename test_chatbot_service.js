#!/usr/bin/env node

/**
 * Test the ChatbotService directly
 * This will help us verify if the service is working correctly
 */

// Simulate the ChatbotService
const CHATBOT_API_KEY = "AIzaSyDUMB5H8bzSIbaECO2CmVk3hfoNj7zfU60";
const CHATBOT_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${CHATBOT_API_KEY}`;

class ChatbotService {
  constructor() {
    this.apiKey = CHATBOT_API_KEY;
    this.apiUrl = CHATBOT_API_URL;
    this.conversationHistory = [];
  }

  createEnhancedPrompt(message, context) {
    const basePrompt = `You are AgrofBot, an expert AI agricultural assistant for the AGROF platform. You help farmers with:

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

Context: ${context || 'General agricultural inquiry'}

User Message: ${message}

Please provide a helpful, accurate, and detailed response. If recommending products, mention they're available in the AGROF store. Use emojis to make your response engaging and easy to read.`;

    return basePrompt;
  }

  async sendMessage(message, context = '') {
    try {
      console.log('🤖 Sending message to chatbot...');
      console.log('📝 Message:', message);
      console.log('🌍 Context:', context);
      
      // Add to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      });

      // Create enhanced prompt with agricultural context
      const enhancedPrompt = this.createEnhancedPrompt(message, context);
      console.log('📋 Enhanced prompt created');
      
      const payload = {
        contents: [{
          parts: [{
            text: enhancedPrompt
          }]
        }]
      };

      console.log('📤 Sending request to Gemini API...');
      console.log('🔗 URL:', this.apiUrl);
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📋 Raw response:', JSON.stringify(result, null, 2));
      
      if (result.candidates && result.candidates.length > 0) {
        const botResponse = result.candidates[0].content.parts[0].text;
        
        // Add to conversation history
        this.conversationHistory.push({
          role: 'assistant',
          content: botResponse,
          timestamp: new Date()
        });

        console.log('✅ Bot response received:');
        console.log('========================');
        console.log(botResponse);
        console.log('========================');

        return {
          success: true,
          message: botResponse,
          timestamp: new Date(),
          apiUsed: 'Gemini Chatbot API'
        };
      } else {
        throw new Error('No response from chatbot API');
      }

    } catch (error) {
      console.error('❌ Chatbot service error:', error);
      return {
        success: false,
        error: error.message,
        message: 'I apologize, but I\'m having trouble connecting to my AI brain right now. Please try again in a moment.',
        timestamp: new Date()
      };
    }
  }
}

// Test the service
async function testChatbotService() {
  console.log('🧪 Testing ChatbotService...');
  console.log('============================');
  
  const chatbot = new ChatbotService();
  
  // Test with a detailed agricultural question
  const testMessage = "How do I treat maize rust disease? Please give me detailed information about symptoms, treatment, and prevention.";
  
  console.log('📝 Test message:', testMessage);
  console.log('');
  
  const response = await chatbot.sendMessage(testMessage, 'maize farming');
  
  console.log('');
  console.log('📊 Final response:');
  console.log('==================');
  console.log('Success:', response.success);
  console.log('Message:', response.message);
  console.log('API Used:', response.apiUsed);
  console.log('==================');
  
  if (response.success) {
    console.log('🎉 ChatbotService is working with Gemini API!');
  } else {
    console.log('❌ ChatbotService failed:', response.error);
  }
}

// Run the test
testChatbotService();
