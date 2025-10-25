const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'store.db');
const db = new sqlite3.Database(dbPath);

// Seed data with correct prices from ezyagric.com
const seedCorrections = [
  {
    name: "Sugar Baby",
    price: "UGX 8,700 (50g)",
    description: "Potential fruit weight: 5-8kgs, Yield potential: 48-50 tons per acre, Duration to maturity: 80 days, Spacing: 100x100cm, Seed rate: 500 grams per acre. Dark green, round watermelon, Very uniform growth, Very adoptable and grows on wide range of soils.",
    other_packaging: "10g UGX 2,100 | 20g UGX 3,200 | 25g UGX 3,800 | 50g UGX 8,700 | 250g UGX 34,900 | 500g UGX 67,200 | 1kg UGX 128,900"
  },
  {
    name: "Julie F1",
    price: "UGX 33,800 (50g)",
    description: "Potential fruit weight: 10-12kgs, Yield potential: 35-40 tons per acre, Duration to maturity: 85 days. A very popular hybrid with oblong shaped fruit. Very sweet red flesh. Tolerant to fusarium wilt and anthracnose.",
    other_packaging: "5g UGX 3,800 | 10g UGX 7,200 | 25g UGX 17,600 | 50g UGX 33,800 | 100g UGX 64,900 | 250g UGX 163,700 | 500g UGX 324,600"
  },
  {
    name: "Frey - Pepper Hybrid F1",
    price: "UGX 38,800 (5g)",
    description: "Frey is a versatile hybrid sweet pepper that can be grown outdoors or indoors. Fruits measure 12x10cm and go from green to red. Thick walls, Strong plant with short internodes and good leaf cover. Disease Resistance: Potato Virus Y, Tobamovirus.",
    other_packaging: "5g UGX 38,800"
  },
  {
    name: "Habanero Yellow – Bonnet Pepper",
    price: "UGX 54,200 (50g)",
    description: "Very vigorous and high yielding pepper with reliable performance in wide range of growing conditions. Long harvesting period. Each plant produces about 5kg per season. Maturity is 70 days from transplanting.",
    other_packaging: "50g UGX 54,200"
  },
  {
    name: "Grace - Barley Seed",
    price: "UGX 2,500 (1kg)",
    description: "Grace barley is a good yielding variety. Maturity: 100 days, Yield potential: 1500 kg/Acre, Seed rate: 50kgs/Acre.",
    other_packaging: "1kg UGX 2,500"
  },
  {
    name: "California Wonder \"Bamba\" - Pepper",
    price: "UGX 23,300 (50g)",
    description: "Erect plant with good vigor. Very good production of green deep blocky fruits with smooth skin. Yield potential is 15-20 tons under good management. Seed rate/acre: 100g. Spacing: 60cm x 45cm.",
    other_packaging: "50g UGX 23,300"
  },
  {
    name: "Habanero Red – Bonnet Pepper",
    price: "UGX 59,600 (50g)",
    description: "High yielding pepper variety with great demand locally and internationally. Can be grown for export. Each plant produces 4-5kg per season. Maturity is 70 days from transplanting.",
    other_packaging: "10g UGX 16,400 | 50g UGX 59,600"
  },
  {
    name: "Ashley – Open Pollinated Cucumber Varirty With Prolific Productivity",
    price: "UGX 9,800 (50g)",
    description: "Open pollinated cucumber grown for years in most vegetable gardens, excellent for slicing. Early variety, prolific producer of medium size 30cm fruits that are darker than other cultivars. Resistant to downy mildew. Also grows well in containers.",
    other_packaging: "10g UGX 3,600 | 25g UGX 6,700 | 50g UGX 9,800"
  },
  {
    name: "Mak Soy 3N (Brac Seed)",
    price: "UGX 6,700 (1kg)",
    description: "Spacing: 60cm x 5cm (machine planting); 50cm x 25cm (hand hoe planting). Seed Rate: 50-60 Kg per hectare, 20-25 kg per acre. Maturity Period: 100 days. Yield: 2.0-3.5 metric tonnes per hectare; 0.8-1.4 metric tonnes per acre.",
    other_packaging: "1kg UGX 6,700"
  },
  {
    name: "Cal-j Tomato Compact And Determinate Variety Suitable For Processing And Fresh Market",
    price: "UGX 19,400 (50g)",
    description: "Compact and determinate variety suitable for processing. Vigorous and highly productive. Medium sized, square with apple-green back, very firm, smooth, intense red colour with excellent flavour. Resistant to verticillium and fusarium wilts. Spacing: 60cm*45cm, Seed rate: 80grams/acre, Maturity: 100-120 days, Yield: 20-45mt/acre.",
    other_packaging: "10g UGX 4,600 | 20g UGX 7,200 | 25g UGX 9,300 | 50g UGX 19,400"
  },
  {
    name: "Green Bunching – Onion, Non-bulbing Alliums That Produce Yummy Green Stems",
    price: "UGX 16,500 (50g)",
    description: "Perennial non-bulbing alliums that produce yummy green stems and tiny white roots, year after year. Thick, round, hollow stems that are bright green in color. Unique greenish white flowers. Leaves have mild onion flavor, edible raw or cooked.",
    other_packaging: "10g UGX 5,700 | 50g UGX 16,500"
  },
  {
    name: "Terere – Amaranthus, Indigenous, Highly Nutritious Green Leafy Vegetable",
    price: "UGX 4,400 (50g)",
    description: "Indigenous, highly nutritious green leafy vegetable. Highly grown for succulent edible leaves extremely rich in vitamin A & C. High contents of minerals: Iron, Calcium and Phosphorous. Tastes excellent when cooked fresh. Early maturing.",
    other_packaging: "10g UGX 2,000 | 20g UGX 2,600 | 25g UGX 3,400 | 50g UGX 4,400 | 250g UGX 12,700 | 500g UGX 23,300"
  },
  {
    name: "Galia F1 – Sweet Melon With Firm Fruits, Aromatic Flavour",
    price: "UGX 23,500 (10g)",
    description: "Very sweet Melon with firm fruits, aromatic flavour. Tolerant to fusarium wilt race 0 and powdery mildew. Maturity: 70 days, Spacing: 150cm*60cm, Seed rate: 600grams/acre, Average fruit weight: 0.8-1.2kgs. Globe shaped fruits with small cavity. Rind: gold yellow with medium netting.",
    other_packaging: "10g UGX 23,500"
  },
  {
    name: "Green Gold F1 – Pepper, High Yielding Variety With Excellent Fruit Set",
    price: "UGX 117,200 (10g)",
    description: "High yielding variety with excellent fruit set, ideal for both open and protected cultivation. Suitable for long distance transportation. Very good keeping qualities. High tolerance to tomato spotted wilt virus, potato virus Y, bacterial spot and tobamo virus. Spacing: 60cm*60cm, Maturity: 90-140 days, Yield: 10-16mt/acre. Dark green walled fruits, Large and blocky.",
    other_packaging: "1g UGX 3,100 | 10g UGX 117,200"
  },
  {
    name: "Green Coronet F1 – Cabbage, Medium-large, Semi-upright Hybrid",
    price: "UGX 91,600 (50g)",
    description: "Medium-large, semi-upright hybrid cabbage variety that grows well in medium hot to cold areas. Excellent field holding capacity, will last long in the field before bursting. Maturity: 75-80 days from transplanting, Seed rate: 100grams/acre, Spacing: 60cm*60cm or 60cm*45cm, Average head weight: 4kg, Colour: Deep green.",
    other_packaging: "1g UGX 2,800 | 5g UGX 10,800 | 10g UGX 23,500 | 25g UGX 54,700 | 50g UGX 91,600"
  },
  {
    name: "Tall Utah – Celery Variety With Crisp, Stringless Green Tightly Folded Hearts",
    price: "UGX 10,100 (50g)",
    description: "Crisp, stringless green celery with tightly folded hearts, and broad, thick, well-rounded stalks. Vigorous grower without getting flimsy. Popular green celery for late use. Germination: 7-10 days, Height at maturity: 45-60cm, Spacing: 20cm, Days to maturity: 70-125 days.",
    other_packaging: "10g UGX 3,300 | 20g UGX 4,100 | 25g UGX 5,000 | 50g UGX 10,100"
  },
  {
    name: "California Wonder",
    price: "UGX 17,600 (50g)",
    description: "Ideal for Open field production. Very uniform fruits, Blocky and medium-sized. Widely adaptable variety. Colour turns from green to red. Average yield per acre: 6-7 tons. Maturity: 80-90 Days.",
    other_packaging: "10g UGX 3,800 | 50g UGX 17,600"
  },
  {
    name: "Maxim F1 – Tomato",
    price: "UGX 239,400 (50g)",
    description: "Indeterminate hybrid, tall with vigorous plant habit. Broad, dark green leaves with excellent foliage cover. Ideal for greenhouse or Open field production under support system. Square oblong firm fruits turning deep uniform red colour. Fruit harvesting starts 65-70 days after transplanting. Average 7-9 fruits per truss. Shelf life: average 21 days. Tolerant to Bacterial wilt, Fusarium & Verticillium wilt. Yield potential: Average 70-80 Tons/acre.",
    other_packaging: "5g UGX 38,100 | 10g UGX 69,900 | 50g UGX 239,400"
  },
  {
    name: "Coatmeal - Coriander",
    price: "UGX 3,780 (50g)",
    description: "Popular herb with finely cut, small and rather pungent leaves. Tender foliage used for seasoning and flavouring curries.",
    other_packaging: "50g UGX 3,780 | 500g UGX 31,000 | 1kg UGX 66,500"
  }
];

