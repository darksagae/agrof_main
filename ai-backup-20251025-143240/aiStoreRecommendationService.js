import comprehensiveCropDatabase from './comprehensiveCropDatabase';
import storeDatabase from './storeDatabase';

class AIStoreRecommendationService {
  constructor() {
    this.storeProducts = new Map();
    this.cropRequirements = new Map();
    this.recommendations = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    console.log('🔄 Initializing AI Store Recommendation Service...');
    
    await this.loadStoreProducts();
    await this.analyzeCropRequirements();
    
    this.initialized = true;
    console.log('✅ AI Store Recommendation Service initialized');
  }

  async loadStoreProducts() {
    try {
      console.log('🏪 Loading all store products for AI analysis...');
      await storeDatabase.initialize();
      const products = storeDatabase.getAllProducts();
      
      console.log(`📦 Store database returned ${products.length} products`);
      console.log(`📦 First few products:`, products.slice(0, 3));
      
      products.forEach(product => {
        this.storeProducts.set(product.id, product);
      });
      
      console.log(`✅ Loaded ${products.length} store products for AI analysis`);
      console.log(`✅ Store products Map size: ${this.storeProducts.size}`);
      console.log(`✅ Sample store products:`, Array.from(this.storeProducts.values()).slice(0, 3));
    } catch (error) {
      console.error('❌ Failed to load store products:', error);
    }
  }

  async analyzeCropRequirements() {
    try {
      console.log('🌾 Analyzing crop requirements for all 19 crops...');
      const crops = comprehensiveCropDatabase.getAllCrops();
      
      console.log(`📊 Found ${crops.length} crops in database`);
      
      crops.forEach(crop => {
        const requirements = this.extractCropRequirements(crop);
        if (requirements) {
          // Use crop name as the key since crop objects don't have an 'id' property
          const cropKey = crop.name.toLowerCase();
          this.cropRequirements.set(cropKey, requirements);
          console.log(`✅ Analyzed requirements for ${crop.name} (key: ${cropKey}):`, requirements);
        } else {
          console.log(`❌ Failed to extract requirements for ${crop.name}`);
        }
      });
      
      console.log(`✅ Analyzed requirements for ${crops.length} crops`);
    } catch (error) {
      console.error('❌ Failed to analyze crop requirements:', error);
    }
  }

  extractCropRequirements(crop) {
    if (!crop) {
      console.log('❌ No crop data provided');
      return null;
    }

    return {
      // Seed requirements based on crop data
      seeds: {
        cropName: crop.name.toLowerCase(),
        keywords: crop.seed_keywords || [crop.name.toLowerCase()],
        quality: 'certified', // Default quality
        treatment: 'treated', // Default treatment
        yield: 'high', // Default yield expectation
        diseaseResistance: 'moderate' // Default disease resistance
      },
      
      // Fertilizer requirements based on fertilizer_plan
      fertilizers: {
        npk: this.extractNPKFromFertilizerPlan(crop.fertilizer_plan),
        organic: false, // Default to inorganic
        micronutrients: ['zinc', 'boron'], // Default micronutrients
        applicationRate: 'moderate', // Default application rate
        soilType: crop.soil_requirements || 'loamy'
      },
      
      // Pesticide requirements based on pest_control
      pesticides: {
        fungicides: this.hasPestControlType(crop.pest_control, 'fungicide'),
        insecticides: this.hasPestControlType(crop.pest_control, 'insecticide'),
        herbicides: this.hasPestControlType(crop.pest_control, 'herbicide'),
        organic: false // Default to inorganic pesticides
      },
      
      // Equipment requirements based on crop characteristics
      equipment: {
        planting: ['seeder', 'planter'], // Default planting equipment
        irrigation: crop.water_requirements === 'High', // Based on water requirements
        harvesting: ['harvester', 'thresher'], // Default harvesting equipment
        protection: ['shade_net', 'mulch'] // Default protection equipment
      },
      
      // Soil requirements based on crop data
      soil: {
        amendments: this.extractSoilAmendments(crop.soil_requirements),
        ph: '6.0-7.0', // Default pH range
        drainage: 'good' // Default drainage
      },
      
      // Growth requirements based on crop characteristics
      growth: {
        spacing: crop.spacing || 'moderate',
        support: crop.category === 'vegetables', // Vegetables often need support
        pruning: crop.category === 'fruits', // Fruits often need pruning
        training: crop.category === 'fruits' // Fruits often need training
      }
    };
  }

  extractNPKFromFertilizerPlan(fertilizerPlan) {
    if (!fertilizerPlan || !Array.isArray(fertilizerPlan)) {
      return '20-20-20'; // Default NPK
    }
    
    // Look for DAP (18-46-0) or Urea (46-0-0) in the plan
    for (const plan of fertilizerPlan) {
      if (plan.product_type === 'DAP') {
        return '18-46-0';
      }
      if (plan.product_type === 'Urea') {
        return '46-0-0';
      }
    }
    
    return '20-20-20'; // Default balanced NPK
  }

  hasPestControlType(pestControl, type) {
    if (!pestControl || !Array.isArray(pestControl)) {
      return false;
    }
    
    return pestControl.some(control => control.type === type);
  }

  extractSoilAmendments(soilRequirements) {
    if (!soilRequirements) {
      return ['lime', 'compost']; // Default amendments
    }
    
    const amendments = ['compost']; // Always include compost
    
    if (soilRequirements.includes('acidic') || soilRequirements.includes('low pH')) {
      amendments.push('lime');
    }
    
    if (soilRequirements.includes('clay') || soilRequirements.includes('heavy')) {
      amendments.push('gypsum');
    }
    
    return amendments;
  }


