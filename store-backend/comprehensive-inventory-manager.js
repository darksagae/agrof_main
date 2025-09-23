#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');

const dbPath = path.join(__dirname, 'store.db');

class ComprehensiveInventoryManager {
  constructor() {
    this.db = new sqlite3.Database(dbPath);
    this.duplicates = [];
    this.analysis = {};
  }

  // Analyze entire project structure
  async analyzeEntireProject() {
    console.log('🔍 COMPREHENSIVE PROJECT ANALYSIS');
    console.log('=' .repeat(60));
    
    return new Promise((resolve, reject) => {
      // Get complete store analysis
      const storeQuery = `
        SELECT 
          c.name as category,
          c.display_name,
          COUNT(p.id) as product_count,
          COUNT(CASE WHEN p.quantity_in_stock > 0 THEN 1 END) as in_stock,
          COUNT(CASE WHEN p.quantity_in_stock <= 0 THEN 1 END) as out_of_stock,
          COUNT(CASE WHEN p.quantity_in_stock <= p.minimum_stock_level AND p.quantity_in_stock > 0 THEN 1 END) as low_stock
        FROM categories c 
        LEFT JOIN products p ON c.id = p.category_id 
        GROUP BY c.id, c.name, c.display_name 
        ORDER BY product_count DESC
      `;
      
      this.db.all(storeQuery, (err, storeData) => {
        if (err) {
          reject(err);
          return;
        }
        
        this.analysis.stores = storeData;
        
        // Get duplicate analysis
        const duplicateQuery = `
          SELECT 
            p.name,
            COUNT(*) as count,
            GROUP_CONCAT(DISTINCT c.display_name) as categories,
            GROUP_CONCAT(p.id) as product_ids,
            GROUP_CONCAT(p.quantity_in_stock) as stock_levels
          FROM products p 
          JOIN categories c ON p.category_id = c.id 
          GROUP BY LOWER(TRIM(REPLACE(REPLACE(REPLACE(p.name, '-', ''), ' ', ''), '.', ''))) 
          HAVING COUNT(*) > 1 
          ORDER BY count DESC
        `;
        
        this.db.all(duplicateQuery, (err, duplicateData) => {
          if (err) {
            reject(err);
            return;
          }
          
          this.duplicates = duplicateData;
          this.analysis.duplicates = duplicateData;
          
          // Get pricing analysis
          const pricingQuery = `
            SELECT 
              c.display_name as category,
              COUNT(*) as total_products,
              COUNT(CASE WHEN p.price LIKE '%Contact for pricing%' THEN 1 END) as no_pricing,
              COUNT(CASE WHEN p.price NOT LIKE '%Contact for pricing%' AND p.price IS NOT NULL THEN 1 END) as has_pricing
            FROM products p 
            JOIN categories c ON p.category_id = c.id 
            GROUP BY c.id, c.display_name
            ORDER BY total_products DESC
          `;
          
          this.db.all(pricingQuery, (err, pricingData) => {
            if (err) {
              reject(err);
              return;
            }
            
            this.analysis.pricing = pricingData;
            
            // Get inventory value analysis
            const valueQuery = `
              SELECT 
                c.display_name as category,
                SUM(p.quantity_in_stock * COALESCE(p.selling_price, 0)) as total_value,
                AVG(p.quantity_in_stock) as avg_stock,
                SUM(p.quantity_in_stock) as total_stock
              FROM products p 
              JOIN categories c ON p.category_id = c.id 
              GROUP BY c.id, c.display_name
              ORDER BY total_value DESC
            `;
            
            this.db.all(valueQuery, (err, valueData) => {
              if (err) {
                reject(err);
                return;
              }
              
              this.analysis.inventoryValue = valueData;
              
              this.displayAnalysis();
              resolve(this.analysis);
            });
          });
        });
      });
    });
  }

