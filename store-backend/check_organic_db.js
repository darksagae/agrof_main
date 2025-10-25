const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/app/store.db');

console.log('🔍 Checking organic chemicals in database...\n');

db.get("SELECT id FROM categories WHERE name = 'organic_chemicals'", (err, cat) => {
  if (err || !cat) {
    console.error('Category not found:', err);
    db.close();
    return;
  }
  
  console.log(`Category ID: ${cat.id}\n`);
  
  db.all(
    "SELECT id, name, image_url, category_id FROM products WHERE category_id = ?",
    [cat.id],
    (err, rows) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log(`Found ${rows.length} products:\n`);
        rows.forEach(row => {
          console.log(`ID: ${row.id}`);
          console.log(`Name: ${row.name}`);
          console.log(`Image: ${row.image_url}`);
          console.log(`Category ID: ${row.category_id}`);
          console.log();
        });
      }
      db.close();
    }
  );
});
