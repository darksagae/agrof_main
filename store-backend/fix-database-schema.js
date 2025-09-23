#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'store.db');

class DatabaseSchemaFixer {
  constructor() {
    this.db = new sqlite3.Database(dbPath);
  }

  async fixDatabaseSchema() {
    console.log('🔧 FIXING DATABASE SCHEMA');
    console.log('=' .repeat(50));
    
    return new Promise((resolve, reject) => {
      // Check if updated_at column exists
      this.db.all("PRAGMA table_info(products)", (err, columns) => {
        if (err) {
          reject(err);
          return;
        }
        
        const hasUpdatedAt = columns.some(col => col.name === 'updated_at');
        
        if (hasUpdatedAt) {
          console.log('✅ updated_at column already exists');
          resolve({ message: 'Schema already up to date', fixed: false });
          return;
        }
        
        console.log('❌ updated_at column missing, adding it...');
        
        // Add updated_at column without default constraint (SQLite limitation)
        this.db.run('ALTER TABLE products ADD COLUMN updated_at DATETIME', (err) => {
          if (err) {
            console.error('Error adding updated_at column:', err.message);
            reject(err);
            return;
          }
          
          console.log('✅ Added updated_at column');
          
          // Update all existing records to have current timestamp
          this.db.run("UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL", (err) => {
            if (err) {
              console.error('Error updating existing records:', err.message);
              reject(err);
              return;
            }
            
            console.log('✅ Updated existing records with current timestamp');
            
            // Check if barcode column exists
            this.db.all("PRAGMA table_info(products)", (err, columns) => {
              if (err) {
                reject(err);
                return;
              }
              
              const hasBarcode = columns.some(col => col.name === 'barcode');
              
              if (hasBarcode) {
                console.log('✅ barcode column already exists');
              } else {
                console.log('❌ barcode column missing, adding it...');
                
                this.db.run('ALTER TABLE products ADD COLUMN barcode TEXT', (err) => {
                  if (err) {
                    console.error('Error adding barcode column:', err.message);
                    reject(err);
                    return;
                  }
                  
                  console.log('✅ Added barcode column');
                });
              }
              
              // Check if all inventory columns exist
              const requiredColumns = [
                'quantity_in_stock',
                'minimum_stock_level', 
                'maximum_stock_level',
                'unit_of_measure',
                'supplier_name',
                'supplier_contact',
                'cost_price',
                'selling_price',
                'last_restocked_date',
                'expiry_date',
                'batch_number',
                'location'
              ];
              
              const existingColumns = columns.map(col => col.name);
              const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
              
              if (missingColumns.length === 0) {
                console.log('✅ All inventory columns exist');
                resolve({ message: 'Schema fixed successfully', fixed: true });
                return;
              }
              
              console.log(`❌ Missing columns: ${missingColumns.join(', ')}`);
              console.log('Adding missing inventory columns...');
              
              let completed = 0;
              const total = missingColumns.length;
              
              missingColumns.forEach(column => {
                let columnDef;
                
                switch (column) {
                  case 'quantity_in_stock':
                    columnDef = 'INTEGER DEFAULT 0';
                    break;
                  case 'minimum_stock_level':
                    columnDef = 'INTEGER DEFAULT 10';
                    break;
                  case 'maximum_stock_level':
                    columnDef = 'INTEGER DEFAULT 1000';
                    break;
                  case 'unit_of_measure':
                    columnDef = "TEXT DEFAULT 'bags'";
                    break;
                  case 'supplier_name':
                    columnDef = 'TEXT';
                    break;
                  case 'supplier_contact':
                    columnDef = 'TEXT';
                    break;
                  case 'cost_price':
                    columnDef = 'DECIMAL(10,2)';
                    break;
                  case 'selling_price':
                    columnDef = 'DECIMAL(10,2)';
                    break;
                  case 'last_restocked_date':
                    columnDef = 'DATETIME';
                    break;
                  case 'expiry_date':
                    columnDef = 'DATETIME';
                    break;
                  case 'batch_number':
                    columnDef = 'TEXT';
                    break;
                  case 'location':
                    columnDef = "TEXT DEFAULT 'Warehouse A'";
                    break;
                  default:
                    columnDef = 'TEXT';
                }
                
                this.db.run(`ALTER TABLE products ADD COLUMN ${column} ${columnDef}`, (err) => {
                  if (err) {
                    console.error(`Error adding ${column} column:`, err.message);
                  } else {
                    console.log(`✅ Added ${column} column`);
                  }
                  
                  completed++;
                  if (completed === total) {
                    console.log('\n🎉 Database schema fixed successfully!');
                    resolve({ message: 'Schema fixed successfully', fixed: true });
                  }
                });
              });
            });
          });
        });
      });
    });
  }

  async verifySchema() {
    console.log('\n🔍 VERIFYING DATABASE SCHEMA');
    console.log('-' .repeat(50));
    
    return new Promise((resolve, reject) => {
      this.db.all("PRAGMA table_info(products)", (err, columns) => {
        if (err) {
          reject(err);
          return;
        }
        
        console.log('📋 Current products table schema:');
        columns.forEach(col => {
          console.log(`  - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
        });
        
        // Check for required tables
        this.db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
          if (err) {
            reject(err);
            return;
          }
          
          console.log('\n📋 Available tables:');
          tables.forEach(table => {
            console.log(`  - ${table.name}`);
          });
          
          const requiredTables = ['products', 'categories', 'inventory_transactions', 'stock_alerts', 'suppliers'];
          const missingTables = requiredTables.filter(table => !tables.some(t => t.name === table));
          
          if (missingTables.length === 0) {
            console.log('\n✅ All required tables exist');
          } else {
            console.log(`\n❌ Missing tables: ${missingTables.join(', ')}`);
          }
          
          resolve({ columns, tables, missingTables });
        });
      });
    });
  }

  async runSchemaFix() {
    console.log('🔧 AGROF DATABASE SCHEMA FIXER');
    console.log('=' .repeat(60));
    
    try {
      // Step 1: Fix schema
      const fixResult = await this.fixDatabaseSchema();
      
      // Step 2: Verify schema
      const verifyResult = await this.verifySchema();
      
      console.log('\n' + '=' .repeat(60));
      console.log('🎉 DATABASE SCHEMA FIX COMPLETED!');
      console.log(`\n📊 Results:`);
      console.log(`  🔧 Schema Fixed: ${fixResult.fixed ? 'Yes' : 'No'}`);
      console.log(`  📋 Columns: ${verifyResult.columns.length}`);
      console.log(`  📋 Tables: ${verifyResult.tables.length}`);
      console.log(`  ❌ Missing Tables: ${verifyResult.missingTables.length}`);
      
      return {
        fix: fixResult,
        verification: verifyResult
      };
      
    } catch (error) {
      console.error('❌ Error during schema fix:', error.message);
      throw error;
    } finally {
      this.db.close();
    }
  }
}

// Run schema fix if this script is executed directly
if (require.main === module) {
  const fixer = new DatabaseSchemaFixer();
  fixer.runSchemaFix()
    .then(() => {
      console.log('\n✅ Database schema fix completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Schema fix failed:', error.message);
      process.exit(1);
    });
}

module.exports = DatabaseSchemaFixer;