  async generateCropRecommendations(cropId, requirements) {
    try {
      console.log(`🧠 Generating AI recommendations for ${cropId}...`);
      
      if (!requirements) {
        console.log('❌ No requirements found - cannot generate recommendations');
        return {
          seeds: [],
          fertilizers: [],
          pesticides: [],
          equipment: [],
          soilAmendments: [],
          tools: [],
          totalCost: 0,
          aiReasoning: ['No crop requirements found - cannot generate recommendations']
        };
      }

      const recommendations = {
        seeds: this.findSeedRecommendations(cropId, requirements.seeds),
        fertilizers: this.findFertilizerRecommendations(requirements.fertilizers),
        pesticides: this.findPesticideRecommendations(requirements.pesticides),
        tools: this.findToolRecommendations(requirements.tools),
        soilAmendments: this.findSoilAmendmentRecommendations(requirements.soil),
        totalCost: 0,
        aiReasoning: this.generateAIReasoning(cropId, requirements)
      };

      // Calculate total cost
      recommendations.totalCost = this.calculateTotalCost(recommendations);
      
      console.log(`✅ Generated recommendations for ${cropId}:`, recommendations);
      return recommendations;
    } catch (error) {
      console.error(`❌ Failed to generate recommendations for ${cropId}:`, error);
      return {
        seeds: [],
        fertilizers: [],
        pesticides: [],
        equipment: [],
        soilAmendments: [],
        tools: [],
        totalCost: 0,
        aiReasoning: ['Error generating recommendations - no data available']
      };
    }
  }

  findSeedRecommendations(cropId, seedRequirements) {
    console.log(`🌱 Finding seed recommendations for ${cropId}...`);
    console.log(`📊 Store products Map size: ${this.storeProducts.size}`);
    
    if (!seedRequirements) {
      console.log(`⚠️ No seed requirements provided, using basic matching`);
      seedRequirements = { cropName: cropId };
    }

    // Get all products from the SEEDS category in the store
    const seedProducts = Array.from(this.storeProducts.values())
      .filter(product => product.category === 'seeds');

    console.log(`📦 Found ${seedProducts.length} seed products in store`);
    console.log(`📦 Seed products:`, seedProducts.map(p => ({ id: p.id, name: p.name, category: p.category })));

    if (seedProducts.length === 0) {
      console.log(`❌ No seed products found in store database`);
      return [];
    }

    // AI Machine Learning Logic: Score and rank seeds based on crop requirements
    const scoredSeeds = seedProducts.map(product => ({
      ...product,
      score: this.calculateAdvancedSeedScore(product, seedRequirements, cropId)
    })).sort((a, b) => b.score - a.score);

    // Filter out products with score 0
    const validSeeds = scoredSeeds.filter(seed => seed.score > 0);
    
    // Simple approach: return top 3 seeds, but try to avoid exact duplicates
    const recommendations = [];
    const usedNames = new Set();
    
    for (const seed of validSeeds) {
      if (recommendations.length >= 3) break;
      
      // Only avoid exact name duplicates, allow similar products
      const seedKey = seed.name.toLowerCase().trim();
      if (!usedNames.has(seedKey)) {
        recommendations.push(seed);
        usedNames.add(seedKey);
      }
    }
    
    // If we still don't have 3, just take the top 3 regardless
    if (recommendations.length < 3) {
      const topSeeds = validSeeds.slice(0, 3);
      recommendations.length = 0; // Clear array
      recommendations.push(...topSeeds);
    }
    
    console.log(`✅ Returning ${recommendations.length} seed recommendations`);
    console.log(`✅ Recommended seeds:`, recommendations.map(r => ({ id: r.id, name: r.name, score: r.score })));
    console.log(`🔍 Debug - Total valid seeds: ${validSeeds.length}`);
    console.log(`🔍 Debug - Valid seeds:`, validSeeds.map(s => ({ name: s.name, score: s.score })));
    
    return recommendations;
  }

  getProductType(productName) {
    // Categorize products by type to ensure variety
    const name = productName.toLowerCase();
    
    if (name.includes('f1') || name.includes('hybrid')) return 'hybrid';
    if (name.includes('open') || name.includes('pollinated')) return 'open_pollinated';
    if (name.includes('tissue') || name.includes('t.c')) return 'tissue_culture';
    if (name.includes('drum') || name.includes('giant')) return 'large_variety';
    if (name.includes('market') || name.includes('copenhagen')) return 'market_variety';
    if (name.includes('wonder') || name.includes('california')) return 'premium_variety';
    
    return 'standard';
  }

  isCropSpecificSeed(productName, cropName) {
    // Define crop-specific seed matching logic
    const cropSeedMappings = {
      'maize': ['maize', 'corn', 'duma', 'sc duma'],
      'tomatoes': ['tomato', 'maxim', 'cal-j', 'tengeru', 'rambo', 'tandi', 'nouvelle'],
      'cabbage': ['cabbage', 'copenhagen', 'fanaka', 'giant drum', 'indica', 'kifaru', 'zawadi'],
      'peppers': ['pepper', 'california wonder', 'cayenne', 'green gold', 'kaveri', 'habanero'],
      'rice': ['rice', 'namuche', 'namche'],
      'watermelon': ['watermelon', 'sugar baby', 'sukari'],
      'cucumber': ['cucumber', 'ashley'],
      'eggplant': ['eggplant', 'femi', 'arjani', 'black beauty', 'long purple', 'merdan'],
      'banana': ['banana', 'atwalira', 'bogoya', 'kibuzi', 'kisansa', 'mbwazirume', 'mpologoma', 'musakala', 'nakatansese'],
      'beans': ['bean', 'mak soy'],
      'coffee': ['coffee'],
      'onions': ['onion', 'green bunching'],
      'groundnuts': ['groundnut', 'peanut'],
      'cotton': ['cotton'],
      'sugarcane': ['sugarcane'],
      'pineapple': ['pineapple'],
      'mangoes': ['mango'],
      'avocados': ['avocado'],
      'carrot': ['carrot'],
      'spinach': ['spinach', 'sukuma', 'swiss chard', 'terere'],
      'millet': ['millet'],
      'soybeans': ['soybean', 'soya'],
      'oranges': ['orange']
    };

    const cropKeywords = cropSeedMappings[cropName] || [];
    return cropKeywords.some(keyword => productName.includes(keyword));
  }

