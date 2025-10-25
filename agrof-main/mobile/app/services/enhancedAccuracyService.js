/**
 * Enhanced Accuracy Service - Batch 1
 * Foundation accuracy systems for dynamic recommendation accuracy
 */

class EnhancedAccuracyService {
  constructor() {
    this.confidenceThresholds = {
      high: 0.8,
      medium: 0.6,
      low: 0.4
    };
    
    this.relevanceWeights = {
      disease_match: 0.4,
      symptom_match: 0.3,
      category_match: 0.2,
      treatment_match: 0.1
    };
    
    this.marketWeights = {
      price_competitiveness: 0.3,
      availability: 0.25,
      supplier_rating: 0.25,
      delivery_time: 0.2
    };
    
    this.accuracyHistory = [];
  }

  /**
   * Calculate confidence score for AI recommendations
   * @param {Object} aiResult - AI analysis result
   * @param {Array} symptoms - Detected symptoms
   * @param {string} cropType - Type of crop
   * @returns {Object} Confidence score and level
   */
  calculateConfidenceScore(aiResult, symptoms = [], cropType = '') {
    try {
      let confidenceScore = 0;
      
      // Base confidence from AI result
      if (aiResult.confidence) {
        confidenceScore += aiResult.confidence * 0.4;
      }
      
      // Symptom match confidence
      if (symptoms.length > 0 && aiResult.symptoms) {
        const symptomMatches = symptoms.filter(symptom => 
          aiResult.symptoms.some(aiSymptom => 
            aiSymptom.toLowerCase().includes(symptom.toLowerCase()) ||
            symptom.toLowerCase().includes(aiSymptom.toLowerCase())
          )
        ).length;
        
        const symptomConfidence = symptomMatches / symptoms.length;
        confidenceScore += symptomConfidence * 0.3;
      }
      
      // Crop type match confidence
      if (cropType && aiResult.crop_type) {
        if (cropType.toLowerCase() === aiResult.crop_type.toLowerCase()) {
          confidenceScore += 0.2;
        }
      }
      
      // Disease specificity confidence
      if (aiResult.disease_type && aiResult.disease_type !== 'Unknown') {
        confidenceScore += 0.1;
      }
      
      // Normalize to 0-1 range
      confidenceScore = Math.min(1, Math.max(0, confidenceScore));
      
      // Determine confidence level
      let confidenceLevel = 'low';
      if (confidenceScore >= this.confidenceThresholds.high) {
        confidenceLevel = 'high';
      } else if (confidenceScore >= this.confidenceThresholds.medium) {
        confidenceLevel = 'medium';
      }
      
      return {
        score: confidenceScore,
        level: confidenceLevel,
        factors: {
          ai_confidence: aiResult.confidence || 0,
          symptom_matches: symptoms.length > 0 ? symptomMatches / symptoms.length : 0,
          crop_match: cropType && aiResult.crop_type ? 
            (cropType.toLowerCase() === aiResult.crop_type.toLowerCase() ? 1 : 0) : 0,
          disease_specificity: aiResult.disease_type && aiResult.disease_type !== 'Unknown' ? 1 : 0
        }
      };
      
    } catch (error) {
      console.error('❌ Confidence score calculation failed:', error);
      return {
        score: 0.5,
        level: 'medium',
        factors: {}
      };
    }
  }

