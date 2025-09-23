const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');
const marked = require('marked');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static images
app.use('/images', express.static(path.join(__dirname, '../agrof-main/mobile/app/assets/store')));

// Database setup
const db = new sqlite3.Database('./store-new.db');

// Initialize database
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // Categories table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        display_name TEXT NOT NULL,
        description TEXT
      )
    `);

    // Products table - SIMPLIFIED
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category_id INTEGER,
        description TEXT,
        price TEXT,
        image_url TEXT,
        specifications TEXT,
        features TEXT,
        usage_instructions TEXT,
        application_method TEXT,
        benefits TEXT,
        storage_instructions TEXT,
        safety_info TEXT,
        availability TEXT DEFAULT 'In Stock',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id),
        UNIQUE(name, category_id)
      )
    `);

    // Cart items table
    db.run(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating tables:', err);
        reject(err);
      } else {
        console.log('Database tables initialized successfully');
        resolve();
      }
    });
  });
};

// Parse individual product markdown file - SIMPLIFIED
const parseProductMarkdownFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const tokens = marked.lexer(content);
    
    const product = {
      name: '',
      description: '',
      price: 'Contact for pricing',
      specifications: '',
      features: '',
      usage_instructions: '',
      application_method: '',
      benefits: '',
      storage_instructions: '',
      safety_info: ''
    };
    
    let currentSection = '';
    
    for (const token of tokens) {
      if (token.type === 'heading') {
        const headingText = token.text.toLowerCase();
        
        if (token.depth === 1) {
          product.name = token.text;
        } else if (token.depth === 2) {
          if (headingText.includes('overview') || headingText.includes('description')) {
            currentSection = 'description';
          } else if (headingText.includes('specification')) {
            currentSection = 'specifications';
          } else if (headingText.includes('feature')) {
            currentSection = 'features';
          } else if (headingText.includes('usage') || headingText.includes('instruction')) {
            currentSection = 'usage_instructions';
          } else if (headingText.includes('application') || headingText.includes('method')) {
            currentSection = 'application_method';
          } else if (headingText.includes('benefit')) {
            currentSection = 'benefits';
          } else if (headingText.includes('storage')) {
            currentSection = 'storage_instructions';
          } else if (headingText.includes('safety')) {
            currentSection = 'safety_info';
          } else if (headingText.includes('price')) {
            currentSection = 'price';
          }
        }
      } else if (token.type === 'paragraph' && currentSection) {
        const text = token.text;
        if (currentSection === 'price') {
          product.price = text;
        } else {
          product[currentSection] = text;
        }
      }
    }
    
    return product;
  } catch (error) {
    console.error('Error parsing markdown file:', error);
    return null;
  }
};