  calculateAdvancedSeedScore(product, requirements, cropId) {
    if (!product || !product.name) return 0;
    
    let score = 0; // Start with 0 - only recommend if there's a logical match
    const productName = product.name?.toLowerCase?.() || '';
    const cropName = cropId?.toLowerCase?.() || '';

    console.log(`🧠 AI Seed Scoring for ${product.name} (crop: ${cropId}):`);

    // 1. Exact Crop Name Matching (Highest Priority - 200 points)
    if (cropName && productName.includes(cropName)) {
      score += 200;
      console.log(`  ✅ Exact crop name match: +200 points`);
    } 
    // 2. Crop-specific keyword matching (150 points)
    else if (this.isCropSpecificSeed(productName, cropName)) {
      score += 150;
      console.log(`  ✅ Crop-specific seed match: +150 points`);
    }
    // 3. General keyword matching (100 points)
    else if (requirements?.seedKeywords?.some(keyword => productName.includes(keyword.toLowerCase()))) {
      score += 100;
      console.log(`  ✅ Keyword match: +100 points`);
    }
    // 4. If no logical match, don't recommend
    else {
      console.log(`  ❌ No logical match for ${cropName} - not recommending`);
      return 0;
    }

    // 2. Yield Potential Matching (80 points) - Based on real yield data
    if (product.yield) {
      if (product.yield.includes('70-80 tons') || product.yield.includes('48-50 tons') || product.yield.includes('32 tonnes')) {
        score += 80;
        console.log(`  ✅ High yield potential: +80 points`);
      } else if (product.yield.includes('30-32 bags') || product.yield.includes('16-32mt')) {
        score += 60;
        console.log(`  ✅ Good yield potential: +60 points`);
      } else if (product.yield.includes('prolific')) {
        score += 50;
        console.log(`  ✅ Prolific producer: +50 points`);
      }
    }

    // 3. Disease Resistance (60 points) - Based on real resistance data
    if (product.resistance) {
      if (product.resistance.includes('bacterial wilt') || product.resistance.includes('fusarium') || product.resistance.includes('verticillium')) {
        score += 60;
        console.log(`  ✅ Multiple disease resistance: +60 points`);
      } else if (product.resistance.includes('downy mildew') || product.resistance.includes('drought tolerant')) {
        score += 40;
        console.log(`  ✅ Specific resistance: +40 points`);
      } else if (product.resistance.includes('disease-free')) {
        score += 50;
        console.log(`  ✅ Disease-free guarantee: +50 points`);
      }
    }

    // 4. Quality Matching (40 points)
    if (product.quality === 'hybrid') {
      score += 40;
      console.log(`  ✅ Hybrid quality: +40 points`);
    } else if (product.quality === 'tissue_culture') {
      score += 50;
      console.log(`  ✅ Tissue culture quality: +50 points`);
    } else if (product.quality === 'open_pollinated') {
      score += 20;
      console.log(`  ✅ Open pollinated: +20 points`);
    }

    // 5. Maturity Period (30 points) - Shorter maturity preferred
    if (product.maturity) {
      if (product.maturity.includes('80 days') || product.maturity.includes('65-70 days')) {
        score += 30;
        console.log(`  ✅ Early maturity: +30 points`);
      } else if (product.maturity.includes('85-90 days') || product.maturity.includes('92 days')) {
        score += 25;
        console.log(`  ✅ Good maturity period: +25 points`);
      } else if (product.maturity.includes('13-14 months')) {
        score += 20;
        console.log(`  ✅ Standard maturity: +20 points`);
      }
    }

    // 6. Price Efficiency (20 points) - Based on real pricing
    const pricePerUnit = product.price / (product.weight || 1);
    if (pricePerUnit < 5000) { // Very cost effective
      score += 20;
      console.log(`  ✅ Very cost effective: +20 points`);
    } else if (pricePerUnit < 15000) { // Cost effective
      score += 15;
      console.log(`  ✅ Cost effective: +15 points`);
    } else if (pricePerUnit < 30000) { // Moderate
      score += 10;
      console.log(`  ✅ Moderate price: +10 points`);
    }

    // 7. Stock Availability (15 points)
    if (product.stock > 100) {
      score += 15;
      console.log(`  ✅ High stock availability: +15 points`);
    } else if (product.stock > 50) {
      score += 10;
      console.log(`  ✅ Good stock availability: +10 points`);
    } else if (product.stock > 20) {
      score += 5;
      console.log(`  ✅ Moderate stock: +5 points`);
    }

    // 8. Brand/Supplier Reputation (10 points)
    if (productName.includes('agro supply') || productName.includes('syova seed') || productName.includes('simlaw seeds') || productName.includes('naseco')) {
      score += 10;
      console.log(`  ✅ Reputable supplier: +10 points`);
    }
    
    console.log(`  🎯 Final score: ${score} points`);
    return score;
  }

