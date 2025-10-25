/**
 * Enhanced Product Service - Batch 1
 * Enhanced product service with accuracy metrics and scoring
 */

import enhancedAccuracyService from './enhancedAccuracyService';
import dynamicMarketService from './dynamicMarketService';
import { STORE_BASE_URL } from '../config/apiConfig';

class EnhancedProductService {
  constructor() {
    this.apiUrl = STORE_BASE_URL;
    this.productCache = new Map();
    this.accuracyCache = new Map();
    this.recommendationHistory = [];
  }

  /**
   * Get enhanced product recommendations with accuracy scoring
   * @param {Object} aiCommand - AI command with disease/symptom data
   * @param {Object} marketData - Market data
   * @param {Object} confidenceData - Confidence data
   * @returns {Promise<Object>} Enhanced recommendations with accuracy
   */
  async getEnhancedRecommendations(aiCommand, marketData = {}, confidenceData = {}) {
    try {
      console.log('🎯 Getting enhanced product recommendations...');
      
      // Get base products
      const baseProducts = await this.fetchProducts(aiCommand);
      
      if (!baseProducts.success) {
        throw new Error(baseProducts.error);
      }
      
      // Enhance products with accuracy scoring
      const enhancedProducts = await this.enhanceProductsWithAccuracy(
        baseProducts.products,
        aiCommand,
        marketData,
        confidenceData
      );
      
      // Sort by accuracy score
      enhancedProducts.sort((a, b) => b.accuracy_score - a.accuracy_score);
      
      // Store recommendation history
      this.storeRecommendationHistory(aiCommand, enhancedProducts);
      
      console.log(`✅ Enhanced recommendations: ${enhancedProducts.length} products with accuracy scoring`);
      
      return {
        success: true,
        products: enhancedProducts,
        ai_command: aiCommand,
        market_data: marketData,
        confidence_data: confidenceData,
        total_products: enhancedProducts.length,
        high_accuracy_count: enhancedProducts.filter(p => p.accuracy_level === 'high').length,
        medium_accuracy_count: enhancedProducts.filter(p => p.accuracy_level === 'medium').length,
        low_accuracy_count: enhancedProducts.filter(p => p.accuracy_level === 'low').length,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Enhanced recommendations failed:', error);
      return {
        success: false,
        error: error.message,
        products: [],
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Fetch products from store backend
   * @param {Object} aiCommand - AI command
   * @returns {Promise<Object>} Products result
   */
  async fetchProducts(aiCommand) {
    try {
      const cacheKey = this.generateCacheKey(aiCommand);
      
      // Check cache first
      if (this.productCache.has(cacheKey)) {
        const cached = this.productCache.get(cacheKey);
        if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
          return cached.data;
        }
      }
      
      // Fetch from API - Use correct search endpoint with GET request
      const searchTerm = aiCommand.disease_type || aiCommand.products?.[0] || 'fertilizer';
      const searchUrl = `${this.apiUrl}/api/search?q=${encodeURIComponent(searchTerm)}&limit=10`;
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Product fetch failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Cache the result
      this.productCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Product fetch failed:', error);
      return {
        success: false,
        error: error.message,
        products: []
      };
    }
  }

  /**
   * Enhance products with accuracy scoring
   * @param {Array} products - Base products
   * @param {Object} aiCommand - AI command
   * @param {Object} marketData - Market data
   * @param {Object} confidenceData - Confidence data
   * @returns {Promise<Array>} Enhanced products with accuracy
   */
  async enhanceProductsWithAccuracy(products, aiCommand, marketData, confidenceData) {
    try {
      const enhancedProducts = [];
      
      for (const product of products) {
        // Calculate comprehensive accuracy score
        const accuracyData = enhancedAccuracyService.calculateComprehensiveAccuracy(
          product,
          aiCommand,
          marketData,
          confidenceData
        );
        
        // Get market insights for this product
        const marketInsights = await this.getProductMarketInsights(product);
        
        // Enhance product with accuracy data
        const enhancedProduct = {
          ...product,
          accuracy_score: accuracyData.accuracy_score,
          accuracy_level: accuracyData.accuracy_level,
          relevance_score: accuracyData.relevance.score,
          relevance_level: accuracyData.relevance.level,
          market_score: accuracyData.market.score,
          market_level: accuracyData.market.level,
          confidence_score: accuracyData.confidence.score,
          confidence_level: accuracyData.confidence.level,
          accuracy_factors: {
            relevance: accuracyData.relevance.factors,
            market: accuracyData.market.factors,
            confidence: accuracyData.confidence.factors
          },
          market_insights: marketInsights,
          enhanced_at: new Date().toISOString()
        };
        
        enhancedProducts.push(enhancedProduct);
      }
      
      return enhancedProducts;
      
    } catch (error) {
      console.error('❌ Product enhancement failed:', error);
      return products.map(product => ({
        ...product,
        accuracy_score: 0.5,
        accuracy_level: 'medium',
        enhanced_at: new Date().toISOString()
      }));
    }
  }

  /**
   * Get market insights for a product
   * @param {Object} product - Product data
   * @returns {Promise<Object>} Market insights
   */
  async getProductMarketInsights(product) {
    try {
      // Get market data for the product's category
      const marketData = dynamicMarketService.getAllMarketData();
      let relevantMarketData = null;
      
      // Find relevant market data by category or name
      for (const [cropId, data] of marketData) {
        if (data.category === product.category_name || 
            data.name.toLowerCase().includes(product.name.toLowerCase())) {
          relevantMarketData = data;
          break;
        }
      }
      
      if (!relevantMarketData) {
        return {
          availability: { in_stock: true, stock_level: 50 },
          price_trend: { trend: 'stable', change_percentage: 0 },
          supplier_rating: { rating: 4.0, review_count: 10 }
        };
      }
      
      return {
        availability: relevantMarketData.availability,
        price_trend: dynamicMarketService.calculatePriceTrend(relevantMarketData.id),
        supplier_rating: relevantMarketData.supplier_rating,
        roi_range: relevantMarketData.roi_range,
        regional_suitability: relevantMarketData.regional_suitability
      };
      
    } catch (error) {
      console.error('❌ Market insights failed:', error);
      return {
        availability: { in_stock: true, stock_level: 50 },
        price_trend: { trend: 'stable', change_percentage: 0 },
        supplier_rating: { rating: 4.0, review_count: 10 }
      };
    }
  }

  /**
   * Store recommendation history
   * @param {Object} aiCommand - AI command
   * @param {Array} products - Recommended products
   */
  storeRecommendationHistory(aiCommand, products) {
    const historyEntry = {
      timestamp: new Date().toISOString(),
      ai_command: aiCommand,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        accuracy_score: p.accuracy_score,
        accuracy_level: p.accuracy_level
      })),
      total_products: products.length,
      average_accuracy: products.reduce((sum, p) => sum + p.accuracy_score, 0) / products.length
    };
    
    this.recommendationHistory.push(historyEntry);
    
    // Keep only last 100 entries
    if (this.recommendationHistory.length > 100) {
      this.recommendationHistory.shift();
    }
  }

