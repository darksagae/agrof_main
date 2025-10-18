/**
 * AGROF Offline Database Service
 * SQLite-based local database for offline functionality
 * Provides hybrid online/offline data access
 */

import { openDatabaseAsync } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

class OfflineDatabase {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.dbName = 'agrof_offline.db';
  }

  /**
   * Initialize the offline database
   */
  async initialize() {
    try {
      console.log('🗄️ Initializing AGROF Offline Database...');
      
      // Open SQLite database using new API
      this.db = await openDatabaseAsync(this.dbName);
      
      // Create tables
      await this.createTables();
      
      // Set initialization flag
      this.isInitialized = true;
      
      console.log('✅ AGROF Offline Database initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize offline database:', error);
      return false;
    }
  }

  /**
   * Create all required database tables
   */
  async createTables() {
    try {
      // Categories table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          display_name TEXT NOT NULL,
          description TEXT,
          image_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          synced_at DATETIME,
          is_offline BOOLEAN DEFAULT 0
        )
      `);

      // Products table
      await this.db.execAsync(`
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
          quantity_in_stock INTEGER DEFAULT 0,
          minimum_stock_level INTEGER DEFAULT 10,
          maximum_stock_level INTEGER DEFAULT 1000,
          unit_of_measure TEXT DEFAULT 'bags',
          barcode TEXT UNIQUE,
          supplier_name TEXT,
          supplier_contact TEXT,
          cost_price DECIMAL(10,2),
          selling_price DECIMAL(10,2),
          last_restocked_date DATETIME,
          expiry_date DATETIME,
          batch_number TEXT,
          location TEXT DEFAULT 'Warehouse A',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          synced_at DATETIME,
          is_offline BOOLEAN DEFAULT 0,
          FOREIGN KEY (category_id) REFERENCES categories (id)
        )
      `);

      // Users table (local user data)
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT,
          email TEXT,
          phone TEXT,
          profile_photo TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          synced_at DATETIME,
          is_offline BOOLEAN DEFAULT 0
        )
      `);

      // Cart table (offline cart items)
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS cart (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          product_id INTEGER,
          quantity INTEGER DEFAULT 1,
          price DECIMAL(10,2),
          total_price DECIMAL(10,2),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          synced_at DATETIME,
          is_offline BOOLEAN DEFAULT 1,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `);

      // Orders table (offline order history)
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          order_number TEXT UNIQUE,
          total_amount DECIMAL(10,2),
          status TEXT DEFAULT 'pending',
          payment_method TEXT,
          shipping_address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          synced_at DATETIME,
          is_offline BOOLEAN DEFAULT 1,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Order items table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER,
          product_id INTEGER,
          quantity INTEGER,
          price DECIMAL(10,2),
          total_price DECIMAL(10,2),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders (id),
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `);

      // Sync queue table (for pending sync operations)
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS sync_queue (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          table_name TEXT NOT NULL,
          operation TEXT NOT NULL,
          record_id TEXT NOT NULL,
          data TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          retry_count INTEGER DEFAULT 0,
          status TEXT DEFAULT 'pending'
        )
      `);

      // Create indexes for better performance
      await this.db.execAsync('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)');
      await this.db.execAsync('CREATE INDEX IF NOT EXISTS idx_cart_user ON cart(user_id)');
      await this.db.execAsync('CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)');
      await this.db.execAsync('CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status)');

      console.log('✅ Database tables created successfully');
    } catch (error) {
      console.error('❌ Error creating tables:', error);
      throw error;
    }
  }

  /**
   * Check if database is initialized
   */
  isReady() {
    return this.isInitialized && this.db !== null;
  }

  /**
   * Execute a SQL query with parameters
   */
  async executeQuery(sql, params = []) {
    if (!this.isReady()) {
      throw new Error('Database not initialized');
    }

    try {
      const result = await this.db.getAllAsync(sql, params);
      return { rows: { _array: result } };
    } catch (error) {
      console.error('❌ SQL Error:', error);
      throw error;
    }
  }

  /**
   * Get all products from local database
   */
  async getProducts(categoryId = null, limit = null) {
    try {
      let sql = 'SELECT * FROM products';
      let params = [];

      if (categoryId) {
        sql += ' WHERE category_id = ?';
        params.push(categoryId);
      }

      if (limit) {
        sql += ' LIMIT ?';
        params.push(limit);
      }

      sql += ' ORDER BY created_at DESC';

      const result = await this.executeQuery(sql, params);
      return result.rows._array;
    } catch (error) {
      console.error('❌ Error getting products:', error);
      return [];
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id) {
    try {
      const result = await this.executeQuery(
        'SELECT * FROM products WHERE id = ?',
        [id]
      );
      return result.rows._array[0] || null;
    } catch (error) {
      console.error('❌ Error getting product:', error);
      return null;
    }
  }

  /**
   * Save product to local database
   */
  async saveProduct(product) {
    try {
      const sql = `
        INSERT OR REPLACE INTO products (
          id, name, category_id, description, price, image_url,
          specifications, features, usage_instructions, application_method,
          benefits, storage_instructions, safety_info, availability,
          quantity_in_stock, minimum_stock_level, maximum_stock_level,
          unit_of_measure, barcode, supplier_name, supplier_contact,
          cost_price, selling_price, last_restocked_date, expiry_date,
          batch_number, location, created_at, updated_at, synced_at, is_offline
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        product.id, product.name, product.category_id, product.description,
        product.price, product.image_url, product.specifications, product.features,
        product.usage_instructions, product.application_method, product.benefits,
        product.storage_instructions, product.safety_info, product.availability,
        product.quantity_in_stock, product.minimum_stock_level, product.maximum_stock_level,
        product.unit_of_measure, product.barcode, product.supplier_name, product.supplier_contact,
        product.cost_price, product.selling_price, product.last_restocked_date,
        product.expiry_date, product.batch_number, product.location,
        product.created_at || new Date().toISOString(),
        new Date().toISOString(),
        new Date().toISOString(),
        product.is_offline || 0
      ];

      await this.db.runAsync(sql, params);
      console.log('✅ Product saved to local database:', product.name);
      return true;
    } catch (error) {
      console.error('❌ Error saving product:', error);
      return false;
    }
  }

  /**
   * Get all categories from local database
   */
  async getCategories() {
    try {
      const result = await this.executeQuery(
        'SELECT * FROM categories ORDER BY name ASC'
      );
      return result.rows._array;
    } catch (error) {
      console.error('❌ Error getting categories:', error);
      return [];
    }
  }

  /**
   * Save category to local database
   */
  async saveCategory(category) {
    try {
      const sql = `
        INSERT OR REPLACE INTO categories (
          id, name, display_name, description, image_url,
          created_at, updated_at, synced_at, is_offline
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        category.id, category.name, category.display_name,
        category.description, category.image_url,
        category.created_at || new Date().toISOString(),
        new Date().toISOString(),
        new Date().toISOString(),
        category.is_offline || 0
      ];

      await this.db.runAsync(sql, params);
      console.log('✅ Category saved to local database:', category.name);
      return true;
    } catch (error) {
      console.error('❌ Error saving category:', error);
      return false;
    }
  }

  /**
   * Get user data from local database
   */
  async getUser(userId) {
    try {
      const result = await this.executeQuery(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
      return result.rows._array[0] || null;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  }

  /**
   * Save user data to local database
   */
  async saveUser(user) {
    try {
      const sql = `
        INSERT OR REPLACE INTO users (
          id, username, email, phone, profile_photo,
          created_at, updated_at, synced_at, is_offline
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        user.id, user.username, user.email, user.phone, user.profile_photo,
        user.created_at || new Date().toISOString(),
        new Date().toISOString(),
        new Date().toISOString(),
        user.is_offline || 0
      ];

      await this.db.runAsync(sql, params);
      console.log('✅ User saved to local database:', user.username);
      return true;
    } catch (error) {
      console.error('❌ Error saving user:', error);
      return false;
    }
  }

  /**
   * Get cart items for user
   */
  async getCartItems(userId) {
    try {
      const result = await this.executeQuery(`
        SELECT c.*, p.name, p.price, p.image_url, p.availability
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
      `, [userId]);

      return result.rows._array;
    } catch (error) {
      console.error('❌ Error getting cart items:', error);
      return [];
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(userId, productId, quantity = 1) {
    try {
      // Get product details
      const product = await this.getProductById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const price = parseFloat(product.selling_price || product.price || 0);
      const totalPrice = price * quantity;

      const sql = `
        INSERT OR REPLACE INTO cart (
          user_id, product_id, quantity, price, total_price,
          created_at, updated_at, synced_at, is_offline
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        userId, productId, quantity, price, totalPrice,
        new Date().toISOString(),
        new Date().toISOString(),
        new Date().toISOString(),
        1 // is_offline
      ];

      await this.db.runAsync(sql, params);
      console.log('✅ Item added to cart:', product.name);
      return true;
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      return false;
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(userId, productId) {
    try {
      await this.db.runAsync(
        'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );
      console.log('✅ Item removed from cart');
      return true;
    } catch (error) {
      console.error('❌ Error removing from cart:', error);
      return false;
    }
  }

  /**
   * Clear cart for user
   */
  async clearCart(userId) {
    try {
      await this.db.runAsync(
        'DELETE FROM cart WHERE user_id = ?',
        [userId]
      );
      console.log('✅ Cart cleared');
      return true;
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
      return false;
    }
  }

  /**
   * Get pending sync operations
   */
  async getPendingSync() {
    try {
      const result = await this.executeQuery(
        'SELECT * FROM sync_queue WHERE status = "pending" ORDER BY created_at ASC'
      );
      return result.rows._array;
    } catch (error) {
      console.error('❌ Error getting pending sync:', error);
      return [];
    }
  }

  /**
   * Add operation to sync queue
   */
  async addToSyncQueue(tableName, operation, recordId, data) {
    try {
      const sql = `
        INSERT INTO sync_queue (table_name, operation, record_id, data)
        VALUES (?, ?, ?, ?)
      `;

      await this.db.runAsync(sql, [tableName, operation, recordId, JSON.stringify(data)]);
      console.log('✅ Operation added to sync queue');
      return true;
    } catch (error) {
      console.error('❌ Error adding to sync queue:', error);
      return false;
    }
  }

  /**
   * Mark sync operation as completed
   */
  async markSyncCompleted(syncId) {
    try {
      await this.db.runAsync(
        'UPDATE sync_queue SET status = "completed" WHERE id = ?',
        [syncId]
      );
      return true;
    } catch (error) {
      console.error('❌ Error marking sync completed:', error);
      return false;
    }
  }

  /**
   * Get database statistics
   */
  async getStats() {
    try {
      const productsResult = await this.executeQuery('SELECT COUNT(*) as count FROM products');
      const categoriesResult = await this.executeQuery('SELECT COUNT(*) as count FROM categories');
      const cartResult = await this.executeQuery('SELECT COUNT(*) as count FROM cart');
      const syncResult = await this.executeQuery('SELECT COUNT(*) as count FROM sync_queue WHERE status = "pending"');

      return {
        products: productsResult.rows._array[0].count,
        categories: categoriesResult.rows._array[0].count,
        cartItems: cartResult.rows._array[0].count,
        pendingSync: syncResult.rows._array[0].count
      };
    } catch (error) {
      console.error('❌ Error getting stats:', error);
      return null;
    }
  }

  /**
   * Clear all data (for testing/reset)
   */
  async clearAllData() {
    try {
      await this.db.runAsync('DELETE FROM cart');
      await this.db.runAsync('DELETE FROM order_items');
      await this.db.runAsync('DELETE FROM orders');
      await this.db.runAsync('DELETE FROM products');
      await this.db.runAsync('DELETE FROM categories');
      await this.db.runAsync('DELETE FROM users');
      await this.db.runAsync('DELETE FROM sync_queue');
      
      console.log('✅ All data cleared');
      return true;
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      return false;
    }
  }
}

// Create and export singleton instance
const offlineDatabase = new OfflineDatabase();
export default offlineDatabase;

 * SQLite-based local database for offline functionality
 * Provides hybrid online/offline data access
 */

import { openDatabaseAsync } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

class OfflineDatabase {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.dbName = 'agrof_offline.db';
  }

  /**
   * Initialize the offline database
   */
  async initialize() {
    try {
      console.log('🗄️ Initializing AGROF Offline Database...');
      
      // Open SQLite database using new API
      this.db = await openDatabaseAsync(this.dbName);
      
      // Create tables
      await this.createTables();
      
      // Set initialization flag
      this.isInitialized = true;
      
      console.log('✅ AGROF Offline Database initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize offline database:', error);
      return false;
    }
  }

  /**
   * Create all required database tables
   */
  async createTables() {
    try {
      // Categories table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          display_name TEXT NOT NULL,
          description TEXT,
          image_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          synced_at DATETIME,
          is_offline BOOLEAN DEFAULT 0
        )
      `);

      // Products table
      await this.db.execAsync(`
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
          quantity_in_stock INTEGER DEFAULT 0,
          minimum_stock_level INTEGER DEFAULT 10,
          maximum_stock_level INTEGER DEFAULT 1000,
          unit_of_measure TEXT DEFAULT 'bags',
          barcode TEXT UNIQUE,
          supplier_name TEXT,
          supplier_contact TEXT,
          cost_price DECIMAL(10,2),
          selling_price DECIMAL(10,2),
          last_restocked_date DATETIME,
          expiry_date DATETIME,
          batch_number TEXT,
          location TEXT DEFAULT 'Warehouse A',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          synced_at DATETIME,
          is_offline BOOLEAN DEFAULT 0,
          FOREIGN KEY (category_id) REFERENCES categories (id)
        )
      `);

      // Users table (local user data)
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT,
          email TEXT,
          phone TEXT,
          profile_photo TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          synced_at DATETIME,
          is_offline BOOLEAN DEFAULT 0
        )
      `);

      // Cart table (offline cart items)
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS cart (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          product_id INTEGER,
          quantity INTEGER DEFAULT 1,
          price DECIMAL(10,2),
          total_price DECIMAL(10,2),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          synced_at DATETIME,
          is_offline BOOLEAN DEFAULT 1,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `);

      // Orders table (offline order history)
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          order_number TEXT UNIQUE,
          total_amount DECIMAL(10,2),
          status TEXT DEFAULT 'pending',
          payment_method TEXT,
          shipping_address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          synced_at DATETIME,
          is_offline BOOLEAN DEFAULT 1,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Order items table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER,
          product_id INTEGER,
          quantity INTEGER,
          price DECIMAL(10,2),
          total_price DECIMAL(10,2),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders (id),
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `);

      // Sync queue table (for pending sync operations)
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS sync_queue (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          table_name TEXT NOT NULL,
          operation TEXT NOT NULL,
          record_id TEXT NOT NULL,
          data TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          retry_count INTEGER DEFAULT 0,
          status TEXT DEFAULT 'pending'
        )
      `);

      // Create indexes for better performance
      await this.db.execAsync('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)');
      await this.db.execAsync('CREATE INDEX IF NOT EXISTS idx_cart_user ON cart(user_id)');
      await this.db.execAsync('CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)');
      await this.db.execAsync('CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status)');

      console.log('✅ Database tables created successfully');
    } catch (error) {
      console.error('❌ Error creating tables:', error);
      throw error;
    }
  }

  /**
   * Check if database is initialized
   */
  isReady() {
    return this.isInitialized && this.db !== null;
  }

  /**
   * Execute a SQL query with parameters
   */
  async executeQuery(sql, params = []) {
    if (!this.isReady()) {
      throw new Error('Database not initialized');
    }

    try {
      const result = await this.db.getAllAsync(sql, params);
      return { rows: { _array: result } };
    } catch (error) {
      console.error('❌ SQL Error:', error);
      throw error;
    }
  }

  /**
   * Get all products from local database
   */
  async getProducts(categoryId = null, limit = null) {
    try {
      let sql = 'SELECT * FROM products';
      let params = [];

      if (categoryId) {
        sql += ' WHERE category_id = ?';
        params.push(categoryId);
      }

      if (limit) {
        sql += ' LIMIT ?';
        params.push(limit);
      }

      sql += ' ORDER BY created_at DESC';

      const result = await this.executeQuery(sql, params);
      return result.rows._array;
    } catch (error) {
      console.error('❌ Error getting products:', error);
      return [];
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id) {
    try {
      const result = await this.executeQuery(
        'SELECT * FROM products WHERE id = ?',
        [id]
      );
      return result.rows._array[0] || null;
    } catch (error) {
      console.error('❌ Error getting product:', error);
      return null;
    }
  }

  /**
   * Save product to local database
   */
  async saveProduct(product) {
    try {
      const sql = `
        INSERT OR REPLACE INTO products (
          id, name, category_id, description, price, image_url,
          specifications, features, usage_instructions, application_method,
          benefits, storage_instructions, safety_info, availability,
          quantity_in_stock, minimum_stock_level, maximum_stock_level,
          unit_of_measure, barcode, supplier_name, supplier_contact,
          cost_price, selling_price, last_restocked_date, expiry_date,
          batch_number, location, created_at, updated_at, synced_at, is_offline
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        product.id, product.name, product.category_id, product.description,
        product.price, product.image_url, product.specifications, product.features,
        product.usage_instructions, product.application_method, product.benefits,
        product.storage_instructions, product.safety_info, product.availability,
        product.quantity_in_stock, product.minimum_stock_level, product.maximum_stock_level,
        product.unit_of_measure, product.barcode, product.supplier_name, product.supplier_contact,
        product.cost_price, product.selling_price, product.last_restocked_date,
        product.expiry_date, product.batch_number, product.location,
        product.created_at || new Date().toISOString(),
        new Date().toISOString(),
        new Date().toISOString(),
        product.is_offline || 0
      ];

      await this.db.runAsync(sql, params);
      console.log('✅ Product saved to local database:', product.name);
      return true;
    } catch (error) {
      console.error('❌ Error saving product:', error);
      return false;
    }
  }

  /**
   * Get all categories from local database
   */
  async getCategories() {
    try {
      const result = await this.executeQuery(
        'SELECT * FROM categories ORDER BY name ASC'
      );
      return result.rows._array;
    } catch (error) {
      console.error('❌ Error getting categories:', error);
      return [];
    }
  }

  /**
   * Save category to local database
   */
  async saveCategory(category) {
    try {
      const sql = `
        INSERT OR REPLACE INTO categories (
          id, name, display_name, description, image_url,
          created_at, updated_at, synced_at, is_offline
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        category.id, category.name, category.display_name,
        category.description, category.image_url,
        category.created_at || new Date().toISOString(),
        new Date().toISOString(),
        new Date().toISOString(),
        category.is_offline || 0
      ];

      await this.db.runAsync(sql, params);
      console.log('✅ Category saved to local database:', category.name);
      return true;
    } catch (error) {
      console.error('❌ Error saving category:', error);
      return false;
    }
  }

  /**
   * Get user data from local database
   */
  async getUser(userId) {
    try {
      const result = await this.executeQuery(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
      return result.rows._array[0] || null;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  }

  /**
   * Save user data to local database
   */
  async saveUser(user) {
    try {
      const sql = `
        INSERT OR REPLACE INTO users (
          id, username, email, phone, profile_photo,
          created_at, updated_at, synced_at, is_offline
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        user.id, user.username, user.email, user.phone, user.profile_photo,
        user.created_at || new Date().toISOString(),
        new Date().toISOString(),
        new Date().toISOString(),
        user.is_offline || 0
      ];

      await this.db.runAsync(sql, params);
      console.log('✅ User saved to local database:', user.username);
      return true;
    } catch (error) {
      console.error('❌ Error saving user:', error);
      return false;
    }
  }

  /**
   * Get cart items for user
   */
  async getCartItems(userId) {
    try {
      const result = await this.executeQuery(`
        SELECT c.*, p.name, p.price, p.image_url, p.availability
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
      `, [userId]);

      return result.rows._array;
    } catch (error) {
      console.error('❌ Error getting cart items:', error);
      return [];
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(userId, productId, quantity = 1) {
    try {
      // Get product details
      const product = await this.getProductById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const price = parseFloat(product.selling_price || product.price || 0);
      const totalPrice = price * quantity;

      const sql = `
        INSERT OR REPLACE INTO cart (
          user_id, product_id, quantity, price, total_price,
          created_at, updated_at, synced_at, is_offline
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        userId, productId, quantity, price, totalPrice,
        new Date().toISOString(),
        new Date().toISOString(),
        new Date().toISOString(),
        1 // is_offline
      ];

      await this.db.runAsync(sql, params);
      console.log('✅ Item added to cart:', product.name);
      return true;
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      return false;
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(userId, productId) {
    try {
      await this.db.runAsync(
        'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );
      console.log('✅ Item removed from cart');
      return true;
    } catch (error) {
      console.error('❌ Error removing from cart:', error);
      return false;
    }
  }

  /**
   * Clear cart for user
   */
  async clearCart(userId) {
    try {
      await this.db.runAsync(
        'DELETE FROM cart WHERE user_id = ?',
        [userId]
      );
      console.log('✅ Cart cleared');
      return true;
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
      return false;
    }
  }

  /**
   * Get pending sync operations
   */
  async getPendingSync() {
    try {
      const result = await this.executeQuery(
        'SELECT * FROM sync_queue WHERE status = "pending" ORDER BY created_at ASC'
      );
      return result.rows._array;
    } catch (error) {
      console.error('❌ Error getting pending sync:', error);
      return [];
    }
  }

  /**
   * Add operation to sync queue
   */
  async addToSyncQueue(tableName, operation, recordId, data) {
    try {
      const sql = `
        INSERT INTO sync_queue (table_name, operation, record_id, data)
        VALUES (?, ?, ?, ?)
      `;

      await this.db.runAsync(sql, [tableName, operation, recordId, JSON.stringify(data)]);
      console.log('✅ Operation added to sync queue');
      return true;
    } catch (error) {
      console.error('❌ Error adding to sync queue:', error);
      return false;
    }
  }

  /**
   * Mark sync operation as completed
   */
  async markSyncCompleted(syncId) {
    try {
      await this.db.runAsync(
        'UPDATE sync_queue SET status = "completed" WHERE id = ?',
        [syncId]
      );
      return true;
    } catch (error) {
      console.error('❌ Error marking sync completed:', error);
      return false;
    }
  }

  /**
   * Get database statistics
   */
  async getStats() {
    try {
      const productsResult = await this.executeQuery('SELECT COUNT(*) as count FROM products');
      const categoriesResult = await this.executeQuery('SELECT COUNT(*) as count FROM categories');
      const cartResult = await this.executeQuery('SELECT COUNT(*) as count FROM cart');
      const syncResult = await this.executeQuery('SELECT COUNT(*) as count FROM sync_queue WHERE status = "pending"');

      return {
        products: productsResult.rows._array[0].count,
        categories: categoriesResult.rows._array[0].count,
        cartItems: cartResult.rows._array[0].count,
        pendingSync: syncResult.rows._array[0].count
      };
    } catch (error) {
      console.error('❌ Error getting stats:', error);
      return null;
    }
  }

  /**
   * Clear all data (for testing/reset)
   */
  async clearAllData() {
    try {
      await this.db.runAsync('DELETE FROM cart');
      await this.db.runAsync('DELETE FROM order_items');
      await this.db.runAsync('DELETE FROM orders');
      await this.db.runAsync('DELETE FROM products');
      await this.db.runAsync('DELETE FROM categories');
      await this.db.runAsync('DELETE FROM users');
      await this.db.runAsync('DELETE FROM sync_queue');
      
      console.log('✅ All data cleared');
      return true;
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      return false;
    }
  }
}

// Create and export singleton instance
const offlineDatabase = new OfflineDatabase();
export default offlineDatabase;