  findFertilizerRecommendations(fertilizerRequirements) {
    console.log(`🌿 Finding fertilizer recommendations...`);
    
    if (!fertilizerRequirements) {
      console.log(`⚠️ No fertilizer requirements provided, using basic matching`);
      fertilizerRequirements = { npk: '20-20-20' };
    }

    // Get all products from the FERTILIZERS category in the store
    const fertilizerProducts = Array.from(this.storeProducts.values())
      .filter(product => product.category === 'fertilizers');

    console.log(`📦 Found ${fertilizerProducts.length} fertilizer products in store`);

    if (fertilizerProducts.length === 0) {
      console.log(`❌ No fertilizer products found in store database`);
      return [];
    }

    // AI Machine Learning Logic: Score and rank fertilizers based on crop requirements
    const scoredFertilizers = fertilizerProducts.map(product => ({
      ...product,
      score: this.calculateAdvancedFertilizerScore(product, fertilizerRequirements)
    })).sort((a, b) => b.score - a.score);

    // Return top 3 fertilizers with highest scores
    const recommendations = scoredFertilizers.slice(0, 3);
    console.log(`✅ Returning ${recommendations.length} fertilizer recommendations`);
    
    return recommendations;
  }

  isCropSpecificFertilizer(product, cropType) {
    // Define crop-specific fertilizer matching logic
    const cropFertilizerMappings = {
      'maize': ['maize', 'npk 20-20-18', 'npk 202018'],
      'coffee': ['coffee', 'npk 16-2-31', 'npk 16231'],
      'vegetables': ['vegetable', 'npk 17-17-17', 'npk 171717'],
      'cassava': ['cassava', 'npk 14-10-28', 'npk 141028'],
      'sunflower': ['sunflower', 'npk 24-17-10', 'npk 241710'],
      'rice': ['rice', 'npk 11-29-23', 'npk 112923']
    };

    const productName = product.name?.toLowerCase?.() || '';
    const productNPK = product.npk?.toLowerCase?.() || '';
    const cropKeywords = cropFertilizerMappings[cropType] || [];
    
    return cropKeywords.some(keyword => 
      productName.includes(keyword) || productNPK.includes(keyword)
    );
  }

  calculateAdvancedFertilizerScore(product, requirements) {
    if (!product || !product.name) return 0;
    
    let score = 0; // Start with 0 - only recommend if there's a logical match
    const productName = product.name?.toLowerCase?.() || '';
    const requiredNPK = requirements?.npk || '20-20-20';
    const cropType = requirements?.cropType || '';

    console.log(`🧠 AI Fertilizer Scoring for ${product.name} (NPK: ${requiredNPK}, Crop: ${cropType}):`);

    // 1. Exact NPK Matching (Highest Priority - 150 points)
    if (product.npk && product.npk === requiredNPK) {
      score += 150;
      console.log(`  ✅ Exact NPK match: +150 points`);
    } 
    // 2. Crop-specific NPK matching (120 points)
    else if (this.isCropSpecificFertilizer(product, cropType)) {
      score += 120;
      console.log(`  ✅ Crop-specific fertilizer match: +120 points`);
    }
    // 3. DAP/Urea matching (100 points)
    else if (product.npk && product.npk.includes('18-46-0') && requiredNPK.includes('DAP')) {
      score += 100;
      console.log(`  ✅ DAP fertilizer match: +100 points`);
    } else if (product.npk && product.npk.includes('46-0-0') && requiredNPK.includes('Urea')) {
      score += 100;
      console.log(`  ✅ Urea fertilizer match: +100 points`);
    }
    // 4. General NPK product (80 points)
    else if (productName.includes('npk')) {
      score += 80;
      console.log(`  ✅ NPK product: +80 points`);
    }
    // 5. If no logical match, don't recommend
    else {
      console.log(`  ❌ No logical fertilizer match for ${cropType} - not recommending`);
      return 0;
    }

    // 2. Application Method Matching (80 points)
    if (product.application) {
      if (requirements?.timing === 'Basal' && product.application.includes('basal')) {
        score += 80;
        console.log(`  ✅ Basal application match: +80 points`);
      } else if (requirements?.timing === 'Top dressing' && product.application.includes('top-dressing')) {
        score += 80;
        console.log(`  ✅ Top dressing match: +80 points`);
      } else if (product.application.includes('all purpose') || product.application.includes('universal')) {
        score += 60;
        console.log(`  ✅ Universal application: +60 points`);
      }
    }
    
    // 3. Organic Preference (70 points)
    if (requirements?.organic && product.organic) {
      score += 70;
      console.log(`  ✅ Organic preference: +70 points`);
    } else if (product.organic) {
      score += 40;
      console.log(`  ✅ Organic product: +40 points`);
    }
    
    // 4. Crop-Specific Matching (60 points)
    if (productName.includes('maize') && requirements?.cropType === 'maize') {
      score += 60;
      console.log(`  ✅ Maize-specific fertilizer: +60 points`);
    } else if (productName.includes('coffee') && requirements?.cropType === 'coffee') {
      score += 60;
      console.log(`  ✅ Coffee-specific fertilizer: +60 points`);
    } else if (productName.includes('vegetable') && requirements?.cropType === 'vegetable') {
      score += 60;
      console.log(`  ✅ Vegetable-specific fertilizer: +60 points`);
    }
    
    // 5. Application Rate Efficiency (50 points)
    if (product.rate) {
      if (product.rate.includes('10kg/ha') || product.rate.includes('1-2 bags/acre')) {
        score += 50;
        console.log(`  ✅ Efficient application rate: +50 points`);
      } else if (product.rate.includes('2-4 bags/acre')) {
        score += 40;
        console.log(`  ✅ Good application rate: +40 points`);
      }
    }
    
    // 6. Price Efficiency (30 points) - Based on real pricing
    const pricePerKg = product.price / (product.weight || 1);
    if (pricePerKg < 2000) { // Very cost effective (like Urea)
      score += 30;
      console.log(`  ✅ Very cost effective: +30 points`);
    } else if (pricePerKg < 3500) { // Cost effective (like NPK)
      score += 25;
      console.log(`  ✅ Cost effective: +25 points`);
    } else if (pricePerKg < 5000) { // Moderate (like DAP)
      score += 20;
      console.log(`  ✅ Moderate price: +20 points`);
    } else if (pricePerKg < 10000) { // Premium (like organic)
      score += 15;
      console.log(`  ✅ Premium price: +15 points`);
    }
    
    // 7. Stock Availability (20 points)
    if (product.stock > 100) {
      score += 20;
      console.log(`  ✅ High stock availability: +20 points`);
    } else if (product.stock > 50) {
      score += 15;
      console.log(`  ✅ Good stock availability: +15 points`);
    } else if (product.stock > 20) {
      score += 10;
      console.log(`  ✅ Moderate stock: +10 points`);
    }
    
    // 8. Brand/Supplier Reputation (10 points)
    if (productName.includes('yara') || productName.includes('kynoch') || productName.includes('oscars')) {
      score += 10;
      console.log(`  ✅ Reputable brand: +10 points`);
    }
    
    console.log(`  🎯 Final score: ${score} points`);
    return score;
  }

