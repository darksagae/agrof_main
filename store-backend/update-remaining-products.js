const fs = require('fs');
const path = require('path');

// Remaining products that need to be updated with correct directory names
const remainingProducts = {
  "AGRI GOLD": {
    name: "AGRI GOLD Fertilizer",
    description: "Agri Gold is wonder product that prevents flower shedding, promotes more flower formation and bumper yield while enhancing healthy fruit formation and vegetative growth. Agri gold is recommended in all flowering crops like tomatoes, peppers, beans, cotton, coffee. Agri Gold is approved for use in organic Agriculture.",
    application: "Foliar application: Mix 2-3mls of Agri Gold per 1ltrs of water (60mls/20ltrs). Drip Irrigation: Mix 5mls of Agri Gold per 1ltr of water",
    pricing: [
      { size: "1ltr", price: "UGX 30,000" },
      { size: "500ml", price: "UGX 15,000" }
    ]
  },
  "Rosasol - Even (Npk 191919 +Te) – Water Soluble Fertilizer": {
    name: "Rosasol - Even (Npk 19:19:19 +Te) – Water Soluble Fertilizer",
    supplier: "Uganda Crop Care Limited",
    description: "Rosasol - Even is a complete water-soluble fertilizer which provides all major plant nutrients i.e., Nitrogen, Phosphorus, Potassium plus some trace elements in a balanced ratio (NPK 19:19:19) to the plants and greatly boosts yields.",
    pricing: [
      { size: "25 Kg", price: "UGX 260,000" }
    ]
  },
  "Npk 241710 (+3+2+1) - Fertilizer For Sunflower": {
    name: "Npk 24:17:10 (+3+2+1) - Fertilizer For Sunflower",
    supplier: "Grain Pulse Ltd",
    description: "Blended Fertilizer for Sunflower, Used at planting to boost soil fertility and improve productivity. Application rate: 50kgs per acre.",
    pricing: [
      { size: "10 Kg", price: "UGX 31,900" },
      { size: "25 Kg", price: "UGX 78,000" }
    ]
  },
  "Npk 141028 (+25)-Blended Fertilizer For Cassava And Sweet Potato": {
    name: "Npk 14:10:28 (+25)-Blended Fertilizer For Cassava And Sweet Potato",
    supplier: "Grain Pulse Ltd",
    description: "Blended Fertilizer for Cassava, Sweet potato, Used for planting and top-dressing after 2 months. Application rate: 75kg/acre.",
    pricing: [
      { size: "25 Kg", price: "UGX 70,000" }
    ]
  },
  "Npk 171717": {
    name: "Npk 17:17:17",
    supplier: "Export Trading Group",
    description: "This is base fertilizer that supplies three macro nutrients. It helps in good flower setting and forming enlarged fruits & for planting certain crops. Contains N-17% P-17% K-17%.",
    pricing: [
      { size: "50 Kg", price: "UGX 120,000" }
    ]
  },
  "Npk 2555+5S": {
    name: "Npk 25:5:5+5S",
    supplier: "Export Trading Group",
    description: "It is a fertilizer providing Nitrogen, Phosphorous, Potassium & Sulphur. Best suited for tea production & vegetables. Contains N 25% P 5% K 5% + S 5%.",
    pricing: [
      { size: "50 Kg", price: "UGX 125,000" }
    ]
  },
  "Plantone 4.5% S": {
    name: "Plantone 4.5% Sl",
    supplier: "Osho Chemical Industries Ltd",
    description: "Plantone 4.5 SL is a plant growth regulator that can be used on a wide range of crops. It induces flowering, prevents flower abortion and prevents pre-harvest fruit loss.",
    pricing: [
      { size: "30 mls", price: "UGX 7,500" },
      { size: "100 mls", price: "UGX 18,500" }
    ]
  },
  "Npk 202018 - Fertilizer For Maize": {
    name: "Npk 20:20:18 - Fertilizer For Maize",
    supplier: "Grain Pulse Ltd",
    description: "Blended Fertilizer for Maize, used at planting to improve soil fertility and increase maize productivity. Application rate: 100kg per acre.",
    pricing: [
      { size: "50 Kg", price: "UGX 150,000" },
      { size: "10 Kg", price: "UGX 37,000" },
      { size: "25 Kg", price: "UGX 77,000" }
    ]
  }
};

