/**
 * Comprehensive Crop Database
 * Complete database for all 19 crops with extensive Uganda agricultural data
 * Based on research from government sources, NARO, market data, and agricultural extension
 */

class ComprehensiveCropDatabase {
  constructor() {
    this.crops = this.initializeComprehensiveCropDatabase();
    this.marketSources = this.initializeMarketSources();
    this.governmentData = this.initializeGovernmentData();
    this.regionalSuitability = this.initializeRegionalSuitability();
  }

  /**
   * Initialize comprehensive crop database with all 19 crops
   */
  initializeComprehensiveCropDatabase() {
    return {
      // 1. MAIZE - Staple Food Crop
      maize: {
        name: 'Maize',
        scientificName: 'Zea mays',
        category: 'cereals',
        image: 'maize.png',
        duration_days: '90-120',
        planting_seasons: ['March-April', 'September-October'],
        spacing: '75cm × 25cm',
        plants_per_acre: 21000,
        seed_quantity_kg: 10,
        expected_yield_bags: '20-30',
        market_price_per_bag: { min: 80000, max: 120000 },
        farmgate_price_per_kg: { min: 1150, max: 1250 },
        seed_categories: ['seeds'],
        seed_keywords: ['maize', 'duma', 'longe', 'pioneer', 'hybrid'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 2, unit: 'bags' },
          { timing: 'Top dressing (Week 4)', product_type: 'Urea', quantity_per_acre: 1, unit: 'bags' }
        ],
        pest_control: [
          { type: 'herbicide', products: ['atrazine', 'glyphosate'], applications: 1 },
          { type: 'insecticide', products: ['lambda', 'dimethoate'], applications: 2 }
        ],
        labor_costs_ugx: {
          land_preparation: 80000,
          planting: 50000,
          weeding: 40000,
          spraying: 15000,
          harvesting: 60000
        },
        regional_suitability: ['Central', 'Eastern', 'Northern', 'Western'],
        soil_requirements: 'Well-drained loamy soil',
        water_requirements: 'Moderate',
        market_demand: 'High',
        export_potential: 'Medium',
        roi_percentage: { min: 200, max: 550 }
      },

      // 2. TOMATOES - High Value Vegetable
      tomatoes: {
        name: 'Tomatoes',
        scientificName: 'Solanum lycopersicum',
        category: 'vegetables',
        image: 'tomatoes.png',
        duration_days: '90-120',
        planting_seasons: ['March-April', 'September-October'],
        spacing: '60cm × 45cm',
        plants_per_acre: 18000,
        expected_yield_tons: '8-12',
        market_price_min: 1500,
        market_price_max: 2500,
        market_price_per_box: { min: 200000, max: 220000 },
        seed_categories: ['seeds'],
        seed_keywords: ['tomato', 'maxim', 'tengeru', 'cal-j', 'julie'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 4, unit: 'bags' },
          { timing: 'Top dressing (Week 3)', product_type: 'Urea', quantity_per_acre: 2, unit: 'bags' },
          { timing: 'Top dressing (Week 6)', product_type: 'NPK', quantity_per_acre: 2, unit: 'bags' }
        ],
        pest_control: [
          { type: 'fungicide', products: ['ridomil', 'dithane', 'mancozeb'], applications: 4 },
          { type: 'insecticide', products: ['dimethoate', 'lambda'], applications: 3 }
        ],
        labor_costs_ugx: {
          land_preparation: 100000,
          planting: 100000,
          weeding: 40000,
          spraying: 15000,
          staking: 50000,
          harvesting: 80000
        },
        regional_suitability: ['Central', 'Eastern', 'Western'],
        soil_requirements: 'Well-drained fertile soil',
        water_requirements: 'High',
        market_demand: 'Very High',
        export_potential: 'High',
        roi_percentage: { min: 1340, max: 3488 }
      },

