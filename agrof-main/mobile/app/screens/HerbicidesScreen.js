import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import HerbicideDetailScreen from './HerbicideDetailScreen';
import LazyImage from '../components/LazyImage';

const HerbicidesScreen = ({ onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Static image mapping for all herbicide images
  const herbicideImages = {
    '2_4d_amine_720gl_selective_herbicide_for_weed_control_in_cereals_maize_sorghum_grassland_and_established_tur.png': require('../assets/HERBICIDES_SIMPLE/2_4d_amine_720gl_selective_herbicide_for_weed_control_in_cereals_maize_sorghum_grassland_and_established_tur.png'),
    'agriforce.jpg': require('../assets/HERBICIDES_SIMPLE/agriforce.jpg'),
    'ametryne_50_selective_post_emergence_herbicide_for_weed_control_in_pineapple_sugarcane_bananas_and_plantains.png': require('../assets/HERBICIDES_SIMPLE/ametryne_50_selective_post_emergence_herbicide_for_weed_control_in_pineapple_sugarcane_bananas_and_plantains.png'),
    'amino_force.jpg': require('../assets/HERBICIDES_SIMPLE/amino_force.jpg'),
    'auxo_ec_selective_herbicide_for_weed_control_in_maize.png': require('../assets/HERBICIDES_SIMPLE/auxo_ec_selective_herbicide_for_weed_control_in_maize.png'),
    'basagran_480_sl_herbicide_for_weed_control_in_dry_beans_maize_and_potato.png': require('../assets/HERBICIDES_SIMPLE/basagran_480_sl_herbicide_for_weed_control_in_dry_beans_maize_and_potato.png'),
    'bastnate_200sl_non_selective_herbicide_for_the_control_of_annual_and_perennial_broad_leafed_weeds.png': require('../assets/HERBICIDES_SIMPLE/bastnate_200sl_non_selective_herbicide_for_the_control_of_annual_and_perennial_broad_leafed_weeds.png'),
    'beans_clean.png': require('../assets/HERBICIDES_SIMPLE/beans_clean.png'),
    'beansclean_super.jpg': require('../assets/HERBICIDES_SIMPLE/beansclean_super.jpg'),
    'buta_force.png': require('../assets/HERBICIDES_SIMPLE/buta_force.png'),
    'butanil_70_selective_pre_and_post_emergence_herbicide_weed_control_in_rice.png': require('../assets/HERBICIDES_SIMPLE/butanil_70_selective_pre_and_post_emergence_herbicide_weed_control_in_rice.png'),
    'butanil_s_pre_emergence_herbicide_for_weed_control_in_rice_maize_groundnuts_wheat_soy_bean_and_beans.png': require('../assets/HERBICIDES_SIMPLE/butanil_s_pre_emergence_herbicide_for_weed_control_in_rice_maize_groundnuts_wheat_soy_bean_and_beans.png'),
    'clean_force.jpg': require('../assets/HERBICIDES_SIMPLE/clean_force.jpg'),
    'cleanspray_720_sl_herbicide_for_weed_control_in_wheat_maize_rice_and_plantation_crops.png': require('../assets/HERBICIDES_SIMPLE/cleanspray_720_sl_herbicide_for_weed_control_in_wheat_maize_rice_and_plantation_crops.png'),
    'd_amine_720_sl.jpg': require('../assets/HERBICIDES_SIMPLE/d_amine_720_sl.jpg'),
    'dualgold_960_ec_herbicide_for_control_of_annual_grass_weeds_in_maize.jpg': require('../assets/HERBICIDES_SIMPLE/dualgold_960_ec_herbicide_for_control_of_annual_grass_weeds_in_maize.jpg'),
    'excel_glycel.jpg': require('../assets/HERBICIDES_SIMPLE/excel_glycel.jpg'),
    'fennut_120_sl.jpg': require('../assets/HERBICIDES_SIMPLE/fennut_120_sl.jpg'),
    'force_top.jpg': require('../assets/HERBICIDES_SIMPLE/force_top.jpg'),
    'force_up_granular.jpg': require('../assets/HERBICIDES_SIMPLE/force_up_granular.jpg'),
    'force_up.jpg': require('../assets/HERBICIDES_SIMPLE/force_up.jpg'),
    'fusilade_forte_150_ec_post_emergence_herbicide_for_use_in_snow_peas_and_french_beans.png': require('../assets/HERBICIDES_SIMPLE/fusilade_forte_150_ec_post_emergence_herbicide_for_use_in_snow_peas_and_french_beans.png'),
    'glufosun_herbicide_for_post_emergence_weed_control_in_plantations.png': require('../assets/HERBICIDES_SIMPLE/glufosun_herbicide_for_post_emergence_weed_control_in_plantations.png'),
    'glyphocel_48.jpg': require('../assets/HERBICIDES_SIMPLE/glyphocel_48.jpg'),
    'hang_ametryn_50_sc.jpg': require('../assets/HERBICIDES_SIMPLE/hang_ametryn_50_sc.jpg'),
    'hangzhou_2_4d_amine.jpg': require('../assets/HERBICIDES_SIMPLE/hangzhou_2_4d_amine.jpg'),
    'hasunil_160_ec.jpg': require('../assets/HERBICIDES_SIMPLE/hasunil_160_ec.jpg'),
    'herbkill_720_sl.jpg': require('../assets/HERBICIDES_SIMPLE/herbkill_720_sl.jpg'),
    'huskie_256_ec_herbicide_for_the_control_of_broadleaf_weeds_in_wheat_and_barley.png': require('../assets/HERBICIDES_SIMPLE/huskie_256_ec_herbicide_for_the_control_of_broadleaf_weeds_in_wheat_and_barley.png'),
    'jembe_non_selective_herbicide_for_control_herbaceous_weeds.jpg': require('../assets/HERBICIDES_SIMPLE/jembe_non_selective_herbicide_for_control_herbaceous_weeds.jpg'),
    'lumax_537_5_se_herbicide_for_weed_control_in_sugarcane_and_maize.png': require('../assets/HERBICIDES_SIMPLE/lumax_537_5_se_herbicide_for_weed_control_in_sugarcane_and_maize.png'),
    'maguguma.jpg': require('../assets/HERBICIDES_SIMPLE/maguguma.jpg'),
    'maize_succeed_herbicide.jpg': require('../assets/HERBICIDES_SIMPLE/maize_succeed_herbicide.jpg'),
    'megazine_atrizine_500_sc.jpg': require('../assets/HERBICIDES_SIMPLE/megazine_atrizine_500_sc.jpg'),
    'metoneflagon.jpg': require('../assets/HERBICIDES_SIMPLE/metoneflagon.jpg'),
    'metrazin_pre_and_post_emergence_herbicide_for_weed_control_in_maize.jpg': require('../assets/HERBICIDES_SIMPLE/metrazin_pre_and_post_emergence_herbicide_for_weed_control_in_maize.jpg'),
    'oxyfen_24_ec.jpg': require('../assets/HERBICIDES_SIMPLE/oxyfen_24_ec.jpg'),
    'oxygold_24_ec.jpg': require('../assets/HERBICIDES_SIMPLE/oxygold_24_ec.jpg'),
    'piko_systemic_herbicide_for_control_of_broad_leaf_weeds_tree_stump_regrowth_woody_plants_and_vines.jpg': require('../assets/HERBICIDES_SIMPLE/piko_systemic_herbicide_for_control_of_broad_leaf_weeds_tree_stump_regrowth_woody_plants_and_vines.jpg'),
    'potasun_50_ec.jpg': require('../assets/HERBICIDES_SIMPLE/potasun_50_ec.jpg'),
    'primagram_gold_660_sc_a_herbicide_for_the_control_of_annual_grass_weeds_in_maize.png': require('../assets/HERBICIDES_SIMPLE/primagram_gold_660_sc_a_herbicide_for_the_control_of_annual_grass_weeds_in_maize.png'),
    'ralon_super_ew_144_herbicide_for_weed_control_in_wheat_and_barley.png': require('../assets/HERBICIDES_SIMPLE/ralon_super_ew_144_herbicide_for_weed_control_in_wheat_and_barley.png'),
    'round_up.jpg': require('../assets/HERBICIDES_SIMPLE/round_up.jpg'),
    'roundup_turbo.png': require('../assets/HERBICIDES_SIMPLE/roundup_turbo.png'),
    'servian_75_wg_selective_early_post_emergence_herbicide.png': require('../assets/HERBICIDES_SIMPLE/servian_75_wg_selective_early_post_emergence_herbicide.png'),
    'sicometryn_500_sc_pre_and_post_emergence_herbicide_for_the_control_of_most_annual_grasses_and_broad_leaved.jpg': require('../assets/HERBICIDES_SIMPLE/sicometryn_500_sc_pre_and_post_emergence_herbicide_for_the_control_of_most_annual_grasses_and_broad_leaved.jpg'),
    'stellar_star_post_emergence_herbicide_for_weed_control_in_maize.png': require('../assets/HERBICIDES_SIMPLE/stellar_star_post_emergence_herbicide_for_weed_control_in_maize.png'),
    'stomp_455_cs_pre_emergent_herbicide.png': require('../assets/HERBICIDES_SIMPLE/stomp_455_cs_pre_emergent_herbicide.png'),
    'super_weeder_glyphosate_480_sl.png': require('../assets/HERBICIDES_SIMPLE/super_weeder_glyphosate_480_sl.png'),
    'weedall.jpg': require('../assets/HERBICIDES_SIMPLE/weedall.jpg'),
    'weedmaster_75_7_xl_non_selective_herbicide_for_general_weed_control.jpg': require('../assets/HERBICIDES_SIMPLE/weedmaster_75_7_xl_non_selective_herbicide_for_general_weed_control.jpg'),
    'wound_out_480_sl.jpg': require('../assets/HERBICIDES_SIMPLE/wound_out_480_sl.jpg'),
    'zonex_10_sc_post_emergence_herbicide_for_weed_control_in_rice.png': require('../assets/HERBICIDES_SIMPLE/zonex_10_sc_post_emergence_herbicide_for_weed_control_in_rice.png'),
    'zoomer.jpg': require('../assets/HERBICIDES_SIMPLE/zoomer.jpg')
  };

  // Get image source from static mapping
  const getImageSource = (imageName) => {
    return herbicideImages[imageName] || require('../assets/herbicides.png');
  };

  // Memoized products data based on actual image names
  const herbicideProducts = useMemo(() => [
    {
      id: 1, 
      name: '2,4D Amine 720Gl - Selective Herbicide For Weed Control In Cereals Maize Sorghum Grassland and Established Turf', 
      imageName: '2_4d_amine_720gl_selective_herbicide_for_weed_control_in_cereals_maize_sorghum_grassland_and_established_tur.png', 
      category: 'Selective', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 - UGX 55,000', 
      description: 'Selective herbicide for broadleaf weed control in cereals, maize, sorghum, grassland and established turf.'
    },
    {
      id: 2, 
      name: 'Agriforce', 
      imageName: 'agriforce.jpg', 
      category: 'General', 
      manufacturer: 'Agri Solutions',
      price: 'UGX 25,000 - UGX 45,000', 
      description: 'Professional herbicide for effective weed control in various crops.'
    },
    {
      id: 3, 
      name: 'Ametryne 50 - Selective Post Emergence Herbicide For Weed Control In Pineapple Sugarcane Bananas and Plantains', 
      imageName: 'ametryne_50_selective_post_emergence_herbicide_for_weed_control_in_pineapple_sugarcane_bananas_and_plantains.png', 
      category: 'Selective', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 - UGX 55,000', 
      description: 'Selective post-emergence herbicide for weed control in pineapple, sugarcane, bananas and plantains.'
    },
    {
      id: 4, 
      name: 'Amino Force', 
      imageName: 'amino_force.jpg', 
      category: 'General', 
      manufacturer: 'Agri Solutions',
      price: 'UGX 25,000 - UGX 45,000', 
      description: 'Professional herbicide for effective weed control in various crops.'
    },
    {
      id: 5, 
      name: 'Auxo EC - Selective Herbicide For Weed Control In Maize', 
      imageName: 'auxo_ec_selective_herbicide_for_weed_control_in_maize.png', 
      category: 'Selective', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 - UGX 55,000', 
      description: 'Selective herbicide for weed control in maize.'
    },
    {
      id: 6, 
      name: 'Basagran 480 SL - Herbicide For Weed Control In Dry Beans Maize and Potato', 
      imageName: 'basagran_480_sl_herbicide_for_weed_control_in_dry_beans_maize_and_potato.png', 
      category: 'General', 
      manufacturer: 'BASF',
      price: 'UGX 50,000 - UGX 80,000', 
      description: 'Herbicide for weed control in dry beans, maize and potato.'
    },
    {
      id: 7, 
      name: 'Bastnate 200SL - Non Selective Herbicide For the Control of Annual and Perennial Broad Leafed Weeds', 
      imageName: 'bastnate_200sl_non_selective_herbicide_for_the_control_of_annual_and_perennial_broad_leafed_weeds.png', 
      category: 'Selective', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 - UGX 55,000', 
      description: 'Non-selective herbicide for the control of annual and perennial broad leafed weeds.'
    },
    {
      id: 8, 
      name: 'Beans Clean', 
      imageName: 'beans_clean.png', 
      category: 'General', 
      manufacturer: 'Agri Solutions',
      price: 'UGX 25,000 - UGX 45,000', 
      description: 'Professional herbicide for weed control in beans.'
    },
    {
      id: 9, 
      name: 'Beansclean Super', 
      imageName: 'beansclean_super.jpg', 
      category: 'General', 
      manufacturer: 'Agri Solutions',
      price: 'UGX 45,000 - UGX 65,000', 
      description: 'Professional herbicide for weed control in beans.'
    },
    {
      id: 10, 
      name: 'Buta Force', 
      imageName: 'buta_force.png', 
      category: 'General', 
      manufacturer: 'Agri Solutions',
      price: 'UGX 25,000 - UGX 45,000', 
      description: 'Professional herbicide for effective weed control in various crops.'
    },
    {
      id: 11, 
      name: 'Butanil 70 - Selective Pre and Post Emergence Herbicide Weed Control In Rice', 
      imageName: 'butanil_70_selective_pre_and_post_emergence_herbicide_weed_control_in_rice.png', 
      category: 'Selective', 
      manufacturer: 'Agri Solutions',
      price: 'UGX 35,000 - UGX 55,000', 
      description: 'Selective pre and post-emergence herbicide for weed control in rice.'
    },
    {
      id: 12, 
      name: 'Butanil S - Pre Emergence Herbicide For Weed Control In Rice Maize Groundnuts Wheat Soy Bean and Beans', 
      imageName: 'butanil_s_pre_emergence_herbicide_for_weed_control_in_rice_maize_groundnuts_wheat_soy_bean_and_beans.png', 
      category: 'Pre-Emergence', 
      manufacturer: 'Monsanto',
      price: 'UGX 35,000 - UGX 55,000', 
      description: 'Selective pre and post-emergence herbicide for weed control in rice.'
    },
    {
      id: 13, 
      name: 'Clean Force', 
      imageName: 'clean_force.jpg', 
      category: 'General', 
      manufacturer: 'Agri Solutions',
      price: 'UGX 25,000 - UGX 45,000', 
      description: 'Professional herbicide for effective weed control in various crops.'
    },
    {
      id: 14, 
      name: 'Cleanspray 720 SL - Herbicide For Weed Control In Wheat Maize Rice and Plantation Crops', 
      imageName: 'cleanspray_720_sl_herbicide_for_weed_control_in_wheat_maize_rice_and_plantation_crops.png', 
      category: 'General', 
      manufacturer: 'Agri Solutions',
      price: 'UGX 25,000 - UGX 45,000', 
      description: 'Herbicide for weed control in wheat, maize, rice and plantation crops.'
    },
    {
      id: 15, 
      name: 'D-Amine 720 SL', 
      imageName: 'd_amine_720_sl.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 16, 
      name: 'Dualgold 960 EC - Herbicide For Control of Annual Grass Weeds In Maize', 
      imageName: 'dualgold_960_ec_herbicide_for_control_of_annual_grass_weeds_in_maize.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 45,000 - UGX 65,000', 
      description: 'Herbicide for control of annual grass weeds in maize.'
    },
    {
      id: 17, 
      name: 'Excel Glycel', 
      imageName: 'excel_glycel.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 18, 
      name: 'Fennut 120 SL', 
      imageName: 'fennut_120_sl.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 19, 
      name: 'Force Top', 
      imageName: 'force_top.jpg', 
      category: 'General', 
      manufacturer: 'Agri Solutions',
      price: 'UGX 25,000 - UGX 45,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 20, 
      name: 'Force Up', 
      imageName: 'force_up.jpg', 
      category: 'General', 
      manufacturer: 'Agri Solutions',
      price: 'UGX 25,000 - UGX 45,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 21, 
      name: 'Force Up - Granular', 
      imageName: 'force_up_granular.jpg', 
      category: 'General', 
      manufacturer: 'Agri Solutions',
      price: 'UGX 25,000 - UGX 45,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 22, 
      name: 'Fusilade Forte 150 EC - Post Emergence Herbicide For Use In Snow Peas and French Beans', 
      imageName: 'fusilade_forte_150_ec_post_emergence_herbicide_for_use_in_snow_peas_and_french_beans.png', 
      category: 'Post-Emergence', 
      manufacturer: 'Syngenta',
      price: 'UGX 50,000 - UGX 80,000', 
      description: 'Post-emergence herbicide for use in snow peas and french beans.'
    },
    {
      id: 23, 
      name: 'Glufosun - Herbicide For Post Emergence Weed Control In Plantations', 
      imageName: 'glufosun_herbicide_for_post_emergence_weed_control_in_plantations.png', 
      category: 'Post-Emergence', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 - UGX 55,000', 
      description: 'Herbicide for post-emergence weed control in plantations.'
    },
    {
      id: 24, 
      name: 'Glyphocel 48%', 
      imageName: 'glyphocel_48.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 25, 
      name: 'Hang Ametryn 50 SC', 
      imageName: 'hang_ametryn_50_sc.jpg', 
      category: 'General', 
      manufacturer: 'Hangzhou',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 26, 
      name: 'Hangzhou 2,4D Amine', 
      imageName: 'hangzhou_2_4d_amine.jpg', 
      category: '2,4-D', 
      manufacturer: 'Hangzhou',
      price: 'UGX 35,000 - UGX 55,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 27, 
      name: 'Hasunil 160 EC', 
      imageName: 'hasunil_160_ec.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 28, 
      name: 'Herbkill 720 SL', 
      imageName: 'herbkill_720_sl.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 29, 
      name: 'Huskie 256 EC - Herbicide For the Control of Broadleaf Weeds In Wheat and Barley', 
      imageName: 'huskie_256_ec_herbicide_for_the_control_of_broadleaf_weeds_in_wheat_and_barley.png', 
      category: 'General', 
      manufacturer: 'Bayer',
      price: 'UGX 50,000 - UGX 80,000', 
      description: 'Herbicide for the control of broadleaf weeds in wheat and barley.'
    },
    {
      id: 30, 
      name: 'Jembe - Non Selective Herbicide For Control Herbaceous Weeds', 
      imageName: 'jembe_non_selective_herbicide_for_control_herbaceous_weeds.jpg', 
      category: 'Selective', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 - UGX 55,000', 
      description: 'Non-selective herbicide for control herbaceous weeds.'
    },
    {
      id: 31, 
      name: 'Lumax 537.5 SE - Herbicide For Weed Control In Sugarcane and Maize', 
      imageName: 'lumax_537_5_se_herbicide_for_weed_control_in_sugarcane_and_maize.png', 
      category: 'General', 
      manufacturer: 'Syngenta',
      price: 'UGX 50,000 - UGX 80,000', 
      description: 'Herbicide for weed control in sugarcane and maize.'
    },
    {
      id: 32, 
      name: 'Maguguma', 
      imageName: 'maguguma.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 33, 
      name: 'Maize Succeed - Herbicide', 
      imageName: 'maize_succeed_herbicide.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 34, 
      name: 'Megazine (Atrizine) 500 SC', 
      imageName: 'megazine_atrizine_500_sc.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 35, 
      name: 'Metoneflagon', 
      imageName: 'metoneflagon.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 36, 
      name: 'Metrazin - Pre and Post Emergence Herbicide For Weed Control In Maize', 
      imageName: 'metrazin_pre_and_post_emergence_herbicide_for_weed_control_in_maize.jpg', 
      category: 'Pre-Emergence', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 - UGX 55,000', 
      description: 'Pre and post-emergence herbicide for weed control in maize.'
    },
    {
      id: 37, 
      name: 'Oxyfen 24 EC', 
      imageName: 'oxyfen_24_ec.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 38, 
      name: 'Oxygold 24 EC', 
      imageName: 'oxygold_24_ec.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 45,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 39, 
      name: 'Piko - Systemic Herbicide For Control of Broad Leaf Weeds Tree Stump Regrowth Woody Plants and Vines', 
      imageName: 'piko_systemic_herbicide_for_control_of_broad_leaf_weeds_tree_stump_regrowth_woody_plants_and_vines.jpg', 
      category: 'Systemic', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Systemic herbicide for control of broad leaf weeds, tree stump regrowth, woody plants and vines.'
    },
    {
      id: 40, 
      name: 'Potasun 50 EC', 
      imageName: 'potasun_50_ec.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 41, 
      name: 'Primagram Gold 660 SC - A Herbicide For the Control of Annual Grass Weeds In Maize', 
      imageName: 'primagram_gold_660_sc_a_herbicide_for_the_control_of_annual_grass_weeds_in_maize.png', 
      category: 'General', 
      manufacturer: 'Syngenta',
      price: 'UGX 45,000 - UGX 65,000', 
      description: 'Herbicide for the control of annual grass weeds in maize.'
    },
    {
      id: 42, 
      name: 'Ralon Super EW 144 - Herbicide For Weed Control In Wheat and Barley', 
      imageName: 'ralon_super_ew_144_herbicide_for_weed_control_in_wheat_and_barley.png', 
      category: 'General', 
      manufacturer: 'Bayer',
      price: 'UGX 45,000 - UGX 65,000', 
      description: 'Herbicide for weed control in wheat and barley.'
    },
    {
      id: 43, 
      name: 'Round Up', 
      imageName: 'round_up.jpg', 
      category: 'General', 
      manufacturer: 'Monsanto',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 44, 
      name: 'Roundup Turbo', 
      imageName: 'roundup_turbo.png', 
      category: 'General', 
      manufacturer: 'Monsanto',
      price: 'UGX 45,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 45, 
      name: 'Servian 75 WG - Selective Early Post Emergence Herbicide', 
      imageName: 'servian_75_wg_selective_early_post_emergence_herbicide.png', 
      category: 'Selective', 
      manufacturer: 'Bayer',
      price: 'UGX 50,000 - UGX 80,000', 
      description: 'Selective early post-emergence herbicide.'
    },
    {
      id: 46, 
      name: 'Sicometryn 500 SC - Pre and Post Emergence Herbicide For the Control of Most Annual Grasses and Broad Leaved Weeds', 
      imageName: 'sicometryn_500_sc_pre_and_post_emergence_herbicide_for_the_control_of_most_annual_grasses_and_broad_leaved.jpg', 
      category: 'Pre-Emergence', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 - UGX 55,000', 
      description: 'Pre and post-emergence herbicide for the control of most annual grasses and broad leaved weeds.'
    },
    {
      id: 47, 
      name: 'Stellar Star - Post Emergence Herbicide For Weed Control In Maize', 
      imageName: 'stellar_star_post_emergence_herbicide_for_weed_control_in_maize.png', 
      category: 'Post-Emergence', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 - UGX 55,000', 
      description: 'Post-emergence herbicide for weed control in maize.'
    },
    {
      id: 48, 
      name: 'Stomp 455 CS - Pre Emergent Herbicide', 
      imageName: 'stomp_455_cs_pre_emergent_herbicide.png', 
      category: 'General', 
      manufacturer: 'BASF',
      price: 'UGX 52,370 (1L) | UGX 523,700 (10L)', 
      description: 'Pre-emergent herbicide.'
    },
    {
      id: 49, 
      name: 'Super Weeder (Glyphosate 480 SL)', 
      imageName: 'super_weeder_glyphosate_480_sl.png', 
      category: 'Glyphosate', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 45,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 50, 
      name: 'Weedall', 
      imageName: 'weedall.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 45,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 51, 
      name: 'Weedmaster 75.7 XL - Non Selective Herbicide For General Weed Control', 
      imageName: 'weedmaster_75_7_xl_non_selective_herbicide_for_general_weed_control.jpg', 
      category: 'Selective', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 - UGX 55,000', 
      description: 'Non-selective herbicide for general weed control.'
    },
    {
      id: 52, 
      name: 'Wound Out 480 SL', 
      imageName: 'wound_out_480_sl.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    },
    {
      id: 53, 
      name: 'Zonex 10 SC - Post Emergence Herbicide For Weed Control In Rice', 
      imageName: 'zonex_10_sc_post_emergence_herbicide_for_weed_control_in_rice.png', 
      category: 'Post-Emergence', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 - UGX 55,000', 
      description: 'Post-emergence herbicide for weed control in rice.'
    },
    {
      id: 54, 
      name: 'Zoomer', 
      imageName: 'zoomer.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 - UGX 65,000', 
      description: 'Professional herbicide for effective weed control.'
    }
  ], []);

  // Debug logging
  console.log('Herbicide products count:', herbicideProducts.length);
  console.log('First few herbicide products:', herbicideProducts.slice(0, 3));

  // Render item component with performance optimizations
  const renderProduct = ({ item, index }) => {
    if (!item || !item.id) {
      console.warn('Invalid item in renderProduct:', item, 'at index:', index);
      return null;
    }
    
    return (
      <TouchableOpacity 
        style={styles.productItem}
        onPress={() => setSelectedProduct({ ...item, image: getImageSource(item.imageName) })}
      >
      <LazyImage 
        source={getImageSource(item.imageName)}
        style={styles.productImage} 
        resizeMode="cover"
        placeholder={require('../assets/herbicides.png')}
      />
      <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>
      <Text style={styles.productPrice} numberOfLines={1} ellipsizeMode="tail">
        {item.price || 'Contact for pricing'}
      </Text>
      <Text style={styles.productDescription} numberOfLines={2} ellipsizeMode="tail">
        {item.description}
      </Text>
    </TouchableOpacity>
    );
  };

  // Show detail screen if product is selected
  if (selectedProduct) {
    return (
      <HerbicideDetailScreen 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <MaterialIcons name="eco" size={32} color="white" />
          <Text style={styles.headerTitle}>Herbicide Products</Text>
        </View>
        <Text style={styles.headerSubtitle}>Complete range of agricultural herbicides</Text>
      </View>

      {/* Products List with FlatList for better performance */}
      <FlatList
        data={herbicideProducts}
        renderItem={renderProduct}
        keyExtractor={(item, index) => {
          if (!item || !item.id) {
            console.warn('Invalid item in herbicide products:', item);
            return `herbicide-invalid-${index}`;
          }
          return `herbicide-${item.id}-${item.imageName || index}`;
        }}
        numColumns={2}
        contentContainerStyle={styles.productsContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
        getItemLayout={(data, index) => ({
          length: 200,
          offset: 200 * Math.floor(index / 2),
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#2c5530',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    zIndex: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  productsContainer: {
    padding: 5,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  productItem: {
    width: '48%',
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 0,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 2,
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 16,
  },
  productPrice: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 0,
  },
  productDescription: {
    fontSize: 10,
    color: '#666',
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 0,
  },
});

export default HerbicidesScreen;
