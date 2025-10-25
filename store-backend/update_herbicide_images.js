const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'store.db');
const db = new sqlite3.Database(dbPath);

const products = [
  { name: 'Alachlor 50% EC Herbicide', folder: 'Alachlor 50% EC' },
  { name: 'Clethodim 24% EC Herbicide', folder: 'Clethodim 24% EC' },
  { name: 'Diuron 80% WP Herbicide', folder: 'Diuron 80% WP' },
  { name: 'Fenoxaprop 6.9% EC Herbicide', folder: 'Fenoxaprop 6.9% EC' },
  { name: 'Fluchloralin 45% EC Herbicide', folder: 'Fluchloralin 45% EC' },
  { name: 'Imazamox 4% SL Herbicide', folder: 'Imazamox 4% SL' },
  { name: 'Imazapic 24% SL Herbicide', folder: 'Imazapic 24% SL' },
  { name: 'Imazapyr 25% SL Herbicide', folder: 'Imazapyr 25% SL' },
  { name: 'Imazethapyr 10% SL Herbicide', folder: 'Imazethapyr 10% SL' },
  { name: 'Metolachlor 50% EC Herbicide', folder: 'Metolachlor 50% EC' },
  { name: 'Oxyfluorfen 24% EC Herbicide', folder: 'Oxyfluorfen 24% EC' },
  { name: 'Paraquat 20% SL Herbicide', folder: 'Paraquat 20% SL' },
  { name: 'Pendimethalin 30% EC Herbicide', folder: 'Pendimethalin 30% EC' },
  { name: 'Propanil 40% EC Herbicide', folder: 'Propanil 40% EC' },
  { name: 'Quizalofop 5% EC Herbicide', folder: 'Quizalofop 5% EC' },
  { name: 'Sethoxydim 12.5% EC Herbicide', folder: 'Sethoxydim 12.5% EC' },
  { name: 'Trifluralin 48% EC Herbicide', folder: 'Trifluralin 48% EC' }
];

console.log('🔧 Updating database with product images...\n');

let completed = 0;
let updated = 0;

products.forEach((product, index) => {
  const imageUrl = `/api/images/HERBICIDE/${product.folder}/product-image.jpg`;
  
  db.run(
    'UPDATE products SET image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE name = ?',
    [imageUrl, product.name],
    function(err) {
      if (err) {
        console.error(`❌ ${product.name}: ${err.message}`);
      } else if (this.changes > 0) {
        console.log(`✅ ${product.name}`);
        updated++;
      } else {
        console.log(`⚠️ ${product.name}: No rows updated (product might not exist)`);
      }
      
      completed++;
      
      if (completed === products.length) {
        console.log(`\n🎉 Update complete! ${updated} products updated with images`);
        db.close();
      }
    }
  );
});
