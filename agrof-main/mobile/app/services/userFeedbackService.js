/**
 * User Feedback Service - Batch 4
 * User feedback collection and recommendation refinement system
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

class UserFeedbackService {
  constructor() {
    this.feedbackData = new Map();
    this.successRateData = new Map();
    this.userPreferences = new Map();
    this.recommendationHistory = new Map();
    this.feedbackCategories = {
      accuracy: 'How accurate was the recommendation?',
      relevance: 'How relevant was the product to your needs?',
      price: 'How satisfied are you with the pricing?',
      availability: 'Was the product available when needed?',
      quality: 'How would you rate the product quality?',
      delivery: 'How satisfied are you with delivery?',
      overall: 'Overall satisfaction with the recommendation'
    };
    this.initialized = false;
  }

  /**
   * Initialize the user feedback service
   */
  async initialize() {
    try {
      console.log('🔄 Initializing User Feedback Service...');
      
      // Load existing feedback data
      await this.loadFeedbackData();
      
      // Load user preferences
      await this.loadUserPreferences();
      
      // Load success rate data
      await this.loadSuccessRateData();
      
      this.initialized = true;
      console.log('✅ User Feedback Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize User Feedback Service:', error);
    }
  }

  /**
   * Load feedback data from storage
   */
  async loadFeedbackData() {
    try {
      const stored = await AsyncStorage.getItem('user_feedback_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.feedbackData = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('❌ Failed to load feedback data:', error);
    }
  }

  /**
   * Load user preferences from storage
   */
  async loadUserPreferences() {
    try {
      const stored = await AsyncStorage.getItem('user_preferences');
      if (stored) {
        const data = JSON.parse(stored);
        this.userPreferences = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('❌ Failed to load user preferences:', error);
    }
  }

  /**
   * Load success rate data from storage
   */
  async loadSuccessRateData() {
    try {
      const stored = await AsyncStorage.getItem('success_rate_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.successRateData = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('❌ Failed to load success rate data:', error);
    }
  }

  /**
   * Save feedback data to storage
   */
  async saveFeedbackData() {
    try {
      const data = Object.fromEntries(this.feedbackData);
      await AsyncStorage.setItem('user_feedback_data', JSON.stringify(data));
    } catch (error) {
      console.error('❌ Failed to save feedback data:', error);
    }
  }

  /**
   * Save user preferences to storage
   */
  async saveUserPreferences() {
    try {
      const data = Object.fromEntries(this.userPreferences);
      await AsyncStorage.setItem('user_preferences', JSON.stringify(data));
    } catch (error) {
      console.error('❌ Failed to save user preferences:', error);
    }
  }

  /**
   * Save success rate data to storage
   */
  async saveSuccessRateData() {
    try {
      const data = Object.fromEntries(this.successRateData);
      await AsyncStorage.setItem('success_rate_data', JSON.stringify(data));
    } catch (error) {
      console.error('❌ Failed to save success rate data:', error);
    }
  }

  /**
   * Submit user feedback for a recommendation
   * @param {string} recommendationId - Recommendation ID
   * @param {Object} feedback - Feedback data
   * @returns {Promise<Object>} Feedback submission result
   */
  async submitFeedback(recommendationId, feedback) {
    try {
      const feedbackEntry = {
        id: recommendationId,
        timestamp: new Date().toISOString(),
        feedback: feedback,
        user_id: feedback.user_id || 'anonymous',
        crop_id: feedback.crop_id,
        region: feedback.region,
        recommendation_type: feedback.recommendation_type || 'product'
      };

      // Store feedback
      this.feedbackData.set(recommendationId, feedbackEntry);

      // Update success rate data
      await this.updateSuccessRateData(recommendationId, feedback);

      // Update user preferences
      await this.updateUserPreferences(feedback);

      // Save data
      await this.saveFeedbackData();
      await this.saveSuccessRateData();
      await this.saveUserPreferences();

      console.log(`✅ Feedback submitted for recommendation ${recommendationId}`);

      return {
        success: true,
        feedback_id: recommendationId,
        message: 'Feedback submitted successfully'
      };

    } catch (error) {
      console.error('❌ Failed to submit feedback:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update success rate data based on feedback
   */
  async updateSuccessRateData(recommendationId, feedback) {
    try {
      const cropId = feedback.crop_id;
      const region = feedback.region;
      const key = `${cropId}_${region}`;

      if (!this.successRateData.has(key)) {
        this.successRateData.set(key, {
          crop_id: cropId,
          region: region,
          total_recommendations: 0,
          successful_recommendations: 0,
          failed_recommendations: 0,
          average_rating: 0,
          feedback_count: 0
        });
      }

      const data = this.successRateData.get(key);
      data.total_recommendations++;
      data.feedback_count++;

      // Calculate success based on overall satisfaction
      const overallRating = feedback.overall || 0;
      if (overallRating >= 4) {
        data.successful_recommendations++;
      } else {
        data.failed_recommendations++;
      }

      // Update average rating
      data.average_rating = ((data.average_rating * (data.feedback_count - 1)) + overallRating) / data.feedback_count;

      this.successRateData.set(key, data);

    } catch (error) {
      console.error('❌ Failed to update success rate data:', error);
    }
  }

  /**
   * Update user preferences based on feedback
   */
  async updateUserPreferences(feedback) {
    try {
      const userId = feedback.user_id || 'anonymous';
      
      if (!this.userPreferences.has(userId)) {
        this.userPreferences.set(userId, {
          user_id: userId,
          preferences: {
            price_sensitivity: 0.5,
            quality_preference: 0.5,
            availability_preference: 0.5,
            delivery_preference: 0.5,
            crop_preferences: {},
            region_preferences: {}
          },
          feedback_count: 0
        });
      }

      const userData = this.userPreferences.get(userId);
      userData.feedback_count++;

      // Update preferences based on feedback
      const prefs = userData.preferences;

      if (feedback.price !== undefined) {
        prefs.price_sensitivity = (prefs.price_sensitivity + feedback.price) / 2;
      }

      if (feedback.quality !== undefined) {
        prefs.quality_preference = (prefs.quality_preference + feedback.quality) / 2;
      }

      if (feedback.availability !== undefined) {
        prefs.availability_preference = (prefs.availability_preference + feedback.availability) / 2;
      }

      if (feedback.delivery !== undefined) {
        prefs.delivery_preference = (prefs.delivery_preference + feedback.delivery) / 2;
      }

      // Update crop preferences
      if (feedback.crop_id) {
        if (!prefs.crop_preferences[feedback.crop_id]) {
          prefs.crop_preferences[feedback.crop_id] = 0;
        }
        prefs.crop_preferences[feedback.crop_id] = 
          (prefs.crop_preferences[feedback.crop_id] + (feedback.overall || 0)) / 2;
      }

      // Update region preferences
      if (feedback.region) {
        if (!prefs.region_preferences[feedback.region]) {
          prefs.region_preferences[feedback.region] = 0;
        }
        prefs.region_preferences[feedback.region] = 
          (prefs.region_preferences[feedback.region] + (feedback.overall || 0)) / 2;
      }

      this.userPreferences.set(userId, userData);

    } catch (error) {
      console.error('❌ Failed to update user preferences:', error);
    }
  }

  /**
   * Get success rate for a crop and region
   * @param {string} cropId - Crop ID
   * @param {string} region - Region
   * @returns {Object} Success rate data
   */
  getSuccessRate(cropId, region) {
    const key = `${cropId}_${region}`;
    const data = this.successRateData.get(key);

    if (!data) {
      return {
        crop_id: cropId,
        region: region,
        success_rate: 0.5,
        total_recommendations: 0,
        successful_recommendations: 0,
        failed_recommendations: 0,
        average_rating: 0,
        confidence: 'low'
      };
    }

    const successRate = data.total_recommendations > 0 ? 
      data.successful_recommendations / data.total_recommendations : 0.5;

    let confidence = 'low';
    if (data.total_recommendations >= 10) confidence = 'high';
    else if (data.total_recommendations >= 5) confidence = 'medium';

    return {
      crop_id: cropId,
      region: region,
      success_rate: successRate,
      total_recommendations: data.total_recommendations,
      successful_recommendations: data.successful_recommendations,
      failed_recommendations: data.failed_recommendations,
      average_rating: data.average_rating,
      confidence: confidence
    };
  }

  /**
   * Get user preferences
   * @param {string} userId - User ID
   * @returns {Object} User preferences
   */
  getUserPreferences(userId) {
    const data = this.userPreferences.get(userId || 'anonymous');
    
    if (!data) {
      return {
        user_id: userId || 'anonymous',
        preferences: {
          price_sensitivity: 0.5,
          quality_preference: 0.5,
          availability_preference: 0.5,
          delivery_preference: 0.5,
          crop_preferences: {},
          region_preferences: {}
        },
        feedback_count: 0
      };
    }

    return data;
  }

  /**
   * Get feedback statistics
   * @returns {Object} Feedback statistics
   */
  getFeedbackStatistics() {
    const totalFeedback = this.feedbackData.size;
    let totalRating = 0;
    let ratingCount = 0;
    let successfulRecommendations = 0;

    this.feedbackData.forEach(entry => {
      if (entry.feedback.overall !== undefined) {
        totalRating += entry.feedback.overall;
        ratingCount++;
        if (entry.feedback.overall >= 4) {
          successfulRecommendations++;
        }
      }
    });

    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
    const successRate = totalFeedback > 0 ? successfulRecommendations / totalFeedback : 0;

    return {
      total_feedback: totalFeedback,
      average_rating: averageRating,
      success_rate: successRate,
      successful_recommendations: successfulRecommendations,
      failed_recommendations: totalFeedback - successfulRecommendations,
      rating_distribution: this.getRatingDistribution()
    };
  }

  /**
   * Get rating distribution
   */
  getRatingDistribution() {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    this.feedbackData.forEach(entry => {
      const rating = entry.feedback.overall;
      if (rating >= 1 && rating <= 5) {
        distribution[Math.round(rating)]++;
      }
    });

    return distribution;
  }

  /**
   * Get feedback for a specific recommendation
   * @param {string} recommendationId - Recommendation ID
   * @returns {Object} Feedback data
   */
  getFeedback(recommendationId) {
    return this.feedbackData.get(recommendationId) || null;
  }

  /**
   * Get all feedback data
   * @returns {Array} All feedback entries
   */
  getAllFeedback() {
    return Array.from(this.feedbackData.values());
  }

  /**
   * Get feedback by user
   * @param {string} userId - User ID
   * @returns {Array} User feedback entries
   */
  getFeedbackByUser(userId) {
    return Array.from(this.feedbackData.values())
      .filter(entry => entry.user_id === userId);
  }

  /**
   * Get feedback by crop
   * @param {string} cropId - Crop ID
   * @returns {Array} Crop feedback entries
   */
  getFeedbackByCrop(cropId) {
    return Array.from(this.feedbackData.values())
      .filter(entry => entry.crop_id === cropId);
  }

  /**
   * Get feedback by region
   * @param {string} region - Region
   * @returns {Array} Region feedback entries
   */
  getFeedbackByRegion(region) {
    return Array.from(this.feedbackData.values())
      .filter(entry => entry.region === region);
  }

  /**
   * Generate feedback insights
   * @returns {Object} Feedback insights
   */
  generateFeedbackInsights() {
    const stats = this.getFeedbackStatistics();
    const insights = [];

    // Success rate insights
    if (stats.success_rate >= 0.8) {
      insights.push({
        type: 'success',
        message: 'High success rate indicates good recommendation quality',
        priority: 'high'
      });
    } else if (stats.success_rate < 0.6) {
      insights.push({
        type: 'warning',
        message: 'Low success rate - consider improving recommendation algorithm',
        priority: 'high'
      });
    }

    // Rating insights
    if (stats.average_rating >= 4) {
      insights.push({
        type: 'positive',
        message: 'High average rating shows user satisfaction',
        priority: 'medium'
      });
    } else if (stats.average_rating < 3) {
      insights.push({
        type: 'negative',
        message: 'Low average rating - user satisfaction needs improvement',
        priority: 'high'
      });
    }

    // Feedback volume insights
    if (stats.total_feedback < 10) {
      insights.push({
        type: 'info',
        message: 'Low feedback volume - encourage more user feedback',
        priority: 'medium'
      });
    }

    return {
      statistics: stats,
      insights: insights,
      recommendations: this.generateRecommendations(stats, insights)
    };
  }

  /**
   * Generate recommendations based on feedback
   */
  generateRecommendations(stats, insights) {
    const recommendations = [];

    if (stats.success_rate < 0.6) {
      recommendations.push({
        action: 'improve_algorithm',
        description: 'Improve recommendation algorithm accuracy',
        priority: 'high'
      });
    }

    if (stats.average_rating < 3) {
      recommendations.push({
        action: 'enhance_quality',
        description: 'Focus on improving recommendation quality',
        priority: 'high'
      });
    }

    if (stats.total_feedback < 10) {
      recommendations.push({
        action: 'encourage_feedback',
        description: 'Implement feedback collection incentives',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  /**
   * Clear all feedback data
   */
  async clearAllFeedback() {
    try {
      this.feedbackData.clear();
      this.successRateData.clear();
      this.userPreferences.clear();
      
      await AsyncStorage.removeItem('user_feedback_data');
      await AsyncStorage.removeItem('success_rate_data');
      await AsyncStorage.removeItem('user_preferences');
      
      console.log('🗑️ All feedback data cleared');
    } catch (error) {
      console.error('❌ Failed to clear feedback data:', error);
    }
  }
}

export default new UserFeedbackService();













