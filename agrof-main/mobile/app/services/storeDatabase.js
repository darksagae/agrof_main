class StoreDatabase {
  constructor() {
    this.products = new Map();
    this.categories = new Set();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    console.log('🔄 Initializing Store Database...');
    
    await this.loadProducts();
    this.initialized = true;
    console.log('✅ Store Database initialized');
  }

  async loadProducts() {
    try {
      console.log('🏪 Loading REAL store products from store directory...');
      
      // REAL store products based on actual store analysis
      const products = [
        // SEEDS Category - Real Products
        { id: 'sc_duma_43_maize', name: 'SC Duma 43 Maize Seed (Agro Supply)', category: 'seeds', price: 23000, stock: 100, weight: 2, description: 'Early maturing, drought resilient maize hybrid. Matures in 85-90 days, yield 30-32 bags/acre', quality: 'hybrid', image: 'maize.png', maturity: '85-90 days', yield: '30-32 bags/acre', resistance: 'drought tolerant' },
        
        { id: 'maxim_f1_tomato', name: 'Maxim F1 Tomato', category: 'seeds', price: 35014, stock: 80, weight: 5, description: 'Indeterminate hybrid tomato with high yield potential (70-80 tons/acre). Disease resistant', quality: 'hybrid', image: 'tomatoes.png', maturity: '65-70 days', yield: '70-80 tons/acre', resistance: 'bacterial wilt, fusarium, verticillium' },
        
        { id: 'cal_j_tomato', name: 'Cal-j Tomato', category: 'seeds', price: 4402, stock: 90, weight: 10, description: 'Compact determinate variety suitable for processing and fresh market', quality: 'hybrid', image: 'tomatoes.png', maturity: '100-120 days', yield: '20-45mt/acre', resistance: 'verticillium, fusarium wilts' },
        
        { id: 'giant_drum_head_cabbage', name: 'Giant Drum Head Cabbage', category: 'seeds', price: 1618, stock: 120, weight: 10, description: 'High-yielding cabbage variety, market fit with excellent quality. Yield 32 tonnes/acre', quality: 'hybrid', image: 'cabbage.png', maturity: '85-95 days', yield: '32 tonnes/acre', resistance: 'heat tolerant' },
        
        { id: 'fanaka_f1_cabbage', name: 'Fanaka F1 Cabbage', category: 'seeds', price: 2301, stock: 100, weight: 1, description: 'Hybrid cabbage with excellent heat tolerance and high adaptability', quality: 'hybrid', image: 'cabbage.png', maturity: '75-80 days', yield: '4-5kg heads', resistance: 'heat tolerant, fusarium yellows' },
        
        { id: 'copenhagen_market_cabbage', name: 'Copenhagen Market Cabbage', category: 'seeds', price: 2101, stock: 110, weight: 10, description: 'Most popular early maturing ball-headed cabbage variety', quality: 'open_pollinated', image: 'cabbage.png', maturity: '75-90 days', yield: '16-32mt/acre', resistance: 'early maturing' },

        // New Seeds Product
        { id: 'beans_seeds_bush_medium', name: 'Beans Seeds (Bush Type, Medium Seeded)', category: 'seeds', price: 6000, stock: 150, weight: 1, description: 'Bush type, medium seeded beans with attractive colour and high yield potential (800–1000 kg/acre). Matures in 80–90 days, tasty, swells on cooking, cooks fairly fast. Best suited for low–mid altitude areas.', image: 'beans_seedling.png', maturity: '80-90 days', yield: '800-1000 kg/acre' },
        
        { id: 'california_wonder_pepper', name: 'California Wonder Pepper', category: 'seeds', price: 3621, stock: 85, weight: 10, description: 'Uniform fruits, blocky and medium-sized, widely adaptable variety', quality: 'hybrid', image: 'peppers.png', maturity: '80-90 days', yield: '6-7 tonnes/acre', resistance: 'uniform growth' },
        
        { id: 'namuche_3_rice', name: 'Namuche 3 Rice', category: 'seeds', price: 5286, stock: 70, weight: 1, description: 'High yielding rice variety with excellent milling ability', quality: 'hybrid', image: 'rice.png', maturity: '92 days', yield: '1.6-2.3 tons/acre', resistance: 'high yielding' },
        
        { id: 'sugar_baby_watermelon', name: 'Sugar Baby Watermelon', category: 'seeds', price: 2100, stock: 150, weight: 10, description: 'Most popular watermelon variety due to early maturity and high yield', quality: 'open_pollinated', image: 'watermelon.png', maturity: '80 days', yield: '48-50 tons/acre', resistance: 'early maturing' },
        
        { id: 'ashley_cucumber', name: 'Ashley Cucumber', category: 'seeds', price: 3398, stock: 95, weight: 10, description: 'Open pollinated cucumber with prolific productivity, resistant to downy mildew', quality: 'open_pollinated', image: 'cucumber.png', maturity: 'early variety', yield: 'prolific producer', resistance: 'downy mildew resistant' },
        
        { id: 'femi_f1_eggplant', name: 'Femi F1 Eggplant', category: 'seeds', price: 51000, stock: 60, weight: 5, description: 'Hybrid eggplant with bacterial wilt resistance, high yield and shelf life', quality: 'hybrid', image: 'eggplant.png', maturity: 'improved variety', yield: 'high yield', resistance: 'bacterial wilt resistance' },
        
        { id: 'atwalira_banana', name: 'Atwalira Banana T.C Plantlet', category: 'seeds', price: 3600, stock: 200, weight: 1, description: 'Laboratory bred, clean tissue culture plantlets, free from pests and diseases', quality: 'tissue_culture', image: 'banana.png', maturity: '13-14 months', yield: 'medium bunch size', resistance: 'disease-free' },
        
        { id: 'bogoya_banana', name: 'Bogoya Banana T.C Plantlet', category: 'seeds', price: 3600, stock: 180, weight: 1, description: 'Gros Michel banana tissue culture plantlets with disease-free guarantee', quality: 'tissue_culture', image: 'banana.png', maturity: '13-14 months', yield: 'medium bunch size', resistance: 'disease-free' },

        // FERTILIZERS Category - Real Products
        { id: 'dap_fertilizer', name: 'DAP Fertilizer', category: 'fertilizers', price: 175000, stock: 120, weight: 50, description: 'Most concentrated phosphorus-based fertilizer perfect for any agriculture crop. 50kg bag', npk: '18-46-0', image: 'fertilizer.png', application: 'basal, top-dressing', rate: '10kg/ha' },
        
        { id: 'urea_fertilizer', name: 'Urea Fertilizer (Prilled)', category: 'fertilizers', price: 40000, stock: 150, weight: 50, description: 'High nitrogen fertilizer for leafy crops and top dressing', npk: '46-0-0', image: 'fertilizer.png', application: 'top-dressing', rate: '1-2 bags/acre' },
        
        { id: 'npk_20_20_18_maize', name: 'NPK 20-20-18 Fertilizer For Maize', category: 'fertilizers', price: 50000, stock: 100, weight: 50, description: 'Specialized fertilizer blend for maize cultivation', npk: '20-20-18', image: 'fertilizer.png', application: 'basal', rate: '2-3 bags/acre' },
        
        { id: 'npk_17_17_17_vegetables', name: 'NPK 17-17-17 Fertilizer', category: 'fertilizers', price: 45000, stock: 180, weight: 50, description: 'Balanced NPK fertilizer for vegetables', npk: '17-17-17', image: 'fertilizer.png', application: 'basal, top-dressing', rate: '2-4 bags/acre' },
        
        { id: 'npk_16_2_31_coffee', name: 'NPK 16-2-31 Coffee Blend', category: 'fertilizers', price: 55000, stock: 80, weight: 50, description: 'Specialized fertilizer blend for coffee cultivation', npk: '16-2-31', image: 'fertilizer.png', application: 'coffee specific', rate: '1-2 bags/acre' },
        
        { id: 'agricultural_lime', name: 'Agricultural Lime', category: 'fertilizers', price: 35000, stock: 70, weight: 50, description: 'Soil pH correction and calcium source for improved soil health', soil_amendment: true, image: 'lime.png', application: 'soil amendment', rate: '1-2 bags/acre' },
        
        { id: 'seek_bamboo_biochar', name: 'Seek Bamboo Biochar Fertilizer', category: 'fertilizers', price: 90000, stock: 40, weight: 25, description: 'High quality organic fertilizer made from bamboo products and beneficial microorganisms', organic: true, image: 'biochar.png', application: 'soil improvement', rate: '80-120kgs/acre' },
        
        { id: 'oscars_primo_organic', name: 'Oscars Primo Organic Fertilizer', category: 'fertilizers', price: 60000, stock: 50, weight: 25, description: 'Organic fertilizer for improved plant growth and soil health', organic: true, image: 'organic_fertilizer.png', application: 'organic farming', rate: '50-100kgs/acre' },
        
        { id: 'vermicompost_100', name: 'Vermicompost 100', category: 'fertilizers', price: 35000, stock: 60, weight: 25, description: 'Organic vermicompost fertilizer for nutrient-rich soil', organic: true, image: 'compost.png', application: 'soil amendment', rate: '100-200kgs/acre' },

        // FUNGICIDES Category - Real Products
        { id: 'copper_oxychloride', name: 'Copper Oxychloride Fungicide', category: 'pesticides', price: 25000, stock: 100, weight: 1, description: 'Broad-spectrum fungicide containing copper, provides excellent control against fungal diseases', type: 'fungicide', image: 'pesticide.png', active_ingredient: 'Copper Oxychloride 50% WP', targets: 'Early Blight, Late Blight, Downy Mildew, Anthracnose' },
        
        { id: 'organic_fungicide', name: 'Organic Fungicide', category: 'pesticides', price: 30000, stock: 80, weight: 1, description: 'Organic fungicide for controlling powdery mildew and other fungal diseases', type: 'fungicide', organic: true, image: 'pesticide.png', targets: 'Powdery Mildew, Fungal Diseases' },
        
        // HERBICIDES Category - Real Products
        { id: 'glyphosate_herbicide', name: 'Glyphosate Herbicide', category: 'pesticides', price: 40000, stock: 60, weight: 1, description: 'Broad-spectrum herbicide for weed control', type: 'herbicide', image: 'pesticide.png', active_ingredient: 'Glyphosate', targets: 'Broad-spectrum weed control' },
        
        // INSECTICIDES Category - Real Products  
        { id: 'neem_insecticide', name: 'Neem Insecticide', category: 'pesticides', price: 28000, stock: 90, weight: 1, description: 'Neem-based insecticide for pest control', type: 'insecticide', organic: true, image: 'pesticide.png', active_ingredient: 'Neem Extract', targets: 'Various pests' },

        // TOOLS Category - Real Products
        { id: 'agriscope_knapsack_sprayer', name: 'Agriscope Knapsack Sprayer', category: 'tools', price: 120000, stock: 25, description: 'Highly durable, efficient sprayer ideal for outdoor work', type: 'sprayer', image: 'sprayer.png', capacity: '16L', features: 'Durable, Efficient' },
        
        { id: 'bomba_kaliba_sprayer', name: 'Bomba Kaliba Knapsack Sprayer', category: 'tools', price: 100000, stock: 20, description: 'Highly durable efficient knapsack sprayer for pesticide application', type: 'sprayer', image: 'sprayer.png', capacity: '16L', features: 'Durable, Efficient' },
        
        { id: 'hand_hoe', name: 'Hand Hoe', category: 'tools', price: 15000, stock: 100, description: 'Traditional hand hoe for soil cultivation and weeding', type: 'cultivation', image: 'hoe.png', material: 'Steel', features: 'Traditional design' },
        
        { id: 'garden_fork', name: 'Garden Fork', category: 'tools', price: 18000, stock: 80, description: 'Garden fork for soil preparation and cultivation', type: 'cultivation', image: 'fork.png', material: 'Steel', features: 'Multi-purpose' },
        
        { id: 'panga', name: 'Panga', category: 'tools', price: 12000, stock: 90, description: 'Traditional panga for cutting and harvesting', type: 'harvesting', image: 'panga.png', material: 'Steel', features: 'Sharp blade' },
        
        { id: 'pruning_saw', name: 'Pruning Saw', category: 'tools', price: 25000, stock: 60, description: 'Pruning saw for tree and plant maintenance', type: 'pruning', image: 'saw.png', material: 'Steel', features: 'Sharp teeth' },
        
        { id: 'safety_gumboots', name: 'Safety Gumboots - Gayu (Yellow)', category: 'tools', price: 45000, stock: 40, description: 'Safety gumboots for field work protection', type: 'protective_gear', image: 'boots.png', material: 'Rubber', features: 'Waterproof, Durable' },
        
        { id: 'rubber_gloves', name: 'Rubber Gloves', category: 'tools', price: 8000, stock: 200, description: 'Rubber gloves for hand protection during farming activities', type: 'protective_gear', image: 'gloves.png', material: 'Rubber', features: 'Flexible, Durable' },
        
        { id: 'watering_can', name: 'Watering Can (10L, Plastic)', category: 'tools', price: 12000, stock: 70, description: 'Watering can for manual irrigation and plant care', type: 'irrigation', image: 'watering_can.png', capacity: '10L', features: 'Lightweight, Easy to use' },
        
        { id: 'tape_measure', name: 'Tape Measure', category: 'tools', price: 5000, stock: 50, description: 'Measuring tape for field work and planning', type: 'measurement', image: 'tape.png', length: '50m', features: 'Accurate measurement' },

        // NURSERY BED Category - Real Products
        { id: 'atwalira_banana_nursery', name: 'Atwalira Banana T.C Plantlet', category: 'nursery_bed', price: 3600, stock: 200, weight: 1, description: 'Laboratory bred, clean tissue culture plantlets, free from pests and diseases', image: 'banana.png', maturity: '13-14 months', yield: 'medium bunch size', resistance: 'disease-free' },
        
        { id: 'bogoya_banana_nursery', name: 'Bogoya Banana T.C Plantlet', category: 'nursery_bed', price: 3600, stock: 180, weight: 1, description: 'Gros Michel banana tissue culture plantlets with disease-free guarantee', image: 'banana.png', maturity: '13-14 months', yield: 'medium bunch size', resistance: 'disease-free' },
        
        { id: 'aloe_vera_seedling', name: 'Aloe Vera Seedling', category: 'nursery_bed', price: 2500, stock: 150, weight: 1, description: 'Healthy aloe vera seedlings for medicinal and cosmetic purposes', image: 'aloe.png', maturity: '6-8 months', yield: 'medicinal leaves', resistance: 'drought tolerant' },
        
        { id: 'strawberry_chandler', name: 'Strawberry Chandler Seedlings', category: 'nursery_bed', price: 8000, stock: 80, weight: 1, description: 'High-quality strawberry seedlings for fruit production', image: 'strawberry.png', maturity: '3-4 months', yield: 'sweet fruits', resistance: 'disease resistant' },
        
        { id: 'lemon_grass_seedling', name: 'Lemon Grass (Kisubi) Seedling', category: 'nursery_bed', price: 3000, stock: 120, weight: 1, description: 'Aromatic lemon grass seedlings for culinary and medicinal use', image: 'lemon_grass.png', maturity: '3-4 months', yield: 'aromatic leaves', resistance: 'pest resistant' },
        
        { id: 'sweet_basil_seedling', name: 'Sweet Basil Seedling (Mujaaja)', category: 'nursery_bed', price: 2500, stock: 100, weight: 1, description: 'Aromatic basil seedlings for culinary use', image: 'basil.png', maturity: '2-3 months', yield: 'aromatic leaves', resistance: 'easy to grow' },

        // New Nursery Bed Product
        { id: 'local_avocado_seedling', name: 'Local Avocado Seedlings', category: 'nursery_bed', price: 7000, stock: 120, weight: 1, description: 'Selected with care and cultivated with expertise, our Local avocado seedlings are tailored to flourish in diverse farming environments, suitable for both commercial growers and home gardeners.', image: 'avocado.png', maturity: '2-3 years to fruit', resistance: 'vigorous, adaptable' },

        // New Nursery Bed Product - Coffee
        { id: 'coffee_seedling', name: 'Coffee Seedling', category: 'nursery_bed', price: 3000, stock: 100, weight: 1, description: 'First dig holes that are at least 60 cm deep and wide, and let them sit for a few months, preferably filled with a mix of topsoil and compost. Plant at the beginning of the rainy season, ideally on a cloudy day, by carefully removing the seedling from its container, placing it upright in the hole, and refilling the hole, ensuring the taproot is not twisted and the crown remains above the soil line. Finally, firmly pack the soil, water well, and add mulch to retain moisture and protect the young plant.', image: 'coffee.png', maturity: '2-3 years to fruit', resistance: 'vigorous, adaptable' },

        // SOIL AMENDMENTS Category - Real Products
        { id: 'organic_compost_soil', name: 'Organic Compost Soil Amendment', category: 'soil_amendments', price: 30000, stock: 100, weight: 25, description: 'Organic compost for soil improvement and nutrient enrichment', image: 'compost.png', organic: true, application: 'soil improvement', rate: '100-200kgs/acre' },
        
        { id: 'agricultural_lime_soil', name: 'Agricultural Lime Soil Amendment', category: 'soil_amendments', price: 35000, stock: 80, weight: 50, description: 'Soil pH correction and calcium source for improved soil health', image: 'lime.png', soil_amendment: true, application: 'pH adjustment', rate: '1-2 bags/acre' },
        
        { id: 'vermicompost_soil', name: 'Vermicompost Soil Amendment', category: 'soil_amendments', price: 35000, stock: 60, weight: 25, description: 'Organic vermicompost fertilizer for nutrient-rich soil', image: 'compost.png', organic: true, application: 'nutrient enrichment', rate: '100-200kgs/acre' },
        
        { id: 'biochar_soil', name: 'Biochar Soil Amendment', category: 'soil_amendments', price: 50000, stock: 40, weight: 10, description: 'Biochar soil amendment for carbon sequestration and soil improvement', image: 'biochar.png', organic: true, application: 'carbon sequestration', rate: '50-100kgs/acre' }
      ];

      // Store products in the Map
      products.forEach(product => {
        this.products.set(product.id, product);
        this.categories.add(product.category);
      });

      console.log(`✅ Loaded ${products.length} store products across ${this.categories.size} categories`);
    } catch (error) {
      console.error('❌ Failed to load store products:', error);
    }
  }

  getAllProducts() {
    return Array.from(this.products.values());
  }

  getProductById(id) {
    return this.products.get(id);
  }

  getProductsByCategory(category) {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }

  getCategories() {
    return Array.from(this.categories);
  }

  searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return Array.from(this.products.values()).filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  getProductsByPriceRange(minPrice, maxPrice) {
    return Array.from(this.products.values()).filter(product =>
      product.price >= minPrice && product.price <= maxPrice
    );
  }

  getProductsInStock() {
    return Array.from(this.products.values()).filter(product => product.stock > 0);
  }

  getLowStockProducts(threshold = 10) {
    return Array.from(this.products.values()).filter(product => product.stock <= threshold);
  }

  updateStock(productId, newStock) {
    const product = this.products.get(productId);
    if (product) {
      product.stock = newStock;
      return true;
    }
    return false;
  }

  getStoreStatistics() {
    const products = Array.from(this.products.values());
    return {
      totalProducts: products.length,
      totalCategories: this.categories.size,
      totalStock: products.reduce((sum, product) => sum + product.stock, 0),
      totalValue: products.reduce((sum, product) => sum + (product.price * product.stock), 0),
      categories: this.getCategories(),
      lowStockProducts: this.getLowStockProducts().length,
      averagePrice: products.reduce((sum, product) => sum + product.price, 0) / products.length
    };
  }
}

export default new StoreDatabase();
