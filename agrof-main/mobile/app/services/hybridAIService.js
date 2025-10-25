/**
 * Hybrid AI Service for Disease Detection
 * Combines Online (Gemini AI) and Offline (TensorFlow Lite) Analysis
 * Automatically switches based on network availability
 */

import NetInfo from '@react-native-community/netinfo';
import { analyzeImageWithProperMethod } from './properImageAnalysisService';
import tensorflowLiteService from './tensorflowLiteService';

class HybridAIService {
  constructor() {
    this.isInitialized = false;
    this.isOnline = true; // Assume online initially
    this.networkListener = null;
    this.preferOffline = false; // Force offline mode for testing
  }

  async initialize() {
    try {
      console.log('🚀 Initializing Hybrid AI Service...');
      
      // Initialize TensorFlow Lite for offline capability
      await tensorflowLiteService.initialize();
      console.log('✅ TensorFlow Lite initialized');
      
      // Set up network listener
      this.networkListener = NetInfo.addEventListener(state => {
        this.isOnline = state.isConnected && state.isInternetReachable;
        console.log(`📡 Network status: ${this.isOnline ? 'ONLINE' : 'OFFLINE'}`);
      });
      
      // Check initial network state
      const netState = await NetInfo.fetch();
      this.isOnline = netState.isConnected && netState.isInternetReachable;
      
      console.log('✅ Hybrid AI Service initialized');
      console.log(`📡 Initial network status: ${this.isOnline ? 'ONLINE' : 'OFFLINE'}`);
      this.isInitialized = true;
      
      return true;
    } catch (error) {
      console.error('❌ Hybrid AI initialization failed:', error);
      // Even if initialization partially fails, mark as initialized
      // so the service can still attempt to work
      this.isInitialized = true;
      return false;
    }
  }

  /**
   * Analyze disease using hybrid AI approach
   * Tries Gemini AI first, falls back to TensorFlow Lite if offline
   */
  async analyzeDisease(imageUri) {
    try {
      console.log('🔍 Starting Hybrid AI Analysis...');
      console.log('📸 Image URI:', imageUri);
      console.log(`📡 Network: ${this.isOnline ? 'ONLINE' : 'OFFLINE'}`);
      console.log(`⚙️ Mode: ${this.preferOffline ? 'FORCE OFFLINE' : 'AUTO'}`);
      
      // ALWAYS try TensorFlow Lite for EAS Expo builds (more reliable)
      console.log('🤖 Using TensorFlow Lite (offline mode) - default for EAS builds');
      return await this.analyzeWithTensorFlowLite(imageUri);
      
      // Original hybrid logic (commented out but available)
      /*
      // Try online (Gemini) first if network available and not forcing offline
      if (this.isOnline && !this.preferOffline) {
        try {
          console.log('🌐 Attempting Gemini AI analysis...');
          const result = await this.analyzeWithGemini(imageUri);
          return result;
        } catch (error) {
          console.warn('⚠️ Gemini AI failed, falling back to TensorFlow Lite');
          console.warn('📋 Error:', error.message);
          // Fall through to offline analysis
        }
      }
      
      // Use offline (TensorFlow Lite)
      console.log('🤖 Using TensorFlow Lite (offline mode)');
      return await this.analyzeWithTensorFlowLite(imageUri);
      */
    } catch (error) {
      console.error('❌ Hybrid AI analysis failed:', error);
      
      // Return user-friendly error
      return {
        disease_type: 'Analysis Failed',
        crop_type: 'Unknown',
        health_status: 'unknown',
        severity_level: 'unknown',
        confidence: 0,
        recommendations: [
          'Unable to analyze image at this time',
          'Try taking a clearer photo',
          'Make sure the plant is well-lit',
          'Ensure the disease symptoms are visible'
        ],
        error: error.message,
        analysisMethod: 'error',
        timestamp: new Date().toISOString(),
        source: 'Error'
      };
    }
  }

  /**
   * Analyze with Gemini AI (online)
   */
  async analyzeWithGemini(imageUri) {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Gemini API timeout (20s)')), 20000)
    );
    
    const analysisPromise = analyzeImageWithProperMethod(imageUri);
    const result = await Promise.race([analysisPromise, timeoutPromise]);
    
    console.log('✅ Gemini analysis complete');
    
    return {
      ...result,
      analysisMethod: 'gemini',
      timestamp: new Date().toISOString(),
      source: 'Gemini AI (Online)'
    };
  }

  /**
   * Analyze with TensorFlow Lite (offline)
   */
  async analyzeWithTensorFlowLite(imageUri) {
    const result = await tensorflowLiteService.analyzeDisease(imageUri, 'plantvillage');
    
    console.log('✅ TensorFlow Lite analysis complete');
    
    return {
      ...result,
      analysisMethod: 'tensorflow',
      timestamp: new Date().toISOString(),
      source: 'TensorFlow Lite (Offline)'
    };
  }

  /**
   * Set offline mode preference
   */
  setOfflineMode(preferOffline) {
    this.preferOffline = preferOffline;
    console.log(`⚙️ Offline mode ${preferOffline ? 'ENABLED' : 'DISABLED'}`);
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isOnline: this.isOnline,
      preferOffline: this.preferOffline,
      ready: this.isInitialized,
      mode: this.preferOffline ? 'offline' : (this.isOnline ? 'online' : 'offline')
    };
  }

  /**
   * Cleanup
   */
  dispose() {
    if (this.networkListener) {
      this.networkListener();
    }
    tensorflowLiteService.dispose();
    console.log('🧹 Hybrid AI Service cleaned up');
  }
}

// Create singleton instance
const hybridAIService = new HybridAIService();

// Auto-initialize
hybridAIService.initialize().catch(error => {
  console.error('❌ Auto-initialization failed:', error);
});

export default hybridAIService;
export { HybridAIService };