  /**
   * Get recommendation statistics
   * @returns {Object} Recommendation statistics
   */
  getRecommendationStatistics() {
    if (this.recommendationHistory.length === 0) {
      return {
        total_recommendations: 0,
        average_accuracy: 0,
        high_accuracy_percentage: 0,
        medium_accuracy_percentage: 0,
        low_accuracy_percentage: 0
      };
    }
    
    const total = this.recommendationHistory.length;
    const averageAccuracy = this.recommendationHistory.reduce((sum, entry) => sum + entry.average_accuracy, 0) / total;
    
    // Calculate accuracy level percentages
    let highCount = 0, mediumCount = 0, lowCount = 0;
    
    this.recommendationHistory.forEach(entry => {
      entry.products.forEach(product => {
        if (product.accuracy_level === 'high') highCount++;
        else if (product.accuracy_level === 'medium') mediumCount++;
        else lowCount++;
      });
    });
    
    const totalProducts = highCount + mediumCount + lowCount;
    
    return {
      total_recommendations: total,
      average_accuracy: averageAccuracy,
      high_accuracy_percentage: totalProducts > 0 ? (highCount / totalProducts) * 100 : 0,
      medium_accuracy_percentage: totalProducts > 0 ? (mediumCount / totalProducts) * 100 : 0,
      low_accuracy_percentage: totalProducts > 0 ? (lowCount / totalProducts) * 100 : 0,
      total_products_recommended: totalProducts
    };
  }

  /**
   * Generate cache key for AI command
   * @param {Object} aiCommand - AI command
   * @returns {string} Cache key
   */
  generateCacheKey(aiCommand) {
    const key = `${aiCommand.disease_type || ''}_${(aiCommand.categories || []).join(',')}_${(aiCommand.products || []).join(',')}_${(aiCommand.symptoms || []).join(',')}`;
    return btoa(key); // Base64 encode
  }

  /**
   * Clear product cache
   */
  clearCache() {
    this.productCache.clear();
    this.accuracyCache.clear();
    console.log('🗑️ Product cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStatistics() {
    return {
      product_cache_size: this.productCache.size,
      accuracy_cache_size: this.accuracyCache.size,
      recommendation_history_size: this.recommendationHistory.length
    };
  }
}

export default new EnhancedProductService();



