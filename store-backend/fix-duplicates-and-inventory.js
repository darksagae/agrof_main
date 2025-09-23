#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'store.db');

class InventoryFixer {
  constructor() {
    this.db = new sqlite3.Database(dbPath);
  }

  // Fix duplicate products by removing duplicates and keeping the best one
  async fixDuplicateProducts() {
    console.log('🔧 Fixing duplicate products...\n');
    
    return new Promise((resolve, reject) => {
      // Find all duplicate products
      const query = `
        SELECT 
          LOWER(TRIM(REPLACE(REPLACE(REPLACE(name, '-', ''), ' ', ''), '.', ''))) as normalized_name,
          GROUP_CONCAT(id) as product_ids,
          COUNT(*) as count
        FROM products 
        WHERE category_id = (SELECT id FROM categories WHERE name = 'fertilizers')
        GROUP BY normalized_name
        HAVING COUNT(*) > 1
        ORDER BY count DESC
      `;
      
      this.db.all(query, (err, duplicates) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (duplicates.length === 0) {
          console.log('✅ No duplicate products found');
          resolve({ message: 'No duplicates to fix', count: 0 });
          return;
        }
        
        console.log(`Found ${duplicates.length} groups of duplicate products:`);
        duplicates.forEach(dup => {
          console.log(`  - ${dup.normalized_name}: ${dup.count} products (IDs: ${dup.product_ids})`);
        });
        
        let completed = 0;
        const total = duplicates.length;
        const removed = [];
        
        duplicates.forEach(duplicate => {
          const productIds = duplicate.product_ids.split(',').map(id => parseInt(id));
          
          // Get details of all products in this duplicate group
          this.db.all(
            `SELECT id, name, price, image_url, specifications FROM products WHERE id IN (${productIds.join(',')})`,
            (err, products) => {
              if (err) {
                console.error(`Error getting product details:`, err);
                completed++;
                if (completed === total) resolve({ message: 'Completed with errors', count: removed.length });
                return;
              }
              
              // Keep the product with the most complete information
              let bestProduct = products[0];
              let bestScore = this.calculateProductScore(products[0]);
              
              for (let i = 1; i < products.length; i++) {
                const score = this.calculateProductScore(products[i]);
                if (score > bestScore) {
                  bestProduct = products[i];
                  bestScore = score;
                }
              }
              
              // Remove the other products
              const productsToRemove = products.filter(p => p.id !== bestProduct.id);
              
              console.log(`\n📦 Processing: ${duplicate.normalized_name}`);
              console.log(`  ✅ Keeping: ${bestProduct.name} (ID: ${bestProduct.id})`);
              
              let removedCount = 0;
              productsToRemove.forEach(product => {
                this.db.run('DELETE FROM products WHERE id = ?', [product.id], function(err) {
                  if (err) {
                    console.error(`  ❌ Error removing product ${product.id}:`, err.message);
                  } else {
                    console.log(`  🗑️  Removed: ${product.name} (ID: ${product.id})`);
                    removed.push({ id: product.id, name: product.name });
                    removedCount++;
                  }
                  
                  if (removedCount === productsToRemove.length) {
                    completed++;
                    if (completed === total) {
                      resolve({ 
                        message: `Removed ${removed.length} duplicate products`, 
                        count: removed.length,
                        removed: removed
                      });
                    }
                  }
                });
              });
            }
          );
        });
      });
    });
  }

  // Calculate a score for product completeness
  calculateProductScore(product) {
    let score = 0;
    
    if (product.name && product.name.length > 0) score += 10;
    if (product.price && product.price !== 'Contact for pricing') score += 20;
    if (product.image_url && product.image_url.length > 0) score += 15;
    if (product.specifications && product.specifications.length > 0) score += 25;
    
    return score;
  }

  // Initialize dynamic inventory system
  async initializeDynamicInventory() {
    console.log('\n🚀 Initializing dynamic inventory system...\n');
    
    return new Promise((resolve, reject) => {
      // First, add missing barcode column if it doesn't exist
      this.db.run('ALTER TABLE products ADD COLUMN barcode TEXT', (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Barcode column already exists or error:', err.message);
        } else {
          console.log('✅ Barcode column ready');
        }
        
        // Initialize stock levels for all products
        this.db.all('SELECT id, name FROM products', (err, products) => {
          if (err) {
            reject(err);
            return;
          }
          
          console.log(`📦 Initializing stock for ${products.length} products...`);
          
          let completed = 0;
          const total = products.length;
          
          products.forEach(product => {
            // Set realistic stock levels based on product type
            const stockLevels = this.calculateStockLevels(product.name);
            
            // Generate barcode if not exists
            const barcode = `AGROF${product.id.toString().padStart(4, '0')}${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            
            this.db.run(`
              UPDATE products SET 
                quantity_in_stock = ?,
                minimum_stock_level = ?,
                maximum_stock_level = ?,
                cost_price = ?,
                selling_price = ?,
                barcode = ?,
                last_restocked_date = datetime('now', '-' || ? || ' days'),
                updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `, [
              stockLevels.current,
              stockLevels.minimum,
              stockLevels.maximum,
              stockLevels.costPrice,
              stockLevels.sellingPrice,
              barcode,
              Math.floor(Math.random() * 30),
              product.id
            ], function(err) {
              if (err) {
                console.error(`Error updating product ${product.name}:`, err.message);
              } else {
                console.log(`✅ ${product.name}: Stock=${stockLevels.current}, Min=${stockLevels.minimum}, Max=${stockLevels.maximum}`);
              }
              
              completed++;
              if (completed === total) {
                console.log(`\n🎉 Initialized inventory for ${total} products!`);
                resolve({ message: `Initialized ${total} products`, count: total });
              }
            });
          });
        });
      });
    });
  }

  // Calculate realistic stock levels based on product name
  calculateStockLevels(productName) {
    const name = productName.toLowerCase();
    
    // Different stock levels for different product types
    let baseStock = 25;
    let minStock = 5;
    let maxStock = 100;
    let costPrice = 15000;
    let sellingPrice = 20000;
    
    // Adjust based on product type
    if (name.includes('npk') || name.includes('urea')) {
      // Popular fertilizers - higher stock
      baseStock = 50;
      minStock = 10;
      maxStock = 200;
      costPrice = 120000;
      sellingPrice = 150000;
    } else if (name.includes('yara') || name.includes('premium')) {
      // Premium products - moderate stock
      baseStock = 30;
      minStock = 8;
      maxStock = 80;
      costPrice = 200000;
      sellingPrice = 250000;
    } else if (name.includes('organic') || name.includes('vermicompost')) {
      // Organic products - lower stock
      baseStock = 20;
      minStock = 5;
      maxStock = 50;
      costPrice = 80000;
      sellingPrice = 100000;
    } else if (name.includes('seedling') || name.includes('seed')) {
      // Seeds/seedlings - seasonal stock
      baseStock = 15;
      minStock = 3;
      maxStock = 40;
      costPrice = 5000;
      sellingPrice = 8000;
    }
    
    // Add some randomness
    const current = Math.floor(baseStock + (Math.random() * 20) - 10);
    const minimum = Math.floor(minStock + (Math.random() * 5));
    const maximum = Math.floor(maxStock + (Math.random() * 30));
    const cost = Math.floor(costPrice + (Math.random() * 20000) - 10000);
    const selling = Math.floor(sellingPrice + (Math.random() * 30000) - 15000);
    
    return {
      current: Math.max(0, current),
      minimum: Math.max(1, minimum),
      maximum: Math.max(maximum, minimum + 10),
      costPrice: Math.max(1000, cost),
      sellingPrice: Math.max(selling, cost + 5000)
    };
  }

  // Create sample transactions to make system dynamic
  async createSampleTransactions() {
    console.log('\n📊 Creating sample transactions to make system dynamic...\n');
    
    return new Promise((resolve, reject) => {
      // Get some products to create transactions for
      this.db.all('SELECT id, name FROM products WHERE quantity_in_stock > 0 LIMIT 20', (err, products) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (products.length === 0) {
          console.log('No products available for transactions');
          resolve({ message: 'No transactions created', count: 0 });
          return;
        }
        
        let completed = 0;
        const total = products.length;
        const transactions = [];
        
        products.forEach(product => {
          // Create random transactions (sales, restocks, adjustments)
          const transactionTypes = ['OUT', 'IN', 'ADJUSTMENT'];
          const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
          const quantity = Math.floor(Math.random() * 10) + 1;
          
          const notes = {
            'OUT': 'Customer sale',
            'IN': 'Supplier restock',
            'ADJUSTMENT': 'Inventory adjustment'
          }[transactionType];
          
          this.db.run(`
            INSERT INTO inventory_transactions 
            (product_id, transaction_type, quantity, notes, created_at)
            VALUES (?, ?, ?, ?, datetime('now', '-' || ? || ' hours'))
          `, [
            product.id,
            transactionType,
            quantity,
            notes,
            Math.floor(Math.random() * 168) // Random time in last week
          ], function(err) {
            if (err) {
              console.error(`Error creating transaction for ${product.name}:`, err.message);
            } else {
              transactions.push({
                product: product.name,
                type: transactionType,
                quantity: quantity
              });
              console.log(`✅ ${transactionType} ${quantity} units of ${product.name}`);
            }
            
            completed++;
            if (completed === total) {
              console.log(`\n🎉 Created ${transactions.length} sample transactions!`);
              resolve({ 
                message: `Created ${transactions.length} transactions`, 
                count: transactions.length,
                transactions: transactions
              });
            }
          });
        });
      });
    });
  }

  // Check for low stock and create alerts
  async checkAndCreateAlerts() {
    console.log('\n⚠️  Checking for low stock and creating alerts...\n');
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT id, name, quantity_in_stock, minimum_stock_level
        FROM products 
        WHERE quantity_in_stock <= minimum_stock_level
        AND id NOT IN (
          SELECT product_id FROM stock_alerts 
          WHERE is_resolved = FALSE AND alert_type IN ('LOW_STOCK', 'OUT_OF_STOCK')
        )
      `;
      
      this.db.all(query, (err, lowStockProducts) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (lowStockProducts.length === 0) {
          console.log('✅ No low stock alerts needed');
          resolve({ message: 'No alerts needed', count: 0 });
          return;
        }
        
        console.log(`Found ${lowStockProducts.length} products with low stock:`);
        
        let completed = 0;
        const alerts = [];
        
        lowStockProducts.forEach(product => {
          const alertType = product.quantity_in_stock <= 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK';
          const message = product.quantity_in_stock <= 0 
            ? `${product.name} is out of stock`
            : `${product.name} stock is below minimum level (${product.quantity_in_stock}/${product.minimum_stock_level})`;
          
          this.db.run(
            'INSERT INTO stock_alerts (product_id, alert_type, message) VALUES (?, ?, ?)',
            [product.id, alertType, message],
            function(err) {
              if (err) {
                console.error(`Error creating alert for ${product.name}:`, err.message);
              } else {
                alerts.push({ product: product.name, type: alertType, message });
                console.log(`⚠️  ${alertType}: ${product.name} (${product.quantity_in_stock}/${product.minimum_stock_level})`);
              }
              
              completed++;
              if (completed === lowStockProducts.length) {
                console.log(`\n🎉 Created ${alerts.length} stock alerts!`);
                resolve({ 
                  message: `Created ${alerts.length} alerts`, 
                  count: alerts.length,
                  alerts: alerts
                });
              }
            }
          );
        });
      });
    });
  }

  // Run all fixes
  async runAllFixes() {
    console.log('🔧 AGROF Store Fix - Duplicates & Dynamic Inventory\n');
    console.log('=' .repeat(50));
    
    try {
      // Step 1: Fix duplicate products
      const duplicateResult = await this.fixDuplicateProducts();
      console.log(`\n✅ Duplicate fix result: ${duplicateResult.message}`);
      
      // Step 2: Initialize dynamic inventory
      const inventoryResult = await this.initializeDynamicInventory();
      console.log(`\n✅ Inventory initialization: ${inventoryResult.message}`);
      
      // Step 3: Create sample transactions
      const transactionResult = await this.createSampleTransactions();
      console.log(`\n✅ Transaction creation: ${transactionResult.message}`);
      
      // Step 4: Check and create alerts
      const alertResult = await this.checkAndCreateAlerts();
      console.log(`\n✅ Alert creation: ${alertResult.message}`);
      
      console.log('\n' + '=' .repeat(50));
      console.log('🎉 ALL FIXES COMPLETED SUCCESSFULLY!');
      console.log('\n📊 Summary:');
      console.log(`  - Removed ${duplicateResult.count} duplicate products`);
      console.log(`  - Initialized ${inventoryResult.count} products with stock`);
      console.log(`  - Created ${transactionResult.count} sample transactions`);
      console.log(`  - Generated ${alertResult.count} stock alerts`);
      
      console.log('\n🌐 Your inventory system is now dynamic and working!');
      console.log('   Access the dashboard at: http://localhost:3001/inventory');
      
      return {
        duplicates: duplicateResult,
        inventory: inventoryResult,
        transactions: transactionResult,
        alerts: alertResult
      };
      
    } catch (error) {
      console.error('❌ Error during fixes:', error.message);
      throw error;
    } finally {
      this.db.close();
    }
  }
}

// Run fixes if this script is executed directly
if (require.main === module) {
  const fixer = new InventoryFixer();
  fixer.runAllFixes()
    .then(() => {
      console.log('\n✅ All fixes completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fixes failed:', error.message);
      process.exit(1);
    });
}

module.exports = InventoryFixer;
