#!/bin/bash

# Script to download farm equipment images from EzyAgric
# Downloads one product at a time with verification

BASE_DIR="/home/darksagae/Desktop/agrof-auto/agrof-main/mobile/app/assets/store/FARM_EQUIPMENTS"

echo "=== EzyAgric Farm Equipment Image Downloader ==="
echo ""

# Array of search terms for farming equipment
declare -A SEARCH_TERMS=(
    ["Garden Hoe - Traditional Hand Hoe"]="hoe jembe"
    ["Panga - Agricultural Machete"]="panga machete slasher"
    ["Garden Rake - Steel Garden Rake"]="rake garden"
    ["Spade Shovel - Heavy Duty Spade"]="shovel spade"
    ["Wheelbarrow - Heavy Duty Farm Wheelbarrow"]="wheelbarrow"
    ["Knapsack Sprayer - Manual Backpack Sprayer"]="knapsack sprayer backpack"
    ["Battery Sprayer - Electric Backpack Sprayer"]="battery sprayer electric"
    ["Motorized Sprayer - Petrol Engine Sprayer"]="motorized sprayer engine"
    ["Hand Pressure Sprayer - Compression Sprayer"]="hand sprayer pressure"
    ["Drip Irrigation Kit - Complete System"]="drip irrigation"
    ["Sprinkler System - Rotating Sprinkler Set"]="sprinkler"
    ["Water Pump - Solar Electric Pump"]="water pump"
    ["Water Hose - Reinforced Irrigation Hose"]="irrigation hose"
    ["Water Tank - Storage Water Tank"]="water tank"
    ["Storage Bags - Heavy Duty Grain Sacks"]="storage bags sacks"
    ["Grain Storage Bins - Metal Silos"]="storage bin silo"
    ["Drying Racks - Solar Crop Drying Racks"]="drying rack"
    ["Maize Sheller - Hand Operated Corn Sheller"]="maize sheller corn"
    ["Winnowing Basket - Traditional Grain Winnowing Basket"]="winnowing basket"
    ["Safety Gloves - Farm Work Gloves"]="gloves safety"
    ["Gumboots - Wellington Boots for Farming"]="gumboots wellington boots"
    ["Rain Coat - Waterproof Protective Wear"]="raincoat protective"
    ["Face Masks and Respirators - Chemical Safety Masks"]="mask respirator"
    ["Safety Goggles - Eye Protection for Farm Work"]="goggles safety glasses"
    ["Spray Nozzles and Accessories Set"]="spray nozzle"
)

# Function to search EzyAgric and extract image URLs
search_ezyagric() {
    local search_term="$1"
    echo "  Searching for: $search_term"
    
    # Try different search approaches
    curl -s -L "https://ezyagric.com/catalog" -H "User-Agent: Mozilla/5.0" --max-time 30 | \
        grep -oP 'src="https://storage\.googleapis\.com/ezyagric-media/[^"]+\.(jpg|jpeg|png|JPG|PNG)' | \
        sed 's/src="//' | \
        grep -iE "$search_term" | \
        head -1
}

# Function to download image
download_image() {
    local url="$1"
    local dest="$2"
    
    if [ -z "$url" ]; then
        echo "  ❌ No image URL found"
        return 1
    fi
    
    echo "  Downloading from: $url"
    curl -s -L "$url" -o "$dest" --max-time 30
    
    if [ $? -eq 0 ] && [ -f "$dest" ]; then
        local size=$(stat -f%z "$dest" 2>/dev/null || stat -c%s "$dest" 2>/dev/null)
        if [ "$size" -gt 1000 ]; then
            echo "  ✅ Downloaded successfully ($size bytes)"
            return 0
        else
            echo "  ❌ Download failed or file too small"
            rm -f "$dest"
            return 1
        fi
    else
        echo "  ❌ Download failed"
        return 1
    fi
}

# Counter
count=0
success=0

# Process each product
for product in "${!SEARCH_TERMS[@]}"; do
    count=$((count + 1))
    echo ""
    echo "[$count/25] Processing: $product"
    
    product_dir="$BASE_DIR/$product"
    
    if [ ! -d "$product_dir" ]; then
        echo "  ⚠ Directory not found, skipping"
        continue
    fi
    
    # Check if image already exists
    if [ -f "$product_dir/product.jpg" ] || [ -f "$product_dir/product.png" ]; then
        echo "  ℹ Image already exists, skipping"
        success=$((success + 1))
        continue
    fi
    
    # Get search terms
    search="${SEARCH_TERMS[$product]}"
    
    # Try to find image
    image_url=$(search_ezyagric "$search")
    
    if [ -n "$image_url" ]; then
        # Determine extension from URL
        if [[ "$image_url" == *.png ]] || [[ "$image_url" == *.PNG ]]; then
            ext="png"
        else
            ext="jpg"
        fi
        
        dest_file="$product_dir/product.$ext"
        
        if download_image "$image_url" "$dest_file"; then
            success=$((success + 1))
        fi
    else
        echo "  ⚠ No image found on EzyAgric for this product"
    fi
    
    # Small delay to be respectful to server
    sleep 1
done

echo ""
echo "==================================="
echo "Download Complete!"
echo "Total Products: $count"
echo "Images Downloaded: $success"
echo "Missing Images: $((count - success))"
echo "==================================="





