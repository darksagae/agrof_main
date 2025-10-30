/*
 * Local SQLite bulk commodity price updater
 * Updates price (text) and selling_price (numeric) in store.db
 */

const path = require('path');
const sqlite3 = require('sqlite3');

const DB_PATH = path.join(__dirname, 'store.db');

const PRICE_MAP = [
  { key: 'avocado', price: 550 },
  { key: 'banana', price: 300 },
  { key: 'beans', price: 1900 },
  { key: 'cabbage', price: 1000 },
  { key: 'carrot', price: 200 },
  { key: 'coffee', price: 5300 },
  { key: 'groundnut', price: 4600, aliases: ['groundnuts'] },
  { key: 'maize', price: 1200 },
  { key: 'mango', price: 1000 },
  { key: 'millet', price: 2100 },
  { key: 'onion', price: 500 },
  { key: 'pineapple', price: 2000 },
  { key: 'rice', price: 3700 },
  { key: 'soyabean', price: 4600, aliases: ['soyabeans', 'soybeans'] },
  { key: 'spinach', price: 1000 },
  { key: 'sugarcane', price: 500 },
  { key: 'tomato', price: 500 },
  // Optional alternate mango piece price (ambiguous)
  { key: 'mango piece', price: 500, aliases: ['pice of mango', 'piece of mango'] }
];

function formatUGX(value) {
  try {
    return `UGX ${Number(value).toLocaleString('en-UG')}`;
  } catch {
    return `UGX ${value}`;
  }
}

function likePattern(term) {
  return `%${term.toLowerCase()}%`;
}

async function run() {
  const db = new sqlite3.Database(DB_PATH);

  const all = (sql, params=[]) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
  });
  const runStmt = (sql, params=[]) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err); else resolve(this.changes);
    });
  });

  let total = 0;

  for (const entry of PRICE_MAP) {
    const queries = [entry.key, ...(entry.aliases || [])];
    const seenIds = new Set();

    for (const q of queries) {
      try {
        const rows = await all(
          'SELECT id, name, price, selling_price FROM products WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ?',
          [likePattern(q), likePattern(q)]
        );

        if (!rows.length) {
          console.log(`🔎 No local products for query: ${q}`);
          continue;
        }

        for (const row of rows) {
          if (seenIds.has(row.id)) continue;
          const newSelling = entry.price;
          const newPrice = formatUGX(newSelling);

          const changes = await runStmt(
            'UPDATE products SET price = ?, selling_price = ?, updated_at = datetime("now") WHERE id = ?',
            [newPrice, newSelling, row.id]
          );

          if (changes > 0) {
            total += 1;
            seenIds.add(row.id);
            console.log(`✅ Updated #${row.id} ${row.name} -> ${newPrice}`);
          }
        }
      } catch (e) {
        console.error(`❌ Error processing "${q}":`, e.message);
      }
    }
  }

  console.log(`\n🏁 Local update complete. Total rows updated: ${total}`);
  db.close();
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});


