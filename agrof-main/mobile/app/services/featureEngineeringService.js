/**
 * Feature Engineering Service - Batch 5
 * Feature engineering for ML model training and prediction
 */

import userFeedbackService from './userFeedbackService';
import enhancedAccuracyService from './enhancedAccuracyService';
import regionalPriceService from './regionalPriceService';
import seasonalPriceService from './seasonalPriceService';
import weatherIntegrationService from './weatherIntegrationService';

class FeatureEngineeringService {
  constructor() {
    this.featureSets = new Map();
    this.featureMappings = new Map();
    this.featureScalers = new Map();
    this.initialized = false;
  }

  /**
   * Initialize the feature engineering service
   */
  async initialize() {
    try {
      console.log('🔄 Initializing Feature Engineering Service...');
      
      // Initialize feature sets
      this.initializeFeatureSets();
      
      // Initialize feature mappings
      this.initializeFeatureMappings();
      
      // Initialize feature scalers
      this.initializeFeatureScalers();
      
      this.initialized = true;
      console.log('✅ Feature Engineering Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Feature Engineering Service:', error);
    }
  }

  /**
   * Initialize feature sets
   */
  initializeFeatureSets() {
    // Crop features
    this.featureSets.set('crop_features', {
      categorical: ['crop_id', 'category', 'planting_season', 'harvest_season'],
      numerical: ['growth_duration_days', 'yield_per_acre', 'market_price', 'roi_percentage'],
      boolean: ['drought_tolerant', 'flood_tolerant', 'pest_resistant']
    });

    // Regional features
    this.featureSets.set('regional_features', {
      categorical: ['region', 'soil_type', 'climate_zone'],
      numerical: ['temperature_avg', 'humidity_avg', 'rainfall_avg', 'altitude'],
      boolean: ['irrigation_available', 'market_access', 'transport_available']
    });

    // Weather features
    this.featureSets.set('weather_features', {
      categorical: ['season', 'weather_condition'],
      numerical: ['temperature', 'humidity', 'rainfall', 'wind_speed', 'uv_index'],
      boolean: ['drought_alert', 'flood_alert', 'extreme_weather']
    });

    // Market features
    this.featureSets.set('market_features', {
      categorical: ['market_type', 'demand_level'],
      numerical: ['price_volatility', 'market_demand', 'supply_level', 'transport_cost'],
      boolean: ['export_available', 'local_market', 'processing_available']
    });

    // User features
    this.featureSets.set('user_features', {
      categorical: ['user_type', 'experience_level'],
      numerical: ['price_sensitivity', 'quality_preference', 'availability_preference', 'delivery_preference'],
      boolean: ['organic_preference', 'local_preference', 'bulk_preference']
    });
  }

  /**
   * Initialize feature mappings
   */
  initializeFeatureMappings() {
    // Crop ID mapping
    this.featureMappings.set('crop_id', {
      'maize': 0,
      'tomatoes': 1,
      'beans': 2,
      'coffee': 3,
      'banana': 4,
      'onions': 5,
      'groundnuts': 6,
      'rice': 7,
      'cotton': 8,
      'sugarcane': 9,
      'pineapple': 10,
      'mangoes': 11,
      'avocados': 12,
      'carrots': 13,
      'spinach': 14,
      'millet': 15,
      'soybeans': 16,
      'cabbage': 17,
      'oranges': 18
    });

    // Region mapping
    this.featureMappings.set('region', {
      'Northern': 0,
      'Eastern': 1,
      'Central': 2,
      'Western': 3
    });

    // Season mapping
    this.featureMappings.set('season', {
      'First Rains': 0,
      'First Dry': 1,
      'Second Rains': 2,
      'Second Dry': 3
    });

    // Weather condition mapping
    this.featureMappings.set('weather_condition', {
      'sunny': 0,
      'partly_cloudy': 1,
      'cloudy': 2,
      'rainy': 3
    });

    // Market type mapping
    this.featureMappings.set('market_type', {
      'local': 0,
      'regional': 1,
      'national': 2,
      'export': 3
    });

    // Demand level mapping
    this.featureMappings.set('demand_level', {
      'low': 0,
      'moderate': 1,
      'high': 2,
      'very_high': 3
    });
  }

