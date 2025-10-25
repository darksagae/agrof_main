/**
 * Comprehensive script to update all seed products with correct pricing and information
 * Based on source data provided by user
 */

const fs = require('fs');
const path = require('path');

// Helper function to format price
const formatPrice = (price) => `UGX ${price.toLocaleString()}`;

// Helper function to get lowest price
function getLowestPrice(packages) {
  let lowest = Infinity;
  let lowestPkg = '';
  packages.forEach(pkg => {
    pkg.tiers.forEach(tier => {
      if (tier.price < lowest) {
        lowest = tier.price;
        lowestPkg = `${pkg.size} @ ${tier.qty}+ units`;
      }
    });
  });
  return { price: lowest, package: lowestPkg };
}

// Helper function to generate pricing section for product.md
function generatePricingSection(packages) {
  const { price, package: lowestPkg } = getLowestPrice(packages);
  
  let section = `## Price Information\n\n`;
  section += `**Starting from**: ${formatPrice(price)} (${lowestPkg})\n\n`;
  section += `### Available Packages\n\n`;

  packages.forEach(pkg => {
    section += `**${pkg.size}**:\n`;
    pkg.tiers.forEach(tier => {
      section += `- ${tier.qty}+ units: ${formatPrice(tier.price)}/unit\n`;
    });
    section += `\n`;
  });

  section += `*Bulk orders: Contact for custom pricing*\n\n`;
  
  return section;
}

// Helper function to generate product.md content
function generateProductMD(product) {
  const { price, package: lowestPkg } = getLowestPrice(product.packages);
  
  let content = `# ${product.fullName}\n\n`;
  content += `## Overview\n`;
  content += `${product.details.description || product.fullName}\n\n`;
  
  content += `## Supplier\n`;
  content += `**${product.supplier}**\n\n`;
  
  content += `## Product Details\n\n`;
  Object.entries(product.details).forEach(([key, value]) => {
    if (key !== 'description' && value) {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      content += `- **${label}**: ${value}\n`;
    }
  });
  content += `\n`;
  
  content += generatePricingSection(product.packages);
  
  content += `## Key Features\n`;
  content += `- High quality seeds from trusted supplier\n`;
  content += `- Multiple packaging options available\n`;
  content += `- Quantity discounts for bulk orders\n`;
  content += `- Fresh stock with high germination rate\n\n`;
  
  content += `## Availability & Delivery\n`;
  content += `- **Stock Status**: In Stock\n`;
  content += `- **Delivery Areas**: Nationwide\n`;
  content += `- **Delivery Time**: 1-2 business days\n`;
  content += `- **Payment**: Cash on delivery, Mobile money\n\n`;
  
  content += `## Storage Instructions\n`;
  content += `- Store in cool, dry place\n`;
  content += `- Keep away from direct sunlight\n`;
  content += `- Maintain low humidity\n`;
  content += `- Shelf life: 2-3 years from packaging date\n\n`;
  
  content += `## Contact Information\n`;
  content += `- **Phone**: +256 700 123 456\n`;
  content += `- **Email**: seeds@agrof.com\n`;
  content += `- **WhatsApp**: +256 700 123 456\n`;
  
  return content;
}

// All 69 products organized by category - continuing from previous script
// I'll start by updating the products we already have, then add the remaining ones

