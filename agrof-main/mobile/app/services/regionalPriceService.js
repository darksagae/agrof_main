/**
 * Regional Price Service - Batch 2
 * Location-based pricing adjustments and regional market variations
 */

import * as Location from 'expo-location';
import { supabase } from '../config/supabaseConfig';

class RegionalPriceService {
  constructor() {
    this.regions = new Map();
    this.priceVariations = new Map();
    this.transportCosts = new Map();
    this.userLocation = null;
    this.regionalMultipliers = new Map();
    this.initialized = false;
  }

  /**
   * Initialize the regional price service
   */
  async initialize() {
    try {
      console.log('🔄 Initializing Regional Price Service...');
      
      // Load regional data from Supabase
      await this.loadRegionalData();
      
      // Get user's current location
      await this.getCurrentLocation();
      
      // Initialize regional multipliers
      this.initializeRegionalMultipliers();
      
      this.initialized = true;
      console.log('✅ Regional Price Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Regional Price Service:', error);
    }
  }

  /**
   * Load regional data from Supabase
   */
  async loadRegionalData() {
    try {
      // Load crop regional suitability data (fallback to mock data if Supabase fails)
      let crops = [];
      try {
        const { data, error: cropsError } = await supabase
          .from('crops')
          .select('id, name, regional_suitability, market_price_min, market_price_max');

        if (cropsError) throw cropsError;
        crops = data || [];
      } catch (supabaseError) {
        console.warn('⚠️ Supabase connection failed, using mock data:', supabaseError.message);
        // Use mock data as fallback
        crops = [
          { id: '1', name: 'Maize', regional_suitability: 'All regions', market_price_min: 1000, market_price_max: 1500 },
          { id: '2', name: 'Tomatoes', regional_suitability: 'All regions', market_price_min: 2000, market_price_max: 4000 },
          { id: '3', name: 'Beans', regional_suitability: 'All regions', market_price_min: 2500, market_price_max: 3500 },
          { id: '4', name: 'Coffee', regional_suitability: 'Central, Eastern, Western', market_price_min: 8000, market_price_max: 12000 },
          { id: '5', name: 'Banana', regional_suitability: 'All regions', market_price_min: 800, market_price_max: 1500 }
        ];
      }

      // Process regional data
      crops.forEach(crop => {
        const regions = this.parseRegionalSuitability(crop.regional_suitability);
        this.regions.set(crop.id, {
          crop_id: crop.id,
          crop_name: crop.name,
          suitable_regions: regions,
          base_price: crop.market_price_min || 0
        });
      });

      console.log(`✅ Loaded regional data for ${crops.length} crops`);

    } catch (error) {
      console.error('❌ Failed to load regional data:', error);
    }
  }

  /**
   * Parse regional suitability string into array of regions
   */
  parseRegionalSuitability(regionalSuitability) {
    if (!regionalSuitability) return [];
    
    return regionalSuitability.split(',').map(region => region.trim());
  }

  /**
   * Get user's current location
   */
  async getCurrentLocation() {
    try {
      // Check if we're in a web environment
      if (typeof window !== 'undefined' && window.location) {
        console.log('Web environment detected, using default location');
        this.userLocation = {
          latitude: 0.3476, // Kampala coordinates
          longitude: 32.5825,
          region: 'Central'
        };
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Location permission not granted, using default location');
        this.userLocation = {
          latitude: 0.3476, // Kampala coordinates
          longitude: 32.5825,
          region: 'Central'
        };
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const region = await this.getRegionFromCoordinates(
        location.coords.latitude,
        location.coords.longitude
      );

      this.userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        region: region
      };

      console.log(`📍 User location: ${region} (${location.coords.latitude}, ${location.coords.longitude})`);

    } catch (error) {
      console.error('❌ Failed to get current location:', error);
      this.userLocation = {
        latitude: 0.3476,
        longitude: 32.5825,
        region: 'Central'
      };
    }
  }

  /**
   * Get region from coordinates (Uganda-specific)
   */
  async getRegionFromCoordinates(latitude, longitude) {
    // Uganda regional boundaries (simplified)
    const regionalBoundaries = {
      'Northern': {
        minLat: 2.0, maxLat: 4.0,
        minLng: 30.0, maxLng: 35.0
      },
      'Eastern': {
        minLat: 0.5, maxLat: 2.0,
        minLng: 32.0, maxLng: 35.0
      },
      'Central': {
        minLat: 0.0, maxLat: 1.0,
        minLng: 32.0, maxLng: 33.0
      },
      'Western': {
        minLat: 0.0, maxLat: 2.0,
        minLng: 30.0, maxLng: 32.0
      }
    };

    for (const [region, bounds] of Object.entries(regionalBoundaries)) {
      if (latitude >= bounds.minLat && latitude <= bounds.maxLat &&
          longitude >= bounds.minLng && longitude <= bounds.maxLng) {
        return region;
      }
    }

    return 'Central'; // Default region
  }

