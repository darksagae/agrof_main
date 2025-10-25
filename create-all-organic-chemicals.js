/**
 * Create ALL 14 Organic Chemical Products
 * Based on source data provided
 */

const fs = require('fs');
const path = require('path');

const organicChemicalsData = [
  {
    name: "Orb-l - Organic Rooting Booster",
    folder: "Orb-l - Organic Rooting Booster",
    supplier: "Vermipro Limited",
    category: "Organic Chemicals",
    image: "orb_l.jpg",
    productDetails: "ORB-L is a Hormonal Rooting for Plant Cuttings, Organic Natural Plant Hormone that Stimulates & Speeds Root Development on Cuttings. Promotes Strong Healthy Roots. Ingredients: Fructose, glucose, fructo-oligosaccharides, amino acids, vitamins, minerals and enzymes, cinnamaldehyde and trans-cinnamaldehyde",
    specifications: {
      "Directions for use": "Dip cutting in ORB-L to a desired depth. Insert cutting into rooting medium. Mist cuttings and place in a propagator or a warm, clean moist and humid environment. Look for root development in 1 to 2 weeks.",
      "Key Benefits": "For plant propagation & plant cutting, For promoting root development, For softwood, semi ripe, & hardwood cuttings, Allows for greater success rates in plant propagation, Stimulates roots development, Improve chances of cuttings survival, Faster root establishment"
    },
    packages: [
      { size: "250ml", tiers: [{ qty: 1, price: 27500 }] },
      { size: "500ml", tiers: [{ qty: 1, price: 53000 }] }
    ]
  },
  {
    name: "Vermichar – Organic Soil Supplement",
    folder: "Vermichar – Organic Soil Supplement For Improving Plant Growth And Soil Properties",
    supplier: "Vermipro Limited",
    category: "Organic Chemicals",
    image: "vermichar.png",
    productDetails: "Vermichar is used as a sustainable approach for improving plant Growth and soil properties. Vermichar application to the soil is a practical method to increase crop yield and enhance pesticide degradation. Active Ingredients: Activated carbon, Enzymes and beneficial micro-organisms",
    specifications: {
      "Directions for use": "In general gardening, Incorporate 1-5kg/m2 into the soil to a depth of 10cm before planting. In horticulture, incorporate 10% volume into soil before planting. In tree plantations like coffee, put into furrows or holes, or broadcast, and then cover with soil timely",
      "Key Benefits": "Enhances plant growth, Habitat for microbes, Retains moisture, Holds nutrients"
    },
    packages: [
      { size: "5kg", tiers: [{ qty: 1, price: 22500 }] },
      { size: "10kg", tiers: [{ qty: 1, price: 42800 }] }
    ]
  },
  {
    name: "Superagric Soil And Vegetable",
    folder: "Superagric Soil And Vegetable – Organic Solution For Improving Soil Health",
    supplier: "Vermipro Limited",
    category: "Organic Chemicals",
    image: "superagric_silage.jpeg",
    productDetails: "The combination of microbes in Super Agric, have a reviving action on an ecosystem and are completely safe to use. In the soil Super Agric will function by increasing the beneficial microbes which will improve soil health and function. Super Agric will also improve fertiliser effectiveness by reducing leaching and improving plant availability leading to increased performance in your farming system, and improves seeds germination. Active Ingredients: Beneficial Microorganisms and Organic Preservatives",
    specifications: {
      "Directions for use": "Dilute 1L to 50L of non-chlorine water. Apply 150 - 250L per acre during growth stages. Irrigation system. Rates of 250L per acre are recommended",
      "Key Benefits": "Converting organic matter to plant nutrients, Fixing atmospheric nitrogen, Decomposing organic residues, Recycling soil nutrients"
    },
    packages: [
      { size: "1ltr", tiers: [{ qty: 1, price: 37800 }] },
      { size: "5ltr", tiers: [{ qty: 1, price: 180800 }] }
    ]
  },
  {
    name: "Sg1000 – Organic Solution For Photosynthesis Enhancement",
    folder: "Sg1000 – Organic Solution For Photosynthesis Enhancement",
    supplier: "Vermipro Limited",
    category: "Organic Chemicals",
    image: "sg1000.png",
    productDetails: "SG1000 enhances the process of photosynthesis. It is a formula that has been developed to enhance photosynthesis and biological functions by allowing plants to capture and utilize radiant energy more efficiently. It speeds up uptake and distribution of macro and micro nutrients required for plant growth and increased yields whilst reducing input costs. Active Ingredients: Biostimulants are made up of a variety of biological substances, micro-organisms, and compounds",
    specifications: {
      "Directions for use": "For Crops and Vegetables apply 1L of SG1000 in 200L to water (100ml in 20L). Spray on the soil in the morning. Spray 200L per acre",
      "Key Benefits": "Decomposes toxic matters like the organic materials, hydrogen Sulfide, Nitrous acid and Ammonia, Removes soil toxicity"
    },
    packages: [
      { size: "1ltr", tiers: [{ qty: 1, price: 53000 }] },
      { size: "3ltr", tiers: [{ qty: 1, price: 180800 }] }
    ]
  },
  {
    name: "Vermicompost 100 - Premium Organic Fertilizer",
    folder: "Vermicompost 100",
    supplier: "Vermipro Limited",
    category: "Organic Chemicals",
    image: "vermicompost_100.png",
    productDetails: "Vermicompost 100 contain higher percentage of both macro and micronutrients than the garden compost. Apart from other nutrients, a fine worm cast is rich in NPK which are in readily available form. Vermicompost enhances plant growth, suppresses disease in plants, increases porosity and microbial activity in soil, and improves water retention and aeration. Active Ingredients: Earthworm castings, organic matter, natural enzymes and hormones",
    specifications: {
      "Directions for use": "Mix vermicompost100 in a ratio of 1:4 to soil. Top dress in potted plants, gardens or lawns. In general gardening, apply 1000kg/ha. In horticulture, apply 50-100g per plant. In tree plantations like coffee, apply 250-500g per plant per season",
      "Key Benefits": "Soil Conditioner, Nutrient Retention of Soil, Pest Resistant, Better Aeration, Water Retention, Healthier Plants, Root Penetration, 100% Organic"
    },
    packages: [
      { size: "5kg", tiers: [{ qty: 1, price: 27500 }] },
      { size: "10kg", tiers: [{ qty: 1, price: 53000 }] }
    ]
  },
  {
    name: "Calphos – Organic Solution For Improved Fruit Development",
    folder: "Calphos – Organic Solution For Improved Fruit And Flower Development",
    supplier: "Vermipro Limited",
    category: "Organic Chemicals",
    image: "calphos_organic.jpeg",
    productDetails: "Calphos is a nutrient solution for plants just entering the flowering cycle. In natural farming, apply Calphos before the flower initiation to reduce flower abortion and support the eventual fruit. Calcium is used to strengthen the plant in preparation for heavy flowers/fruits. Main Ingredients: Natural source of calcium and phosphorous",
    specifications: {
      "Directions for use": "Apply 200ml of Calphos diluted in 20L of water for fruits and vegetables before flowering. Apply 100L for 1 Acre",
      "Key Benefits": "Reduces flower abortion, Improves fruit development, Improves fruit ripening and quality"
    },
    packages: [
      { size: "250ml", tiers: [{ qty: 1, price: 16000 }] },
      { size: "1ltr", tiers: [{ qty: 1, price: 53000 }] }
    ]
  },
  {
    name: "Superagric Germination Booster",
    folder: "Superagric Germination Booster – Organic Product For Improving Germination",
    supplier: "Vermipro Limited",
    category: "Organic Chemicals",
    image: "superagric_germination_booster.jpeg",
    productDetails: "Super germination booster is a natural safe technology with many applications around farm, orchard, and vineyard environments. The organic product, superagric germination booster works by getting the natural processes to function, the way nature intended. Active Ingredients: Beneficial micro-organisms",
    specifications: {
      "Directions for use": "Soak seeds in a solution at rate of 1:20 litres. Spread them in a shade to dry, then plant. Seed Size and Time to soak - Small: 20-30 mins, Medium: 30-60 mins, Large: 2-3 Hrs",
      "Key Benefits": "Improves seed viability, germination. Enhances plant growth"
    },
    packages: [
      { size: "250ml", tiers: [{ qty: 1, price: 17000 }] },
      { size: "1ltr", tiers: [{ qty: 1, price: 37800 }] }
    ]
  },
  {
    name: "Fungicide – Organic Product",
    folder: "Fungicide – Organic Product For Controlling Powdery Mildew And Other Fungal Diseases",
    supplier: "Vermipro Limited",
    category: "Organic Chemicals",
    image: "fungicide.png",
    productDetails: "A fungicide for the control of powdery mildew and other diseases on terrestrial and indoor ornamental plants, greenhouse and garden crops, and turf. Active Ingredients: Potassium Bicarbonate 35.00% + Other Ingredients 65.00%",
    specifications: {
      "Directions for use": "Start application at first sign of disease. For best protection, repeat at one to two week intervals. Mature Plantation: Mix 3.5kg of fungicide into 300L of water (25 tablespoons in 20L). Apply 100L per acre. Vegetables/Nurseries: Mix 1kg of fungicide into 200L of water (5 tablespoons in 20L). Apply 100L per acre"
    },
    packages: [
      { size: "700g", tiers: [{ qty: 1, price: 12500 }] },
      { size: "3.5kg", tiers: [{ qty: 1, price: 55800 }] }
    ]
  },
  {
    name: "Humate – Pure Organic Fertilizer",
    folder: "Humate",
    supplier: "Bukoola Chemical Industries (U) Ltd",
    category: "Organic Chemicals",
    image: "humate.jpg",
    productDetails: "Humate is the purest form of organic matter that has completely decayed and offers a great range of benefits to rejuvenate a soil and significantly allow for optimum output from agricultural soils.",
    specifications: {
      "Directions for use": "During dry season: Mix 1kg per 20ltrs of water and apply on the soil and allow ground to drain. During wet season: Mix 3 table spoons of Humate and apply directly to the root zone of the plant.",
      "Key Benefits": "Builds stronger root system, Facilitates nutrient absorption, Great source of energy for beneficial soil organisms, Improves aeration and water retention, Prevents water and nutrient losses"
    },
    packages: [
      { size: "1kg", tiers: [{ qty: 1, price: 12000 }] }
    ]
  },
  {
    name: "Seek Bamboo Biochar Fertilizer",
    folder: "Seek Bamboo Biochar Fertilizer – High Quality Organic Fertilizer",
    supplier: "Bukoola Chemical Industries (U) Ltd",
    category: "Organic Chemicals",
    image: "seek_bambo.png",
    productDetails: "Product that gives excellent plant growth, rebuilds soil and offers higher production yields. It is made from Bamboo products, food grade organic matter, beneficial micro-organisms and amino acids of vegetable origin.",
    specifications: {
      "Method of use": "Put into furrows or holes or broadcast and then cover with soil timely. Vegetables: 80-100kgs per acre, Fruits: 0.5-1kg per tree, Horticulture: 5-10kgs mixed with 100 kg substrate, Field crops: 100-120kgs per acre"
    },
    packages: [
      { size: "25kg", tiers: [{ qty: 1, price: 90000 }] }
    ]
  },
  {
    name: "Fertiplus 4-3-3-65 Organic Fertilizer",
    folder: "Fertiplus",
    supplier: "Fertiplus Organic Ltd",
    category: "Organic Chemicals",
    image: "fertiplus.jpg",
    productDetails: "Fertiplus Organic Fertilizer 4-3-3-65 OM is a well-known 100% Organic Fertilizer pellet, ecologic/environmentally friendly and hygienic. The organic material contains mostly humic acid structures which benefit soils in facilitating its nutrient availability. Composition: Dry Matter 88% min; Moisture 12% max; Organic Matter 65%; Nitrogen (Total) 4.2%; Phosphorus 3.0%; Potassium 2.8%; Calcium 9%; Magnesium 1%; Sulphur 1.5% + Trace elements. pH:6.4, Pellet diameter: 5-6mm",
    specifications: {
      "Application": "Considerable saving in mineral Fertilizers, and a reduction of mineral Fertilizers application in the soil"
    },
    packages: [
      { size: "25kg", tiers: [{ qty: 1, price: 79875 }] }
    ]
  },
  {
    name: "Oscars Primo Organic Fertilizer",
    folder: "Oscars Primo (Organic Fertilizer)",
    supplier: "Trax Holdings Ltd",
    category: "Organic Chemicals",
    image: "oscars_primo.jpg",
    productDetails: "OSCARS PRIMO, is very effective and increase efficiency of all nutrients during spraying. It causes the leaves to release high life energy and the process rise up chlorophyll quantity and accelerates photosynthesis. The plant fixes all the nutrients itself by increasing resistance against diseases. Its effective in flowering, sprouting of new shoots, and fruiting.",
    packages: [
      { size: "1kg", tiers: [{ qty: 1, price: 90700 }] }
    ]
  },
  {
    name: "Solum2soil Organic Vermicompost Fertilizer",
    folder: "Solum2soil (Organic, Solid Vermicompost Fertilizer)",
    supplier: "Trax Holdings Ltd",
    category: "Organic Chemicals",
    image: "solum2soil.png",
    productDetails: "Solum2Soil is 100% solid organic vermicompost and it is produced as a bottom fertilizer with intent to feed the soil and increase biological variability in the soil. Solum2Soil increases productivity of the soil by improving many elements that affect growing of the plant in the soil. Solum2Soil takes place among the basic products for regaining of the soils having low organic substances and disturbed soils, increasing of productivity that is obtained from unit area and providing of sustainable agriculture.",
    packages: [
      { size: "bag", tiers: [{ qty: 1, price: 75000 }] }
    ]
  },
  {
    name: "Oscars Oligo Organic EC Fertilizer",
    folder: "Oscars Oligo (Organic Ec Fertilizer)",
    supplier: "Trax Holdings Ltd",
    category: "Organic Chemicals",
    image: "oscars_oligo.jpg",
    productDetails: "Prevents occurrence of defects in fruits and vegetables such as colour, shape, taste, by balancing nutrient uptake by the plants.",
    packages: [
      { size: "1kg", tiers: [{ qty: 1, price: 64800 }] }
    ]
  }
];