  /**
   * Initialize feature scalers
   */
  initializeFeatureScalers() {
    // Temperature scaler
    this.featureScalers.set('temperature', {
      min: 15,
      max: 35,
      mean: 25,
      std: 5
    });

    // Humidity scaler
    this.featureScalers.set('humidity', {
      min: 40,
      max: 90,
      mean: 65,
      std: 15
    });

    // Rainfall scaler
    this.featureScalers.set('rainfall', {
      min: 0,
      max: 2000,
      mean: 1000,
      std: 500
    });

    // Price scaler
    this.featureScalers.set('price', {
      min: 500,
      max: 10000,
      mean: 3000,
      std: 2000
    });

    // ROI scaler
    this.featureScalers.set('roi', {
      min: 0,
      max: 500,
      mean: 200,
      std: 100
    });
  }

  /**
   * Extract features for a recommendation
   * @param {Object} recommendationData - Recommendation data
   * @returns {Object} Extracted features
   */
  extractFeatures(recommendationData) {
    try {
      const features = {};

      // Extract crop features
      features.crop_id = this.encodeCategoricalFeature('crop_id', recommendationData.crop_id);
      features.category = this.encodeCategoricalFeature('category', recommendationData.category);
      features.planting_season = this.encodeCategoricalFeature('season', recommendationData.planting_season);
      features.harvest_season = this.encodeCategoricalFeature('season', recommendationData.harvest_season);
      features.growth_duration_days = this.parseGrowthDuration(recommendationData.growth_duration);
      features.yield_per_acre = recommendationData.yield_per_acre || 0;
      features.market_price = recommendationData.market_price || 0;
      features.roi_percentage = recommendationData.roi_percentage || 0;

      // Extract regional features
      features.region = this.encodeCategoricalFeature('region', recommendationData.region);
      features.soil_type = this.encodeSoilType(recommendationData.soil_type);
      features.climate_zone = this.encodeClimateZone(recommendationData.region);
      features.temperature_avg = this.getRegionalTemperature(recommendationData.region);
      features.humidity_avg = this.getRegionalHumidity(recommendationData.region);
      features.rainfall_avg = this.getRegionalRainfall(recommendationData.region);
      features.altitude = this.getRegionalAltitude(recommendationData.region);

      // Extract weather features
      features.season = this.encodeCategoricalFeature('season', recommendationData.season);
      features.weather_condition = this.encodeCategoricalFeature('weather_condition', recommendationData.weather_condition);
      features.temperature = recommendationData.temperature || 25;
      features.humidity = recommendationData.humidity || 65;
      features.rainfall = recommendationData.rainfall || 1000;
      features.wind_speed = recommendationData.wind_speed || 5;
      features.uv_index = recommendationData.uv_index || 6;

      // Extract market features
      features.market_type = this.encodeCategoricalFeature('market_type', recommendationData.market_type);
      features.demand_level = this.encodeCategoricalFeature('demand_level', recommendationData.demand_level);
      features.price_volatility = recommendationData.price_volatility || 0.1;
      features.market_demand = recommendationData.market_demand || 0.5;
      features.supply_level = recommendationData.supply_level || 0.5;
      features.transport_cost = recommendationData.transport_cost || 0;

      // Extract user features
      const userPreferences = userFeedbackService.getUserPreferences(recommendationData.user_id);
      features.price_sensitivity = userPreferences.preferences.price_sensitivity;
      features.quality_preference = userPreferences.preferences.quality_preference;
      features.availability_preference = userPreferences.preferences.availability_preference;
      features.delivery_preference = userPreferences.preferences.delivery_preference;

      // Extract derived features
      features.weather_score = this.calculateWeatherScore(features);
      features.market_score = this.calculateMarketScore(features);
      features.user_preference_score = this.calculateUserPreferenceScore(features);
      features.seasonal_score = this.calculateSeasonalScore(features);
      features.regional_score = this.calculateRegionalScore(features);

      return features;

    } catch (error) {
      console.error('❌ Failed to extract features:', error);
      return {};
    }
  }

