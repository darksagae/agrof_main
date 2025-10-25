const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/app/store.db');

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

console.log('🔄 Setting herbicides to use herbicides.png fallback...\n');

const placeholders = products.map(() => '?').join(',');

db.run(
  `UPDATE products SET image_url = NULL, updated_at = CURRENT_TIMESTAMP WHERE name IN (${placeholders})`,
  products,
  function(err) {
    if (err) {
      console.error('❌ Error:', err.message);
      process.exit(1);
    }
    
    console.log(`✅ Updated ${this.changes} products to use NULL (herbicides.png fallback)`);
    console.log('   These products will now show the herbicides.png icon\n');
    
    db.close();
    process.exit(0);
  }
);
