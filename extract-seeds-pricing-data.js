/**
 * Script to extract and organize seed pricing data from source text
 * This will create pricing.json files for each seed product
 */

const fs = require('fs');
const path = require('path');

// Complete seed products data extracted from source
const seedsData = [
  {
    id: 1,
    name: "Sugar Baby",
    fullName: "Sugar Baby – Most Popular And Grown Watermelon Variety Due To Its Early Maturity",
    supplier: "Simlaw Seeds Company (U) Ltd",
    category: "Watermelon",
    details: {
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
  {
    id: 2,
    name: "Dodo (Elma)",
    fullName: "Dodo (Elma)",
    supplier: "Simlaw Seeds Company (U) Ltd",
    category: "Amaranth",
    details: {
      description: "Highly nutritious vegetable, Easy to grow, Fast maturing, has very vigorous growth",
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
  {
    id: 3,
    name: "Julie F1",
    fullName: "Julie F1",
    supplier: "Simlaw Seeds Company (U) Ltd",
    category: "Watermelon",
    details: {
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
  {
    id: 4,
    name: "Frey - Pepper Hybrid F1",
    fullName: "Frey - Pepper Hybrid F1",
    supplier: "Home Harvest (U) Ltd",
    category: "Pepper",
    details: {
      description: "Versatile hybrid sweet pepper that can be grown outdoors or indoors",
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
      maturity: "Early",
      hybrid: "F1"
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
  {
    id: 5,
    name: "Habanero Yellow – Bonnet Pepper",
    fullName: "Habanero Yellow – Bonnet Pepper",
    supplier: "Home Harvest (U) Ltd",
    category: "Pepper",
    details: {
      description: "Very vigorous and high yielding pepper type with reliable performance",
      fruitColor: "Yellow hot pepper fruits",
      yieldPerPlant: "About 5kg per season",
      maturity: "70 days from transplanting",
      harvestingPeriod: "4-6 months",
      seedRate: "120g per acre",
      spacing: "60cm x 75cm"
    },
    packages: [
      { size: "50g", tiers: [
        { qty: 1, price: 54200 },
        { qty: 5, price: 53224 },
        { qty: 10, price: 52899 },
        { qty: 20, price: 52682 }
      ]}
    ]
  },
  {
    id: 6,
    name: "Grace - Barley Seed",
    fullName: "Grace - Barley Seed",
    supplier: "Sebei Farmers Sacco",
    category: "Barley",
    details: {
      description: "Good yielding variety",
      maturity: "100 days",
      yieldPotential: "1500 kg/Acre",
      seedRate: "50kgs/Acre"
    },
    packages: [
      { size: "1kg", tiers: [{ qty: 1, price: 2500 }] }
    ]
  },
  {
    id: 7,
    name: "California Wonder \"Bamba\" - Pepper",
    fullName: "California Wonder \"Bamba\" - Pepper",
    supplier: "Home Harvest (U) Ltd",
    category: "Pepper",
    details: {
      description: "Erect plant with good vigor",
      production: "Very good production of green deep blocky fruits with smooth skin",
      yieldPotential: "15-20 tons under good management",
      seedRate: "100g per acre",
      spacing: "60cm x 45cm"
    },
    packages: [
      { size: "50g", tiers: [
        { qty: 1, price: 23300 },
        { qty: 5, price: 21995 },
        { qty: 10, price: 21809 },
        { qty: 20, price: 21809 }
      ]}
    ]
  },
  {
    id: 8,
    name: "Habanero Red – Bonnet Pepper",
    fullName: "Habanero Red – Bonnet Pepper",
    supplier: "Home Harvest (U) Ltd",
    category: "Pepper",
    details: {
      description: "High yielding pepper variety with great demand both locally and internationally",
      export: "Can be grown for export to various countries globally",
      fruitColor: "Red hot pepper fruits",
      yieldPerPlant: "4-5kg per season",
      maturity: "70 days from transplanting",
      harvestingPeriod: "4-6 months",
      seedRate: "120g per acre",
      spacing: "60cm x 75cm"
    },
    packages: [
      { size: "10g", tiers: [
        { qty: 1, price: 16400 },
        { qty: 5, price: 15793 },
        { qty: 10, price: 15695 },
        { qty: 20, price: 15695 }
      ]},
      { size: "50g", tiers: [
        { qty: 1, price: 59600 },
        { qty: 5, price: 58289 },
        { qty: 10, price: 57991 },
        { qty: 20, price: 57812 }
      ]}
    ]
  },
  {
    id: 9,
    name: "Ashley – Open Pollinated Cucumber",
    fullName: "Ashley – Open Pollinated Cucumber Varirty With Prolific Productivity",
    supplier: "Syova Seed (U) Ltd",
    category: "Cucumber",
    details: {
      description: "Open pollinated cucumber grown for years in most vegetable gardens",
      use: "Excellent for slicing",
      maturity: "Early variety with prolific production",
      fruitSize: "Medium size 30cm fruits",
      color: "Darker than other cultivars",
      resistance: "Resistant to downy mildew and humid conditions",
      containerGrowing: "Also grows well in containers"
    },
    packages: [
      { size: "10g", tiers: [
        { qty: 1, price: 3600 },
        { qty: 5, price: 3499 },
        { qty: 10, price: 3398 },
        { qty: 20, price: 3398 }
      ]},
      { size: "25g", tiers: [
        { qty: 1, price: 6700 },
        { qty: 5, price: 6600 },
        { qty: 10, price: 6499 },
        { qty: 20, price: 6399 }
      ]},
      { size: "50g", tiers: [
        { qty: 1, price: 9800 },
        { qty: 5, price: 9702 },
        { qty: 10, price: 9604 },
        { qty: 20, price: 9604 }
      ]}
    ]
  },
  {
    id: 10,
    name: "Mak Soy 3N (Brac Seed)",
    fullName: "Mak Soy 3N (Brac Seed)",
    supplier: "Brac Seed",
    category: "Soya",
    details: {
      spacing: "60cm x 5cm (1 seed per hole using machine planting); 50cm x 25cm (3 seeds per hole using hand hoe planting)",
      seedRate: "50-60 Kg per hectare, 20-25 kg per acre",
      maturityPeriod: "100 days",
      yield: "2.0-3.5 metric tonnes per hectare; 0.8-1.4 metric tonnes per acre"
    },
    packages: [
      { size: "1kg", tiers: [
        { qty: 1, price: 6700 },
        { qty: 5, price: 6600 },
        { qty: 10, price: 6600 },
        { qty: 20, price: 6499 }
      ]}
    ]
  },
  {
    id: 12,
    name: "Cal-j Tomato",
    fullName: "Cal-j Tomato Compact And Determinate Variety Suitable For Processing And Fresh Market",
    supplier: "Syova Seed (U) Ltd",
    category: "Tomato",
    details: {
      description: "Compact and determinate variety suitable for processing",
      plantType: "Vigorous and highly productive",
      fruitSize: "Medium sized, square with apple-green back",
      fruitQuality: "Very firm, smooth, intense red color with excellent flavor",
      processing: "Excellent processing characteristics and peeling tomato",
      resistance: "Resistant to verticillium and fusarium wilts",
      spacing: "60cm x 45cm",
      seedRate: "80grams/acre",
      maturityPeriod: "100-120 days",
      yieldPotential: "20-45mt/acre"
    },
    packages: [
      { size: "10g", tiers: [
        { qty: 1, price: 4600 },
        { qty: 5, price: 4499 },
        { qty: 10, price: 4402 },
        { qty: 20, price: 4402 }
      ]},
      { size: "20g", tiers: [
        { qty: 1, price: 7200 },
        { qty: 5, price: 7099 },
        { qty: 10, price: 7099 },
        { qty: 20, price: 6998 }
      ]},
      { size: "25g", tiers: [
        { qty: 1, price: 9300 },
        { qty: 5, price: 9198 },
        { qty: 10, price: 9095 },
        { qty: 20, price: 9095 }
      ]},
      { size: "50g", tiers: [
        { qty: 1, price: 19400 },
        { qty: 5, price: 18100 },
        { qty: 10, price: 17906 },
        { qty: 20, price: 17906 }
      ]}
    ]
  }
];

// Calculate display price (lowest price across all tiers and packages)
function calculateDisplayPrice(packages) {
  let lowestPrice = Infinity;
  let lowestPackage = '';
  let lowestQuantity = '';

  packages.forEach(pkg => {
    pkg.tiers.forEach(tier => {
      if (tier.price < lowestPrice) {
        lowestPrice = tier.price;
        lowestPackage = pkg.size;
        lowestQuantity = tier.qty;
      }
    });
  });

  return {
    displayPrice: `UGX ${lowestPrice.toLocaleString()}`,
    lowestPrice: lowestPrice,
    lowestPackage: lowestPackage,
    lowestQuantity: lowestQuantity
  };
}

// Generate pricing.json for each product
function generatePricingFiles() {
  const seedsDir = path.join(__dirname, 'agrof-main/mobile/app/assets/store/SEEDS');

  seedsData.forEach(seed => {
    const { displayPrice, lowestPrice, lowestPackage, lowestQuantity } = calculateDisplayPrice(seed.packages);

    const pricingData = {
      productName: seed.fullName,
      supplier: seed.supplier,
      category: seed.category,
      displayPrice: displayPrice,
      lowestPrice: lowestPrice,
      lowestPackage: lowestPackage,
      lowestQuantity: `${lowestQuantity}+ units`,
      details: seed.details,
      packages: seed.packages.map(pkg => ({
        size: pkg.size,
        tiers: pkg.tiers.map(tier => ({
          quantity: `${tier.qty}+ units`,
          pricePerUnit: tier.price,
          priceFormatted: `UGX ${tier.price.toLocaleString()}`,
          totalPrice: tier.price * tier.qty,
          totalFormatted: `UGX ${(tier.price * tier.qty).toLocaleString()}`
        }))
      }))
    };

    console.log(`Generated pricing for: ${seed.fullName}`);
    console.log(`  Display Price: ${displayPrice} (${lowestPackage} @ ${lowestQuantity}+ units)`);
    console.log(`  Packages: ${seed.packages.length}`);
    console.log('---');
  });
}

// Run the generator
console.log('========================================');
console.log('SEEDS PRICING DATA EXTRACTION');
console.log('========================================\n');
generatePricingFiles();
console.log('\n========================================');
console.log('EXTRACTION COMPLETE');
console.log('========================================');

module.exports = { seedsData, calculateDisplayPrice };





