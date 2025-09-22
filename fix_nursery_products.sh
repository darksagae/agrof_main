#!/bin/bash

# Fix nursery products with correct image references
NURSERY_FILE="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/screens/NurseryBedScreen.js"

echo "Fixing nursery products with correct image references..."

# Create backup
cp "$NURSERY_FILE" "$NURSERY_FILE.backup2"

# Update image references with correct mapping
sed -i "s/nurseryImages\.nursery_1/nurseryImages['oregano_seedling']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_2/nurseryImages['lemon_grass_kisubi']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_3/nurseryImages['strawberry_chandler_seedlings']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_4/nurseryImages['musakala']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_5/nurseryImages['kibuzi_banana_t_c_plantlet']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_6/nurseryImages['coriander_seedlings']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_7/nurseryImages['sweet_basil_seedling_mujaaja']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_8/nurseryImages['parsley_seedling']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_9/nurseryImages['celery_seedling']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_10/nurseryImages['atwalira_banana_t_c_plantlet']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_11/nurseryImages['pineapple_mint_seedling']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_12/nurseryImages['lemon_balm_seedling']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_13/nurseryImages['m3_banana_suckers']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_14/nurseryImages['nakatansese_banana_t_c_plantlet']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_15/nurseryImages['mbwazirume_banana_t_c_plantlet']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_16/nurseryImages['chocolate_mint_seedling']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_17/nurseryImages['aloe_vera_seedling']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_18/nurseryImages['mint_seedling']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_19/nurseryImages['bogoya_gros_michel_banana_t_c_plantlet']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_20/nurseryImages['cinnamon_seedling']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_21/nurseryImages['kisansa_banana_t_c_plantlet']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_22/nurseryImages['mpologoma_banana_t_c_plantlet']/g" "$NURSERY_FILE"
sed -i "s/nurseryImages\.nursery_23/nurseryImages['rosemary_seedling']/g" "$NURSERY_FILE"

echo "Nursery products fixed successfully!"
echo "All 23 products now have correct image references"
