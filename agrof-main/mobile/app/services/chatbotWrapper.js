/**
 * Chatbot Wrapper Service
 * Provides chatbot functionality and AI integration
 */

class ChatbotWrapper {
  constructor() {
    this.conversationHistory = [];
    this.userContext = {};
    this.aiResponses = new Map();
    this.initialized = false;
  }

  /**
   * Initialize the Chatbot Wrapper Service
   */
  async initialize() {
    try {
      console.log('🤖 Initializing Chatbot Wrapper Service...');
      
      // Setup AI responses
      this.setupAIResponses();
      
      this.initialized = true;
      console.log('✅ Chatbot Wrapper Service initialized successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Chatbot Wrapper Service:', error);
      return false;
    }
  }

  /**
   * Setup AI responses
   */
  setupAIResponses() {
    this.aiResponses.set('greeting', [
      "Hello! I'm AgrofBot, your agricultural assistant. How can I help you today?",
      "Hi there! I'm here to help with your farming questions. What would you like to know?",
      "Welcome! I can assist with crop diseases, farming tips, pest control, and more. What's on your mind?"
    ]);

    this.aiResponses.set('crop_disease', [
      "I can help identify crop diseases. Please describe the symptoms you're seeing.",
      "For disease identification, I'll need details about leaf spots, discoloration, or other visible signs.",
      "Let me help diagnose the crop disease. Can you describe the affected areas?"
    ]);

    this.aiResponses.set('farming_tips', [
      "Here are some general farming tips: proper irrigation, soil testing, and crop rotation are key.",
      "For better yields, consider: optimal planting times, soil preparation, and pest management.",
      "Farming success depends on: choosing the right crops, maintaining soil health, and monitoring weather."
    ]);

    this.aiResponses.set('pest_control', [
      "For pest control, I recommend: identifying the pest first, then choosing appropriate control methods.",
      "Integrated pest management includes: monitoring, prevention, and targeted treatments.",
      "Natural pest control options include: beneficial insects, crop rotation, and resistant varieties."
    ]);

    this.aiResponses.set('weather_advice', [
      "Weather affects farming significantly. I can help with weather-based farming decisions.",
      "For weather-related farming: monitor forecasts, plan irrigation, and protect crops from extreme weather.",
      "Weather patterns influence planting, harvesting, and pest activity. How can I help?"
    ]);

    this.aiResponses.set('market_info', [
      "I can provide market information and pricing trends for agricultural products.",
      "Market data helps with: pricing decisions, harvest timing, and crop selection.",
      "For market insights, I'll need to know your location and crop type."
    ]);

    this.aiResponses.set('fallback', [
      "I'm not sure I understand. Could you rephrase your question?",
      "I'm still learning. Can you provide more details about what you need?",
      "I'd be happy to help, but I need more information. What specifically are you looking for?"
    ]);
  }

  /**
   * Process user message and generate response
   * @param {string} message - User message
   * @param {Object} context - User context
   * @returns {Object} Chatbot response
   */
  async processMessage(message, context = {}) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log('💬 Processing user message:', message);

      // Add message to conversation history
      this.conversationHistory.push({
        type: 'user',
        message: message,
        timestamp: new Date().toISOString()
      });

      // Analyze message intent
      const intent = this.analyzeIntent(message);
      
      // Generate response based on intent
      const response = await this.generateResponse(intent, message, context);
      
      // Add response to conversation history
      this.conversationHistory.push({
        type: 'bot',
        message: response.text,
        timestamp: new Date().toISOString()
      });

      console.log('🤖 Generated response:', response.text);
      