// SIMPLIFIED PRODUCT PROCESSING - NO DUPLICATES
const populateDatabase = async () => {
  try {
    console.log('Scanning store directory for products...');
    
    const categories = [
      { name: 'fertilizers', display_name: 'Fertilizers', description: 'Agricultural fertilizers for crop nutrition' },
      { name: 'fungicides', display_name: 'Fungicides', description: 'Plant protection against fungal diseases' },
      { name: 'herbicides', display_name: 'Herbicides', description: 'Weed control solutions' },
      { name: 'nursery_bed', display_name: 'Nursery Bed', description: 'Seedlings and plantlets' },
      { name: 'organic_chemicals', display_name: 'Organic Chemicals', description: 'Organic agricultural chemicals' },
      { name: 'seeds', display_name: 'Seeds', description: 'High-quality agricultural seeds' }
    ];

    // Insert categories
    for (const category of categories) {
      db.run(
        'INSERT OR IGNORE INTO categories (name, display_name, description) VALUES (?, ?, ?)',
        [category.name, category.display_name, category.description]
      );
    }

    const storePath = path.join(__dirname, '../agrof-main/mobile/app/assets/store');
    
    // Process each category directory
    for (const category of categories) {
      // Map category names to actual directory names
      const categoryDirMap = {
        'fertilizers': 'FERTLIZERS',
        'fungicides': 'FUNGICIDES', 
        'herbicides': 'HERBICIDE',
        'nursery_bed': 'Nursery_bed',
        'organic_chemicals': 'ORGANIC_CHEMICALS',
        'seeds': 'SEEDS'
      };
      
      const categoryPath = path.join(storePath, categoryDirMap[category.name] || category.name.toUpperCase());
      
      if (await fs.pathExists(categoryPath)) {
        console.log(`Processing category: ${category.name}`);
        
        // Get category ID
        const categoryId = await new Promise((resolve, reject) => {
          db.get('SELECT id FROM categories WHERE name = ?', [category.name], (err, row) => {
            if (err) reject(err);
            else resolve(row.id);
          });
        });

        // SIMPLIFIED: Only process directories, nothing else
        const items = await fs.readdir(categoryPath);
        
        for (const item of items) {
          const itemPath = path.join(categoryPath, item);
          
          try {
            const stat = await fs.stat(itemPath);
            
            // Only process directories (skip files)
            if (stat.isDirectory()) {
              const productFiles = await fs.readdir(itemPath);
              const imageFile = productFiles.find(file => 
                /\.(jpg|jpeg|png|gif)$/i.test(file)
              );
              
              // Check for individual product .md file
              const productMdFile = productFiles.find(file => file === 'product.md');
              let productData = {
                name: item, // Use directory name as product name
                description: 'Agricultural product for farming needs',
                price: 'Contact for pricing',
                specifications: '',
                features: '',
                usage_instructions: '',
                application_method: '',
                benefits: '',
                storage_instructions: '',
                safety_info: ''
              };
              
              if (productMdFile) {
                // Parse individual product .md file
                const mdPath = path.join(itemPath, productMdFile);
                const parsedProduct = await parseProductMarkdownFile(mdPath);
                if (parsedProduct && parsedProduct.name) {
                  // Use the name from the markdown file
                  productData = { ...productData, ...parsedProduct };
                }
              }
              
              const imageUrl = imageFile ? 
                `/api/images/${categoryDirMap[category.name] || category.name.toUpperCase()}/${encodeURIComponent(item)}/${imageFile}` : 
                null;
              
              // Insert product - ONLY ONCE
              db.run(
                `INSERT OR IGNORE INTO products 
                 (name, category_id, description, price, image_url, specifications, features, usage_instructions, application_method, benefits, storage_instructions, safety_info) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  productData.name, 
                  categoryId, 
                  productData.description, 
                  productData.price, 
                  imageUrl, 
                  productData.specifications,
                  productData.features,
                  productData.usage_instructions,
                  productData.application_method,
                  productData.benefits,
                  productData.storage_instructions,
                  productData.safety_info
                ]
              );
            }
          } catch (error) {
            console.error(`Error processing item ${item}:`, error);
          }
        }
      }
    }
    
    console.log('Database populated successfully');
  } catch (error) {
    console.error('Error populating database:', error);
  }
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AGROF Store Backend is running' });
});

// Get all categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get products with optional filtering
app.get('/api/products', (req, res) => {
  const { category, search, limit = 500 } = req.query;
  let query = 'SELECT p.*, c.display_name as category_display_name FROM products p JOIN categories c ON p.category_id = c.id';
  const params = [];
  
  if (category) {
    query += ' WHERE c.name = ?';
    params.push(category);
  }
  
  if (search) {
    query += category ? ' AND' : ' WHERE';
    query += ' (p.name LIKE ? OR p.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  query += ' ORDER BY p.name LIMIT ?';
  params.push(parseInt(limit));
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.get(
    'SELECT p.*, c.display_name as category_display_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
    [id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(row);
    }
  );
});

// Cart endpoints
app.get('/api/cart/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  db.all(
    `SELECT ci.*, p.name, p.price, p.image_url 
     FROM cart_items ci 
     JOIN products p ON ci.product_id = p.id 
     WHERE ci.session_id = ?`,
    [sessionId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

app.post('/api/cart/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const { product_id, quantity = 1 } = req.body;
  
  db.run(
    'INSERT INTO cart_items (session_id, product_id, quantity) VALUES (?, ?, ?)',
    [sessionId, product_id, quantity],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Item added to cart' });
    }
  );
});

app.put('/api/cart/:sessionId/item/:itemId', (req, res) => {
  const { sessionId, itemId } = req.params;
  const { quantity } = req.body;
  
  db.run(
    'UPDATE cart_items SET quantity = ? WHERE id = ? AND session_id = ?',
    [quantity, itemId, sessionId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Cart item updated' });
    }
  );
});

app.delete('/api/cart/:sessionId/item/:itemId', (req, res) => {
  const { sessionId, itemId } = req.params;
  
  db.run(
    'DELETE FROM cart_items WHERE id = ? AND session_id = ?',
    [itemId, sessionId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Item removed from cart' });
    }
  );
});

app.delete('/api/cart/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  db.run(
    'DELETE FROM cart_items WHERE session_id = ?',
    [sessionId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Cart cleared' });
    }
  );
});

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    await populateDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 AGROF Store Backend running on port ${PORT}`);
      console.log(`📁 Store directory: ${path.join(__dirname, '../agrof-main/mobile/app/assets/store')}`);
      console.log(`🗄️  Database: ${path.join(__dirname, './store-new.db')}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
