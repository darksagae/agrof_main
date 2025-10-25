const https = require('https');
const http = require('http');
const fs = require('fs');

// Function to make HTTP request
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    protocol.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Function to extract products from HTML
function extractProducts(html) {
  const products = [];
  
  // Try to find product cards using regex
  const productRegex = /<div[^>]*class="[^"]*product[^"]*"[^>]*>(.*?)<\/div>/gs;
  const matches = html.match(productRegex) || [];
  
  console.log(`Found ${matches.length} potential product sections`);
  
  // Extract product names and prices
  const nameRegex = /<h[234][^>]*>([^<]+)<\/h[234]>/gi;
  const priceRegex = /UGX\s*([\d,]+)/gi;
  
  for (const match of matches) {
    const nameMatch = nameRegex.exec(match);
    const priceMatch = priceRegex.exec(match);
    
    if (nameMatch && priceMatch) {
      products.push({
        name: nameMatch[1].trim(),
        price: `UGX ${priceMatch[1]}`
      });
    }
  }
  
  return products;
}

// Main function
async function main() {
  console.log('🌾 Fetching seed data from EzyAgric...\n');
  
  const allProducts = [];
  
  // Try multiple pages
  for (let page = 1; page <= 30; page++) {
    try {
      console.log(`📄 Page ${page}...`);
      const url = `https://ezyagric.com/catalog?category=Seeds&page=${page}`;
      const html = await httpGet(url);
      
      const products = extractProducts(html);
      
      if (products.length === 0) {
        console.log(`No products found on page ${page}, stopping.`);
        break;
      }
      
      console.log(`  ✅ Found ${products.length} products`);
      allProducts.push(...products);
      
      // Wait a bit between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ Error on page ${page}:`, error.message);
      break;
    }
  }
  
  console.log(`\n📊 Total products found: ${allProducts.length}`);
  
  // Save to file
  const outputFile = '/home/darksagae/Desktop/agrof-auto/ezyagric_seeds_scraped.json';
  fs.writeFileSync(outputFile, JSON.stringify(allProducts, null, 2));
  console.log(`💾 Saved to: ${outputFile}`);
  
  // Print sample
  console.log('\n📋 Sample products:');
  allProducts.slice(0, 20).forEach((p, i) => {
    console.log(`  ${i+1}. ${p.name} - ${p.price}`);
  });
}

main().catch(console.error);





