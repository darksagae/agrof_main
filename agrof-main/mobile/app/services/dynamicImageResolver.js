/**
 * Dynamic Image Resolver Service
 * Intelligently matches product names to actual image files in the store
 * Faster and more accurate than hardcoded mappings
 */

class DynamicImageResolver {
  constructor() {
    this.imageCache = new Map();
    this.imageMapping = new Map();
    this.categoryPaths = {
      seeds: '../assets/store/SEEDS',
      fertilizers: '../assets/store/FERTLIZERS', 
      fungicides: '../assets/store/FUNGICIDES',
      herbicides: '../assets/store/HERBICIDE',
      tools: '../assets/store/tools',
      nurseryBed: '../assets/store/NURSERY_BED',
      organicChemicals: '../assets/store/ORGANIC_CHEMICALS'
    };
    
    // Common image extensions to try
    this.imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    
    // Build comprehensive image mapping
    this.buildImageMapping();
    
    // Initialize the resolver
    this.initialize();
  }

  /**
   * Build comprehensive image mapping with all available images
   */
  buildImageMapping() {
    console.log('🗺️ Building comprehensive image mapping...');
    
    // Seeds images
    const seedsImages = {
      'maize': require('../assets/store/SEEDS/Sc Duma 43 – Maize Seed (Agro Supply)/SC_DUMA_43-_MAIZE_SEED.jpeg'),
      'tomato': require('../assets/store/SEEDS/Maxim F1 – Tomato/Maximf1-Tomatocompressed.jpg'),
      'cabbage': require('../assets/store/SEEDS/Copenhagen Market – Cabbage, The Most Popular Early Maturing Ball-headed Variety/Cabbage Copenhagen Market-compressed.jpg'),
      'pepper': require('../assets/store/SEEDS/California Wonder/Capscum California Wonder_1582715823.jpg'),
      'rice': require('../assets/store/SEEDS/Namuche 3/Maize Namche - 3 Naseco Seeds~1_1582730534.jpg'),
      'watermelon': require('../assets/store/SEEDS/Sugar Baby – Most Popular And Grown Watermelon Variety Due To Its Early Maturity/Watermelon Sugar Baby-compressed.jpg'),
      'cucumber': require('../assets/store/SEEDS/Ashley – Open Pollinated Cucumber Varirty With Prolific Productivity/Ashley___Cucumber-removebg-preview-compressed.jpg'),
      'eggplant': require('../assets/store/SEEDS/Femi F1 – Hybrid Eggplant Variety/Femi_F1___Hybrid_Eggplant_Variety-removebg-preview.png'),
      'duma': require('../assets/store/SEEDS/Sc Duma 43 – Maize Seed (Agro Supply)/SC_DUMA_43-_MAIZE_SEED.jpeg'),
      'maxim': require('../assets/store/SEEDS/Maxim F1 – Tomato/Maximf1-Tomatocompressed.jpg'),
      'copenhagen': require('../assets/store/SEEDS/Copenhagen Market – Cabbage, The Most Popular Early Maturing Ball-headed Variety/Cabbage Copenhagen Market-compressed.jpg'),
      'california': require('../assets/store/SEEDS/California Wonder/Capscum California Wonder_1582715823.jpg'),
      'namuche': require('../assets/store/SEEDS/Namuche 3/Maize Namche - 3 Naseco Seeds~1_1582730534.jpg'),
      'sugar baby': require('../assets/store/SEEDS/Sugar Baby – Most Popular And Grown Watermelon Variety Due To Its Early Maturity/Watermelon Sugar Baby-compressed.jpg'),
      'ashley': require('../assets/store/SEEDS/Ashley – Open Pollinated Cucumber Varirty With Prolific Productivity/Ashley___Cucumber-removebg-preview-compressed.jpg'),
      'femi': require('../assets/store/SEEDS/Femi F1 – Hybrid Eggplant Variety/Femi_F1___Hybrid_Eggplant_Variety-removebg-preview.png')
    };

    // Fertilizers images
    const fertilizersImages = {
      'dap': require('../assets/store/FERTLIZERS/Dap/ffa43812-e971-4e81-a289-a3d8091bda4a.jpg'),
      'urea': require('../assets/store/FERTLIZERS/Urea (Prilled)/prilled.png'),
      'lime': require('../assets/store/FERTLIZERS/Agricultural Lime/image.png'),
      'microp': require('../assets/store/FERTLIZERS/Microp - Topdressing Fertilizer/microp_topdressing.png'),
      'npk': require('../assets/store/FERTLIZERS/Npk 171717/First_Image_copy_1582191922.jpg'),
      'yara': require('../assets/store/FERTLIZERS/Yara Mila 25.5.5+5S/Yara_Mila_25-compressed.jpg'),
      'fertilizer': require('../assets/store/FERTLIZERS/Dap/ffa43812-e971-4e81-a289-a3d8091bda4a.jpg'),
      'biochar': require('../assets/store/ORGANIC_CHEMICALS/Seek Bamboo Biochar Fertilizer – High Quality Organic Fertilizer/seek_bambo.png'),
      'organic_fertilizer': require('../assets/store/ORGANIC_CHEMICALS/Oscars Primo (Organic Fertilizer)/oscars_primo.jpg'),
      'compost': require('../assets/store/ORGANIC_CHEMICALS/Vermicompost 100/vermicompost_100.png')
    };

    // Tools images
    const toolsImages = {
      'sprayer': require('../assets/store/tools/Agriscope Knapsack Sprayer -Highly Durable, Efficient Sprayer Ideal For Outdoor Work /download-removebg-preview-compressed.jpg'),
      'hoe': require('../assets/store/tools/Hoe – Peacock Brand/Hand_Hoe-removebg-preview.png'),
      'panga': require('../assets/store/tools/Panga/6_1-compressed.jpg'),
      'fork': require('../assets/store/tools/Garden Fork/garden_fork.png'),
      'garden fork': require('../assets/store/tools/Garden Fork/garden_fork.png'),
      'boots': require('../assets/store/tools/Protective Gear/OVEROLL.jpg'),
      'gloves': require('../assets/store/tools/Rubber Gloves (Protective Gear)/ruber_gloves.jpg'),
      'watering can': require('../assets/store/tools/Watering Can (10L, Plastic)/watering_can.jpg'),
      'tape': require('../assets/store/tools/Tape Measure/Tape_Measure-compressed.jpg')
    };


    // Organic chemicals images
    const organicChemicalsImages = {
      'biochar': require('../assets/store/ORGANIC_CHEMICALS/Seek Bamboo Biochar Fertilizer – High Quality Organic Fertilizer/seek_bambo.png'),
      'organic': require('../assets/store/ORGANIC_CHEMICALS/Oscars Primo (Organic Fertilizer)/oscars_primo.jpg'),
      'primo': require('../assets/store/ORGANIC_CHEMICALS/Oscars Primo (Organic Fertilizer)/oscars_primo.jpg')
    };

    // Fungicides images
    const fungicidesImages = {
      'copper': require('../assets/store/FUNGICIDES/Copper Oxychloride/1562442728_1904261331ZSCsjYBHh4-main-removebg-preview-compressed.jpg'),
      'fungicide': require('../assets/store/FUNGICIDES/Copper Oxychloride/1562442728_1904261331ZSCsjYBHh4-main-removebg-preview-compressed.jpg')
    };

    // Add all images to mapping
    Object.entries(seedsImages).forEach(([key, image]) => {
      this.imageMapping.set(key, image);
      this.imageMapping.set(`${key} seed`, image);
      this.imageMapping.set(`${key} seeds`, image);
    });

    Object.entries(fertilizersImages).forEach(([key, image]) => {
      this.imageMapping.set(key, image);
      this.imageMapping.set(`${key} fertilizer`, image);
      this.imageMapping.set(`${key} fert`, image);
    });

    Object.entries(toolsImages).forEach(([key, image]) => {
      this.imageMapping.set(key, image);
      this.imageMapping.set(`${key} tool`, image);
      this.imageMapping.set(`${key} equipment`, image);
    });


    Object.entries(organicChemicalsImages).forEach(([key, image]) => {
      this.imageMapping.set(key, image);
      this.imageMapping.set(`${key} organic`, image);
    });

    Object.entries(fungicidesImages).forEach(([key, image]) => {
      this.imageMapping.set(key, image);
      this.imageMapping.set(`${key} fungicide`, image);
    });

    console.log(`✅ Built image mapping with ${this.imageMapping.size} entries`);
  }