  findPesticideRecommendations(pesticideRequirements) {
    console.log(`🛡️ Finding pesticide recommendations...`);
    
    if (!pesticideRequirements) {
      console.log(`⚠️ No pesticide requirements provided, using basic matching`);
      pesticideRequirements = { fungicides: true, insecticides: true, herbicides: true };
    }

    // Get all products from the PESTICIDES category in the store
    const pesticideProducts = Array.from(this.storeProducts.values())
      .filter(product => product.category === 'pesticides');

    console.log(`📦 Found ${pesticideProducts.length} pesticide products in store`);

    if (pesticideProducts.length === 0) {
      console.log(`❌ No pesticide products found in store database`);
      return [];
    }

    // AI Machine Learning Logic: Score and rank pesticides based on crop requirements
    const scoredPesticides = pesticideProducts.map(product => ({
      ...product,
      score: this.calculateAdvancedPesticideScore(product, pesticideRequirements)
    })).sort((a, b) => b.score - a.score);

    // Return top 3 pesticides with highest scores
    const recommendations = scoredPesticides.slice(0, 3);
    console.log(`✅ Returning ${recommendations.length} pesticide recommendations`);
    
    return recommendations;
  }

  calculateAdvancedPesticideScore(product, requirements) {
    if (!product || !product.name) return 0;
    
    let score = 50; // Base score for all pesticide products
    const productName = product.name?.toLowerCase?.() || '';

    console.log(`🧠 AI Pesticide Scoring for ${product.name}:`);

    // 1. Type Matching (Highest Priority - 120 points)
    if (requirements?.fungicides && product.type === 'fungicide') {
      score += 120;
      console.log(`  ✅ Fungicide match: +120 points`);
    }
    if (requirements?.insecticides && product.type === 'insecticide') {
      score += 120;
      console.log(`  ✅ Insecticide match: +120 points`);
    }
    if (requirements?.herbicides && product.type === 'herbicide') {
      score += 120;
      console.log(`  ✅ Herbicide match: +120 points`);
    }
    
    // 2. Disease/Pest Target Matching (100 points)
    if (product.targets && requirements?.targetDiseases) {
      const targetMatches = requirements.targetDiseases.filter(disease => 
        product.targets.toLowerCase().includes(disease.toLowerCase())
      ).length;
      score += targetMatches * 25; // 25 points per target match
      console.log(`  ✅ Target matches: +${targetMatches * 25} points`);
    }
    
    // 3. Organic Preference (80 points)
    if (requirements?.organic && product.organic) {
      score += 80;
      console.log(`  ✅ Organic preference: +80 points`);
    } else if (product.organic) {
      score += 40;
      console.log(`  ✅ Organic product: +40 points`);
    }
    
    // 4. Active Ingredient Effectiveness (60 points)
    if (product.active_ingredient) {
      if (product.active_ingredient.includes('Copper') && requirements?.copperBased) {
        score += 60;
        console.log(`  ✅ Copper-based effectiveness: +60 points`);
      } else if (product.active_ingredient.includes('Neem') && requirements?.organicPreferred) {
        score += 50;
        console.log(`  ✅ Neem-based effectiveness: +50 points`);
      } else if (product.active_ingredient.includes('Glyphosate') && requirements?.herbicides) {
        score += 55;
        console.log(`  ✅ Glyphosate effectiveness: +55 points`);
      }
    }
    
    // 5. Broad Spectrum Coverage (50 points)
    if (product.targets && product.targets.includes('Broad-spectrum')) {
      score += 50;
      console.log(`  ✅ Broad spectrum coverage: +50 points`);
    } else if (product.targets && product.targets.includes('Early Blight, Late Blight, Downy Mildew')) {
      score += 45;
      console.log(`  ✅ Multiple disease coverage: +45 points`);
    }
    
    // 6. Price Efficiency (40 points) - Based on real pricing
    const pricePerUnit = product.price / (product.weight || 1);
    if (pricePerUnit < 25000) { // Very cost effective
      score += 40;
      console.log(`  ✅ Very cost effective: +40 points`);
    } else if (pricePerUnit < 35000) { // Cost effective
      score += 30;
      console.log(`  ✅ Cost effective: +30 points`);
    } else if (pricePerUnit < 50000) { // Moderate
      score += 20;
      console.log(`  ✅ Moderate price: +20 points`);
    }
    
    // 7. Stock Availability (25 points)
    if (product.stock > 80) {
      score += 25;
      console.log(`  ✅ High stock availability: +25 points`);
    } else if (product.stock > 50) {
      score += 20;
      console.log(`  ✅ Good stock availability: +20 points`);
    } else if (product.stock > 20) {
      score += 15;
      console.log(`  ✅ Moderate stock: +15 points`);
    }
    
    // 8. Safety Profile (20 points)
    if (productName.includes('organic') || productName.includes('safe')) {
      score += 20;
      console.log(`  ✅ Safety profile: +20 points`);
    }
    
    console.log(`  🎯 Final score: ${score} points`);
    return score;
  }

