/**
 * Recommendation Refinement Service - Batch 4
 * Recommendation refinement based on user feedback and success rates
 */

import userFeedbackService from './userFeedbackService';
import enhancedAccuracyService from './enhancedAccuracyService';

class RecommendationRefinementService {
  constructor() {
    this.refinementRules = new Map();
    this.learningWeights = new Map();
    this.performanceMetrics = new Map();
    this.refinementHistory = [];
    this.initialized = false;
  }

  /**
   * Initialize the recommendation refinement service
   */
  async initialize() {
    try {
      console.log('🔄 Initializing Recommendation Refinement Service...');
      
      // Initialize refinement rules
      this.initializeRefinementRules();
      
      // Initialize learning weights
      this.initializeLearningWeights();
      
      // Initialize performance metrics
      this.initializePerformanceMetrics();
      
      this.initialized = true;
      console.log('✅ Recommendation Refinement Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Recommendation Refinement Service:', error);
    }
  }

  /**
   * Initialize refinement rules
   */
  initializeRefinementRules() {
    this.refinementRules.set('accuracy_improvement', {
      name: 'Accuracy Improvement',
      description: 'Improve recommendation accuracy based on feedback',
      weight: 0.4,
      threshold: 0.7,
      action: 'adjust_accuracy_weights'
    });

    this.refinementRules.set('relevance_improvement', {
      name: 'Relevance Improvement',
      description: 'Improve product relevance based on user preferences',
      weight: 0.3,
      threshold: 0.6,
      action: 'adjust_relevance_weights'
    });

    this.refinementRules.set('market_improvement', {
      name: 'Market Improvement',
      description: 'Improve market scoring based on success rates',
      weight: 0.2,
      threshold: 0.5,
      action: 'adjust_market_weights'
    });

    this.refinementRules.set('confidence_improvement', {
      name: 'Confidence Improvement',
      description: 'Improve confidence scoring based on feedback',
      weight: 0.1,
      threshold: 0.8,
      action: 'adjust_confidence_weights'
    });
  }

  /**
   * Initialize learning weights
   */
  initializeLearningWeights() {
    this.learningWeights.set('user_feedback', {
      weight: 0.4,
      decay_rate: 0.95,
      min_weight: 0.1
    });

    this.learningWeights.set('success_rate', {
      weight: 0.3,
      decay_rate: 0.98,
      min_weight: 0.1
    });

    this.learningWeights.set('historical_data', {
      weight: 0.2,
      decay_rate: 0.99,
      min_weight: 0.1
    });

    this.learningWeights.set('market_data', {
      weight: 0.1,
      decay_rate: 0.97,
      min_weight: 0.1
    });
  }

  /**
   * Initialize performance metrics
   */
  initializePerformanceMetrics() {
    this.performanceMetrics.set('accuracy', {
      current: 0.7,
      target: 0.85,
      trend: 'stable',
      improvement_rate: 0.02
    });

    this.performanceMetrics.set('relevance', {
      current: 0.65,
      target: 0.8,
      trend: 'improving',
      improvement_rate: 0.03
    });

    this.performanceMetrics.set('satisfaction', {
      current: 0.75,
      target: 0.9,
      trend: 'stable',
      improvement_rate: 0.015
    });

    this.performanceMetrics.set('success_rate', {
      current: 0.68,
      target: 0.8,
      trend: 'improving',
      improvement_rate: 0.025
    });
  }

  /**
   * Refine recommendations based on feedback
   * @param {Array} recommendations - Original recommendations
   * @param {string} cropId - Crop ID
   * @param {string} region - Region
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Refined recommendations
   */
  async refineRecommendations(recommendations, cropId, region, userId) {
    try {
      console.log(`🔄 Refining recommendations for ${cropId} in ${region}`);

      // Get user preferences
      const userPreferences = userFeedbackService.getUserPreferences(userId);

      // Get success rate data
      const successRate = userFeedbackService.getSuccessRate(cropId, region);

      // Apply refinement rules
      const refinedRecommendations = recommendations.map(recommendation => {
        return this.applyRefinementRules(recommendation, userPreferences, successRate);
      });

      // Sort by refined score
      refinedRecommendations.sort((a, b) => b.refined_score - a.refined_score);

      // Store refinement history
      this.storeRefinementHistory(cropId, region, userId, refinedRecommendations);

      console.log(`✅ Recommendations refined for ${cropId} in ${region}`);

      return refinedRecommendations;

    } catch (error) {
      console.error('❌ Failed to refine recommendations:', error);
      return recommendations;
    }
  }

