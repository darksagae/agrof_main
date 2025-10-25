/**
 * Crop Timing Service - Batch 3
 * Optimal crop timing recommendations and harvest predictions
 */

import seasonalPriceService from './seasonalPriceService';
import weatherIntegrationService from './weatherIntegrationService';

class CropTimingService {
  constructor() {
    this.cropTimingData = new Map();
    this.harvestPredictions = new Map();
    this.optimalTimingRecommendations = new Map();
    this.marketTimingOptimization = new Map();
    this.initialized = false;
  }

  /**
   * Initialize the crop timing service
   */
  async initialize() {
    try {
      console.log('🔄 Initializing Crop Timing Service...');
      
      // Initialize crop timing data
      this.initializeCropTimingData();
      
      // Initialize harvest predictions
      this.initializeHarvestPredictions();
      
      // Initialize market timing optimization
      this.initializeMarketTimingOptimization();
      
      this.initialized = true;
      console.log('✅ Crop Timing Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Crop Timing Service:', error);
    }
  }

  /**
   * Initialize crop timing data
   */
  initializeCropTimingData() {
    const crops = [
      'maize', 'tomatoes', 'beans', 'coffee', 'banana',
      'onions', 'groundnuts', 'rice', 'cotton', 'sugarcane',
      'pineapple', 'mangoes', 'avocados', 'carrots', 'spinach',
      'millet', 'soybeans', 'cabbage', 'oranges'
    ];

    crops.forEach(crop => {
      this.cropTimingData.set(crop, {
        crop_name: crop,
        optimal_planting_times: this.getOptimalPlantingTimes(crop),
        optimal_harvest_times: this.getOptimalHarvestTimes(crop),
        growth_duration: this.getGrowthDuration(crop),
        critical_growth_stages: this.getCriticalGrowthStages(crop),
        weather_sensitivity: this.getWeatherSensitivity(crop),
        market_timing_factors: this.getMarketTimingFactors(crop)
      });
    });
  }

  /**
   * Initialize harvest predictions
   */
  initializeHarvestPredictions() {
    const crops = [
      'maize', 'tomatoes', 'beans', 'coffee', 'banana',
      'onions', 'groundnuts', 'rice', 'cotton', 'sugarcane',
      'pineapple', 'mangoes', 'avocados', 'carrots', 'spinach',
      'millet', 'soybeans', 'cabbage', 'oranges'
    ];

    crops.forEach(crop => {
      this.harvestPredictions.set(crop, {
        crop_id: crop,
        predicted_harvest_date: this.calculateHarvestDate(crop),
        success_probability: Math.random() * 0.3 + 0.7, // 70-100%
        yield_prediction: this.predictYield(crop),
        quality_prediction: this.predictQuality(crop),
        market_timing: this.getMarketTiming(crop),
        risk_factors: this.getRiskFactors(crop),
        last_updated: new Date().toISOString()
      });
    });
  }

  /**
   * Initialize market timing optimization
   */
  initializeMarketTimingOptimization() {
    const crops = [
      'maize', 'tomatoes', 'beans', 'coffee', 'banana',
      'onions', 'groundnuts', 'rice', 'cotton', 'sugarcane',
      'pineapple', 'mangoes', 'avocados', 'carrots', 'spinach',
      'millet', 'soybeans', 'cabbage', 'oranges'
    ];

    crops.forEach(crop => {
      this.marketTimingOptimization.set(crop, {
        crop_id: crop,
        optimal_planting_window: this.getOptimalPlantingTimes(crop),
        optimal_harvest_window: this.getOptimalHarvestTimes(crop),
        market_price_trends: this.getMarketPriceTrends(crop),
        seasonal_advantages: this.getSeasonalAdvantages(crop),
        risk_mitigation: this.getRiskMitigation(crop),
        last_updated: new Date().toISOString()
      });
    });
  }

  /**
   * Get optimal planting times for a crop
   */
  getOptimalPlantingTimes(crop) {
    const plantingTimes = {
      maize: ['March-April', 'September-October'],
      tomatoes: ['Year-round'],
      beans: ['March-April', 'September-October'],
      coffee: ['March-May'],
      banana: ['Year-round'],
      onions: ['March-April', 'September-October'],
      groundnuts: ['March-April', 'September-October'],
      rice: ['March-April', 'September-October'],
      cotton: ['April-May'],
      sugarcane: ['March-May', 'September-November'],
      pineapple: ['Year-round'],
      mangoes: ['March-May'],
      avocados: ['March-May'],
      carrots: ['Year-round'],
      spinach: ['Year-round'],
      millet: ['March-April', 'September-October'],
      soybeans: ['March-April', 'September-October'],
      cabbage: ['Year-round'],
      oranges: ['March-May']
    };

    return plantingTimes[crop] || ['Year-round'];
  }

