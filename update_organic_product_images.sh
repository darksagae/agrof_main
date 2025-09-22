#!/bin/bash

# Script to update organic chemical products with correct image references
echo "=== UPDATING ORGANIC CHEMICAL PRODUCT IMAGES ==="

ORGANIC_SCREEN_FILE="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/screens/OrganicChemicalsScreen.js"

# Define product name to image key mapping
declare -A product_image_map=(
    ["Organic Neem Oil"]="sg1000"
    ["Organic Compost Tea"]="oscars_oligo"
    ["Organic Garlic Spray"]="vermicompost_100"
    ["Organic Seaweed Extract"]="superagric_silage"
    ["Organic Diatomaceous Earth"]="seek_bambo"
    ["Organic Fish Emulsion"]="oscars_primo"
)

echo "Updating organic chemical products with correct image references..."

for product_name in "${!product_image_map[@]}"; do
    image_key="${product_image_map[$product_name]}"
    echo "Updating '$product_name' to use '$image_key' image"
    
    # Update the image reference
    sed -i "s|image: require('../assets/organic_chemicals.png'),|image: organicImages['$image_key'],|g" "$ORGANIC_SCREEN_FILE"
done

echo "All organic chemical products updated!"
echo "Verifying changes..."
grep -n "image: organicImages\[" "$ORGANIC_SCREEN_FILE"
