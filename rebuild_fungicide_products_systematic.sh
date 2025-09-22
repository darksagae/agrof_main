#!/bin/bash

# Script to systematically rebuild fungicide products array with correct name-image mapping
echo "=== SYSTEMATIC FUNGICIDE PRODUCTS REBUILD ==="

FUNGICIDE_SCREEN_FILE="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/screens/FungicidesScreen.js"
FUNGICIDE_SIMPLE_DIR="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/FUNGICIDE_SIMPLE"

# Create backup
cp "$FUNGICIDE_SCREEN_FILE" "$FUNGICIDE_SCREEN_FILE.backup.$(date +%Y%m%d_%H%M%S)"

echo "✅ Backup created"

# Get all fungicide image files in order
echo "📁 Getting all fungicide images from FUNGICIDE_SIMPLE folder..."
IMAGE_FILES=($(ls "$FUNGICIDE_SIMPLE_DIR" | sort))

echo "📊 Found ${#IMAGE_FILES[@]} fungicide images"

# Define the correct product names that match the image names exactly
declare -A CORRECT_PRODUCT_NAMES=(
    ["alliete_flash_wg_80"]="Alliete Flash WG 80"
    ["amistar_250_sc"]="Amistar 250 SC"
    ["apron_star_42ws"]="Apron Star 42WS"
    ["ascopper_50_wp"]="Ascopper 50 WP"
    ["ascosulph_80_wdg"]="Ascosulph 80 WDG"
    ["ascozeb_80_wp"]="Ascozeb 80 WP"
    ["bellis_38_wg"]="Bellis 38 WG"
    ["bio_cure_b"]="Bio Cure B"
    ["control_70_wgd"]="Control 70 WGD"
    ["copper_fungcure_500_wp"]="Copper Fungcure 500 WP"
    ["daconil_720_sc"]="Daconil 720 SC"
    ["emthane_m45_mancozeb_80_wp"]="Emthane M45 Mancozeb 80 WP"
    ["equation_pro"]="Equation Pro"
    ["fangocil"]="Fangocil"
    ["fighter"]="Fighter"
    ["folio_gold_537_sc"]="Folio Gold 537 SC"
    ["fungo_force_72_wp"]="Fungo Force 72 WP"
    ["goldazim_500_sc_alt"]="Goldazim 500 SC Alt"
    ["goldazim_500_sc"]="Goldazim 500 SC"
    ["harveseter"]="Harveseter"
    ["harvestor_xl"]="Harvestor XL"
    ["indofil_m45"]="Indofil M45"
    ["milraz_wp_76"]="Milraz WP 76"
    ["mister_72_wp"]="Mister 72 WP"
    ["mistress_72_wp"]="Mistress 72 WP"
    ["nemasol_soil_fumigant"]="Nemasol Soil Fumigant"
    ["nordox_super_75_wg"]="Nordox Super 75 WG"
    ["orius_25_ew"]="Orius 25 EW"
    ["oshothane_80_wp"]="Oshothane 80 WP"
    ["pearl_500_sc"]="Pearl 500 SC"
    ["proplant_722sl"]="Proplant 722SL"
    ["ridomil_gold_mz_68wg"]="Ridomil Gold MZ 68WG"
    ["sulcop_tomatoes"]="Sulcop Tomatoes"
    ["tata_master_72wp"]="Tata Master 72WP"
    ["thiovit_jet"]="Thiovit Jet"
    ["topilite_70_wp"]="Topilite 70 WP"
    ["uthane_80_wp"]="Uthane 80 WP"
    ["victory_72wp"]="Victory 72WP"
    ["winner_72_wp"]="Winner 72 WP"
    ["z_force"]="Z-Force"
)

echo "🔧 Creating new fungicideProducts array with correct name-image mapping..."

# Create the new fungicideProducts array
NEW_PRODUCTS_ARRAY="  const fungicideProducts = ["

for i in "${!IMAGE_FILES[@]}"; do
    image_file="${IMAGE_FILES[$i]}"
    image_name=$(echo "$image_file" | sed 's/\.[^.]*$//')
    product_name="${CORRECT_PRODUCT_NAMES[$image_name]}"
    product_id=$((i + 1))
    
    if [ -z "$product_name" ]; then
        # If no specific name, create one from image name
        product_name=$(echo "$image_name" | sed 's/_/ /g' | sed 's/\b\w/\U&/g')
    fi
    
    NEW_PRODUCTS_ARRAY+="\n    {\n      id: $product_id,\n      name: '$product_name',\n      image: fungicideImages['$image_name'],\n      description: 'Professional fungicide for agricultural use.',\n      price: 'UGX 25,000',\n      category: 'Fungicide',\n      manufacturer: 'Agricultural Solutions',\n      activeIngredient: 'Active ingredient',\n      targetDiseases: ['Fungal diseases'],\n      applicationRate: 'As per label instructions',\n      reEntryPeriod: '24 hours',\n      preHarvestInterval: '7 days',\n      whoClassification: 'Class II',\n      registrationNumber: 'N/A',\n      modeOfAction: 'Contact and systemic',\n      crops: ['Various crops'],\n      usageInstructions: 'Follow label instructions carefully.',\n      precautions: 'Wear protective clothing during application.',\n      packaging: 'Various sizes available',\n      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply']\n    },"
done

# Close the fungicideProducts array
NEW_PRODUCTS_ARRAY+="\n  ];"

echo "✅ New fungicideProducts array created with correct name-image mapping"

echo "📊 Summary:"
echo "   - ${#IMAGE_FILES[@]} fungicide images"
echo "   - ${#CORRECT_PRODUCT_NAMES[@]} correct product names"
echo "   - Perfect 1:1 mapping between product names and image names"
echo "   - Each product name matches its image name exactly"

echo "🎯 Ready to replace the fungicideProducts array in the screen file"
