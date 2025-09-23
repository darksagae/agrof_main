const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class InventoryAutomation {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath);
  }

  // Initialize stock levels for existing products
  async initializeStockLevels() {
    return new Promise((resolve, reject) => {
      console.log('Initializing stock levels for existing products...');
      
      // Set random stock levels for demonstration
      this.db.all('SELECT id, name FROM products', (err, products) => {
        if (err) {
          reject(err);
          return;
        }

        let completed = 0;
        const total = products.length;

        if (total === 0) {
          resolve({ message: 'No products to initialize', count: 0 });
          return;
        }

        products.forEach(product => {
          // Set random stock levels based on product type
          const minStock = Math.floor(Math.random() * 20) + 5; // 5-25
          const maxStock = Math.floor(Math.random() * 100) + 50; // 50-150
          const currentStock = Math.floor(Math.random() * (maxStock - minStock)) + minStock;
          const costPrice = Math.floor(Math.random() * 50000) + 10000; // 10,000 - 60,000 UGX
          const sellingPrice = Math.floor(costPrice * (1.2 + Math.random() * 0.3)); // 20-50% markup

          this.db.run(`
            UPDATE products SET 
              quantity_in_stock = ?,
              minimum_stock_level = ?,
              maximum_stock_level = ?,
              cost_price = ?,
              selling_price = ?,
              last_restocked_date = datetime('now', '-' || ? || ' days'),
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, [
            currentStock,
            minStock,
            maxStock,
            costPrice,
            sellingPrice,
            Math.floor(Math.random() * 30), // Last restocked 0-30 days ago
            product.id
          ], function(err) {
            if (err) {
              console.error(`Error updating product ${product.name}:`, err);
            } else {
              console.log(`✓ Initialized stock for ${product.name}: ${currentStock} units`);
            }
            
            completed++;
            if (completed === total) {
              resolve({ 
                message: `Initialized stock levels for ${total} products`, 
                count: total 
              });
            }
          });
        });
      });
    });
  }

  // Check for low stock and create alerts
  async checkLowStock() {
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

      this.db.all(query, (err, products) => {
        if (err) {
          reject(err);
          return;
        }

        if (products.length === 0) {
          resolve({ message: 'No low stock alerts needed', count: 0 });
          return;
        }

        let completed = 0;
        const alerts = [];

        products.forEach(product => {
          const alertType = product.quantity_in_stock <= 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK';
          const message = product.quantity_in_stock <= 0 
            ? `${product.name} is out of stock`
            : `${product.name} stock is below minimum level (${product.quantity_in_stock}/${product.minimum_stock_level})`;

          this.db.run(
            'INSERT INTO stock_alerts (product_id, alert_type, message) VALUES (?, ?, ?)',
            [product.id, alertType, message],
            function(err) {
              if (err) {
                console.error(`Error creating alert for ${product.name}:`, err);
              } else {
                alerts.push({ productId: product.id, alertType, message });
                console.log(`⚠️ Created ${alertType} alert for ${product.name}`);
              }
              
              completed++;
              if (completed === products.length) {
                resolve({ 
                  message: `Created ${alerts.length} stock alerts`, 
                  count: alerts.length,
                  alerts 
                });
              }
            }
          );
        });
      });
    });
  }

  // Generate reorder suggestions
  async generateReorderSuggestions() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.id,
          p.name,
          p.quantity_in_stock,
          p.minimum_stock_level,
          p.maximum_stock_level,
          p.supplier_name,
          p.cost_price,
          (p.maximum_stock_level - p.quantity_in_stock) as reorder_quantity,
          (p.maximum_stock_level - p.quantity_in_stock) * p.cost_price as reorder_value
        FROM products p
        WHERE p.quantity_in_stock <= p.minimum_stock_level
        ORDER BY p.quantity_in_stock ASC
      `;

      this.db.all(query, (err, suggestions) => {
        if (err) {
          reject(err);
          return;
        }

        const totalValue = suggestions.reduce((sum, item) => sum + (item.reorder_value || 0), 0);
        
        resolve({
          message: `Generated ${suggestions.length} reorder suggestions`,
          count: suggestions.length,
          totalValue: totalValue,
          suggestions: suggestions
        });
      });
    });
  }

  // Simulate daily sales (for testing)
  async simulateDailySales() {
    return new Promise((resolve, reject) => {
      // Get products with stock
      this.db.all('SELECT id, name, quantity_in_stock FROM products WHERE quantity_in_stock > 0', (err, products) => {
        if (err) {
          reject(err);
          return;
        }

        if (products.length === 0) {
          resolve({ message: 'No products available for sale simulation', count: 0 });
          return;
        }

        // Simulate 5-15 random sales
        const numSales = Math.floor(Math.random() * 11) + 5;
        let completed = 0;
        const sales = [];

        for (let i = 0; i < numSales; i++) {
          const product = products[Math.floor(Math.random() * products.length)];
          const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 units per sale
          
          if (product.quantity_in_stock >= quantity) {
            // Update stock
            this.db.run(
              'UPDATE products SET quantity_in_stock = quantity_in_stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
              [quantity, product.id],
              function(err) {
                if (err) {
                  console.error(`Error updating stock for ${product.name}:`, err);
                } else {
                  // Record transaction
                  this.db.run(
                    'INSERT INTO inventory_transactions (product_id, transaction_type, quantity, notes) VALUES (?, ?, ?, ?)',
                    [product.id, 'OUT', quantity, 'Simulated daily sale'],
                    function(err) {
                      if (err) {
                        console.error(`Error recording transaction for ${product.name}:`, err);
                      } else {
                        sales.push({ productId: product.id, productName: product.name, quantity });
                        console.log(`💰 Simulated sale: ${quantity} units of ${product.name}`);
                      }
                      
                      completed++;
                      if (completed === numSales) {
                        resolve({ 
                          message: `Simulated ${sales.length} sales`, 
                          count: sales.length,
                          sales 
                        });
                      }
                    }
                  );
                }
              }.bind(this)
            );
          } else {
            completed++;
            if (completed === numSales) {
              resolve({ 
                message: `Simulated ${sales.length} sales`, 
                count: sales.length,
                sales 
              });
            }
          }
        }
      });
    });
  }

  // Run daily automation tasks
  async runDailyTasks() {
    console.log('🤖 Running daily inventory automation tasks...');
    
    try {
      // Check for low stock
      const lowStockResult = await this.checkLowStock();
      console.log(`📊 ${lowStockResult.message}`);

      // Generate reorder suggestions
      const reorderResult = await this.generateReorderSuggestions();
      console.log(`📋 ${reorderResult.message}`);
      if (reorderResult.count > 0) {
        console.log(`💰 Total reorder value: UGX ${reorderResult.totalValue.toLocaleString()}`);
      }

      // Simulate daily sales (for testing)
      const salesResult = await this.simulateDailySales();
      console.log(`🛒 ${salesResult.message}`);

      return {
        lowStock: lowStockResult,
        reorder: reorderResult,
        sales: salesResult
      };
    } catch (error) {
      console.error('Error running daily tasks:', error);
      throw error;
    }
  }

  // Bulk assign barcodes to products without them
  async bulkAssignBarcodes() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT id FROM products WHERE barcode IS NULL', (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        if (rows.length === 0) {
          resolve({ message: 'All products already have barcodes', count: 0 });
          return;
        }

        let completed = 0;
        const results = [];

        rows.forEach(row => {
          const barcode = `AGROF${row.id.toString().padStart(4, '0')}${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
          
          this.db.run('UPDATE products SET barcode = ? WHERE id = ?', [barcode, row.id], function(err) {
            if (err) {
              console.error(`Error assigning barcode to product ${row.id}:`, err);
            } else {
              results.push({ productId: row.id, barcode });
              console.log(`✓ Assigned barcode ${barcode} to product ${row.id}`);
            }
            
            completed++;
            if (completed === rows.length) {
              resolve({ 
                message: `Generated ${results.length} barcodes`, 
                count: results.length,
                results 
              });
            }
          });
        });
      });
    });
  }

  // Close database connection
  close() {
    this.db.close();
  }
}

module.exports = InventoryAutomation;