  /**
   * Get optimal harvest times for a crop
   */
  getOptimalHarvestTimes(crop) {
    const harvestTimes = {
      maize: ['July-August', 'December-January'],
      tomatoes: ['Continuous'],
      beans: ['June-July', 'December-January'],
      coffee: ['October-February'],
      banana: ['Year-round'],
      onions: ['July-August', 'December-January'],
      groundnuts: ['July-August', 'December-January'],
      rice: ['August-September', 'February-March'],
      cotton: ['October-December'],
      sugarcane: ['Year-round'],
      pineapple: ['Year-round'],
      mangoes: ['November-March'],
      avocados: ['June-September'],
      carrots: ['Year-round'],
      spinach: ['Year-round'],
      millet: ['July-August', 'December-January'],
      soybeans: ['July-August', 'December-January'],
      cabbage: ['Year-round'],
      oranges: ['June-September']
    };

    return harvestTimes[crop] || ['Year-round'];
  }

  /**
   * Get growth duration for a crop
   */
  getGrowthDuration(crop) {
    const durations = {
      maize: '90-120 days',
      tomatoes: '60-90 days',
      beans: '60-90 days',
      coffee: '3-4 years to first harvest',
      banana: '12-15 months',
      onions: '90-120 days',
      groundnuts: '90-120 days',
      rice: '120-150 days',
      cotton: '150-180 days',
      sugarcane: '12-18 months',
      pineapple: '18-24 months',
      mangoes: '3-5 years to first harvest',
      avocados: '3-4 years to first harvest',
      carrots: '90-120 days',
      spinach: '30-45 days',
      millet: '90-120 days',
      soybeans: '90-120 days',
      cabbage: '90-120 days',
      oranges: '3-4 years to first harvest'
    };

    return durations[crop] || '90-120 days';
  }

  /**
   * Get critical growth stages for a crop
   */
  getCriticalGrowthStages(crop) {
    const stages = {
      maize: [
        { stage: 'Germination', duration: '5-10 days', critical: true },
        { stage: 'Vegetative', duration: '30-45 days', critical: true },
        { stage: 'Flowering', duration: '10-14 days', critical: true },
        { stage: 'Grain Filling', duration: '30-40 days', critical: true },
        { stage: 'Maturity', duration: '10-15 days', critical: false }
      ],
      tomatoes: [
        { stage: 'Germination', duration: '5-7 days', critical: true },
        { stage: 'Seedling', duration: '20-30 days', critical: true },
        { stage: 'Vegetative', duration: '30-40 days', critical: true },
        { stage: 'Flowering', duration: '15-20 days', critical: true },
        { stage: 'Fruiting', duration: '20-30 days', critical: true }
      ],
      beans: [
        { stage: 'Germination', duration: '5-8 days', critical: true },
        { stage: 'Vegetative', duration: '25-35 days', critical: true },
        { stage: 'Flowering', duration: '10-15 days', critical: true },
        { stage: 'Pod Development', duration: '15-25 days', critical: true },
        { stage: 'Maturity', duration: '10-15 days', critical: false }
      ]
    };

    return stages[crop] || stages.maize;
  }

  /**
   * Get weather sensitivity for a crop
   */
  getWeatherSensitivity(crop) {
    const sensitivities = {
      maize: {
        temperature: 'high',
        humidity: 'medium',
        rainfall: 'high',
        drought_tolerance: 'medium',
        flood_tolerance: 'low'
      },
      tomatoes: {
        temperature: 'high',
        humidity: 'high',
        rainfall: 'medium',
        drought_tolerance: 'low',
        flood_tolerance: 'low'
      },
      beans: {
        temperature: 'medium',
        humidity: 'medium',
        rainfall: 'high',
        drought_tolerance: 'medium',
        flood_tolerance: 'medium'
      },
      coffee: {
        temperature: 'high',
        humidity: 'high',
        rainfall: 'high',
        drought_tolerance: 'low',
        flood_tolerance: 'medium'
      },
      banana: {
        temperature: 'high',
        humidity: 'high',
        rainfall: 'high',
        drought_tolerance: 'low',
        flood_tolerance: 'medium'
      }
    };

    return sensitivities[crop] || sensitivities.maize;
  }

