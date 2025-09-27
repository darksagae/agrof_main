const fs = require('fs');
const path = require('path');

const SEEDS_DIR = path.join(__dirname, '../agrof-main/mobile/app/assets/store/SEEDS');

const seedProducts = [
  {
    name: "Sugar Baby",
    details: {
      supplier: "Simlaw Seeds Company (U) Ltd",
      overview: "Potential fruit weight: 5-8kgs, Yield potential: 48-50 tons per acre, Duration to maturity: 80 days, Spacing: 100x100cm, Seed rate: 500 grams per acre, Approximate seed count per gram: 20 seeds, Special attributes: Dark green, round watermelon, Very uniform growth, Very adoptable and grows on wide range of soils.",
      other_packaging: "10g UGX 2,100\n20g UGX 3,200\n25g UGX 3,800\n50g UGX 8,700\n250g UGX 34,900\n500g UGX 67,200\n1kg UGX 128,900"
    }
  },
  {
    name: "Julie F1",
    details: {
      supplier: "Simlaw Seeds Company (U) Ltd",
      overview: "Potential fruit weight: 10-12kgs, Yield potential: 35-40 tons per acre, Duration to maturity: 85 days, Seed rate: 500 grams per acre, Approximate seed count per gram: 20 seeds, Special attributes: -A very popular hybrid with oblong shaped fruit. -Very sweet red flesh. -Tolerant to fusarium wilt and anthracnose.",
      other_packaging: "5g UGX 3,800\n10g UGX 7,200\n25g UGX 17,600\n50g UGX 33,800\n100g UGX 64,900\n250g UGX 163,700\n500g UGX 324,600"
    }
  },
  {
    name: "Frey - Pepper Hybrid F1",
    details: {
      supplier: "Home Harvest (U) Ltd",
      overview: "Frey is a versatile hybrid sweet pepper that can be grown outdoors or, if market dictates, indoors. Fruits measure 12x10cm and go from green to red. The fruits have thick walls. Strong plant with short internodes and good lead cover.",
      special_attributes: "Disease Resistance/Tolerance: Potato Virus Y (PVY:0,1), Tobamovirus (TM:0-3).\nWalls: Thick\nShape: Blocky.\nColour: Green -> Red.\nVigour: Strong,\nLeaf cover: Good.\nInternode Length: Short.\nHeight: Medium (indoors), Semi-compact (outdoors).\nCultivation: Open Field, Tunnel.\nUniformity: High.\nMaturity: Early.\nHybrid: F1.",
      other_packaging: "5g UGX 38,800"
    }
  },
  {
    name: "Habanero Yellow – Bonnet Pepper",
    details: {
      supplier: "Home Harvest (U) Ltd",
      overview: "Habanero Yellow Pepper is a very vigorous and high yielding pepper type with reliable performance in a wide range of different growing conditions. It has a long harvesting period with makes it good commercial horticultural crop with a high profitability potential.",
      special_attributes: "Yellow hot pepper fruits\nEach plant produces about 5kg per season.\nMaturity is 70 days from transplanting.\nHarvesting takes 4-6 months\nSeed rate/acre: 120g\nSpacing: 60cm x 75cm",
      other_packaging: "50g UGX 54,200"
    }
  },
  {
    name: "Grace - Barley Seed",
    details: {
      supplier: "Sebei Farmers Sacco",
      overview: "Grace barley is a good yielding variety, Maturity: 100days, Yield potential: 1500 kg/ Acre, Seed rate: 50kgs/Acre.",
      other_packaging: "1kgs UGX 2,500"
    }
  },
  {
    name: "California Wonder \"Bamba\" - Pepper",
    details: {
      supplier: "Home Harvest (U) Ltd",
      overview: "California Wonder \"Bamba\" has an erect plant with good vigor.\nIt has a very good production of green deep blocky fruits with smooth skin.\nYield potential is 15 – 20 tons under good management\nSeed rate/acre: 100g.\nSpacing: 60cm x 45cm.",
      other_packaging: "50g UGX 23,300"
    }
  },
  {
    name: "Habanero Red – Bonnet Pepper",
    details: {
      supplier: "Home Harvest (U) Ltd",
      overview: "Habanero Red is a high yielding pepper variety with great demand both locally and more so internationally. It can be grown for export to various countries globally.",
      special_attributes: "Red hot pepper fruits\nEach plant produces 4 – 5kg per season\nMaturity is 70 days from transplanting\nHarvesting takes 4-6 months\nSeed rate/acre: 120g\nSpacing: 60cm x 75cm",
      other_packaging: "10g UGX 16,400\n50g UGX 59,600"
    }
  },
  {
    name: "Ashley – Open Pollinated Cucumber Varirty With Prolific Productivity",
    details: {
      supplier: "Syova Seed (U) Ltd",
      overview: "Ashley is an open pollinated cucumber that has been grown for years in most vegetable gardens, and excellent for slicing. Ashley is an early variety with is a prolific producer of medium size 30cm fruits that are darker than other cultivars. Resistant to downy mildew and other problems normally caused by humid conditions. Also grows well in containers.",
      other_packaging: "10 g UGX 3,600\n25 g UGX 6,700\n50 g UGX 9,800"
    }
  },
  {
    name: "Mak Soy 3N (Brac Seed)",
    details: {
      supplier: "Brac Seed",
      overview: "Spacing: 60cm x 5cm (1 seed per hole using machine planting); 50cm x 25cm (3 seeds per hole using hand hoe planting)\nSeed Rate: 50-60 Kg per hectare, 20-25 kg per acre.\nMaturity Period: 100 days.\nYield: 2.0-3.5 metric tonnes per hectare; 0.8-1.4 metric tonnes per acre.",
      other_packaging: "1 Kg UGX 6,700"
    }
  },
  {
    name: "Cal-j Tomato Compact And Determinate Variety Suitable For Processing And Fresh Market",
    details: {
      supplier: "Syova Seed (U) Ltd",
      overview: "A compact and determinate variety suitable for processing. The plant is vigorous and highly productive. The fruits are medium sized, square with apple-green back, very firm, smooth, intense red in colour with excellent flavour. It stands high undesirable processing characteristics and has excellent potential as a peeling tomato. It is resistant to verticillium and fusarium wilts.\nSpacing: 60cm*45cm,\nSeed rate: 80grams/acre,\nMaturity period:100-120 days,\nYield Potential: 20-45mt/acre.",
      other_packaging: "10 g UGX 4,600\n20 g UGX 7,200\n25 g UGX 9,300\n50 g UGX 19,400"
    }
  },
  {
    name: "Green Bunching – Onion, Non-bulbing Alliums That Produce Yummy Green Stems",
    details: {
      supplier: "Syova Seed (U) Ltd",
      overview: "Green Bunching are perennial non-bulbing alliums that produce yummy green stems and tiny white roots, year after year, They have thick, round, hollow stems that are bright green in color, and unique and lovely greenish white flowers that are slow to develop and bloom through much of the summer.The leaves have a mild onion flavor and are edible raw or cooked",
      other_packaging: "10 g UGX 5,700\n50 g UGX 16,500"
    }
  },
  {
    name: "Terere – Amaranthus, Indigenous, Highly Nutritious Green Leafy Vegetable",
    details: {
      supplier: "Syova Seed (U) Ltd",
      overview: "Terere – Amaranthus is an indigenous, highly nutritious green leafy vegetable, Highly grown for its succulent edible leaves which are extremely rich in vitamin A & C. Also has considerably high contents of minerals, such as, Iron, Calcium and Phosphorous. It tastes excellent when cooked fresh. It is early maturing producing average size leaves good enough for harvest in a few weeks.",
      other_packaging: "10 g UGX 2,000\n20 g UGX 2,600\n25 g UGX 3,400\n50 g UGX 4,400\n250 g UGX 12,700\n500 g UGX 23,300"
    }
  },
  {
    name: "Galia F1 – Sweet Melon With Firm Fruits, Aromatic Flavour",
    details: {
      supplier: "Syova Seed (U) Ltd",
      overview: "Galia F1 is very sweet Melon with firm fruits, aromatic flavour, Tolerant to fusarium wilt race 0 and powdery mildew.\nMaturity days after sowing: 70 days,\nSpacing: 150cm*60cm, Seed rate: 600grams/acre,\nAverage fruit weight: 0.8-1.2kgs,\nShape: Globe shaped fruits with small cavity,\nColour: Rind-gold yellow with medium netting, fruits- green fresh",
      other_packaging: "10 g UGX 23,500"
    }
  },
  {
    name: "Green Gold F1 – Pepper, High Yielding Variety With Excellent Fruit Set",
    details: {
      supplier: "Syova Seed (U) Ltd",
      overview: "Green Gold F1 is a High yielding variety with excellent fruit set, ideal for both open and protected cultivation, suitable for long distance transportation, Very good keeping qualities, High tolerance to tomato spotted wilt virus, potato virus Y, bacterial spot and tobamo virus.\nSpacing: 60cm*60cm,\nSeed rate: 200grams/acre,\nMaturity period: 90-140 days,\nYield potential: 10-16mt/acre,\nColour: Dark green walled fruits,\nShape: Large and blocky.",
      other_packaging: "1 g UGX 3,100\n10 g UGX 117,200"
    }
  },
  {
    name: "Green Coronet F1 – Cabbage, Medium-large, Semi-upright Hybrid",
    details: {
      supplier: "Syova Seed (U) Ltd",
      overview: "Green Coronet F1 is a Medium-large, semi-upright hybrid cabbage variety that grows well in medium hot to cold areas, Has excellent field holding capacity and will last long in the field before bursting.\nMaturity days from transplanting: 75-80,\nSeed rate: 100grams/acre,\nSpacing: 60cm*60cm or 60cm*45cm,\nAverage head weight: 4kg,\nColour: Deep green,",
      other_packaging: "1 g UGX 2,800\n5 g UGX 10,800\n10 g UGX 23,500\n25 g UGX 54,700\n50 g UGX 91,600"
    }
  },
  {
    name: "Tall Utah – Celery Variety With Crisp, Stringless Green Tightly Folded Hearts",
    details: {
      supplier: "Syova Seed (U) Ltd",
      overview: "Tall Utah is a crisp, stringless green celery with tightly folded hearts, and broad, thick, well-rounded stalks. It is a vigorous grower without getting flimsy. This is a popular green celery for late use.\nGermination: 7-10 days,\nHeight at maturity: 45-60cm,\nSpacing after thinning: 20cm.\nDays to maturity: 70-125 days.",
      other_packaging: "10 g UGX 3,300\n20 g UGX 4,100\n25 g UGX 5,000\n50 g UGX 10,100"
    }
  },
  {
    name: "California Wonder",
    details: {
      supplier: "Simlaw Seeds Company (U) Ltd",
      overview: "Ideal for Open field production, Very uniform fruits, Blocky and medium-sized, Widely adaptable variety, Colour turns from green to red, Average yield per acre(T) 6-7, Maturity 80-90 Days",
      other_packaging: "10g UGX 3,800\n50g UGX 17,600"
    }
  },
  {
    name: "Maxim F1 – Tomato",
    details: {
      supplier: "Nsanja Agrochemicals Ltd",
      overview: "Plant: Indeterminate hybrid, tall with vigorous plant habit, Broad, dark green leaves with excellent foliage cover, Ideal for greenhouse or Open field production under support system, spacing: 60 * 45 cm, Fruit: Square oblong firm fruits turning deep uniform red colour at ripening stage, Fruit harvesting start 65 – 70 after transplanting, Long harvesting cycle between average 5 – 9 months under good agronomic practice in the greenhouse, Ripe fruits are sweet, firm with glossy red colour, Average 7 – 9 fruits per truss, Shelf life – average 21 days harvested at mature green stage, Plant features: Strong vigorous plant with good heat setting, Tolerant to Bacterial wilt, Fusarium & Verticillium wilt Stemphylium, Yield potential: Average 70 – 80 Tons / acre",
      other_packaging: "5g UGX 38,100\n10g UGX 69,900\n50g UGX 239,400"
    }
  },
  {
    name: "Coatmeal - Coriander",
    details: {
      supplier: "Simlaw Seeds Company (U) Ltd",
      overview: "A popular herb with finely cut, small and rather pungent leaves, Tender foliage used for seasoning and flavouring curries.",
      other_packaging: "50g UGX 3,780\n500g UGX 31,000\n1kg UGX 66,500"
    }
  }
];