console.log('🌾 Updating seed prices and descriptions...\n');

let updateCount = 0;
let errorCount = 0;

// Get seeds category ID
db.get('SELECT id FROM categories WHERE name = ?', ['seeds'], (err, category) => {
  if (err || !category) {
    console.error('❌ Failed to find seeds category');
    db.close();
    return;
  }

  const categoryId = category.id;

  // Update each seed
  seedCorrections.forEach((seed, index) => {
    const query = `
      UPDATE products 
      SET price = ?, 
          description = ?,
          features = ?
      WHERE category_id = ? AND name LIKE ?
    `;

    const searchName = `%${seed.name.split(' – ')[0]}%`; // Match first part of name
    
    db.run(query, [seed.price, seed.description, seed.other_packaging, categoryId, searchName], function(err) {
      if (err) {
        console.error(`❌ Error updating ${seed.name}:`, err.message);
        errorCount++;
      } else if (this.changes > 0) {
        console.log(`✅ Updated: ${seed.name} - ${seed.price}`);
        updateCount++;
      } else {
        console.log(`⚠️  Not found: ${seed.name}`);
      }

      // Close DB after last update
      if (index === seedCorrections.length - 1) {
        setTimeout(() => {
          console.log('\n' + '='.repeat(60));
          console.log(`📊 Summary:`);
          console.log(`  ✅ Updated: ${updateCount}`);
          console.log(`  ❌ Errors: ${errorCount}`);
          console.log(`  ⚠️  Not found: ${seedCorrections.length - updateCount - errorCount}`);
          console.log('='.repeat(60));
          db.close();
        }, 1000);
      }
    });
  });
});






