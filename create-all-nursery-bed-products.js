/**
 * Create ALL 23 Nursery Bed Products
 * Based on source data provided
 */

const fs = require('fs');
const path = require('path');

const nurseryBedData = [
  {
    name: "Bogoya (Gros Michel)-banana T.c Plantlet",
    supplier: "Senai Farm Supplies",
    category: "Nursery Bed",
    image: "Bogoya .jpg",
    productDetails: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Desert (yellow) banana; Planting to harvest time: 15-16 months; Susceptibility to weevils: Low; Susceptibility to wilt: High; Average finger size: Medium and long; Average bunch size: Small; Fruit texture: Soft and sweet.",
    price: 3600,
    package: "T.C Plantlet"
  },
  {
    name: "Rosemary Seedling",
    supplier: "William Omwech",
    category: "Nursery Bed",
    image: "Rosemarry-compressed.jpg",
    productDetails: "Rosemary is a perennial shrub and usually grows to about 1 meter (3.3 feet) in height, though some plants can reach up to 2 meters (6.6 feet) tall. The linear leaves are about 1 cm long and somewhat resemble small curved pine needles. Fresh rosemary is one of the most flavorful and fragrant herbs in the kitchen. In ancient times rosemary was believed to strengthen the memory.",
    specifications: "Grow in a sunny location. Rosemary thrives in 6-8 hours of direct sun. Water when the soil feels dry. Allow top inch of soil to dry out between watering. Prune rosemary frequently - the more you trim, the bushier the plant grows.",
    price: 5600,
    package: "1 Piece"
  },
  {
    name: "Parsley Seedling",
    supplier: "William Omwech",
    category: "Nursery Bed",
    image: "parsley-compressed.jpg",
    productDetails: "Parsley is a versatile herb that can be used in many ways, such in sauces, juices, or as a garnish. Parsley contains several important nutrients, such as vitamins A, K, and C. It's also a good source of the mineral calcium, iron, magnesium, and potassium. This herb can easily be added to many tasty dishes. Parsley stays fresh for up to two weeks.",
    specifications: "Parsley enjoys well-draining soil that is rich in organic matter. Pick a spot that gets full sun (6 to 8 hours of sunlight). Keep parsley plants sufficiently watered, especially through the heat of summer. Harvesting: When the leaf stems have three segments, parsley is ready to be harvested",
    price: 5600,
    package: "1 Piece"
  },
  {
    name: "Lemon Balm Seedling",
    supplier: "William Omwech",
    category: "Nursery Bed",
    image: "lemon_balm-compressed.jpg",
    productDetails: "Lemon balm is an herb from the mint family. The leaves, which have a mild lemon aroma, are used to make herbal medicine and flavor foods. Lemon balm is a bushy herbaceous perennial that grows to about 0.6 meters (2 feet) tall. Lemon balm can be grown easily at home in almost any location. Lemon balm leaves are used fresh or dried to season and flavor foods such as salads, soups, sauces and as a flavoring in candies, liqueurs, wine, and fruit drinks.",
    price: 5600,
    package: "1 Piece"
  },
  {
    name: "Coriander Seedlings",
    supplier: "William Omwech",
    category: "Nursery Bed",
    image: "Corriander-compressed.jpg",
    productDetails: "Coriander is a very beautiful annual herb. Its green shade and the shape of the leaves come together perfectly. It is used as spice giving food an extra delicious taste. It has essential oils and vitamins associated with various health benefits such as immunity boosting, Regulation of blood sugars, anti-inflammatory, and anti-cancer properties. It matures very fast with the ability to bare edible mass in about 4-6 weeks.",
    price: 5600,
    package: "1 Piece"
  },
  {
    name: "Sweet Basil Seedling (Mujaaja)",
    supplier: "William Omwech",
    category: "Nursery Bed",
    image: "sweet_basil-compressed.jpg",
    productDetails: "Sweet Basil is one of the most iconic culinary herbs. It adds flavor to meals, and its nutrients may provide health benefits. Sweet basil has been used for thousands of years as a culinary and medicinal herb. It acts principally on the digestive and nervous systems, easing flatulence, stomach cramps, colic and indigestion. Basil prefers a sunny location, and a soil that is well supplied with organic matter and is fertile.",
    price: 5600,
    package: "1 Piece"
  },
  {
    name: "Cinnamon Seedling",
    supplier: "William Omwech",
    category: "Nursery Bed",
    image: "Cinnamon-compressed.jpg",
    productDetails: "Cinnamon plant foliage is generally a glossy green to yellow-green, and they produce small flowers. Both the bark and leaves are aromatic. Its inner bark can also be used to make the spice. Cinnamon is used to flavor a variety of foods, from confections to curries to beverages, and is popular in bakery products. Essential oil can be distilled from the bark fragments for use in food, liqueur, perfume, and drugs.",
    price: 10700,
    package: "1 Piece"
  },
  {
    name: "Oregano Seedling",
    supplier: "William Omwech",
    category: "Nursery Bed",
    image: "oregano-compressed.jpg",
    productDetails: "Oregano is a loose, open plant with gray-green leaves and small purple or white flowers. Oregano is a hardy rampant growing perennial. Oregano is used in sauces, tomato dishes, pizza, Mexican dishes, salads and soups. Oregano is considered a staple herb in many cuisines around the world. It has a strong flavor and brings warmth to dishes, along with a hint of subtle sweetness.",
    specifications: "Rich in Antioxidants, May Help Fight Bacteria, Could Have Anti-Cancer Properties, Could Decrease Inflammation, Easy to Add to Your Diet",
    price: 5600,
    package: "1 Piece"
  },
  {
    name: "Lemon Grass (Kisubi)",
    supplier: "William Omwech",
    category: "Nursery Bed",
    image: "lemon_grass-compressed.jpg",
    productDetails: "Lemon grass is a perennial herb with a light lemon scent and flavor. This grass has a rich flavor of lemon citrus, can be used to brew tea as well as a herb for seasoning. Lemon grass essential oil can be used in aromatherapy, cosmetics, and as natural insecticide. It has a lemony flavour and can be dried and powdered or used fresh. The crop can be harvested continuously for long. Lemongrass can be grown in a pot or any other container and put on the veranda or balcony.",
    price: 5600,
    package: "1 Piece"
  },
  {
    name: "Pineapple Mint Seedling",
    supplier: "William Omwech",
    category: "Nursery Bed",
    image: "pineapple_mint-compressed.jpg",
    productDetails: "Pineapple Mint is an herbaceous perennial plant commonly grown as a culinary herb. Like most mints, pineapple mint is a creeping plant that spreads from shallow underground rhizomes. Clumps grow 2 to 3 feet tall, and unlimited in width. The soft, furry leaves are crinkled with cream and green variegation. It can be used as a tasty topping for fruit, ice cream, cold and hot tea, and juice drinks. Pineapple Mint offer a pleasing pineapple flavor.",
    specifications: "Pineapple mint does best in full sun in cool climates (but needs some shade in hotter climates). It needs consistent moisture to look its best. They do great in containers. Pollinators love the flowers",
    price: 5600,
    package: "1 Piece"
  },
  {
    name: "Chocolate Mint Seedling",
    supplier: "William Omwech",
    category: "Nursery Bed",
    image: "Choclate_mint-compressed.jpg",
    productDetails: "Chocolate mint plants are attractive, fragrant and easy to grow. The plant grows to about 2 feet tall and easily spreads by rhizomes into an attractive ground cover. The rounded, lance-shaped leaves are a darker green than other forms of mint. In cooking, chocolate mint can be used for flavoring desserts and drinks. In landscapes, this fast-growing perennial is often naturalized as a ground cover in moist areas.",
    specifications: "Chocolate mint prefers moist, woods-like soil, so it's good to add some organic matter before planting. Mint is one of the few culinary herbs that prefer part shade.",
    price: 5600,
    package: "1 Piece"
  },
  {
    name: "Mbwazirume-banana T.c Plantlet",
    supplier: "Senai Farm Supplies",
    category: "Nursery Bed",
    image: "Mbwazirume.jpg",
    productDetails: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Matooke (cooking) banana; Planting to harvest time: 12-13 months; Susceptibility to weevils: Moderate; Susceptibility to wilt: Not susceptible; Average finger size: Medium and medium long; Av. bunch size: Big; Food texture: Soft and golden.",
    price: 3600,
    package: "1 T.C Plantlet"
  },
  {
    name: "M3 Banana Suckers",
    supplier: "Zedekia Isabirye",
    category: "Nursery Bed",
    image: "m3_banana.jpg",
    productDetails: "On a prepared land dig up pits of size of (45x45x45) cm. Leave the pits exposed for some time to enable soil pests get exposed to sunshine. Refill the pit with soil mixed with farmyard manure (10Kg). Put suckers in the middle of the pit and soil around it compacted to keep it firm. Water immediately to provide moisture to the planted sucker.",
    price: 5000,
    package: "Sucker"
  },
  {
    name: "Atwalira - Banana T.c Plantlet",
    supplier: "Senai Farm Supplies",
    category: "Nursery Bed",
    image: "Atwalira.jpg",
    productDetails: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Matooke (cooking) banana; Planting to harvest: 13-14 months; Susceptibility to weevils: Moderate; Susceptibility to wilt: Not susceptible; Average finger size: Medium and medium long; Av bunch size: Medium; Food texture: Medium soft.",
    price: 3600,
    package: "1 T.C Plantlet"
  },
  {
    name: "Nakatansese - Banana T.c Plantlet",
    supplier: "Senai Farm Supplies",
    category: "Nursery Bed",
    image: "Nakatansese.jpg",
    productDetails: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Plantain (roasting) banana; Planting to harvest time: 14-15 months; Susceptibility to weevils: Moderate; Susceptibility to wilt: Moderate; Average finger size: Medium and medium long; Average bunch size: Large; Food texture: Soft and sweet.",
    price: 3600,
    package: "1 T.C Plantlet"
  },
  {
    name: "Musakala - Banana T.c Plantlet",
    supplier: "Senai Farm Supplies",
    category: "Nursery Bed",
    image: "Musakala.jpg",
    productDetails: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Matooke (cooking) banana; Planting to harvest time: 12-13 months; Susceptibility to weevils: Moderate; Susceptibility to wilt: Not susceptible; Average finger size: Large and long; Average bunch size: Big; Food texture: Soft.",
    price: 3600,
    package: "1 T.C Plantlet"
  },
  {
    name: "Mpologoma-banana T.c Plantlet",
    supplier: "Senai Farm Supplies",
    category: "Nursery Bed",
    image: "Mpologoma.jpg",
    productDetails: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Matooke (cooking) banana; Planting to harvest time: 11-12 months; Susceptibility to weevils: Low; Susceptibility to wilt: Not susceptible; Average finger size: Medium and long; Average bunch size: Big; Food texture: Soft.",
    price: 3600,
    package: "1 T.C Plantlet"
  },
  {
    name: "Kisansa - Banana T.c Plantlet",
    supplier: "Senai Farm Supplies",
    category: "Nursery Bed",
    image: "Kisansa.jpg",
    productDetails: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Matooke (cooking) banana; Planting to harvest time: 12-13 months; Susceptibility to weevils: Moderate; Susceptibility to wilt: Not susceptible; Average finger size: Large and long; Average bunch size: Big; Food texture: Soft.",
    price: 3600,
    package: "1 T.C Plantlet"
  },
  {
    name: "Kibuzi - Banana T.c Plantlet",
    supplier: "Senai Farm Supplies",
    category: "Nursery Bed",
    image: "Kibuzi.jpg",
    productDetails: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Matooke (cooking) banana; Planting to harvest time: 12-13 months; Susceptibility to weevils: Moderate; Susceptibility to wilt: Not susceptible; Average finger size: Medium and medium long; Average bunch size: Big; Food texture: Medium soft.",
    price: 3600,
    package: "1 T.C Plantlet"
  },
  {
    name: "Aloe Vera Seedling",
    supplier: "Mukama Mwesigwa Compound Designers",
    category: "Nursery Bed",
    image: "Aloe_vera-compressed.jpg",
    productDetails: "Aloe vera is a succulent plant species that is stemless or very short-stemmed with thick, greenish, fleshy leaves. The useful parts of aloe are the gel and latex. Aloe Vera is associated with a number of health benefits such as skin treatment for conditions such as Psoriasis, Seborrhea, Dandruff, Minor burns, Skin abrasions, and more. It is easy to grow, tolerant to most pests and diseases, does well in hot climate.",
    price: 5600,
    package: "1 Piece"
  },
  {
    name: "Celery Seedling",
    supplier: "Mukama Mwesigwa Compound Designers",
    category: "Nursery Bed",
    image: "Cellery-compressed.jpg",
    productDetails: "This is a crisp, stringless green celery with tightly folded hearts, and broad, thick, well-rounded stalks. It is a vigorous grower. Celery is a negative-calorie food. Celery is rich in fibre content that makes it a detoxification agent for the gut. Celery contains vitamin A that is essential for stronger immunity, better eyes and healthier skin.",
    price: 3500,
    package: "1 Piece"
  },
  {
    name: "Strawberry Chandler Seedlings",
    supplier: "William Omwech",
    category: "Nursery Bed",
    image: "strawberry-compressed.jpg",
    productDetails: "Strawberries are low-growing herbaceous plants with a fibrous root system. The flowers, generally white, rarely reddish, are borne in small clusters. Packed with vitamins, fiber, and particularly high levels of antioxidants known as polyphenols. Just one serving -- about eight strawberries -- provides more vitamin C than an orange.",
    specifications: "Strawberry plants require 6-10 hours a day of direct sunlight. Strawberries are tolerant of different soil types, although they prefer loamy soil that drains well. Soil pH should be between 5.5 and 7.",
    price: 5600,
    package: "1 Piece"
  },
  {
    name: "Mint Seedling",
    supplier: "Mukama Mwesigwa Compound Designers",
    category: "Nursery Bed",
    image: "mint-compressed.jpg",
    productDetails: "Mint is a perennial herb with very fragrant, toothed leaves and tiny purple, pink, or white flowers. Mints are used as garden accents, ground covers, air fresheners, and herbal medicines. They are easy to grow due to the ability of thriving in sun and shade. Not only does mint add fruity, aromatic flavor to foods and tea, but also, it's useful for health remedies such as aiding digestion and relieving headaches. It is easy to grow. Can be used for Soothing common cold symptoms. Has anti-allergenic effects. Contain antioxidant and anti-inflammatory agents.",
    price: 2400,
    package: "1 Piece"
  }
];

