/**
 * Feature Engineering Service
 * Handles feature extraction, transformation, and selection for ML models
 */

class FeatureEngineeringService {
  constructor() {
    this.featureTransformers = new Map();
    this.featureSelectors = new Map();
    this.featureImportance = new Map();
    this.initialized = false;
  }

  /**
   * Initialize the Feature Engineering Service
   */
  async initialize() {
    try {
      console.log('🔧 Initializing Feature Engineering Service...');
      
      // Setup feature transformers
      this.setupFeatureTransformers();
      
      // Setup feature selectors
      this.setupFeatureSelectors();
      
      this.initialized = true;
      console.log('✅ Feature Engineering Service initialized successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Feature Engineering Service:', error);
      return false;
    }
  }

  /**
   * Setup feature transformers
   */
  setupFeatureTransformers() {
    this.featureTransformers.set('numerical_scaling', {
      method: 'standard_scaler',
      description: 'Standardize numerical features'
    });

    this.featureTransformers.set('categorical_encoding', {
      method: 'one_hot_encoding',
      description: 'Encode categorical variables'
    });

    this.featureTransformers.set('temporal_features', {
      method: 'time_series_extraction',
      description: 'Extract temporal features from dates'
    });

    this.featureTransformers.set('weather_features', {
      method: 'weather_aggregation',
      description: 'Aggregate weather data by time periods'
    });
  }

  /**
   * Setup feature selectors
   */
  setupFeatureSelectors() {
    this.featureSelectors.set('correlation_filter', {
      method: 'correlation_analysis',
      threshold: 0.8,
      description: 'Remove highly correlated features'
    });

    this.featureSelectors.set('variance_filter', {
      method: 'variance_threshold',
      threshold: 0.01,
      description: 'Remove low variance features'
    });

    this.featureSelectors.set('recursive_elimination', {
      method: 'recursive_feature_elimination',
      n_features: 10,
      description: 'Select top N features using RFE'
    });
  }

