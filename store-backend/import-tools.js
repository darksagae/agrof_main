const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'store.db'));
const assetsDir = path.join(__dirname, '../agrof-main/mobile/app/assets/store/tools');

const items = [
  { productName: 'Bird Protection / Floriculture Net', supplier: 'Silfra Enviro U Ltd', productDetails: 'Bird Protection / Floriculture Net is a multipurpose net used in agriculture for protection against birds. Material: HDPE Monofilament. Knot type: Knotted / Knotless. Colors: Black, Milky White, Natural White, Green.', packages: [ { size: '4.30m x 50m (Roll) - 215 sq m', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 797200 }] }, { size: '3m x 50m (Roll) - 150 sq m', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 554600 }] }, { size: '2.5m x 50m (Roll) - 125 sq m', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 460700 }] }, { size: '2m x 50m (Roll) - 100 sq m', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 370200 }] }, { size: '1.75m x 50m (Roll) - 87.5 sq m', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 325000 }] }, { size: '1.10m x 50m (Roll) - 55 sq m', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 204200 }] } ] },
  { productName: 'Grape Net', supplier: 'Silfra Enviro U Ltd', productDetails: 'Grape Net is used in farming of Grapes. It protects grapes against birds and hail. Light weight, durable, flexible, easy to install; resistant to salt water and chemicals.', packages: [ { size: '4.30m x 50m (Roll) - 215 sq m', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 797200 }] }, { size: '3m x 50m (Roll) - 150 sq m', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 554600 }] }, { size: '2.5m x 50m (Roll) - 125 sq m', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 460700 }] }, { size: '2m x 50m (Roll) - 100 sq m', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 370200 }] }, { size: '1.10m x 50m (Roll) - 55 sq m', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 204200 }] } ] },
  { productName: 'Smart Sensor Grain Moisture Meter', supplier: 'Global Traders Limited', productDetails: 'LCD Digital Smart Sensor with probe for grains and animal feeds. Range 7.5%-50%, backlight, auto power-off, memory, varieties selection.', packages: [ { size: '1 Piece', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 350000 }] } ] },
  { productName: 'Pruning Saw', supplier: 'Naskan General Hardware Smc Limited', productDetails: 'Sharp-tooth pruning saw for trimming trees and shrubs. Steel blade with durable sharpness. Wooden pistol-grip handle.', packages: [ { size: 'Light Duty', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 31800 }] }, { size: 'Heavy Duty', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 37500 }] } ] },
  { productName: 'Pick Axe', supplier: 'Naskan General Hardware Smc Limited', productDetails: 'Heavy-duty pick axe for digging rocky pits, mining, and construction tasks. Brand: Crocodile.', packages: [ { size: '1 Piece', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 21200 }] } ] },
  { productName: 'Slasher', supplier: 'Naskan General Hardware Smc Limited', productDetails: 'Implement with a long sharp blade used to clear scrub and bush.', packages: [ { size: '1 Piece', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 7300 }] } ] },
  { productName: 'Grain Plastic Silos', supplier: 'Crestanks Ltd', productDetails: 'Gas-tight hermetic plastic silos for storing grains to kill insect pests. Recommended indoors or under shelter.', packages: [ { size: '250 Ltrs', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 219400 }] }, { size: '500 Ltrs', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 329000 }] } ] },
  { productName: 'Safety Gumboots - Gayu (Yellow)', supplier: 'Naskan General Hardware Smc Limited', productDetails: 'Waterproof safety gumboots with cushioned foot-bed and soft fabric lining. Sizes 6-11.', packages: [ { size: '1 Pair (Size 6)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 17800 }] }, { size: '1 Pair (Size 7)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 17800 }] }, { size: '1 Pair (Size 8)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 17800 }] }, { size: '1 Pair (Size 9)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 17800 }] }, { size: '1 Pair (Size 10)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 17800 }] }, { size: '1 Pair (Size 11)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 17800 }] } ] },
  { productName: 'Panga', supplier: 'Naskan General Hardware Smc Limited', productDetails: 'Machete with deep belly for chopping and slicing woody vegetation. Brand: Diamond.', packages: [ { size: '1 Piece (Size 16)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 8400 }] }, { size: '1 Piece (Size 18)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 9600 }] } ] },
  { productName: 'Tarpaulin', supplier: 'Naskan General Hardware Smc Limited', productDetails: 'Strong waterproof tarpaulin for harvesting, drying produce, covering trucks and other agricultural uses.', packages: [ { size: '1 Piece (4 x 6m) - Heavy Duty', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 65000 }] }, { size: '1 Piece (6 x 6m) - Heavy Duty', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 95000 }] }, { size: '1 piece (18m x 24m)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 85000 }] }, { size: '1 piece (30m x 30m)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 200000 }] } ] },
  { productName: 'Echo 20L Pump', supplier: 'Bukoola Chemical Industries (U) Ltd', productDetails: 'Echo SHP 800-2 Double Wand High-Pressure Sprayer with vibration-reduction system and double-action piston pump.', packages: [ { size: '1 Piece', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 1599600 }] } ] },
  { productName: 'Nurserybed - Potting Bags', supplier: 'Twebaze Agro Chemicals (U) Ltd', productDetails: 'Grow bags for seedlings and plants in assorted sizes.', packages: [ { size: '1kg', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 8000 }] } ] },
  { productName: 'Protective Gear (Coat/Overall)', supplier: 'Global Agro Inputs Ltd', productDetails: 'Loose-fitting protective garment worn over clothes for protection against dirt or heavy wear.', packages: [ { size: 'Piece', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 64100 }] } ] },
  { productName: 'Hoe Handle', supplier: 'Naskan General Hardware Smc Limited', productDetails: 'Smoothened wooden hoe handle, strong and durable, easy to fit.', packages: [ { size: '1 piece', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 2000 }] } ] },
  { productName: 'Garden Fork / Spading Fork', supplier: 'Naskan General Hardware Smc Limited', productDetails: 'Multipurpose fork for turning, digging, loosening soil; 3-4 tines with fiberglass D-grip.', packages: [ { size: '1 Piece - Big (4 Teeth)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 17800 }] }, { size: '1 Piece - Medium (3 Teeth)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 17800 }] } ] },
  { productName: 'Electric Spray Pump', supplier: 'Global Agro Inputs Ltd', productDetails: '20L agriculture backpack power battery electric sprayer pump to ease spraying without manual pumping.', packages: [ { size: '1 Piece', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 195500 }] } ] },
  { productName: 'Tarpaulin (Twebaze)', supplier: 'Twebaze Agro Chemicals (U) Ltd', productDetails: 'Strong waterproof tarpaulin for harvesting, drying produce, covering trucks and other agricultural uses.', packages: [ { size: '1 piece (4m x 6m) blue', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 34500 }] }, { size: '1 piece (4m x 6m) green', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 40250 }] } ] },
  { productName: 'Stanes Entrap Fruit Fly Trap', supplier: 'Bukoola Chemical Industries (U) Ltd', productDetails: 'Eco-friendly fruit fly trap for monitoring and control in fruit trees; weather resistant and escape-proof.', packages: [ { size: '1 Piece', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 16500 }] } ] },
  { productName: 'Climatesmart Direct with Rainmaker 2S', supplier: 'Sunculture', productDetails: 'Optimised irrigation solution for <1 acre farm. Includes solar pump, controller, panel, pipe, fittings, warranty, installation & training.', packages: [ { size: '1 piece', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 1820000 }] } ] },
  { productName: 'Jectto Manual Pump 16Ltrs', supplier: 'Global Agro Inputs Ltd', productDetails: 'Reliable manual sprayer for agricultural and industrial applications. Ergonomic and durable.', packages: [ { size: '16 Ltrs', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 178500 }] }, { size: '20ltr J/Can', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 199500 }] } ] },
  { productName: 'Tape Measure', supplier: 'Naskan General Hardware Smc Limited', productDetails: 'Fiberglass long tape, metric/inch, suitable for field and construction measurements.', packages: [ { size: '1 Piece (50m)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 21200 }] }, { size: '1 Piece (100m)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 32000 }] } ] },
  { productName: 'Makula Knapsack Sprayer', supplier: 'Nsanja Agrochemicals Ltd', productDetails: 'High pressure sprayer with ergonomic design and consistent spray pattern.', packages: [ { size: '16 ltr', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 65000 }] } ] },
  { productName: 'Agriscope Knapsack Sprayer', supplier: 'Syova Seed (U) Ltd', productDetails: 'Durable and efficient sprayer for gardens and crops; internal agitator, UV-resistant tank.', packages: [ { size: '16 Ltrs', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 60000 }] }, { size: '20 Ltrs', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 65000 }] } ] },
  { productName: 'Sharpening File', supplier: 'Naskan General Hardware Smc Limited', productDetails: 'High-quality file for sharpening pangas, knives, chainsaws; also for deburring metals.', packages: [ { size: '1 Piece (Long)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 8500 }] }, { size: '1 Piece (Short)', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 6100 }] } ] },
  { productName: 'CP15 Evolution – Sprayer', supplier: 'Nsanja Agrochemicals Ltd', productDetails: 'Comfortable and safe knapsack sprayer with non-corrosive polypropylene tank; 15L.', packages: [ { size: '15 Ltrs', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 200000 }] } ] },
  { productName: 'Rubber Gloves (Protective Gear)', supplier: 'Global Agro Inputs Ltd', productDetails: 'Protective gloves; pair.', packages: [ { size: 'Pair', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 17000 }] } ] },
  { productName: 'Farmate - Spray Pump', supplier: 'Global Agro Inputs Ltd', productDetails: 'General purpose 20L lever-operated knapsack sprayer; high quality PE tank and brass/plastic nozzles.', packages: [ { size: '20 Ltr', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 60000 }] } ] },
  { productName: 'Bomba Kaliba – Knapsack Sprayer', supplier: 'Bukoola Chemical Industries (U) Ltd', productDetails: '16L back-mounted sprayer with piston pump and multiple spray heads; durable and chemical resistant.', packages: [ { size: '16 Ltr', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 65000 }] } ] },
  { productName: 'Hoe – Peacock Brand', supplier: 'Naskan General Hardware Smc Limited', productDetails: 'Versatile hoe for shaping soil, weeding, digging and harvesting root crops.', packages: [ { size: '1 Piece', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 14500 }] } ] },
  { productName: 'Watering Can (10L, Plastic)', supplier: 'Nice House Of Plastics', productDetails: 'Light weight plastic watering can, 10 Ltr, color: Green, material: PE.', packages: [ { size: '1 Piece', tiers: [{ quantity: '1+ units', quantityValue: 1, pricePerUnit: 7000 }] } ] }
];

