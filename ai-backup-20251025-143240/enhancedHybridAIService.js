/**
 * Enhanced Hybrid AI Service - Smart TFLite + Gemini Fallback
 * 
 * Priority System:
 * 1. Try TFLite first (fast, offline, works for 5 crops)
 * 2. If confidence >= 0.75 → Use TFLite + Metadata enrichment
 * 3. If confidence < 0.75 → Fallback to Gemini AI (online, accurate)
 * 4. If offline + low confidence → Show helpful error message
 */

import agrofTFLiteService from './agrofTFLiteService';
import { analyzeImageWithProperMethod } from './properImageAnalysisService';
import NetInfo from '@react-native-community/netinfo';
import { enrichTFLiteResult } from '../data/diseaseMetadata';

// Confidence threshold for TFLite
const TFLITE_CONFIDENCE_THRESHOLD = 0.75;

// Supported crops in TFLite model
const SUPPORTED_CROPS = ['Beans', 'Coffee', 'Tomato', 'Potato', 'Pepper'];

class EnhancedHybridAIService {
  constructor() {
    this.isInitialized = false;
    this.tfliteReady = false;
    this.lastAnalysisMethod = null;
  }

  /**
   * Initialize the service
   */
  async initialize() {
    try {
      console.log('🚀 Initializing Enhanced Hybrid AI Service...');
      
      // Try to initialize TFLite model
      try {
        await agrofTFLiteService.initialize();
        this.tfliteReady = agrofTFLiteService.isReady();
        console.log('✅ TFLite model ready:', this.tfliteReady);
      } catch (error) {
        console.log('⚠️  TFLite not available, will use Gemini only');
        this.tfliteReady = false;
      }
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ Hybrid AI initialization failed:', error);
      return false;
    }
  }