  displayAnalysis() {
    console.log('\n📊 STORE INVENTORY ANALYSIS:');
    console.log('-' .repeat(60));
    this.analysis.stores.forEach(store => {
      console.log(`${store.display_name.toUpperCase()}:`);
      console.log(`  📦 Total Products: ${store.product_count}`);
      console.log(`  ✅ In Stock: ${store.in_stock}`);
      console.log(`  ❌ Out of Stock: ${store.out_of_stock}`);
      console.log(`  ⚠️  Low Stock: ${store.low_stock}`);
      console.log('');
    });

    const totalProducts = this.analysis.stores.reduce((sum, store) => sum + store.product_count, 0);
    const totalInStock = this.analysis.stores.reduce((sum, store) => sum + store.in_stock, 0);
    const totalOutOfStock = this.analysis.stores.reduce((sum, store) => sum + store.out_of_stock, 0);
    const totalLowStock = this.analysis.stores.reduce((sum, store) => sum + store.low_stock, 0);

    console.log('📈 OVERALL SUMMARY:');
    console.log(`  🏪 Total Stores: ${this.analysis.stores.length}`);
    console.log(`  📦 Total Products: ${totalProducts}`);
    console.log(`  ✅ Total In Stock: ${totalInStock}`);
    console.log(`  ❌ Total Out of Stock: ${totalOutOfStock}`);
    console.log(`  ⚠️  Total Low Stock: ${totalLowStock}`);

    console.log('\n💰 PRICING ANALYSIS:');
    console.log('-' .repeat(60));
    this.analysis.pricing.forEach(store => {
      const pricingPercentage = ((store.has_pricing / store.total_products) * 100).toFixed(1);
      console.log(`${store.category}: ${store.has_pricing}/${store.total_products} products priced (${pricingPercentage}%)`);
    });

    console.log('\n🔍 DUPLICATE PRODUCTS ANALYSIS:');
    console.log('-' .repeat(60));
    if (this.duplicates.length === 0) {
      console.log('✅ No duplicate products found!');
    } else {
      console.log(`❌ Found ${this.duplicates.length} groups of duplicate products:`);
      this.duplicates.forEach(dup => {
        console.log(`  - ${dup.name}: ${dup.count} copies in [${dup.categories}]`);
      });
    }

    console.log('\n💎 INVENTORY VALUE ANALYSIS:');
    console.log('-' .repeat(60));
    this.analysis.inventoryValue.forEach(store => {
      console.log(`${store.category}: UGX ${store.total_value.toLocaleString()} (${store.total_stock} units)`);
    });
  }

  // Deep deduplication across all stores
  async performDeepDeduplication() {
    console.log('\n🔧 PERFORMING DEEP DEDUPLICATION');
    console.log('=' .repeat(60));
    
    if (this.duplicates.length === 0) {
      console.log('✅ No duplicates to remove!');
      return { removed: 0, kept: 0 };
    }

    return new Promise((resolve, reject) => {
      let completed = 0;
      const total = this.duplicates.length;
      const results = { removed: 0, kept: 0, details: [] };

      this.duplicates.forEach(duplicate => {
        const productIds = duplicate.product_ids.split(',').map(id => parseInt(id));
        const stockLevels = duplicate.stock_levels.split(',').map(level => parseInt(level));
        
        // Get detailed product information
        this.db.all(
          `SELECT id, name, price, image_url, specifications, quantity_in_stock, selling_price 
           FROM products WHERE id IN (${productIds.join(',')})`,
          (err, products) => {
            if (err) {
              console.error(`Error getting product details:`, err);
              completed++;
              if (completed === total) resolve(results);
              return;
            }

            // Score products based on completeness and stock
            const scoredProducts = products.map(product => ({
              ...product,
              score: this.calculateProductScore(product)
            }));

            // Sort by score (highest first)
            scoredProducts.sort((a, b) => b.score - a.score);

            const bestProduct = scoredProducts[0];
            const productsToRemove = scoredProducts.slice(1);

            console.log(`\n📦 Processing: ${duplicate.name}`);
            console.log(`  ✅ Keeping: ${bestProduct.name} (ID: ${bestProduct.id}, Score: ${bestProduct.score})`);
            console.log(`  🗑️  Removing: ${productsToRemove.length} duplicates`);

            let removedCount = 0;
            productsToRemove.forEach(product => {
              this.db.run('DELETE FROM products WHERE id = ?', [product.id], function(err) {
                if (err) {
                  console.error(`  ❌ Error removing product ${product.id}:`, err.message);
                } else {
                  console.log(`  🗑️  Removed: ${product.name} (ID: ${product.id})`);
                  results.removed++;
                  results.details.push({
                    removed: product.name,
                    kept: bestProduct.name,
                    reason: `Lower score (${product.score} vs ${bestProduct.score})`
                  });
                }
                
                removedCount++;
                if (removedCount === productsToRemove.length) {
                  results.kept++;
                  completed++;
                  if (completed === total) {
                    console.log(`\n✅ Deduplication completed!`);
                    console.log(`  🗑️  Removed: ${results.removed} duplicate products`);
                    console.log(`  ✅ Kept: ${results.kept} best products`);
                    resolve(results);
                  }
                }
              });
            });
          }
        );
      });
    });
  }

