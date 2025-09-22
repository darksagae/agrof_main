#!/bin/bash

# Script to rename organic chemical images with descriptive names
echo "=== RENAMING ORGANIC CHEMICAL IMAGES ==="

# Source and destination directories
SIMPLE_DIR="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/ORGANIC_CHEMICALS_SIMPLE"
ORIGINAL_DIR="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/ORGANIC_CHEMICALS"

# Create original directory if it doesn't exist
mkdir -p "$ORIGINAL_DIR"

# Define descriptive names for organic chemical products
declare -A organic_names=(
    ["organic_1.png"]="neem_oil_organic_pest_control.png"
    ["organic_2.jpg"]="compost_tea_organic_fertilizer.jpg"
    ["organic_3.png"]="garlic_spray_natural_insecticide.png"
    ["organic_4.jpg"]="fish_emulsion_organic_fertilizer.jpg"
    ["organic_5.jpeg"]="seaweed_extract_plant_tonic.jpeg"
    ["organic_6.png"]="beneficial_bacteria_soil_conditioner.png"
    ["organic_7.png"]="worm_castings_organic_fertilizer.png"
    ["organic_8.jpeg"]="bone_meal_organic_fertilizer.jpeg"
    ["organic_9.png"]="blood_meal_nitrogen_fertilizer.png"
    ["organic_10.jpg"]="kelp_meal_organic_fertilizer.jpg"
    ["organic_11.jpg"]="alfalfa_meal_organic_fertilizer.jpg"
    ["organic_12.jpg"]="green_sand_soil_conditioner.jpg"
    ["organic_13.png"]="rock_phosphate_organic_fertilizer.png"
    ["organic_14.jpeg"]="gypsum_soil_conditioner.jpeg"
)

# Copy and rename images
echo "Copying and renaming organic chemical images..."
for old_name in "${!organic_names[@]}"; do
    new_name="${organic_names[$old_name]}"
    if [ -f "$SIMPLE_DIR/$old_name" ]; then
        cp "$SIMPLE_DIR/$old_name" "$ORIGINAL_DIR/$new_name"
        echo "✅ Copied: $old_name -> $new_name"
    else
        echo "❌ File not found: $old_name"
    fi
done

echo "=== ORGANIC CHEMICAL IMAGES RENAMED ==="
echo "Total images processed: ${#organic_names[@]}"
echo "Original directory: $ORIGINAL_DIR"
ls -la "$ORIGINAL_DIR"