  async initialize() {
    console.log('🖼️ Initializing Dynamic Image Resolver...');
    // Pre-load common image mappings for faster access
    await this.preloadCommonImages();
  }

  /**
   * Resolve image for a product using intelligent matching
   * @param {Object} product - Product object with name, category, etc.
   * @returns {Object} - Image source object or fallback
   */
  async resolveProductImage(product) {
    if (!product || !product.name) {
      return this.getFallbackImage();
    }

    const cacheKey = `${product.category}_${product.name}`;
    
    // Check cache first
    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey);
    }

    try {
      // Try multiple resolution strategies
      const imageSource = await this.resolveImageByStrategy(product);
      
      // Cache the result
      this.imageCache.set(cacheKey, imageSource);
      
      return imageSource;
    } catch (error) {
      console.warn(`⚠️ Failed to resolve image for ${product.name}:`, error.message);
      return this.getFallbackImage();
    }
  }

  /**
   * Resolve image using multiple strategies
   * @param {Object} product - Product object
   * @returns {Object} - Image source
   */
  async resolveImageByStrategy(product) {
    const strategies = [
      () => this.resolveByExactName(product),
      () => this.resolveByPartialMatch(product),
      () => this.resolveByCategory(product),
      () => this.resolveByKeywords(product)
    ];

    for (const strategy of strategies) {
      try {
        const result = await strategy();
        if (result && result !== this.getFallbackImage()) {
          console.log(`✅ Image resolved for ${product.name} using strategy: ${strategy.name}`);
          return result;
        }
      } catch (error) {
        console.warn(`⚠️ Strategy ${strategy.name} failed:`, error.message);
      }
    }

    return this.getFallbackImage();
  }

  /**
   * Strategy 1: Exact name matching
   * @param {Object} product - Product object
   * @returns {Object} - Image source
   */
  async resolveByExactName(product) {
    const cleanName = this.cleanProductName(product.name);
    
    // Try different variations of the name
    const nameVariations = [
      cleanName,
      cleanName.replace(/\s+/g, ' '),
      cleanName.replace(/[^\w\s]/g, ''),
      cleanName.replace(/\s+/g, '_'),
      cleanName.replace(/\s+/g, '-')
    ];

    for (const variation of nameVariations) {
      if (this.imageMapping.has(variation)) {
        return this.imageMapping.get(variation);
      }
    }

    return null;
  }

  /**
   * Strategy 2: Partial name matching
   * @param {Object} product - Product object
   * @returns {Object} - Image source
   */
  async resolveByPartialMatch(product) {
    const cleanName = this.cleanProductName(product.name);
    
    // Split name into words and try combinations
    const words = cleanName.split(/\s+/).filter(word => word.length > 2);
    
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j <= words.length; j++) {
        const partialName = words.slice(i, j).join(' ');
        
        if (this.imageMapping.has(partialName)) {
          return this.imageMapping.get(partialName);
        }
      }
    }

    return null;
  }

  /**
   * Strategy 3: Category-based matching
   * @param {Object} product - Product object
   * @returns {Object} - Image source
   */
  async resolveByCategory(product) {
    // Try common category-specific image names
    const categoryImages = {
      seeds: ['seed', 'seeds', 'crop', 'plant', 'maize', 'tomato'],
      fertilizers: ['fertilizer', 'fert', 'npk', 'nutrient', 'dap', 'urea'],
      tools: ['tool', 'equipment', 'sprayer', 'hoe', 'panga'],
      fungicides: ['fungicide', 'pesticide', 'spray', 'copper'],
      herbicides: ['herbicide', 'weed', 'killer'],
      organicChemicals: ['organic', 'bio', 'natural', 'biochar']
    };

    const imageNames = categoryImages[product.category] || ['default'];
    
    for (const imageName of imageNames) {
      if (this.imageMapping.has(imageName)) {
        return this.imageMapping.get(imageName);
      }
    }

    return null;
  }

  /**
   * Strategy 4: Keyword-based matching
   * @param {Object} product - Product object
   * @returns {Object} - Image source
   */
  async resolveByKeywords(product) {
    const cleanName = this.cleanProductName(product.name);
    
    // Extract keywords from product name
    const keywords = this.extractKeywords(cleanName);
    
    for (const keyword of keywords) {
      if (this.imageMapping.has(keyword)) {
        return this.imageMapping.get(keyword);
      }
    }

    return null;
  }

  /**
   * Clean product name for better matching
   * @param {string} name - Product name
   * @returns {string} - Cleaned name
   */
  cleanProductName(name) {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }

  /**
   * Extract keywords from product name
   * @param {string} name - Product name
   * @returns {Array} - Array of keywords
   */
  extractKeywords(name) {
    const words = name.split(/\s+/);
    const keywords = [];
    
    // Add individual words
    keywords.push(...words.filter(word => word.length > 2));
    
    // Add common agricultural terms
    const agriculturalTerms = [
      'maize', 'corn', 'tomato', 'cabbage', 'pepper', 'rice', 'watermelon',
      'cucumber', 'eggplant', 'banana', 'bean', 'coffee', 'onion', 'groundnut',
      'cotton', 'sugarcane', 'pineapple', 'mango', 'avocado', 'carrot', 'spinach',
      'millet', 'soybean', 'orange', 'duma', 'maxim', 'copenhagen', 'california',
      'namuche', 'sugar', 'ashley', 'femi', 'atwalira', 'bogoya', 'kibuzi'
    ];
    
    for (const term of agriculturalTerms) {
      if (name.includes(term)) {
        keywords.push(term);
      }
    }
    
    return [...new Set(keywords)]; // Remove duplicates
  }

  /**
   * Check if image file exists using pre-built mapping
   * @param {string} imagePath - Image path
   * @returns {boolean} - Whether image exists
   */
  async imageExists(imagePath) {
    // Use pre-built image mapping instead of dynamic require
    return this.imageMapping.has(imagePath);
  }

  /**
   * Pre-load common images for faster access
   */
  async preloadCommonImages() {
    const commonImages = [
      // Seeds
      { category: 'seeds', name: 'maize' },
      { category: 'seeds', name: 'tomato' },
      { category: 'seeds', name: 'cabbage' },
      { category: 'seeds', name: 'pepper' },
      { category: 'seeds', name: 'rice' },
      
      // Fertilizers
      { category: 'fertilizers', name: 'dap' },
      { category: 'fertilizers', name: 'urea' },
      { category: 'fertilizers', name: 'lime' },
      
      // Tools
      { category: 'tools', name: 'sprayer' },
      { category: 'tools', name: 'hoe' },
      { category: 'tools', name: 'panga' },
      
    ];

    for (const image of commonImages) {
      try {
        if (this.imageMapping.has(image.name)) {
          const imageSource = this.imageMapping.get(image.name);
          this.imageCache.set(`${image.category}_${image.name}`, imageSource);
          console.log(`✅ Pre-loaded image: ${image.name}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to pre-load image: ${image.name}`, error.message);
      }
    }
  }

  /**
   * Get fallback image based on category
   * @param {string} category - Product category
   * @returns {Object} - Fallback image source
   */
  getFallbackImage(category = 'seeds') {
    const fallbackImages = {
      seeds: require('../assets/crops/maize.png'),
      fertilizers: require('../assets/crops/maize.png'), // Using crop image as fallback
      tools: require('../assets/crops/maize.png'),
      fungicides: require('../assets/crops/maize.png'),
      herbicides: require('../assets/crops/maize.png'),
      organicChemicals: require('../assets/crops/maize.png')
    };

    return fallbackImages[category] || fallbackImages.seeds;
  }

  /**
   * Clear image cache
   */
  clearCache() {
    this.imageCache.clear();
    console.log('🗑️ Image cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  getCacheStats() {
    return {
      size: this.imageCache.size,
      keys: Array.from(this.imageCache.keys())
    };
  }
}

// Export singleton instance
export default new DynamicImageResolver();