  /**
   * Get market timing factors for a crop
   */
  getMarketTimingFactors(crop) {
    const factors = {
      maize: {
        peak_demand_season: 'First Rains',
        price_volatility: 'high',
        storage_requirements: 'moderate',
        market_access: 'good'
      },
      tomatoes: {
        peak_demand_season: 'Year-round',
        price_volatility: 'very_high',
        storage_requirements: 'high',
        market_access: 'excellent'
      },
      beans: {
        peak_demand_season: 'First Rains',
        price_volatility: 'medium',
        storage_requirements: 'low',
        market_access: 'good'
      },
      coffee: {
        peak_demand_season: 'Year-round',
        price_volatility: 'very_high',
        storage_requirements: 'low',
        market_access: 'excellent'
      },
      banana: {
        peak_demand_season: 'Year-round',
        price_volatility: 'low',
        storage_requirements: 'high',
        market_access: 'good'
      }
    };

    return factors[crop] || factors.maize;
  }

  /**
   * Get optimal timing recommendation for a crop
   * @param {string} cropId - Crop ID
   * @param {string} region - Region
   * @returns {Object} Optimal timing recommendation
   */
  getOptimalTimingRecommendation(cropId, region) {
    try {
      const cropName = this.getCropNameFromId(cropId);
      const cropData = this.cropTimingData.get(cropName);
      
      if (!cropData) {
        throw new Error(`Crop ${cropName} not found`);
      }

      // Get current season
      const currentSeason = seasonalPriceService.getCurrentSeason();
      
      // Get weather suitability
      const weatherSuitability = weatherIntegrationService.analyzeWeatherSuitability(cropId, region);
      
      // Calculate optimal timing score
      const timingScore = this.calculateTimingScore(cropData, currentSeason, weatherSuitability);
      
      // Generate recommendations
      const recommendations = this.generateTimingRecommendations(cropData, currentSeason, weatherSuitability);
      
      return {
        crop_id: cropId,
        crop_name: cropName,
        region: region,
        current_season: currentSeason,
        optimal_planting_times: cropData.optimal_planting_times,
        optimal_harvest_times: cropData.optimal_harvest_times,
        growth_duration: cropData.growth_duration,
        timing_score: timingScore,
        weather_suitability: weatherSuitability,
        recommendations: recommendations,
        critical_growth_stages: cropData.critical_growth_stages,
        market_timing_factors: cropData.market_timing_factors
      };
      
    } catch (error) {
      console.error('❌ Optimal timing recommendation failed:', error);
      return {
        crop_id: cropId,
        error: error.message,
        timing_score: 0.5
      };
    }
  }

  /**
   * Calculate timing score
   */
  calculateTimingScore(cropData, currentSeason, weatherSuitability) {
    let score = 0.5; // Base score
    
    // Season suitability (40% weight)
    const isOptimalSeason = this.isOptimalPlantingSeason(cropData, currentSeason);
    score += isOptimalSeason ? 0.4 : 0.1;
    
    // Weather suitability (30% weight)
    score += weatherSuitability.suitability_score * 0.3;
    
    // Market timing (20% weight)
    const marketScore = this.calculateMarketTimingScore(cropData, currentSeason);
    score += marketScore * 0.2;
    
    // Growth stage timing (10% weight)
    const growthStageScore = this.calculateGrowthStageScore(cropData);
    score += growthStageScore * 0.1;
    
    return Math.min(1, Math.max(0, score));
  }

  /**
   * Check if current season is optimal for planting
   */
  isOptimalPlantingSeason(cropData, currentSeason) {
    return cropData.optimal_planting_times.some(time => {
      if (time === 'Year-round') return true;
      
      // Check season mapping
      if (time.includes('March-April') && currentSeason === 'First Rains') return true;
      if (time.includes('September-October') && currentSeason === 'Second Rains') return true;
      if (time.includes('March-May') && currentSeason === 'First Rains') return true;
      
      return false;
    });
  }

