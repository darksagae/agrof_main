/**
 * FINAL COMPREHENSIVE UPDATE
 * Removes "Contact for pricing" messages and ensures all details are complete
 */

const fs = require('fs');
const path = require('path');

const formatPrice = (price) => `UGX ${price.toLocaleString()}`;

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

function generateProductMD(pricingData) {
  const packages = pricingData.packages || [];
  if (packages.length === 0) return null;
  
  // Calculate display price
  let lowestPrice = Infinity;
  let lowestPkgInfo = '';
  
  packages.forEach(pkg => {
    pkg.tiers.forEach(tier => {
      const price = tier.pricePerUnit || tier.price;
      if (price < lowestPrice) {
        lowestPrice = price;
        lowestPkgInfo = `${pkg.size} @ ${tier.quantityValue || tier.qty}+ units`;
      }
    });
  });
  
  let content = `# ${pricingData.productName}\n\n`;
  content += `## Overview\n${pricingData.productDetails || pricingData.details?.description || 'High quality seeds from trusted supplier.'}\n\n`;
  content += `## Supplier\n**${pricingData.supplier}**\n\n`;
  
  // Add specifications if available
  const specs = pricingData.specifications || pricingData.details || {};
  const hasSpecs = Object.keys(specs).some(k => k !== 'description' && specs[k]);
  
  if (hasSpecs) {
    content += `## Product Specifications\n\n`;
    Object.entries(specs).forEach(([key, value]) => {
      if (key !== 'description' && value) {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
        content += `- **${label}**: ${value}\n`;
      }
    });
    content += `\n`;
  }
  
  content += `## Pricing\n\n`;
  content += `**Best Price**: ${formatPrice(lowestPrice)} (${lowestPkgInfo})\n\n`;
  content += `### Package Options & Pricing\n\n`;
  
  packages.forEach(pkg => {
    content += `**${pkg.size}**:\n`;
    pkg.tiers.forEach((tier, idx) => {
      const qty = tier.quantityValue || tier.qty;
      const price = tier.pricePerUnit || tier.price;
      const discount = tier.discountPercent || (idx > 0 && pkg.tiers[0] ? 
        Math.round(((pkg.tiers[0].pricePerUnit || pkg.tiers[0].price) - price) / (pkg.tiers[0].pricePerUnit || pkg.tiers[0].price) * 100) : 0);
      
      const discountText = discount > 0 ? ` (${discount}% off)` : '';
      content += `- ${qty}+ units: ${formatPrice(price)}/unit${discountText}\n`;
    });
    content += `\n`;
  });
  
  content += `## Why Buy From Us?\n`;
  content += `- ✓ Genuine seeds from authorized suppliers\n`;
  content += `- ✓ Quantity discounts available\n`;
  content += `- ✓ Fresh stock with high germination\n`;
  content += `- ✓ Fast delivery nationwide\n`;
  content += `- ✓ Quality guaranteed\n\n`;
  
  content += `## Ordering & Delivery\n`;
  content += `- **Stock**: ✅ Available\n`;
  content += `- **Delivery**: 1-3 days nationwide\n`;
  content += `- **Payment**: Mobile money, Cash on delivery\n`;
  content += `- **Support**: +256 700 123 456\n`;
  
  return content;
}

// Process all products in SEEDS directory
const seedsDir = './agrof-main/mobile/app/assets/store/SEEDS';
const folders = fs.readdirSync(seedsDir).filter(f => 
  fs.statSync(path.join(seedsDir, f)).isDirectory()
);

console.log(`\n${'='.repeat(50)}`);
console.log('FINAL COMPREHENSIVE UPDATE');
console.log(`${'='.repeat(50)}\n`);
console.log(`Processing ${folders.length} products...\n`);

let updated = 0;
let skipped = 0;

folders.forEach((folder, idx) => {
  const pricingPath = path.join(seedsDir, folder, 'pricing.json');
  
  if (!fs.existsSync(pricingPath)) {
    console.log(`[${idx + 1}/${folders.length}] ⏭️  Skipped: ${folder} (no pricing.json)`);
    skipped++;
    return;
  }
  
  const pricingData = JSON.parse(fs.readFileSync(pricingPath, 'utf8'));
  const newProductMD = generateProductMD(pricingData);
  
  if (newProductMD) {
    const productMDPath = path.join(seedsDir, folder, 'product.md');
    fs.writeFileSync(productMDPath, newProductMD);
    console.log(`[${idx + 1}/${folders.length}] ✅ Updated: ${folder.substring(0, 50)}...`);
    updated++;
  }
});

console.log(`\n${'='.repeat(50)}`);
console.log('UPDATE COMPLETE');
console.log(`${'='.repeat(50)}\n`);
console.log(`✅ Updated: ${updated} products`);
console.log(`⏭️  Skipped: ${skipped} products`);
console.log(`📊 Total: ${folders.length} products\n`);





