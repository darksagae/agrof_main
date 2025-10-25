const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'store.db');
const db = new sqlite3.Database(dbPath);

const productsToFix = [
  'Alachlor 50% EC Herbicide',
  'Clethodim 24% EC Herbicide',
  'Diuron 80% WP Herbicide',
  'Fenoxaprop 6.9% EC Herbicide',
  'Fluchloralin 45% EC Herbicide',
  'Imazapic 24% SL Herbicide',
  'Imazapyr 25% SL Herbicide',
  'Imazethapyr 10% SL Herbicide',
  'Metolachlor 50% EC Herbicide',
  'Oxyfluorfen 24% EC Herbicide',
  'Paraquat 20% SL Herbicide',
  'Pendimethalin 30% EC Herbicide',
  'Propanil 40% EC Herbicide',
  'Quizalofop 5% EC Herbicide',
  'Sethoxydim 12.5% EC Herbicide',
  'Trifluralin 48% EC Herbicide'
];

console.log('🔧 Fixing herbicide images...\n');

// Update products to use NULL image (will show category fallback)
const placeholders = productsToFix.map(() => '?').join(',');
const sql = `UPDATE products 
  SET image_url = NULL, updated_at = CURRENT_TIMESTAMP
  WHERE name IN (${placeholders})
  AND image_url LIKE '%excel-glycel-herbicide-500x500.jpg%'`;

db.run(sql, productsToFix, function(err) {
  if (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
  
  console.log(`✅ Updated ${this.changes} products`);
  console.log('   These products will now show the herbicide category image\n');
  
  // Verify the changes
  db.all(`SELECT name, image_url FROM products WHERE name IN (${placeholders})`, 
    productsToFix, 
    (err, rows) => {
      if (err) {
        console.error('Error:', err.message);
      } else {
        console.log('📋 Verification:');
        rows.forEach(row => {
          console.log(`   ${row.name}: ${row.image_url || 'NULL (will use fallback)'}`);
        });
      }
      db.close();
    }
  );
});