function ensureCategory(callback) {
  db.get("SELECT id FROM categories WHERE name = ?", ['TOOLS'], (err, row) => {
    if (err) return callback(err);
    if (row) return callback(null, row.id);
    db.run(
      `INSERT INTO categories (name, display_name, description, image_url) VALUES (?, ?, ?, ?)`,
      ['TOOLS', 'Tools', 'Tools and farm equipment', '/images/TOOLS/category.png'],
      function (e) {
        if (e) return callback(e);
        callback(null, this.lastID);
      }
    );
  });
}

function ugxFormat(n) {
  return 'UGX ' + Number(n).toLocaleString('en-UG');
}

function lowestPriceFromPackages(packages) {
  if (!Array.isArray(packages) || packages.length === 0) return 0;
  let min = Infinity;
  for (const pkg of packages) {
    const tiers = Array.isArray(pkg.tiers) ? pkg.tiers : [];
    for (const t of tiers) {
      if (typeof t.pricePerUnit === 'number') min = Math.min(min, t.pricePerUnit);
    }
  }
  return min === Infinity ? 0 : min;
}

function ensureFolder(folder) {
  const dir = path.join(assetsDir, folder);
  fs.mkdirSync(dir, { recursive: true });
}

// Helpers to match provided asset folders to product names
function listToolFolders() {
  try {
    return fs.readdirSync(assetsDir).filter(f => {
      try { return fs.statSync(path.join(assetsDir, f)).isDirectory(); } catch { return false; }
    });
  } catch { return []; }
}

