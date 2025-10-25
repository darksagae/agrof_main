/**
 * Import ALL Nursery Bed Products to Database
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const db = new sqlite3.Database('./store.db');
const nurseryBedDir = path.join(__dirname, '../agrof-main/mobile/app/assets/store/NURSERY_BED');

console.log('='.repeat(60));
console.log('IMPORTING ALL NURSERY BED PRODUCTS TO DATABASE');
console.log('='.repeat(60));
console.log();

// Get nursery_bed category ID
db.get("SELECT id FROM categories WHERE name LIKE '%nursery%'", async (err, category) => {
  if (err || !category) {
    console.error('❌ Nursery Bed category not found!');
    db.close();
    return;
  }

  const categoryId = category.id;
  console.log(`✅ Nursery Bed category ID: ${categoryId}`);
  console.log();

  // Clear existing nursery bed products
  db.run("DELETE FROM products WHERE category_id = ?", [categoryId], (err) => {
    if (err) {
      console.error('Error clearing products:', err);
    } else {
      console.log('🗑️  Cleared old nursery bed products');
      console.log();
    }
  });

  // Read all nursery bed product folders
  const folders = fs.readdirSync(nurseryBedDir).filter(f => 
    fs.statSync(path.join(nurseryBedDir, f)).isDirectory()
  );

  console.log(`📁 Found ${folders.length} nursery bed product folders`);
  console.log();

  let imported = 0;
  let errors = 0;

  folders.forEach((folder, index) => {
    const pricingPath = path.join(nurseryBedDir, folder, 'pricing.json');
    const productMdPath = path.join(nurseryBedDir, folder, 'product.md');

    if (!fs.existsSync(pricingPath)) {
      console.log(`[${index + 1}/${folders.length}] ⏭️  Skipped: ${folder} (no pricing.json)`);
      return;
    }

    try {
      const pricingData = JSON.parse(fs.readFileSync(pricingPath, 'utf8'));
      
      const lowestPrice = pricingData.lowestPrice || 0;
      const displayPrice = pricingData.displayPrice || `UGX ${lowestPrice}`;
      
      const defaultPackage = pricingData.packages && pricingData.packages[0] ? 
        pricingData.packages[0].size : '1 Piece';
      
      let description = pricingData.productDetails || '';
      if (fs.existsSync(productMdPath)) {
        const mdContent = fs.readFileSync(productMdPath, 'utf8');
        const overviewMatch = mdContent.match(/## Overview\n([\s\S]*?)\n\n##/);
        if (overviewMatch && overviewMatch[1]) {
          description = overviewMatch[1].trim();
        }
      }

      // Find image file in the folder
      const imageFiles = fs.readdirSync(path.join(nurseryBedDir, folder))
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
      const imageName = imageFiles[0] || 'image.jpg';

      // Insert product
      db.run(`
        INSERT INTO products (
          category_id, name, description, price, 
          selling_price, quantity_in_stock,
          unit_of_measure, supplier_name, image_url, availability
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        categoryId,
        pricingData.productName || folder,
        description.substring(0, 500),
        displayPrice,
        lowestPrice,
        100,
        defaultPackage,
        pricingData.supplier || 'AGROF Nursery',
        `/images/NURSERY_BED/${encodeURIComponent(folder)}/${imageName}`,
        'In Stock'
      ], function(err) {
        if (err) {
          console.error(`[${index + 1}/${folders.length}] ❌ Error importing ${folder}:`, err.message);
          errors++;
        } else {
          console.log(`[${index + 1}/${folders.length}] ✅ Imported: ${pricingData.productName || folder}`);
          console.log(`   Price: ${displayPrice}, Supplier: ${pricingData.supplier}`);
          imported++;
          
          if (index === folders.length - 1) {
            setTimeout(() => {
              console.log();
              console.log('='.repeat(60));
              console.log('IMPORT COMPLETE');
              console.log('='.repeat(60));
              console.log();
              console.log(`✅ Imported: ${imported} products`);
              console.log(`❌ Errors: ${errors} products`);
              console.log(`📊 Total: ${folders.length} products`);
              console.log();
              
              db.get("SELECT COUNT(*) as count FROM products WHERE category_id = ?", [categoryId], (err, row) => {
                if (!err) {
                  console.log(`✅ Database now has ${row.count} nursery bed products`);
                }
                db.close();
              });
            }, 500);
          }
        }
      });

    } catch (error) {
      console.error(`[${index + 1}/${folders.length}] ❌ Error processing ${folder}:`, error.message);
      errors++;
    }
  });
});




