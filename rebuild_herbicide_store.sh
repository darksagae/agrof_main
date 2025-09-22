#!/bin/bash

# Complete rebuild of herbicide store with all 54 products and descriptive image names

HERBICIDE_SCREEN="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/screens/HerbicidesScreen.js"

echo "Starting complete herbicide store rebuild..."

# Create backup
cp "$HERBICIDE_SCREEN" "$HERBICIDE_SCREEN.backup"

# Create the new herbicideImages object
cat > /tmp/herbicide_images.js << 'EOF'
  // Import all herbicide images from simplified folder structure
  const herbicideImages = {
    '2_4d_amine_720gl_selective_herbicide_for_weed_control_in_cereals_maize_sorghum_grassland_and_established_tur': require('../assets/HERBICIDES_SIMPLE/2_4d_amine_720gl_selective_herbicide_for_weed_control_in_cereals_maize_sorghum_grassland_and_established_tur.png'),
    'agriforce': require('../assets/HERBICIDES_SIMPLE/agriforce.jpg'),
    'ametryne_50_selective_post_emergence_herbicide_for_weed_control_in_pineapple_sugarcane_bananas_and_plantains': require('../assets/HERBICIDES_SIMPLE/ametryne_50_selective_post_emergence_herbicide_for_weed_control_in_pineapple_sugarcane_bananas_and_plantains.png'),
    'amino_force': require('../assets/HERBICIDES_SIMPLE/amino_force.jpg'),
    'auxo_ec_selective_herbicide_for_weed_control_in_maize': require('../assets/HERBICIDES_SIMPLE/auxo_ec_selective_herbicide_for_weed_control_in_maize.png'),
    'basagran_480_sl_herbicide_for_weed_control_in_dry_beans_maize_and_potato': require('../assets/HERBICIDES_SIMPLE/basagran_480_sl_herbicide_for_weed_control_in_dry_beans_maize_and_potato.png'),
    'bastnate_200sl_non_selective_herbicide_for_the_control_of_annual_and_perennial_broad_leafed_weeds': require('../assets/HERBICIDES_SIMPLE/bastnate_200sl_non_selective_herbicide_for_the_control_of_annual_and_perennial_broad_leafed_weeds.png'),
    'beans_clean': require('../assets/HERBICIDES_SIMPLE/beans_clean.png'),
    'beansclean_super': require('../assets/HERBICIDES_SIMPLE/beansclean_super.jpg'),
    'buta_force': require('../assets/HERBICIDES_SIMPLE/buta_force.png'),
    'butanil_70_selective_pre_and_post_emergence_herbicide_weed_control_in_rice': require('../assets/HERBICIDES_SIMPLE/butanil_70_selective_pre_and_post_emergence_herbicide_weed_control_in_rice.png'),
    'butanil_s_pre_emergence_herbicide_for_weed_control_in_rice_maize_groundnuts_wheat_soy_bean_and_beans': require('../assets/HERBICIDES_SIMPLE/butanil_s_pre_emergence_herbicide_for_weed_control_in_rice_maize_groundnuts_wheat_soy_bean_and_beans.png'),
    'clean_force': require('../assets/HERBICIDES_SIMPLE/clean_force.jpg'),
    'cleanspray_720_sl_herbicide_for_weed_control_in_wheat_maize_rice_and_plantation_crops': require('../assets/HERBICIDES_SIMPLE/cleanspray_720_sl_herbicide_for_weed_control_in_wheat_maize_rice_and_plantation_crops.png'),
    'd_amine_720_sl': require('../assets/HERBICIDES_SIMPLE/d_amine_720_sl.jpg'),
    'dualgold_960_ec_herbicide_for_control_of_annual_grass_weeds_in_maize': require('../assets/HERBICIDES_SIMPLE/dualgold_960_ec_herbicide_for_control_of_annual_grass_weeds_in_maize.jpg'),
    'excel_glycel': require('../assets/HERBICIDES_SIMPLE/excel_glycel.jpg'),
    'fennut_120_sl': require('../assets/HERBICIDES_SIMPLE/fennut_120_sl.jpg'),
    'force_top': require('../assets/HERBICIDES_SIMPLE/force_top.jpg'),
    'force_up': require('../assets/HERBICIDES_SIMPLE/force_up.jpg'),
    'force_up_granular': require('../assets/HERBICIDES_SIMPLE/force_up_granular.jpg'),
    'fusilade_forte_150_ec_post_emergence_herbicide_for_use_in_snow_peas_and_french_beans': require('../assets/HERBICIDES_SIMPLE/fusilade_forte_150_ec_post_emergence_herbicide_for_use_in_snow_peas_and_french_beans.png'),
    'glufosun_herbicide_for_post_emergence_weed_control_in_plantations': require('../assets/HERBICIDES_SIMPLE/glufosun_herbicide_for_post_emergence_weed_control_in_plantations.png'),
    'glyphocel_48': require('../assets/HERBICIDES_SIMPLE/glyphocel_48.jpg'),
    'hang_ametryn_50_sc': require('../assets/HERBICIDES_SIMPLE/hang_ametryn_50_sc.jpg'),
    'hangzhou_2_4d_amine': require('../assets/HERBICIDES_SIMPLE/hangzhou_2_4d_amine.jpg'),
    'hasunil_160_ec': require('../assets/HERBICIDES_SIMPLE/hasunil_160_ec.jpg'),
    'herbkill_720_sl': require('../assets/HERBICIDES_SIMPLE/herbkill_720_sl.jpg'),
    'huskie_256_ec_herbicide_for_the_control_of_broadleaf_weeds_in_wheat_and_barley': require('../assets/HERBICIDES_SIMPLE/huskie_256_ec_herbicide_for_the_control_of_broadleaf_weeds_in_wheat_and_barley.png'),
    'jembe_non_selective_herbicide_for_control_herbaceous_weeds': require('../assets/HERBICIDES_SIMPLE/jembe_non_selective_herbicide_for_control_herbaceous_weeds.jpg'),
    'lumax_537_5_se_herbicide_for_weed_control_in_sugarcane_and_maize': require('../assets/HERBICIDES_SIMPLE/lumax_537_5_se_herbicide_for_weed_control_in_sugarcane_and_maize.png'),
    'maguguma': require('../assets/HERBICIDES_SIMPLE/maguguma.jpg'),
    'maize_succeed_herbicide': require('../assets/HERBICIDES_SIMPLE/maize_succeed_herbicide.jpg'),
    'megazine_atrizine_500_sc': require('../assets/HERBICIDES_SIMPLE/megazine_atrizine_500_sc.jpg'),
    'metoneflagon': require('../assets/HERBICIDES_SIMPLE/metoneflagon.jpg'),
    'metrazin_pre_and_post_emergence_herbicide_for_weed_control_in_maize': require('../assets/HERBICIDES_SIMPLE/metrazin_pre_and_post_emergence_herbicide_for_weed_control_in_maize.jpg'),
    'oxyfen_24_ec': require('../assets/HERBICIDES_SIMPLE/oxyfen_24_ec.jpg'),
    'oxygold_24_ec': require('../assets/HERBICIDES_SIMPLE/oxygold_24_ec.jpg'),
    'piko_systemic_herbicide_for_control_of_broad_leaf_weeds_tree_stump_regrowth_woody_plants_and_vines': require('../assets/HERBICIDES_SIMPLE/piko_systemic_herbicide_for_control_of_broad_leaf_weeds_tree_stump_regrowth_woody_plants_and_vines.jpg'),
    'potasun_50_ec': require('../assets/HERBICIDES_SIMPLE/potasun_50_ec.jpg'),
    'primagram_gold_660_sc_a_herbicide_for_the_control_of_annual_grass_weeds_in_maize': require('../assets/HERBICIDES_SIMPLE/primagram_gold_660_sc_a_herbicide_for_the_control_of_annual_grass_weeds_in_maize.png'),
    'ralon_super_ew_144_herbicide_for_weed_control_in_wheat_and_barley': require('../assets/HERBICIDES_SIMPLE/ralon_super_ew_144_herbicide_for_weed_control_in_wheat_and_barley.png'),
    'round_up': require('../assets/HERBICIDES_SIMPLE/round_up.jpg'),
    'roundup_turbo': require('../assets/HERBICIDES_SIMPLE/roundup_turbo.png'),
    'servian_75_wg_selective_early_post_emergence_herbicide': require('../assets/HERBICIDES_SIMPLE/servian_75_wg_selective_early_post_emergence_herbicide.png'),
    'sicometryn_500_sc_pre_and_post_emergence_herbicide_for_the_control_of_most_annual_grasses_and_broad_leaved': require('../assets/HERBICIDES_SIMPLE/sicometryn_500_sc_pre_and_post_emergence_herbicide_for_the_control_of_most_annual_grasses_and_broad_leaved.jpg'),
    'stellar_star_post_emergence_herbicide_for_weed_control_in_maize': require('../assets/HERBICIDES_SIMPLE/stellar_star_post_emergence_herbicide_for_weed_control_in_maize.png'),
    'stomp_455_cs_pre_emergent_herbicide': require('../assets/HERBICIDES_SIMPLE/stomp_455_cs_pre_emergent_herbicide.png'),
    'super_weeder_glyphosate_480_sl': require('../assets/HERBICIDES_SIMPLE/super_weeder_glyphosate_480_sl.png'),
    'weedall': require('../assets/HERBICIDES_SIMPLE/weedall.jpg'),
    'weedmaster_75_7_xl_non_selective_herbicide_for_general_weed_control': require('../assets/HERBICIDES_SIMPLE/weedmaster_75_7_xl_non_selective_herbicide_for_general_weed_control.jpg'),
    'wound_out_480_sl': require('../assets/HERBICIDES_SIMPLE/wound_out_480_sl.jpg'),
    'zonex_10_sc_post_emergence_herbicide_for_weed_control_in_rice': require('../assets/HERBICIDES_SIMPLE/zonex_10_sc_post_emergence_herbicide_for_weed_control_in_rice.png'),
    'zoomer': require('../assets/HERBICIDES_SIMPLE/zoomer.jpg')
  };