  // Calculate product score for deduplication
  calculateProductScore(product) {
    let score = 0;
    
    // Basic information completeness
    if (product.name && product.name.length > 0) score += 10;
    if (product.price && product.price !== 'Contact for pricing') score += 20;
    if (product.image_url && product.image_url.length > 0) score += 15;
    if (product.specifications && product.specifications.length > 0) score += 25;
    
    // Stock and pricing
    if (product.quantity_in_stock > 0) score += 10;
    if (product.selling_price && product.selling_price > 0) score += 15;
    
    // Name quality (prefer more descriptive names)
    if (product.name.includes('Fertilizer') || product.name.includes('Herbicide') || 
        product.name.includes('Fungicide') || product.name.includes('Seed')) score += 5;
    
    return score;
  }

  // Initialize comprehensive inventory for all stores
  async initializeComprehensiveInventory() {
    console.log('\n🚀 INITIALIZING COMPREHENSIVE INVENTORY SYSTEM');
    console.log('=' .repeat(60));
    
    return new Promise((resolve, reject) => {
      // Get all products
      this.db.all('SELECT id, name, category_id FROM products', (err, products) => {
        if (err) {
          reject(err);
          return;
        }
        
        console.log(`📦 Initializing inventory for ${products.length} products across all stores...`);
        
        let completed = 0;
        const total = products.length;
        const results = { initialized: 0, errors: 0 };
        
        products.forEach(product => {
          const stockLevels = this.calculateOptimalStockLevels(product.name, product.category_id);
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
              results.errors++;
            } else {
              results.initialized++;
              if (results.initialized % 50 === 0) {
                console.log(`  ✅ Initialized ${results.initialized}/${total} products...`);
              }
            }
            
            completed++;
            if (completed === total) {
              console.log(`\n🎉 Inventory initialization completed!`);
              console.log(`  ✅ Initialized: ${results.initialized} products`);
              console.log(`  ❌ Errors: ${results.errors} products`);
              resolve(results);
            }
          });
        });
      });
    });
  }

  // Calculate optimal stock levels based on product type and category
  calculateOptimalStockLevels(productName, categoryId) {
    const name = productName.toLowerCase();
    
    // Base levels
    let baseStock = 20;
    let minStock = 5;
    let maxStock = 80;
    let costPrice = 10000;
    let sellingPrice = 15000;
    
    // Category-based adjustments
    switch (categoryId) {
      case 1: // Fertilizers
        baseStock = 40;
        minStock = 10;
        maxStock = 150;
        costPrice = 120000;
        sellingPrice = 160000;
        break;
      case 2: // Fungicides
        baseStock = 25;
        minStock = 8;
        maxStock = 100;
        costPrice = 80000;
        sellingPrice = 120000;
        break;
      case 3: // Herbicides
        baseStock = 30;
        minStock = 8;
        maxStock = 120;
        costPrice = 70000;
        sellingPrice = 110000;
        break;
      case 4: // Nursery Bed
        baseStock = 15;
        minStock = 3;
        maxStock = 50;
        costPrice = 5000;
        sellingPrice = 8000;
        break;
      case 5: // Organic Chemicals
        baseStock = 20;
        minStock = 5;
        maxStock = 60;
        costPrice = 60000;
        sellingPrice = 90000;
        break;
      case 6: // Seeds
        baseStock = 12;
        minStock = 3;
        maxStock = 40;
        costPrice = 3000;
        sellingPrice = 5000;
        break;
    }
    
    // Product-specific adjustments
    if (name.includes('npk') || name.includes('urea')) {
      baseStock += 20;
      costPrice += 50000;
      sellingPrice += 60000;
    } else if (name.includes('yara') || name.includes('premium')) {
      baseStock += 10;
      costPrice += 30000;
      sellingPrice += 40000;
    } else if (name.includes('organic') || name.includes('vermicompost')) {
      baseStock -= 5;
      costPrice -= 10000;
      sellingPrice -= 15000;
    } else if (name.includes('seedling') || name.includes('seed')) {
      baseStock -= 8;
      costPrice -= 2000;
      sellingPrice -= 3000;
    }
    
    // Add randomness
    const current = Math.max(0, Math.floor(baseStock + (Math.random() * 20) - 10));
    const minimum = Math.max(1, Math.floor(minStock + (Math.random() * 5)));
    const maximum = Math.max(maxStock, minimum + 10);
    const cost = Math.max(1000, Math.floor(costPrice + (Math.random() * 20000) - 10000));
    const selling = Math.max(sellingPrice, cost + 5000);
    
    return {
      current: current,
      minimum: minimum,
      maximum: maximum,
      costPrice: cost,
      sellingPrice: selling
    };
  }

  // Create comprehensive alerts system
  async createComprehensiveAlerts() {
    console.log('\n⚠️  CREATING COMPREHENSIVE ALERTS SYSTEM');
    console.log('=' .repeat(60));
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.id, 
          p.name, 
          p.quantity_in_stock, 
          p.minimum_stock_level,
          c.display_name as category
        FROM products p 
        JOIN categories c ON p.category_id = c.id
        WHERE p.quantity_in_stock <= p.minimum_stock_level
        AND p.id NOT IN (
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
          console.log('✅ No new alerts needed');
          resolve({ created: 0 });
          return;
        }
        
        console.log(`Found ${lowStockProducts.length} products needing alerts:`);
        
        let completed = 0;
        const alerts = [];
        
        lowStockProducts.forEach(product => {
          const alertType = product.quantity_in_stock <= 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK';
          const message = product.quantity_in_stock <= 0 
            ? `${product.name} (${product.category}) is out of stock`
            : `${product.name} (${product.category}) stock is below minimum level (${product.quantity_in_stock}/${product.minimum_stock_level})`;
          
          this.db.run(
            'INSERT INTO stock_alerts (product_id, alert_type, message) VALUES (?, ?, ?)',
            [product.id, alertType, message],
            function(err) {
              if (err) {
                console.error(`Error creating alert for ${product.name}:`, err.message);
              } else {
                alerts.push({ product: product.name, category: product.category, type: alertType });
                console.log(`⚠️  ${alertType}: ${product.name} (${product.category})`);
              }
              
              completed++;
              if (completed === lowStockProducts.length) {
                console.log(`\n🎉 Created ${alerts.length} comprehensive stock alerts!`);
                resolve({ created: alerts.length, alerts: alerts });
              }
            }
          );
        });
      });
    });
  }

  // Generate comprehensive reports
  async generateComprehensiveReports() {
    console.log('\n📊 GENERATING COMPREHENSIVE REPORTS');
    console.log('=' .repeat(60));
    
    return new Promise((resolve, reject) => {
      const reports = {};
      
      // Store performance report
      const storeQuery = `
        SELECT 
          c.display_name as store,
          COUNT(p.id) as total_products,
          SUM(p.quantity_in_stock) as total_stock,
          SUM(p.quantity_in_stock * COALESCE(p.selling_price, 0)) as total_value,
          COUNT(CASE WHEN p.quantity_in_stock <= 0 THEN 1 END) as out_of_stock,
          COUNT(CASE WHEN p.quantity_in_stock <= p.minimum_stock_level AND p.quantity_in_stock > 0 THEN 1 END) as low_stock
        FROM categories c 
        LEFT JOIN products p ON c.id = p.category_id 
        GROUP BY c.id, c.display_name
        ORDER BY total_value DESC
      `;
      
      this.db.all(storeQuery, (err, storeReport) => {
        if (err) {
          reject(err);
          return;
        }
        
        reports.storePerformance = storeReport;
        
        // Top products by value
        const topProductsQuery = `
          SELECT 
            p.name,
            p.quantity_in_stock,
            p.selling_price,
            (p.quantity_in_stock * COALESCE(p.selling_price, 0)) as total_value,
            c.display_name as category
          FROM products p
          JOIN categories c ON p.category_id = c.id
          WHERE p.quantity_in_stock > 0
          ORDER BY total_value DESC
          LIMIT 20
        `;
        
        this.db.all(topProductsQuery, (err, topProducts) => {
          if (err) {
            reject(err);
            return;
          }
          
          reports.topProducts = topProducts;
          
          // Critical alerts summary
          const alertsQuery = `
            SELECT 
              alert_type,
              COUNT(*) as count
            FROM stock_alerts 
            WHERE is_resolved = FALSE
            GROUP BY alert_type
            ORDER BY count DESC
          `;
          
          this.db.all(alertsQuery, (err, alertsSummary) => {
            if (err) {
              reject(err);
              return;
            }
            
            reports.alertsSummary = alertsSummary;
            
            this.displayReports(reports);
            resolve(reports);
          });
        });
      });
    });
  }

  displayReports(reports) {
    console.log('\n📈 STORE PERFORMANCE REPORT:');
    console.log('-' .repeat(60));
    reports.storePerformance.forEach(store => {
      console.log(`${store.store.toUpperCase()}:`);
      console.log(`  📦 Products: ${store.total_products}`);
      console.log(`  📊 Stock: ${store.total_stock} units`);
      console.log(`  💰 Value: UGX ${store.total_value.toLocaleString()}`);
      console.log(`  ❌ Out of Stock: ${store.out_of_stock}`);
      console.log(`  ⚠️  Low Stock: ${store.low_stock}`);
      console.log('');
    });

    console.log('\n🏆 TOP PRODUCTS BY VALUE:');
    console.log('-' .repeat(60));
    reports.topProducts.slice(0, 10).forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.category})`);
      console.log(`   💰 Value: UGX ${product.total_value.toLocaleString()}`);
      console.log(`   📦 Stock: ${product.quantity_in_stock} units`);
      console.log('');
    });

    console.log('\n⚠️  CRITICAL ALERTS SUMMARY:');
    console.log('-' .repeat(60));
    reports.alertsSummary.forEach(alert => {
      console.log(`${alert.alert_type}: ${alert.count} products`);
    });
  }

  // Run complete comprehensive management
  async runComprehensiveManagement() {
    console.log('🌱 AGROF COMPREHENSIVE INVENTORY MANAGEMENT SYSTEM');
    console.log('=' .repeat(80));
    console.log('Analyzing entire project structure and managing all stores...\n');
    
    try {
      // Step 1: Analyze entire project
      await this.analyzeEntireProject();
      
      // Step 2: Perform deep deduplication
      const dedupResult = await this.performDeepDeduplication();
      
      // Step 3: Initialize comprehensive inventory
      const inventoryResult = await this.initializeComprehensiveInventory();
      
      // Step 4: Create comprehensive alerts
      const alertsResult = await this.createComprehensiveAlerts();
      
      // Step 5: Generate comprehensive reports
      const reportsResult = await this.generateComprehensiveReports();
      
      console.log('\n' + '=' .repeat(80));
      console.log('🎉 COMPREHENSIVE INVENTORY MANAGEMENT COMPLETED!');
      console.log('\n📊 FINAL SUMMARY:');
      console.log(`  🗑️  Duplicates Removed: ${dedupResult.removed}`);
      console.log(`  ✅ Products Kept: ${dedupResult.kept}`);
      console.log(`  📦 Products Initialized: ${inventoryResult.initialized}`);
      console.log(`  ⚠️  Alerts Created: ${alertsResult.created}`);
      console.log(`  🏪 Stores Managed: ${this.analysis.stores.length}`);
      console.log(`  📦 Total Products: ${this.analysis.stores.reduce((sum, store) => sum + store.product_count, 0)}`);
      
      console.log('\n🌐 Your comprehensive inventory system is now ready!');
      console.log('   Access the dashboard at: http://localhost:3001/inventory');
      
      return {
        analysis: this.analysis,
        deduplication: dedupResult,
        inventory: inventoryResult,
        alerts: alertsResult,
        reports: reportsResult
      };
      
    } catch (error) {
      console.error('❌ Error during comprehensive management:', error.message);
      throw error;
    } finally {
      this.db.close();
    }
  }
}

// Run comprehensive management if this script is executed directly
if (require.main === module) {
  const manager = new ComprehensiveInventoryManager();
  manager.runComprehensiveManagement()
    .then(() => {
      console.log('\n✅ Comprehensive inventory management completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Comprehensive management failed:', error.message);
      process.exit(1);
    });
}

module.exports = ComprehensiveInventoryManager;