  /**
   * Apply refinement rules to a recommendation
   */
  applyRefinementRules(recommendation, userPreferences, successRate) {
    let refinedScore = recommendation.accuracy_score || 0.5;
    const adjustments = [];

    // Apply accuracy improvement rule
    if (successRate.success_rate < 0.7) {
      const accuracyAdjustment = this.calculateAccuracyAdjustment(recommendation, successRate);
      refinedScore += accuracyAdjustment;
      adjustments.push({
        rule: 'accuracy_improvement',
        adjustment: accuracyAdjustment,
        reason: 'Low success rate detected'
      });
    }

    // Apply relevance improvement rule
    const relevanceAdjustment = this.calculateRelevanceAdjustment(recommendation, userPreferences);
    refinedScore += relevanceAdjustment;
    adjustments.push({
      rule: 'relevance_improvement',
      adjustment: relevanceAdjustment,
      reason: 'User preference alignment'
    });

    // Apply market improvement rule
    const marketAdjustment = this.calculateMarketAdjustment(recommendation, successRate);
    refinedScore += marketAdjustment;
    adjustments.push({
      rule: 'market_improvement',
      adjustment: marketAdjustment,
      reason: 'Market performance optimization'
    });

    // Apply confidence improvement rule
    const confidenceAdjustment = this.calculateConfidenceAdjustment(recommendation, successRate);
    refinedScore += confidenceAdjustment;
    adjustments.push({
      rule: 'confidence_improvement',
      adjustment: confidenceAdjustment,
      reason: 'Confidence score optimization'
    });

    // Normalize score
    refinedScore = Math.min(1, Math.max(0, refinedScore));

    return {
      ...recommendation,
      refined_score: refinedScore,
      original_score: recommendation.accuracy_score || 0.5,
      adjustments: adjustments,
      refinement_factors: {
        user_preferences: userPreferences.preferences,
        success_rate: successRate,
        improvement_applied: true
      }
    };
  }

  /**
   * Calculate accuracy adjustment
   */
  calculateAccuracyAdjustment(recommendation, successRate) {
    const rule = this.refinementRules.get('accuracy_improvement');
    const weight = this.learningWeights.get('success_rate').weight;
    
    // Adjust based on success rate
    const adjustment = (0.8 - successRate.success_rate) * rule.weight * weight;
    
    return adjustment;
  }

  /**
   * Calculate relevance adjustment
   */
  calculateRelevanceAdjustment(recommendation, userPreferences) {
    const rule = this.refinementRules.get('relevance_improvement');
    const weight = this.learningWeights.get('user_feedback').weight;
    
    let adjustment = 0;
    const prefs = userPreferences.preferences;

    // Price sensitivity adjustment
    if (recommendation.price && prefs.price_sensitivity) {
      const priceScore = this.calculatePriceScore(recommendation.price, prefs.price_sensitivity);
      adjustment += priceScore * 0.3;
    }

    // Quality preference adjustment
    if (recommendation.quality && prefs.quality_preference) {
      const qualityScore = this.calculateQualityScore(recommendation.quality, prefs.quality_preference);
      adjustment += qualityScore * 0.3;
    }

    // Availability preference adjustment
    if (recommendation.availability && prefs.availability_preference) {
      const availabilityScore = this.calculateAvailabilityScore(recommendation.availability, prefs.availability_preference);
      adjustment += availabilityScore * 0.2;
    }

    // Crop preference adjustment
    if (prefs.crop_preferences[recommendation.crop_id]) {
      const cropScore = prefs.crop_preferences[recommendation.crop_id] / 5;
      adjustment += cropScore * 0.2;
    }

    return adjustment * rule.weight * weight;
  }

  /**
   * Calculate market adjustment
   */
  calculateMarketAdjustment(recommendation, successRate) {
    const rule = this.refinementRules.get('market_improvement');
    const weight = this.learningWeights.get('market_data').weight;
    
    // Adjust based on market performance
    const marketPerformance = successRate.average_rating / 5;
    const adjustment = (marketPerformance - 0.5) * rule.weight * weight;
    
    return adjustment;
  }

  /**
   * Calculate confidence adjustment
   */
  calculateConfidenceAdjustment(recommendation, successRate) {
    const rule = this.refinementRules.get('confidence_improvement');
    const weight = this.learningWeights.get('historical_data').weight;
    
    // Adjust based on confidence and success rate correlation
    const confidence = recommendation.confidence_score || 0.5;
    const successCorrelation = successRate.success_rate;
    
    const adjustment = (confidence - successCorrelation) * rule.weight * weight;
    
    return adjustment;
  }

  /**
   * Calculate price score based on user preference
   */
  calculatePriceScore(productPrice, userPriceSensitivity) {
    // Normalize price sensitivity (0-1 scale)
    const normalizedSensitivity = userPriceSensitivity / 5;
    
    // Calculate price score based on sensitivity
    // Lower sensitivity = higher price tolerance
    const priceScore = 1 - normalizedSensitivity;
    
    return priceScore;
  }

  /**
   * Calculate quality score based on user preference
   */
  calculateQualityScore(productQuality, userQualityPreference) {
    // Normalize quality preference (0-1 scale)
    const normalizedPreference = userQualityPreference / 5;
    
    // Calculate quality score based on preference
    const qualityScore = normalizedPreference;
    
    return qualityScore;
  }