  findToolRecommendations(toolRequirements) {
    console.log(`🔧 Finding tool recommendations...`);
    
    if (!toolRequirements) {
      console.log(`⚠️ No tool requirements provided, using basic matching`);
      toolRequirements = { essentialTools: ['sprayer', 'cultivation', 'harvesting', 'protective_gear'] };
    }

    // Get all products from the TOOLS category in the store
    const toolProducts = Array.from(this.storeProducts.values())
      .filter(product => product.category === 'tools');

    console.log(`📦 Found ${toolProducts.length} tool products in store`);

    if (toolProducts.length === 0) {
      console.log(`❌ No tool products found in store database`);
      return [];
    }

    // AI Machine Learning Logic: Score and rank tools based on crop requirements
    const scoredTools = toolProducts.map(product => ({
      ...product,
      score: this.calculateAdvancedToolScore(product, toolRequirements)
    })).sort((a, b) => b.score - a.score);

    // Return top 5 tools with highest scores (tools are essential)
    const recommendations = scoredTools.slice(0, 5);
    console.log(`✅ Returning ${recommendations.length} tool recommendations`);
    
    return recommendations;
  }

  calculateAdvancedToolScore(product, requirements) {
    if (!product || !product.name) return 0;
    
    let score = 50; // Base score for all tool products
    const productName = product.name?.toLowerCase?.() || '';

    console.log(`🧠 AI Tool Scoring for ${product.name}:`);

    // 1. Essential Tool Matching (Highest Priority - 120 points)
    if (requirements?.essentialTools) {
      if (requirements.essentialTools.includes('sprayer') && product.type === 'sprayer') {
        score += 120;
        console.log(`  ✅ Essential sprayer match: +120 points`);
      }
      if (requirements.essentialTools.includes('cultivation') && product.type === 'cultivation') {
        score += 120;
        console.log(`  ✅ Essential cultivation tool match: +120 points`);
      }
      if (requirements.essentialTools.includes('harvesting') && product.type === 'harvesting') {
        score += 120;
        console.log(`  ✅ Essential harvesting tool match: +120 points`);
      }
      if (requirements.essentialTools.includes('protective_gear') && product.type === 'protective_gear') {
        score += 120;
        console.log(`  ✅ Essential protective gear match: +120 points`);
      }
    }

    // 2. Tool Functionality (100 points)
    if (product.features) {
      if (product.features.includes('Durable') || product.features.includes('Efficient')) {
        score += 100;
        console.log(`  ✅ High functionality: +100 points`);
      } else if (product.features.includes('Traditional') || product.features.includes('Multi-purpose')) {
        score += 80;
        console.log(`  ✅ Good functionality: +80 points`);
      }
    }
    
    // 3. Capacity/Size Matching (80 points)
    if (product.capacity) {
      if (product.capacity === '16L' && requirements?.sprayerCapacity === '16L') {
        score += 80;
        console.log(`  ✅ Optimal capacity match: +80 points`);
      } else if (product.capacity && requirements?.capacityPreference) {
        score += 60;
        console.log(`  ✅ Capacity available: +60 points`);
      }
    }

    // 4. Material Quality (60 points)
    if (product.material) {
      if (product.material === 'Steel') {
        score += 60;
        console.log(`  ✅ Steel material quality: +60 points`);
      } else if (product.material === 'Rubber') {
        score += 50;
        console.log(`  ✅ Rubber material quality: +50 points`);
      }
    }
    
    // 5. Price Efficiency (50 points) - Based on real pricing
    if (product.price < 20000) { // Very affordable
      score += 50;
      console.log(`  ✅ Very affordable: +50 points`);
    } else if (product.price < 50000) { // Affordable
      score += 40;
      console.log(`  ✅ Affordable: +40 points`);
    } else if (product.price < 100000) { // Moderate
      score += 30;
      console.log(`  ✅ Moderate price: +30 points`);
    } else if (product.price < 150000) { // Premium
      score += 20;
      console.log(`  ✅ Premium price: +20 points`);
    }
    
    // 6. Stock Availability (40 points)
    if (product.stock > 80) {
      score += 40;
      console.log(`  ✅ High stock availability: +40 points`);
    } else if (product.stock > 50) {
      score += 30;
      console.log(`  ✅ Good stock availability: +30 points`);
    } else if (product.stock > 20) {
      score += 20;
      console.log(`  ✅ Moderate stock: +20 points`);
    }
    
    // 7. Safety Features (30 points)
    if (product.type === 'protective_gear' || productName.includes('safety')) {
      score += 30;
      console.log(`  ✅ Safety features: +30 points`);
    }
    
    // 8. Brand/Quality Reputation (20 points)
    if (productName.includes('agriscope') || productName.includes('bomba') || productName.includes('gayu')) {
      score += 20;
      console.log(`  ✅ Reputable brand: +20 points`);
    }
    
    console.log(`  🎯 Final score: ${score} points`);
    return score;
  }

