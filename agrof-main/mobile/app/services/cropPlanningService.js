/**
 * Crop Planning Service
 * Generates intelligent farm plans based on real store products and Uganda agricultural data
 */

import { STORE_API_URL } from '../config/apiConfig';

class CropPlanningService {
  constructor() {
    this.cropDatabase = this.initializeCropDatabase();
  }

  /**
   * Initialize crop planning database with Uganda-specific data
   */
  initializeCropDatabase() {
    return {
      tomatoes: {
        name: 'Tomatoes',
        duration_days: '90-120',
        planting_seasons: ['March-April', 'September-October'],
        spacing: '60cm × 45cm',
        plants_per_acre: 18000,
        expected_yield_tons: '8-12',
        market_price_min: 1500,
        market_price_max: 2500,
        seed_categories: ['seeds'],
        seed_keywords: ['tomato', 'maxim', 'tengeru', 'cal-j'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 4, unit: 'bags' },
          { timing: 'Top dressing (Week 3)', product_type: 'Urea', quantity_per_acre: 2, unit: 'bags' },
          { timing: 'Top dressing (Week 6)', product_type: 'NPK', quantity_per_acre: 2, unit: 'bags' },
        ],
        pest_control: [
          { type: 'fungicide', products: ['ridomil', 'dithane', 'mancozeb'], applications: 4 },
          { type: 'insecticide', products: ['dimethoate', 'lambda'], applications: 3 },
        ],
        labor_costs_ugx: {
          land_preparation: 100000,
          planting: 100000,
          weeding: 40000,  // per round × 2
          spraying: 15000,  // per round × 4
          staking: 50000,
          harvesting: 80000,
        }
      },
      
      maize: {
        name: 'Maize',
        duration_days: '90-120',
        planting_seasons: ['March-April', 'September-October'],
        spacing: '75cm × 25cm',
        plants_per_acre: 21000,
        expected_yield_bags: '20-30',
        market_price_per_bag: { min: 80000, max: 120000 },
        seed_categories: ['seeds'],
        seed_keywords: ['maize', 'duma', 'longe'],
        seed_quantity_kg: 10,
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 2, unit: 'bags' },
          { timing: 'Top dressing (Week 4)', product_type: 'Urea', quantity_per_acre: 1, unit: 'bags' },
        ],
        pest_control: [
          { type: 'herbicide', products: ['atrazine', 'glyphosate'], applications: 1 },
          { type: 'insecticide', products: ['lambda', 'dimethoate'], applications: 2 },
        ],
        labor_costs_ugx: {
          land_preparation: 80000,
          planting: 50000,
          weeding: 40000,
          spraying: 15000,
          harvesting: 60000,
        }
      },

      banana: {
        name: 'Matooke (Cooking Banana)',
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
          { timing: 'Every 3 months', product_type: 'NPK', quantity_per_acre: 5, unit: 'bags' },
        ],
        pest_control: [
          { type: 'organic', products: ['vermicompost', 'humate'], applications: 'ongoing' },
        ],
        labor_costs_ugx: {
          land_preparation: 150000,
          planting: 200000,
          weeding: 50000,  // per round × 3
          mulching: 100000,
          harvesting: 100000,
        }
      },

      beans: {
        name: 'Beans',
        duration_days: '60-90',
        planting_seasons: ['March-April', 'September-October'],
        spacing: '50cm × 10cm',
        seed_quantity_kg: 20,
        expected_yield_bags: '5-8',
        market_price_per_bag: { min: 120000, max: 180000 },
        seed_categories: ['seeds'],
        seed_keywords: ['bean', 'k132', 'nabe'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 1, unit: 'bag' },
        ],
        pest_control: [
          { type: 'fungicide', products: ['mancozeb', 'copper'], applications: 2 },
          { type: 'insecticide', products: ['dimethoate'], applications: 1 },
        ],
        labor_costs_ugx: {
          land_preparation: 60000,
          planting: 40000,
          weeding: 30000,
          harvesting: 50000,
        }
      },

      coffee: {
        name: 'Coffee',
        duration_days: '365-730', // Coffee is perennial, takes 1-2 years to first harvest
        planting_seasons: ['March-April', 'September-October'],
        spacing: '3m × 3m',
        plants_per_acre: 450,
        expected_yield_kg: '300-600',
        market_price_per_kg: { min: 12000, max: 15000 },
        seed_categories: ['seeds'],
        seed_keywords: ['coffee', 'arabica', 'robusta'],
        seed_quantity_kg: 2,
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'NPK 16-2-31', quantity_per_acre: 2, unit: 'bags' },
          { timing: 'Top dressing (Month 6)', product_type: 'Urea', quantity_per_acre: 1, unit: 'bag' },
          { timing: 'Annual maintenance', product_type: 'NPK 16-2-31', quantity_per_acre: 1, unit: 'bag' },
        ],
        pest_control: [
          { type: 'fungicide', products: ['copper', 'mancozeb'], applications: 3 },
          { type: 'insecticide', products: ['dimethoate', 'lambda'], applications: 2 },
        ],
        labor_costs_ugx: {
          land_preparation: 150000,
          planting: 80000,
          weeding: 60000, // per round × 4
          pruning: 100000,
          harvesting: 120000,
          processing: 80000,
        }
      },

      cabbage: {
        name: 'Cabbage',
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
          { timing: 'Top dressing', product_type: 'Urea', quantity_per_acre: 2, unit: 'bags' },
        ],
        pest_control: [
          { type: 'insecticide', products: ['dimethoate', 'lambda'], applications: 3 },
          { type: 'fungicide', products: ['mancozeb'], applications: 2 },
        ],
        labor_costs_ugx: {
          land_preparation: 80000,
          transplanting: 120000,
          weeding: 40000,
          spraying: 15000,
          harvesting: 100000,
        }
      },

      watermelon: {
        name: 'Watermelon',
        duration_days: '75-90',
        planting_seasons: ['February-March', 'July-August'],
        spacing: '2m × 2m',
        plants_per_acre: 1000,
        expected_yield_fruits: '8000-12000',
        market_price_per_fruit: { min: 3000, max: 5000 },
        seed_categories: ['seeds'],
        seed_keywords: ['watermelon', 'sugar baby', 'julie'],
        fertilizer_plan: [
          { timing: 'Basal', product_type: 'DAP', quantity_per_acre: 2, unit: 'bags' },
          { timing: 'Flowering', product_type: 'NPK', quantity_per_acre: 2, unit: 'bags' },
        ],
        pest_control: [
          { type: 'fungicide', products: ['mancozeb', 'copper'], applications: 2 },
          { type: 'insecticide', products: ['dimethoate'], applications: 2 },
        ],
        labor_costs_ugx: {
          land_preparation: 70000,
          planting: 60000,
          weeding: 35000,
          spraying: 15000,
          harvesting: 80000,
        }
      },
    };
  }

  /**
   * Generate comprehensive farm plan for a crop
   * @param {string} cropType - Type of crop (tomatoes, maize, etc.)
   * @param {number} acres - Farm size in acres
   * @param {string} language - Language for responses
   * @returns {Promise<Object>} Complete farm plan with products from store
   */
  async generateCropPlan(cropType, acres = 1, language = 'en') {
    const cropKey = cropType.toLowerCase().replace(/\s+/g, '_');
    const cropData = this.cropDatabase[cropKey];
    
    if (!cropData) {
      throw new Error(`Crop '${cropType}' not found in database. Available crops: ${Object.keys(this.cropDatabase).join(', ')}`);
    }

    console.log(`🌾 Generating plan for ${cropData.name} on ${acres} acres`);

    try {
      // Step 1: Fetch seed varieties from store
      const seeds = await this.fetchCropSeeds(cropData);

      // Step 2: Fetch fertilizers
      const fertilizers = await this.fetchFertilizers(cropData, acres);

      // Step 3: Fetch pest control products
      const pestControl = await this.fetchPestControl(cropData, acres);

      // Step 4: Calculate labor costs
      const laborCosts = this.calculateLaborCosts(cropData, acres);

      // Step 5: Build complete budget
      const budget = this.buildBudget(seeds, fertilizers, pestControl, laborCosts, acres);

      // Step 6: Calculate ROI
      const roi = this.calculateROI(budget.total, cropData, acres);

      return {
        crop: cropData.name,
        acres: acres,
        duration: cropData.duration_days || cropData.duration_months,
        planting_seasons: cropData.planting_seasons,
        seed_varieties: seeds,
        budget_items: budget.items,
        total_investment: budget.total,
        expected_yield: this.calculateExpectedYield(cropData, acres),
        expected_revenue: roi.revenue,
        expected_profit: roi.profit,
        roi_percentage: roi.percentage,
        planting_guide: this.getPlantingGuide(cropData),
      };
    } catch (error) {
      console.error('Error generating crop plan:', error);
      throw error;
    }
  }

  /**
   * Fetch seed varieties from store
   */
  async fetchCropSeeds(cropData) {
    try {
      const response = await fetch(`${STORE_API_URL}/products?category=seeds&limit=100`);
      const allSeeds = await response.json();

      // Filter seeds matching this crop
      const matchingSeeds = allSeeds.filter(seed => {
        const nameLower = seed.name.toLowerCase();
        return cropData.seed_keywords.some(keyword => nameLower.includes(keyword));
      });

      // Add nursery bed products for banana
      if (cropData.seed_categories.includes('nursery_bed')) {
        const nurseryResponse = await fetch(`${STORE_API_URL}/products?category=nursery_bed&limit=100`);
        const nurseryProducts = await nurseryResponse.json();
        
        const matchingNursery = nurseryProducts.filter(product => {
          const nameLower = product.name.toLowerCase();
          return cropData.seed_keywords.some(keyword => nameLower.includes(keyword));
        });
        
        matchingSeeds.push(...matchingNursery);
      }

      console.log(`🌱 Found ${matchingSeeds.length} seed varieties for ${cropData.name}`);
      return matchingSeeds;
    } catch (error) {
      console.error('Error fetching seeds:', error);
      return [];
    }
  }

  /**
   * Fetch fertilizers from store
   */
  async fetchFertilizers(cropData, acres) {
    try {
      const response = await fetch(`${STORE_API_URL}/products?category=fertilizers&limit=100`);
      const allFertilizers = await response.json();

      const requiredFertilizers = [];

      for (const fertPlan of cropData.fertilizer_plan) {
        const fertType = fertPlan.product_type.toLowerCase();
        
        // Find matching fertilizer in store
        const matchingFert = allFertilizers.find(f => 
          f.name.toLowerCase().includes(fertType) ||
          (fertType === 'manure' && f.name.toLowerCase().includes('organic'))
        );

        if (matchingFert) {
          requiredFertilizers.push({
            ...matchingFert,
            quantity: Math.ceil(fertPlan.quantity_per_acre * acres),
            unit: fertPlan.unit,
            timing: fertPlan.timing,
            total_cost: this.calculateProductCost(matchingFert, fertPlan.quantity_per_acre * acres)
          });
        }
      }

      console.log(`🌱 Found ${requiredFertilizers.length} fertilizers for plan`);
      return requiredFertilizers;
    } catch (error) {
      console.error('Error fetching fertilizers:', error);
      return [];
    }
  }

  /**
   * Fetch pest control products
   */
  async fetchPestControl(cropData, acres) {
    try {
      const pestControlProducts = [];

      for (const pestPlan of cropData.pest_control) {
        const category = pestPlan.type === 'herbicide' ? 'herbicides' : 
                        pestPlan.type === 'fungicide' ? 'fungicides' : 
                        pestPlan.type === 'insecticide' ? 'insecticides' :
                        'organic_chemicals';

        const response = await fetch(`${STORE_API_URL}/products?category=${category}&limit=100`);
        const products = await response.json();

        // Find matching products
        for (const keyword of pestPlan.products) {
          const matchingProduct = products.find(p => 
            p.name.toLowerCase().includes(keyword.toLowerCase())
          );

          if (matchingProduct) {
            const quantity = typeof pestPlan.applications === 'number' ? 
                           Math.ceil(pestPlan.applications * acres / 5) : 1;
            
            pestControlProducts.push({
              ...matchingProduct,
              quantity: quantity,
              unit: 'L or kg',
              timing: `${pestPlan.applications} applications`,
              total_cost: this.calculateProductCost(matchingProduct, quantity)
            });
            break; // Only add one product per pest type
          }
        }
      }

      console.log(`🦠 Found ${pestControlProducts.length} pest control products`);
      return pestControlProducts;
    } catch (error) {
      console.error('Error fetching pest control:', error);
      return [];
    }
  }

  /**
   * Calculate product cost from price string
   */
  calculateProductCost(product, quantity) {
    const priceStr = product.price || product.selling_price || '0';
    
    // Extract number from "UGX 35,000" format
    const priceMatch = priceStr.match(/[\d,]+/);
    if (priceMatch) {
      const price = parseInt(priceMatch[0].replace(/,/g, ''));
      return price * quantity;
    }
    
    return 0; // Contact for pricing
  }

  /**
   * Calculate labor costs
   */
  calculateLaborCosts(cropData, acres) {
    const laborItems = [];
    
    for (const [task, costPerAcre] of Object.entries(cropData.labor_costs_ugx)) {
      const taskName = task.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const multiplier = task === 'weeding' ? 2 : task === 'spraying' ? 4 : 1;
      
      laborItems.push({
        category: 'labor',
        name: taskName,
        quantity: multiplier * acres,
        unit: multiplier > 1 ? 'rounds' : 'acre',
        unit_cost: costPerAcre,
        total_cost: costPerAcre * multiplier * acres,
      });
    }

    return laborItems;
  }

  /**
   * Build complete budget
   */
  buildBudget(seeds, fertilizers, pestControl, laborCosts, acres) {
    const items = [];
    let total = 0;

    // Add seed if user selected one
    if (seeds.length > 0) {
      items.push({
        category: 'seeds',
        section: '🌱 Seeds & Planting',
        products: seeds.map(s => ({
          id: s.id,
          name: s.name,
          image_url: s.image_url,
          price: s.price,
          quantity: 1,
          can_buy: true
        }))
      });
    }

    // Add fertilizers
    if (fertilizers.length > 0) {
      items.push({
        category: 'fertilizers',
        section: '🌿 Fertilizers',
        products: fertilizers.map(f => ({
          id: f.id,
          name: f.name,
          image_url: f.image_url,
          quantity: f.quantity,
          unit: f.unit,
          timing: f.timing,
          price: f.price,
          total_cost: f.total_cost,
          can_buy: true
        }))
      });
      total += fertilizers.reduce((sum, f) => sum + f.total_cost, 0);
    }

    // Add pest control
    if (pestControl.length > 0) {
      items.push({
        category: 'pest_control',
        section: '🛡️ Pest & Disease Control',
        products: pestControl.map(p => ({
          id: p.id,
          name: p.name,
          image_url: p.image_url,
          quantity: p.quantity,
          unit: p.unit,
          timing: p.timing,
          price: p.price,
          total_cost: p.total_cost,
          can_buy: true
        }))
      });
      total += pestControl.reduce((sum, p) => sum + p.total_cost, 0);
    }

    // Add labor
    if (laborCosts.length > 0) {
      items.push({
        category: 'labor',
        section: '👷 Labor & Operations',
        products: laborCosts.map(l => ({
          name: l.name,
          quantity: l.quantity,
          unit: l.unit,
          unit_cost: l.unit_cost,
          total_cost: l.total_cost,
          can_buy: false
        }))
      });
      total += laborCosts.reduce((sum, l) => sum + l.total_cost, 0);
    }

    return { items, total };
  }

  /**
   * Calculate expected yield
   */
  calculateExpectedYield(cropData, acres) {
    if (cropData.expected_yield_tons) {
      const [min, max] = cropData.expected_yield_tons.split('-').map(n => parseInt(n));
      return {
        min: min * acres,
        max: max * acres,
        unit: 'tons'
      };
    } else if (cropData.expected_yield_bags) {
      const [min, max] = cropData.expected_yield_bags.split('-').map(n => parseInt(n));
      return {
        min: min * acres,
        max: max * acres,
        unit: 'bags'
      };
    } else if (cropData.expected_yield_bunches) {
      // Banana calculation
      const plantsPerAcre = cropData.plantlets_per_acre;
      const [minBunches, maxBunches] = cropData.expected_yield_bunches.split('-').map(n => parseInt(n));
      return {
        min: plantsPerAcre * acres * minBunches,
        max: plantsPerAcre * acres * maxBunches,
        unit: 'bunches per year'
      };
    }
    
    return null;
  }

  /**
   * Calculate ROI
   */
  calculateROI(totalCost, cropData, acres) {
    let revenueMin, revenueMax;

    if (cropData.market_price_min) {
      const [minYield, maxYield] = cropData.expected_yield_tons.split('-').map(n => parseInt(n) * 1000); // to kg
      revenueMin = minYield * acres * cropData.market_price_min;
      revenueMax = maxYield * acres * cropData.market_price_max;
    } else if (cropData.market_price_per_bag) {
      const [minYield, maxYield] = cropData.expected_yield_bags.split('-').map(n => parseInt(n));
      revenueMin = minYield * acres * cropData.market_price_per_bag.min;
      revenueMax = maxYield * acres * cropData.market_price_per_bag.max;
    } else if (cropData.market_price_per_bunch) {
      const plantsPerAcre = cropData.plantlets_per_acre;
      const [minBunches, maxBunches] = cropData.expected_yield_bunches.split('-').map(n => parseInt(n));
      revenueMin = plantsPerAcre * acres * minBunches * cropData.market_price_per_bunch.min;
      revenueMax = plantsPerAcre * acres * maxBunches * cropData.market_price_per_bunch.max;
    } else if (cropData.market_price_per_head) {
      const [minYield, maxYield] = cropData.expected_yield_heads.split('-').map(n => parseInt(n));
      revenueMin = minYield * acres * cropData.market_price_per_head.min;
      revenueMax = maxYield * acres * cropData.market_price_per_head.max;
    }

    const profitMin = revenueMin - totalCost;
    const profitMax = revenueMax - totalCost;
    const roiMin = Math.round((profitMin / totalCost) * 100);
    const roiMax = Math.round((profitMax / totalCost) * 100);

    return {
      revenue: { min: revenueMin, max: revenueMax },
      profit: { min: profitMin, max: profitMax },
      percentage: { min: roiMin, max: roiMax }
    };
  }

  /**
   * Get planting guide
   */
  getPlantingGuide(cropData) {
    return {
      spacing: cropData.spacing,
      duration: cropData.duration_days || cropData.duration_months,
      best_seasons: cropData.planting_seasons,
      plants_per_acre: cropData.plants_per_acre || cropData.plantlets_per_acre,
    };
  }

  /**
   * Format currency in UGX
   */
  formatUGX(amount) {
    return `UGX ${Math.round(amount).toLocaleString()}`;
  }
}

export default new CropPlanningService();

