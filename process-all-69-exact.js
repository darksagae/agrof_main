/**
 * MASTER PROCESSOR - ALL 69 PRODUCTS WITH EXACT SOURCE DATA
 * This processes each product with exact pricing and details from the source
 */

const fs = require('fs');
const path = require('path');

// Complete ALL 69 products data - EXACTLY from source
const allProductsExact = require('./all-69-products-master-data.json');

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

function generateProductMD(product) {
  const { price, package: lowestPkg } = getLowestPrice(product.packages);
  
  let content = `# ${product.fullName}\n\n`;
  content += `## Overview\n${product.productDetails}\n\n`;
  content += `## Supplier\n**${product.supplier}**\n\n`;
  
  // Add detailed specs if available
  if (product.specifications) {
    content += `## Specifications\n\n`;
    Object.entries(product.specifications).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
      content += `- **${label}**: ${value}\n`;
    });
    content += `\n`;
  }
  
  content += `## Price Information\n\n**Starting from**: ${formatPrice(price)} (${lowestPkg})\n\n`;
  content += `### Available Packages\n\n`;
  
  product.packages.forEach(pkg => {
    content += `**${pkg.size}**:\n`;
    pkg.tiers.forEach((tier, idx) => {
      const discount = idx > 0 && pkg.tiers[0] ? 
        ` (Save ${Math.round(((pkg.tiers[0].price - tier.price) / pkg.tiers[0].price) * 100)}%)` : '';
      content += `- ${tier.qty}+ units: ${formatPrice(tier.price)}/unit${discount}\n`;
    });
    content += `\n`;
  });
  
  content += `*💡 Bulk orders: Contact for custom pricing and additional discounts*\n\n`;
  
  content += `## Availability & Delivery\n`;
  content += `- **Stock Status**: ✅ In Stock\n`;
  content += `- **Delivery**: Nationwide, 1-3 business days\n`;
  content += `- **Payment**: Cash on delivery, Mobile money (MTN, Airtel)\n\n`;
  
  content += `## Contact Information\n`;
  content += `- **Phone**: +256 700 123 456\n`;
  content += `- **Email**: seeds@agrof.com\n`;
  content += `- **WhatsApp**: +256 700 123 456\n`;
  
  return content;
}

function generatePricingJSON(product) {
  const { price, package: lowestPkg } = getLowestPrice(product.packages);
  
  return {
    productName: product.fullName,
    supplier: product.supplier,
    category: product.category,
    displayPrice: formatPrice(price),
    lowestPrice: price,
    lowestPackage: lowestPkg,
    productDetails: product.productDetails,
    specifications: product.specifications || {},
    packages: product.packages.map(pkg => ({
      size: pkg.size,
      tiers: pkg.tiers.map((tier, idx) => ({
        quantity: `${tier.qty}+ units`,
        quantityValue: tier.qty,
        pricePerUnit: tier.price,
        priceFormatted: formatPrice(tier.price),
        totalPrice: tier.price * tier.qty,
        totalFormatted: formatPrice(tier.price * tier.qty),
        discountPercent: idx > 0 && pkg.tiers[0] ? 
          Math.round(((pkg.tiers[0].price - tier.price) / pkg.tiers[0].price) * 100) : 0
      }))
    }))
  };
}

function updateProduct(product) {
  const seedsDir = './agrof-main/mobile/app/assets/store/SEEDS';
  
  // Try both folder names
  const folders = [product.folder, product.altFolder].filter(f => f);
  
  for (const folderName of folders) {
    const productDir = path.join(seedsDir, folderName);
    
    if (fs.existsSync(productDir)) {
      const productMD = generateProductMD(product);
      const pricingJSON = generatePricingJSON(product);
      
      fs.writeFileSync(path.join(productDir, 'product.md'), productMD);
      fs.writeFileSync(path.join(productDir, 'pricing.json'), JSON.stringify(pricingJSON, null, 2));
      
      console.log(`✅ Updated: ${folderName}`);
      return true;
    }
  }
  
  console.log(`⚠️  Folder not found for: ${product.name}`);
  return false;
}

// Export for use
module.exports = {
  allProductsExact,
  updateProduct,
  generateProductMD,
  generatePricingJSON
};

console.log('Master processor ready');
console.log('Waiting for complete data file: all-69-products-master-data.json');