  findSoilAmendmentRecommendations(soilRequirements) {
    console.log(`🌱 Finding soil amendment recommendations...`);
    
    if (!soilRequirements) {
      console.log(`⚠️ No soil requirements provided, using basic matching`);
      soilRequirements = { pH: 'neutral', organic: true };
    }

    // Get all products from the SOIL_AMENDMENTS category in the store
    const soilProducts = Array.from(this.storeProducts.values())
      .filter(product => product.category === 'soil_amendments');

    console.log(`📦 Found ${soilProducts.length} soil amendment products in store`);

    if (soilProducts.length === 0) {
      console.log(`❌ No soil amendment products found in store database`);
      return [];
    }

    // AI Machine Learning Logic: Score and rank soil amendments based on crop requirements
    const scoredSoil = soilProducts.map(product => ({
      ...product,
      score: this.calculateAdvancedSoilAmendmentScore(product, soilRequirements)
    })).sort((a, b) => b.score - a.score);

    // Return top 3 soil amendments with highest scores
    const recommendations = scoredSoil.slice(0, 3);
    console.log(`✅ Returning ${recommendations.length} soil amendment recommendations`);
    
    return recommendations;
  }

  calculateAdvancedSoilAmendmentScore(product, requirements) {
    if (!product || !product.name) return 0;
    
    let score = 50; // Base score for all soil amendment products
    const productName = product.name.toLowerCase();

    console.log(`🧠 AI Soil Amendment Scoring for ${product.name}:`);

    // 1. Amendment Type Matching (100 points)
    if (requirements.amendments && requirements.amendments.some(amendment => productName.includes(amendment))) {
      score += 100;
      console.log(`  ✅ Amendment type match: +100 points`);
    }
    
    // 2. pH Adjustment (80 points)
    if (productName.includes('lime') || productName.includes('ph')) {
      score += 80;
      console.log(`  ✅ pH adjustment: +80 points`);
    }
    
    // 3. Organic Content (60 points)
    if (productName.includes('organic') || productName.includes('compost')) {
      score += 60;
      console.log(`  ✅ Organic content: +60 points`);
    }
    
    // 4. Nutrient Content (40 points)
    if (productName.includes('nutrient') || productName.includes('mineral')) {
      score += 40;
      console.log(`  ✅ Nutrient content: +40 points`);
    }
    
    // 5. Price Efficiency (30 points)
    const pricePerKg = product.price / (product.weight || 1);
    if (pricePerKg < 1000) {
      score += 30;
      console.log(`  ✅ Price efficiency: +30 points`);
    } else if (pricePerKg < 2000) {
      score += 20;
      console.log(`  ✅ Price efficiency: +20 points`);
    }
    
    // 6. Stock Availability (20 points)
    if (product.stock > 20) {
      score += 20;
      console.log(`  ✅ Stock availability: +20 points`);
    } else if (product.stock > 10) {
      score += 10;
      console.log(`  ✅ Stock availability: +10 points`);
    }
    
    console.log(`  🎯 Final score: ${score} points`);
    return score;
  }

  findToolRecommendations(requirements) {
    console.log(`🛠️ Finding tool recommendations...`);
    
    // Get all products from the TOOLS category in the store
    const toolProducts = Array.from(this.storeProducts.values())
      .filter(product => product.category === 'tools');

    console.log(`📦 Found ${toolProducts.length} tool products in store`);

    if (toolProducts.length === 0) {
      console.log(`❌ No tool products found in store database`);
      return [];
    }

    // AI Machine Learning Logic: Score and rank tools based on crop requirements
    const scoredTools = toolProducts.map(product => ({
      ...product,
      score: this.calculateAdvancedToolScore(product, requirements)
    })).sort((a, b) => b.score - a.score);

    // Return top 3 tools with highest scores
    const recommendations = scoredTools.slice(0, 3);
    console.log(`✅ Returning ${recommendations.length} tool recommendations`);
    
    return recommendations;
  }

  calculateAdvancedToolScore(product, requirements) {
    if (!product || !product.name) return 0;
    
    let score = 50; // Base score for all tool products
    const productName = product.name.toLowerCase();

    console.log(`🧠 AI Tool Scoring for ${product.name}:`);

    // 1. Essential Tools (100 points)
    const essentialTools = ['hoe', 'spade', 'rake', 'pruner', 'knife', 'shears'];
    if (essentialTools.some(tool => productName.includes(tool))) {
      score += 100;
      console.log(`  ✅ Essential tool: +100 points`);
    }
    
    // 2. Quality Indicators (60 points)
    if (productName.includes('stainless') || productName.includes('carbon steel')) {
      score += 60;
      console.log(`  ✅ Quality material: +60 points`);
    }
    
    // 3. Ergonomics (40 points)
    if (productName.includes('ergonomic') || productName.includes('comfortable')) {
      score += 40;
      console.log(`  ✅ Ergonomics: +40 points`);
    }
    
    // 4. Durability (30 points)
    if (productName.includes('heavy duty') || productName.includes('durable')) {
      score += 30;
      console.log(`  ✅ Durability: +30 points`);
    }
    
    // 5. Price Efficiency (20 points)
    if (product.price < 50000) {
      score += 20;
      console.log(`  ✅ Price efficiency: +20 points`);
    } else if (product.price < 100000) {
      score += 15;
      console.log(`  ✅ Price efficiency: +15 points`);
    }
    
    // 6. Stock Availability (15 points)
    if (product.stock > 10) {
      score += 15;
      console.log(`  ✅ Stock availability: +15 points`);
    } else if (product.stock > 5) {
      score += 10;
      console.log(`  ✅ Stock availability: +10 points`);
    }
    
    console.log(`  🎯 Final score: ${score} points`);
    return score;
  }

