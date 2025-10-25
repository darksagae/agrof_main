#!/bin/bash

echo "============================================================"
echo "COPYING NURSERY BED IMAGES AND IMPORTING TO DATABASE"
echo "============================================================"
echo ""

OLD_DIR="./agrof-main/mobile/app/assets/store/Nursery_bed"
NEW_DIR="./agrof-main/mobile/app/assets/store/NURSERY_BED"

# Copy images from old Nursery_bed product folders to new NURSERY_BED folders
echo "📸 Copying images from old folders..."
echo ""

# For each product folder in old directory
for old_product in "$OLD_DIR"/*/ ; do
  if [ -d "$old_product" ]; then
    product_name=$(basename "$old_product")
    new_product="$NEW_DIR/$product_name"
    
    if [ -d "$new_product" ]; then
      # Copy all images from old to new
      cp "$old_product"/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP} "$new_product/" 2>/dev/null && echo "✅ Copied images for: $product_name"
    fi
  fi
done

echo ""
echo "============================================================"
echo "IMAGES COPIED - Now importing to database..."
echo "============================================================"
echo ""

# Now import all products to database
cd store-backend
node import-nursery-bed.js

echo ""
echo "============================================================"
echo "COMPLETE"
echo "============================================================"




