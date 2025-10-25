const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/app/store.db');

// Map products to their correct original images
const imageMapping = [
  { name: 'SG 1000 - Organic Soil Enhancer', image: 'sg1000.png' },
  { name: 'Oscars Oligo - Organic Micronutrient', image: 'oscars_oligo.jpg' },
  { name: 'Vermicompost 100 - Premium Organic Fertilizer', image: 'vermicompost_100.png' },
  { name: 'Oscars Primo - Organic Growth Booster', image: 'oscars_primo.jpg' },
  { name: 'Super Agric Silage - Organic Supplement', image: 'superagric_silage.jpeg' },
  { name: 'Seek Bambo - Organic Plant Food', image: 'seek_bambo.png' },
  { name: 'Solum2Soil - Organic Soil Conditioner', image: 'solum2soil.png' },
  { name: 'Super Agric Germination Booster', image: 'superagric_germination_booster.jpeg' },
  { name: 'Organic Fungicide - Natural Protection', image: 'fungicide.png' },
  { name: 'Humate - Organic Soil Conditioner', image: 'humate.jpg' },
  { name: 'Fertiplus - Organic Fertilizer', image: 'fertiplus.jpg' },
  { name: 'ORB-L - Organic Root Booster', image: 'orb_l.jpg' },
  { name: 'Vermichar - Organic Biochar', image: 'vermichar.png' },
  { name: 'Calphos - Organic Calcium Phosphate', image: 'calphos_organic.jpeg' }
];

console.log('🔧 Updating organic chemical products with original images...\n');

db.get("SELECT id FROM categories WHERE name = 'organic_chemicals'", (err, cat) => {
  if (err || !cat) {
    console.error('Category not found:', err);
    db.close();
    return;
  }
  
  const categoryId = cat.id;
  
  let completed = 0;
  let updated = 0;
  
  imageMapping.forEach(({ name, image }) => {
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
          console.log(`⚠️  ${name}: Not found`);
        }
        
        completed++;
        
        if (completed === imageMapping.length) {
          console.log(`\n🎉 Complete! ${updated} products updated with original images`);
          db.close();
        }
      }
    );
  });
});