function normalizeName(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[\u2013\u2014\u2010\u2212\-]/g, '-')
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}

function findBestFolderFor(productName, folders) {
  if (!productName) return null;
  
  // Specific mappings for known mismatches
  const specificMappings = {
    'Agriscope Knapsack Sprayer': 'Agriscope Knapsack Sprayer -Highly Durable, Efficient Sprayer Ideal For Outdoor Work ',
    'Bomba Kaliba – Knapsack Sprayer': 'Bomba Kaliba – Highly Durable Efficient Knapsack Sprayer',
    'Climatesmart Direct with Rainmaker 2S': 'Climatesmart Direct With Rainmaker 2S - Optimised Irrigation Solution For <1 Acre Farm',
    'CP15 Evolution – Sprayer': 'Cp15 Evolution – Sprayer',
    'Echo 20L Pump': 'Echo 20L Pump',
    'Farmate - Spray Pump': 'Farmate -Spray Pump',
    'Garden Fork / Spading Fork': 'Garden Fork',
    'Hoe Handle': 'Hoe – Peacock Brand',
    'Nurserybed - Potting Bags': 'Nurserybed -Potting Bags',
    'Tarpaulin (Twebaze)': 'Tarpaulin 12',
    'Watering Can (10L, Plastic)': 'Watering Can (10L, Plastic)'
  };
  
  if (specificMappings[productName]) {
    return specificMappings[productName];
  }
  
  // exact
  if (folders.includes(productName)) return productName;
  // case-insensitive exact
  const ci = folders.find(f => f.toLowerCase() === productName.toLowerCase());
  if (ci) return ci;
  // normalized equality
  const target = normalizeName(productName);
  let best = folders.find(f => normalizeName(f) === target);
  if (best) return best;
  // prefix/containment matches
  best = folders.find(f => normalizeName(f).startsWith(target))
      || folders.find(f => target.startsWith(normalizeName(f)))
      || folders.find(f => normalizeName(f).includes(target))
      || folders.find(f => target.includes(normalizeName(f)));
  return best || null;
}

