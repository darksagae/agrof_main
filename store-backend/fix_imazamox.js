const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'store.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Fixing Imazamox image...\n');

db.run(
  `UPDATE products 
   SET image_url = NULL, updated_at = CURRENT_TIMESTAMP
   WHERE name = 'Imazamox 4% SL Herbicide'
   AND image_url LIKE '%excel-glycel-herbicide-500x500.jpg%'`,
  function(err) {
    if (err) {
      console.error('❌ Error:', err.message);
      process.exit(1);
    }
    
    console.log(`✅ Updated ${this.changes} product`);
    
    db.get(
      `SELECT name, image_url FROM products WHERE name = 'Imazamox 4% SL Herbicide'`,
      (err, row) => {
        if (err) {
          console.error('Error:', err.message);
        } else {
          console.log(`✓ ${row.name}: ${row.image_url || 'NULL (will use fallback)'}`);
        }
        db.close();
      }
    );
  }
);
