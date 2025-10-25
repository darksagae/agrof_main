/**
 * Seasonal Price Service - Batch 1
 * Handles seasonal price adjustments and time-based pricing
 */

import { supabase } from '../config/supabaseConfig';

class SeasonalPriceService {
  constructor() {
    this.seasonalMultipliers = new Map();
    this.plantingSeasons = new Map();
    this.harvestSeasons = new Map();
    this.priceHistory = new Map();
    this.seasonalTrends = new Map();
    this.initialized = false;
  }

  /**
   * Initialize seasonal data
   */
  initializeSeasonalData() {
    // Initialize seasonal multipliers
    this.seasonalMultipliers.set('dry_season', 1.2);
    this.seasonalMultipliers.set('rainy_season', 0.9);
    this.seasonalMultipliers.set('peak_season', 1.5);
    this.seasonalMultipliers.set('off_season', 0.7);

    // Initialize planting seasons
    this.plantingSeasons.set('maize', ['March-April', 'September-October']);
    this.plantingSeasons.set('tomatoes', ['March-April', 'September-October']);
    this.plantingSeasons.set('beans', ['March-April', 'September-October']);
    this.plantingSeasons.set('coffee', ['March-May', 'September-November']);
    this.plantingSeasons.set('banana', ['Year-round']);
    this.plantingSeasons.set('onions', ['March-April', 'September-October']);
    this.plantingSeasons.set('groundnuts', ['March-April', 'September-October']);
    this.plantingSeasons.set('rice', ['March-April', 'September-October']);
    this.plantingSeasons.set('cotton', ['April-May']);
    this.plantingSeasons.set('sugarcane', ['March-May', 'September-November']);
    this.plantingSeasons.set('pineapple', ['Year-round']);
    this.plantingSeasons.set('mangoes', ['March-May']);
    this.plantingSeasons.set('avocados', ['March-May']);
    this.plantingSeasons.set('carrots', ['Year-round']);
    this.plantingSeasons.set('spinach', ['Year-round']);
    this.plantingSeasons.set('millet', ['March-April', 'September-October']);
    this.plantingSeasons.set('soybeans', ['March-April', 'September-October']);
    this.plantingSeasons.set('cabbage', ['March-April', 'September-October']);
    this.plantingSeasons.set('oranges', ['March-May', 'September-November']);

    // Initialize harvest seasons
    this.harvestSeasons.set('maize', ['June-August', 'December-February']);
    this.harvestSeasons.set('tomatoes', ['June-August', 'December-February']);
    this.harvestSeasons.set('beans', ['June-August', 'December-February']);
    this.harvestSeasons.set('coffee', ['October-December', 'April-June']);
    this.harvestSeasons.set('banana', ['Year-round']);
    this.harvestSeasons.set('onions', ['June-August', 'December-February']);
    this.harvestSeasons.set('groundnuts', ['June-August', 'December-February']);
    this.harvestSeasons.set('rice', ['June-August', 'December-February']);
    this.harvestSeasons.set('cotton', ['September-November']);
    this.harvestSeasons.set('sugarcane', ['Year-round']);
    this.harvestSeasons.set('pineapple', ['Year-round']);
    this.harvestSeasons.set('mangoes', ['November-January']);
    this.harvestSeasons.set('avocados', ['November-January']);
    this.harvestSeasons.set('carrots', ['Year-round']);
    this.harvestSeasons.set('spinach', ['Year-round']);
    this.harvestSeasons.set('millet', ['June-August', 'December-February']);
    this.harvestSeasons.set('soybeans', ['June-August', 'December-February']);
    this.harvestSeasons.set('cabbage', ['June-August', 'December-February']);
    this.harvestSeasons.set('oranges', ['November-January', 'May-July']);
  }

