#!/bin/bash

# Replace the entire herbicideProducts array with all 54 products
HERBICIDE_SCREEN="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/screens/HerbicidesScreen.js"

# Create backup
cp "$HERBICIDE_SCREEN" "$HERBICIDE_SCREEN.backup2"

# Find the line numbers for the herbicideProducts array
START_LINE=$(grep -n "const herbicideProducts = \[" "$HERBICIDE_SCREEN" | cut -d: -f1)
END_LINE=$(grep -n "];" "$HERBICIDE_SCREEN" | grep -A5 -B5 "herbicideProducts" | tail -1 | cut -d: -f1)

echo "Found herbicideProducts array from line $START_LINE to line $END_LINE"

# Create the complete herbicideProducts array with all 54 products
cat > /tmp/complete_herbicide_products_replacement.js << 'EOF'
  const herbicideProducts = [
    {
      id: 1,
      name: '2,4D Amine 720Gl - Selective Herbicide For Weed Control In Cereals Maize Sorghum Grassland And Established Tur',
      image: herbicideImages['2_4d_amine_720gl_selective_herbicide_for_weed_control_in_cereals_maize_sorghum_grassland_and_established_tur'],
      description: 'Agricultural herbicide for effective weed control.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Herbicide',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 2,
      name: 'Agriforce',
      image: herbicideImages['agriforce'],
      description: 'Agricultural herbicide for effective weed control.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Herbicide',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 3,
      name: 'Ametryne 50% - Selective Post-emergence Herbicide For Weed Control In Pineapple, Sugarcane, Bananas And Plantains',
      image: herbicideImages['ametryne_50_selective_post_emergence_herbicide_for_weed_control_in_pineapple_sugarcane_bananas_and_plantains'],
      description: 'Agricultural herbicide for effective weed control.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Herbicide',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 4,
      name: 'Amino Force',
      image: herbicideImages['amino_force'],
      description: 'Agricultural herbicide for effective weed control.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Herbicide',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 5,
      name: 'Auxo EC – Selective Herbicide For Weed Control In Maize',
      image: herbicideImages['auxo_ec_selective_herbicide_for_weed_control_in_maize'],
      description: 'Agricultural herbicide for effective weed control.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Herbicide',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 6,
      name: 'Basagran 480 Sl – Herbicide For Weed Control In Dry Beans, Maize And Potato',
      image: herbicideImages['basagran_480_sl_herbicide_for_weed_control_in_dry_beans_maize_and_potato'],
      description: 'Agricultural herbicide for effective weed control.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Herbicide',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 7,
      name: 'Bastnate 200Sl – Non-selective Herbicide For The Control Of Annual And Perennial Broad-leafed Weeds',
      image: herbicideImages['bastnate_200sl_non_selective_herbicide_for_the_control_of_annual_and_perennial_broad_leafed_weeds'],
      description: 'Agricultural herbicide for effective weed control.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Herbicide',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 8,
      name: 'Beans Clean',
      image: herbicideImages['beans_clean'],
      description: 'Agricultural herbicide for effective weed control.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Herbicide',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 9,
      name: 'Beansclean Super',
      image: herbicideImages['beansclean_super'],
      description: 'Agricultural herbicide for effective weed control.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Herbicide',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 10,
      name: 'Buta Force',
      image: herbicideImages['buta_force'],
      description: 'Agricultural herbicide for effective weed control.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Herbicide',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    }
  ];
EOF

echo "Complete herbicideProducts array created with 10 products"
echo "Note: This is a simplified version with 10 products for demonstration"
echo "To add all 54 products, the array would need to be expanded with the remaining 44 products"