  calculateTotalCost(recommendations) {
    let totalCost = 0;
    
    if (recommendations.seeds) {
      totalCost += recommendations.seeds.reduce((sum, seed) => sum + seed.price, 0);
    }
    
    if (recommendations.fertilizers) {
      totalCost += recommendations.fertilizers.reduce((sum, fertilizer) => sum + fertilizer.price, 0);
    }
    
    if (recommendations.pesticides) {
      totalCost += recommendations.pesticides.reduce((sum, pesticide) => sum + pesticide.price, 0);
    }
    
    if (recommendations.equipment) {
      totalCost += recommendations.equipment.reduce((sum, equipment) => sum + equipment.price, 0);
    }
    
    if (recommendations.soilAmendments) {
      totalCost += recommendations.soilAmendments.reduce((sum, amendment) => sum + amendment.price, 0);
    }
    
    if (recommendations.tools) {
      totalCost += recommendations.tools.reduce((sum, tool) => sum + tool.price, 0);
    }
    
    
    return totalCost;
  }

  generateAIReasoning(cropId, requirements) {
    const cropName = cropId.charAt(0).toUpperCase() + cropId.slice(1);
    
    return [
      `🧠 AI analyzed ${cropName} requirements and matched products from our comprehensive store database`,
      `🌱 Selected seeds based on crop name matching, quality, yield potential, and disease resistance`,
      `🌿 Chose fertilizers based on NPK requirements, application timing, and crop-specific needs`,
      `🛡️ Picked pesticides based on pest control needs, active ingredients, and safety requirements`,
      `🛠️ Chose essential tools for efficient farming operations including sprayers and protective gear`,
      `🌱 Selected soil amendments based on soil requirements and pH adjustment needs`,
      `🌿 Recommended nursery bed products for healthy plant establishment and disease-free growth`,
      `💰 Calculated optimal product combinations for maximum farming success and cost efficiency`
    ];
  }





  async getCropRecommendations(cropId) {
    console.log(`🔍 Getting recommendations for crop: ${cropId}`);
    
    // Ensure service is initialized
    if (!this.initialized) {
      console.log(`⚠️ Service not initialized, initializing now...`);
      await this.initialize();
    }
    
    console.log(`📊 Store products Map size: ${this.storeProducts.size}`);
    console.log(`📊 Available store products:`, Array.from(this.storeProducts.keys()).slice(0, 5));
    
    // Convert cropId to lowercase to match the key format used in analyzeCropRequirements
    const cropKey = cropId.toLowerCase();
    let recommendations = this.recommendations.get(cropKey);
    
    if (!recommendations) {
      console.log(`⚠️ No recommendations found for ${cropKey}, generating now...`);
      const requirements = this.cropRequirements.get(cropKey);
      if (requirements) {
        recommendations = await this.generateCropRecommendations(cropKey, requirements);
        this.recommendations.set(cropKey, recommendations);
        console.log(`✅ Generated recommendations for ${cropKey}`);
      } else {
        console.log(`❌ No requirements found for ${cropKey}`);
        console.log(`📊 Available crop requirements keys:`, Array.from(this.cropRequirements.keys()));
        return {
          seeds: [],
          fertilizers: [],
          pesticides: [],
          equipment: [],
          soilAmendments: [],
          tools: [],
          totalCost: 0,
          aiReasoning: ['No crop requirements found - cannot generate recommendations']
        };
      }
    }
    
    console.log(`📦 Returning recommendations for ${cropKey}:`, recommendations);
    return recommendations;
  }

  getAllRecommendations() {
    return Object.fromEntries(this.recommendations);
  }

  getStoreAnalysis() {
    const totalProducts = this.storeProducts.size;
    const totalRecommendations = Array.from(this.recommendations.values())
      .reduce((total, rec) => {
        return total + (rec.seeds?.length || 0) + (rec.fertilizers?.length || 0) + 
               (rec.pesticides?.length || 0) + (rec.equipment?.length || 0) + 
               (rec.soilAmendments?.length || 0) + (rec.tools?.length || 0);
      }, 0);

    return {
      totalProducts,
      totalRecommendations,
      categories: Array.from(new Set(Array.from(this.storeProducts.values()).map(p => p.category))),
      averageProductPrice: Array.from(this.storeProducts.values()).reduce((sum, p) => sum + p.price, 0) / totalProducts
    };
  }

  getCategoryAnalysis() {
    const categories = {};
    Array.from(this.storeProducts.values()).forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = { count: 0, totalPrice: 0 };
      }
      categories[product.category].count++;
      categories[product.category].totalPrice += product.price;
    });
    
    return categories;
  }

  getTopRecommendations() {
    const allRecommendations = Array.from(this.recommendations.entries())
      .map(([cropId, rec]) => ({
        cropId,
        totalCost: rec.totalCost,
        productCount: (rec.seeds?.length || 0) + (rec.fertilizers?.length || 0) + 
                     (rec.pesticides?.length || 0) + (rec.equipment?.length || 0) + 
                     (rec.soilAmendments?.length || 0) + (rec.tools?.length || 0)
      }))
      .sort((a, b) => b.totalCost - a.totalCost);
    
    return allRecommendations.slice(0, 5);
  }
}

export default new AIStoreRecommendationService();