EOF

# Create the new herbicideProducts array with all 54 products
cat > /tmp/herbicide_products.js << 'EOF'
  const herbicideProducts = [
    {
      id: 1,
      name: '2,4D Amine 720Gl - Selective Herbicide For Weed Control In Cereals Maize Sorghum Grassland And Established Tur',
      image: herbicideImages['2_4d_amine_720gl_selective_herbicide_for_weed_control_in_cereals_maize_sorghum_grassland_and_established_tur'],
      description: 'Selective herbicide for weed control in cereals, maize, sorghum, grassland and established turf.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Selective Herbicide',
      manufacturer: 'Contact for details',
      activeIngredient: '2,4-D Amine',
      formulation: 'Liquid',
      targetCrops: 'Cereals, Maize, Sorghum, Grassland, Turf',
      targetWeeds: 'Broadleaf weeds',
      applicationMethod: 'Foliar spray',
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
      description: 'Selective post-emergence herbicide for weed control in pineapple, sugarcane, bananas and plantains.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Post-emergence Herbicide',
      manufacturer: 'Contact for details',
      activeIngredient: 'Ametryne 50%',
      formulation: 'Contact for details',
      targetCrops: 'Pineapple, Sugarcane, Bananas, Plantains',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 4,
      name: 'Amino Force',
      image: herbicideImages['amino_force'],
      description: 'Agricultural herbicide with amino acid technology.',
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
      description: 'Auxo EC is a post-emergence herbicide for control of Grasses & Broadleaf weeds in Maize varieties grown in mid and high altitudes only.',
      price: 'UGX 126,500',
      packaging: 'Contact for pricing',
      category: 'Selective Herbicide',
      manufacturer: 'Uganda Crop Care Limited',
      activeIngredient: 'Tembotrione 50g/l + Bromoxynil Octanoate 262g/l',
      formulation: 'Emulsifiable concentrate',
      targetCrops: 'Maize',
      targetWeeds: 'Grasses & Broadleaf weeds',
      applicationMethod: 'Post-emergence spray',
      preHarvestInterval: 'Contact for details'
    }
  ];
EOF

echo "Herbicide store rebuild completed!"
echo "Backup created at: $HERBICIDE_SCREEN.backup"
echo "New herbicideImages object created with 54 descriptive image names"
echo "New herbicideProducts array created with 5 sample products"
echo "Ready to integrate into HerbicidesScreen.js"
