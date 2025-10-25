const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/app/store.db');

// Map products to the simple image files
const productUpdates = [
  { name: 'Fertiplus - Organic Fertilizer', image: 'organic_1.png' },
  { name: 'Humate - Organic Soil Conditioner', image: 'organic_2.jpg' },
  { name: 'Vermicompost 100 - Premium Organic Fertilizer', image: 'organic_3.png' }
];

console.log('🔧 Fixing organic chemical products...\n');

db.serialize(() => {
  // Get category ID
  db.get("SELECT id FROM categories WHERE name = 'organic_chemicals'", (err, row) => {
    if (err || !row) {
      console.error('Error finding category:', err);
      return;
    }
    
    const categoryId = row.id;
    console.log(`📋 Category ID: ${categoryId}\n`);
    
    let completed = 0;
    let updated = 0;
    
    productUpdates.forEach(({ name, image }) => {
      const imageUrl = `/api/images/ORGANIC_CHEMICALS/${image}`;
      
      db.run(
        'UPDATE products SET image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE name = ? AND category_id = ?',
        [imageUrl, name, categoryId],
        function(err) {
          if (err) {
            console.error(`❌ ${name}:`, err.message);
          } else if (this.changes > 0) {
            console.log(`✅ ${name}`);
            console.log(`   → ${image}`);
            updated++;
          } else {
            console.log(`⚠️  ${name}: Product not found`);
          }
          
          completed++;
          
          if (completed === productUpdates.length) {
            console.log(`\n🎉 Complete! ${updated} products updated with simple images`);
            
            // Verify
            db.all(
              'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
              [categoryId],
              (err, rows) => {
                if (!err && rows[0]) {
                  console.log(`📊 Total organic chemical products: ${rows[0].count}`);
                }
                db.close();
              }
            );
          }
        }
      );
    });
  });
});