const allSeedsData = {
  "Sugar Baby": {
    folder: "Sugar Baby – Most Popular And Grown Watermelon Variety Due To Its Early Maturity",
    fullName: "Sugar Baby – Most Popular And Grown Watermelon Variety Due To Its Early Maturity",
    supplier: "Simlaw Seeds Company (U) Ltd",
    category: "Watermelon",
    details: {
      description: "Sugar Baby is the most popular and widely grown watermelon variety due to its early maturity, small to medium size, and high yield potential. Produces sweet, crisp red flesh fruits.",
      potentialFruitWeight: "5-8kgs",
      yieldPotential: "48-50 tons per acre",
      durationToMaturity: "80 days",
      spacing: "100x100cm",
      seedRate: "500 grams per acre",
      approximateSeedCount: "20 seeds per gram",
      specialAttributes: "Dark green, round watermelon, Very uniform growth, Very adoptable and grows on wide range of soils"
    },
    packages: [
      { size: "10g", tiers: [{ qty: 1, price: 2100 }] },
      { size: "20g", tiers: [{ qty: 1, price: 3200 }] },
      { size: "25g", tiers: [{ qty: 1, price: 3800 }] },
      { size: "50g", tiers: [{ qty: 1, price: 8700 }] },
      { size: "250g", tiers: [{ qty: 1, price: 34900 }] },
      { size: "500g", tiers: [{ qty: 1, price: 67200 }] },
      { size: "1kg", tiers: [{ qty: 1, price: 128900 }] }
    ]
  },
  
  "Dodo (Elma)": {
    folder: "Dodo (Elma)",
    fullName: "Dodo (Elma)",
    supplier: "Simlaw Seeds Company (U) Ltd",
    category: "Amaranth",
    details: {
      description: "Dodo (Elma) is a highly nutritious vegetable that is easy to grow, fast maturing, and has very vigorous growth. It transports well and is quick to cook.",
      nutritionalValue: "Highly nutritious vegetable",
      growingCharacteristics: "Easy to grow, Fast maturing, Very vigorous growth",
      transportQuality: "Transports well",
      cookingQuality: "Quick to cook",
      maturity: "Harvesting start 40-45 days from planting",
      tolerantTo: "Yellow Vein Mosaic Virus (YVMV)"
    },
    packages: [
      { size: "10g", tiers: [
        { qty: 1, price: 1400 },
        { qty: 5, price: 1322 },
        { qty: 10, price: 1308 },
        { qty: 20, price: 1303 }
      ]},
      { size: "20g", tiers: [
        { qty: 1, price: 2600 },
        { qty: 5, price: 2452 },
        { qty: 10, price: 2436 },
        { qty: 20, price: 2428 }
      ]},
      { size: "50g", tiers: [
        { qty: 1, price: 4300 },
        { qty: 5, price: 4154 },
        { qty: 10, price: 4137 },
        { qty: 20, price: 4124 }
      ]},
      { size: "250g", tiers: [
        { qty: 1, price: 16500 },
        { qty: 5, price: 16302 },
        { qty: 10, price: 16253 },
        { qty: 20, price: 16220 }
      ]},
      { size: "500g", tiers: [
        { qty: 1, price: 23300 },
        { qty: 5, price: 23230 },
        { qty: 10, price: 23160 },
        { qty: 20, price: 23067 }
      ]},
      { size: "1kg", tiers: [
        { qty: 1, price: 46300 },
        { qty: 5, price: 46207 },
        { qty: 10, price: 46022 },
        { qty: 20, price: 40142 }
      ]}
    ]
  },

  "Julie F1": {
    folder: "Julie F1",
    fullName: "Julie F1",
    supplier: "Simlaw Seeds Company (U) Ltd",
    category: "Watermelon",
    details: {
      description: "Julie F1 is a very popular hybrid watermelon with oblong shaped fruit, very sweet red flesh, and excellent disease tolerance.",
      potentialFruitWeight: "10-12kgs",
      yieldPotential: "35-40 tons per acre",
      durationToMaturity: "85 days",
      seedRate: "500 grams per acre",
      approximateSeedCount: "20 seeds per gram",
      specialAttributes: "A very popular hybrid with oblong shaped fruit. Very sweet red flesh. Tolerant to fusarium wilt and anthracnose"
    },
    packages: [
      { size: "5g", tiers: [
        { qty: 1, price: 3800 },
        { qty: 5, price: 3648 },
        { qty: 10, price: 3633 },
        { qty: 20, price: 3621 }
      ]},
      { size: "10g", tiers: [
        { qty: 1, price: 7200 },
        { qty: 5, price: 7049 },
        { qty: 10, price: 7020 },
        { qty: 20, price: 6998 }
      ]},
      { size: "25g", tiers: [
        { qty: 1, price: 17600 },
        { qty: 5, price: 17406 },
        { qty: 10, price: 17354 },
        { qty: 20, price: 17318 }
      ]},
      { size: "50g", tiers: [
        { qty: 1, price: 33800 },
        { qty: 5, price: 33462 },
        { qty: 10, price: 33394 },
        { qty: 20, price: 33293 }
      ]},
      { size: "100g", tiers: [
        { qty: 1, price: 64900 },
        { qty: 5, price: 64316 },
        { qty: 10, price: 64121 },
        { qty: 20, price: 56074 }
      ]},
      { size: "250g", tiers: [
        { qty: 1, price: 163700 },
        { qty: 5, price: 140618 },
        { qty: 10, price: 142583 },
        { qty: 20, price: 142419 }
      ]},
      { size: "500g", tiers: [
        { qty: 1, price: 324600 },
        { qty: 5, price: 285323 },
        { qty: 10, price: 285323 },
        { qty: 20, price: 285323 }
      ]}
    ]
  },

  "Frey - Pepper Hybrid F1": {
    folder: "Frey - Pepper Hybrid F1",
    fullName: "Frey - Pepper Hybrid F1",
    supplier: "Home Harvest (U) Ltd",
    category: "Pepper",
    details: {
      description: "Frey is a versatile hybrid sweet pepper that can be grown outdoors or indoors. Produces uniform fruits measuring 12x10cm that go from green to red.",
      fruitSize: "12x10cm",
      fruitColor: "Green -> Red",
      walls: "Thick",
      shape: "Blocky",
      diseaseResistance: "Potato Virus Y (PVY:0,1), Tobamovirus (TM:0-3)",
      vigour: "Strong",
      leafCover: "Good",
      internodeLength: "Short",
      height: "Medium (indoors), Semi-compact (outdoors)",
      cultivation: "Open Field, Tunnel",
      uniformity: "High",
      maturity: "Early"
    },
    packages: [
      { size: "5g", tiers: [
        { qty: 1, price: 38800 },
        { qty: 5, price: 37403 },
        { qty: 10, price: 37287 },
        { qty: 20, price: 37209 }
      ]}
    ]
  },

  "Habanero Yellow – Bonnet Pepper": {
    folder: "Habanero Yellow – Bonnet Pepper",
    fullName: "Habanero Yellow – Bonnet Pepper",
    supplier: "Home Harvest (U) Ltd",
    category: "Pepper",
    details: {
      description: "Habanero Yellow is a very vigorous and high yielding pepper type with reliable performance in a wide range of growing conditions.",
      fruitColor: "Yellow hot pepper fruits",
      yieldPerPlant: "About 5kg per season",
      maturity: "70 days from transplanting",
      harvestingPeriod: "4-6 months",
      seedRate: "120g per acre",
      spacing: "60cm x 75cm",
      commercialPotential: "Good commercial horticultural crop with high profitability potential"
    },
    packages: [
      { size: "50g", tiers: [
        { qty: 1, price: 54200 },
        { qty: 5, price: 53224 },
        { qty: 10, price: 52899 },
        { qty: 20, price: 52682 }
      ]}
    ]
  }
};

