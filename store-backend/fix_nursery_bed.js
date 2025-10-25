const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/app/store.db');

// Map of correct products with their image files
const products = {
  'Aloe Vera Seedling': 'Aloe_vera-compressed.jpg',
  'Atwalira - Banana T.c Plantlet': 'Atwalira.jpg',
  'Bogoya (Gros Michel)-banana T.c Plantlet': 'Bogoya .jpg',
  'Celery Seedling': 'Cellery-compressed.jpg',
  'Chocolate Mint Seedling': 'Choclate_mint-compressed.jpg',
  'Cinnamon Seedling': 'cinnamon-compressed.jpg',
  'Coriander Seedlings': 'Coriander_seedlings-compressed.jpg',
  'Kibuzi - Banana T.c Plantlet': 'Kibuzi.jpg',
  'Kisansa - Banana T.c Plantlet': 'Kisansa.jpg',
  'Lemon Balm Seedling': 'Lemon_balm-compressed.jpg',
  'Lemon Grass (Kisubi)': 'Lemon_grass-compressed.jpg',
  'M3 Banana Suckers': 'banana-suckers.jpg',
  'Mbwazirume-banana T.c Plantlet': 'Mbwazirume.jpg',
  'Mint Seedling': 'Mint-compressed.jpg',
  'Mpologoma-banana T.c Plantlet': 'Mpologoma.jpg',
  'Musakala': 'Musakala.jpg',
  'Nakatansese - Banana T.c Plantlet': 'Nakatansese.jpg',
  'Oregano Seedling': 'Origano-compressed.jpg',
  'Parsley Seedling': 'Parsley-compressed.jpg',
  'Pineapple Mint Seedling': 'Pineaple_mint-compressed.jpg',
  'Rosemary Seedling': 'Rosemary-compressed.jpg',
  'Strawberry Chandler Seedlings': 'Strawberry-compressed.jpg',
  'Sweet Basil Seedling (Mujaaja)': 'Sweet_basil_1.jpg'
};

console.log('🔧 Fixing nursery bed products...\n');

// Step 1: Delete duplicate/incorrect products
db.serialize(() => {
  // Get category ID for nursery_bed
  db.get("SELECT id FROM categories WHERE name = 'nursery_bed'", (err, row) => {
    if (err || !row) {
      console.error('Error finding category:', err);
      return;
    }
    
    const categoryId = row.id;
    console.log(`📋 Category ID: ${categoryId}`);
    
    // Delete products not in our list
    const correctNames = Object.keys(products);
    const placeholders = correctNames.map(() => '?').join(',');
    
    db.run(
      `DELETE FROM products WHERE category_id = ? AND name NOT IN (${placeholders})`,
      [categoryId, ...correctNames],
      function(err) {
        if (err) {
          console.error('Error deleting duplicates:', err);
        } else {
          console.log(`🗑️  Deleted ${this.changes} duplicate/incorrect products\n`);
        }
        
        // Step 2: Update image URLs for correct products
        let updated = 0;
        let completed = 0;
        
        Object.entries(products).forEach(([name, imageFile]) => {
          const imageUrl = `/api/images/Nursery_bed/${name}/${imageFile}`;
          
          db.run(
            'UPDATE products SET image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE name = ? AND category_id = ?',
            [imageUrl, name, categoryId],
            function(err) {
              if (err) {
                console.error(`❌ ${name}:`, err.message);
              } else if (this.changes > 0) {
                console.log(`✅ ${name}`);
                updated++;
              } else {
                console.log(`⚠️  ${name}: Product not found in database`);
              }
              
              completed++;
              
              if (completed === Object.keys(products).length) {
                console.log(`\n🎉 Complete! ${updated} products updated with correct images`);
                
                // Verify
                db.all(
                  'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
                  [categoryId],
                  (err, rows) => {
                    if (!err && rows[0]) {
                      console.log(`📊 Total nursery bed products in database: ${rows[0].count}`);
                    }
                    db.close();
                  }
                );
              }
            }
          );
        });
      }
    );
  });
});