  /**
   * Initialize regional price multipliers
   */
  initializeRegionalMultipliers() {
    // Regional price multipliers based on market demand and supply
    this.regionalMultipliers.set('Northern', {
      multiplier: 0.9, // 10% lower prices due to lower demand
      transport_cost_per_km: 0.5, // UGX per km
      market_access: 'moderate'
    });

    this.regionalMultipliers.set('Eastern', {
      multiplier: 1.1, // 10% higher prices due to higher demand
      transport_cost_per_km: 0.6,
      market_access: 'good'
    });

    this.regionalMultipliers.set('Central', {
      multiplier: 1.2, // 20% higher prices due to highest demand
      transport_cost_per_km: 0.3,
      market_access: 'excellent'
    });

    this.regionalMultipliers.set('Western', {
      multiplier: 0.95, // 5% lower prices
      transport_cost_per_km: 0.7,
      market_access: 'moderate'
    });
  }

  /**
   * Calculate regional price for a crop
   * @param {string} cropId - Crop ID
   * @param {string} targetRegion - Target region
   * @param {number} quantity - Quantity in kg
   * @returns {Object} Regional price calculation
   */
  calculateRegionalPrice(cropId, targetRegion, quantity = 1) {
    try {
      const cropData = this.regions.get(cropId);
      if (!cropData) {
        throw new Error(`Crop ${cropId} not found`);
      }

      const regionalMultiplier = this.regionalMultipliers.get(targetRegion);
      if (!regionalMultiplier) {
        throw new Error(`Region ${targetRegion} not found`);
      }

      const basePrice = cropData.base_price?.avg || 1000; // Default price
      const regionalPrice = basePrice * regionalMultiplier.multiplier;
      const totalPrice = regionalPrice * quantity;

      // Calculate transport costs if different from user's region
      let transportCost = 0;
      if (this.userLocation && this.userLocation.region !== targetRegion) {
        transportCost = this.calculateTransportCost(targetRegion, quantity);
      }

      const finalPrice = totalPrice + transportCost;

      return {
        crop_id: cropId,
        crop_name: cropData.crop_name,
        base_price: basePrice,
        regional_price: regionalPrice,
        quantity: quantity,
        total_price: totalPrice,
        transport_cost: transportCost,
        final_price: finalPrice,
        region: targetRegion,
        multiplier: regionalMultiplier.multiplier,
        price_breakdown: {
          base_cost: totalPrice,
          transport_cost: transportCost,
          regional_adjustment: totalPrice * (regionalMultiplier.multiplier - 1)
        }
      };

    } catch (error) {
      console.error('❌ Regional price calculation failed:', error);
      return {
        crop_id: cropId,
        error: error.message,
        final_price: 0
      };
    }
  }

  /**
   * Calculate transport cost between regions
   * @param {string} targetRegion - Target region
   * @param {number} quantity - Quantity in kg
   * @returns {number} Transport cost in UGX
   */
  calculateTransportCost(targetRegion, quantity) {
    if (!this.userLocation) return 0;

    const regionalMultiplier = this.regionalMultipliers.get(targetRegion);
    const userRegionMultiplier = this.regionalMultipliers.get(this.userLocation.region);

    if (!regionalMultiplier || !userRegionMultiplier) return 0;

    // Calculate distance between regions (simplified)
    const distance = this.calculateRegionalDistance(this.userLocation.region, targetRegion);
    
    // Calculate transport cost
    const costPerKm = (regionalMultiplier.transport_cost_per_km + userRegionMultiplier.transport_cost_per_km) / 2;
    const baseTransportCost = distance * costPerKm;
    
    // Scale transport cost based on quantity
    const transportCost = baseTransportCost * (quantity / 100); // Scale for 100kg base

    return Math.round(transportCost);
  }

  /**
   * Calculate distance between regions (simplified)
   */
  calculateRegionalDistance(region1, region2) {
    if (region1 === region2) return 0;

    // Simplified distances between regions in Uganda (km)
    const distances = {
      'Central-Northern': 300,
      'Central-Eastern': 200,
      'Central-Western': 250,
      'Northern-Eastern': 400,
      'Northern-Western': 350,
      'Eastern-Western': 300
    };

    const key1 = `${region1}-${region2}`;
    const key2 = `${region2}-${region1}`;

    return distances[key1] || distances[key2] || 200; // Default 200km
  }

