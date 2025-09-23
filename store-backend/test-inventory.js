#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'store.db');

async function testInventorySystem() {
  console.log('🧪 Testing AGROF Inventory Management System...\n');
  
  const db = new sqlite3.Database(dbPath);
  
  try {
    // Test 1: Check if new columns exist
    console.log('1️⃣ Testing database schema...');
    const columns = await new Promise((resolve, reject) => {
      db.all("PRAGMA table_info(products)", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    const requiredColumns = ['quantity_in_stock', 'minimum_stock_level', 'maximum_stock_level', 'barcode'];
    const existingColumns = columns.map(col => col.name);
    
    console.log('Required columns:', requiredColumns);
    console.log('Existing columns:', existingColumns);
    
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    if (missingColumns.length > 0) {
      console.log('❌ Missing columns:', missingColumns);
    } else {
      console.log('✅ All required columns exist');
    }
    
    // Test 2: Check product count
    console.log('\n2️⃣ Testing product data...');
    const productCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
    console.log(`✅ Found ${productCount} products in database`);
    
    // Test 3: Check if inventory tables exist
    console.log('\n3️⃣ Testing inventory tables...');
    const tables = await new Promise((resolve, reject) => {
      db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => row.name));
      });
    });
    
    const requiredTables = ['inventory_transactions', 'stock_alerts', 'suppliers'];
    const missingTables = requiredTables.filter(table => !tables.includes(table));
    
    if (missingTables.length > 0) {
      console.log('❌ Missing tables:', missingTables);
    } else {
      console.log('✅ All required tables exist');
    }
    
    // Test 4: Sample some products with new fields
    console.log('\n4️⃣ Testing product data with new fields...');
    const sampleProducts = await new Promise((resolve, reject) => {
      db.all('SELECT id, name, quantity_in_stock, minimum_stock_level, barcode FROM products LIMIT 5', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    console.log('Sample products:');
    sampleProducts.forEach(product => {
      console.log(`  - ${product.name}: Stock=${product.quantity_in_stock}, Min=${product.minimum_stock_level}, Barcode=${product.barcode || 'None'}`);
    });
    
    // Test 5: Test API endpoints (if server is running)
    console.log('\n5️⃣ Testing API endpoints...');
    try {
      const response = await fetch('http://localhost:3001/api/inventory/analytics');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API endpoints working');
        console.log(`  - Total products: ${data.totalProducts}`);
        console.log(`  - Out of stock: ${data.outOfStock}`);
        console.log(`  - Low stock: ${data.lowStock}`);
      } else {
        console.log('⚠️  API endpoints not accessible (server may not be running)');
      }
    } catch (error) {
      console.log('⚠️  API endpoints not accessible (server may not be running)');
    }
    
    console.log('\n🎉 Inventory system test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    db.close();
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testInventorySystem();
}

module.exports = { testInventorySystem };