const formatPrice = (price) => `UGX ${price.toLocaleString()}`;

function getLowestPrice(packages) {
  let lowest = Infinity;
  packages.forEach(pkg => {
    pkg.tiers.forEach(tier => {
      if (tier.price < lowest) lowest = tier.price;
    });
  });
  return lowest;
}

function generateProductMD(product) {
  const lowestPrice = getLowestPrice(product.packages);
  
  let content = `# ${product.name}\n\n`;
  content += `## Overview\n${product.productDetails}\n\n`;
  content += `## Supplier\n**${product.supplier}**\n\n`;
  
  if (product.specifications) {
    content += `## Product Specifications\n\n`;
    Object.entries(product.specifications).forEach(([key, value]) => {
      content += `### ${key}\n${value}\n\n`;
    });
  }
  
  content += `## Pricing\n\n**Price**: ${formatPrice(lowestPrice)}\n\n`;
  content += `### Available Packages\n\n`;
  
  product.packages.forEach(pkg => {
    content += `**${pkg.size}**:\n`;
    pkg.tiers.forEach(tier => {
      content += `- ${tier.qty}+ units: ${formatPrice(tier.price)}/unit\n`;
    });
    content += `\n`;
  });
  
  content += `## Why Buy From Us?\n`;
  content += `- ✓ 100% Organic and certified\n`;
  content += `- ✓ Trusted supplier\n`;
  content += `- ✓ Fast delivery nationwide\n`;
  content += `- ✓ Quality guaranteed\n\n`;
  
  content += `## Ordering & Delivery\n`;
  content += `- **Stock**: ✅ Available\n`;
  content += `- **Delivery**: 1-3 days nationwide\n`;
  content += `- **Payment**: Mobile money, Cash on delivery\n`;
  content += `- **Support**: +256 700 123 456\n`;
  
  return content;
}