  /**
   * Calculate market timing score
   */
  calculateMarketTimingScore(cropData, currentSeason) {
    const marketFactors = cropData.market_timing_factors;
    
    // Check if current season matches peak demand
    const isPeakDemand = marketFactors.peak_demand_season === currentSeason || 
                        marketFactors.peak_demand_season === 'Year-round';
    
    if (isPeakDemand) {
      return 1.0;
    }
    
    // Calculate score based on price volatility and market access
    let score = 0.5;
    
    if (marketFactors.market_access === 'excellent') score += 0.3;
    else if (marketFactors.market_access === 'good') score += 0.2;
    
    if (marketFactors.price_volatility === 'very_high') score += 0.2;
    else if (marketFactors.price_volatility === 'high') score += 0.1;
    
    return Math.min(1, score);
  }

  /**
   * Calculate growth stage score
   */
  calculateGrowthStageScore(cropData) {
    // This would be more complex in a real implementation
    // For now, return a base score
    return 0.7;
  }

  /**
   * Generate timing recommendations
   */
  generateTimingRecommendations(cropData, currentSeason, weatherSuitability) {
    const recommendations = [];
    
    // Season-based recommendations
    if (this.isOptimalPlantingSeason(cropData, currentSeason)) {
      recommendations.push({
        type: 'season',
        priority: 'high',
        message: `This is an optimal time to plant ${cropData.crop_name}`,
        action: 'Plant now'
      });
    } else {
      recommendations.push({
        type: 'season',
        priority: 'medium',
        message: `Consider waiting for optimal planting season: ${cropData.optimal_planting_times.join(', ')}`,
        action: 'Wait for optimal season'
      });
    }
    
    // Weather-based recommendations
    if (weatherSuitability.suitability_score < 0.7) {
      recommendations.push({
        type: 'weather',
        priority: 'high',
        message: 'Current weather conditions are not optimal',
        action: 'Consider protective measures or wait for better weather'
      });
    }
    
    // Market-based recommendations
    const marketFactors = cropData.market_timing_factors;
    if (marketFactors.price_volatility === 'very_high') {
      recommendations.push({
        type: 'market',
        priority: 'medium',
        message: 'High price volatility - consider market timing carefully',
        action: 'Monitor market prices closely'
      });
    }
    
    return recommendations;
  }

  /**
   * Get harvest prediction for a crop
   * @param {string} cropId - Crop ID
   * @param {string} plantingDate - Planting date
   * @param {string} region - Region
   * @returns {Object} Harvest prediction
   */
  getHarvestPrediction(cropId, plantingDate, region) {
    try {
      const cropName = this.getCropNameFromId(cropId);
      const cropData = this.cropTimingData.get(cropName);
      
      if (!cropData) {
        throw new Error(`Crop ${cropName} not found`);
      }

      const planting = new Date(plantingDate);
      const growthDuration = this.parseGrowthDuration(cropData.growth_duration);
      const harvestDate = new Date(planting.getTime() + growthDuration * 24 * 60 * 60 * 1000);
      
      // Get weather forecast for harvest period
      const weatherForecast = weatherIntegrationService.getWeatherForecast(region);
      const harvestWeather = this.getWeatherForDate(weatherForecast, harvestDate);
      
      // Calculate harvest success probability
      const successProbability = this.calculateHarvestSuccessProbability(cropData, harvestWeather);
      
      return {
        crop_id: cropId,
        crop_name: cropName,
        region: region,
        planting_date: plantingDate,
        predicted_harvest_date: harvestDate.toISOString().split('T')[0],
        growth_duration: cropData.growth_duration,
        success_probability: successProbability,
        harvest_weather: harvestWeather,
        recommendations: this.generateHarvestRecommendations(successProbability, harvestWeather)
      };
      
    } catch (error) {
      console.error('❌ Harvest prediction failed:', error);
      return {
        crop_id: cropId,
        error: error.message,
        success_probability: 0.5
      };
    }
  }

  /**
   * Parse growth duration string to days
   */
  parseGrowthDuration(duration) {
    if (duration.includes('days')) {
      const match = duration.match(/(\d+)-(\d+)/);
      if (match) {
        return (parseInt(match[1]) + parseInt(match[2])) / 2;
      }
    }
    return 90; // Default 90 days
  }

  /**
   * Get weather for specific date
   */
  getWeatherForDate(forecast, targetDate) {
    const targetDateStr = targetDate.toISOString().split('T')[0];
    return forecast.find(day => day.date === targetDateStr) || forecast[0];
  }

