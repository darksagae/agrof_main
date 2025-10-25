/**
 * Supabase Crop Database Service
 * Complete database for all 19 crops with Supabase MCP integration
 * Uses real crop images from assets/crops folder
 */

import { supabase } from '../config/supabaseConfig';

class SupabaseCropDatabase {
  constructor() {
    this.crops = [];
    this.initialized = false;
    this.projectId = 'xtklayjpdpfykjbttaac'; // AgroF project ID
  }

  /**
   * Initialize the crop database with all 19 crops
   */
  async initialize() {
    try {
      console.log('🔄 Initializing Supabase crop database...');
      
      // Load all crops from Supabase
      const cropsData = await this.getAllCrops();
      
      // Check if we got valid data
      if (!cropsData || !Array.isArray(cropsData) || cropsData.length === 0) {
        console.warn('⚠️ Supabase returned no data, using fallback');
        // Don't throw error, just use empty array for now
        this.crops = [];
      } else {
        this.crops = cropsData;
        console.log(`✅ Loaded ${cropsData.length} crops from Supabase`);
      }
      
      this.initialized = true;
      return this.crops;
    } catch (error) {
      console.error('❌ Failed to initialize Supabase crop database:', error);
      // Don't throw error, just initialize with empty array
      this.crops = [];
      this.initialized = true;
      return this.crops;
    }
  }

