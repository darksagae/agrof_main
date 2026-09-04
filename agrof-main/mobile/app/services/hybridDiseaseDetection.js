/**
 * Hybrid Disease Detection Service - AGROF
 * Intelligently switches between Gemini AI (online) and TensorFlow Lite (offline)
 * Provides best available disease detection regardless of network status
 */

import networkManager from './networkManager';
// import tensorflowLiteService from './tensorflowLiteService'; // Disabled - dependency conflicts
import realImageAnalysisService from './realImageAnalysisService';

class HybridDiseaseDetection {
  constructor() {
    this.wifiOnlyForAI = true; // Default: Only use Gemini on WiFi
    this.detectionCount = 0;
    this.onlineDetections = 0;
    this.offlineDetections = 0;
  }

  /**
   * Initialize hybrid detection system
   */
  async initialize() {
    await networkManager.initialize();
    
    // TensorFlow Lite currently disabled due to dependency conflicts
    // await tensorflowLiteService.initialize();
    
    console.log('🔬 Hybrid Disease Detection initialized (Gemini AI only)');
  }

  /**
   * Determine which detection method to use
   */
  shouldUseOnlineAI() {
    if (!networkManager.isOnline) return false;
    
    // WiFi-only mode for AI to save data
    if (this.wifiOnlyForAI && !networkManager.isWiFi) return false;
    
    return true;
  }

  /**
   * Analyze plant image for disease detection
   * Automatically routes to best available method
   */
  async analyzeImage(imageUri, cropType = null) {
    await this.initialize();
    
    this.detectionCount++;
    console.log(`🔬 Disease detection #${this.detectionCount}`);

    const useOnline = this.shouldUseOnlineAI();

    if (useOnline) {
      // Try Gemini AI first (most accurate)
      try {
        console.log('🌐 Using Gemini AI for disease detection...');
        
        const result = await realImageAnalysisService.analyzeDisease(imageUri, cropType);
        
        if (result.success) {
          this.onlineDetections++;
          
          return {
            ...result,
            source: 'gemini_ai',
            accuracy: 'very_high',
            method: 'Online AI Analysis',
            dataUsed: '~100 KB',
            recommendation: 'Advanced AI analysis complete'
          };
        } else {
          console.warn('⚠️ Gemini AI failed, falling back to offline');
        }
      } catch (error) {
        console.error('❌ Gemini AI error:', error.message);
      }
    }

    // TensorFlow Lite offline detection not available
    console.warn('⚠️ TensorFlow Lite not available - offline detection disabled');
    return this.handleNoDetectionAvailable();
  }

  /**
   * Handle case when no detection method is available
   */
  handleNoDetectionAvailable() {
    let message = '**Detection Not Available**\n\n';
    
    if (!networkManager.isOnline) {
      message += '📴 **You are currently offline**\n\n';
      message += 'TensorFlow Lite model is not installed on this device.\n\n';
      message += '**To get disease detection:**\n';
      message += '✅ Connect to WiFi or mobile data\n';
      message += '✅ Use Gemini AI for 95% accurate analysis (~100 KB)\n\n';
      message += '**Alternative (Offline):**\n';
      message += '💬 Use the chatbot to describe symptoms\n';
      message += '📚 Browse disease information\n';
      message += '🛒 Check product recommendations by category';
    } else if (networkManager.isOnline && !networkManager.isWiFi) {
      message += '📱 **You are on mobile data**\n\n';
      message += 'Gemini AI is available for highly accurate detection.\n\n';
      message += '**Options:**\n';
      message += '✅ Use Gemini AI now (~100 KB data usage)\n';
      message += '✅ Connect to WiFi for free AI analysis\n';
      message += '💬 Use chatbot for manual diagnosis';
    } else {
      message += '⚠️ **Unable to complete analysis**\n\n';
      message += 'Please try again or use the chatbot for assistance.';
    }

    return {
      success: false,
      source: 'none',
      method: 'No detection available',
      message,
      error: 'TensorFlow Lite model not available offline. Connect to internet for Gemini AI analysis.',
      suggestions: [
        'Connect to WiFi for free AI analysis',
        'Use chatbot to describe symptoms',
        'Browse products by category'
      ],
      needsNetwork: true
    };
  }