  /**
   * Calculate harvest success probability
   */
  calculateHarvestSuccessProbability(cropData, harvestWeather) {
    let probability = 0.7; // Base probability
    
    // Adjust based on weather sensitivity
    const sensitivity = cropData.weather_sensitivity;
    
    if (harvestWeather.temperature < 15 || harvestWeather.temperature > 35) {
      probability -= 0.2;
    }
    
    if (harvestWeather.conditions === 'rainy' && sensitivity.flood_tolerance === 'low') {
      probability -= 0.3;
    }
    
    return Math.max(0.1, Math.min(1, probability));
  }

  /**
   * Generate harvest recommendations
   */
  generateHarvestRecommendations(successProbability, harvestWeather) {
    const recommendations = [];
    
    if (successProbability < 0.6) {
      recommendations.push({
        type: 'risk',
        message: 'Low harvest success probability',
        action: 'Consider protective measures or alternative timing'
      });
    }
    
    if (harvestWeather.conditions === 'rainy') {
      recommendations.push({
        type: 'weather',
        message: 'Rainy weather expected during harvest',
        action: 'Prepare for wet harvest conditions'
      });
    }
    
    return recommendations;
  }

  /**
   * Get crop name from ID
   */
  getCropNameFromId(cropId) {
    const cropMap = {
      'maize': 'maize',
      'tomatoes': 'tomatoes',
      'beans': 'beans',
      'coffee': 'coffee',
      'banana': 'banana',
      'onions': 'onions',
      'groundnuts': 'groundnuts',
      'rice': 'rice',
      'cotton': 'cotton',
      'sugarcane': 'sugarcane',
      'pineapple': 'pineapple',
      'mangoes': 'mangoes',
      'avocados': 'avocados',
      'carrots': 'carrots',
      'spinach': 'spinach',
      'millet': 'millet',
      'soybeans': 'soybeans',
      'cabbage': 'cabbage',
      'oranges': 'oranges'
    };

    return cropMap[cropId] || cropId;
  }

  /**
   * Get all crop timing data
   * @returns {Object} All crop timing data
   */
  getAllCropTimingData() {
    return {
      crop_timing_data: Object.fromEntries(this.cropTimingData),
      harvest_predictions: Object.fromEntries(this.harvestPredictions),
      market_timing_optimization: Object.fromEntries(this.marketTimingOptimization),
      initialized: this.initialized
    };
  }

  /**
   * Calculate harvest date for a crop
   */
  calculateHarvestDate(crop) {
    const growthPeriods = {
      maize: 105, // days
      tomatoes: 75,
      beans: 82,
      coffee: 1095, // 3 years
      banana: 365, // 1 year
      onions: 120,
      groundnuts: 120,
      rice: 120,
      cotton: 180,
      sugarcane: 365,
      pineapple: 730, // 2 years
      mangoes: 1095, // 3 years
      avocados: 1095, // 3 years
      carrots: 75,
      spinach: 45,
      millet: 90,
      soybeans: 100,
      cabbage: 90,
      oranges: 1095 // 3 years
    };

    const days = growthPeriods[crop] || 90;
    const harvestDate = new Date();
    harvestDate.setDate(harvestDate.getDate() + days);
    return harvestDate.toISOString();
  }

  /**
   * Predict yield for a crop
   */
  predictYield(crop) {
    const baseYields = {
      maize: 800, // kg/acre
      tomatoes: 15000,
      beans: 600,
      coffee: 1000,
      banana: 20000,
      onions: 8000,
      groundnuts: 800,
      rice: 1000,
      cotton: 800,
      sugarcane: 50000,
      pineapple: 30000,
      mangoes: 5000,
      avocados: 3000,
      carrots: 10000,
      spinach: 5000,
      millet: 600,
      soybeans: 800,
      cabbage: 15000,
      oranges: 8000
    };

    const baseYield = baseYields[crop] || 1000;
    const variation = Math.random() * 0.4 - 0.2; // ±20% variation
    return Math.round(baseYield * (1 + variation));
  }

  /**
   * Predict quality for a crop
   */
  predictQuality(crop) {
    const qualityLevels = ['Excellent', 'Good', 'Average', 'Fair'];
    return qualityLevels[Math.floor(Math.random() * qualityLevels.length)];
  }

  /**
   * Get market timing for a crop
   */
  getMarketTiming(crop) {
    return {
      optimal_selling_period: this.getOptimalHarvestTimes(crop),
      price_trend: Math.random() > 0.5 ? 'Rising' : 'Stable',
      demand_level: Math.random() > 0.3 ? 'High' : 'Moderate'
    };
  }

