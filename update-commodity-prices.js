/*
 * Bulk commodity price updater for Store API
 * - Searches products by keyword and updates price/selling_price
 */

const fetch = require('node-fetch');
const { getStoreApiUrl } = require('./whatsapp-bot/config');

const PRICE_MAP = [
  { key: 'avocado', price: 550 },
  { key: 'banana', price: 300 },
  { key: 'beans', price: 1900 },
  { key: 'cabbage', price: 1000 },
  { key: 'carrot', price: 200 },
  { key: 'coffee', price: 5300 },
  { key: 'groundnut', price: 4600 }, // also matches groundnuts
  { key: 'maize', price: 1200 },
  { key: 'mango', price: 1000 },
  { key: 'millet', price: 2100 },
  { key: 'onion', price: 500 },
  { key: 'pineapple', price: 2000 },
  { key: 'rice', price: 3700 },
  { key: 'soyabean', price: 4600 }, // also matches soyabeans/soybeans
  { key: 'spinach', price: 1000 },
  { key: 'sugarcane', price: 500 },
  { key: 'tomato', price: 500 },
  // Ambiguity: user also mentioned "pice of mango 500"; apply as secondary rule
  { key: 'piece mango', price: 500, aliases: ['pice of mango', 'mango piece'] }
];

function formatUGX(value) {
  try {
    return `UGX ${Number(value).toLocaleString('en-UG')}`;
  } catch {
    return `UGX ${value}`;
  }
}

async function searchProducts(apiBase, query) {
  const url = `${apiBase}/products/search?q=${encodeURIComponent(query)}&limit=50`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search failed for "${query}": ${res.status} ${res.statusText}`);
  return res.json();
}

async function updateProductPrice(apiBase, productId, priceNumber) {
  const url = `${apiBase}/products/${productId}`;
  const body = {
    price: formatUGX(priceNumber),
    selling_price: priceNumber
  };
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Update failed for id=${productId}: ${res.status} ${res.statusText}`);
  return res.json();
}

function matchesKeyword(productName, key, aliases = []) {
  const name = (productName || '').toLowerCase();
  const k = key.toLowerCase();
  if (name.includes(k)) return true;
  for (const alias of aliases) {
    if (name.includes(alias.toLowerCase())) return true;
  }
  return false;
}

async function main() {
  const apiBase = getStoreApiUrl();
  console.log(`🔗 Using Store API: ${apiBase}`);

  let totalUpdated = 0;
  const updateLog = [];

  for (const entry of PRICE_MAP) {
    const queries = [entry.key, ...(entry.aliases || [])];
    const seenIds = new Set();
    const targetPrice = entry.price;

    for (const q of queries) {
      try {
        const results = await searchProducts(apiBase, q);
        if (!Array.isArray(results) || results.length === 0) {
          console.log(`🔎 No products found for query: ${q}`);
          continue;
        }

        for (const product of results) {
          // De-duplicate across aliases
          if (seenIds.has(product.id)) continue;
          // Match strictly by keyword presence in name to avoid unrelated items
          if (!matchesKeyword(product.name, entry.key, entry.aliases || [])) continue;

          try {
            const resp = await updateProductPrice(apiBase, product.id, targetPrice);
            if (resp && resp.success) {
              totalUpdated += 1;
              seenIds.add(product.id);
              updateLog.push({ id: product.id, name: product.name, newPrice: targetPrice });
              console.log(`✅ Updated ${product.name} (#${product.id}) -> ${formatUGX(targetPrice)}`);
            } else {
              console.warn(`⚠️ Partial update for ${product.name} (#${product.id})`);
            }
          } catch (e) {
            console.error(`❌ Failed updating ${product.name} (#${product.id}): ${e.message}`);
          }
        }
      } catch (e) {
        console.error(`❌ Error during search for "${q}": ${e.message}`);
      }
    }
  }

  console.log(`\n🏁 Completed. Total products updated: ${totalUpdated}`);
  if (updateLog.length) {
    console.log('🧾 Updates applied:');
    for (const u of updateLog) {
      console.log(` - #${u.id} ${u.name} => ${formatUGX(u.newPrice)}`);
    }
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});



