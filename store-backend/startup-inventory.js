#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const InventoryAutomation = require('./inventory-automation');
const InventoryReports = require('./inventory-reports');
const path = require('path');

const dbPath = path.join(__dirname, 'store.db');

async function initializeInventorySystem() {
  console.log('🚀 Initializing AGROF Inventory Management System...\n');
  
  try {
    // Initialize database connection
    const db = new sqlite3.Database(dbPath);
    
    // Check if products exist
    const productCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
    
    console.log(`📦 Found ${productCount} products in database`);
    
    if (productCount === 0) {
      console.log('⚠️  No products found. Please run the main server first to populate the database.');
      db.close();
      return;
    }
    
    // Initialize inventory automation
    const automation = new InventoryAutomation(dbPath);
    
    // Initialize stock levels for existing products
    console.log('\n🔧 Initializing stock levels...');
    const stockResult = await automation.initializeStockLevels();
    console.log(`✅ ${stockResult.message}`);
    
    // Generate barcodes for products without them
    console.log('\n🏷️  Generating barcodes...');
    const barcodeResult = await automation.bulkAssignBarcodes();
    console.log(`✅ ${barcodeResult.message}`);
    
    // Run initial daily tasks
    console.log('\n🤖 Running initial automation tasks...');
    const dailyResult = await automation.runDailyTasks();
    console.log(`✅ Daily tasks completed:`);
    console.log(`   - ${dailyResult.lowStock.message}`);
    console.log(`   - ${dailyResult.reorder.message}`);
    console.log(`   - ${dailyResult.sales.message}`);
    
    automation.close();
    
    // Generate initial reports
    console.log('\n📊 Generating initial reports...');
    const reports = new InventoryReports(dbPath);
    
    const inventoryReport = await reports.generateInventoryReport();
    console.log(`✅ Inventory Report Generated:`);
    console.log(`   - Total Products: ${inventoryReport.summary.totalProducts}`);
    console.log(`   - Total Value: UGX ${inventoryReport.summary.totalValue.toLocaleString()}`);
    console.log(`   - Out of Stock: ${inventoryReport.summary.outOfStock}`);
    console.log(`   - Low Stock: ${inventoryReport.summary.lowStock}`);
    
    const reorderReport = await reports.generateReorderReport();
    console.log(`✅ Reorder Report Generated:`);
    console.log(`   - Items needing reorder: ${reorderReport.totalItems}`);
    console.log(`   - Urgent items: ${reorderReport.urgentItems}`);
    console.log(`   - Total reorder cost: UGX ${reorderReport.totalCost.toLocaleString()}`);
    
    reports.close();
    
    console.log('\n🎉 Inventory Management System initialized successfully!');
    console.log('\n📋 Available Features:');
    console.log('   - Real-time inventory tracking');
    console.log('   - Automated low stock alerts');
    console.log('   - Barcode scanning support');
    console.log('   - Comprehensive reporting');
    console.log('   - Reorder suggestions');
    console.log('   - Sales analysis');
    console.log('   - CSV export functionality');
    
    console.log('\n🌐 Access the inventory dashboard at: http://localhost:3001/inventory');
    console.log('\n📚 API Endpoints:');
    console.log('   - GET  /api/inventory/status - View all inventory');
    console.log('   - GET  /api/inventory/alerts - View stock alerts');
    console.log('   - POST /api/inventory/update-stock - Update product stock');
    console.log('   - GET  /api/inventory/analytics - View analytics');
    console.log('   - GET  /api/inventory/reports/comprehensive - Full report');
    console.log('   - GET  /api/inventory/reports/reorder - Reorder suggestions');
    console.log('   - POST /api/inventory/run-daily-tasks - Run automation');
    
  } catch (error) {
    console.error('❌ Error initializing inventory system:', error.message);
    process.exit(1);
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeInventorySystem();
}

module.exports = { initializeInventorySystem };
