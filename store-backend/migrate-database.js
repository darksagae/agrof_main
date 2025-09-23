#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'store.db');

async function migrateDatabase() {
  console.log('🔄 Migrating database schema for inventory management...\n');
  
  const db = new sqlite3.Database(dbPath);
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Check if columns already exist
      db.get("PRAGMA table_info(products)", (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Get all column names
        db.all("PRAGMA table_info(products)", (err, columns) => {
          if (err) {
            reject(err);
            return;
          }
          
          const columnNames = columns.map(col => col.name);
          console.log('Current columns:', columnNames);
          
          // Add missing columns
          const newColumns = [
            { name: 'quantity_in_stock', type: 'INTEGER DEFAULT 0' },
            { name: 'minimum_stock_level', type: 'INTEGER DEFAULT 10' },
            { name: 'maximum_stock_level', type: 'INTEGER DEFAULT 1000' },
            { name: 'unit_of_measure', type: 'TEXT DEFAULT "bags"' },
            { name: 'barcode', type: 'TEXT UNIQUE' },
            { name: 'supplier_name', type: 'TEXT' },
            { name: 'supplier_contact', type: 'TEXT' },
            { name: 'cost_price', type: 'DECIMAL(10,2)' },
            { name: 'selling_price', type: 'DECIMAL(10,2)' },
            { name: 'last_restocked_date', type: 'DATETIME' },
            { name: 'expiry_date', type: 'DATETIME' },
            { name: 'batch_number', type: 'TEXT' },
            { name: 'location', type: 'TEXT DEFAULT "Warehouse A"' },
            { name: 'updated_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
          ];
          
          let completed = 0;
          const total = newColumns.length;
          
          if (total === 0) {
            console.log('✅ All columns already exist');
            createNewTables();
            return;
          }
          
          newColumns.forEach(column => {
            if (!columnNames.includes(column.name)) {
              const sql = `ALTER TABLE products ADD COLUMN ${column.name} ${column.type}`;
              console.log(`Adding column: ${column.name}`);
              
              db.run(sql, (err) => {
                if (err) {
                  console.error(`Error adding column ${column.name}:`, err.message);
                } else {
                  console.log(`✅ Added column: ${column.name}`);
                }
                
                completed++;
                if (completed === total) {
                  createNewTables();
                }
              });
            } else {
              console.log(`⏭️  Column ${column.name} already exists`);
              completed++;
              if (completed === total) {
                createNewTables();
              }
            }
          });
        });
      });
      
      function createNewTables() {
        // Create inventory transactions table
        db.run(`
          CREATE TABLE IF NOT EXISTS inventory_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            transaction_type TEXT NOT NULL CHECK (transaction_type IN ('IN', 'OUT', 'ADJUSTMENT', 'TRANSFER')),
            quantity INTEGER NOT NULL,
            reference_number TEXT,
            notes TEXT,
            created_by TEXT DEFAULT 'system',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id)
          )
        `, (err) => {
          if (err) {
            console.error('Error creating inventory_transactions table:', err.message);
          } else {
            console.log('✅ Created inventory_transactions table');
          }
        });

        // Create stock alerts table
        db.run(`
          CREATE TABLE IF NOT EXISTS stock_alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            alert_type TEXT NOT NULL CHECK (alert_type IN ('LOW_STOCK', 'OUT_OF_STOCK', 'EXPIRY_WARNING')),
            message TEXT NOT NULL,
            is_resolved BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            resolved_at DATETIME,
            FOREIGN KEY (product_id) REFERENCES products (id)
          )
        `, (err) => {
          if (err) {
            console.error('Error creating stock_alerts table:', err.message);
          } else {
            console.log('✅ Created stock_alerts table');
          }
        });

        // Create suppliers table
        db.run(`
          CREATE TABLE IF NOT EXISTS suppliers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            contact_person TEXT,
            phone TEXT,
            email TEXT,
            address TEXT,
            payment_terms TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            console.error('Error creating suppliers table:', err.message);
          } else {
            console.log('✅ Created suppliers table');
          }
          
          console.log('\n🎉 Database migration completed successfully!');
          db.close();
          resolve();
        });
      }
    });
  });
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateDatabase()
    .then(() => {
      console.log('\n✅ Database migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database migration failed:', error.message);
      process.exit(1);
    });
}

module.exports = { migrateDatabase };
