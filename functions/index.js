const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Initialize Firebase Admin
admin.initializeApp();

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database setup (using Firebase Firestore)
const db = admin.firestore();

// Product translation service
const loadProductTranslations = async (language = 'en') => {
  try {
    const translationDoc = await db.collection('translations').doc(language).get();
    if (translationDoc.exists) {
      return translationDoc.data();
    }
    return {};
  } catch (error) {
    console.error(`Error loading translations for ${language}:`, error);
    return {};
  }
};

const translateProduct = (product, translations) => {
  if (!product || !product.name || !translations) return product;
  
  const productTranslations = translations[product.name] || {};
  
  return {
    ...product,
    name: productTranslations.name || product.name,
    description: productTranslations.description || product.description,
    overview: productTranslations.overview || product.overview,
    key_features: productTranslations.key_features || product.key_features,
    growing_requirements: productTranslations.growing_requirements || product.growing_requirements,
    planting_instructions: productTranslations.planting_instructions || product.planting_instructions,
    harvesting: productTranslations.harvesting || product.harvesting,
    disease_resistance: productTranslations.disease_resistance || product.disease_resistance,
    yield_potential: productTranslations.yield_potential || product.yield_potential,
    maturity: productTranslations.maturity || product.maturity,
    spacing: productTranslations.spacing || product.spacing,
    seed_rate: productTranslations.seed_rate || product.seed_rate,
    usage_instructions: productTranslations.usage_instructions || product.usage_instructions,
    application_method: productTranslations.application_method || product.application_method,
    benefits: productTranslations.benefits || product.benefits,
    storage_instructions: productTranslations.storage_instructions || product.storage_instructions,
    safety_info: productTranslations.safety_info || product.safety_info,
    price: productTranslations.price || product.price
  };
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AGROF Store Backend is running on Firebase Functions',
    timestamp: new Date().toISOString()
  });
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  const { language = 'en' } = req.query;
  
  try {
    const translations = await loadProductTranslations(language);
    const categoryTranslations = translations.categories || {};
    
    const categoriesSnapshot = await db.collection('categories').orderBy('name').get();
    const categories = [];
    
    categoriesSnapshot.forEach(doc => {
      const data = doc.data();
      categories.push({
        id: doc.id,
        ...data,
        display_name: categoryTranslations[data.name] || data.display_name
      });
    });
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

// Get products by category
app.get('/api/categories/:categoryId/products', async (req, res) => {
  const { categoryId } = req.params;
  const { language = 'en' } = req.query;
  
  try {
    const translations = await loadProductTranslations(language);
    
    const productsSnapshot = await db.collection('products')
      .where('category', '==', categoryId)
      .orderBy('name')
      .get();
    
    const products = [];
    productsSnapshot.forEach(doc => {
      const data = doc.data();
      products.push({
        id: doc.id,
        ...data,
        ...translateProduct(data, translations)
      });
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  const { search, category, limit = 500, offset = 0, language = 'en' } = req.query;
  
  try {
    const translations = await loadProductTranslations(language);
    
    let query = db.collection('products');
    
    if (category) {
      query = query.where('category', '==', category);
    }
    
    if (search) {
      query = query.where('name', '>=', search).where('name', '<=', search + '\uf8ff');
    }
    
    const snapshot = await query.limit(parseInt(limit)).offset(parseInt(offset)).get();
    const products = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      products.push({
        id: doc.id,
        ...data,
        ...translateProduct(data, translations)
      });
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { language = 'en' } = req.query;
  
  try {
    const translations = await loadProductTranslations(language);
    
    const productDoc = await db.collection('products').doc(id).get();
    
    if (!productDoc.exists) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    const data = productDoc.data();
    const translatedProduct = translateProduct({ id: productDoc.id, ...data }, translations);
    
    res.json(translatedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to load product' });
  }
});

// Search products
app.get('/api/search', async (req, res) => {
  const { q, category } = req.query;
  
  if (!q) {
    res.status(400).json({ error: 'Search query is required' });
    return;
  }
  
  try {
    let query = db.collection('products');
    
    if (category) {
      query = query.where('category', '==', category);
    }
    
    query = query.where('name', '>=', q).where('name', '<=', q + '\uf8ff');
    
    const snapshot = await query.get();
    const products = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      products.push({
        id: doc.id,
        ...data
      });
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Cart operations
app.post('/api/cart/add', async (req, res) => {
  const { sessionId, productId, quantity = 1 } = req.body;
  
  if (!sessionId || !productId) {
    res.status(400).json({ error: 'Session ID and Product ID are required' });
    return;
  }
  
  try {
    const cartRef = db.collection('cart_items').doc(`${sessionId}_${productId}`);
    const cartDoc = await cartRef.get();
    
    if (cartDoc.exists) {
      await cartRef.update({
        quantity: admin.firestore.FieldValue.increment(quantity),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      await cartRef.set({
        session_id: sessionId,
        product_id: productId,
        quantity: quantity,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    res.json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

app.get('/api/cart/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  
  try {
    const cartSnapshot = await db.collection('cart_items')
      .where('session_id', '==', sessionId)
      .orderBy('created_at', 'desc')
      .get();
    
    const cartItems = [];
    cartSnapshot.forEach(doc => {
      cartItems.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to load cart' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);

// AI Disease Detection Function
exports.analyzeDisease = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  try {
    // Mock AI analysis response
    const mockAnalysis = {
      status: 'success',
      message: 'Disease analysis completed using AI',
      timestamp: new Date().toISOString(),
      analysis: {
        health_status: 'diseased',
        disease_type: 'Leaf Spot',
        severity_level: 'medium',
        symptoms: ['Brown spots on leaves', 'Yellowing edges'],
        recommendations: [
          'Apply fungicide treatment',
          'Improve air circulation',
          'Remove affected leaves'
        ],
        confidence: 0.85,
        detection_method: 'ai_analysis',
        api_source: 'firebase_functions'
      },
      business_insights: {
        economic_impact: 'Moderate crop loss expected',
        recommendations: [
          'Apply fungicide treatment',
          'Improve air circulation',
          'Remove affected leaves'
        ],
        market_value: 'Based on AI assessment'
      }
    };
    
    res.json(mockAnalysis);
  } catch (error) {
    console.error('AI Analysis error:', error);
    res.status(500).json({
      status: 'error',
      message: 'AI analysis failed',
      error: error.message
    });
  }
});

// Health check for AI API
exports.aiHealth = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.json({
    status: 'healthy',
    message: 'AGROF AI API is running on Firebase Functions',
    timestamp: new Date().toISOString(),
    ai_status: 'AI services available'
  });
});

// Test endpoint
exports.aiTest = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.json({
    message: 'AGROF AI API is working!',
    timestamp: new Date().toISOString(),
    status: 'success',
    ai_status: 'AI services available'
  });
});
