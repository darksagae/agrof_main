/**
 * Dynamic Market Service - Batch 1
 * Real-time market data integration for accuracy improvements
 */

import { supabase } from '../config/supabaseConfig';
import farmgainAfricaService from './farmgainAfricaService';

class DynamicMarketService {
  constructor() {
    this.marketData = new Map();
    this.priceHistory = new Map();
    this.availabilityData = new Map();
    this.supplierRatings = new Map();
    this.updateInterval = 5 * 60 * 1000; // 5 minutes
    this.isRunning = false;
    this.updateTimer = null;
  }

  /**
   * Initialize the dynamic market service
   */
  async initialize() {
    try {
      console.log('🔄 Initializing Dynamic Market Service...');
      
      // Load initial market data
      await this.loadInitialMarketData();
      
      // Start real-time updates
      this.startRealTimeUpdates();
      
      console.log('✅ Dynamic Market Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Dynamic Market Service:', error);
    }
  }

  /**
   * Load initial market data from Supabase
   */
  async loadInitialMarketData() {
    try {
      // Load crop market data (fallback to mock data if Supabase fails)
      let crops = [];
      try {
        const { data, error: cropsError } = await supabase
          .from('crops')
          .select('*');
        
        if (cropsError) throw cropsError;
        crops = data || [];
      } catch (supabaseError) {
        console.warn('⚠️ Supabase connection failed, using mock data:', supabaseError.message);
        // Use mock data as fallback
        crops = [
          { id: '1', name: 'Maize', market_price_min: 1000, market_price_max: 1500, roi_percentage_min: 20, roi_percentage_max: 40 },
          { id: '2', name: 'Tomatoes', market_price_min: 2000, market_price_max: 4000, roi_percentage_min: 30, roi_percentage_max: 60 },
          { id: '3', name: 'Beans', market_price_min: 2500, market_price_max: 3500, roi_percentage_min: 25, roi_percentage_max: 45 },
          { id: '4', name: 'Coffee', market_price_min: 8000, market_price_max: 12000, roi_percentage_min: 40, roi_percentage_max: 80 },
          { id: '5', name: 'Banana', market_price_min: 800, market_price_max: 1500, roi_percentage_min: 15, roi_percentage_max: 35 }
        ];
      }

      // Process market data
      crops.forEach(crop => {
        this.marketData.set(crop.id, {
          id: crop.id,
          name: crop.name,
          current_price: crop.market_price_min || 1000,
          price_range: {
            min: crop.market_price_min || 1000,
            max: crop.market_price_max || 1500
          },
          roi_range: {
            min: crop.roi_percentage_min || 20,
            max: crop.roi_percentage_max || 40
          },
          availability: 'available',
          last_updated: new Date().toISOString(),
          price_history: []
        });
      });

      console.log(`✅ Loaded market data for ${crops.length} crops`);
    } catch (error) {
      console.error('❌ Failed to load initial market data:', error);
    }
  }

  /**
   * Start real-time updates
   */
  startRealTimeUpdates() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.updateTimer = setInterval(() => {
      this.updateMarketData();
    }, this.updateInterval);
    