function run() {
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
  const folders = listToolFolders();
  ensureCategory((err, categoryId) => {
    if (err) {
      console.error('Error ensuring TOOLS category:', err.message);
      process.exit(1);
    }
    console.log('TOOLS category id:', categoryId);

    db.run("DELETE FROM products WHERE category_id = ?", [categoryId], (e) => {
      if (e) console.error('Error clearing TOOLS products:', e.message);
      let imported = 0, errors = 0;
      items.forEach((p, idx) => {
        try {
          const folderName = findBestFolderFor(p.productName, folders) || p.productName;
          const lowest = lowestPriceFromPackages(p.packages);
          const display = ugxFormat(lowest);
          const description = (p.productDetails || '').substring(0, 500);
          // Search for images recursively in the matched folder
          const dirPath = path.join(assetsDir, folderName);
          let imageFile = null;
          let imagePath = null;
          try {
            const findImage = (dir) => {
              const files = fs.readdirSync(dir);
              // First, look for real images (not placeholder image.png)
              const realImages = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f) && f !== 'image.png');
              if (realImages.length > 0) {
                const file = realImages[0];
                const fullPath = path.join(dir, file);
                return { file, path: fullPath };
              }
              // If no real images, check subdirectories
              for (const file of files) {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                  const found = findImage(fullPath);
                  if (found) return found;
                }
              }
              // Last resort: use any image file
              const anyImage = files.find(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
              if (anyImage) {
                const fullPath = path.join(dir, anyImage);
                return { file: anyImage, path: fullPath };
              }
              return null;
            };
            const result = findImage(dirPath);
            if (result) {
              imageFile = result.file;
              imagePath = result.path;
            }
          } catch (_) {}
          const imageUrl = imageFile ? `/images/tools/${encodeURIComponent(folderName)}/${encodeURIComponent(imageFile)}` : null;
          const unit = (p.packages && p.packages[0] && p.packages[0].size) ? p.packages[0].size : '1 Piece';

          db.run(
            `INSERT INTO products (
              category_id, name, description, price,
              selling_price, quantity_in_stock,
              unit_of_measure, supplier_name, image_url, availability
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [categoryId, p.productName, description, display, lowest, 100, unit, p.supplier || 'AGROF', imageUrl, 'In Stock'],
            function (ie) {
              if (ie) {
                console.error(`[${idx + 1}/${items.length}] Error:`, ie.message);
                errors++;
              } else {
                console.log(`[${idx + 1}/${items.length}] Imported: ${p.productName} - ${display}`);
                imported++;
              }
              if (idx === items.length - 1) {
                setTimeout(() => {
                  db.get("SELECT COUNT(*) as c FROM products WHERE category_id = ?", [categoryId], (ge, row) => {
                    console.log(`Done. Imported ${imported}, errors ${errors}. DB has ${row ? row.c : 'n/a'} TOOLS products.`);
                    db.close();
                  });
                }, 300);
              }
            }
          );
        } catch (x) {
          console.error(`[${idx + 1}/${items.length}] Exception:`, x.message);
          errors++;
        }
      });
    });
  });
}

run();