function createProductMarkdown(productName, data) {
  const { name, supplier, description, content, application, pricing } = data;
  
  let markdown = `# ${name}\n\n`;
  
  if (supplier) {
    markdown += `## Supplier\n${supplier}\n\n`;
  }
  
  markdown += `## Overview\n${description}\n\n`;
  
  if (content) {
    markdown += `## Content/Composition\n${content}\n\n`;
  }
  
  if (application) {
    markdown += `## Application/Usage\n${application}\n\n`;
  }
  
  markdown += `## Price Information\n`;
  pricing.forEach(price => {
    markdown += `${price.size}: ${price.price}\n`;
  });
  markdown += `\n`;
  
  markdown += `## Key Features\n`;
  markdown += `- High quality agricultural fertilizer\n`;
  markdown += `- Suitable for various crop types\n`;
  markdown += `- Easy to apply and use\n`;
  markdown += `- Proven results in crop yield improvement\n\n`;
  
  markdown += `## Usage Instructions\n`;
  markdown += `- Follow recommended application rates\n`;
  markdown += `- Apply at appropriate growth stages\n`;
  markdown += `- Ensure proper soil conditions\n`;
  markdown += `- Water after application for best results\n\n`;
  
  markdown += `## Benefits\n`;
  markdown += `- Improved crop yield and quality\n`;
  markdown += `- Enhanced plant growth and development\n`;
  markdown += `- Better nutrient uptake and utilization\n`;
  markdown += `- Cost-effective solution for farmers\n\n`;
  
  markdown += `## Storage Instructions\n`;
  markdown += `- Store in cool, dry place\n`;
  markdown += `- Keep away from direct sunlight\n`;
  markdown += `- Ensure proper ventilation\n`;
  markdown += `- Keep away from children and pets\n\n`;
  
  markdown += `## Safety Information\n`;
  markdown += `- Use protective equipment during application\n`;
  markdown += `- Avoid contact with eyes and skin\n`;
  markdown += `- Store separately from food items\n`;
  markdown += `- Follow all safety guidelines\n\n`;
  
  markdown += `## Contact Information\n`;
  markdown += `Phone: +256 700 123 456\n`;
  markdown += `Email: sales@agrof.com\n`;
  markdown += `WhatsApp: +256 700 123 456\n`;
  
  return markdown;
}

// Update remaining product.md files
const FERTILIZERS_DIR = path.join(__dirname, '../agrof-main/mobile/app/assets/store/FERTLIZERS');

console.log("🔧 Updating remaining fertilizer product.md files with correct data...");
console.log("==================================================");

let updatedCount = 0;
let errorCount = 0;

Object.keys(remainingProducts).forEach(productName => {
  const productPath = path.join(FERTILIZERS_DIR, productName, 'product.md');
  
  if (fs.existsSync(path.dirname(productPath))) {
    try {
      const markdown = createProductMarkdown(productName, remainingProducts[productName]);
      fs.writeFileSync(productPath, markdown, 'utf8');
      console.log(`✅ Updated: ${productName}`);
      updatedCount++;
    } catch (err) {
      console.error(`❌ Error updating ${productName}:`, err.message);
      errorCount++;
    }
  } else {
    console.warn(`⚠️ Directory not found for ${productName}`);
    errorCount++;
  }
});

console.log("\n📊 Update summary:");
console.log(`✅ Successfully updated: ${updatedCount} products`);
console.log(`❌ Errors: ${errorCount} products`);
console.log(`🔧 Total processed: ${updatedCount + errorCount} products`);

console.log("\n🎉 Remaining product.md files have been updated with correct pricing and detailed information!");


