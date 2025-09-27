import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

class IoTService {
  constructor() {
    this.sensors = {
      accelerometer: null,
      gyroscope: null,
      magnetometer: null
    };
    this.isMonitoring = false;
    this.dataInterval = null;
    this.sensorData = {
      soil: {
        // Basic parameters
        moisture: 0,
        temperature: 0,
        ph: 0,
        
        // Enhanced parameters
        organicMatter: 0,
        soilTexture: 'loam',
        cec: 0, // Cation Exchange Capacity
        compaction: 0,
        microbialActivity: 0,
        drainage: 0,
        
        // Enhanced nutrients
        nutrients: {
          primary: {
            nitrogen: 0,
            phosphorus: 0,
            potassium: 0
          },
          secondary: {
            calcium: 0,
            magnesium: 0,
            sulfur: 0
          },
          micronutrients: {
            iron: 0,
            zinc: 0,
            manganese: 0,
            copper: 0,
            boron: 0,
            molybdenum: 0
          }
        }
      },
      weather: {
        temperature: 0,
        humidity: 0,
        pressure: 0,
        windSpeed: 0,
        rainfall: 0
      },
      location: {
        latitude: 0,
        longitude: 0,
        altitude: 0
      }
    };
  }

  // Initialize IoT sensors
  async initialize() {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      // Set sensor update intervals
      Accelerometer.setUpdateInterval(1000);
      Gyroscope.setUpdateInterval(1000);
      Magnetometer.setUpdateInterval(1000);

      console.log('IoT Service initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing IoT service:', error);
      return false;
    }
  }

  // Start monitoring sensors
  async startMonitoring() {
    try {
      if (this.isMonitoring) return;

      this.isMonitoring = true;
      
      // Start accelerometer monitoring
      this.sensors.accelerometer = Accelerometer.addListener(accelerometerData => {
        this.processAccelerometerData(accelerometerData);
      });

      // Start gyroscope monitoring
      this.sensors.gyroscope = Gyroscope.addListener(gyroscopeData => {
        this.processGyroscopeData(gyroscopeData);
      });

      // Start magnetometer monitoring
      this.sensors.magnetometer = Magnetometer.addListener(magnetometerData => {
        this.processMagnetometerData(magnetometerData);
      });

      // Start data collection interval
      this.dataInterval = setInterval(() => {
        this.collectSensorData();
      }, 5000); // Collect data every 5 seconds

      console.log('IoT monitoring started');
      return true;
    } catch (error) {
      console.error('Error starting IoT monitoring:', error);
      return false;
    }
  }

  // Stop monitoring sensors
  async stopMonitoring() {
    try {
      if (!this.isMonitoring) return;

      this.isMonitoring = false;

      // Remove sensor listeners
      if (this.sensors.accelerometer) {
        this.sensors.accelerometer.remove();
      }
      if (this.sensors.gyroscope) {
        this.sensors.gyroscope.remove();
      }
      if (this.sensors.magnetometer) {
        this.sensors.magnetometer.remove();
      }

      // Clear data interval
      if (this.dataInterval) {
        clearInterval(this.dataInterval);
        this.dataInterval = null;
      }

      console.log('IoT monitoring stopped');
      return true;
    } catch (error) {
      console.error('Error stopping IoT monitoring:', error);
      return false;
    }
  }

  // Process accelerometer data
  processAccelerometerData(data) {
    // Use accelerometer data to simulate soil vibration/movement
    const vibration = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
    
    // Simulate soil moisture based on vibration (mock data)
    this.sensorData.soil.moisture = Math.max(0, Math.min(100, 50 + (vibration - 1) * 20));
  }

  // Process gyroscope data
  processGyroscopeData(data) {
    // Use gyroscope data to simulate temperature changes
    const rotation = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
    
    // Simulate soil temperature based on rotation (mock data)
    this.sensorData.soil.temperature = 20 + (rotation * 5);
  }

  // Process magnetometer data
  processMagnetometerData(data) {
    // Use magnetometer data to simulate pH levels
    const magneticField = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
    
    // Simulate soil pH based on magnetic field (mock data)
    this.sensorData.soil.ph = 6.0 + (magneticField - 25) * 0.1;
  }

  // Collect comprehensive sensor data
  async collectSensorData() {
    try {
      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      this.sensorData.location = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude || 0
      };

      // Simulate enhanced sensor data
      this.sensorData.soil.organicMatter = 2 + Math.random() * 4;
      this.sensorData.soil.cec = 10 + Math.random() * 20;
      this.sensorData.soil.compaction = 20 + Math.random() * 60;
      this.sensorData.soil.microbialActivity = 30 + Math.random() * 50;
      this.sensorData.soil.drainage = 40 + Math.random() * 40;
      
      // Enhanced nutrients
      this.sensorData.soil.nutrients.primary = {
        nitrogen: 20 + Math.random() * 30,
        phosphorus: 15 + Math.random() * 25,
        potassium: 25 + Math.random() * 35
      };
      
      this.sensorData.soil.nutrients.secondary = {
        calcium: 100 + Math.random() * 200,
        magnesium: 50 + Math.random() * 100,
        sulfur: 20 + Math.random() * 40
      };
      
      this.sensorData.soil.nutrients.micronutrients = {
        iron: 5 + Math.random() * 15,
        zinc: 2 + Math.random() * 8,
        manganese: 3 + Math.random() * 12,
        copper: 1 + Math.random() * 4,
        boron: 0.5 + Math.random() * 2,
        molybdenum: 0.1 + Math.random() * 0.5
      };

      this.sensorData.weather = {
        temperature: 25 + Math.random() * 10,
        humidity: 40 + Math.random() * 40,
        pressure: 1013 + Math.random() * 20,
        windSpeed: Math.random() * 15,
        rainfall: Math.random() * 5
      };

      // Save data to local storage
      await this.saveSensorData(this.sensorData);

      return this.sensorData;
    } catch (error) {
      console.error('Error collecting sensor data:', error);
      return null;
    }
  }

  // Get current sensor data
  getCurrentData() {
    return this.sensorData;
  }

  // Save sensor data to local storage
  async saveSensorData(data) {
    try {
      const timestamp = new Date().toISOString();
      const dataPoint = {
        ...data,
        timestamp,
        id: Date.now().toString()
      };

      const savedData = await AsyncStorage.getItem('iotSensorData');
      const sensorData = savedData ? JSON.parse(savedData) : [];
      
      sensorData.push(dataPoint);
      
      // Keep only last 1000 data points
      if (sensorData.length > 1000) {
        sensorData.splice(0, sensorData.length - 1000);
      }
      
      await AsyncStorage.setItem('iotSensorData', JSON.stringify(sensorData));
      return true;
    } catch (error) {
      console.error('Error saving sensor data:', error);
      return false;
    }
  }

  // Get sensor data history
  async getSensorDataHistory(limit = 100) {
    try {
      const savedData = await AsyncStorage.getItem('iotSensorData');
      const sensorData = savedData ? JSON.parse(savedData) : [];
      
      return sensorData.slice(-limit);
    } catch (error) {
      console.error('Error getting sensor data history:', error);
      return [];
    }
  }

  // Fertilizer database from agrof store
  getFertilizerDatabase() {
    return {
      nitrogen: [
        {
          name: 'Urea',
          price: 2500,
          unit: 'per 50kg bag',
          npk: '46-0-0',
          usage: '50-100 kg/ha',
          timing: 'Before planting and top dressing',
          method: 'Broadcast and incorporate'
        },
        {
          name: 'Ammonium Sulphate',
          price: 2200,
          unit: 'per 50kg bag',
          npk: '21-0-0',
          usage: '100-150 kg/ha',
          timing: 'Before planting',
          method: 'Broadcast and incorporate'
        }
      ],
      phosphorus: [
        {
          name: 'DAP (Diammonium Phosphate)',
          price: 2800,
          unit: 'per 50kg bag',
          npk: '18-46-0',
          usage: '25-50 kg/ha',
          timing: 'At planting',
          method: 'Band placement near seeds'
        },
        {
          name: 'Single Super Phosphate',
          price: 2000,
          unit: 'per 50kg bag',
          npk: '0-20-0',
          usage: '50-100 kg/ha',
          timing: 'At planting',
          method: 'Broadcast and incorporate'
        }
      ],
      potassium: [
        {
          name: 'Muriate of Potash',
          price: 3000,
          unit: 'per 50kg bag',
          npk: '0-0-60',
          usage: '25-50 kg/ha',
          timing: 'At planting',
          method: 'Broadcast and incorporate'
        },
        {
          name: 'Sulphate of Potash',
          price: 3200,
          unit: 'per 50kg bag',
          npk: '0-0-50',
          usage: '30-60 kg/ha',
          timing: 'At planting',
          method: 'Broadcast and incorporate'
        }
      ],
      organic: [
        {
          name: 'Compost',
          price: 1500,
          unit: 'per ton',
          npk: '1-1-1',
          usage: '10-20 tons/ha',
          timing: 'Before planting',
          method: 'Broadcast and incorporate'
        },
        {
          name: 'Farmyard Manure',
          price: 1000,
          unit: 'per ton',
          npk: '0.5-0.5-0.5',
          usage: '15-25 tons/ha',
          timing: 'Before planting',
          method: 'Broadcast and incorporate'
        }
      ]
    };
  }

  // Get fertilizer recommendations based on soil analysis
  getFertilizerRecommendations(soilData) {
    const fertilizerDB = this.getFertilizerDatabase();
    const recommendations = [];
    
    // Nitrogen recommendations
    if (soilData.nutrients.primary.nitrogen < 20) {
      const nitrogenFertilizers = fertilizerDB.nitrogen;
      nitrogenFertilizers.forEach(fertilizer => {
        recommendations.push({
          type: 'Nitrogen Deficiency',
          fertilizer: fertilizer.name,
          price: fertilizer.price,
          unit: fertilizer.unit,
          npk: fertilizer.npk,
          usage: fertilizer.usage,
          timing: fertilizer.timing,
          method: fertilizer.method,
          priority: 'high',
          costPerHectare: this.calculateCostPerHectare(fertilizer.usage, fertilizer.price)
        });
      });
    }
    
    // Phosphorus recommendations
    if (soilData.nutrients.primary.phosphorus < 15) {
      const phosphorusFertilizers = fertilizerDB.phosphorus;
      phosphorusFertilizers.forEach(fertilizer => {
        recommendations.push({
          type: 'Phosphorus Deficiency',
          fertilizer: fertilizer.name,
          price: fertilizer.price,
          unit: fertilizer.unit,
          npk: fertilizer.npk,
          usage: fertilizer.usage,
          timing: fertilizer.timing,
          method: fertilizer.method,
          priority: 'high',
          costPerHectare: this.calculateCostPerHectare(fertilizer.usage, fertilizer.price)
        });
      });
    }
    
    // Potassium recommendations
    if (soilData.nutrients.primary.potassium < 25) {
      const potassiumFertilizers = fertilizerDB.potassium;
      potassiumFertilizers.forEach(fertilizer => {
        recommendations.push({
          type: 'Potassium Deficiency',
          fertilizer: fertilizer.name,
          price: fertilizer.price,
          unit: fertilizer.unit,
          npk: fertilizer.npk,
          usage: fertilizer.usage,
          timing: fertilizer.timing,
          method: fertilizer.method,
          priority: 'medium',
          costPerHectare: this.calculateCostPerHectare(fertilizer.usage, fertilizer.price)
        });
      });
    }
    
    // Organic matter recommendations
    if (soilData.organicMatter < 2) {
      const organicFertilizers = fertilizerDB.organic;
      organicFertilizers.forEach(fertilizer => {
        recommendations.push({
          type: 'Low Organic Matter',
          fertilizer: fertilizer.name,
          price: fertilizer.price,
          unit: fertilizer.unit,
          npk: fertilizer.npk,
          usage: fertilizer.usage,
          timing: fertilizer.timing,
          method: fertilizer.method,
          priority: 'high',
          costPerHectare: this.calculateCostPerHectare(fertilizer.usage, fertilizer.price)
        });
      });
    }
    
    return recommendations;
  }

  // Calculate cost per hectare
  calculateCostPerHectare(usage, pricePerUnit) {
    const usageAmount = parseFloat(usage.split('-')[0]); // Get minimum usage
    const costPerHectare = (usageAmount / 50) * pricePerUnit; // Assuming 50kg bags
    return Math.round(costPerHectare);
  }

  // Get irrigation advice based on soil and weather data
  getIrrigationAdvice(soilData, weatherData) {
    const advice = [];
    
    // Moisture-based advice
    if (soilData.moisture < 30) {
      advice.push({
        type: 'Critical Irrigation',
        message: 'Soil moisture is critically low. Immediate irrigation required.',
        method: 'Drip irrigation or sprinkler',
        frequency: 'Daily',
        amount: '15-20 mm per application',
        timing: 'Early morning (6-8 AM)',
        priority: 'critical',
        cost: 'Low - efficient water use'
      });
    } else if (soilData.moisture < 50) {
      advice.push({
        type: 'Moderate Irrigation',
        message: 'Soil moisture is low. Regular irrigation needed.',
        method: 'Drip irrigation recommended',
        frequency: 'Every 2-3 days',
        amount: '10-15 mm per application',
        timing: 'Early morning or late evening',
        priority: 'high',
        cost: 'Medium - moderate water use'
      });
    } else if (soilData.moisture > 80) {
      advice.push({
        type: 'Drainage Required',
        message: 'Soil moisture is too high. Improve drainage.',
        method: 'Drainage channels or raised beds',
        frequency: 'As needed',
        amount: 'Reduce irrigation',
        timing: 'Stop irrigation until moisture drops',
        priority: 'high',
        cost: 'Low - reduce water use'
      });
    }
    
    // Weather-based advice
    if (weatherData.temperature > 35) {
      advice.push({
        type: 'Heat Stress Management',
        message: 'High temperature detected. Increase irrigation frequency.',
        method: 'Frequent light irrigation',
        frequency: 'Twice daily',
        amount: '5-10 mm per application',
        timing: 'Early morning and late evening',
        priority: 'high',
        cost: 'Medium - increased water use'
      });
    }
    
    if (weatherData.humidity < 30) {
      advice.push({
        type: 'Low Humidity Response',
        message: 'Low humidity detected. Increase irrigation.',
        method: 'Overhead irrigation or misting',
        frequency: 'Daily',
        amount: '12-18 mm per application',
        timing: 'Early morning',
        priority: 'medium',
        cost: 'Medium - moderate water use'
      });
    }
    
    // Soil texture-based advice
    if (soilData.soilTexture === 'sandy') {
      advice.push({
        type: 'Sandy Soil Management',
        message: 'Sandy soil requires frequent, light irrigation.',
        method: 'Drip irrigation with frequent applications',
        frequency: 'Daily or twice daily',
        amount: '5-8 mm per application',
        timing: 'Early morning and late afternoon',
        priority: 'medium',
        cost: 'Medium - frequent applications'
      });
    } else if (soilData.soilTexture === 'clay') {
      advice.push({
        type: 'Clay Soil Management',
        message: 'Clay soil requires less frequent, deep irrigation.',
        method: 'Deep irrigation with longer intervals',
        frequency: 'Every 3-4 days',
        amount: '15-25 mm per application',
        timing: 'Early morning',
        priority: 'medium',
        cost: 'Low - efficient water use'
      });
    }
    
    return advice;
  }

  // Calculate soil health score
  calculateSoilHealthScore(soilData) {
    let score = 0;
    const factors = [];
    const improvements = [];
    
    // Moisture factor (20 points)
    if (soilData.moisture >= 40 && soilData.moisture <= 70) {
      score += 20;
      factors.push('Optimal moisture levels');
    } else if (soilData.moisture >= 30 && soilData.moisture < 40) {
      score += 12;
      factors.push('Moderate moisture levels');
      improvements.push('Increase irrigation frequency');
    } else if (soilData.moisture > 80) {
      score += 5;
      factors.push('Excessive moisture levels');
      improvements.push('Improve drainage system');
    } else {
      score += 8;
      factors.push('Low moisture levels');
      improvements.push('Increase irrigation immediately');
    }
    
    // pH factor (20 points)
    if (soilData.ph >= 6.0 && soilData.ph <= 7.5) {
      score += 20;
      factors.push('Optimal pH levels');
    } else if (soilData.ph >= 5.5 && soilData.ph < 6.0) {
      score += 12;
      factors.push('Slightly acidic soil');
      improvements.push('Add lime to increase pH');
    } else if (soilData.ph > 8.0) {
      score += 8;
      factors.push('Alkaline soil');
      improvements.push('Add sulfur to decrease pH');
    } else {
      score += 5;
      factors.push('Very acidic soil');
      improvements.push('Add lime immediately');
    }
    
    // Organic matter factor (20 points)
    if (soilData.organicMatter >= 3) {
      score += 20;
      factors.push('Good organic matter content');
    } else if (soilData.organicMatter >= 2) {
      score += 12;
      factors.push('Moderate organic matter content');
      improvements.push('Add compost or manure');
    } else {
      score += 5;
      factors.push('Low organic matter content');
      improvements.push('Add 10-20 tons/ha of compost');
    }
    
    // Nutrient factor (20 points)
    const nutrientScore = this.calculateNutrientScore(soilData.nutrients);
    score += nutrientScore;
    
    // Soil structure factor (20 points)
    if (soilData.compaction < 30) {
      score += 20;
      factors.push('Good soil structure');
    } else if (soilData.compaction < 50) {
      score += 12;
      factors.push('Moderate compaction');
      improvements.push('Light tillage recommended');
    } else {
      score += 5;
      factors.push('High compaction');
      improvements.push('Deep tillage or subsoiling required');
    }
    
    return {
      score: Math.min(100, score),
      factors: factors,
      improvements: improvements,
      level: this.getHealthLevel(score),
      recommendations: this.getSoilImprovementRecommendations(soilData)
    };
  }

  // Calculate nutrient score
  calculateNutrientScore(nutrients) {
    let score = 0;
    
    // Primary nutrients (15 points)
    const primaryScore = this.assessNutrientLevel(nutrients.primary.nitrogen, 20, 40) +
                        this.assessNutrientLevel(nutrients.primary.phosphorus, 15, 30) +
                        this.assessNutrientLevel(nutrients.primary.potassium, 25, 40);
    score += Math.min(15, primaryScore);
    
    // Secondary nutrients (3 points)
    const secondaryScore = this.assessNutrientLevel(nutrients.secondary.calcium, 100, 200) +
                          this.assessNutrientLevel(nutrients.secondary.magnesium, 50, 100);
    score += Math.min(3, secondaryScore);
    
    // Micronutrients (2 points)
    const microScore = this.assessNutrientLevel(nutrients.micronutrients.iron, 5, 15) +
                       this.assessNutrientLevel(nutrients.micronutrients.zinc, 2, 8);
    score += Math.min(2, microScore);
    
    return score;
  }

  // Assess individual nutrient level
  assessNutrientLevel(value, min, max) {
    if (value >= min && value <= max) {
      return 1; // Optimal
    } else if (value >= min * 0.7 && value < min) {
      return 0.5; // Low
    } else if (value > max && value <= max * 1.3) {
      return 0.8; // High but acceptable
    } else {
      return 0.2; // Very low or very high
    }
  }

  // Get health level based on score
  getHealthLevel(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  }

  // Get soil improvement recommendations
  getSoilImprovementRecommendations(soilData) {
    const recommendations = [];
    
    // pH improvement
    if (soilData.ph < 6.0) {
      recommendations.push({
        type: 'pH Improvement',
        action: 'Add lime to increase pH',
        amount: '2-4 tons/ha',
        timing: '3-6 months before planting',
        priority: 'high',
        cost: 'Medium - 50,000-100,000 UGX/ha'
      });
    } else if (soilData.ph > 8.0) {
      recommendations.push({
        type: 'pH Improvement',
        action: 'Add sulfur to decrease pH',
        amount: '1-2 tons/ha',
        timing: '3-6 months before planting',
        priority: 'high',
        cost: 'Medium - 30,000-60,000 UGX/ha'
      });
    }
    
    // Organic matter improvement
    if (soilData.organicMatter < 2) {
      recommendations.push({
        type: 'Organic Matter',
        action: 'Add compost or manure',
        amount: '10-20 tons/ha',
        timing: 'Before planting',
        priority: 'high',
        cost: 'Low - 15,000-30,000 UGX/ha'
      });
    }
    
    // Compaction improvement
    if (soilData.compaction > 70) {
      recommendations.push({
        type: 'Compaction Relief',
        action: 'Deep tillage or subsoiling',
        method: 'Use subsoiler or deep plow',
        timing: 'During dry season',
        priority: 'high',
        cost: 'High - 100,000-200,000 UGX/ha'
      });
    }
    
    // Drainage improvement
    if (soilData.drainage < 30) {
      recommendations.push({
        type: 'Drainage Improvement',
        action: 'Install drainage channels',
        method: 'Create channels or raised beds',
        timing: 'Before rainy season',
        priority: 'medium',
        cost: 'Medium - 50,000-100,000 UGX/ha'
      });
    }
    
    return recommendations;
  }

  // Get soil health analysis
  getSoilHealthAnalysis() {
    const soil = this.sensorData.soil;
    const analysis = {
      overall: 'Good',
      issues: [],
      recommendations: []
    };

    // Analyze soil moisture
    if (soil.moisture < 30) {
      analysis.issues.push('Low soil moisture');
      analysis.recommendations.push('Increase irrigation');
    } else if (soil.moisture > 80) {
      analysis.issues.push('High soil moisture');
      analysis.recommendations.push('Improve drainage');
    }

    // Analyze soil pH
    if (soil.ph < 6.0) {
      analysis.issues.push('Acidic soil');
      analysis.recommendations.push('Add lime to increase pH');
    } else if (soil.ph > 8.0) {
      analysis.issues.push('Alkaline soil');
      analysis.recommendations.push('Add sulfur to decrease pH');
    }

    // Analyze nutrients
    if (soil.nutrients.nitrogen < 20) {
      analysis.issues.push('Low nitrogen levels');
      analysis.recommendations.push('Apply nitrogen fertilizer');
    }

    if (soil.nutrients.phosphorus < 15) {
      analysis.issues.push('Low phosphorus levels');
      analysis.recommendations.push('Apply phosphorus fertilizer');
    }

    if (soil.nutrients.potassium < 25) {
      analysis.issues.push('Low potassium levels');
      analysis.recommendations.push('Apply potassium fertilizer');
    }

    // Determine overall health
    if (analysis.issues.length === 0) {
      analysis.overall = 'Excellent';
    } else if (analysis.issues.length <= 2) {
      analysis.overall = 'Good';
    } else if (analysis.issues.length <= 4) {
      analysis.overall = 'Fair';
    } else {
      analysis.overall = 'Poor';
    }

    return analysis;
  }

  // Get weather analysis
  getWeatherAnalysis() {
    const weather = this.sensorData.weather;
    const analysis = {
      conditions: 'Normal',
      alerts: [],
      recommendations: []
    };

    // Analyze temperature
    if (weather.temperature > 35) {
      analysis.alerts.push('High temperature warning');
      analysis.recommendations.push('Increase watering frequency');
    } else if (weather.temperature < 10) {
      analysis.alerts.push('Low temperature warning');
      analysis.recommendations.push('Protect crops from frost');
    }

    // Analyze humidity
    if (weather.humidity > 80) {
      analysis.alerts.push('High humidity warning');
      analysis.recommendations.push('Monitor for fungal diseases');
    } else if (weather.humidity < 30) {
      analysis.alerts.push('Low humidity warning');
      analysis.recommendations.push('Increase irrigation');
    }

    // Analyze rainfall
    if (weather.rainfall > 10) {
      analysis.alerts.push('Heavy rainfall warning');
      analysis.recommendations.push('Check drainage systems');
    }

    // Determine overall conditions
    if (analysis.alerts.length === 0) {
      analysis.conditions = 'Optimal';
    } else if (analysis.alerts.length <= 2) {
      analysis.conditions = 'Normal';
    } else {
      analysis.conditions = 'Challenging';
    }

    return analysis;
  }

  // Get real-time alerts
  getRealTimeAlerts() {
    const alerts = [];
    const soil = this.sensorData.soil;
    const weather = this.sensorData.weather;

    // Soil moisture alerts
    if (soil.moisture < 20) {
      alerts.push({
        type: 'critical',
        message: 'Critical: Soil moisture is very low',
        timestamp: new Date().toISOString()
      });
    } else if (soil.moisture > 90) {
      alerts.push({
        type: 'warning',
        message: 'Warning: Soil moisture is very high',
        timestamp: new Date().toISOString()
      });
    }

    // Temperature alerts
    if (weather.temperature > 40) {
      alerts.push({
        type: 'critical',
        message: 'Critical: Extreme temperature detected',
        timestamp: new Date().toISOString()
      });
    }

    // Humidity alerts
    if (weather.humidity > 90) {
      alerts.push({
        type: 'warning',
        message: 'Warning: Very high humidity - monitor for diseases',
        timestamp: new Date().toISOString()
      });
    }

    return alerts;
  }
}

export default new IoTService();