  /**
   * Get seasonal price multiplier
   */
  getSeasonalMultiplier(cropName, month) {
    const season = this.getCurrentSeason(month);
    const baseMultiplier = this.seasonalMultipliers.get(season) || 1.0;
    
    // Check if crop is in peak season
    const plantingSeasons = this.plantingSeasons.get(cropName);
    const harvestSeasons = this.harvestSeasons.get(cropName);
    
    if (plantingSeasons && this.isInSeason(month, plantingSeasons)) {
      return baseMultiplier * 1.1; // 10% premium during planting season
    }
    
    if (harvestSeasons && this.isInSeason(month, harvestSeasons)) {
      return baseMultiplier * 0.9; // 10% discount during harvest season
    }
    
    return baseMultiplier;
  }

  /**
   * Get current season based on month
   */
  getCurrentSeason(month) {
    if (month >= 12 || month <= 2) {
      return 'dry_season';
    } else if (month >= 3 && month <= 5) {
      return 'rainy_season';
    } else if (month >= 6 && month <= 8) {
      return 'peak_season';
    } else {
      return 'off_season';
    }
  }

  /**
   * Check if month is in season
   */
  isInSeason(month, seasons) {
    return seasons.some(season => {
      if (season === 'Year-round') return true;
      
      const [startMonth, endMonth] = season.split('-');
      const start = this.getMonthNumber(startMonth);
      const end = this.getMonthNumber(endMonth);
      
      if (start <= end) {
        return month >= start && month <= end;
      } else {
        return month >= start || month <= end;
      }
    });
  }

  /**
   * Get month number from month name
   */
  getMonthNumber(monthName) {
    const months = {
      'January': 1, 'February': 2, 'March': 3, 'April': 4,
      'May': 5, 'June': 6, 'July': 7, 'August': 8,
      'September': 9, 'October': 10, 'November': 11, 'December': 12
    };
    return months[monthName] || 1;
  }

  /**
   * Calculate seasonal price
   */
  calculateSeasonalPrice(basePrice, cropName, month) {
    const multiplier = this.getSeasonalMultiplier(cropName, month);
    return basePrice * multiplier;
  }

  /**
   * Get seasonal price trends
   */
  getSeasonalPriceTrends(cropName) {
    const trends = this.seasonalTrends.get(cropName);
    if (trends) {
      return trends;
    }

    // Generate default trends if not available
    const defaultTrends = {
      'dry_season': { multiplier: 1.2, reason: 'High demand, low supply' },
      'rainy_season': { multiplier: 0.9, reason: 'High supply, moderate demand' },
      'peak_season': { multiplier: 1.5, reason: 'Peak demand period' },
      'off_season': { multiplier: 0.7, reason: 'Low demand, high supply' }
    };

    this.seasonalTrends.set(cropName, defaultTrends);
    return defaultTrends;
  }

  /**
   * Update seasonal price history
   */
  updatePriceHistory(cropName, price, month) {
    const history = this.priceHistory.get(cropName) || [];
    history.push({ price, month, timestamp: new Date().toISOString() });
    
    // Keep only last 12 months
    if (history.length > 12) {
      history.shift();
    }
    
    this.priceHistory.set(cropName, history);
  }

  /**
   * Get price forecast
   */
  getPriceForecast(cropName, months) {
    const history = this.priceHistory.get(cropName) || [];
    const trends = this.getSeasonalPriceTrends(cropName);
    
    const forecast = [];
    const currentMonth = new Date().getMonth() + 1;
    
    for (let i = 1; i <= months; i++) {
      const forecastMonth = ((currentMonth + i - 1) % 12) + 1;
      const season = this.getCurrentSeason(forecastMonth);
      const trend = trends[season];
      
      // Calculate forecast price based on historical data and seasonal trends
      const avgPrice = history.length > 0 
        ? history.reduce((sum, entry) => sum + entry.price, 0) / history.length 
        : 1000; // Default price
      
      const forecastPrice = avgPrice * trend.multiplier;
      
      forecast.push({
        month: forecastMonth,
        season: season,
        predictedPrice: forecastPrice,
        confidence: Math.min(0.9, 0.5 + (history.length / 12) * 0.4)
      });
    }
    
    return forecast;
  }

