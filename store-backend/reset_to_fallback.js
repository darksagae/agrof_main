const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'store.db');
const db = new sqlite3.Database(dbPath);

const products = [
  'Alachlor 50% EC Herbicide',
  'Clethodim 24% EC Herbicide',
  'Diuron 80% WP Herbicide',
  'Fenoxaprop 6.9% EC Herbicide',
  'Fluchloralin 45% EC Herbicide',
  'Imazamox 4% SL Herbicide',
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

console.log('🔄 Setting products to use herbicides.png fallback...\n');

let completed = 0;
let updated = 0;

products.forEach((productName) => {
  db.run(
    'UPDATE products SET image_url = NULL, updated_at = CURRENT_TIMESTAMP WHERE name = ?',
    [productName],
    function(err) {
      if (err) {
        console.error(`❌ ${productName}: ${err.message}`);
      } else if (this.changes > 0) {
        console.log(`✅ ${productName} → herbicides.png`);
        updated++;
      }
      
      completed++;
      
      if (completed === products.length) {
        console.log(`\n🎉 Complete! ${updated} products will now use herbicides.png fallback`);
        db.close();
      }
    }
  );
});