  /**
   * Calculate relevance score for product recommendations
   * @param {Object} product - Product data
   * @param {Object} aiCommand - AI command with disease/symptom data
   * @returns {Object} Relevance score and breakdown
   */
  calculateRelevanceScore(product, aiCommand) {
    try {
      let relevanceScore = 0;
      const factors = {};
      
      const productText = `${product.name} ${product.description || ''} ${product.category_name || ''}`.toLowerCase();
      
      // Disease match (40% weight)
      if (aiCommand.disease_type && aiCommand.disease_type !== 'Unknown') {
        const diseaseMatch = this.calculateTextMatch(productText, aiCommand.disease_type.toLowerCase());
        factors.disease_match = diseaseMatch;
        relevanceScore += diseaseMatch * this.relevanceWeights.disease_match;
      }
      
      // Symptom match (30% weight)
      if (aiCommand.symptoms && aiCommand.symptoms.length > 0) {
        let symptomMatches = 0;
        aiCommand.symptoms.forEach(symptom => {
          if (this.calculateTextMatch(productText, symptom.toLowerCase()) > 0.5) {
            symptomMatches++;
          }
        });
        factors.symptom_match = symptomMatches / aiCommand.symptoms.length;
        relevanceScore += factors.symptom_match * this.relevanceWeights.symptom_match;
      }
      
      // Category match (20% weight)
      if (aiCommand.categories && aiCommand.categories.length > 0) {
        const categoryMatch = aiCommand.categories.some(category => 
          product.category_name && product.category_name.toLowerCase().includes(category.toLowerCase())
        );
        factors.category_match = categoryMatch ? 1 : 0;
        relevanceScore += factors.category_match * this.relevanceWeights.category_match;
      }
      
      // Treatment match (10% weight)
      const treatmentKeywords = [
        'fungicide', 'herbicide', 'pesticide', 'bactericide', 'insecticide',
        'treatment', 'control', 'prevent', 'cure', 'organic', 'natural'
      ];
      
      let treatmentMatches = 0;
      treatmentKeywords.forEach(keyword => {
        if (productText.includes(keyword)) {
          treatmentMatches++;
        }
      });
      
      factors.treatment_match = Math.min(treatmentMatches / treatmentKeywords.length, 1);
      relevanceScore += factors.treatment_match * this.relevanceWeights.treatment_match;
      
      // Normalize to 0-1 range
      relevanceScore = Math.min(1, Math.max(0, relevanceScore));
      
      return {
        score: relevanceScore,
        factors: factors,
        level: this.getScoreLevel(relevanceScore)
      };
      
    } catch (error) {
      console.error('❌ Relevance score calculation failed:', error);
      return {
        score: 0.5,
        factors: {},
        level: 'medium'
      };
    }
  }

  /**
   * Calculate market service score for products
   * @param {Object} product - Product data
   * @param {Object} marketData - Market data
   * @returns {Object} Market score and breakdown
   */
  calculateMarketScore(product, marketData = {}) {
    try {
      let marketScore = 0;
      const factors = {};
      
      // Price competitiveness (30% weight)
      if (marketData.avg_price && product.price) {
        const priceRatio = marketData.avg_price / product.price;
        factors.price_competitiveness = Math.min(priceRatio, 1);
        marketScore += factors.price_competitiveness * this.marketWeights.price_competitiveness;
      }
      
      // Availability (25% weight)
      if (product.stock_quantity !== undefined) {
        factors.availability = product.stock_quantity > 0 ? 1 : 0;
        marketScore += factors.availability * this.marketWeights.availability;
      }
      
      // Supplier rating (25% weight)
      if (product.supplier_rating) {
        factors.supplier_rating = product.supplier_rating / 5; // Normalize to 0-1
        marketScore += factors.supplier_rating * this.marketWeights.supplier_rating;
      }
      
      // Delivery time (20% weight)
      if (product.delivery_time) {
        // Lower delivery time = higher score
        const maxDeliveryTime = 7; // 7 days max
        factors.delivery_time = Math.max(0, (maxDeliveryTime - product.delivery_time) / maxDeliveryTime);
        marketScore += factors.delivery_time * this.marketWeights.delivery_time;
      }
      
      // Normalize to 0-1 range
      marketScore = Math.min(1, Math.max(0, marketScore));
      
      return {
        score: marketScore,
        factors: factors,
        level: this.getScoreLevel(marketScore)
      };
      
    } catch (error) {
      console.error('❌ Market score calculation failed:', error);
      return {
        score: 0.5,
        factors: {},
        level: 'medium'
      };
    }
  }

