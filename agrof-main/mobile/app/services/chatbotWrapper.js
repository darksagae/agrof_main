/**
 * ChatbotService Wrapper for React Native
 * This wrapper ensures proper import/export compatibility
 */

import ChatbotService from './chatbotService.js';

// Create a wrapper that ensures the service is properly accessible
const ChatbotWrapper = {
  // Direct access to the service instance
  get service() {
    return ChatbotService;
  },
  
  // Wrapper methods
  async sendMessage(message, context) {
    console.log('🔄 ChatbotWrapper: Calling sendMessage...');
    console.log('📋 Service available:', !!ChatbotService);
    console.log('📋 Service type:', typeof ChatbotService);
    
    if (!ChatbotService) {
      throw new Error('ChatbotService not available');
    }
    
    if (typeof ChatbotService.sendMessage !== 'function') {
      console.error('❌ sendMessage is not a function:', typeof ChatbotService.sendMessage);
      throw new Error('sendMessage method not available');
    }
    
    return await ChatbotService.sendMessage(message, context);
  },
  
  async testConnection() {
    if (!ChatbotService) {
      throw new Error('ChatbotService not available');
    }
    
    if (typeof ChatbotService.testConnection !== 'function') {
      throw new Error('testConnection method not available');
    }
    
    return await ChatbotService.testConnection();
  }
};

export default ChatbotWrapper;
