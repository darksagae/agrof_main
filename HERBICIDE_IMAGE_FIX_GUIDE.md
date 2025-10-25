# Herbicide Images - Fix Summary & Guide

## 🎯 Problem Fixed

**Issue:** 17 herbicide products were all using the same wrong image (`excel-glycel-herbicide-500x500.jpg`) instead of their unique product images.

**Solution:** Updated database to set `image_url = NULL` for products without proper images. They now show the herbicide category fallback image instead of the wrong product image.

## ✅ Current Status

- **Total Herbicide Products:** 76
- **✅ Unique Product Images:** 57 products
- **⚪ Using Category Fallback:** 18 products (need images)
- **✓ Excel Glycel (correct):** 1 product

## 📋 Products That Need Proper Images

The following products are currently using the herbicide category fallback image and need their actual product photos:

1. Alachlor 50% EC Herbicide
2. Clethodim 24% EC Herbicide
3. Diuron 80% WP Herbicide
4. Fenoxaprop 6.9% EC Herbicide
5. Fluchloralin 45% EC Herbicide
6. Imazamox 4% SL Herbicide
7. Imazapic 24% SL Herbicide
8. Imazapyr 25% SL Herbicide
9. Imazethapyr 10% SL Herbicide
10. Metolachlor 50% EC Herbicide
11. Oxyfluorfen 24% EC Herbicide
12. Paraquat 20% SL Herbicide
13. Pendimethalin 30% EC Herbicide
14. Propanil 40% EC Herbicide
15. Quizalofop 5% EC Herbicide
16. Sethoxydim 12.5% EC Herbicide
17. Trifluralin 48% EC Herbicide
18. Stomp 455 Cs – Pre-emergent Herbicide

## 📸 How to Add Proper Product Images

### Step 1: Prepare Product Images

1. Get high-quality product photos (minimum 500x500px, preferably 1200x1200px)
2. Supported formats: JPG, JPEG, PNG, WEBP
3. Name them descriptively (e.g., `alachlor-50-ec.jpg`)

### Step 2: Add Images to Store Folder

```bash
# Navigate to the product folder
cd /home/darksagae/Desktop/agrof-auto/agrof-main/mobile/app/assets/store/HERBICIDE/

# For example, to add image for Alachlor:
cd "Alachlor 50% EC"

# Remove the old placeholder
rm excel-glycel-herbicide-500x500.jpg

# Add the new product image
cp /path/to/your/alachlor-image.jpg alachlor-50-ec.jpg
```

### Step 3: Update Database

Create a script to update the image URL:

```javascript
// update_image.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./store-backend/store.db');

const productName = 'Alachlor 50% EC Herbicide';
const imagePath = '/api/images/HERBICIDE/Alachlor 50% EC/alachlor-50-ec.jpg';

db.run(
  'UPDATE products SET image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE name = ?',
  [imagePath, productName],
  (err) => {
    if (err) console.error(err);
    else console.log('✅ Image updated for', productName);
    db.close();
  }
);
```

Run it:
```bash
cd /home/darksagae/Desktop/agrof-auto
node update_image.js
```

### Step 4: Restart Backend

```bash
cd /home/darksagae/Desktop/agrof-auto
sudo docker compose restart store-backend
```

## 🔧 Bulk Update Script

If you have multiple images to add at once:

```bash
#!/bin/bash
# bulk_update_images.sh

PRODUCTS=(
  "Alachlor 50% EC Herbicide:alachlor-50-ec.jpg"
  "Clethodim 24% EC Herbicide:clethodim-24-ec.jpg"
  # Add more as needed
)

for entry in "${PRODUCTS[@]}"; do
  IFS=':' read -r product image <<< "$entry"
  folder=$(echo "$product" | sed 's/ Herbicide$//')
  
  echo "Processing: $product"
  
  # Update database
  docker exec agrof-auto-store-backend-1 node -e "
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('/app/store.db');
    db.run(
      'UPDATE products SET image_url = ? WHERE name = ?',
      ['/api/images/HERBICIDE/$folder/$image', '$product'],
      () => db.close()
    );
  "
done

echo "✅ All images updated!"
docker compose restart store-backend
```

## 🎯 Quick Check

Verify images are working:

```bash
# Check specific product
curl -s "http://192.168.1.15:3001/api/products?category=herbicides&limit=100" \
  | grep -A1 "Alachlor"

# Count products with images
curl -s "http://192.168.1.15:3001/api/products?category=herbicides&limit=100" \
  | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'{sum(1 for p in data if p.get(\"image_url\"))} products have images')"
```

## 📝 Notes

- Products with `NULL` image_url automatically use the herbicide category fallback image
- This is better than showing the wrong product (Excel Glycel) image
- The mobile app handles fallback images gracefully
- Add proper images gradually as you obtain them

## ✅ What's Fixed

- ✓ No products are showing incorrect images anymore
- ✓ Products without images show the herbicide category icon
- ✓ Excel Glycel correctly shows its own image
- ✓ All 57 products with unique images display correctly

