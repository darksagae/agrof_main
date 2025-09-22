#!/bin/bash

# Script to rename organic chemical images with correct product names from ezyagric.com
echo "=== RENAMING ORGANIC CHEMICAL IMAGES WITH CORRECT PRODUCT NAMES ==="

# Source and destination directories
SIMPLE_DIR="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/ORGANIC_CHEMICALS_SIMPLE"
ORIGINAL_DIR="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/ORGANIC_CHEMICALS"

# Define correct product names mapping
declare -A correct_names=(
    ["worm_castings_organic_fertilizer.png"]="solum2soil.png"
    ["seaweed_extract_plant_tonic.jpeg"]="superagric_silage.jpeg"
    ["rock_phosphate_organic_fertilizer.png"]="vermichar.png"
    ["neem_oil_organic_pest_control.png"]="sg1000.png"
    ["kelp_meal_organic_fertilizer.jpg"]="humate.jpg"
    ["gypsum_soil_conditioner.jpeg"]="calphos_organic.jpeg"
    ["green_sand_soil_conditioner.jpg"]="orb_l.jpg"
    ["garlic_spray_natural_insecticide.png"]="vermicompost_100.png"
    ["fish_emulsion_organic_fertilizer.jpg"]="oscars_primo.jpg"
    ["compost_tea_organic_fertilizer.jpg"]="oscars_oligo.jpg"
    ["bone_meal_organic_fertilizer.jpeg"]="superagric_germination_booster.jpeg"
    ["blood_meal_nitrogen_fertilizer.png"]="fungicide.png"
    ["beneficial_bacteria_soil_conditioner.png"]="seek_bambo.png"
    ["alfalfa_meal_organic_fertilizer.jpg"]="fertiplus.jpg"
)

echo "Renaming images in SIMPLE folder..."
for old_name in "${!correct_names[@]}"; do
    new_name="${correct_names[$old_name]}"
    if [ -f "$SIMPLE_DIR/$old_name" ]; then
        mv "$SIMPLE_DIR/$old_name" "$SIMPLE_DIR/$new_name"
        echo "✅ Renamed: $old_name -> $new_name"
    else
        echo "❌ File not found: $old_name"
    fi
done

echo ""
echo "Renaming images in ORIGINAL folder..."
for old_name in "${!correct_names[@]}"; do
    new_name="${correct_names[$old_name]}"
    if [ -f "$ORIGINAL_DIR/$old_name" ]; then
        mv "$ORIGINAL_DIR/$old_name" "$ORIGINAL_DIR/$new_name"
        echo "✅ Renamed: $old_name -> $new_name"
    else
        echo "❌ File not found: $old_name"
    fi
done

echo ""
echo "=== ORGANIC CHEMICAL IMAGES RENAMED WITH CORRECT PRODUCT NAMES ==="
echo "Total images processed: ${#correct_names[@]}"
echo ""
echo "SIMPLE directory: $SIMPLE_DIR"
ls -la "$SIMPLE_DIR"
echo ""
echo "ORIGINAL directory: $ORIGINAL_DIR"
ls -la "$ORIGINAL_DIR"
