const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/app/store.db');

// Products to create with their simple image assignments
const products = [
  {
    name: 'SG 1000 - Organic Soil Enhancer',
    description: 'Premium organic soil enhancer for improved plant growth and soil health.',
    price: 'UGX 45,000',
    image: 'organic_1.png',
    stock: 25
  },
  {
    name: 'Oscars Oligo - Organic Micronutrient',
    description: 'Essential organic micronutrients for healthy plant development.',
    price: 'UGX 35,000',
    image: 'organic_2.jpg',
    stock: 30
  },
  {
    name: 'Vermicompost 100 - Premium Organic Fertilizer',
    description: 'High-quality vermicompost for organic farming and gardening.',
    price: 'UGX 25,000',
    image: 'organic_3.png',
    stock: 50
  },
  {
    name: 'Oscars Primo - Organic Growth Booster',
    description: 'Natural growth booster for all types of crops.',
    price: 'UGX 40,000',
    image: 'organic_4.jpg',
    stock: 20
  },
  {
    name: 'Super Agric Silage - Organic Supplement',
    description: 'Organic supplement for improved crop quality and yield.',
    price: 'UGX 30,000',
    image: 'organic_5.jpeg',
    stock: 35
  },
  {
    name: 'Seek Bambo - Organic Plant Food',
    description: 'Natural plant food for sustainable agriculture.',
    price: 'UGX 38,000',
    image: 'organic_6.png',
    stock: 28
  },
  {
    name: 'Solum2Soil - Organic Soil Conditioner',
    description: 'Improve soil structure and fertility naturally.',
    price: 'UGX 42,000',
    image: 'organic_7.png',
    stock: 22
  },
  {
    name: 'Super Agric Germination Booster',
    description: 'Enhance seed germination with this organic booster.',
    price: 'UGX 32,000',
    image: 'organic_8.jpeg',
    stock: 40
  },
  {
    name: 'Organic Fungicide - Natural Protection',
    description: 'Natural fungal protection for organic farming.',
    price: 'UGX 48,000',
    image: 'organic_9.png',
    stock: 18
  },
  {
    name: 'Humate - Organic Soil Conditioner',
    description: 'Humic acid-based soil conditioner for better nutrient absorption.',
    price: 'UGX 36,000',
    image: 'organic_10.jpg',
    stock: 26
  },
  {
    name: 'Fertiplus - Organic Fertilizer',
    description: 'Complete organic fertilizer for all crop types.',
    price: 'UGX 44,000',
    image: 'organic_11.jpg',
    stock: 32
  },
  {
    name: 'ORB-L - Organic Root Booster',
    description: 'Stimulate root development naturally.',
    price: 'UGX 39,000',
    image: 'organic_12.jpg',
    stock: 24
  },
  {
    name: 'Vermichar - Organic Biochar',
    description: 'Biochar enriched with vermicompost for soil improvement.',
    price: 'UGX 50,000',
    image: 'organic_13.png',
    stock: 15
  },
  {
    name: 'Calphos - Organic Calcium Phosphate',
    description: 'Natural calcium and phosphorus supplement.',
    price: 'UGX 34,000',
    image: 'organic_14.jpeg',
    stock: 28
  }
];

console.log('🌱 Creating organic chemical products...\n');

db.get("SELECT id FROM categories WHERE name = 'organic_chemicals'", (err, cat) => {
  if (err || !cat) {
    console.error('Category not found:', err);
    db.close();
    return;
  }
  
  const categoryId = cat.id;
  console.log(`Category ID: ${categoryId}\n`);
  
  let completed = 0;
  let created = 0;
  
  products.forEach((product) => {
    const imageUrl = `/api/images/ORGANIC_CHEMICALS/${product.image}`;
    
    db.run(
      `INSERT INTO products (name, category_id, description, price, image_url, quantity_in_stock, availability, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'In Stock', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [product.name, categoryId, product.description, product.price, imageUrl, product.stock],
      function(err) {
        if (err) {
          console.error(`❌ ${product.name}:`, err.message);
        } else {
          console.log(`✅ ${product.name} (ID: ${this.lastID})`);
          console.log(`   → ${product.image}`);
          created++;
        }
        
        completed++;
        
        if (completed === products.length) {
          console.log(`\n🎉 Complete! ${created} organic chemical products created`);
          db.close();
        }
      }
    );
  });
});