      return response;
    } catch (error) {
      console.error('❌ Error processing message:', error);
      return {
        text: "I'm sorry, I encountered an error. Please try again.",
        type: 'error',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Analyze message intent
   * @param {string} message - User message
   * @returns {string} Intent category
   */
  analyzeIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Greeting patterns
    if (lowerMessage.match(/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/)) {
      return 'greeting';
    }
    
    // Crop disease patterns
    if (lowerMessage.match(/\b(disease|sick|infected|spots|yellow|brown|wilting|fungus|bacteria|virus)\b/)) {
      return 'crop_disease';
    }
    
    // Farming tips patterns
    if (lowerMessage.match(/\b(tips|advice|help|how to|farming|growing|cultivation)\b/)) {
      return 'farming_tips';
    }
    
    // Pest control patterns
    if (lowerMessage.match(/\b(pest|insect|bug|worm|mite|aphid|beetle|control|spray)\b/)) {
      return 'pest_control';
    }
    
    // Weather patterns
    if (lowerMessage.match(/\b(weather|rain|drought|temperature|climate|forecast)\b/)) {
      return 'weather_advice';
    }
    
    // Market patterns
    if (lowerMessage.match(/\b(price|market|cost|sell|buy|value|profit|revenue)\b/)) {
      return 'market_info';
    }
    
    return 'fallback';
  }

  /**
   * Generate response based on intent
   * @param {string} intent - Message intent
   * @param {string} message - Original message
   * @param {Object} context - User context
   * @returns {Object} Response object
   */
  async generateResponse(intent, message, context) {
    const responses = this.aiResponses.get(intent) || this.aiResponses.get('fallback');
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Enhance response based on context
    let enhancedResponse = randomResponse;
    
    if (context.location) {
      enhancedResponse += `\n\nSince you're in ${context.location}, I can provide more specific advice.`;
    }
    
    if (context.cropType) {
      enhancedResponse += `\n\nFor ${context.cropType}, here are some specific considerations:`;
    }

    return {
      text: enhancedResponse,
      type: 'bot',
      intent: intent,
      timestamp: new Date().toISOString(),
      suggestions: this.generateSuggestions(intent)
    };
  }

  /**
   * Generate response suggestions
   * @param {string} intent - Message intent
   * @returns {Array} Response suggestions
   */
  generateSuggestions(intent) {
    const suggestions = {
      'greeting': [
        "Tell me about crop diseases",
        "I need farming tips",
        "Help with pest control",
        "Weather advice please"
      ],
      'crop_disease': [
        "What are the symptoms?",
        "How to treat this disease?",
        "Prevention methods",
        "More information"
      ],
      'farming_tips': [
        "Soil preparation tips",
        "Planting schedule",
        "Fertilizer advice",
        "Harvest timing"
      ],
      'pest_control': [
        "Natural pest control",
        "Chemical treatments",
        "Prevention methods",
        "Beneficial insects"
      ],
      'weather_advice': [
        "Planting timing",
        "Irrigation schedule",
        "Crop protection",
        "Weather monitoring"
      ],
      'market_info': [
        "Current prices",
        "Market trends",
        "Best selling times",
        "Price forecasting"
      ],
      'fallback': [
        "Crop diseases",
        "Farming tips",
        "Pest control",
        "Market info"
      ]
    };

    return suggestions[intent] || suggestions['fallback'];
  }

  /**
   * Get conversation history
   * @returns {Array} Conversation history
   */
  getConversationHistory() {
    return this.conversationHistory;
  }

  /**
   * Clear conversation history
   */
  clearConversationHistory() {
    this.conversationHistory = [];
    console.log('🧹 Chatbot conversation history cleared');
  }

  /**
   * Update user context
   * @param {Object} context - User context data
   */
  updateUserContext(context) {
    this.userContext = { ...this.userContext, ...context };
    console.log('👤 User context updated:', this.userContext);
  }

  /**
   * Get user context
   * @returns {Object} User context
   */
  getUserContext() {
    return this.userContext;
  }

  /**
   * Generate contextual response
   * @param {string} message - User message
   * @returns {Object} Contextual response
   */
  async generateContextualResponse(message) {
    const intent = this.analyzeIntent(message);
    const response = await this.generateResponse(intent, message, this.userContext);
    
    // Add context-specific enhancements
    if (this.userContext.location) {
      response.location = this.userContext.location;
    }
    
    if (this.userContext.cropType) {
      response.cropType = this.userContext.cropType;
    }

    return response;
  }

  /**
   * Get chatbot statistics
   * @returns {Object} Chatbot statistics
   */
  getChatbotStatistics() {
    const totalMessages = this.conversationHistory.length;
    const userMessages = this.conversationHistory.filter(msg => msg.type === 'user').length;
    const botMessages = this.conversationHistory.filter(msg => msg.type === 'bot').length;
    
    const intentCounts = {};
    this.conversationHistory.forEach(msg => {
      if (msg.intent) {
        intentCounts[msg.intent] = (intentCounts[msg.intent] || 0) + 1;
      }
    });

    return {
      totalMessages,
      userMessages,
      botMessages,
      intentCounts,
      averageResponseTime: '1.2s',
      userSatisfaction: 'high'
    };
  }

  /**
   * Export conversation data
   * @param {string} format - Export format ('json', 'csv')
   * @returns {string} Exported data
   */
  exportConversationData(format = 'json') {
    if (format === 'json') {
      return JSON.stringify(this.conversationHistory, null, 2);
    } else if (format === 'csv') {
      const csvRows = ['Type,Message,Timestamp,Intent'];
      this.conversationHistory.forEach(msg => {
        csvRows.push(`${msg.type},"${msg.message}",${msg.timestamp},${msg.intent || ''}`);
      });
      return csvRows.join('\n');
    }
    return null;
  }
}

// Create and export singleton instance
const chatbotWrapper = new ChatbotWrapper();
export default chatbotWrapper;