  /**
   * Calculate availability score based on user preference
   */
  calculateAvailabilityScore(productAvailability, userAvailabilityPreference) {
    // Normalize availability preference (0-1 scale)
    const normalizedPreference = userAvailabilityPreference / 5;
    
    // Calculate availability score based on preference
    const availabilityScore = normalizedPreference;
    
    return availabilityScore;
  }

  /**
   * Store refinement history
   */
  storeRefinementHistory(cropId, region, userId, refinedRecommendations) {
    const historyEntry = {
      timestamp: new Date().toISOString(),
      crop_id: cropId,
      region: region,
      user_id: userId,
      original_count: refinedRecommendations.length,
      refined_count: refinedRecommendations.length,
      average_improvement: this.calculateAverageImprovement(refinedRecommendations),
      top_recommendation: refinedRecommendations[0]?.refined_score || 0
    };

    this.refinementHistory.push(historyEntry);

    // Keep only last 100 entries
    if (this.refinementHistory.length > 100) {
      this.refinementHistory.shift();
    }
  }

  /**
   * Calculate average improvement
   */
  calculateAverageImprovement(refinedRecommendations) {
    if (refinedRecommendations.length === 0) return 0;

    const totalImprovement = refinedRecommendations.reduce((sum, rec) => {
      return sum + (rec.refined_score - rec.original_score);
    }, 0);

    return totalImprovement / refinedRecommendations.length;
  }

  /**
   * Update performance metrics
   */
  updatePerformanceMetrics() {
    const feedbackStats = userFeedbackService.getFeedbackStatistics();
    
    // Update accuracy metric
    const accuracyMetric = this.performanceMetrics.get('accuracy');
    accuracyMetric.current = feedbackStats.success_rate;
    accuracyMetric.trend = accuracyMetric.current > accuracyMetric.target ? 'improving' : 'stable';
    this.performanceMetrics.set('accuracy', accuracyMetric);

    // Update satisfaction metric
    const satisfactionMetric = this.performanceMetrics.get('satisfaction');
    satisfactionMetric.current = feedbackStats.average_rating / 5;
    satisfactionMetric.trend = satisfactionMetric.current > satisfactionMetric.target ? 'improving' : 'stable';
    this.performanceMetrics.set('satisfaction', satisfactionMetric);

    // Update success rate metric
    const successRateMetric = this.performanceMetrics.get('success_rate');
    successRateMetric.current = feedbackStats.success_rate;
    successRateMetric.trend = successRateMetric.current > successRateMetric.target ? 'improving' : 'stable';
    this.performanceMetrics.set('success_rate', successRateMetric);
  }

  /**
   * Get refinement insights
   * @returns {Object} Refinement insights
   */
  getRefinementInsights() {
    this.updatePerformanceMetrics();
    
    const insights = [];
    const recommendations = [];

    // Analyze performance metrics
    this.performanceMetrics.forEach((metric, key) => {
      if (metric.current < metric.target) {
        insights.push({
          type: 'improvement_needed',
          metric: key,
          current: metric.current,
          target: metric.target,
          gap: metric.target - metric.current,
          priority: 'high'
        });

        recommendations.push({
          action: `improve_${key}`,
          description: `Improve ${key} from ${metric.current.toFixed(2)} to ${metric.target.toFixed(2)}`,
          priority: 'high'
        });
      } else {
        insights.push({
          type: 'target_met',
          metric: key,
          current: metric.current,
          target: metric.target,
          gap: 0,
          priority: 'low'
        });
      }
    });

    // Analyze refinement history
    if (this.refinementHistory.length > 0) {
      const recentHistory = this.refinementHistory.slice(-10);
      const averageImprovement = recentHistory.reduce((sum, entry) => sum + entry.average_improvement, 0) / recentHistory.length;
      
      if (averageImprovement > 0.1) {
        insights.push({
          type: 'positive_trend',
          message: 'Refinement system is showing positive improvements',
          improvement: averageImprovement,
          priority: 'medium'
        });
      }
    }

    return {
      insights: insights,
      recommendations: recommendations,
      performance_metrics: Object.fromEntries(this.performanceMetrics),
      refinement_history: this.refinementHistory.slice(-10)
    };
  }

  /**
   * Get refinement statistics
   * @returns {Object} Refinement statistics
   */
  getRefinementStatistics() {
    const totalRefinements = this.refinementHistory.length;
    const averageImprovement = totalRefinements > 0 ? 
      this.refinementHistory.reduce((sum, entry) => sum + entry.average_improvement, 0) / totalRefinements : 0;

    return {
      total_refinements: totalRefinements,
      average_improvement: averageImprovement,
      performance_metrics: Object.fromEntries(this.performanceMetrics),
      refinement_rules: Object.fromEntries(this.refinementRules),
      learning_weights: Object.fromEntries(this.learningWeights)
    };
  }

  /**
   * Reset refinement system
   */
  resetRefinementSystem() {
    this.refinementHistory = [];
    this.initializePerformanceMetrics();
    console.log('🔄 Refinement system reset');
  }
}

export default new RecommendationRefinementService();