  /**
   * Get regional suitability for a crop
   * @param {string} cropId - Crop ID
   * @param {string} region - Region
   * @returns {Object} Regional suitability data
   */
  getRegionalSuitability(cropId, region) {
    const cropData = this.regions.get(cropId);
    if (!cropData) {
      return {
        suitable: false,
        suitability_score: 0,
        reason: 'Crop not found'
      };
    }

    const isSuitable = cropData.suitable_regions.includes(region);
    const suitabilityScore = isSuitable ? 1.0 : 0.3; // Lower score for unsuitable regions

    return {
      suitable: isSuitable,
      suitability_score: suitabilityScore,
      reason: isSuitable ? 'Highly suitable for this region' : 'Not ideal for this region',
      suitable_regions: cropData.suitable_regions,
      recommended_regions: cropData.suitable_regions.slice(0, 2) // Top 2 recommendations
    };
  }

  /**
   * Get best regions for a crop
   * @param {string} cropId - Crop ID
   * @returns {Array} Best regions sorted by suitability
   */
  getBestRegionsForCrop(cropId) {
    const cropData = this.regions.get(cropId);
    if (!cropData) return [];

    const regionScores = [];
    
    cropData.suitable_regions.forEach(region => {
      const multiplier = this.regionalMultipliers.get(region);
      const suitability = this.getRegionalSuitability(cropId, region);
      
      regionScores.push({
        region: region,
        suitability_score: suitability.suitability_score,
        price_multiplier: multiplier?.multiplier || 1.0,
        market_access: multiplier?.market_access || 'unknown',
        combined_score: suitability.suitability_score * multiplier?.multiplier || 0
      });
    });

    // Sort by combined score (suitability * price multiplier)
    regionScores.sort((a, b) => b.combined_score - a.combined_score);

    return regionScores;
  }

  /**
   * Get regional market insights
   * @param {string} region - Region
   * @returns {Object} Regional market insights
   */
  getRegionalMarketInsights(region) {
    const regionalData = this.regionalMultipliers.get(region);
    if (!regionalData) {
      return {
        region: region,
        error: 'Region not found'
      };
    }

    const cropsInRegion = Array.from(this.regions.values())
      .filter(crop => crop.suitable_regions.includes(region));

    return {
      region: region,
      price_multiplier: regionalData.multiplier,
      market_access: regionalData.market_access,
      transport_cost_per_km: regionalData.transport_cost_per_km,
      suitable_crops_count: cropsInRegion.length,
      suitable_crops: cropsInRegion.map(crop => crop.crop_name),
      market_characteristics: {
        demand_level: regionalData.multiplier > 1.1 ? 'High' : regionalData.multiplier > 0.9 ? 'Medium' : 'Low',
        accessibility: regionalData.market_access,
        price_trend: regionalData.multiplier > 1.0 ? 'Above average' : 'Below average'
      }
    };
  }

  /**
   * Get all regional data
   * @returns {Object} All regional data
   */
  getAllRegionalData() {
    return {
      user_location: this.userLocation,
      regions: Array.from(this.regionalMultipliers.keys()),
      crops: Array.from(this.regions.values()),
      initialized: this.initialized
    };
  }

  /**
   * Update user location
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   */
  async updateUserLocation(latitude, longitude) {
    try {
      const region = await this.getRegionFromCoordinates(latitude, longitude);
      
      this.userLocation = {
        latitude: latitude,
        longitude: longitude,
        region: region
      };

      console.log(`📍 User location updated: ${region} (${latitude}, ${longitude})`);
    } catch (error) {
      console.error('❌ Failed to update user location:', error);
    }
  }

  /**
   * Get regional prices for a specific crop
   * @param {string} cropId - Crop ID
   * @returns {Object} Regional prices for the crop
   */
  async getRegionalPrices(cropId) {
    try {
      console.log(`🔍 Getting regional prices for crop: ${cropId}`);
      
      // Base price for the crop (you can get this from crop database)
      const basePrice = 2000; // Default base price
      
      const regionalPrices = {};
      
      // Calculate prices for each region
      for (const [region, multiplier] of this.regionalMultipliers) {
        const regionalPrice = Math.floor(basePrice * multiplier);
        regionalPrices[region.toLowerCase()] = regionalPrice;
      }
      
      console.log(`✅ Regional prices calculated for ${cropId}:`, regionalPrices);
      return regionalPrices;
    } catch (error) {
      console.error('❌ Failed to get regional prices:', error);
      throw error;
    }
  }
}

export default new RegionalPriceService();