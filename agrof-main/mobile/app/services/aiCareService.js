/**
 * AI Care Service - Comprehensive Agricultural AI Assistant
 * Integrates Gemini AI, disease detection, crop monitoring, and treatment recommendations
 */

import { AI_API_URL, STORE_BASE_URL } from '../config/apiConfig';
import enhancedHybridAIService from './enhancedHybridAIService';
import aiCommandService from './aiCommandService';
import networkDiagnosticService from './networkDiagnosticService';
import NetInfo from '@react-native-community/netinfo';

class AICareService {
  constructor() {
    this.apiUrl = AI_API_URL;
    this.storeUrl = STORE_BASE_URL;
    this.isInitialized = false;
    this.analysisHistory = [];
    this.careRecommendations = [];
  }

  /**
   * Initialize AI Care Service
   */
  async initialize() {
    try {
      console.log('🤖 Initializing AI Care Service...');
      
      // Initialize hybrid AI service
      await enhancedHybridAIService.initialize();
      
      this.isInitialized = true;
      console.log('✅ AI Care Service initialized successfully');
      
      return {
        success: true,
        message: 'AI Care Service ready',
        capabilities: [
          'Disease Detection',
          'Crop Health Analysis', 
          'Treatment Recommendations',
          'Prevention Strategies',
          'Economic Impact Assessment'
        ]
      };
    } catch (error) {
      console.error('❌ AI Care Service initialization failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Comprehensive Plant Health Analysis
   * @param {string} imageUri - Image URI to analyze
   * @param {Object} context - Additional context (crop type, location, etc.)
   * @returns {Promise<Object>} Complete health analysis
   */
  async analyzePlantHealth(imageUri, context = {}) {
    try {
      console.log('🔍 Starting comprehensive plant health analysis...');
      
      // Check network status
      const networkState = await NetInfo.fetch();
      const isOnline = networkState.isConnected && networkState.isInternetReachable;
      
      console.log('🌐 Network status:', isOnline ? 'ONLINE' : 'OFFLINE');
      
      if (!isOnline) {
        // Run network diagnostics to provide better error information
        const diagnostics = await networkDiagnosticService.runDiagnostics();
        const errorMessage = diagnostics.recommendations.length > 0 
          ? diagnostics.recommendations[0].description 
          : 'No internet connection. Please check your network and try again.';
        throw new Error(errorMessage);
      }
      
      // Use hybrid AI service for analysis
      const analysisResult = await enhancedHybridAIService.analyzeDisease(imageUri);
      
      // Store analysis in history
      this.analysisHistory.push({
        ...analysisResult,
        context,
        timestamp: new Date().toISOString(),
        networkStatus: isOnline ? 'online' : 'offline'
      });
      
      // Generate AI command for product recommendations
      const aiCommand = await this.generateAICommand(analysisResult, context);
      
      // Get treatment products if command is successful
      let treatmentProducts = [];
      if (aiCommand.success) {
        const productResult = await aiCommandService.processAICommand(aiCommand.ai_command);
        if (productResult.success) {
          treatmentProducts = productResult.products;
        }
      }
      
      // Generate comprehensive care recommendations
      const careRecommendations = await this.generateCareRecommendations(analysisResult, context);
      
      // Calculate economic impact
      const economicImpact = this.calculateEconomicImpact(analysisResult, context);
      
      return {
        success: true,
        analysis: analysisResult,
        aiCommand,
        treatmentProducts,
        careRecommendations,
        economicImpact,
        networkStatus: isOnline ? 'online' : 'offline',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Plant health analysis failed:', error);
      return {
        success: false,
        error: error.message,
        analysis: null,
        treatmentProducts: [],
        careRecommendations: []
      };
    }
  }

  /**
   * Generate AI Command for product recommendations
   */
  async generateAICommand(analysisResult, context) {
    try {
      const diseaseType = analysisResult.disease_type || 'Unknown';
      const symptoms = analysisResult.symptoms || [];
      const cropType = analysisResult.crop_type || context.cropType || 'Unknown';
      
      // Create AI command based on analysis
      const aiCommand = {
        action: 'fetch_products',
        disease_type: diseaseType,
        symptoms: symptoms,
        crop_type: cropType,
        categories: this.getCategoriesForDisease(diseaseType),
        products: this.getProductsForDisease(diseaseType),
        treatment_priority: this.getTreatmentPriority(analysisResult.severity_level),
        search_strategy: 'disease_specific',
        confidence: analysisResult.confidence || 0.8,
        effectiveness: 0.85
      };
      
      return {
        success: true,
        ai_command: aiCommand
      };
      
    } catch (error) {
      console.error('❌ AI command generation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate comprehensive care recommendations
   */
  async generateCareRecommendations(analysisResult, context) {
    const recommendations = [];
    
    // Immediate treatment recommendations
    if (analysisResult.disease_type && analysisResult.disease_type !== 'none') {
      recommendations.push({
        type: 'immediate_treatment',
        priority: 'high',
        title: 'Immediate Treatment Required',
        description: `Treat ${analysisResult.disease_type} with appropriate fungicide/pesticide`,
        steps: analysisResult.recommendations || []
      });
    }
    
    // Prevention strategies
    if (analysisResult.prevention && analysisResult.prevention.length > 0) {
      recommendations.push({
        type: 'prevention',
        priority: 'medium',
        title: 'Prevention Strategies',
        description: 'Implement preventive measures to avoid future outbreaks',
        steps: analysisResult.prevention
      });
    }
    
    // Monitoring recommendations
    recommendations.push({
      type: 'monitoring',
      priority: 'medium',
      title: 'Regular Monitoring',
      description: 'Monitor plant health regularly for early detection',
      steps: [
        'Check plants weekly for signs of disease',
        'Monitor weather conditions',
        'Maintain proper plant spacing',
        'Ensure good air circulation'
      ]
    });
    
    // Soil and nutrition recommendations
    recommendations.push({
      type: 'nutrition',
      priority: 'low',
      title: 'Soil Health & Nutrition',
      description: 'Maintain optimal soil conditions for plant health',
      steps: [
        'Test soil pH and nutrients',
        'Apply balanced fertilizer',
        'Improve soil drainage if needed',
        'Add organic matter regularly'
      ]
    });
    
    return recommendations;
  }

  /**
   * Calculate economic impact of disease
   */
  calculateEconomicImpact(analysisResult, context) {
    const severity = analysisResult.severity_level || 'low';
    const diseaseType = analysisResult.disease_type || 'Unknown';
    
    let yieldLossPercentage = 0;
    let economicLoss = 0;
    
    switch (severity) {
      case 'critical':
        yieldLossPercentage = 60;
        economicLoss = 1000; // USD per hectare
        break;
      case 'high':
        yieldLossPercentage = 40;
        economicLoss = 600;
        break;
      case 'medium':
        yieldLossPercentage = 20;
        economicLoss = 300;
        break;
      case 'low':
        yieldLossPercentage = 5;
        economicLoss = 100;
        break;
      default:
        yieldLossPercentage = 0;
        economicLoss = 0;
    }
    
    return {
      severity,
      yieldLossPercentage,
      economicLoss,
      diseaseType,
      recommendations: [
        `Potential yield loss: ${yieldLossPercentage}%`,
        `Estimated economic loss: $${economicLoss}/hectare`,
        'Early treatment can reduce losses by 70-80%',
        'Implement integrated pest management'
      ]
    };
  }

  /**
   * Get categories for specific disease
   */
  getCategoriesForDisease(diseaseType) {
    const categoryMap = {
      'rust': ['fungicides', 'organic_chemicals'],
      'blight': ['fungicides', 'organic_chemicals'],
      'mildew': ['fungicides', 'organic_chemicals'],
      'anthracnose': ['fungicides', 'organic_chemicals'],
      'bacterial spot': ['bactericides', 'organic_chemicals'],
      'wilt': ['fungicides', 'organic_chemicals'],
      'mosaic': ['organic_chemicals', 'fertilizers'],
      'yellowing': ['fertilizers', 'organic_chemicals']
    };
    
    return categoryMap[diseaseType.toLowerCase()] || ['organic_chemicals', 'fertilizers'];
  }

  /**
   * Get specific products for disease
   */
  getProductsForDisease(diseaseType) {
    const productMap = {
      'rust': ['Copper fungicide', 'Sulfur fungicide', 'Neem oil'],
      'blight': ['Copper fungicide', 'Chlorothalonil', 'Mancozeb'],
      'mildew': ['Sulfur fungicide', 'Potassium bicarbonate', 'Neem oil'],
      'anthracnose': ['Copper fungicide', 'Chlorothalonil', 'Azoxystrobin'],
      'bacterial spot': ['Copper fungicide', 'Bacillus subtilis', 'Neem oil'],
      'wilt': ['Trichoderma', 'Bacillus subtilis', 'Compost tea'],
      'mosaic': ['Balanced fertilizer', 'Micronutrients', 'Compost'],
      'yellowing': ['Nitrogen fertilizer', 'Iron chelate', 'Compost']
    };
    
    return productMap[diseaseType.toLowerCase()] || ['Organic fertilizer', 'Compost', 'Neem oil'];
  }

  /**
   * Get treatment priority based on severity
   */
  getTreatmentPriority(severity) {
    const priorityMap = {
      'critical': 1,
      'high': 2,
      'medium': 3,
      'low': 4
    };
    
    return priorityMap[severity] || 3;
  }

  /**
   * Get analysis history
   */
  getAnalysisHistory() {
    return this.analysisHistory;
  }

  /**
   * Get care recommendations
   */
  getCareRecommendations() {
    return this.careRecommendations;
  }

  /**
   * Clear analysis history
   */
  clearHistory() {
    this.analysisHistory = [];
    this.careRecommendations = [];
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hybridAIStatus: enhancedHybridAIService.getStatus(),
      analysisCount: this.analysisHistory.length,
      capabilities: [
        'Disease Detection',
        'Crop Health Analysis',
        'Treatment Recommendations', 
        'Prevention Strategies',
        'Economic Impact Assessment',
        'Product Recommendations'
      ]
    };
  }
}

// Export singleton instance
export default new AICareService();
