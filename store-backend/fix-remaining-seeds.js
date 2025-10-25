const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'store.db');
const db = new sqlite3.Database(dbPath);

const updates = [
  {
    id: 492,
    name: "Cal-J Tomato Compact And Determinate Variety Seeds",
    price: "UGX 19,400 (50g)",
    description: "Compact and determinate variety suitable for processing. Vigorous and highly productive. Medium sized, square with apple-green back, very firm, smooth, intense red colour with excellent flavour. Resistant to verticillium and fusarium wilts. Spacing: 60cm*45cm, Seed rate: 80grams/acre, Maturity: 100-120 days, Yield: 20-45mt/acre.",
    features: "10g UGX 4,600 | 20g UGX 7,200 | 25g UGX 9,300 | 50g UGX 19,400"
  },
  {
    id: 509,
    name: "Frey Pepper Hybrid F1 Seeds",
    price: "UGX 38,800 (5g)",
    description: "Frey is a versatile hybrid sweet pepper that can be grown outdoors or indoors. Fruits measure 12x10cm and go from green to red. Thick walls, Strong plant with short internodes and good leaf cover. Disease Resistance: Potato Virus Y, Tobamovirus.",
    features: "5g UGX 38,800"
  },
  {
    id: 513,
    name: "Grace Barley Seed",
    price: "UGX 2,500 (1kg)",
    description: "Grace barley is a good yielding variety. Maturity: 100 days, Yield potential: 1500 kg/Acre, Seed rate: 50kgs/Acre.",
    features: "1kg UGX 2,500"
  }
];

console.log('🌾 Updating remaining 3 seeds...\n');

let completed = 0;

updates.forEach((seed) => {
  db.run(
    'UPDATE products SET price = ?, description = ?, features = ? WHERE id = ?',
    [seed.price, seed.description, seed.features, seed.id],
    function(err) {
      if (err) {
        console.error(`❌ Error updating ${seed.name}:`, err.message);
      } else {
        console.log(`✅ Updated: ${seed.name} - ${seed.price}`);
      }
      
      completed++;
      if (completed === updates.length) {
        console.log('\n✅ All remaining seeds updated!');
        db.close();
      }
    }
  );
});





