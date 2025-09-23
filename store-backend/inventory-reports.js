const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class InventoryReports {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath);
  }

  // Generate comprehensive inventory report
  async generateInventoryReport() {
    return new Promise((resolve, reject) => {
      const report = {
        generatedAt: new Date().toISOString(),
        summary: {},
        categories: [],
        lowStockItems: [],
        outOfStockItems: [],
        topProducts: [],
        recentTransactions: [],
        recommendations: []
      };

      // Get summary statistics
      const summaryQueries = {
        totalProducts: 'SELECT COUNT(*) as count FROM products',
        totalValue: 'SELECT SUM(quantity_in_stock * COALESCE(selling_price, 0)) as value FROM products',
        outOfStock: 'SELECT COUNT(*) as count FROM products WHERE quantity_in_stock <= 0',
        lowStock: 'SELECT COUNT(*) as count FROM products WHERE quantity_in_stock > 0 AND quantity_in_stock <= minimum_stock_level',
        totalTransactions: 'SELECT COUNT(*) as count FROM inventory_transactions',
        activeAlerts: 'SELECT COUNT(*) as count FROM stock_alerts WHERE is_resolved = FALSE'
      };

      let completed = 0;
      const total = Object.keys(summaryQueries).length;

      Object.entries(summaryQueries).forEach(([key, query]) => {
        this.db.get(query, (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          report.summary[key] = row.count || row.value || 0;
          completed++;
          
          if (completed === total) {
            this.generateDetailedReport(report).then(resolve).catch(reject);
          }
        });
      });
    });
  }

  async generateDetailedReport(report) {
    return new Promise((resolve, reject) => {
      let completed = 0;
      const total = 5;

      // Get category breakdown
      this.db.all(`
        SELECT 
          c.display_name as category,
          COUNT(p.id) as product_count,
          SUM(p.quantity_in_stock) as total_stock,
          SUM(p.quantity_in_stock * COALESCE(p.selling_price, 0)) as category_value
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        GROUP BY c.id, c.display_name
        ORDER BY category_value DESC
      `, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        report.categories = rows;
        completed++;
        if (completed === total) resolve(report);
      });

      // Get low stock items
      this.db.all(`
        SELECT 
          p.name,
          p.quantity_in_stock,
          p.minimum_stock_level,
          p.selling_price,
          c.display_name as category
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.quantity_in_stock > 0 AND p.quantity_in_stock <= p.minimum_stock_level
        ORDER BY p.quantity_in_stock ASC
      `, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        report.lowStockItems = rows;
        completed++;
        if (completed === total) resolve(report);
      });

      // Get out of stock items
      this.db.all(`
        SELECT 
          p.name,
          p.minimum_stock_level,
          p.selling_price,
          c.display_name as category
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.quantity_in_stock <= 0
        ORDER BY p.name
      `, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        report.outOfStockItems = rows;
        completed++;
        if (completed === total) resolve(report);
      });

      // Get top products by value
      this.db.all(`
        SELECT 
          p.name,
          p.quantity_in_stock,
          p.selling_price,
          (p.quantity_in_stock * COALESCE(p.selling_price, 0)) as total_value,
          c.display_name as category
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.quantity_in_stock > 0
        ORDER BY total_value DESC
        LIMIT 10
      `, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        report.topProducts = rows;
        completed++;
        if (completed === total) resolve(report);
      });

      // Get recent transactions
      this.db.all(`
        SELECT 
          it.*,
          p.name as product_name,
          c.display_name as category
        FROM inventory_transactions it
        JOIN products p ON it.product_id = p.id
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY it.created_at DESC
        LIMIT 20
      `, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        report.recentTransactions = rows;
        completed++;
        if (completed === total) resolve(report);
      });
    });
  }

  // Generate reorder report
  async generateReorderReport() {
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
          p.selling_price,
          c.display_name as category,
          (p.maximum_stock_level - p.quantity_in_stock) as reorder_quantity,
          (p.maximum_stock_level - p.quantity_in_stock) * p.cost_price as reorder_cost,
          CASE 
            WHEN p.quantity_in_stock <= 0 THEN 'URGENT'
            WHEN p.quantity_in_stock <= p.minimum_stock_level THEN 'HIGH'
            ELSE 'MEDIUM'
          END as priority
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.quantity_in_stock <= p.minimum_stock_level
        ORDER BY 
          CASE 
            WHEN p.quantity_in_stock <= 0 THEN 1
            WHEN p.quantity_in_stock <= p.minimum_stock_level THEN 2
            ELSE 3
          END,
          p.quantity_in_stock ASC
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        const totalCost = rows.reduce((sum, item) => sum + (item.reorder_cost || 0), 0);
        const urgentItems = rows.filter(item => item.priority === 'URGENT').length;
        const highPriorityItems = rows.filter(item => item.priority === 'HIGH').length;

        resolve({
          generatedAt: new Date().toISOString(),
          totalItems: rows.length,
          urgentItems,
          highPriorityItems,
          totalCost,
          items: rows
        });
      });
    });
  }

  // Generate sales analysis report
  async generateSalesAnalysis(days = 30) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.name,
          p.selling_price,
          c.display_name as category,
          SUM(CASE WHEN it.transaction_type = 'OUT' THEN it.quantity ELSE 0 END) as total_sold,
          SUM(CASE WHEN it.transaction_type = 'OUT' THEN it.quantity * p.selling_price ELSE 0 END) as total_revenue,
          COUNT(CASE WHEN it.transaction_type = 'OUT' THEN 1 END) as transaction_count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN inventory_transactions it ON p.id = it.product_id 
          AND it.transaction_type = 'OUT' 
          AND it.created_at >= datetime('now', '-${days} days')
        GROUP BY p.id, p.name, p.selling_price, c.display_name
        HAVING total_sold > 0
        ORDER BY total_revenue DESC
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        const totalRevenue = rows.reduce((sum, item) => sum + (item.total_revenue || 0), 0);
        const totalUnitsSold = rows.reduce((sum, item) => sum + (item.total_sold || 0), 0);

        resolve({
          generatedAt: new Date().toISOString(),
          period: `${days} days`,
          totalRevenue,
          totalUnitsSold,
          topSellingProducts: rows.slice(0, 10),
          allProducts: rows
        });
      });
    });
  }

  // Generate supplier performance report
  async generateSupplierReport() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.supplier_name,
          COUNT(p.id) as product_count,
          SUM(p.quantity_in_stock) as total_stock,
          SUM(p.quantity_in_stock * p.cost_price) as total_inventory_value,
          AVG(p.cost_price) as avg_cost_price,
          COUNT(CASE WHEN p.quantity_in_stock <= p.minimum_stock_level THEN 1 END) as low_stock_count
        FROM products p
        WHERE p.supplier_name IS NOT NULL AND p.supplier_name != ''
        GROUP BY p.supplier_name
        ORDER BY total_inventory_value DESC
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve({
          generatedAt: new Date().toISOString(),
          suppliers: rows,
          totalSuppliers: rows.length
        });
      });
    });
  }

  // Export report to CSV format
  exportToCSV(data, filename) {
    const fs = require('fs');
    const path = require('path');
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No data to export');
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const filePath = path.join(__dirname, 'reports', `${filename}.csv`);
    
    // Ensure reports directory exists
    const reportsDir = path.dirname(filePath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    fs.writeFileSync(filePath, csvContent);
    return filePath;
  }

  close() {
    this.db.close();
  }
}

module.exports = InventoryReports;