  /**
   * Get all crops from Supabase
   */
  async getAllCrops() {
    try {
      console.log('🔄 Fetching crops from Supabase...');
      
      // Try to fetch from Supabase first
      try {
        const { data, error } = await supabase
          .from('crops')
          .select('*')
          .order('name');
        
        if (error) {
          console.warn('⚠️ Supabase query failed, using fallback data:', error.message);
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log(`✅ Fetched ${data.length} crops from Supabase`);
          return data;
        }
      } catch (supabaseError) {
        console.warn('⚠️ Supabase connection failed, using fallback data:', supabaseError.message);
      }
      
      // Fallback to hardcoded data if Supabase fails
      console.log('📦 Using fallback crop data...');
      const cropsData = [
        {
          id: 'maize',
          name: 'Maize',
          category: 'cereals',
          image: 'maize.png',
          description: 'Staple cereal crop widely grown in Uganda',
          growth_duration: '90-120 days',
          planting_season: 'March-April, September-October',
          harvest_season: 'July-August, December-January',
          spacing: '75cm x 25cm',
          seed_rate: '25-30 kg per acre',
          fertilizer_requirement: 'NPK 17:17:17',
          water_requirement: '500-600mm per season',
          soil_type: 'Well-drained loamy soil',
          market_price_min: 800,
          market_price_max: 1200,
          roi_percentage_min: 200,
          roi_percentage_max: 550,
          regional_suitability: 'Northern, Eastern, Central',
          pest_control: 'Stem borers, Armyworms',
          disease_control: 'Maize streak virus, Leaf blight',
          labor_requirement: 'Medium',
          equipment_requirement: 'Plow, Planter, Harvester',
          export_potential: 'High',
          storage_requirement: 'Dry storage, 12-14% moisture',
          processing_requirement: 'Milling, Drying'
        },
        {
          id: 'tomatoes',
          name: 'Tomatoes',
          category: 'vegetables',
          image: 'tomatoes.png',
          description: 'High-value vegetable crop with excellent market demand',
          growth_duration: '90-120 days',
          planting_season: 'Year-round',
          harvest_season: 'Continuous',
          spacing: '60cm x 45cm',
          seed_rate: '100-150g per acre',
          fertilizer_requirement: 'NPK 20:10:10',
          water_requirement: '600-800mm per season',
          soil_type: 'Well-drained sandy loam',
          market_price_min: 2500,
          market_price_max: 4500,
          roi_percentage_min: 1340,
          roi_percentage_max: 3488,
          regional_suitability: 'Central, Eastern, Western',
          pest_control: 'Aphids, Whiteflies, Thrips',
          disease_control: 'Blight, Bacterial wilt',
          labor_requirement: 'High',
          equipment_requirement: 'Drip irrigation, Stakes',
          export_potential: 'Very High',
          storage_requirement: 'Cool storage, 10-12°C',
          processing_requirement: 'Sorting, Packaging'
        },
        {
          id: 'beans',
          name: 'Beans',
          category: 'legumes',
          image: 'beans.png',
          description: 'Protein-rich legume crop essential for nutrition',
          growth_duration: '60-90 days',
          planting_season: 'March-April, September-October',
          harvest_season: 'June-July, December-January',
          spacing: '50cm x 10cm',
          seed_rate: '40-50 kg per acre',
          fertilizer_requirement: 'NPK 10:20:20',
          water_requirement: '400-500mm per season',
          soil_type: 'Well-drained clay loam',
          market_price_min: 1800,
          market_price_max: 2800,
          roi_percentage_min: 150,
          roi_percentage_max: 400,
          regional_suitability: 'All regions',
          pest_control: 'Bean fly, Aphids',
          disease_control: 'Anthracnose, Rust',
          labor_requirement: 'Medium',
          equipment_requirement: 'Planter, Harvester',
          export_potential: 'High',
          storage_requirement: 'Dry storage, 12-14% moisture',
          processing_requirement: 'Sorting, Cleaning'
        },
        {
          id: 'coffee',
          name: 'Coffee',
          category: 'cash_crops',
          image: 'coffee.png',
          description: 'Premium cash crop with high export value',
          growth_duration: '3-4 years to first harvest',
          planting_season: 'March-May',
          harvest_season: 'October-February',
          spacing: '3m x 3m',
          seed_rate: '200-300 seedlings per acre',
          fertilizer_requirement: 'NPK 15:15:15',
          water_requirement: '1000-1500mm per year',
          soil_type: 'Volcanic, Well-drained',
          market_price_min: 3500,
          market_price_max: 5500,
          roi_percentage_min: 200,
          roi_percentage_max: 400,
          regional_suitability: 'Eastern, Western, Central',
          pest_control: 'Coffee berry borer, Antestia',
          disease_control: 'Coffee wilt, Leaf rust',
          labor_requirement: 'High',
          equipment_requirement: 'Pruning tools, Pulping machine',
          export_potential: 'Very High',
          storage_requirement: 'Dry storage, 12% moisture',
          processing_requirement: 'Pulping, Drying, Milling'
        },
        {
          id: 'banana',
          name: 'Banana',
          category: 'fruits',
          image: 'banana.png',
          description: 'Staple fruit crop with high nutritional value',
          growth_duration: '12-15 months',
          planting_season: 'Year-round',
          harvest_season: 'Year-round',
          spacing: '3m x 3m',
          seed_rate: '400-500 suckers per acre',
          fertilizer_requirement: 'NPK 20:10:10',
          water_requirement: '800-1200mm per year',
          soil_type: 'Well-drained clay loam',
          market_price_min: 800,
          market_price_max: 1500,
          roi_percentage_min: 100,
          roi_percentage_max: 200,
          regional_suitability: 'Central, Eastern, Western',
          pest_control: 'Banana weevil, Nematodes',
          disease_control: 'Panama disease, Sigatoka',
          labor_requirement: 'Medium',
          equipment_requirement: 'Machete, Pruning tools',
          export_potential: 'High',
          storage_requirement: 'Cool storage, 13-15°C',
          processing_requirement: 'Sorting, Packaging'
        },
        {
          id: 'onions',
          name: 'Onions',
          category: 'vegetables',
          image: 'onions.png',
          description: 'Essential vegetable crop with strong market demand',
          growth_duration: '90-120 days',
          planting_season: 'March-April, September-October',
          harvest_season: 'July-August, December-January',
          spacing: '30cm x 10cm',
          seed_rate: '2-3 kg per acre',
          fertilizer_requirement: 'NPK 20:10:10',
          water_requirement: '500-600mm per season',
          soil_type: 'Well-drained sandy loam',
          market_price_min: 2000,
          market_price_max: 3500,
          roi_percentage_min: 300,
          roi_percentage_max: 600,
          regional_suitability: 'Central, Eastern, Northern',
          pest_control: 'Thrips, Onion fly',
          disease_control: 'Downy mildew, Purple blotch',
          labor_requirement: 'Medium',
          equipment_requirement: 'Planter, Harvester',
          export_potential: 'High',
          storage_requirement: 'Cool, dry storage',
          processing_requirement: 'Sorting, Drying'
        },
        {
          id: 'groundnuts',
          name: 'Groundnuts',
          category: 'oil_crops',
          image: 'groundnuts.png',
          description: 'Oil-rich crop with high nutritional value',
          growth_duration: '90-120 days',
          planting_season: 'March-April, September-October',
          harvest_season: 'July-August, December-January',
          spacing: '60cm x 15cm',
          seed_rate: '80-100 kg per acre',
          fertilizer_requirement: 'NPK 10:20:20',
          water_requirement: '400-500mm per season',
          soil_type: 'Well-drained sandy loam',
          market_price_min: 2200,
          market_price_max: 3200,
          roi_percentage_min: 250,
          roi_percentage_max: 500,
          regional_suitability: 'Northern, Eastern, Central',
          pest_control: 'Aphids, Thrips',
          disease_control: 'Leaf spot, Rust',
          labor_requirement: 'Medium',
          equipment_requirement: 'Planter, Digger',
          export_potential: 'High',
          storage_requirement: 'Dry storage, 8-10% moisture',
          processing_requirement: 'Shelling, Sorting'
        },
        {
          id: 'rice',
          name: 'Rice',
          category: 'cereals',
          image: 'rice.png',
          description: 'Staple cereal crop with high water requirement',
          growth_duration: '120-150 days',
          planting_season: 'March-April, September-October',
          harvest_season: 'August-September, February-March',
          spacing: '25cm x 15cm',
          seed_rate: '30-40 kg per acre',
          fertilizer_requirement: 'NPK 15:15:15',
          water_requirement: '1000-1500mm per season',
          soil_type: 'Clay loam, Paddy soil',
          market_price_min: 1500,
          market_price_max: 2200,
          roi_percentage_min: 200,
          roi_percentage_max: 400,
          regional_suitability: 'Eastern, Northern, Central',
          pest_control: 'Stem borers, Rice bugs',
          disease_control: 'Blast, Bacterial blight',
          labor_requirement: 'High',
          equipment_requirement: 'Transplanter, Harvester',
          export_potential: 'Medium',
          storage_requirement: 'Dry storage, 14% moisture',
          processing_requirement: 'Milling, Polishing'
        },
        {
          id: 'cotton',
          name: 'Cotton',
          category: 'fiber_crops',
          image: 'cotton.png',
          description: 'Fiber crop with industrial applications',
          growth_duration: '150-180 days',
          planting_season: 'April-May',
          harvest_season: 'October-December',
          spacing: '90cm x 30cm',
          seed_rate: '8-10 kg per acre',
          fertilizer_requirement: 'NPK 20:10:10',
          water_requirement: '600-800mm per season',
          soil_type: 'Well-drained clay loam',
          market_price_min: 1800,
          market_price_max: 2500,
          roi_percentage_min: 150,
          roi_percentage_max: 300,
          regional_suitability: 'Northern, Eastern',
          pest_control: 'Bollworms, Aphids',
          disease_control: 'Bacterial blight, Wilt',
          labor_requirement: 'High',
          equipment_requirement: 'Planter, Picker',
          export_potential: 'High',
          storage_requirement: 'Dry storage',
          processing_requirement: 'Ginning, Cleaning'
        },
        {
          id: 'sugarcane',
          name: 'Sugarcane',
          category: 'industrial_crops',
          image: 'sugarcane.png',
          description: 'Industrial crop for sugar production',
          growth_duration: '12-18 months',
          planting_season: 'March-May, September-November',
          harvest_season: 'Year-round',
          spacing: '90cm x 15cm',
          seed_rate: '2000-2500 cuttings per acre',
          fertilizer_requirement: 'NPK 25:10:10',
          water_requirement: '1200-1800mm per year',
          soil_type: 'Well-drained clay loam',
          market_price_min: 1200,
          market_price_max: 1800,
          roi_percentage_min: 300,
          roi_percentage_max: 600,
          regional_suitability: 'Central, Eastern, Western',
          pest_control: 'Stem borers, Termites',
          disease_control: 'Smut, Ratoon stunting',
          labor_requirement: 'High',
          equipment_requirement: 'Planter, Harvester',
          export_potential: 'High',
          storage_requirement: 'Cool storage',
          processing_requirement: 'Crushing, Refining'
        },
        {
          id: 'pineapple',
          name: 'Pineapple',
          category: 'fruits',
          image: 'pineapple.png',
          description: 'Tropical fruit with high export potential',
          growth_duration: '18-24 months',
          planting_season: 'Year-round',
          harvest_season: 'Year-round',
          spacing: '90cm x 60cm',
          seed_rate: '2000-2500 suckers per acre',
          fertilizer_requirement: 'NPK 15:15:15',
          water_requirement: '800-1200mm per year',
          soil_type: 'Well-drained sandy loam',
          market_price_min: 1500,
          market_price_max: 2500,
          roi_percentage_min: 400,
          roi_percentage_max: 800,
          regional_suitability: 'Central, Eastern, Western',
          pest_control: 'Mealybugs, Scale insects',
          disease_control: 'Heart rot, Root rot',
          labor_requirement: 'Medium',
          equipment_requirement: 'Planting tools, Harvesting knife',
          export_potential: 'Very High',
          storage_requirement: 'Cool storage, 8-10°C',
          processing_requirement: 'Sorting, Packaging'
        },
        {
          id: 'mangoes',
          name: 'Mangoes',
          category: 'fruits',
          image: 'mangoes.png',
          description: 'Tropical fruit with excellent market demand',
          growth_duration: '3-5 years to first harvest',
          planting_season: 'March-May',
          harvest_season: 'November-March',
          spacing: '10m x 10m',
          seed_rate: '40-50 seedlings per acre',
          fertilizer_requirement: 'NPK 15:15:15',
          water_requirement: '800-1200mm per year',
          soil_type: 'Well-drained loamy soil',
          market_price_min: 1200,
          market_price_max: 2000,
          roi_percentage_min: 200,
          roi_percentage_max: 400,
          regional_suitability: 'Central, Eastern, Western',
          pest_control: 'Fruit flies, Scale insects',
          disease_control: 'Anthracnose, Powdery mildew',
          labor_requirement: 'Medium',
          equipment_requirement: 'Pruning tools, Harvesting poles',
          export_potential: 'Very High',
          storage_requirement: 'Cool storage, 12-15°C',
          processing_requirement: 'Sorting, Packaging'
        },
        {
          id: 'avocados',
          name: 'Avocados',
          category: 'fruits',
          image: 'avocados.png',
          description: 'High-value fruit with growing export market',
          growth_duration: '3-4 years to first harvest',
          planting_season: 'March-May',
          harvest_season: 'June-September',
          spacing: '8m x 8m',
          seed_rate: '60-80 seedlings per acre',
          fertilizer_requirement: 'NPK 15:15:15',
          water_requirement: '1000-1500mm per year',
          soil_type: 'Well-drained loamy soil',
          market_price_min: 2500,
          market_price_max: 4000,
          roi_percentage_min: 300,
          roi_percentage_max: 600,
          regional_suitability: 'Central, Eastern, Western',
          pest_control: 'Fruit flies, Scale insects',
          disease_control: 'Root rot, Anthracnose',
          labor_requirement: 'Medium',
          equipment_requirement: 'Pruning tools, Harvesting poles',
          export_potential: 'Very High',
          storage_requirement: 'Cool storage, 5-7°C',
          processing_requirement: 'Sorting, Packaging'
        },
        {
          id: 'carrots',
          name: 'Carrots',
          category: 'vegetables',
          image: 'carrot.png',
          description: 'Root vegetable with high nutritional value',
          growth_duration: '90-120 days',
          planting_season: 'Year-round',
          harvest_season: 'Year-round',
          spacing: '30cm x 5cm',
          seed_rate: '2-3 kg per acre',
          fertilizer_requirement: 'NPK 15:15:15',
          water_requirement: '500-600mm per season',
          soil_type: 'Well-drained sandy loam',
          market_price_min: 1800,
          market_price_max: 2800,
          roi_percentage_min: 200,
          roi_percentage_max: 400,
          regional_suitability: 'Central, Eastern, Northern',
          pest_control: 'Carrot fly, Aphids',
          disease_control: 'Leaf blight, Root rot',
          labor_requirement: 'Medium',
          equipment_requirement: 'Planter, Harvester',
          export_potential: 'Medium',
          storage_requirement: 'Cool storage, 0-2°C',
          processing_requirement: 'Washing, Sorting'
        },
        {
          id: 'spinach',
          name: 'Spinach',
          category: 'vegetables',
          image: 'spinach.png',
          description: 'Leafy green vegetable with high nutritional value',
          growth_duration: '30-45 days',
          planting_season: 'Year-round',
          harvest_season: 'Year-round',
          spacing: '30cm x 10cm',
          seed_rate: '1-2 kg per acre',
          fertilizer_requirement: 'NPK 20:10:10',
          water_requirement: '400-500mm per season',
          soil_type: 'Well-drained loamy soil',
          market_price_min: 1500,
          market_price_max: 2500,
          roi_percentage_min: 150,
          roi_percentage_max: 300,
          regional_suitability: 'All regions',
          pest_control: 'Aphids, Leaf miners',
          disease_control: 'Downy mildew, Leaf spot',
          labor_requirement: 'Medium',
          equipment_requirement: 'Planter, Harvesting tools',
          export_potential: 'Medium',
          storage_requirement: 'Cool storage, 0-2°C',
          processing_requirement: 'Washing, Packaging'
        },
        {
          id: 'millet',
          name: 'Millet',
          category: 'cereals',
          image: 'millet.png',
          description: 'Drought-resistant cereal crop',
          growth_duration: '90-120 days',
          planting_season: 'March-April, September-October',
          harvest_season: 'July-August, December-January',
          spacing: '60cm x 10cm',
          seed_rate: '15-20 kg per acre',
          fertilizer_requirement: 'NPK 10:20:20',
          water_requirement: '300-400mm per season',
          soil_type: 'Well-drained sandy loam',
          market_price_min: 1200,
          market_price_max: 1800,
          roi_percentage_min: 100,
          roi_percentage_max: 250,
          regional_suitability: 'Northern, Eastern',
          pest_control: 'Stem borers, Birds',
          disease_control: 'Downy mildew, Smut',
          labor_requirement: 'Medium',
          equipment_requirement: 'Planter, Harvester',
          export_potential: 'Low',
          storage_requirement: 'Dry storage, 12-14% moisture',
          processing_requirement: 'Threshing, Cleaning'
        },
        {
          id: 'soybeans',
          name: 'Soybeans',
          category: 'legumes',
          image: 'soyabeans.png',
          description: 'Protein-rich legume with industrial uses',
          growth_duration: '90-120 days',
          planting_season: 'March-April, September-October',
          harvest_season: 'July-August, December-January',
          spacing: '60cm x 10cm',
          seed_rate: '40-50 kg per acre',
          fertilizer_requirement: 'NPK 10:20:20',
          water_requirement: '500-600mm per season',
          soil_type: 'Well-drained clay loam',
          market_price_min: 2000,
          market_price_max: 3000,
          roi_percentage_min: 200,
          roi_percentage_max: 400,
          regional_suitability: 'Central, Eastern, Northern',
          pest_control: 'Aphids, Bean fly',
          disease_control: 'Rust, Bacterial blight',
          labor_requirement: 'Medium',
          equipment_requirement: 'Planter, Harvester',
          export_potential: 'High',
          storage_requirement: 'Dry storage, 12-14% moisture',
          processing_requirement: 'Cleaning, Sorting'
        },
        {
          id: 'cabbage',
          name: 'Cabbage',
          category: 'vegetables',
          image: 'cabbage.png',
          description: 'Leafy vegetable with high market demand',
          growth_duration: '90-120 days',
          planting_season: 'Year-round',
          harvest_season: 'Year-round',
          spacing: '60cm x 45cm',
          seed_rate: '100-150g per acre',
          fertilizer_requirement: 'NPK 20:10:10',
          water_requirement: '500-600mm per season',
          soil_type: 'Well-drained loamy soil',
          market_price_min: 1500,
          market_price_max: 2500,
          roi_percentage_min: 400,
          roi_percentage_max: 800,
          regional_suitability: 'Central, Eastern, Western',
          pest_control: 'Diamondback moth, Cabbage aphids',
          disease_control: 'Black rot, Club root',
          labor_requirement: 'Medium',
          equipment_requirement: 'Planter, Harvesting knife',
          export_potential: 'Medium',
          storage_requirement: 'Cool storage, 0-2°C',
          processing_requirement: 'Washing, Packaging'
        },
        {
          id: 'oranges',
          name: 'Oranges',
          category: 'fruits',
          image: 'orangoes.png',
          description: 'Citrus fruit with high vitamin C content',
          growth_duration: '3-4 years to first harvest',
          planting_season: 'March-May',
          harvest_season: 'June-September',
          spacing: '6m x 6m',
          seed_rate: '100-120 seedlings per acre',
          fertilizer_requirement: 'NPK 15:15:15',
          water_requirement: '800-1200mm per year',
          soil_type: 'Well-drained loamy soil',
          market_price_min: 1800,
          market_price_max: 2800,
          roi_percentage_min: 200,
          roi_percentage_max: 400,
          regional_suitability: 'Central, Eastern, Western',
          pest_control: 'Fruit flies, Scale insects',
          disease_control: 'Citrus canker, Greening',
          labor_requirement: 'Medium',
          equipment_requirement: 'Pruning tools, Harvesting poles',
          export_potential: 'High',
          storage_requirement: 'Cool storage, 3-5°C',
          processing_requirement: 'Sorting, Packaging'
        }
      ];

      console.log('📦 Returning fallback crops data:', {
        type: typeof cropsData,
        isArray: Array.isArray(cropsData),
        length: cropsData?.length
      });
      return cropsData || [];
    } catch (error) {
      console.error('❌ Failed to fetch crops:', error);
      // Return empty array instead of throwing error
      console.log('📦 Returning empty array as fallback');
      return [];
    }
  }

  /**
   * Get crop by ID
   */
  async getCropById(id) {
    try {
      const crops = await this.getAllCrops();
      return crops.find(crop => crop.id === id);
    } catch (error) {
      console.error('❌ Failed to fetch crop:', error);
      throw error;
    }
  }

  /**
   * Get crops by category
   */
  async getCropsByCategory(category) {
    try {
      const crops = await this.getAllCrops();
      return crops.filter(crop => crop.category === category);
    } catch (error) {
      console.error('❌ Failed to fetch crops by category:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new SupabaseCropDatabase();