      // 3. BEANS - Protein Source
      beans: {
        name: 'Beans',
        scientificName: 'Phaseolus vulgaris',
        category: 'legumes',
        image: 'beans.png',
        duration_days: '60-90',
        planting_seasons: ['March-April', 'September-October'],
        spacing: '50cm × 10cm',
        seed_quantity_kg: 20,
        expected_yield_bags: '5-8',
        market_price_per_bag: { min: 120000, max: 180000 },
        farmgate_price_per_kg: { min: 2500, max: 2850 },
        seed_categories: ['seeds'],
        seed_keywords: ['bean', 'k132', 'nabe', 'nakasongola'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 1, unit: 'bag' }
        ],
        pest_control: [
          { type: 'fungicide', products: ['mancozeb', 'copper'], applications: 2 },
          { type: 'insecticide', products: ['dimethoate'], applications: 1 }
        ],
        labor_costs_ugx: {
          land_preparation: 60000,
          planting: 40000,
          weeding: 30000,
          harvesting: 50000
        },
        regional_suitability: ['Central', 'Eastern', 'Northern', 'Western'],
        soil_requirements: 'Well-drained soil',
        water_requirements: 'Moderate',
        market_demand: 'High',
        export_potential: 'Medium',
        roi_percentage: { min: 150, max: 400 }
      },

      // 4. COFFEE - Export Crop
      coffee: {
        name: 'Coffee',
        scientificName: 'Coffea arabica / Coffea canephora',
        category: 'cash_crops',
        image: 'coffee.png',
        duration_months: '3-4 years to first harvest',
        planting_seasons: ['March-May', 'September-November'],
        spacing: '3m × 3m',
        plants_per_acre: 450,
        expected_yield_kg: '1-3 per tree',
        market_price_min: 13000,
        market_price_max: 14000,
        farmgate_price_per_kg: { min: 13000, max: 14000 },
        seed_categories: ['nursery_bed'],
        seed_keywords: ['coffee', 'arabica', 'robusta', 'seedling'],
        fertilizer_plan: [
          { timing: 'Planting', product_type: 'Manure', quantity_per_acre: 20, unit: 'bags' },
          { timing: 'Every 3 months', product_type: 'NPK', quantity_per_acre: 5, unit: 'bags' }
        ],
        pest_control: [
          { type: 'organic', products: ['vermicompost', 'humate'], applications: 'ongoing' }
        ],
        labor_costs_ugx: {
          land_preparation: 150000,
          planting: 200000,
          weeding: 50000,
          mulching: 100000,
          harvesting: 100000
        },
        regional_suitability: ['Western', 'Southwestern', 'Eastern'],
        soil_requirements: 'Well-drained volcanic soil',
        water_requirements: 'Moderate',
        market_demand: 'High',
        export_potential: 'Very High',
        roi_percentage: { min: 200, max: 400 }
      },

      // 5. BANANA/MATOOKE - Staple Food
      banana: {
        name: 'Matooke (Cooking Banana)',
        scientificName: 'Musa acuminata',
        category: 'fruits',
        image: 'banana.png',
        duration_months: '12-14 first harvest',
        ratoon_months: '6-8',
        planting_seasons: ['Year-round (with irrigation)', 'March-May', 'September-November'],
        spacing: '3m × 3m',
        plantlets_per_acre: 450,
        expected_yield_bunches: '15-25 per plant per year',
        market_price_per_bunch: { min: 8000, max: 15000 },
        seed_categories: ['nursery_bed'],
        seed_keywords: ['banana', 'kibuzi', 'mbwazirume', 'bogoya', 'mpologoma'],
        fertilizer_plan: [
          { timing: 'Planting', product_type: 'Manure', quantity_per_acre: 20, unit: 'bags' },
          { timing: 'Every 3 months', product_type: 'NPK', quantity_per_acre: 5, unit: 'bags' }
        ],
        pest_control: [
          { type: 'organic', products: ['vermicompost', 'humate'], applications: 'ongoing' }
        ],
        labor_costs_ugx: {
          land_preparation: 150000,
          planting: 200000,
          weeding: 50000,
          mulching: 100000,
          harvesting: 100000
        },
        regional_suitability: ['Central', 'Western', 'Southwestern'],
        soil_requirements: 'Well-drained fertile soil',
        water_requirements: 'High',
        market_demand: 'Very High',
        export_potential: 'Medium',
        roi_percentage: { min: 100, max: 200 }
      },

      // 6. ONIONS - Vegetable Crop
      onions: {
        name: 'Onions',
        scientificName: 'Allium cepa',
        category: 'vegetables',
        image: 'onions.png',
        duration_days: '90-120',
        planting_seasons: ['February-March', 'August-September'],
        spacing: '30cm × 10cm',
        plants_per_acre: 50000,
        expected_yield_bags: '15-25',
        market_price_per_bag: { min: 210000, max: 250000 },
        seed_categories: ['seeds'],
        seed_keywords: ['onion', 'red', 'white', 'bombay'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 3, unit: 'bags' },
          { timing: 'Top dressing', product_type: 'Urea', quantity_per_acre: 2, unit: 'bags' }
        ],
        pest_control: [
          { type: 'fungicide', products: ['mancozeb'], applications: 2 },
          { type: 'insecticide', products: ['dimethoate'], applications: 2 }
        ],
        labor_costs_ugx: {
          land_preparation: 80000,
          planting: 60000,
          weeding: 40000,
          harvesting: 80000
        },
        regional_suitability: ['Central', 'Eastern', 'Northern'],
        soil_requirements: 'Well-drained sandy loam',
        water_requirements: 'Moderate',
        market_demand: 'High',
        export_potential: 'Medium',
        roi_percentage: { min: 300, max: 600 }
      },

      // 7. GROUNDNUTS - Oil Crop
      groundnuts: {
        name: 'Groundnuts (Peanuts)',
        scientificName: 'Arachis hypogaea',
        category: 'oil_crops',
        image: 'groundnuts.png',
        duration_days: '90-120',
        planting_seasons: ['March-April', 'September-October'],
        spacing: '50cm × 20cm',
        plants_per_acre: 10000,
        expected_yield_bags: '8-12',
        market_price_per_bag: { min: 150000, max: 200000 },
        farmgate_price_per_kg: { min: 4000, max: 4400 },
        seed_categories: ['seeds'],
        seed_keywords: ['groundnut', 'peanut', 'red', 'white'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 2, unit: 'bags' }
        ],
        pest_control: [
          { type: 'fungicide', products: ['mancozeb'], applications: 2 },
          { type: 'insecticide', products: ['dimethoate'], applications: 1 }
        ],
        labor_costs_ugx: {
          land_preparation: 70000,
          planting: 50000,
          weeding: 35000,
          harvesting: 70000
        },
        regional_suitability: ['Central', 'Eastern', 'Northern', 'Western'],
        soil_requirements: 'Well-drained sandy soil',
        water_requirements: 'Moderate',
        market_demand: 'High',
        export_potential: 'High',
        roi_percentage: { min: 250, max: 500 }
      },

      // 8. RICE - Cereal Crop
      rice: {
        name: 'Rice',
        scientificName: 'Oryza sativa',
        category: 'cereals',
        image: 'rice.png',
        duration_days: '120-150',
        planting_seasons: ['March-April', 'September-October'],
        spacing: '25cm × 25cm',
        plants_per_acre: 65000,
        expected_yield_bags: '15-25',
        market_price_per_bag: { min: 120000, max: 180000 },
        seed_categories: ['seeds'],
        seed_keywords: ['rice', 'paddy', 'nerica', 'basmati'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 3, unit: 'bags' },
          { timing: 'Top dressing', product_type: 'Urea', quantity_per_acre: 2, unit: 'bags' }
        ],
        pest_control: [
          { type: 'herbicide', products: ['glyphosate'], applications: 1 },
          { type: 'insecticide', products: ['lambda'], applications: 2 }
        ],
        labor_costs_ugx: {
          land_preparation: 100000,
          planting: 80000,
          weeding: 50000,
          harvesting: 100000
        },
        regional_suitability: ['Eastern', 'Northern', 'Central'],
        soil_requirements: 'Clay or clay loam',
        water_requirements: 'High',
        market_demand: 'Very High',
        export_potential: 'Medium',
        roi_percentage: { min: 200, max: 400 }
      },

      // 9. COTTON - Fiber Crop
      cotton: {
        name: 'Cotton',
        scientificName: 'Gossypium hirsutum',
        category: 'fiber_crops',
        image: 'cotton.png',
        duration_days: '150-180',
        planting_seasons: ['March-April'],
        spacing: '90cm × 30cm',
        plants_per_acre: 15000,
        expected_yield_bales: '2-4',
        market_price_per_bale: { min: 200000, max: 300000 },
        seed_categories: ['seeds'],
        seed_keywords: ['cotton', 'fiber', 'lint'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 3, unit: 'bags' },
          { timing: 'Top dressing', product_type: 'Urea', quantity_per_acre: 2, unit: 'bags' }
        ],
        pest_control: [
          { type: 'insecticide', products: ['lambda', 'dimethoate'], applications: 4 }
        ],
        labor_costs_ugx: {
          land_preparation: 80000,
          planting: 60000,
          weeding: 40000,
          spraying: 20000,
          harvesting: 120000
        },
        regional_suitability: ['Northern', 'Eastern'],
        soil_requirements: 'Well-drained soil',
        water_requirements: 'Moderate',
        market_demand: 'Medium',
        export_potential: 'High',
        roi_percentage: { min: 150, max: 300 }
      },

      // 10. SUGARCANE - Industrial Crop
      sugarcane: {
        name: 'Sugarcane',
        scientificName: 'Saccharum officinarum',
        category: 'industrial_crops',
        image: 'sugarcane.png',
        duration_months: '12-18',
        planting_seasons: ['March-April', 'September-October'],
        spacing: '90cm × 30cm',
        plants_per_acre: 15000,
        expected_yield_tons: '60-100',
        market_price_per_ton: { min: 150000, max: 200000 },
        seed_categories: ['nursery_bed'],
        seed_keywords: ['sugarcane', 'cane', 'setts'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 4, unit: 'bags' },
          { timing: 'Top dressing', product_type: 'Urea', quantity_per_acre: 3, unit: 'bags' }
        ],
        pest_control: [
          { type: 'herbicide', products: ['glyphosate'], applications: 2 }
        ],
        labor_costs_ugx: {
          land_preparation: 120000,
          planting: 80000,
          weeding: 60000,
          harvesting: 150000
        },
        regional_suitability: ['Central', 'Western'],
        soil_requirements: 'Well-drained fertile soil',
        water_requirements: 'High',
        market_demand: 'High',
        export_potential: 'Very High',
        roi_percentage: { min: 300, max: 600 }
      },

      // 11. PINEAPPLE - Fruit Crop
      pineapple: {
        name: 'Pineapple',
        scientificName: 'Ananas comosus',
        category: 'fruits',
        image: 'pineapple.png',
        duration_months: '18-24',
        planting_seasons: ['March-April', 'September-October'],
        spacing: '90cm × 60cm',
        plants_per_acre: 8000,
        expected_yield_fruits: '8000-12000',
        market_price_per_fruit: { min: 3000, max: 5000 },
        seed_categories: ['nursery_bed'],
        seed_keywords: ['pineapple', 'smooth cayenne', 'md2'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'Manure', quantity_per_acre: 15, unit: 'bags' },
          { timing: 'Top dressing', product_type: 'NPK', quantity_per_acre: 3, unit: 'bags' }
        ],
        pest_control: [
          { type: 'organic', products: ['vermicompost'], applications: 'ongoing' }
        ],
        labor_costs_ugx: {
          land_preparation: 100000,
          planting: 80000,
          weeding: 50000,
          harvesting: 100000
        },
        regional_suitability: ['Central', 'Eastern', 'Western'],
        soil_requirements: 'Well-drained sandy loam',
        water_requirements: 'Moderate',
        market_demand: 'High',
        export_potential: 'Very High',
        roi_percentage: { min: 400, max: 800 }
      },

      // 12. MANGOES - Fruit Tree
      mangoes: {
        name: 'Mangoes',
        scientificName: 'Mangifera indica',
        category: 'fruits',
        image: 'mangoes.png',
        duration_months: '3-4 years to first harvest',
        planting_seasons: ['March-May', 'September-November'],
        spacing: '10m × 10m',
        plants_per_acre: 40,
        expected_yield_fruits: '200-400 per tree',
        market_price_per_fruit: { min: 500, max: 1000 },
        seed_categories: ['nursery_bed'],
        seed_keywords: ['mango', 'kent', 'keitt', 'tommy atkins'],
        fertilizer_plan: [
          { timing: 'Planting', product_type: 'Manure', quantity_per_acre: 20, unit: 'bags' },
          { timing: 'Annual', product_type: 'NPK', quantity_per_acre: 5, unit: 'bags' }
        ],
        pest_control: [
          { type: 'organic', products: ['vermicompost'], applications: 'ongoing' }
        ],
        labor_costs_ugx: {
          land_preparation: 100000,
          planting: 150000,
          weeding: 30000,
          harvesting: 80000
        },
        regional_suitability: ['Central', 'Eastern', 'Northern'],
        soil_requirements: 'Well-drained soil',
        water_requirements: 'Moderate',
        market_demand: 'High',
        export_potential: 'High',
        roi_percentage: { min: 200, max: 400 }
      },

      // 13. AVOCADOS - High Value Fruit
      avocados: {
        name: 'Avocados',
        scientificName: 'Persea americana',
        category: 'fruits',
        image: 'avocados.png',
        duration_months: '3-4 years to first harvest',
        planting_seasons: ['March-May', 'September-November'],
        spacing: '8m × 8m',
        plants_per_acre: 60,
        expected_yield_fruits: '100-200 per tree',
        market_price_per_fruit: { min: 2000, max: 4000 },
        seed_categories: ['nursery_bed'],
        seed_keywords: ['avocado', 'hass', 'fuerte', 'reed'],
        fertilizer_plan: [
          { timing: 'Planting', product_type: 'Manure', quantity_per_acre: 20, unit: 'bags' },
          { timing: 'Annual', product_type: 'NPK', quantity_per_acre: 5, unit: 'bags' }
        ],
        pest_control: [
          { type: 'organic', products: ['vermicompost'], applications: 'ongoing' }
        ],
        labor_costs_ugx: {
          land_preparation: 100000,
          planting: 150000,
          weeding: 30000,
          harvesting: 80000
        },
        regional_suitability: ['Central', 'Eastern', 'Southwestern'],
        soil_requirements: 'Well-drained fertile soil',
        water_requirements: 'Moderate',
        market_demand: 'High',
        export_potential: 'Very High',
        roi_percentage: { min: 300, max: 600 }
      },

      // 14. CARROTS - Root Vegetable
      carrots: {
        name: 'Carrots',
        scientificName: 'Daucus carota',
        category: 'vegetables',
        image: 'carrot.png',
        duration_days: '90-120',
        planting_seasons: ['February-March', 'August-September'],
        spacing: '30cm × 5cm',
        plants_per_acre: 100000,
        expected_yield_bags: '20-30',
        market_price_per_bag: { min: 90000, max: 115000 },
        seed_categories: ['seeds'],
        seed_keywords: ['carrot', 'nantes', 'chantenay'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 2, unit: 'bags' },
          { timing: 'Top dressing', product_type: 'Urea', quantity_per_acre: 1, unit: 'bags' }
        ],
        pest_control: [
          { type: 'fungicide', products: ['mancozeb'], applications: 2 }
        ],
        labor_costs_ugx: {
          land_preparation: 60000,
          planting: 40000,
          weeding: 30000,
          harvesting: 60000
        },
        regional_suitability: ['Central', 'Eastern', 'Northern'],
        soil_requirements: 'Well-drained sandy soil',
        water_requirements: 'Moderate',
        market_demand: 'Medium',
        export_potential: 'Medium',
        roi_percentage: { min: 200, max: 400 }
      },

      // 15. SPINACH - Leafy Vegetable
      spinach: {
        name: 'Spinach',
        scientificName: 'Spinacia oleracea',
        category: 'vegetables',
        image: 'spinach.png',
        duration_days: '30-45',
        planting_seasons: ['Year-round'],
        spacing: '30cm × 15cm',
        plants_per_acre: 50000,
        expected_yield_bags: '10-15',
        market_price_per_bag: { min: 50000, max: 80000 },
        seed_categories: ['seeds'],
        seed_keywords: ['spinach', 'leafy', 'green'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 1, unit: 'bag' }
        ],
        pest_control: [
          { type: 'organic', products: ['vermicompost'], applications: 'ongoing' }
        ],
        labor_costs_ugx: {
          land_preparation: 40000,
          planting: 30000,
          weeding: 20000,
          harvesting: 40000
        },
        regional_suitability: ['Central', 'Eastern', 'Northern'],
        soil_requirements: 'Well-drained fertile soil',
        water_requirements: 'High',
        market_demand: 'Medium',
        export_potential: 'Low',
        roi_percentage: { min: 150, max: 300 }
      },

      // 16. MILLET - Traditional Cereal
      millet: {
        name: 'Millet',
        scientificName: 'Pennisetum glaucum',
        category: 'cereals',
        image: 'millet.png',
        duration_days: '90-120',
        planting_seasons: ['March-April', 'September-October'],
        spacing: '50cm × 20cm',
        plants_per_acre: 20000,
        expected_yield_bags: '8-12',
        market_price_per_bag: { min: 80000, max: 120000 },
        seed_categories: ['seeds'],
        seed_keywords: ['millet', 'pearl', 'finger'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 1, unit: 'bag' }
        ],
        pest_control: [
          { type: 'herbicide', products: ['atrazine'], applications: 1 }
        ],
        labor_costs_ugx: {
          land_preparation: 50000,
          planting: 30000,
          weeding: 25000,
          harvesting: 40000
        },
        regional_suitability: ['Northern', 'Eastern'],
        soil_requirements: 'Well-drained soil',
        water_requirements: 'Low',
        market_demand: 'Medium',
        export_potential: 'Low',
        roi_percentage: { min: 100, max: 250 }
      },

      // 17. SOYBEANS - Protein Crop
      soyabeans: {
        name: 'Soybeans',
        scientificName: 'Glycine max',
        category: 'legumes',
        image: 'soyabeans.png',
        duration_days: '90-120',
        planting_seasons: ['March-April', 'September-October'],
        spacing: '50cm × 10cm',
        plants_per_acre: 20000,
        expected_yield_bags: '6-10',
        market_price_per_bag: { min: 150000, max: 200000 },
        seed_categories: ['seeds'],
        seed_keywords: ['soybean', 'soya', 'protein'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 2, unit: 'bags' }
        ],
        pest_control: [
          { type: 'fungicide', products: ['mancozeb'], applications: 2 },
          { type: 'insecticide', products: ['dimethoate'], applications: 1 }
        ],
        labor_costs_ugx: {
          land_preparation: 70000,
          planting: 50000,
          weeding: 40000,
          harvesting: 70000
        },
        regional_suitability: ['Central', 'Eastern', 'Northern'],
        soil_requirements: 'Well-drained fertile soil',
        water_requirements: 'Moderate',
        market_demand: 'High',
        export_potential: 'High',
        roi_percentage: { min: 200, max: 400 }
      },

      // 18. CABBAGE - Leafy Vegetable
      cabbage: {
        name: 'Cabbage',
        scientificName: 'Brassica oleracea',
        category: 'vegetables',
        image: 'cabbage.png',
        duration_days: '80-100',
        planting_seasons: ['February-March', 'August-September'],
        spacing: '60cm × 45cm',
        plants_per_acre: 18000,
        expected_yield_heads: '15000-18000',
        market_price_per_head: { min: 1000, max: 2000 },
        seed_categories: ['seeds'],
        seed_keywords: ['cabbage', 'copenhagen', 'drumhead'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 3, unit: 'bags' },
          { timing: 'Top dressing', product_type: 'Urea', quantity_per_acre: 2, unit: 'bags' }
        ],
        pest_control: [
          { type: 'insecticide', products: ['dimethoate', 'lambda'], applications: 3 },
          { type: 'fungicide', products: ['mancozeb'], applications: 2 }
        ],
        labor_costs_ugx: {
          land_preparation: 80000,
          transplanting: 120000,
          weeding: 40000,
          spraying: 15000,
          harvesting: 100000
        },
        regional_suitability: ['Central', 'Eastern', 'Northern'],
        soil_requirements: 'Well-drained fertile soil',
        water_requirements: 'High',
        market_demand: 'High',
        export_potential: 'Medium',
        roi_percentage: { min: 400, max: 800 }
      },

      // 19. ORANGES - Citrus Fruit
      orangoes: {
        name: 'Oranges',
        scientificName: 'Citrus sinensis',
        category: 'fruits',
        image: 'orangoes.png',
        duration_months: '3-4 years to first harvest',
        planting_seasons: ['March-May', 'September-November'],
        spacing: '6m × 6m',
        plants_per_acre: 110,
        expected_yield_fruits: '200-400 per tree',
        market_price_per_fruit: { min: 300, max: 600 },
        seed_categories: ['nursery_bed'],
        seed_keywords: ['orange', 'citrus', 'valencia', 'navel'],
        fertilizer_plan: [
          { timing: 'Planting', product_type: 'Manure', quantity_per_acre: 20, unit: 'bags' },
          { timing: 'Annual', product_type: 'NPK', quantity_per_acre: 5, unit: 'bags' }
        ],
        pest_control: [
          { type: 'organic', products: ['vermicompost'], applications: 'ongoing' }
        ],
        labor_costs_ugx: {
          land_preparation: 100000,
          planting: 120000,
          weeding: 30000,
          harvesting: 80000
        },
        regional_suitability: ['Central', 'Eastern', 'Southwestern'],
        soil_requirements: 'Well-drained soil',
        water_requirements: 'Moderate',
        market_demand: 'High',
        export_potential: 'High',
        roi_percentage: { min: 200, max: 400 }
      }
    };
  }

  /**
   * Initialize market data sources
   */
  initializeMarketSources() {
    return {
      government: [
        'https://api.uganda-market.gov.ug/prices',
        'https://mofa.gov.ug/api/agricultural-prices',
        'https://ubos.org/api/agricultural-data'
      ],
      research: [
        'https://acsa-ug.org/api/market-data',
        'https://naro.go.ug/api/crop-data',
        'https://farmgainafrica.org/market-data'
      ],
      commercial: [
        'https://agrof.farm/api/market-prices',
        'https://uganda-agriculture.com/api/prices'
      ]
    };
  }

  /**
   * Initialize government data
   */
  initializeGovernmentData() {
    return {
      policies: {
        'Parish Development Model': 'Commercialization of smallholder agriculture',
        'Agricultural Credit Facility': 'Access to agricultural financing',
        'National Agricultural Advisory Services': 'Extension services support'
      },
      programs: {
        'Operation Wealth Creation': 'Agricultural modernization',
        'Emyooga': 'Financial inclusion for farmers',
        'Youth Livelihood Programme': 'Youth engagement in agriculture'
      },
      regulations: {
        'Seed and Plant Act': 'Quality seed regulations',
        'Fertilizer and Animal Feed Act': 'Input quality standards',
        'Agricultural Chemicals Act': 'Pesticide regulations'
      }
    };
  }

  /**
   * Initialize regional suitability
   */
  initializeRegionalSuitability() {
    return {
      'Central': {
        suitable_crops: ['maize', 'tomatoes', 'beans', 'onions', 'cabbage', 'carrots', 'spinach', 'mangoes', 'avocados', 'oranges'],
        soil_types: ['clay loam', 'sandy loam'],
        rainfall: '1000-1500mm',
        altitude: '1000-1400m'
      },
      'Eastern': {
        suitable_crops: ['maize', 'beans', 'rice', 'coffee', 'banana', 'onions', 'groundnuts', 'millet', 'soybeans', 'mangoes', 'oranges'],
        soil_types: ['clay', 'sandy loam'],
        rainfall: '800-1200mm',
        altitude: '800-1200m'
      },
      'Northern': {
        suitable_crops: ['maize', 'beans', 'rice', 'groundnuts', 'cotton', 'millet', 'soybeans', 'mangoes'],
        soil_types: ['sandy', 'clay'],
        rainfall: '600-1000mm',
        altitude: '600-1000m'
      },
      'Western': {
        suitable_crops: ['maize', 'coffee', 'banana', 'sugarcane', 'pineapple', 'mangoes', 'avocados', 'oranges'],
        soil_types: ['volcanic', 'clay loam'],
        rainfall: '1200-1800mm',
        altitude: '1000-2000m'
      },
      'Southwestern': {
        suitable_crops: ['coffee', 'banana', 'pineapple', 'mangoes', 'avocados', 'oranges'],
        soil_types: ['volcanic', 'fertile loam'],
        rainfall: '1500-2000mm',
        altitude: '1200-2500m'
      }
    };
  }

  /**
   * Get comprehensive crop data
   */
  getCropData(cropName) {
    const normalizedName = cropName.toLowerCase().replace(/\s+/g, '_');
    return this.crops[normalizedName] || null;
  }

  /**
   * Get all crops
   */
  getAllCrops() {
    const crops = Object.values(this.crops);
    return Array.isArray(crops) ? crops : [];
  }

  /**
   * Get crops by category
   */
  getCropsByCategory(category) {
    return Object.values(this.crops).filter(crop => crop.category === category);
  }

  /**
   * Get crops suitable for region
   */
  getCropsForRegion(region) {
    const regionData = this.regionalSuitability[region];
    if (!regionData) return [];
    
    return Object.values(this.crops).filter(crop => 
      regionData.suitable_crops.includes(crop.name.toLowerCase())
    );
  }

  /**
   * Get market data sources
   */
  getMarketSources() {
    return this.marketSources;
  }

  /**
   * Get government data
   */
  getGovernmentData() {
    return this.governmentData;
  }

  /**
   * Get regional suitability data
   */
  getRegionalSuitability() {
    return this.regionalSuitability;
  }

  /**
   * Search crops by keyword
   */
  searchCrops(keyword) {
    const searchTerm = keyword.toLowerCase();
    return Object.values(this.crops).filter(crop => 
      crop.name.toLowerCase().includes(searchTerm) ||
      crop.scientificName.toLowerCase().includes(searchTerm) ||
      crop.category.toLowerCase().includes(searchTerm) ||
      crop.seed_keywords.some(kw => kw.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Get high ROI crops
   */
  getHighROICrops(minROI = 300) {
    return Object.values(this.crops).filter(crop => 
      crop.roi_percentage.min >= minROI
    );
  }

  /**
   * Get export potential crops
   */
  getExportCrops() {
    return Object.values(this.crops).filter(crop => 
      crop.export_potential === 'High' || crop.export_potential === 'Very High'
    );
  }

  /**
   * Get database statistics
   */
  getDatabaseStats() {
    const crops = Object.values(this.crops);
    return {
      total_crops: crops.length,
      categories: [...new Set(crops.map(c => c.category))],
      high_roi_crops: this.getHighROICrops().length,
      export_crops: this.getExportCrops().length,
      regions_covered: Object.keys(this.regionalSuitability).length,
      market_sources: Object.values(this.marketSources).flat().length
    };
  }

  getCropById(cropId) {
    // First try to find by exact key match
    if (this.crops[cropId]) {
      return { ...this.crops[cropId], id: cropId };
    }
    
    // Then try to find by name match (case insensitive)
    const crops = Object.entries(this.crops);
    for (const [key, crop] of crops) {
      if (crop.name.toLowerCase() === cropId.toLowerCase()) {
        return { ...crop, id: key };
      }
    }
    
    // Finally try to find by partial name match
    for (const [key, crop] of crops) {
      if (crop.name.toLowerCase().includes(cropId.toLowerCase())) {
        return { ...crop, id: key };
      }
    }
    
    return null;
  }
}

export default new ComprehensiveCropDatabase();
