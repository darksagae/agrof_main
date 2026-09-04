import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { productsApi } from '../services/storeApi';
import AdvancedProductService from '../services/advancedProductService';
import AICommandService from '../services/aiCommandService';
import { useCart } from '../contexts/CartContext';
import { AI_API_URL, STORE_BASE_URL, AI_TIMEOUT } from '../config/apiConfig';

const ProductRecommendationCards = ({ diseaseType, symptoms, onProductPress }) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    // Always fetch products regardless of disease type
    // This ensures products are shown even for non-crop images
    if (diseaseType) {
      fetchRecommendedProducts();
    } else {
      // If no disease type detected, still show general products
      fetchGeneralProducts();
    }
  }, [diseaseType, symptoms]);

  const fetchGeneralProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🌱 Fetching general products for non-crop images...');
      
      // Get general products for any image type
      await fetchBasicRecommendations();
      
    } catch (error) {
      console.error('❌ General products fetch failed:', error);
      setError('Unable to load general products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🤖 Using AI Command System for product recommendations...');
      
      // Step 1: Send disease analysis to AI backend
      const diseaseAnalysis = {
        disease_type: diseaseType,
        symptoms: symptoms || [],
        severity_level: 'medium',
        crop_type: 'Unknown',
        timestamp: new Date().toISOString()
      };
      
      console.log('📤 Sending disease analysis to AI:', diseaseAnalysis);
      
      // Step 2: Try to get AI command from backend (with timeout and error handling)
      let aiResult = null;
      try {
        console.log('🤖 Attempting AI analysis...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT); // Use centralized timeout
        
        const aiResponse = await fetch(`${AI_API_URL}/ai-analyze-disease`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ disease_analysis: diseaseAnalysis }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!aiResponse.ok) {
          throw new Error(`AI analysis failed: ${aiResponse.status}`);
        }
        
        aiResult = await aiResponse.json();
        console.log('🤖 AI Analysis Result:', aiResult);
        
      } catch (aiError) {
        console.log('⚠️ AI backend not available:', aiError.message);
        console.log('🔄 Using intelligent fallback system...');
        aiResult = null;
      }
      
      if (aiResult && aiResult.success) {
        // Step 3: Process AI command to fetch products
        try {
          const commandResult = await AICommandService.processAICommand(aiResult.ai_command);
          
          if (commandResult.success && commandResult.products.length > 0) {
            console.log(`✅ AI Command processed: ${commandResult.products.length} products`);
            setRecommendedProducts(commandResult.products);
            return; // Success, exit early
          } else {
            console.log('⚠️ AI Command returned no products, using fallback...');
          }
        } catch (commandError) {
          console.log('⚠️ AI Command processing failed:', commandError.message);
        }
      }
      
      // If we get here, AI system failed or returned no products
      console.log('🔄 Using intelligent fallback system...');
      await fetchBasicRecommendations();
      
    } catch (error) {
      console.error('❌ AI Command system failed:', error);
      console.log('🆘 Using emergency fallback...');
      try {
        await fetchBasicRecommendations();
      } catch (fallbackError) {
        console.error('❌ Emergency fallback also failed:', fallbackError);
        setError('Unable to load product recommendations. Please check your internet connection and try again.');
        setRecommendedProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBasicRecommendations = async () => {
    try {
      console.log('🔍 Starting intelligent fallback system...');
      
      // Get all products first to ensure we have enough
      let allProductsResponse = [];
      try {
        console.log('🌐 API Request: http://192.168.1.15:3001/api/products?limit=100');
        console.log('🔍 Current API_BASE_URL: http://192.168.1.15:3001/api');
        allProductsResponse = await productsApi.getAll({ limit: 100 });
        console.log(`✅ API Response: /products?limit=100 - ${allProductsResponse.length} items`);
        console.log(`📦 Found ${allProductsResponse.length} total products in store`);
      } catch (apiError) {
        console.error('❌ Backend connection failed:', apiError);
        console.log('🔄 Using offline fallback products...');
        
        // Use offline fallback products
        allProductsResponse = [
          {
            id: 'offline-1',
            name: 'General Fertilizer',
            category_name: 'fertilizers',
            selling_price: 50000,
            description: 'General purpose fertilizer for plant nutrition',
            image_url: null
          },
          {
            id: 'offline-2', 
            name: 'Fungicide Treatment',
            category_name: 'fungicides',
            selling_price: 75000,
            description: 'Broad spectrum fungicide for disease control',
            image_url: null
          },
          {
            id: 'offline-3',
            name: 'Organic Pesticide',
            category_name: 'organic_chemicals', 
            selling_price: 60000,
            description: 'Organic pest control solution',
            image_url: null
          },
          {
            id: 'offline-4',
            name: 'Herbicide Control',
            category_name: 'herbicides',
            selling_price: 45000,
            description: 'Weed control herbicide',
            image_url: null
          }
        ];
        console.log(`📦 Using ${allProductsResponse.length} offline fallback products`);
      }
      
      // Intelligent product selection based on disease type and symptoms
      let selectedProducts = [];
      
      // Step 1: Try disease-specific matching
      if (diseaseType && diseaseType !== 'Unknown') {
        console.log(`🎯 Looking for products for disease: ${diseaseType}`);
        selectedProducts = await getDiseaseSpecificProducts(diseaseType, allProductsResponse);
        console.log(`🎯 Disease-specific products: ${selectedProducts.length}`);
      }
      
      // Step 2: Try symptom-based matching
      if (selectedProducts.length < 2 && symptoms && symptoms.length > 0) {
        console.log(`🔍 Looking for products for symptoms: ${symptoms.join(', ')}`);
        const symptomProducts = await getSymptomBasedProducts(symptoms, allProductsResponse);
        selectedProducts = [...selectedProducts, ...symptomProducts];
        console.log(`🔍 Symptom-based products: ${symptomProducts.length}`);
      }
      
      // Step 3: Try search-based matching
      if (selectedProducts.length < 2) {
        console.log('🔍 Using search-based matching...');
        const searchTerms = [diseaseType, ...(symptoms || [])].filter(Boolean);
        const searchQuery = searchTerms.join(' ');
        
        try {
          const searchResults = await productsApi.search(searchQuery);
          const newProducts = searchResults.filter(product => 
            !selectedProducts.some(sp => sp.id === product.id)
          );
          selectedProducts = [...selectedProducts, ...newProducts];
          console.log(`🔍 Search results: ${newProducts.length} new products`);
        } catch (err) {
          console.log('⚠️ Search failed, continuing with current products');
        }
      }
      
      // Step 4: Add category-based products
      if (selectedProducts.length < 4) {
        console.log('📂 Adding category-based products...');
        const categoryProducts = await getCategoryBasedProducts(diseaseType, symptoms, allProductsResponse);
        const newCategoryProducts = categoryProducts.filter(product => 
          !selectedProducts.some(sp => sp.id === product.id)
        );
        selectedProducts = [...selectedProducts, ...newCategoryProducts];
        console.log(`📂 Category products: ${newCategoryProducts.length} new products`);
      }
      
      // Step 5: Ensure we have enough products
      if (selectedProducts.length < 2) {
        console.log('📦 Adding general products to reach minimum...');
        const generalProducts = allProductsResponse
          .filter(product => !selectedProducts.some(sp => sp.id === product.id))
          .slice(0, 4 - selectedProducts.length);
        selectedProducts = [...selectedProducts, ...generalProducts];
        console.log(`📦 Added ${generalProducts.length} general products`);
      }
      
      // Remove duplicates and sort by relevance
      const uniqueProducts = selectedProducts.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id)
      );
      
      const sortedProducts = uniqueProducts.sort((a, b) => {
        const aRelevance = getRelevanceScore(a, diseaseType, symptoms);
        const bRelevance = getRelevanceScore(b, diseaseType, symptoms);
        return bRelevance - aRelevance;
      });
      
      // Take at least 2 products, maximum 6
      const topProducts = sortedProducts.slice(0, Math.min(6, Math.max(2, sortedProducts.length)));
      
      console.log(`✅ Intelligent fallback result: ${topProducts.length} recommended products`);
      setRecommendedProducts(topProducts);
      
    } catch (error) {
      console.error('❌ Intelligent fallback failed:', error);
      // Last resort: try to get any products from the store
      try {
        console.log('🆘 Last resort: fetching any available products...');
        const emergencyProducts = await productsApi.getAll({ limit: 6 });
        console.log(`🆘 Emergency products: ${emergencyProducts.length}`);
        setRecommendedProducts(emergencyProducts.slice(0, 6));
      } catch (emergencyError) {
        console.error('❌ Emergency fallback failed:', emergencyError);
        throw error;
      }
    }
  };

  // Enhanced disease-specific product matching
  const getDiseaseSpecificProducts = async (diseaseType, allProducts) => {
    const diseaseLower = diseaseType.toLowerCase();
    console.log(`🎯 Looking for products for disease: ${diseaseType}`);
    
    // Enhanced disease-to-product mapping
    const diseaseProductMapping = {
      // Fungal diseases
      'fungal leaf spot': ['fungicide', 'copper', 'mancozeb', 'chlorothalonil', 'sulfur', 'blight'],
      'powdery mildew': ['fungicide', 'sulfur', 'copper', 'mildew', 'powder'],
      'root rot': ['fungicide', 'trichoderma', 'benomyl', 'root', 'rot'],
      'anthracnose': ['fungicide', 'copper', 'mancozeb', 'chlorothalonil', 'anthracnose'],
      'fungal': ['fungicide', 'copper', 'mancozeb', 'chlorothalonil', 'sulfur'],
      
      // Bacterial diseases
      'bacterial blight': ['bactericide', 'copper', 'streptomycin', 'antibiotic', 'blight'],
      'bacterial wilt': ['bactericide', 'copper', 'streptomycin', 'wilt', 'bacterial'],
      'bacterial': ['bactericide', 'copper', 'streptomycin', 'antibiotic'],
      
      // Viral diseases
      'mosaic virus': ['virus', 'immune', 'booster', 'treatment', 'mosaic'],
      'viral': ['virus', 'immune', 'booster', 'treatment'],
      
      // Pest-related
      'aphid infestation': ['insecticide', 'neem', 'pyrethrin', 'aphid', 'control'],
      'whitefly infestation': ['insecticide', 'whitefly', 'control', 'neem'],
      'spider mite infestation': ['miticide', 'spider mite', 'control', 'neem'],
      'pest': ['insecticide', 'pesticide', 'neem', 'pyrethrin', 'control'],
      
      // Nutrient deficiencies
      'nitrogen deficiency': ['fertilizer', 'nitrogen', 'urea', 'ammonium', 'npk'],
      'phosphorus deficiency': ['fertilizer', 'phosphorus', 'superphosphate', 'bone meal'],
      'potassium deficiency': ['fertilizer', 'potassium', 'potash', 'wood ash'],
      'nutrient': ['fertilizer', 'nitrogen', 'phosphorus', 'potassium', 'npk'],
      
      // Weed-related
      'weed': ['herbicide', 'weed', 'control', '2,4d', 'amine', 'glyphosate']
    };
    
    let matchingProducts = [];
    
    // Direct disease name matching (highest priority)
    if (diseaseProductMapping[diseaseLower]) {
      console.log(`🎯 Direct match found for: ${diseaseType}`);
      const keywords = diseaseProductMapping[diseaseLower];
      for (const keyword of keywords) {
        const products = allProducts.filter(product => 
          product.name.toLowerCase().includes(keyword) ||
          (product.description && product.description.toLowerCase().includes(keyword)) ||
          (product.features && product.features.toLowerCase().includes(keyword))
        );
        matchingProducts = [...matchingProducts, ...products];
        console.log(`   🔍 Keyword "${keyword}": ${products.length} products`);
      }
    } else {
      // Partial matching for disease types
      console.log(`🎯 Using partial matching for: ${diseaseType}`);
      for (const [diseasePattern, keywords] of Object.entries(diseaseProductMapping)) {
        if (diseaseLower.includes(diseasePattern) || diseasePattern.includes(diseaseLower)) {
          console.log(`   🎯 Pattern match: ${diseasePattern}`);
          for (const keyword of keywords) {
            const products = allProducts.filter(product => 
              product.name.toLowerCase().includes(keyword) ||
              (product.description && product.description.toLowerCase().includes(keyword)) ||
              (product.features && product.features.toLowerCase().includes(keyword))
            );
            matchingProducts = [...matchingProducts, ...products];
            console.log(`   🔍 Keyword "${keyword}": ${products.length} products`);
          }
        }
      }
    }
    
    // Remove duplicates
    const uniqueProducts = matchingProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );
    
    console.log(`🎯 Disease-specific products found: ${uniqueProducts.length}`);
    return uniqueProducts.slice(0, 4);
  };
  
  // Enhanced symptom-based product matching
  const getSymptomBasedProducts = async (symptoms, allProducts) => {
    console.log(`🔍 Looking for products for symptoms: ${symptoms.join(', ')}`);
    
    // Enhanced symptom-to-treatment mapping
    const symptomKeywords = {
      // Fungal symptoms
      'spots': ['fungicide', 'copper', 'mancozeb', 'chlorothalonil', 'blight', 'spot'],
      'powder': ['fungicide', 'sulfur', 'mildew', 'powdery'],
      'wilting': ['fungicide', 'root', 'trichoderma', 'benomyl', 'wilt'],
      'blight': ['fungicide', 'copper', 'mancozeb', 'chlorothalonil', 'blight'],
      'mildew': ['fungicide', 'sulfur', 'copper', 'mildew'],
      'rot': ['fungicide', 'trichoderma', 'benomyl', 'root', 'rot'],
      
      // Bacterial symptoms
      'water-soaked': ['bactericide', 'copper', 'streptomycin', 'antibiotic'],
      'oozing': ['bactericide', 'copper', 'streptomycin'],
      'cankers': ['bactericide', 'copper', 'streptomycin'],
      
      // Viral symptoms
      'mosaic': ['virus', 'immune', 'booster', 'treatment', 'mosaic'],
      'mottled': ['virus', 'immune', 'booster', 'treatment'],
      'distorted': ['virus', 'immune', 'booster', 'treatment'],
      
      // Pest symptoms
      'holes': ['insecticide', 'pesticide', 'neem', 'pyrethrin', 'control'],
      'sticky': ['insecticide', 'neem', 'aphid', 'control'],
      'webbing': ['miticide', 'spider mite', 'control', 'neem'],
      'chewing': ['insecticide', 'pesticide', 'control'],
      
      // Nutrient symptoms
      'yellow': ['fertilizer', 'nitrogen', 'urea', 'ammonium', 'npk'],
      'purple': ['fertilizer', 'phosphorus', 'superphosphate'],
      'brown': ['fertilizer', 'potassium', 'potash'],
      'stunted': ['fertilizer', 'nitrogen', 'phosphorus', 'potassium', 'npk'],
      'weak': ['fertilizer', 'nitrogen', 'phosphorus', 'potassium']
    };
    
    let matchingProducts = [];
    
    for (const symptom of symptoms) {
      const symptomLower = symptom.toLowerCase();
      console.log(`🔍 Processing symptom: ${symptom}`);
      
      for (const [keyword, treatments] of Object.entries(symptomKeywords)) {
        if (symptomLower.includes(keyword)) {
          console.log(`   🎯 Symptom match: ${keyword} → ${treatments.join(', ')}`);
          for (const treatment of treatments) {
            const products = allProducts.filter(product => 
              product.name.toLowerCase().includes(treatment) ||
              (product.description && product.description.toLowerCase().includes(treatment)) ||
              (product.features && product.features.toLowerCase().includes(treatment))
            );
            matchingProducts = [...matchingProducts, ...products];
            console.log(`   🔍 Treatment "${treatment}": ${products.length} products`);
          }
        }
      }
    }
    
    // Remove duplicates
    const uniqueProducts = matchingProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );
    
    console.log(`🔍 Symptom-based products found: ${uniqueProducts.length}`);
    return uniqueProducts.slice(0, 4);
  };
  
  // Enhanced category-based product matching
  const getCategoryBasedProducts = async (diseaseType, symptoms, allProducts) => {
    console.log(`📂 Looking for category-based products for: ${diseaseType}`);
    
    // Enhanced disease-to-category mapping
    const categoryMapping = {
      // Fungal diseases
      'fungal leaf spot': ['fungicides', 'organic_chemicals'],
      'powdery mildew': ['fungicides', 'organic_chemicals'],
      'root rot': ['fungicides', 'organic_chemicals'],
      'anthracnose': ['fungicides', 'organic_chemicals'],
      'fungal': ['fungicides', 'organic_chemicals'],
      
      // Bacterial diseases
      'bacterial blight': ['bactericides', 'copper_products', 'organic_chemicals'],
      'bacterial wilt': ['bactericides', 'copper_products', 'organic_chemicals'],
      'bacterial': ['bactericides', 'copper_products', 'organic_chemicals'],
      
      // Viral diseases
      'mosaic virus': ['virus_control', 'plant_boosters', 'organic_chemicals'],
      'viral': ['virus_control', 'plant_boosters', 'organic_chemicals'],
      
      // Pest-related
      'aphid infestation': ['insecticides', 'organic_chemicals'],
      'whitefly infestation': ['insecticides', 'organic_chemicals'],
      'spider mite infestation': ['insecticides', 'miticides', 'organic_chemicals'],
      'pest': ['insecticides', 'organic_chemicals'],
      
      // Nutrient deficiencies (only show fertilizers for nutrient issues)
      'nitrogen deficiency': ['fertilizers', 'organic_fertilizers'],
      'phosphorus deficiency': ['fertilizers', 'organic_fertilizers'],
      'potassium deficiency': ['fertilizers', 'organic_fertilizers'],
      'nutrient': ['fertilizers', 'organic_fertilizers'],
      
      // Weed-related
      'weed': ['herbicides', 'organic_chemicals']
    };
    
    let matchingProducts = [];
    const diseaseLower = diseaseType ? diseaseType.toLowerCase() : '';
    
    // Direct disease name matching (highest priority)
    if (categoryMapping[diseaseLower]) {
      console.log(`📂 Direct category match for: ${diseaseType}`);
      const categories = categoryMapping[diseaseLower];
      for (const category of categories) {
        const products = allProducts.filter(product => 
          product.category_name === category
        );
        matchingProducts = [...matchingProducts, ...products];
        console.log(`   📂 Category "${category}": ${products.length} products`);
      }
    } else {
      // Partial matching for disease types
      console.log(`📂 Using partial category matching for: ${diseaseType}`);
      for (const [diseasePattern, categories] of Object.entries(categoryMapping)) {
        if (diseaseLower.includes(diseasePattern) || diseasePattern.includes(diseaseLower)) {
          console.log(`   📂 Pattern match: ${diseasePattern}`);
          for (const category of categories) {
            const products = allProducts.filter(product => 
              product.category_name === category
            );
            matchingProducts = [...matchingProducts, ...products];
            console.log(`   📂 Category "${category}": ${products.length} products`);
          }
        }
      }
    }
    
    // If still no products found, prioritize disease-specific categories over fertilizers
    if (matchingProducts.length === 0) {
      console.log(`📂 No specific categories found, using priority fallback`);
      const priorityCategories = [
        'fungicides', 'bactericides', 'insecticides', 'herbicides', 
        'organic_chemicals', 'fertilizers'
      ];
      
      for (const category of priorityCategories) {
        const products = allProducts.filter(product => 
          product.category_name === category
        );
        if (products.length > 0) {
          matchingProducts = [...matchingProducts, ...products];
          console.log(`   📂 Priority category "${category}": ${products.length} products`);
          break; // Only use the first available category
        }
      }
    }
    
    // Remove duplicates
    const uniqueProducts = matchingProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );
    
    console.log(`📂 Category-based products found: ${uniqueProducts.length}`);
    return uniqueProducts.slice(0, 4);
  };

  const getRelevanceScore = (product, diseaseType, symptoms) => {
    let score = 0;
    const productText = `${product.name} ${product.description || ''} ${product.features || ''}`.toLowerCase();
    const diseaseLower = diseaseType.toLowerCase();
    
    // Higher score for exact disease match in name
    if (product.name.toLowerCase().includes(diseaseLower)) score += 10;
    
    // Score for disease in description
    if (product.description && product.description.toLowerCase().includes(diseaseLower)) score += 5;
    
    // Score for symptoms match
    if (symptoms) {
      symptoms.forEach(symptom => {
        if (productText.includes(symptom.toLowerCase())) score += 3;
      });
    }
    
    // Score for treatment-related keywords
    const treatmentKeywords = ['treatment', 'control', 'prevent', 'cure', 'fungicide', 'herbicide', 'pesticide'];
    treatmentKeywords.forEach(keyword => {
      if (productText.includes(keyword)) score += 2;
    });
    
    return score;
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      Alert.alert('Added to Cart', `${product.name} has been added to your cart`);
    } catch (error) {
      Alert.alert('Error', 'Failed to add product to cart');
    }
  };

  const handleProductPress = (product) => {
    if (onProductPress) {
      onProductPress(product);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    if (typeof price === 'string') return price;
    return `UGX ${parseFloat(price).toLocaleString()}`;
  };

  // JavaScript-based image fetching function
  const fetchImageWithJavaScript = async (imageUrl) => {
    try {
      console.log('🔄 JavaScript fetching image:', imageUrl);
      const response = await fetch(imageUrl, { method: 'HEAD' });
      if (response.ok) {
        console.log('✅ Image accessible via JavaScript:', imageUrl);
        return true;
      } else {
        console.log('❌ Image not accessible via JavaScript:', imageUrl, response.status);
        return false;
      }
    } catch (error) {
      console.log('❌ JavaScript fetch error:', error.message);
      return false;
    }
  };

  const getProductImage = (product) => {
    console.log('🖼️ Getting image for product:', product.name);
    console.log('🖼️ Product image_url:', product.image_url);
    console.log('🖼️ Product full_image_url:', product.full_image_url);
    console.log('🖼️ Product category:', product.category_name);
    
    // Use centralized STORE_BASE_URL from config
    
    // Try multiple image URL patterns with better error handling
    const imagePatterns = [
      // Pattern 1: Direct image_url if it exists and is HTTP
      product.image_url && product.image_url.startsWith('http') ? product.image_url : null,
      // Pattern 2: Full image URL if available
      product.full_image_url && product.full_image_url.startsWith('http') ? product.full_image_url : null,
      // Pattern 3: Direct product image path (if it exists and is relative)
      product.image_url && !product.image_url.startsWith('http') ? `${STORE_BASE_URL}${product.image_url}` : null,
      // Pattern 4: Try with .jpg extension (for compressed images)
      product.image_url && !product.image_url.startsWith('http') ? 
        `${STORE_BASE_URL}${product.image_url.replace(/\.(png|jpg|jpeg)$/i, '.jpg')}` : null,
      // Pattern 5: Try with different file extensions
      product.image_url && !product.image_url.startsWith('http') ? 
        `${STORE_BASE_URL}${product.image_url.replace(/\.(png|jpg|jpeg)$/i, '.png')}` : null,
      // Pattern 6: Try with .jpeg extension
      product.image_url && !product.image_url.startsWith('http') ? 
        `${STORE_BASE_URL}${product.image_url.replace(/\.(png|jpg|jpeg)$/i, '.jpeg')}` : null,
      // Pattern 7: Constructed store image URL with category (lowercase)
      product.category_name && product.name ? 
        `${STORE_BASE_URL}/api/images/${product.category_name.toLowerCase()}/${product.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_')}.png` : null,
      // Pattern 8: Try with .jpg extension for constructed URLs
      product.category_name && product.name ? 
        `${STORE_BASE_URL}/api/images/${product.category_name.toLowerCase()}/${product.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_')}.jpg` : null,
      // Pattern 9: Try with encoded product name
      product.category_name && product.name ? 
        `${STORE_BASE_URL}/api/images/${product.category_name.toLowerCase()}/${encodeURIComponent(product.name)}.png` : null,
      // Pattern 10: Try with different encoding
      product.category_name && product.name ? 
        `${STORE_BASE_URL}/api/images/${product.category_name.toLowerCase()}/${product.name.replace(/[^a-zA-Z0-9]/g, '_')}.png` : null
    ].filter(Boolean);
    
    console.log('🖼️ Trying image patterns:', imagePatterns);
    
    // Try each pattern until one works
    for (const imageUrl of imagePatterns) {
      if (imageUrl) {
        console.log('🖼️ Trying image URL:', imageUrl);
        return { uri: imageUrl };
      }
    }
    
    // Final fallback to local assets
    const getLocalAsset = (productName, category) => {
      console.log('🖼️ Using local asset for:', productName, 'category:', category);
      
      // Category-based fallback
      const categoryImages = {
        'fungicides': require('../assets/fungicides.png'),
        'herbicides': require('../assets/herbicides.png'),
        'fertilizers': require('../assets/fertilizers.png'),
        'organic_chemicals': require('../assets/organic_chemicals.png'),
        'seeds': require('../assets/seeds.png'),
        'nursery_bed': require('../assets/nurserybed.png'),
        'insecticides': require('../assets/organic_chemicals.png'),
        'bactericides': require('../assets/fungicides.png')
      };
      
      return categoryImages[category] || require('../assets/fertilizers.png');
    };
    
    console.log('🖼️ Using final fallback local asset for:', product.name);
    return getLocalAsset(product.name, product.category_name);
  };

  if (loading) {
    return (
      <Card style={styles.loadingCard}>
        <Card.Content style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Finding recommended products...</Text>
        </Card.Content>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={styles.errorCard}>
        <Card.Content style={styles.errorContent}>
          <MaterialIcons name="error-outline" size={48} color="#F44336" />
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={() => {
              setError(null);
              fetchRecommendedProducts();
            }}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </Card.Content>
      </Card>
    );
  }

  if (!diseaseType || diseaseType === 'Unknown' || recommendedProducts.length === 0) {
    return (
      <Card style={styles.noProductsCard}>
        <Card.Content>
          <View style={styles.noProductsContainer}>
            <MaterialIcons name="shopping-cart" size={48} color="#9E9E9E" />
            <Text style={styles.noProductsTitle}>No Product Recommendations</Text>
            <Text style={styles.noProductsText}>
              {!diseaseType || diseaseType === 'Unknown' 
                ? 'No disease detected to recommend products for'
                : 'No specific products found for this disease'
              }
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.recommendationsCard}>
      <Card.Content>
        <Title style={styles.cardTitle}>Recommended Products</Title>
        <Paragraph style={styles.cardSubtitle}>
          Products from AGROF Store for treating {diseaseType}
        </Paragraph>
        <Text style={styles.debugText}>
          Showing {recommendedProducts.length} products
        </Text>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
        >
          {recommendedProducts.map((product, index) => (
            <Card key={product.id || index} style={styles.productCard}>
              <TouchableOpacity 
                onPress={() => handleProductPress(product)}
                style={styles.productTouchable}
              >
                <View style={styles.productImageContainer}>
                  <Image 
                    source={getProductImage(product)}
                    style={styles.productImage}
                    resizeMode="cover"
                    onError={(error) => {
                      console.log('❌ Image failed to load for product:', product.name);
                      console.log('🔄 Image error details:', error.nativeEvent);
                      console.log('🔄 Attempting fallback image...');
                      // Force re-render with fallback image
                      setRecommendedProducts(prev => [...prev]);
                    }}
                    onLoad={() => {
                      console.log('✅ Image loaded successfully for product:', product.name);
                    }}
                    onLoadStart={() => {
                      console.log('🔄 Image loading started for product:', product.name);
                    }}
                    onLoadEnd={() => {
                      console.log('🔄 Image loading ended for product:', product.name);
                    }}
                    defaultSource={require('../assets/fertilizers.png')}
                  />
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  
                  <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>
                      {formatPrice(product.selling_price || product.price)}
                    </Text>
                    {product.cost_price && (
                      <Text style={styles.costPrice}>
                        Cost: {formatPrice(product.cost_price)}
                      </Text>
                    )}
                  </View>
                  
                  {product.category_display_name && (
                    <Text style={styles.productCategory}>
                      {product.category_display_name}
                    </Text>
                  )}
                  
                  {product.description && (
                    <Text style={styles.productDescription} numberOfLines={3}>
                      {product.description}
                    </Text>
                  )}
                  
                  {product.specifications && (
                    <Text style={styles.productSpecs} numberOfLines={2}>
                      • {product.specifications}
                    </Text>
                  )}
                  
                  {product.features && (
                    <Text style={styles.productFeatures} numberOfLines={2}>
                      • {product.features}
                    </Text>
                  )}
                  
                  {product.benefits && (
                    <Text style={styles.productBenefits} numberOfLines={2}>
                      • {product.benefits}
                    </Text>
                  )}
                  
                  {product.usage_instructions && (
                    <Text style={styles.productUsage} numberOfLines={2}>
                      • {product.usage_instructions}
                    </Text>
                  )}
                  
                  {product.application_method && (
                    <Text style={styles.productApplication} numberOfLines={2}>
                      • {product.application_method}
                    </Text>
                  )}
                  
                  {product.storage_instructions && (
                    <Text style={styles.productStorage} numberOfLines={1}>
                      • {product.storage_instructions}
                    </Text>
                  )}
                  
                  {product.safety_info && (
                    <Text style={styles.productSafety} numberOfLines={1}>
                      • {product.safety_info}
                    </Text>
                  )}
                  
                  <View style={styles.productMeta}>
                    {product.availability && (
                      <Text style={styles.availability}>
                        {product.availability}
                      </Text>
                    )}
                    
                    {product.quantity_in_stock && (
                      <Text style={styles.stock}>
                        Stock: {product.quantity_in_stock} {product.unit_of_measure || 'units'}
                      </Text>
                    )}
                    
                    {product.supplier_name && (
                      <Text style={styles.supplier}>
                        Supplier: {product.supplier_name}
                      </Text>
                    )}
                    
                    {product.location && (
                      <Text style={styles.location}>
                        Location: {product.location}
                      </Text>
                    )}
                  </View>
                  
                  {product.ai_relevance_score && (
                    <Text style={styles.productScore}>
                      AI Relevance: {Math.round(product.ai_relevance_score)}%
                    </Text>
                  )}
                  
                  {product.training_score && (
                    <Text style={styles.trainingScore}>
                      Training Score: {Math.round(product.training_score)}%
                    </Text>
                  )}
                </View>
                
                <View style={styles.productActions}>
                  <Button 
                    mode="contained" 
                    onPress={() => handleAddToCart(product)}
                    style={styles.addToCartButton}
                    labelStyle={styles.addToCartButtonText}
                  >
                    Add to Cart
                  </Button>
                </View>
              </TouchableOpacity>
            </Card>
          ))}
        </ScrollView>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  recommendationsCard: {
    margin: 16,
    elevation: 4,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 16,
  },
  productsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  productCard: {
    width: '95%',
    marginHorizontal: 12,
    marginBottom: 20,
    elevation: 3,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productTouchable: {
    flex: 1,
  },
  productImageContainer: {
    height: 150,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  productUsage: {
    fontSize: 14,
    color: '#cccccc',
    fontStyle: 'italic',
  },
  productCategory: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productFeatures: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 2,
  },
  productApplication: {
    fontSize: 14,
    color: '#cccccc',
    fontStyle: 'italic',
  },
  productScore: {
    fontSize: 10,
    color: '#FF9800',
    fontWeight: 'bold',
    marginTop: 4,
  },
  trainingScore: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  costPrice: {
    fontSize: 10,
    color: '#cccccc',
    textDecorationLine: 'line-through',
  },
  productSpecs: {
    fontSize: 14,
    color: '#cccccc',
    fontStyle: 'italic',
    marginTop: 2,
  },
  productBenefits: {
    fontSize: 14,
    color: '#4CAF50',
    fontStyle: 'italic',
    marginTop: 2,
  },
  productStorage: {
    fontSize: 14,
    color: '#FF9800',
    fontStyle: 'italic',
    marginTop: 2,
  },
  productSafety: {
    fontSize: 14,
    color: '#F44336',
    fontStyle: 'italic',
    marginTop: 2,
  },
  productMeta: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  availability: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  stock: {
    fontSize: 10,
    color: '#cccccc',
  },
  supplier: {
    fontSize: 10,
    color: '#cccccc',
  },
  location: {
    fontSize: 10,
    color: '#cccccc',
  },
  debugText: {
    fontSize: 12,
    color: '#cccccc',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  productActions: {
    padding: 12,
    paddingTop: 0,
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  loadingCard: {
    margin: 16,
    elevation: 4,
  },
  loadingContent: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorCard: {
    margin: 16,
    elevation: 4,
    backgroundColor: '#FFEBEE',
  },
  errorContent: {
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    marginTop: 12,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
  },
  noProductsCard: {
    margin: 16,
    elevation: 4,
    backgroundColor: '#F5F5F5',
  },
  noProductsContainer: {
    alignItems: 'center',
    padding: 32,
  },
  noProductsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  noProductsText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
});

export default ProductRecommendationCards;