const basePath = './agrof-main/mobile/app/assets/store/NURSERY_BED';

// Create base directory if it doesn't exist
if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
  console.log('📁 Created NURSERY_BED directory\n');
}

const formatPrice = (price) => `UGX ${price.toLocaleString()}`;

function generateProductMD(product) {
  let content = `# ${product.name}\n\n`;
  content += `## Overview\n${product.productDetails}\n\n`;
  content += `## Supplier\n**${product.supplier}**\n\n`;
  
  if (product.specifications) {
    content += `## Specifications\n${product.specifications}\n\n`;
  }
  
  content += `## Pricing\n\n**Price**: ${formatPrice(product.price)}\n`;
  content += `**Package**: ${product.package}\n\n`;
  
  content += `## Why Buy From Us?\n`;
  content += `- ✓ Healthy, disease-free plants\n`;
  content += `- ✓ Expert growing advice included\n`;
  content += `- ✓ Fast delivery\n`;
  content += `- ✓ Quality guaranteed\n\n`;
  
  content += `## Ordering & Delivery\n`;
  content += `- **Stock**: ✅ Available\n`;
  content += `- **Delivery**: 1-3 days\n`;
  content += `- **Payment**: Mobile money, Cash on delivery\n`;
  content += `- **Support**: +256 700 123 456\n`;
  
  return content;
}