    console.log('🔄 Real-time market updates started');
  }

  /**
   * Stop real-time updates
   */
  stopRealTimeUpdates() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
    this.isRunning = false;
    console.log('⏹️ Real-time market updates stopped');
  }

  /**
   * Update market data
   */
  async updateMarketData() {
    try {
      await this.updateCropPrices();
      await this.updateAvailability();
      await this.updateSupplierRatings();
    } catch (error) {
      console.error('❌ Failed to update market data:', error);
    }
  }

  /**
   * Update crop prices from Supabase
   */
  async updateCropPrices() {
    try {
      const { data: crops, error } = await supabase
        .from('crops')
        .select('id, name, market_price_min, market_price_max, roi_percentage_min, roi_percentage_max');
      
      if (error) throw error;
      
      crops.forEach(crop => {
        const existingData = this.marketData.get(crop.id);
        if (existingData) {
          existingData.current_price = crop.market_price_min;
          existingData.roi_range = {
            min: crop.roi_percentage_min || 0,
            max: crop.roi_percentage_max || 0
          };
          existingData.last_updated = new Date().toISOString();
          
          // Store price history
          this.storePriceHistory(crop.id, crop.market_price_min);
        }
      });
      
    } catch (error) {
      console.error('❌ Failed to update crop prices:', error);
    }
  }

  /**
   * Update availability data
   */
  async updateAvailability() {
    // Mock availability update
    this.marketData.forEach((data, cropId) => {
      data.availability = Math.random() > 0.1 ? 'available' : 'limited';
    });
  }

  /**
   * Update supplier ratings
   */
  async updateSupplierRatings() {
    // Mock supplier rating update
    this.marketData.forEach((data, cropId) => {
      if (!this.supplierRatings.has(cropId)) {
        this.supplierRatings.set(cropId, {
          rating: 4.0 + Math.random() * 1.0,
          review_count: Math.floor(Math.random() * 100) + 10
        });
      }
    });
  }

  /**
   * Store price history
   */
  storePriceHistory(cropId, price) {
    const history = this.priceHistory.get(cropId) || [];
    history.push({
      price: price,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const filteredHistory = history.filter(entry => 
      new Date(entry.timestamp) > thirtyDaysAgo
    );
    
    this.priceHistory.set(cropId, filteredHistory);
  }

  /**
   * Get current price for a crop
   */
  getCurrentPrice(cropName) {
    const crop = Array.from(this.marketData.values()).find(c => 
      c.name.toLowerCase() === cropName.toLowerCase()
    );
    return crop ? { price: crop.current_price, last_updated: crop.last_updated } : null;
  }

  /**
   * Get price history for a crop
   */
  getPriceHistory(cropName) {
    const crop = Array.from(this.marketData.values()).find(c => 
      c.name.toLowerCase() === cropName.toLowerCase()
    );
    return crop ? this.priceHistory.get(crop.id) || [] : [];
  }

  /**
   * Get market data for a crop
   */
  getMarketData(cropName) {
    const crop = Array.from(this.marketData.values()).find(c => 
      c.name.toLowerCase() === cropName.toLowerCase()
    );
    return crop || null;
  }

  /**
   * Get all market data
   */
  getAllMarketData() {
    return Array.from(this.marketData.values());
  }

  /**
   * Get supplier rating for a crop
   */
  getSupplierRating(cropName) {
    const crop = Array.from(this.marketData.values()).find(c => 
      c.name.toLowerCase() === cropName.toLowerCase()
    );
    return crop ? this.supplierRatings.get(crop.id) : null;
  }

  /**
   * Calculate price trend
   */
  calculatePriceTrend(cropName) {
    const history = this.getPriceHistory(cropName);
    if (history.length < 2) return 'stable';
    
    const recent = history.slice(-7); // Last 7 days
    const older = history.slice(-14, -7); // Previous 7 days
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.price, 0) / recent.length;
    const olderAvg = older.reduce((sum, entry) => sum + entry.price, 0) / older.length;
    
    const change = (recentAvg - olderAvg) / olderAvg;
    
    if (change > 0.05) return 'increasing';
    if (change < -0.05) return 'decreasing';
    return 'stable';
  }

  /**
   * Get market insights
   */
  getMarketInsights(cropName) {
    const marketData = this.getMarketData(cropName);
    const priceHistory = this.getPriceHistory(cropName);
    const supplierRating = this.getSupplierRating(cropName);
    const priceTrend = this.calculatePriceTrend(cropName);
    
    if (!marketData) return null;
    
    return {
      current_price: marketData.current_price,
      price_range: marketData.price_range,
      price_trend: priceTrend,
      availability: marketData.availability,
      supplier_rating: supplierRating,
      roi_range: marketData.roi_range,
      last_updated: marketData.last_updated,
      price_history: priceHistory.slice(-30), // Last 30 entries
      recommendations: this.generateRecommendations(marketData, priceTrend)
    };
  }

  /**
   * Generate recommendations based on market data
   */
  generateRecommendations(marketData, priceTrend) {
    const recommendations = [];
    
    if (priceTrend === 'increasing') {
      recommendations.push('Prices are rising - good time to plant');
    } else if (priceTrend === 'decreasing') {
      recommendations.push('Prices are falling - consider waiting');
    }
    
    if (marketData.availability === 'limited') {
      recommendations.push('Limited availability - secure seeds early');
    }
    
    if (marketData.roi_range.max > 50) {
      recommendations.push('High ROI potential - consider increasing acreage');
    }
    
    return recommendations;
  }

  /**
   * Destroy the service
   */
  destroy() {
    this.stopRealTimeUpdates();
    this.marketData.clear();
    this.priceHistory.clear();
    this.availabilityData.clear();
    this.supplierRatings.clear();
  }
}

export default new DynamicMarketService();