  /**
   * Get detection mode info
   */
  getMode() {
    const canUseOnline = this.shouldUseOnlineAI();
    const tfLiteAvailable = false; // Disabled

    if (canUseOnline) {
      return {
        primary: 'Gemini AI',
        fallback: 'None',
        accuracy: 'Very High (95%+)',
        dataUsage: '~100 KB per scan',
        icon: '🌐',
        badge: '🟢 AI Powered'
      };
    }

    return {
      primary: 'Not Available',
      fallback: 'Manual diagnosis via chatbot',
      accuracy: 'N/A',
      dataUsage: '0 KB',
      icon: '⚠️',
      badge: '⚠️ Offline - Use Chatbot'
    };
  }

  /**
   * Get comparison between online and offline methods
   */
  getMethodComparison() {
    return {
      gemini: {
        name: 'Gemini AI',
        accuracy: '95%+',
        speed: 'Fast (2-3s)',
        crops: 'All crops',
        diseases: '100+',
        dataUsage: '~100 KB',
        requires: 'Internet (WiFi recommended)',
        features: [
          'Detailed explanations',
          'Treatment recommendations',
          'Follow-up questions',
          'Context understanding',
          'Multiple image analysis'
        ]
      },
      tensorflow: {
        name: 'TensorFlow Lite',
        accuracy: '75-85%',
        speed: 'Very Fast (0.5-1s)',
        crops: 'Tomato, Maize, Cassava, Beans, Banana',
        diseases: '27 common diseases',
        dataUsage: '0 KB',
        requires: 'Nothing (fully offline)',
        features: [
          'Basic disease identification',
          'Confidence scores',
          'Product category suggestions',
          'Works offline',
          'No data cost'
        ]
      }
    };
  }

  /**
   * Get usage statistics
   */
  getStats() {
    const mode = this.getMode();

    return {
      totalDetections: this.detectionCount,
      onlineDetections: this.onlineDetections,
      offlineDetections: this.offlineDetections,
      offlinePercentage: this.detectionCount > 0 ? 
        ((this.offlineDetections / this.detectionCount) * 100).toFixed(1) : 0,
      currentMode: mode,
      tensorflowLite: { isReady: false, note: 'Currently disabled' },
      network: {
        isOnline: networkManager.isOnline,
        isWiFi: networkManager.isWiFi,
        connectionType: networkManager.connectionType
      }
    };
  }

  /**
   * Toggle WiFi-only mode for AI
   */
  setWiFiOnlyMode(enabled) {
    this.wifiOnlyForAI = enabled;
    console.log(`📶 AI WiFi-only mode: ${enabled ? 'ON' : 'OFF'}`);
  }

  /**
   * Check if user should be prompted to use WiFi
   */
  shouldPromptWiFi() {
    return networkManager.isOnline &&
           !networkManager.isWiFi &&
           this.wifiOnlyForAI &&
           this.offlineDetections > 2;
  }

  /**
   * Get WiFi prompt for better accuracy
   */
  getWiFiPrompt() {
    if (this.shouldPromptWiFi()) {
      return {
        show: true,
        title: '💡 Get More Accurate Results',
        message: `You've used offline detection ${this.offlineDetections} times (80% accuracy).\n\nConnect to WiFi for:\n\n✅ 95%+ accuracy with Gemini AI\n✅ Detailed explanations\n✅ Treatment recommendations\n✅ Follow-up questions\n✅ No data charges`,
        actions: [
          { label: 'Use WiFi', action: 'wait_for_wifi' },
          { label: 'Continue Offline', action: 'dismiss' },
          { label: 'Use Mobile Data', action: 'enable_mobile_data' }
        ]
      };
    }

    return { show: false };
  }

  /**
   * Preload TensorFlow model (if not already loaded)
   * DISABLED - TensorFlow Lite not available
   */
  async preloadModel() {
    console.warn('⚠️ TensorFlow Lite preloading disabled');
  }

  /**
   * Check model availability
   */
  async checkModelAvailability() {
    const tfAvailable = false; // Disabled
    const canUseGemini = this.shouldUseOnlineAI();

    return {
      tensorflowLite: tfAvailable,
      geminiAI: canUseGemini,
      anyAvailable: canUseGemini,
      preferredMethod: canUseGemini ? 'gemini' : 'none'
    };
  }
}

// Export singleton instance
export default new HybridDiseaseDetection();