  /**
   * Encode categorical feature
   */
  encodeCategoricalFeature(featureName, value) {
    const mapping = this.featureMappings.get(featureName);
    return mapping ? (mapping[value] !== undefined ? mapping[value] : 0) : 0;
  }

  /**
   * Encode soil type
   */
  encodeSoilType(soilType) {
    const soilTypes = {
      'well-drained loamy': 0,
      'sandy loam': 1,
      'clay loam': 2,
      'sandy': 3,
      'clay': 4,
      'loamy': 5
    };
    return soilTypes[soilType] || 0;
  }

  /**
   * Encode climate zone
   */
  encodeClimateZone(region) {
    const climateZones = {
      'Northern': 0, // Semi-arid
      'Eastern': 1, // Humid
      'Central': 2, // Temperate
      'Western': 3  // Tropical
    };
    return climateZones[region] || 0;
  }

  /**
   * Parse growth duration to days
   */
  parseGrowthDuration(duration) {
    if (typeof duration === 'number') return duration;
    if (typeof duration === 'string') {
      const match = duration.match(/(\d+)-(\d+)/);
      if (match) {
        return (parseInt(match[1]) + parseInt(match[2])) / 2;
      }
    }
    return 90; // Default 90 days
  }

  /**
   * Get regional temperature
   */
  getRegionalTemperature(region) {
    const temperatures = {
      'Northern': 28,
      'Eastern': 26,
      'Central': 25,
      'Western': 27
    };
    return temperatures[region] || 25;
  }

  /**
   * Get regional humidity
   */
  getRegionalHumidity(region) {
    const humidities = {
      'Northern': 65,
      'Eastern': 70,
      'Central': 75,
      'Western': 80
    };
    return humidities[region] || 65;
  }

  /**
   * Get regional rainfall
   */
  getRegionalRainfall(region) {
    const rainfalls = {
      'Northern': 800,
      'Eastern': 900,
      'Central': 1000,
      'Western': 1200
    };
    return rainfalls[region] || 1000;
  }

  /**
   * Get regional altitude
   */
  getRegionalAltitude(region) {
    const altitudes = {
      'Northern': 1000,
      'Eastern': 1200,
      'Central': 1400,
      'Western': 1100
    };
    return altitudes[region] || 1200;
  }