  /**
   * Get all seasonal data for dashboard
   */
  getAllSeasonalData() {
    return {
      seasonalMultipliers: Object.fromEntries(this.seasonalMultipliers),
      plantingSeasons: Object.fromEntries(this.plantingSeasons),
      harvestSeasons: Object.fromEntries(this.harvestSeasons),
      priceHistory: Object.fromEntries(this.priceHistory),
      seasonalTrends: Object.fromEntries(this.seasonalTrends),
      initialized: this.initialized,
      currentSeason: this.getCurrentSeason(new Date().getMonth() + 1),
      availableSeasons: ['dry_season', 'rainy_season', 'peak_season', 'off_season'],
      totalCrops: this.plantingSeasons.size,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Initialize the seasonal price service
   */
  async initialize() {
    try {
      console.log('🔄 Initializing Seasonal Price Service...');
      this.initializeSeasonalData();
      await this.loadSeasonalDataFromSupabase();
      this.initialized = true;
      console.log('✅ Seasonal Price Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Seasonal Price Service:', error);
    }
  }

  /**
   * Load seasonal data from Supabase
   */
  async loadSeasonalDataFromSupabase() {
    try {
      // Load seasonal data from Supabase (fallback to mock data if Supabase fails)
      let seasonalData = [];
      try {
        const { data, error } = await supabase
          .from('crops')
          .select('id, name, planting_season, harvest_season');

        if (error) throw error;
        seasonalData = data || [];
      } catch (supabaseError) {
        console.warn('⚠️ Supabase connection failed, using mock data:', supabaseError.message);
        seasonalData = [];
      }

      // Process seasonal data
      seasonalData.forEach(crop => {
        if (crop.planting_season) {
          this.plantingSeasons.set(crop.name.toLowerCase(), [crop.planting_season]);
        }
        if (crop.harvest_season) {
          this.harvestSeasons.set(crop.name.toLowerCase(), [crop.harvest_season]);
        }
      });

      console.log('✅ Seasonal data loaded');
    } catch (error) {
      console.error('❌ Failed to load seasonal data:', error);
    }
  }

  /**
   * Get seasonal data for a specific crop
   * @param {string} cropId - Crop ID
   * @returns {Object} Siteasonal data for the crop
   */
  async getSeasonalData(cropId) {
    try {
      console.log(`🔍 Getting seasonal data for crop: ${cropId}`);
      
      const currentMonth = new Date().getMonth() + 1; // 1-12
      const currentSeason = this.getCurrentSeason(currentMonth);
      
      const seasonalData = {
        currentSeason: currentSeason,
        priceMultiplier: this.getSeasonalPriceMultiplier(currentSeason),
        plantingRecommendation: this.getPlantingRecommendation(cropId, currentSeason),
        harvestTiming: this.getHarvestTiming(cropId, currentSeason)
      };
      
      console.log(`✅ Seasonal data calculated for ${cropId}:`, seasonalData);
      return seasonalData;
    } catch (error) {
      console.error('❌ Failed to get seasonal data:', error);
      throw error;
    }
  }

  /**
   * Get current season based on month
   */
  getCurrentSeason(month) {
    if (month >= 3 && month <= 5) return 'First Rains';
    if (month >= 6 && month <= 8) return 'First Dry Season';
    if (month >= 9 && month <= 11) return 'Second Rains';
    return 'Second Dry Season';
  }

  /**
   * Get seasonal price multiplier
   */
  getSeasonalPriceMultiplier(season) {
    const multipliers = {
      'First Rains': 1.2,
      'First Dry Season': 1.1,
      'Second Rains': 1.3,
      'Second Dry Season': 0.9
    };
    return multipliers[season] || 1.0;
  }

  /**
   * Get planting recommendation
   */
  getPlantingRecommendation(cropId, season) {
    if (season === 'First Rains' || season === 'Second Rains') {
      return 'Optimal planting window - good soil moisture';
    }
    return 'Consider irrigation or wait for rains';
  }

  /**
   * Get harvest timing
   */
  getHarvestTiming(cropId, season) {
    if (season === 'First Dry Season' || season === 'Second Dry Season') {
      return 'Peak season harvest - optimal conditions';
    }
    return 'Harvest during dry periods for best quality';
  }
}

export default new SeasonalPriceService();