// Function to update a single product
function updateProduct(productKey) {
  const product = allSeedsData[productKey];
  if (!product) {
    console.log(`⚠️  Product "${productKey}" not found in dataset`);
    return;
  }

  const productDir = path.join(__dirname, 'agrof-main/mobile/app/assets/store/SEEDS', product.folder);
  const productMDPath = path.join(productDir, 'product.md');

  // Check if directory exists
  if (!fs.existsSync(productDir)) {
    console.log(`⚠️  Directory not found: ${product.folder}`);
    return;
  }

  // Generate new product.md content
  const content = generateProductMD(product);

  // Write the file
  fs.writeFileSync(productMDPath, content, 'utf8');
  console.log(`✅ Updated: ${product.fullName}`);
  
  // Also create pricing.json
  const pricingData = {
    productName: product.fullName,
    supplier: product.supplier,
    category: product.category,
    displayPrice: formatPrice(getLowestPrice(product.packages).price),
    lowestPackage: getLowestPrice(product.packages).package,
    details: product.details,
    packages: product.packages
  };
  
  const pricingPath = path.join(productDir, 'pricing.json');
  fs.writeFileSync(pricingPath, JSON.stringify(pricingData, null, 2), 'utf8');
  console.log(`   📝 Created pricing.json`);
}

// Main execution
console.log('\n========================================');
console.log('UPDATING ALL SEED PRODUCTS');
console.log('========================================\n');

// Update first 5 products as test
Object.keys(allSeedsData).forEach(key => {
  updateProduct(key);
  console.log('');
});

console.log('========================================');
console.log('UPDATE COMPLETE - First 5 products');
console.log('========================================\n');
console.log('Total products in dataset:', Object.keys(allSeedsData).length);
console.log('Remaining products: 64');
console.log('\nNote: This is a partial update. Continue adding remaining 64 products...\n');





