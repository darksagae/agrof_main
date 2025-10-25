/**
 * Complete script to update all 69 seed products with correct information
 * Uses the JSON data file as source
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
      const discount = tier.qty > 1 ? ` (Save ${Math.round(((pkg.tiers[0].price - tier.price) / pkg.tiers[0].price) * 100)}%)` : '';
      section += `- ${tier.qty}+ units: ${formatPrice(tier.price)}/unit${discount}\n`;
    });
    section += `\n`;
  });

  section += `*💡 Bulk orders: Contact for custom pricing and additional discounts*\n\n`;
  
  return section;
}

// Helper function to generate product.md content
function generateProductMD(product) {
  const { price, package: lowestPkg } = getLowestPrice(product.packages);
  
  let content = `# ${product.folder}\n\n`;
  content += `## Overview\n`;
  content += `${product.details.description || product.folder}\n\n`;
  
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
  content += `- ✓ High quality seeds from trusted supplier\n`;
  content += `- ✓ Multiple packaging options available\n`;
  content += `- ✓ Quantity discounts for bulk orders\n`;
  content += `- ✓ Fresh stock with high germination rate\n`;
  content += `- ✓ Tested and verified quality\n\n`;
  
  content += `## Availability & Delivery\n`;
  content += `- **Stock Status**: ✅ In Stock\n`;
  content += `- **Delivery Areas**: Nationwide (Uganda)\n`;
  content += `- **Delivery Time**: 1-3 business days\n`;
  content += `- **Payment**: Cash on delivery, Mobile money (MTN, Airtel)\n\n`;
  
  content += `## Storage Instructions\n`;
  content += `- Store in cool, dry place away from direct sunlight\n`;
  content += `- Keep in airtight container to maintain freshness\n`;
  content += `- Maintain low humidity environment\n`;
  content += `- Shelf life: 2-3 years from packaging date when stored properly\n`;
  content += `- Keep away from chemicals and strong odors\n\n`;
  
  content += `## Contact Information\n`;
  content += `For orders, inquiries, and technical support:\n\n`;
  content += `- **Phone**: +256 700 123 456\n`;
  content += `- **Email**: seeds@agrof.com\n`;
  content += `- **WhatsApp**: +256 700 123 456\n`;
  content += `- **Business Hours**: Mon-Sat: 8:00 AM - 6:00 PM EAT\n`;
  
  return content;
}

// Function to update a single product
function updateProduct(product) {
  const seedsDir = path.join(__dirname, 'agrof-main/mobile/app/assets/store/SEEDS');
  const productDir = path.join(seedsDir, product.folder);
  const productMDPath = path.join(productDir, 'product.md');

  // Check if directory exists
  if (!fs.existsSync(productDir)) {
    console.log(`⚠️  Directory not found: ${product.folder}`);
    console.log(`   Creating directory...`);
    fs.mkdirSync(productDir, { recursive: true });
  }

  // Generate new product.md content
  const content = generateProductMD(product);

  // Write the file
  fs.writeFileSync(productMDPath, content, 'utf8');
  console.log(`✅ Updated: ${product.folder}`);
  
  // Also create pricing.json
  const { price, package: lowestPkg } = getLowestPrice(product.packages);
  const pricingData = {
    productName: product.folder,
    supplier: product.supplier,
    category: product.category,
    displayPrice: formatPrice(price),
    lowestPrice: price,
    lowestPackage: lowestPkg,
    details: product.details,
    packages: product.packages.map(pkg => ({
      size: pkg.size,
      tiers: pkg.tiers.map(tier => ({
        quantity: `${tier.qty}+ units`,
        quantityValue: tier.qty,
        pricePerUnit: tier.price,
        priceFormatted: formatPrice(tier.price),
        totalPrice: tier.price * tier.qty,
        totalFormatted: formatPrice(tier.price * tier.qty),
        discountPercent: tier.qty > 1 && pkg.tiers[0] ? 
          Math.round(((pkg.tiers[0].price - tier.price) / pkg.tiers[0].price) * 100) : 0
      }))
    }))
  };
  
  const pricingPath = path.join(productDir, 'pricing.json');
  fs.writeFileSync(pricingPath, JSON.stringify(pricingData, null, 2), 'utf8');
  console.log(`   📝 Created pricing.json`);
}

// Load the JSON data
const dataPath = path.join(__dirname, 'complete-seeds-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Main execution
console.log('\n========================================');
console.log('UPDATING ALL SEED PRODUCTS');
console.log('========================================\n');
console.log(`Total products to update: ${data.products.length}\n`);

let successCount = 0;
let errorCount = 0;

data.products.forEach((product, index) => {
  try {
    console.log(`[${index + 1}/${data.products.length}]`);
    updateProduct(product);
    successCount++;
    console.log('');
  } catch (error) {
    errorCount++;
    console.log(`❌ Error updating ${product.folder}: ${error.message}\n`);
  }
});

console.log('========================================');
console.log('UPDATE COMPLETE');
console.log('========================================\n');
console.log(`✅ Successfully updated: ${successCount} products`);
console.log(`❌ Failed: ${errorCount} products`);
console.log(`📊 Total: ${data.products.length} products\n`);

if (errorCount > 0) {
  console.log('⚠️  Some products failed to update. Please check the errors above.');
}