  /**
   * Calculate weather score
   */
  calculateWeatherScore(features) {
    let score = 0.5; // Base score

    // Temperature score
    const tempScore = this.calculateTemperatureScore(features.temperature);
    score += tempScore * 0.3;

    // Humidity score
    const humidityScore = this.calculateHumidityScore(features.humidity);
    score += humidityScore * 0.2;

    // Rainfall score
    const rainfallScore = this.calculateRainfallScore(features.rainfall);
    score += rainfallScore * 0.3;

    // Weather condition score
    const conditionScore = this.calculateWeatherConditionScore(features.weather_condition);
    score += conditionScore * 0.2;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Calculate temperature score
   */
  calculateTemperatureScore(temperature) {
    const optimalTemp = 25;
    const deviation = Math.abs(temperature - optimalTemp);
    return Math.max(0, 1 - deviation / 10);
  }

  /**
   * Calculate humidity score
   */
  calculateHumidityScore(humidity) {
    const optimalHumidity = 65;
    const deviation = Math.abs(humidity - optimalHumidity);
    return Math.max(0, 1 - deviation / 25);
  }

  /**
   * Calculate rainfall score
   */
  calculateRainfallScore(rainfall) {
    const optimalRainfall = 1000;
    const deviation = Math.abs(rainfall - optimalRainfall);
    return Math.max(0, 1 - deviation / 500);
  }

  /**
   * Calculate weather condition score
   */
  calculateWeatherConditionScore(weatherCondition) {
    const conditionScores = {
      0: 1.0, // sunny
      1: 0.8, // partly_cloudy
      2: 0.6, // cloudy
      3: 0.4  // rainy
    };
    return conditionScores[weatherCondition] || 0.5;
  }

  /**
   * Calculate market score
   */
  calculateMarketScore(features) {
    let score = 0.5; // Base score

    // Market demand score
    const demandScore = features.market_demand;
    score += demandScore * 0.3;

    // Price volatility score (inverse)
    const volatilityScore = 1 - features.price_volatility;
    score += volatilityScore * 0.2;

    // Supply level score
    const supplyScore = features.supply_level;
    score += supplyScore * 0.2;

    // Market type score
    const marketTypeScore = this.calculateMarketTypeScore(features.market_type);
    score += marketTypeScore * 0.3;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Calculate market type score
   */
  calculateMarketTypeScore(marketType) {
    const marketTypeScores = {
      0: 0.6, // local
      1: 0.7, // regional
      2: 0.8, // national
      3: 0.9  // export
    };
    return marketTypeScores[marketType] || 0.5;
  }

  /**
   * Calculate user preference score
   */
  calculateUserPreferenceScore(features) {
    let score = 0.5; // Base score

    // Price sensitivity score (inverse)
    const priceScore = 1 - features.price_sensitivity;
    score += priceScore * 0.25;

    // Quality preference score
    const qualityScore = features.quality_preference;
    score += qualityScore * 0.25;

    // Availability preference score
    const availabilityScore = features.availability_preference;
    score += availabilityScore * 0.25;

    // Delivery preference score
    const deliveryScore = features.delivery_preference;
    score += deliveryScore * 0.25;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Calculate seasonal score
   */
  calculateSeasonalScore(features) {
    const seasonScores = {
      0: 0.9, // First Rains
      1: 0.7, // First Dry
      2: 0.95, // Second Rains
      3: 0.6  // Second Dry
    };
    return seasonScores[features.season] || 0.5;
  }

  /**
   * Calculate regional score
   */
  calculateRegionalScore(features) {
    const regionScores = {
      0: 0.8, // Northern
      1: 0.9, // Eastern
      2: 0.95, // Central
      3: 0.85 // Western
    };
    return regionScores[features.region] || 0.5;
  }

  /**
   * Normalize features
   * @param {Object} features - Raw features
   * @returns {Object} Normalized features
   */
  normalizeFeatures(features) {
    const normalizedFeatures = { ...features };

    // Normalize numerical features
    Object.keys(normalizedFeatures).forEach(key => {
      if (typeof normalizedFeatures[key] === 'number') {
        const scaler = this.featureScalers.get(key);
        if (scaler) {
          normalizedFeatures[key] = (normalizedFeatures[key] - scaler.mean) / scaler.std;
        }
      }
    });

    return normalizedFeatures;
  }

  /**
   * Get feature importance scores
   * @returns {Object} Feature importance scores
   */
  getFeatureImportance() {
    return {
      crop_id: 0.15,
      region: 0.12,
      season: 0.10,
      weather_score: 0.20,
      market_score: 0.18,
      user_preference_score: 0.15,
      temperature: 0.05,
      humidity: 0.03,
      rainfall: 0.02
    };
  }

  /**
   * Get all feature information
   * @returns {Object} All feature information
   */
  getAllFeatureInfo() {
    return {
      feature_sets: Object.fromEntries(this.featureSets),
      feature_mappings: Object.fromEntries(this.featureMappings),
      feature_scalers: Object.fromEntries(this.featureScalers),
      feature_importance: this.getFeatureImportance(),
      initialized: this.initialized
    };
  }
}

export default new FeatureEngineeringService();
