/**
 * Import ALL 73 Seed Products from asset files to backend database
 * Reads pricing.json files and imports to products table
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const db = new sqlite3.Database('./store.db');
const seedsDir = path.join(__dirname, '../agrof-main/mobile/app/assets/store/SEEDS');

console.log('='.repeat(60));
console.log('IMPORTING ALL SEED PRODUCTS TO DATABASE');
console.log('='.repeat(60));
console.log();

// Get SEEDS category ID (case-insensitive)
db.get("SELECT id FROM categories WHERE LOWER(name) = 'seeds'", async (err, category) => {
  if (err || !category) {
    console.error('❌ SEEDS category not found!');
    db.close();
    return;
  }

  const categoryId = category.id;
  console.log(`✅ SEEDS category ID: ${categoryId}`);
  console.log();

  // Clear existing seed products
  db.run("DELETE FROM products WHERE category_id = ?", [categoryId], (err) => {
    if (err) {
      console.error('Error clearing products:', err);
    } else {
      console.log('🗑️  Cleared old seed products');
    }
  });

  // Read all seed product folders
  const folders = fs.readdirSync(seedsDir).filter(f => 
    fs.statSync(path.join(seedsDir, f)).isDirectory()
  );

  console.log(`📁 Found ${folders.length} seed product folders`);
  console.log();

  let imported = 0;
  let errors = 0;

  folders.forEach((folder, index) => {
    const pricingPath = path.join(seedsDir, folder, 'pricing.json');
    const productMdPath = path.join(seedsDir, folder, 'product.md');

    if (!fs.existsSync(pricingPath)) {
      console.log(`[${index + 1}/${folders.length}] ⏭️  Skipped: ${folder} (no pricing.json)`);
      return;
    }

    try {
      const pricingData = JSON.parse(fs.readFileSync(pricingPath, 'utf8'));
      
      // Extract base price (lowest price) and packaging info
      const lowestPrice = pricingData.lowestPrice || 0;
      const displayPrice = pricingData.displayPrice || `UGX ${lowestPrice}`;
      
      // Get first package as default
      const defaultPackage = pricingData.packages && pricingData.packages[0] ? 
        pricingData.packages[0].size : '10g';
      
      // Read product description from product.md
      let description = pricingData.productDetails || '';
      if (fs.existsSync(productMdPath)) {
        const mdContent = fs.readFileSync(productMdPath, 'utf8');
        // Extract overview section
        const overviewMatch = mdContent.match(/## Overview\n([\s\S]*?)\n\n##/);
        if (overviewMatch && overviewMatch[1]) {
          description = overviewMatch[1].trim();
        }
      }

      // Find image file in the folder
      const imageFiles = fs.readdirSync(path.join(seedsDir, folder))
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
      const imageName = imageFiles[0] || 'image.png';

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
        description.substring(0, 500), // Limit description length
        displayPrice,
        lowestPrice,
        100, // Stock quantity
        defaultPackage,
        pricingData.supplier || 'AGROF Seeds',
        `/images/SEEDS/${encodeURIComponent(folder)}/${imageName}`,
        'In Stock'
      ], function(err) {
        if (err) {
          console.error(`[${index + 1}/${folders.length}] ❌ Error importing ${folder}:`, err.message);
          errors++;
        } else {
          console.log(`[${index + 1}/${folders.length}] ✅ Imported: ${pricingData.productName || folder}`);
          console.log(`   Price: ${displayPrice}, Supplier: ${pricingData.supplier}`);
          imported++;
          
          // Close and show summary on last product
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
              
              // Verify import
              db.get("SELECT COUNT(*) as count FROM products WHERE category_id = ?", [categoryId], (err, row) => {
                if (!err) {
                  console.log(`✅ Database now has ${row.count} seed products`);
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

