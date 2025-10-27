/**
 * Simple AI Service for Disease Detection
 * Direct Gemini API integration - no backend required
 */

import { analyzeImageWithProperMethod } from './properImageAnalysisService';

class HybridAIService {
  constructor() {
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log('🚀 Simple AI Service initialized');
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ AI initialization failed:', error);
      return false;
    }
  }

  async analyzeDisease(imageUri) {
    try {
      console.log('🔍 Analyzing disease with Gemini AI...');
      console.log('📸 Image URI:', imageUri);
      
      // Use the simple direct Gemini API
      const result = await analyzeImageWithProperMethod(imageUri);
      
      console.log('✅ Gemini analysis complete');
      console.log('📊 Result:', result);
      
      return {
        ...result,
        analysisMethod: 'gemini_direct',
        timestamp: new Date().toISOString(),
        source: 'Gemini AI (Direct)'
      };
    } catch (error) {
      console.error('❌ Gemini analysis failed:', error);
      console.error('📋 Error details:', error.message);
      
      // Return a user-friendly error instead of crashing
      return {
        success: false,
        analysis: {
          crop_type: 'unknown',
          plant_family: 'unknown',
          growth_stage: 'unknown',
          health_status: 'unknown',
          disease_type: 'Analysis Failed',
          severity_level: 'unknown',
          symptoms: ['Unable to analyze image at this time'],
          affected_parts: ['unknown'],
          recommendations: [
            'Please check your internet connection',
            'Try taking a clearer photo',
            'Make sure the plant is well-lit'
          ],
          prevention: ['Regular monitoring recommended'],
          confidence: 0.0
        },
        error: error.message,
        analysisMethod: 'error',
        timestamp: new Date().toISOString()
      };
    }
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      ready: this.isInitialized
    };
  }

  dispose() {
    console.log('🧹 Simple AI Service cleaned up');
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