const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/app/store.db');

console.log('🔍 Searching for organic chemical products in database...\n');

// Search for products with "organic" in the name
db.all(
  "SELECT id, name, category_id, image_url FROM products WHERE name LIKE '%organic%' OR name LIKE '%Organic%' OR name LIKE '%Fertiplus%' OR name LIKE '%Humate%' OR name LIKE '%Vermicompost%'",
  (err, rows) => {
    if (err) {
      console.error('Error:', err);
      db.close();
      return;
    }
    
    console.log(`Found ${rows.length} products with organic-related names:\n`);
    
    if (rows.length === 0) {
      console.log('No organic chemical products found in database.');
      console.log('Need to create them from scratch.\n');
    } else {
      rows.forEach(row => {
        console.log(`ID: ${row.id} | Category: ${row.category_id}`);
        console.log(`Name: ${row.name}`);
        console.log(`Image: ${row.image_url}`);
        console.log();
      });
    }
    
    db.close();
  }
);