  /**
   * Extract features from raw data
   * @param {Object} rawData - Raw input data
   * @param {string} featureType - Type of features to extract
   * @returns {Object} Extracted features
   */
  async extractFeatures(rawData, featureType = 'all') {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log(`🔍 Extracting ${featureType} features...`);

      const features = {};

      // Extract basic features
      if (featureType === 'all' || featureType === 'basic') {
        features.basic = this.extractBasicFeatures(rawData);
      }

      // Extract temporal features
      if (featureType === 'all' || featureType === 'temporal') {
        features.temporal = this.extractTemporalFeatures(rawData);
      }

      // Extract weather features
      if (featureType === 'all' || featureType === 'weather') {
        features.weather = this.extractWeatherFeatures(rawData);
      }

      // Extract soil features
      if (featureType === 'all' || featureType === 'soil') {
        features.soil = this.extractSoilFeatures(rawData);
      }

      console.log(`✅ Feature extraction completed. Generated ${Object.keys(features).length} feature groups`);
      return features;
    } catch (error) {
      console.error('❌ Error extracting features:', error);
      throw error;
    }
  }

  /**
   * Extract basic features
   * @param {Object} data - Input data
   * @returns {Object} Basic features
   */
  extractBasicFeatures(data) {
    return {
      crop_type: data.crop_type || 'unknown',
      season: data.season || 'unknown',
      region: data.region || 'unknown',
      soil_type: data.soil_type || 'unknown',
      planting_date: data.planting_date || null,
      expected_harvest: data.expected_harvest || null
    };
  }

  /**
   * Extract temporal features
   * @param {Object} data - Input data
   * @returns {Object} Temporal features
   */
  extractTemporalFeatures(data) {
    const now = new Date();
    const plantingDate = data.planting_date ? new Date(data.planting_date) : null;
    
    return {
      current_month: now.getMonth() + 1,
      current_season: this.getSeason(now.getMonth()),
      days_since_planting: plantingDate ? Math.floor((now - plantingDate) / (1000 * 60 * 60 * 24)) : null,
      planting_month: plantingDate ? plantingDate.getMonth() + 1 : null,
      planting_season: plantingDate ? this.getSeason(plantingDate.getMonth()) : null
    };
  }

  /**
   * Extract weather features
   * @param {Object} data - Input data
   * @returns {Object} Weather features
   */
  extractWeatherFeatures(data) {
    const weather = data.weather || {};
    
    return {
      temperature_avg: weather.temperature_avg || 0,
      temperature_min: weather.temperature_min || 0,
      temperature_max: weather.temperature_max || 0,
      humidity: weather.humidity || 0,
      rainfall: weather.rainfall || 0,
      wind_speed: weather.wind_speed || 0,
      weather_condition: weather.condition || 'unknown'
    };
  }

  /**
   * Extract soil features
   * @param {Object} data - Input data
   * @returns {Object} Soil features
   */
  extractSoilFeatures(data) {
    const soil = data.soil || {};
    
    return {
      ph_level: soil.ph || 7.0,
      nitrogen_content: soil.nitrogen || 0,
      phosphorus_content: soil.phosphorus || 0,
      potassium_content: soil.potassium || 0,
      organic_matter: soil.organic_matter || 0,
      moisture_content: soil.moisture || 0,
      soil_type: soil.type || 'unknown'
    };
  }

  /**
   * Transform features using specified transformer
   * @param {Object} features - Input features
   * @param {string} transformerName - Name of the transformer
   * @returns {Object} Transformed features
   */
  async transformFeatures(features, transformerName) {
    try {
      const transformer = this.featureTransformers.get(transformerName);
      if (!transformer) {
        throw new Error(`Transformer ${transformerName} not found`);
      }

      console.log(`🔄 Transforming features using ${transformerName}...`);

      let transformedFeatures = { ...features };

      switch (transformerName) {
        case 'numerical_scaling':
          transformedFeatures = this.applyNumericalScaling(transformedFeatures);
          break;
        case 'categorical_encoding':
          transformedFeatures = this.applyCategoricalEncoding(transformedFeatures);
          break;
        case 'temporal_features':
          transformedFeatures = this.extractTemporalFeatures(transformedFeatures);
          break;
        case 'weather_features':
          transformedFeatures = this.aggregateWeatherFeatures(transformedFeatures);
          break;
        default:
          console.warn(`Unknown transformer: ${transformerName}`);
      }

      console.log(`✅ Feature transformation completed using ${transformerName}`);
      return transformedFeatures;
    } catch (error) {
      console.error(`❌ Error transforming features:`, error);
      throw error;
    }
  }

  /**
   * Apply numerical scaling
   * @param {Object} features - Input features
   * @returns {Object} Scaled features
   */
  applyNumericalScaling(features) {
    const numericalFeatures = ['temperature_avg', 'humidity', 'rainfall', 'ph_level'];
    const scaledFeatures = { ...features };

    numericalFeatures.forEach(feature => {
      if (scaledFeatures[feature] !== undefined) {
        // Simple min-max scaling (0-1)
        scaledFeatures[`${feature}_scaled`] = Math.min(Math.max(scaledFeatures[feature] / 100, 0), 1);
      }
    });

    return scaledFeatures;
  }

  /**
   * Apply categorical encoding
   * @param {Object} features - Input features
   * @returns {Object} Encoded features
   */
  applyCategoricalEncoding(features) {
    const categoricalFeatures = ['crop_type', 'season', 'region', 'soil_type'];
    const encodedFeatures = { ...features };

    categoricalFeatures.forEach(feature => {
      if (encodedFeatures[feature]) {
        // Simple one-hot encoding simulation
        const value = encodedFeatures[feature].toLowerCase();
        encodedFeatures[`${feature}_encoded`] = this.hashString(value) % 10; // Simple hash encoding
      }
    });

    return encodedFeatures;
  }

  /**
   * Select features using specified selector
   * @param {Object} features - Input features
   * @param {string} selectorName - Name of the selector
   * @returns {Object} Selected features
   */
  async selectFeatures(features, selectorName) {
    try {
      const selector = this.featureSelectors.get(selectorName);
      if (!selector) {
        throw new Error(`Selector ${selectorName} not found`);
      }

      console.log(`🎯 Selecting features using ${selectorName}...`);

      let selectedFeatures = { ...features };

      switch (selectorName) {
        case 'correlation_filter':
          selectedFeatures = this.applyCorrelationFilter(selectedFeatures);
          break;
        case 'variance_filter':
          selectedFeatures = this.applyVarianceFilter(selectedFeatures);
          break;
        case 'recursive_elimination':
          selectedFeatures = this.applyRecursiveElimination(selectedFeatures, selector.n_features);
          break;
        default:
          console.warn(`Unknown selector: ${selectorName}`);
      }

      console.log(`✅ Feature selection completed using ${selectorName}`);
      return selectedFeatures;
    } catch (error) {
      console.error(`❌ Error selecting features:`, error);
      throw error;
    }
  }

  /**
   * Apply correlation filter
   * @param {Object} features - Input features
   * @returns {Object} Filtered features
   */
  applyCorrelationFilter(features) {
    // Simulate correlation filtering
    const featureKeys = Object.keys(features);
    const selectedKeys = featureKeys.slice(0, Math.floor(featureKeys.length * 0.8)); // Keep 80%
    
    const filteredFeatures = {};
    selectedKeys.forEach(key => {
      filteredFeatures[key] = features[key];
    });

    return filteredFeatures;
  }

  /**
   * Apply variance filter
   * @param {Object} features - Input features
   * @returns {Object} Filtered features
   */
  applyVarianceFilter(features) {
    // Simulate variance filtering
    const featureKeys = Object.keys(features);
    const selectedKeys = featureKeys.filter(key => {
      const value = features[key];
      return typeof value === 'number' && Math.abs(value) > 0.01;
    });
    
    const filteredFeatures = {};
    selectedKeys.forEach(key => {
      filteredFeatures[key] = features[key];
    });

    return filteredFeatures;
  }

  /**
   * Apply recursive elimination
   * @param {Object} features - Input features
   * @param {number} nFeatures - Number of features to select
   * @returns {Object} Selected features
   */
  applyRecursiveElimination(features, nFeatures) {
    const featureKeys = Object.keys(features);
    const selectedKeys = featureKeys.slice(0, Math.min(nFeatures, featureKeys.length));
    
    const selectedFeatures = {};
    selectedKeys.forEach(key => {
      selectedFeatures[key] = features[key];
    });

    return selectedFeatures;
  }

  /**
   * Get season from month
   * @param {number} month - Month (0-11)
   * @returns {string} Season name
   */
  getSeason(month) {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  /**
   * Hash string to number
   * @param {string} str - Input string
   * @returns {number} Hash value
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get feature importance scores
   * @param {Object} features - Input features
   * @returns {Object} Feature importance scores
   */
  getFeatureImportance(features) {
    const importance = {};
    const featureKeys = Object.keys(features);
    
    featureKeys.forEach(key => {
      // Simulate importance based on feature type and value
      let score = 0.5; // Base importance
      
      if (key.includes('weather') || key.includes('temperature')) {
        score += 0.3;
      }
      if (key.includes('soil') || key.includes('ph')) {
        score += 0.2;
      }
      if (key.includes('temporal') || key.includes('season')) {
        score += 0.1;
      }
      
      importance[key] = Math.min(score, 1.0);
    });

    return importance;
  }

  /**
   * Clear all feature data
   */
  clearFeatures() {
    this.featureImportance.clear();
    console.log('🧹 Feature Engineering Service data cleared');
  }
}

// Create and export singleton instance
const featureEngineeringService = new FeatureEngineeringService();
export default featureEngineeringService;