  /**
   * Calculate comprehensive accuracy score
   * @param {Object} product - Product data
   * @param {Object} aiCommand - AI command
   * @param {Object} marketData - Market data
   * @param {Object} confidenceData - Confidence data
   * @returns {Object} Comprehensive accuracy score
   */
  calculateComprehensiveAccuracy(product, aiCommand, marketData, confidenceData) {
    try {
      const relevanceScore = this.calculateRelevanceScore(product, aiCommand);
      const marketScore = this.calculateMarketScore(product, marketData);
      
      // Weighted combination
      const accuracyScore = (
        relevanceScore.score * 0.5 +
        marketScore.score * 0.3 +
        confidenceData.score * 0.2
      );
      
      const accuracyLevel = this.getScoreLevel(accuracyScore);
      
      // Store in history for tracking
      this.accuracyHistory.push({
        timestamp: new Date().toISOString(),
        product_id: product.id,
        accuracy_score: accuracyScore,
        relevance_score: relevanceScore.score,
        market_score: marketScore.score,
        confidence_score: confidenceData.score,
        level: accuracyLevel
      });
      
      return {
        accuracy_score: accuracyScore,
        accuracy_level: accuracyLevel,
        relevance: relevanceScore,
        market: marketScore,
        confidence: confidenceData,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Comprehensive accuracy calculation failed:', error);
      return {
        accuracy_score: 0.5,
        accuracy_level: 'medium',
        relevance: { score: 0.5, factors: {} },
        market: { score: 0.5, factors: {} },
        confidence: { score: 0.5, factors: {} },
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get accuracy statistics
   * @returns {Object} Accuracy statistics
   */
  getAccuracyStatistics() {
    if (this.accuracyHistory.length === 0) {
      return {
        total_recommendations: 0,
        average_accuracy: 0,
        high_accuracy_percentage: 0,
        medium_accuracy_percentage: 0,
        low_accuracy_percentage: 0
      };
    }
    
    const total = this.accuracyHistory.length;
    const averageAccuracy = this.accuracyHistory.reduce((sum, record) => sum + record.accuracy_score, 0) / total;
    
    const highAccuracy = this.accuracyHistory.filter(record => record.level === 'high').length;
    const mediumAccuracy = this.accuracyHistory.filter(record => record.level === 'medium').length;
    const lowAccuracy = this.accuracyHistory.filter(record => record.level === 'low').length;
    
    return {
      total_recommendations: total,
      average_accuracy: averageAccuracy,
      high_accuracy_percentage: (highAccuracy / total) * 100,
      medium_accuracy_percentage: (mediumAccuracy / total) * 100,
      low_accuracy_percentage: (lowAccuracy / total) * 100
    };
  }

  /**
   * Helper method to calculate text match
   * @param {string} text - Text to search in
   * @param {string} term - Term to search for
   * @returns {number} Match score (0-1)
   */
  calculateTextMatch(text, term) {
    if (!text || !term) return 0;
    
    const textLower = text.toLowerCase();
    const termLower = term.toLowerCase();
    
    // Exact match
    if (textLower.includes(termLower)) {
      return 1;
    }
    
    // Partial match
    const words = termLower.split(' ');
    let matches = 0;
    words.forEach(word => {
      if (textLower.includes(word)) {
        matches++;
      }
    });
    
    return matches / words.length;
  }

  /**
   * Helper method to get score level
   * @param {number} score - Score (0-1)
   * @returns {string} Level (high/medium/low)
   */
  getScoreLevel(score) {
    if (score >= this.confidenceThresholds.high) {
      return 'high';
    } else if (score >= this.confidenceThresholds.medium) {
      return 'medium';
    } else {
      return 'low';
    }
  }
}

export default new EnhancedAccuracyService();