function generatePricingJSON(product) {
  const lowestPrice = getLowestPrice(product.packages);
  
  return {
    productName: product.name,
    supplier: product.supplier,
    category: product.category,
    displayPrice: formatPrice(lowestPrice),
    lowestPrice: lowestPrice,
    productDetails: product.productDetails,
    specifications: product.specifications || {},
    packages: product.packages.map(pkg => ({
      size: pkg.size,
      tiers: pkg.tiers.map(tier => ({
        quantity: `${tier.qty}+ units`,
        quantityValue: tier.qty,
        pricePerUnit: tier.price,
        priceFormatted: formatPrice(tier.price)
      }))
    }))
  };
}

const basePath = './agrof-main/mobile/app/assets/store/ORGANIC_CHEMICALS';

console.log('\n' + '='.repeat(60));
console.log('CREATING ALL ORGANIC CHEMICAL PRODUCTS');
console.log('='.repeat(60) + '\n');

let created = 0;
let updated = 0;

organicChemicalsData.forEach((product, index) => {
  const productDir = path.join(basePath, product.folder);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir, { recursive: true });
    console.log(`[${index + 1}/${organicChemicalsData.length}] 📁 Created folder: ${product.folder}`);
    created++;
  } else {
    console.log(`[${index + 1}/${organicChemicalsData.length}] 📂 Folder exists: ${product.folder}`);
    updated++;
  }
  
  // Copy image to product folder
  const sourceImage = path.join(basePath, product.image);
  const destImage = path.join(productDir, product.image);
  
  if (fs.existsSync(sourceImage) && !fs.existsSync(destImage)) {
    fs.copyFileSync(sourceImage, destImage);
    console.log(`   📸 Copied image: ${product.image}`);
  }
  
  // Create product.md
  const productMD = generateProductMD(product);
  fs.writeFileSync(path.join(productDir, 'product.md'), productMD);
  console.log(`   ✅ Created product.md`);
  
  // Create pricing.json
  const pricingJSON = generatePricingJSON(product);
  fs.writeFileSync(path.join(productDir, 'pricing.json'), JSON.stringify(pricingJSON, null, 2));
  console.log(`   ✅ Created pricing.json`);
  console.log('');
});

console.log('='.repeat(60));
console.log('COMPLETE');
console.log('='.repeat(60));
console.log(`\n✅ Created: ${created} new products`);
console.log(`✅ Updated: ${updated} existing products`);
console.log(`📦 Total: ${organicChemicalsData.length} organic chemical products\n`);




