const fetch = require('node-fetch');

const products = [
  { name: 'SG 1000 Organic Fertilizer', price: 45000, stock: 50, image: 'sg1000.png', desc: 'Premium organic fertilizer for sustainable farming' },
  { name: 'Fertiplus Organic', price: 38000, stock: 100, image: 'fertiplus.jpg', desc: 'Complete organic nutrient solution' },
  { name: 'Humate Organic Compound', price: 42000, stock: 75, image: 'humate.jpg', desc: 'Humic acid-based soil conditioner' },
  { name: 'Calphos Organic', price: 36000, stock: 120, image: 'calphos_organic.jpeg', desc: 'Organic calcium phosphate fertilizer' },
  { name: 'Vermicompost 100', price: 25000, stock: 200, image: 'vermicompost_100.png', desc: 'Premium worm-processed organic compost' },
  { name: 'Vermichar Biochar', price: 30000, stock: 80, image: 'vermichar.png', desc: 'Biochar for improved soil structure' },
  { name: 'ORB-L Organic Bio-Fertilizer', price: 32000, stock: 90, image: 'orb_l.jpg', desc: 'Liquid organic bio-fertilizer' },
  { name: 'Oscars Oligo', price: 28000, stock: 110, image: 'oscars_oligo.jpg', desc: 'Organic micronutrient supplement' },
  { name: 'Oscars Primo', price: 35000, stock: 95, image: 'oscars_primo.jpg', desc: 'Premium organic growth enhancer' },
  { name: 'Seek Bambo Organic', price: 40000, stock: 70, image: 'seek_bambo.png', desc: 'Organic bamboo extract for plant growth' },
  { name: 'Solum2Soil Organic', price: 33000, stock: 85, image: 'solum2soil.png', desc: 'Soil health restoration product' },
  { name: 'SuperAgric Germination Booster', price: 27000, stock: 130, image: 'superagric_germination_booster.jpeg', desc: 'Organic seed treatment' },
  { name: 'SuperAgric Silage', price: 29000, stock: 100, image: 'superagric_silage.jpeg', desc: 'Organic silage improver for livestock' },
  { name: 'Organic Fungicide', price: 31000, stock: 105, image: 'fungicide.png', desc: 'Natural fungicide for organic farming' }
];

async function restoreProducts() {
  for (const p of products) {
    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: p.name,
          category: 'ORGANIC_CHEMICALS',
          price: `UGX ${p.price.toLocaleString()}`,
          selling_price: p.price,
          quantity_in_stock: p.stock,
          description: p.desc,
          availability: 'In Stock',
          image_url: `/api/images/ORGANIC_CHEMICALS/${p.image}`
        })
      });
      const result = await response.json();
      console.log(`✅ ${p.name} - ID: ${result.id || 'Added'}`);
    } catch (error) {
      console.error(`❌ ${p.name}:`, error.message);
    }
  }
  console.log('\n🎉 Restore complete!');
}

restoreProducts();
