/**
 * Hybrid Chatbot Service - AGROF
 * Automatically switches between Gemini API (online) and offline chatbot
 * Provides seamless chat experience regardless of network status
 */

import networkManager from './networkManager';
import offlineChatbotService from './offlineChatbotService';
import ChatbotWrapper from './chatbotService';

class HybridChatbotService {
  constructor() {
    this.wifiOnlyMode = true; // Save data by default
    this.messageCount = 0;
    this.apiCallsToday = 0;
    this.lastApiCallDate = null;
  }

  /**
   * Initialize hybrid chatbot
   */
  async initialize() {
    await networkManager.initialize();
    offlineChatbotService.initialize();
    console.log('🤖 Hybrid Chatbot Service initialized');
  }

  /**
   * Check if should use online API
   */
  shouldUseOnlineAPI() {
    // Always offline for chatbot unless explicitly on WiFi
    // This saves data costs for farmers
    if (!networkManager.isOnline) return false;
    
    // Only use Gemini on WiFi to save data
    if (this.wifiOnlyMode && !networkManager.isWiFi) return false;
    
    return true;
  }

  /**
   * Send message - automatically routes to best available service
   */
  async sendMessage(message, context = {}) {
    await this.initialize();
    
    this.messageCount++;
    const cleanMessage = message.trim();

    if (cleanMessage.length === 0) {
      return {
        success: false,
        message: "Please type a message",
        source: 'system'
      };
    }

    // Determine which service to use
    const useOnline = this.shouldUseOnlineAPI();

    if (useOnline) {
      // Try Gemini API
      try {
        console.log('🌐 Using Gemini AI (online)...');
        
        // Track API usage
        this.trackApiCall();
        
        const response = await ChatbotWrapper.sendMessage(cleanMessage, context);
        
        if (response.success) {
          return {
            ...response,
            source: 'online',
            service: 'gemini',
            confidence: 'very_high'
          };
        } else {
          console.warn('⚠️ Gemini API failed, falling back to offline');
          // Fall through to offline
        }
      } catch (error) {
        console.error('❌ Gemini API error:', error.message);
        // Fall through to offline
      }
    }

    // Use offline chatbot
    console.log('📦 Using offline chatbot...');
    const offlineResponse = await offlineChatbotService.sendMessage(cleanMessage, context);
    
    return {
      ...offlineResponse,
      service: 'offline',
      wifiSuggestion: !networkManager.isWiFi && networkManager.isOnline ? 
        "💡 Connect to WiFi for advanced AI-powered answers" : null
    };
  }

  /**
   * Track API call for usage monitoring
   */
  trackApiCall() {
    const today = new Date().toDateString();
    
    if (this.lastApiCallDate !== today) {
      // New day - reset counter
      this.apiCallsToday = 0;
      this.lastApiCallDate = today;
    }
    
    this.apiCallsToday++;
    console.log(`📊 API calls today: ${this.apiCallsToday}`);
  }

  /**
   * Get popular questions (offline)
   */
  getPopularQuestions(limit = 10) {
    return offlineChatbotService.getPopularQuestions(limit);
  }

  /**
   * Get questions by category (offline)
   */
  getQuestionsByCategory(category) {
    return offlineChatbotService.getQuestionsByCategory(category);
  }

  /**
   * Get questions by crop (offline)
   */
  getQuestionsByCrop(crop) {
    return offlineChatbotService.getQuestionsByCrop(crop);
  }

  /**
   * Get chatbot mode info
   */
  getMode() {
    const canUseOnline = this.shouldUseOnlineAPI();
    
    return {
      mode: canUseOnline ? 'online' : 'offline',
      service: canUseOnline ? 'Gemini AI' : 'Offline Knowledge Base',
      isOnline: networkManager.isOnline,
      isWiFi: networkManager.isWiFi,
      wifiOnlyMode: this.wifiOnlyMode,
      coverage: canUseOnline ? '100%' : '70-80%',
      icon: canUseOnline ? '🌐' : '📦',
      badge: canUseOnline ? '🟢 AI Powered' : '🔴 Offline Mode',
      message: this.getModeMessage()
    };
  }

  /**
   * Get mode-specific message
   */
  getModeMessage() {
    if (networkManager.isWiFi) {
      return 'Connected via WiFi - Full AI capabilities available';
    }
    
    if (networkManager.isOnline && !this.wifiOnlyMode) {
      return 'Using mobile data - AI powered responses';
    }
    
    if (networkManager.isOnline && this.wifiOnlyMode) {
      return 'Offline mode active to save data - Connect to WiFi for AI';
    }
    
    return 'Offline mode - Basic help available (150+ questions)';
  }

  /**
   * Toggle WiFi-only mode
   */
  setWiFiOnlyMode(enabled) {
    this.wifiOnlyMode = enabled;
    console.log(`📶 Chatbot WiFi-only mode: ${enabled ? 'ON' : 'OFF'}`);
  }

  /**
   * Get usage statistics
   */
  getStats() {
    const offlineStats = offlineChatbotService.getStats();
    const mode = this.getMode();

    return {
      totalMessages: this.messageCount,
      apiCallsToday: this.apiCallsToday,
      mode: mode.mode,
      service: mode.service,
      offline: offlineStats,
      network: {
        isOnline: networkManager.isOnline,
        isWiFi: networkManager.isWiFi,
        connectionType: networkManager.connectionType
      }
    };
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    offlineChatbotService.clearHistory();
    console.log('🗑️ Chatbot history cleared');
  }

  /**
   * Get product recommendations based on chat
   */
  async getProductRecommendations(query) {
    return await offlineChatbotService.getProductRecommendations(query);
  }

  /**
   * Check if user should be prompted to use WiFi
   */
  shouldPromptWiFi() {
    // Prompt if:
    // 1. User is online but not on WiFi
    // 2. WiFi-only mode is enabled
    // 3. User has made multiple requests
    return networkManager.isOnline && 
           !networkManager.isWiFi && 
           this.wifiOnlyMode && 
           this.messageCount > 3;
  }

  /**
   * Get WiFi prompt message
   */
  getWiFiPromptMessage() {
    if (this.shouldPromptWiFi()) {
      return {
        show: true,
        title: '💡 Tip: Connect to WiFi',
        message: `You've asked ${this.messageCount} questions using offline mode. Connect to WiFi for:\n\n✅ Advanced AI-powered answers\n✅ Detailed explanations\n✅ Follow-up conversations\n✅ No data charges`,
        actions: [
          { label: 'Use WiFi', action: 'wait_for_wifi' },
          { label: 'Continue Offline', action: 'dismiss' },
          { label: 'Use Mobile Data', action: 'enable_mobile_data' }
        ]
      };
    }

    return {
      show: false
    };
  }
}

// Export singleton instance
export default new HybridChatbotService();