  /**
   * Get risk factors for a crop
   */
  getRiskFactors(crop) {
    const risks = ['Weather', 'Pests', 'Diseases', 'Market', 'Labor'];
    const numRisks = Math.floor(Math.random() * 3) + 1;
    return risks.slice(0, numRisks);
  }

  /**
   * Get market price trends for a crop
   */
  getMarketPriceTrends(crop) {
    return {
      current_trend: Math.random() > 0.5 ? 'Rising' : 'Stable',
      seasonal_variation: Math.random() * 0.3 + 0.1, // 10-40%
      demand_forecast: Math.random() > 0.3 ? 'High' : 'Moderate'
    };
  }

  /**
   * Get seasonal advantages for a crop
   */
  getSeasonalAdvantages(crop) {
    return {
      planting_advantage: Math.random() > 0.5 ? 'Early planting' : 'Late planting',
      harvest_advantage: Math.random() > 0.5 ? 'Early harvest' : 'Late harvest',
      market_advantage: Math.random() > 0.5 ? 'High demand period' : 'Stable demand'
    };
  }

  /**
   * Get risk mitigation for a crop
   */
  getRiskMitigation(crop) {
    return {
      weather_protection: ['Irrigation', 'Cover crops', 'Mulching'],
      pest_control: ['Integrated pest management', 'Natural predators'],
      market_hedging: ['Contract farming', 'Diversification']
    };
  }

  /**
   * Get optimal timing for a specific crop
   * @param {string} cropId - Crop ID
   * @returns {Object} Optimal timing data for the crop
   */
  async getOptimalTiming(cropId) {
    try {
      console.log(`🔍 Getting optimal timing for crop: ${cropId}`);
      
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      
      const timingData = {
        optimalPlanting: this.getOptimalPlantingTimes(cropId),
        growthStages: this.getCriticalGrowthStages(cropId),
        criticalPeriods: this.getCriticalPeriods(cropId),
        weatherSensitivity: this.getWeatherSensitivity(cropId),
        marketTiming: this.getMarketTiming(cropId)
      };
      
      console.log(`✅ Optimal timing calculated for ${cropId}:`, timingData);
      return timingData;
    } catch (error) {
      console.error('❌ Failed to get optimal timing:', error);
      throw error;
    }
  }

  /**
   * Get optimal planting times for a crop
   */
  getOptimalPlantingTimes(cropId) {
    const plantingTimes = {
      maize: ['March-April', 'September-October'],
      tomatoes: ['March-April', 'September-October'],
      beans: ['March-April', 'September-October'],
      coffee: ['March-May', 'September-November'],
      banana: ['Year-round (with irrigation)', 'March-May', 'September-November'],
      onions: ['February-March', 'August-September'],
      groundnuts: ['March-April', 'September-October'],
      rice: ['March-April', 'September-October'],
      cotton: ['March-April'],
      sugarcane: ['March-April', 'September-October'],
      pineapple: ['March-April', 'September-October'],
      mangoes: ['March-May', 'September-November'],
      avocados: ['March-May', 'September-November'],
      carrots: ['February-March', 'August-September'],
      spinach: ['Year-round'],
      millet: ['March-April', 'September-October'],
      soybeans: ['March-April', 'September-October'],
      cabbage: ['February-March', 'August-September'],
      oranges: ['March-May', 'September-November']
    };
    
    return plantingTimes[cropId] || ['March-April', 'September-October'];
  }

  /**
   * Get critical periods for a crop
   */
  getCriticalPeriods(cropId) {
    const criticalPeriods = {
      maize: [
        'Week 2: First weeding critical',
        'Week 4: Fertilizer application',
        'Week 8: Pest monitoring',
        'Week 12: Pre-harvest preparation'
      ],
      tomatoes: [
        'Week 1: Seedling care',
        'Week 3: Transplanting',
        'Week 6: Staking and pruning',
        'Week 10: Fruit development monitoring'
      ],
      beans: [
        'Week 2: First weeding',
        'Week 4: Fertilizer application',
        'Week 6: Flowering stage care',
        'Week 8: Pod development monitoring'
      ]
    };
    
    return criticalPeriods[cropId] || [
      'Week 2: First weeding critical',
      'Week 4: Fertilizer application',
      'Week 8: Pest monitoring',
      'Week 12: Pre-harvest preparation'
    ];
  }
}

export default new CropTimingService();