function generatePricingJSON(product) {
  return {
    productName: product.name,
    supplier: product.supplier,
    category: product.category,
    displayPrice: formatPrice(product.price),
    lowestPrice: product.price,
    productDetails: product.productDetails,
    specifications: product.specifications || "",
    packages: [{
      size: product.package,
      tiers: [{
        quantity: "1+ units",
        quantityValue: 1,
        pricePerUnit: product.price,
        priceFormatted: formatPrice(product.price)
      }]
    }]
  };
}

console.log('\n' + '='.repeat(60));
console.log('CREATING ALL NURSERY BED PRODUCTS');
console.log('='.repeat(60) + '\n');

let created = 0;

nurseryBedData.forEach((product, index) => {
  const productDir = path.join(basePath, product.name);
  
  // Create directory
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir, { recursive: true });
  }
  
  console.log(`[${index + 1}/${nurseryBedData.length}] 📁 ${product.name}`);
  
  // Create product.md
  const productMD = generateProductMD(product);
  fs.writeFileSync(path.join(productDir, 'product.md'), productMD);
  console.log(`   ✅ Created product.md`);
  
  // Create pricing.json
  const pricingJSON = generatePricingJSON(product);
  fs.writeFileSync(path.join(productDir, 'pricing.json'), JSON.stringify(pricingJSON, null, 2));
  console.log(`   ✅ Created pricing.json`);
  
  // Note about image (images should already exist in old Nursery_bed folder)
  console.log(`   📸 Image: ${product.image}`);
  console.log('');
  created++;
});

console.log('='.repeat(60));
console.log('COMPLETE');
console.log('='.repeat(60));
console.log(`\n✅ Created: ${created} nursery bed products\n`);
console.log('Note: Images are in old Nursery_bed folder. Will be imported to database with correct paths.');