function formatProductDetailsToMarkdown(product) {
  let markdown = `# ${product.name}\n\n`;

  if (product.details.supplier) {
    markdown += `## Supplier\n${product.details.supplier}\n\n`;
  }
  if (product.details.overview) {
    markdown += `## Overview\n${product.details.overview}\n\n`;
  }
  if (product.details.special_attributes) {
    markdown += `## Special Attributes\n${product.details.special_attributes}\n\n`;
  }
  if (product.details.other_packaging) {
    markdown += `## Other Packaging\n${product.details.other_packaging}\n\n`;
  }

  return markdown;
}

console.log("🔧 Updating seed product.md files with correct data...");
console.log("==================================================");

let updatedCount = 0;
let errorCount = 0;

seedProducts.forEach(product => {
  // Sanitize product name to create a valid directory name
  const sanitizedProductName = product.name.replace(/[/\\?%*:|"<>]/g, '').replace(/\s-\s/g, '-').replace(/\s/g, '_');
  const productDirPath = path.join(SEEDS_DIR, sanitizedProductName);
  const productFilePath = path.join(productDirPath, 'product.md');

  if (!fs.existsSync(productDirPath)) {
    try {
      fs.mkdirSync(productDirPath, { recursive: true });
    } catch (dirErr) {
      console.error(`❌ Error creating directory for ${product.name}:`, dirErr);
      errorCount++;
      return;
    }
  }

  try {
    const markdownContent = formatProductDetailsToMarkdown(product);
    fs.writeFileSync(productFilePath, markdownContent, 'utf8');
    console.log(`✅ Updated: ${product.name}`);
    updatedCount++;
  } catch (fileErr) {
    console.error(`❌ Error writing product.md for ${product.name}:`, fileErr);
    errorCount++;
  }
});

console.log("\n📊 Update summary:");
console.log(`✅ Successfully updated: ${updatedCount} products`);
console.log(`❌ Errors: ${errorCount} products`);
console.log(`🔧 Total processed: ${updatedCount + errorCount} products`);

console.log("\n🎉 Seed product.md files have been updated with correct information!");