  /**
   * Main analysis method - tries TFLite first, falls back to Gemini
   * 
   * @param {string} imageUri - URI of the image to analyze
   * @returns {Promise<object>} - Analysis result
   */
  async analyzeDisease(imageUri) {
    try {
      console.log('🔍 Starting Enhanced Hybrid Analysis...');
      console.log('📸 Image URI:', imageUri);
      
      // Check network status
      const networkState = await NetInfo.fetch();
      const isOnline = networkState.isConnected && networkState.isInternetReachable;
      console.log('🌐 Network status:', isOnline ? 'ONLINE' : 'OFFLINE');

      // STEP 1: Try TFLite first (if available)
      if (this.tfliteReady) {
        console.log('⚡ Attempting TFLite analysis...');
        
        try {
          const tfliteResult = await agrofTFLiteService.analyze(imageUri);
          console.log('📊 TFLite result:', {
            className: tfliteResult.className,
            confidence: tfliteResult.confidence
          });
          
          // Check if confidence is high enough
          if (tfliteResult.confidence >= TFLITE_CONFIDENCE_THRESHOLD) {
            console.log('✅ High confidence! Using TFLite + Metadata enrichment');
            this.lastAnalysisMethod = 'tflite';
            
            // Enrich with metadata
            const enrichedResult = enrichTFLiteResult(
              tfliteResult.className,
              tfliteResult.confidence
            );
            
            return {
              ...enrichedResult,
              analysisMethod: 'tensorflow_lite',
              source: 'TensorFlow Lite (Offline)',
              timestamp: new Date().toISOString()
            };
          } else {
            console.log(`⚠️  Low confidence: ${(tfliteResult.confidence * 100).toFixed(1)}%`);
            console.log('🔄 Will try Gemini AI for better accuracy...');
          }
        } catch (tfliteError) {
          console.log('⚠️  TFLite analysis failed:', tfliteError.message);
        }
      } else {
        console.log('⚠️  TFLite not ready, skipping to Gemini');
      }

      // STEP 2: Fallback to Gemini AI (if online)
      if (isOnline) {
        console.log('🌐 Using Gemini AI for analysis...');
        
        try {
          const geminiResult = await this.analyzeWithGemini(imageUri);
          console.log('✅ Gemini analysis complete');
          this.lastAnalysisMethod = 'gemini';
          
          return {
            ...geminiResult,
            analysisMethod: 'gemini',
            source: 'Gemini AI (Online)',
            timestamp: new Date().toISOString()
          };
        } catch (geminiError) {
          console.log('⚠️  Gemini AI failed:', geminiError.message);
          
          // If Gemini fails but we have a TFLite result, use it anyway with warning
          if (this.tfliteReady) {
            try {
              const fallbackResult = await agrofTFLiteService.analyze(imageUri);
              const enrichedFallback = enrichTFLiteResult(
                fallbackResult.className,
                fallbackResult.confidence
              );
              
              return {
                ...enrichedFallback,
                warning: `Analysis completed offline with ${(fallbackResult.confidence * 100).toFixed(1)}% confidence. For better accuracy, try again with internet connection.`,
                analysisMethod: 'tensorflow_lite_fallback',
                source: 'TensorFlow Lite (Offline Fallback)'
              };
            } catch (fallbackError) {
              console.error('❌ Fallback also failed:', fallbackError);
            }
          }
        }
      }

      // STEP 3: Both failed or offline with low confidence
      this.lastAnalysisMethod = 'failed';
      
      return {
        crop_type: 'Unable to Analyze',
        plant_family: 'Unknown',
        growth_stage: 'unknown',
        health_status: 'unknown',
        disease_type: 'Unable to Analyze',
        severity_level: 'unknown',
        confidence: 0,
        symptoms: [],
        affected_parts: [],
        recommendations: this.getErrorRecommendations(isOnline),
        prevention: [],
        analysisMethod: 'failed',
        source: 'Error',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Enhanced Hybrid Analysis failed:', error);
      this.lastAnalysisMethod = 'error';
      
      return {
        crop_type: 'Analysis Error',
        plant_family: 'Unknown',
        growth_stage: 'unknown',
        health_status: 'unknown',
        disease_type: 'Analysis Error',
        severity_level: 'unknown',
        confidence: 0,
        symptoms: [],
        affected_parts: [],
        recommendations: [
          'An error occurred during analysis',
          'Please try again with a clearer photo',
          'Ensure the plant leaf is clearly visible',
          'Try retaking the photo in better lighting'
        ],
        prevention: [],
        error: error.message,
        analysisMethod: 'error',
        source: 'Error',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Analyze with Gemini AI
   */
  async analyzeWithGemini(imageUri) {
    console.log('🤖 Calling Gemini AI...');
    const result = await analyzeImageWithProperMethod(imageUri);
    
    // Ensure result has all required fields
    return {
      crop_type: result.crop_type || 'Unknown',
      plant_family: result.plant_family || 'Unknown',
      growth_stage: result.growth_stage || 'unknown',
      health_status: result.health_status || 'unknown',
      disease_type: result.disease_type || 'Unknown',
      severity_level: result.severity_level || 'unknown',
      symptoms: result.symptoms || [],
      affected_parts: result.affected_parts || [],
      recommendations: result.recommendations || [],
      prevention: result.prevention || [],
      confidence: result.confidence || 0.0
    };
  }

  /**
   * Get error recommendations based on network status
   */
  getErrorRecommendations(isOnline) {
    if (isOnline) {
      return [
        'Unable to analyze this image. Please try:',
        '• Retake photo in better lighting',
        '• Ensure plant is clearly visible',
        '• Take photo closer to the leaves',
        '• Make sure leaves are in focus',
        '• Try again in a moment'
      ];
    } else {
      return [
        'You are offline and image quality is not sufficient for offline analysis.',
        'Please try one of the following:',
        '• Connect to internet for more accurate analysis',
        '• Retake photo in better lighting',
        '• Ensure leaves are clearly visible and in focus',
        '• Take photo closer to affected plant parts'
      ];
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      tfliteReady: this.tfliteReady,
      mode: this.tfliteReady ? 'hybrid' : 'gemini_only',
      lastAnalysisMethod: this.lastAnalysisMethod,
      supportedCrops: SUPPORTED_CROPS,
      confidenceThreshold: TFLITE_CONFIDENCE_THRESHOLD
    };
  }

  /**
   * Check if crop is supported by TFLite
   */
  isCropSupported(cropName) {
    return SUPPORTED_CROPS.some(crop => 
      cropName.toLowerCase().includes(crop.toLowerCase())
    );
  }

  /**
   * Get confidence threshold
   */
  getConfidenceThreshold() {
    return TFLITE_CONFIDENCE_THRESHOLD;
  }

  /**
   * Cleanup resources
   */
  dispose() {
    if (this.tfliteReady) {
      try {
        agrofTFLiteService.dispose();
      } catch (error) {
        console.log('⚠️  Error disposing TFLite:', error);
      }
    }
    console.log('🧹 Enhanced Hybrid AI Service cleaned up');
  }
}

// Create singleton instance
const enhancedHybridAIService = new EnhancedHybridAIService();

// Auto-initialize
enhancedHybridAIService.initialize().catch(error => {
  console.error('❌ Auto-initialization failed:', error);
});

export default enhancedHybridAIService;
export { 
  EnhancedHybridAIService, 
  TFLITE_CONFIDENCE_THRESHOLD,
  SUPPORTED_CROPS 
};

