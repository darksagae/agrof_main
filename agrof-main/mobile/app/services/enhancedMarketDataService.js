/**
 * Enhanced Market Data Service
 * Integrates comprehensive crop database with real-time market data
 * Covers all 19 crops with extensive Uganda agricultural data
 */

import ComprehensiveCropDatabase from './comprehensiveCropDatabase';
import DynamicMarketService from './dynamicMarketService';
import RegionalPriceService from './regionalPriceService';
import SeasonalPriceService from './seasonalPriceService';

class EnhancedMarketDataService {
  constructor() {
    this.cropDatabase = ComprehensiveCropDatabase;
    this.marketService = DynamicMarketService;
    this.regionalService = RegionalPriceService;
    this.seasonalService = SeasonalPriceService;
    this.isInitialized = false;
    this.marketDataCache = new Map();
    this.lastUpdate = null;
  }

  /**
   * Initialize enhanced market data service
   */
  async initialize() {
    try {
      console.log('🌾 Initializing Enhanced Market Data Service...');
      
      // Initialize market service
      await this.marketService.initialize();
      
      // Load comprehensive crop data
      this.loadCropData();
      
      // Initialize market data cache
      await this.updateMarketDataCache();
      
      this.isInitialized = true;
      console.log('✅ Enhanced Market Data Service initialized successfully');
      
      return {
        success: true,
        message: 'Enhanced market data service ready',
        crops_loaded: this.cropDatabase.getDatabaseStats().total_crops,
        market_sources: this.cropDatabase.getMarketSources()
      };
    } catch (error) {
      console.error('❌ Failed to initialize enhanced market data service:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Load comprehensive crop data
   */
  loadCropData() {
    const allCrops = this.cropDatabase.getAllCrops();
    console.log(`📊 Loaded ${allCrops.length} crops from comprehensive database`);
    
    // Initialize market data cache for each crop
    allCrops.forEach(crop => {
      this.marketDataCache.set(crop.name.toLowerCase(), {
        crop: crop,
        lastUpdated: null,
        marketData: null,
        regionalData: null,
        seasonalData: null
      });
    });
  }

  /**
   * Update market data cache for all crops
   */
  async updateMarketDataCache() {
    console.log('🔄 Updating market data cache for all crops...');
    
    const allCrops = this.cropDatabase.getAllCrops();
    const updatePromises = allCrops.map(async (crop) => {
      try {
        const marketData = await this.getComprehensiveMarketData(crop.name);
        this.marketDataCache.set(crop.name.toLowerCase(), {
          crop: crop,
          lastUpdated: new Date(),
          marketData: marketData
        });
      } catch (error) {
        console.log(`⚠️ Failed to update market data for ${crop.name}: ${error.message}`);
      }
    });

    await Promise.all(updatePromises);
    this.lastUpdate = new Date();
    console.log('✅ Market data cache updated successfully');
  }

  /**
   * Get comprehensive market data for a crop
   */
  async getComprehensiveMarketData(cropName) {
    try {
      const cropData = this.cropDatabase.getCropData(cropName);
      if (!cropData) {
        throw new Error(`Crop ${cropName} not found in database`);
      }

      // Get base market price
      const basePrice = this.marketService.getCurrentPrice(cropName);
      
      // Get price trend
      const priceTrend = this.marketService.getPriceTrend(cropName);
      
      // Get regional variations for all regions
      const regionalVariations = this.getRegionalVariations(cropData);
      
      // Get seasonal adjustments
      const seasonalAdjustments = this.getSeasonalAdjustments(cropData);
      
      // Get market insights
      const marketInsights = this.getMarketInsights(cropData);
      
      return {
        crop: cropData.name,
        basePrice: basePrice,
        priceTrend: priceTrend,
        regionalVariations: regionalVariations,
        seasonalAdjustments: seasonalAdjustments,
        marketInsights: marketInsights,
        accuracy: this.calculateDataAccuracy(cropData, basePrice),
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error(`❌ Error getting comprehensive market data for ${cropName}:`, error);
      throw error;
    }
  }

  /**
   * Get regional price variations for a crop
   */
  getRegionalVariations(cropData) {
    const regions = this.cropDatabase.getRegionalSuitability();
    const variations = {};
    
    Object.keys(regions).forEach(region => {
      const districts = this.regionalService.getDistrictsInRegion(region);
      const regionVariations = {};
      
      districts.forEach(district => {
        const basePrice = cropData.market_price_min || cropData.market_price_per_bag?.min || 1000;
        const regionalPrice = this.regionalService.calculateRegionalPrice(basePrice, region, district);
        
        regionVariations[district] = {
          price: regionalPrice,
          multiplier: this.regionalService.getRegionalMultiplier(region, district),
          transportCost: this.regionalService.getTransportationCost('Kampala', district)
        };
      });
      
      variations[region] = regionVariations;
    });
    
    return variations;
  }

  /**
   * Get seasonal adjustments for a crop
   */
  getSeasonalAdjustments(cropData) {
    const currentMonth = new Date().getMonth() + 1;
    const seasonalFactors = this.seasonalService.seasonalFactors[cropData.name.toLowerCase()];
    
    if (!seasonalFactors) {
      return {
        currentFactor: 1.0,
        monthlyFactors: {},
        recommendation: 'No seasonal data available'
      };
    }
    
    const monthlyFactors = {};
    for (let month = 1; month <= 12; month++) {
      monthlyFactors[month] = {
        factor: seasonalFactors[month] || 1.0,
        monthName: this.seasonalService.getMonthName(month)
      };
    }
    
    return {
      currentFactor: seasonalFactors[currentMonth] || 1.0,
      monthlyFactors: monthlyFactors,
      recommendation: this.seasonalService.getSeasonalRecommendation(cropData.name, currentMonth)
    };
  }

  /**
   * Get market insights for a crop
   */
  getMarketInsights(cropData) {
    return {
      marketDemand: cropData.market_demand,
      exportPotential: cropData.export_potential,
      roiRange: cropData.roi_percentage,
      regionalSuitability: this.getRegionalSuitability(cropData),
      plantingSeasons: cropData.planting_seasons,
      duration: cropData.duration_days || cropData.duration_months,
      soilRequirements: cropData.soil_requirements,
      waterRequirements: cropData.water_requirements
    };
  }

  /**
   * Get regional suitability for a crop
   */
  getRegionalSuitability(cropData) {
    const regions = this.cropDatabase.getRegionalSuitability();
    const suitability = {};
    
    Object.entries(regions).forEach(([region, data]) => {
      const isSuitable = data.suitable_crops.includes(cropData.name.toLowerCase());
      suitability[region] = {
        suitable: isSuitable,
        soilTypes: data.soil_types,
        rainfall: data.rainfall,
        altitude: data.altitude
      };
    });
    
    return suitability;
  }

  /**
   * Calculate data accuracy
   */
  calculateDataAccuracy(cropData, marketData) {
    let accuracy = 0.8; // Base accuracy
    
    // Market data availability (30%)
    if (marketData && marketData.price) {
      accuracy += 0.3;
    }
    
    // Regional data availability (25%)
    if (cropData.regional_suitability && cropData.regional_suitability.length > 0) {
      accuracy += 0.25;
    }
    
    // Seasonal data availability (25%)
    if (cropData.planting_seasons && cropData.planting_seasons.length > 0) {
      accuracy += 0.25;
    }
    
    // Government data integration (20%)
    if (this.cropDatabase.getGovernmentData()) {
      accuracy += 0.2;
    }
    
    return Math.min(0.98, accuracy);
  }

  /**
   * Get enhanced price for a crop in specific region
   */
  async getEnhancedPrice(cropName, region, district) {
    try {
      const cropData = this.cropDatabase.getCropData(cropName);
      if (!cropData) {
        throw new Error(`Crop ${cropName} not found`);
      }

      // Get base market price
      const marketData = this.marketService.getCurrentPrice(cropName);
      const basePrice = marketData?.price || cropData.market_price_min || cropData.market_price_per_bag?.min || 1000;
      
      // Apply regional adjustments
      const regionalPrice = this.regionalService.calculateRegionalPrice(basePrice, region, district);
      
      // Apply seasonal adjustments
      const currentMonth = new Date().getMonth() + 1;
      const seasonalPrice = this.seasonalService.calculateSeasonalPrice(regionalPrice, cropName, currentMonth, region);
      
      // Calculate accuracy
      const accuracy = this.calculateDataAccuracy(cropData, marketData);
      
      return {
        crop: cropName,
        region: region,
        district: district,
        basePrice: basePrice,
        regionalPrice: regionalPrice,
        seasonalPrice: seasonalPrice,
        finalPrice: seasonalPrice,
        accuracy: accuracy,
        confidence: this.calculateConfidence(accuracy),
        factors: {
          regional: this.regionalService.getRegionalMultiplier(region, district),
          seasonal: this.seasonalService.seasonalFactors[cropName.toLowerCase()]?.[currentMonth] || 1.0,
          weather: this.seasonalService.getWeatherFactor(region, currentMonth)
        },
        marketInsights: this.getMarketInsights(cropData),
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`❌ Error getting enhanced price for ${cropName}:`, error);
      throw error;
    }
  }

  /**
   * Calculate confidence level
   */
  calculateConfidence(accuracy) {
    if (accuracy >= 0.9) return 'high';
    if (accuracy >= 0.8) return 'medium';
    return 'low';
  }

  /**
   * Get comprehensive budget for crop planning
   */
  async getComprehensiveBudget(cropName, acres, region, district) {
    try {
      const cropData = this.cropDatabase.getCropData(cropName);
      if (!cropData) {
        throw new Error(`Crop ${cropName} not found`);
      }

      // Get enhanced price
      const enhancedPrice = await this.getEnhancedPrice(cropName, region, district);
      
      // Calculate budget components
      const budget = {
        crop: cropName,
        acres: acres,
        region: region,
        district: district,
        cropData: cropData,
        pricePerUnit: enhancedPrice.finalPrice,
        totalInvestment: enhancedPrice.finalPrice * acres,
        accuracy: enhancedPrice.accuracy,
        confidence: enhancedPrice.confidence,
        
        // Detailed breakdown
        breakdown: {
          seeds: this.calculateSeedCosts(cropData, acres),
          fertilizers: this.calculateFertilizerCosts(cropData, acres),
          pestControl: this.calculatePestControlCosts(cropData, acres),
          labor: this.calculateLaborCosts(cropData, acres),
          total: 0
        },
        
        // Market insights
        marketInsights: enhancedPrice.marketInsights,
        
        // Regional suitability
        regionalSuitability: this.getRegionalSuitability(cropData),
        
        // Seasonal recommendations
        seasonalRecommendation: this.seasonalService.getSeasonalRecommendation(cropName, new Date().getMonth() + 1),
        
        // Price forecast
        priceForecast: this.seasonalService.getPriceForecast(cropName, enhancedPrice.finalPrice, 6),
        
        timestamp: new Date()
      };
      
      // Calculate total breakdown
      budget.breakdown.total = Object.values(budget.breakdown).reduce((sum, cost) => 
        typeof cost === 'number' ? sum + cost : sum, 0
      );
      
      return budget;
    } catch (error) {
      console.error(`❌ Error calculating comprehensive budget for ${cropName}:`, error);
      throw error;
    }
  }

  /**
   * Calculate seed costs
   */
  calculateSeedCosts(cropData, acres) {
    if (!cropData.seed_quantity_kg) return 0;
    
    const seedQuantity = cropData.seed_quantity_kg * acres;
    const seedPricePerKg = 5000; // Average seed price per kg
    return seedQuantity * seedPricePerKg;
  }

  /**
   * Calculate fertilizer costs
   */
  calculateFertilizerCosts(cropData, acres) {
    if (!cropData.fertilizer_plan) return 0;
    
    let totalCost = 0;
    cropData.fertilizer_plan.forEach(plan => {
      const quantity = plan.quantity_per_acre * acres;
      const pricePerBag = 50000; // Average fertilizer price per bag
      totalCost += quantity * pricePerBag;
    });
    
    return totalCost;
  }

  /**
   * Calculate pest control costs
   */
  calculatePestControlCosts(cropData, acres) {
    if (!cropData.pest_control) return 0;
    
    let totalCost = 0;
    cropData.pest_control.forEach(control => {
      const applications = typeof control.applications === 'number' ? control.applications : 1;
      const costPerApplication = 20000; // Average cost per application
      totalCost += applications * costPerApplication * acres;
    });
    
    return totalCost;
  }

  /**
   * Calculate labor costs
   */
  calculateLaborCosts(cropData, acres) {
    if (!cropData.labor_costs_ugx) return 0;
    
    let totalCost = 0;
    Object.values(cropData.labor_costs_ugx).forEach(cost => {
      totalCost += cost * acres;
    });
    
    return totalCost;
  }

  /**
   * Get service status
   */
  getServiceStatus() {
    return {
      initialized: this.isInitialized,
      cropsLoaded: this.cropDatabase.getDatabaseStats().total_crops,
      marketDataCache: this.marketDataCache.size,
      lastUpdate: this.lastUpdate,
      marketService: this.marketService.getMarketSummary(),
      regionalService: 'active',
      seasonalService: 'active'
    };
  }

  /**
   * Get database statistics
   */
  getDatabaseStats() {
    return this.cropDatabase.getDatabaseStats();
  }

  /**
   * Search crops
   */
  searchCrops(keyword) {
    return this.cropDatabase.searchCrops(keyword);
  }

  /**
   * Get crops by category
   */
  getCropsByCategory(category) {
    return this.cropDatabase.getCropsByCategory(category);
  }

  /**
   * Get crops for region
   */
  getCropsForRegion(region) {
    return this.cropDatabase.getCropsForRegion(region);
  }
}

export default new EnhancedMarketDataService();
