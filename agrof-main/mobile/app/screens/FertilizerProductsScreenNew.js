import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FertilizerDetailScreen from './FertilizerDetailScreen';
import LazyImage from '../components/LazyImage';

const FertilizerProductsScreen = ({ onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Static image mapping for all fertilizer images
  const fertilizerImages = {
    'agri_gold_alt.jpg': require('../assets/FERTILIZERS_SIMPLE/agri_gold_alt.jpg'),
    'agri_gold_foliar.png': require('../assets/FERTILIZERS_SIMPLE/agri_gold_foliar.png'),
    'agri_gold_premium.jpg': require('../assets/FERTILIZERS_SIMPLE/agri_gold_premium.jpg'),
    'agricultural_lime.jpeg': require('../assets/FERTILIZERS_SIMPLE/agricultural_lime.jpeg'),
    'agricultural_lime_alt.png': require('../assets/FERTILIZERS_SIMPLE/agricultural_lime_alt.png'),
    'calcium_nitrate_compound.jpg': require('../assets/FERTILIZERS_SIMPLE/calcium_nitrate_compound.jpg'),
    'calcium_nitrate_ws.png': require('../assets/FERTILIZERS_SIMPLE/calcium_nitrate_ws.png'),
    'cassava_tapiocal.jpg': require('../assets/FERTILIZERS_SIMPLE/cassava_tapiocal.jpg'),
    'crop_champion.png': require('../assets/FERTILIZERS_SIMPLE/crop_champion.png'),
    'dap_phosphate.jpg': require('../assets/FERTILIZERS_SIMPLE/dap_phosphate.jpg'),
    'easygro_calcium.jpg': require('../assets/FERTILIZERS_SIMPLE/easygro_calcium.jpg'),
    'easygro_starter.jpg': require('../assets/FERTILIZERS_SIMPLE/easygro_starter.jpg'),
    'easygro_vegetative.jpg': require('../assets/FERTILIZERS_SIMPLE/easygro_vegetative.jpg'),
    'elfert_trace_elements.jpg': require('../assets/FERTILIZERS_SIMPLE/elfert_trace_elements.jpg'),
    'folcrop_boron_mo.jpg': require('../assets/FERTILIZERS_SIMPLE/folcrop_boron_mo.jpg'),
    'green_miracle.jpeg': require('../assets/FERTILIZERS_SIMPLE/green_miracle.jpeg'),
    'greensea_k20.jpg': require('../assets/FERTILIZERS_SIMPLE/greensea_k20.jpg'),
    'grow_cal.png': require('../assets/FERTILIZERS_SIMPLE/grow_cal.png'),
    'kynoch_panda_power.jpg': require('../assets/FERTILIZERS_SIMPLE/kynoch_panda_power.jpg'),
    'kynohorti_npk_15921s.jpg': require('../assets/FERTILIZERS_SIMPLE/kynohorti_npk_15921s.jpg'),
    'kynoplus_expresso.jpg': require('../assets/FERTILIZERS_SIMPLE/kynoplus_expresso.jpg'),
    'kynoplus_s.jpg': require('../assets/FERTILIZERS_SIMPLE/kynoplus_s.jpg'),
    'kynoplus_top.jpg': require('../assets/FERTILIZERS_SIMPLE/kynoplus_top.jpg'),
    'magnesium_nitrate_alt.png': require('../assets/FERTILIZERS_SIMPLE/magnesium_nitrate_alt.png'),
    'magnesium_nitrate_hexa.jpg': require('../assets/FERTILIZERS_SIMPLE/magnesium_nitrate_hexa.jpg'),
    'magnesium_nitrate_ws.jpg': require('../assets/FERTILIZERS_SIMPLE/magnesium_nitrate_ws.jpg'),
    'mea_urea.jpg': require('../assets/FERTILIZERS_SIMPLE/mea_urea.jpg'),
    'microp_planting.png': require('../assets/FERTILIZERS_SIMPLE/microp_planting.png'),
    'microp_topdressing.png': require('../assets/FERTILIZERS_SIMPLE/microp_topdressing.png'),
    'mop_potash.jpg': require('../assets/FERTILIZERS_SIMPLE/mop_potash.jpg'),
    'multi_npk.jpg': require('../assets/FERTILIZERS_SIMPLE/multi_npk.jpg'),
    'nova_map_12610.jpg': require('../assets/FERTILIZERS_SIMPLE/nova_map_12610.jpg'),
    'nova_map_12610_alt.png': require('../assets/FERTILIZERS_SIMPLE/nova_map_12610_alt.png'),
    'nova_peak_05234.png': require('../assets/FERTILIZERS_SIMPLE/nova_peak_05234.png'),
    'nova_peak_monophosphate.jpg': require('../assets/FERTILIZERS_SIMPLE/nova_peak_monophosphate.jpg'),
    'npk_2555s.jpg': require('../assets/FERTILIZERS_SIMPLE/npk_2555s.jpg'),
    'npk_balanced_171717.jpg': require('../assets/FERTILIZERS_SIMPLE/npk_balanced_171717.jpg'),
    'npk_beans_112923.png': require('../assets/FERTILIZERS_SIMPLE/npk_beans_112923.png'),
    'npk_cassava_141028.png': require('../assets/FERTILIZERS_SIMPLE/npk_cassava_141028.png'),
    'npk_coffee_16231.jpg': require('../assets/FERTILIZERS_SIMPLE/npk_coffee_16231.jpg'),
    'npk_planting_112923.jpg': require('../assets/FERTILIZERS_SIMPLE/npk_planting_112923.jpg'),
    'npk_sunflower_241710.png': require('../assets/FERTILIZERS_SIMPLE/npk_sunflower_241710.png'),
    'nutriplant_organic.jpg': require('../assets/FERTILIZERS_SIMPLE/nutriplant_organic.jpg'),
    'nutriplant_organic_alt.jpg': require('../assets/FERTILIZERS_SIMPLE/nutriplant_organic_alt.jpg'),
    'omni_k_potassium.jpg': require('../assets/FERTILIZERS_SIMPLE/omni_k_potassium.jpg'),
    'polyfeed_191919_te.jpeg': require('../assets/FERTILIZERS_SIMPLE/polyfeed_191919_te.jpeg'),
    'rootex_hormone.jpg': require('../assets/FERTILIZERS_SIMPLE/rootex_hormone.jpg'),
    'rosasol_even.png': require('../assets/FERTILIZERS_SIMPLE/rosasol_even.png'),
    'super_green_liquid.jpg': require('../assets/FERTILIZERS_SIMPLE/super_green_liquid.jpg'),
    'urea_prilled.png': require('../assets/FERTILIZERS_SIMPLE/urea_prilled.png'),
    'yara_mila_2555s.jpg': require('../assets/FERTILIZERS_SIMPLE/yara_mila_2555s.jpg'),
    'yara_mila_power_plus.jpeg': require('../assets/FERTILIZERS_SIMPLE/yara_mila_power_plus.jpeg'),
    'yara_vera_amidas.jpg': require('../assets/FERTILIZERS_SIMPLE/yara_vera_amidas.jpg'),
    'yara_vera_amidas_alt.jpg': require('../assets/FERTILIZERS_SIMPLE/yara_vera_amidas_alt.jpg'),
    'yarabela_can.jpeg': require('../assets/FERTILIZERS_SIMPLE/yarabela_can.jpeg'),
    'yarabela_sulfan.jpeg': require('../assets/FERTILIZERS_SIMPLE/yarabela_sulfan.jpeg'),
    'yaraliva_nitrabor.jpg': require('../assets/FERTILIZERS_SIMPLE/yaraliva_nitrabor.jpg'),
    'yaramila_java.jpg': require('../assets/FERTILIZERS_SIMPLE/yaramila_java.jpg'),
    'yaramila_winner.jpg': require('../assets/FERTILIZERS_SIMPLE/yaramila_winner.jpg'),
    'yaravita_boost_alt.png': require('../assets/FERTILIZERS_SIMPLE/yaravita_boost_alt.png'),
    'yaravita_crop_boost.png': require('../assets/FERTILIZERS_SIMPLE/yaravita_crop_boost.png')
  };

  // Get image source from static mapping
  const getImageSource = (imageName) => {
    return fertilizerImages[imageName] || require('../assets/fertilizers.png');
  };

  // Memoized products data based on actual image names
  const fertilizerProducts = useMemo(() => [
    {
      id: 1, 
      name: 'Agri Gold (Alt)', 
      imageName: 'agri_gold_alt.jpg', 
      category: 'Foliar', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 30,000 (1L) | UGX 15,000 (500ml)', 
      description: 'Agri Gold is a wonder product that prevents flower shedding, promotes more flower formation and bumper yield while enhancing healthy fruit formation and vegetative growth.'
    },
    {
      id: 2, 
      name: 'Agri Gold Foliar', 
      imageName: 'agri_gold_foliar.png', 
      category: 'Foliar', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 30,000 (1L) | UGX 15,000 (500ml)', 
      description: 'Premium foliar fertilizer for enhanced crop growth and yield improvement.'
    },
    {
      id: 3, 
      name: 'Agri Gold Premium', 
      imageName: 'agri_gold_premium.jpg', 
      category: 'Premium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 (1L)', 
      description: 'Premium grade fertilizer for maximum crop performance and quality.'
    },
    {
      id: 4, 
      name: 'Agricultural Lime', 
      imageName: 'agricultural_lime.jpeg', 
      category: 'Soil Amendment', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 (50kg)', 
      description: 'High-quality agricultural lime for soil conditioning and pH adjustment.'
    },
    {
      id: 5, 
      name: 'Agricultural Lime (Alt)', 
      imageName: 'agricultural_lime_alt.png', 
      category: 'Soil Amendment', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 (50kg)', 
      description: 'Agricultural limestone for soil pH correction and calcium supplementation.'
    },
    {
      id: 6, 
      name: 'Calcium Nitrate Compound', 
      imageName: 'calcium_nitrate_compound.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 170,400 (25kg)', 
      description: 'Water-soluble calcium and nitrogen fertilizer for plant nutrition.'
    },
    {
      id: 7, 
      name: 'Calcium Nitrate WS', 
      imageName: 'calcium_nitrate_ws.png', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 170,400 (25kg)', 
      description: 'Water-soluble calcium nitrate for fertigation and foliar application.',
      targetCrops: 'Greenhouse vegetables, tomatoes, peppers, lettuce, and hydroponic crops'
    },
    {
      id: 8, 
      name: 'Cassava Tapiocal', 
      imageName: 'cassava_tapiocal.jpg', 
      category: 'Specialized', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 5,000 (250g)', 
      description: 'Microfood foliar fertilizer specifically formulated for cassava cultivation.',
      targetCrops: 'Cassava, sweet potatoes, and other tuber crops requiring micronutrients'
    },
    {
      id: 9, 
      name: 'Crop Champion', 
      imageName: 'crop_champion.png', 
      category: 'Complete', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 13,000 (300g)', 
      description: 'Complete crop nutrition fertilizer for all growth stages.',
      targetCrops: 'All crops, especially vegetables, fruits, and ornamentals requiring balanced nutrition'
    },
    {
      id: 10, 
      name: 'DAP Phosphate', 
      imageName: 'dap_phosphate.jpg', 
      category: 'Phosphorus', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 175,000 (50kg)', 
      description: 'Diammonium phosphate for phosphorus supply and plant growth.',
      targetCrops: 'Maize, wheat, rice, legumes (beans, soybeans), and root crops (potatoes, carrots)'
    },
    {
      id: 11, 
      name: 'Easygro Calcium', 
      imageName: 'easygro_calcium.jpg', 
      category: 'Calcium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 (1kg) | UGX 9,600 (500g) | UGX 6,400 (250g)', 
      description: 'Water-soluble calcium fertilizer for plant growth and development.',
      targetCrops: 'Tomatoes, peppers, lettuce, apples, and calcium-deficient crops'
    },
    {
      id: 12, 
      name: 'Easygro Starter', 
      imageName: 'easygro_starter.jpg', 
      category: 'Starter', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 (1kg)', 
      description: 'Starter fertilizer for young plants and seedlings.',
      targetCrops: 'Maize, rice, vegetables, and all transplanted crops'
    },
    {
      id: 13, 
      name: 'Easygro Vegetative', 
      imageName: 'easygro_vegetative.jpg', 
      category: 'Vegetative', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 20,000 (1kg) | UGX 9,600 (500g) | UGX 6,400 (250g)', 
      description: 'Vegetative growth fertilizer for healthy plant development.'
    },
    {
      id: 14, 
      name: 'Elfert Trace Elements', 
      imageName: 'elfert_trace_elements.jpg', 
      category: 'Trace Elements', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 779,600 (25kg)', 
      description: 'Effective foliar spray to correct trace element deficiency.'
    },
    {
      id: 15, 
      name: 'Folcrop Boron Mo', 
      imageName: 'folcrop_boron_mo.jpg', 
      category: 'Micronutrients', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 (1kg)', 
      description: 'Boron and molybdenum fertilizer for plant nutrition.'
    },
    {
      id: 16, 
      name: 'Green Miracle', 
      imageName: 'green_miracle.jpeg', 
      category: 'Anti-transpirant', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 31,000 (1L)', 
      description: 'Anti-transpirant for plant stress relief and water conservation.'
    },
    {
      id: 17, 
      name: 'Greensea K20', 
      imageName: 'greensea_k20.jpg', 
      category: 'Potassium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 (1kg)', 
      description: 'Potassium fertilizer for all crops and growth stages.'
    },
    {
      id: 18, 
      name: 'Grow Cal', 
      imageName: 'grow_cal.png', 
      category: 'Calcium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 38,000 (1kg)', 
      description: 'Calcium fertilizer for plant growth and development.'
    },
    {
      id: 19, 
      name: 'Kynoch Panda Power', 
      imageName: 'kynoch_panda_power.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 160,000 (50kg)', 
      description: 'High-performance NPK fertilizer blend for maximum yield.'
    },
    {
      id: 20, 
      name: 'Kynohorti NPK 15.9.21+5S', 
      imageName: 'kynohorti_npk_15921s.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 155,000 (50kg)', 
      description: 'Specialized NPK blend with sulfur for horticultural crops.'
    },
    {
      id: 21, 
      name: 'Kynoplus Expresso', 
      imageName: 'kynoplus_expresso.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 160,000 (50kg)', 
      description: 'Quick-release NPK fertilizer for rapid plant growth.'
    },
    {
      id: 22, 
      name: 'Kynoplus S', 
      imageName: 'kynoplus_s.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 140,000 (50kg)', 
      description: 'Sulfur-enriched NPK fertilizer for balanced nutrition.'
    },
    {
      id: 23, 
      name: 'Kynoplus Top', 
      imageName: 'kynoplus_top.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 165,000 (50kg)', 
      description: 'Top-dressing NPK fertilizer for crop maintenance.'
    },
    {
      id: 24, 
      name: 'Magnesium Nitrate (Alt)', 
      imageName: 'magnesium_nitrate_alt.png', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 158,800 (25kg)', 
      description: 'Alternative magnesium nitrate formulation for plant nutrition.'
    },
    {
      id: 25, 
      name: 'Magnesium Nitrate Hexa', 
      imageName: 'magnesium_nitrate_hexa.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 158,800 (25kg)', 
      description: 'Hexahydrate magnesium nitrate for vegetative growth.'
    },
    {
      id: 26, 
      name: 'Magnesium Nitrate WS', 
      imageName: 'magnesium_nitrate_ws.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 158,800 (25kg)', 
      description: 'Water-soluble magnesium nitrate for fertigation.'
    },
    {
      id: 27, 
      name: 'MEA Urea', 
      imageName: 'mea_urea.jpg', 
      category: 'Nitrogen', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 140,000 (50kg)', 
      description: 'MEA-urea fertilizer blend for nitrogen supply.'
    },
    {
      id: 28, 
      name: 'Microp Planting', 
      imageName: 'microp_planting.png', 
      category: 'Planting', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 155,000 (50kg)', 
      description: 'Planting fertilizer for crops and seedlings.'
    },
    {
      id: 29, 
      name: 'Microp Topdressing', 
      imageName: 'microp_topdressing.png', 
      category: 'Topdressing', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 135,000 (50kg)', 
      description: 'Topdressing fertilizer for crop maintenance.'
    },
    {
      id: 30, 
      name: 'MOP Potash', 
      imageName: 'mop_potash.jpg', 
      category: 'Potassium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 150,000 (50kg)', 
      description: 'Muriate of potash fertilizer for potassium supply.'
    },
    {
      id: 31, 
      name: 'Multi NPK', 
      imageName: 'multi_npk.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 (1kg)', 
      description: 'Multi-nutrient NPK fertilizer for balanced nutrition.'
    },
    {
      id: 32, 
      name: 'Nova Map 12-61-0', 
      imageName: 'nova_map_12610.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 314,200 (25kg)', 
      description: 'Soluble fertilizer for fertigation and early growth stages.'
    },
    {
      id: 33, 
      name: 'Nova Map 12-61-0 (Alt)', 
      imageName: 'nova_map_12610_alt.png', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 314,200 (25kg)', 
      description: 'Alternative soluble fertilizer for fertigation and early growth.'
    },
    {
      id: 34, 
      name: 'Nova Peak 0-52-34', 
      imageName: 'nova_peak_05234.png', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 315,500 (25kg)', 
      description: 'Monopotassium phosphate for foliar spraying.'
    },
    {
      id: 35, 
      name: 'Nova Peak Monophosphate', 
      imageName: 'nova_peak_monophosphate.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 315,500 (25kg)', 
      description: 'High purity monopotassium phosphate that dissolves completely.'
    },
    {
      id: 36, 
      name: 'NPK 25.5.5+5S', 
      imageName: 'npk_2555s.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 160,000 (50kg)', 
      description: 'High phosphorus NPK with sulfur for plant nutrition.'
    },
    {
      id: 37, 
      name: 'NPK Balanced 17.17.17', 
      imageName: 'npk_balanced_171717.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 120,000 (50kg)', 
      description: 'Balanced NPK fertilizer for all crops.'
    },
    {
      id: 38, 
      name: 'NPK Beans 11.29.23', 
      imageName: 'npk_beans_112923.png', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 160,000 (50kg)', 
      description: 'Fertilizer specifically formulated for beans and soybeans.'
    },
    {
      id: 39, 
      name: 'NPK Cassava 14.10.28', 
      imageName: 'npk_cassava_141028.png', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 70,000 (50kg)', 
      description: 'Blended fertilizer for cassava and sweet potato cultivation.'
    },
    {
      id: 40, 
      name: 'NPK Coffee 16.2.31', 
      imageName: 'npk_coffee_16231.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 155,000 (50kg)', 
      description: 'Specialized fertilizer for coffee cultivation.'
    },
    {
      id: 41, 
      name: 'NPK Planting 11.29.23', 
      imageName: 'npk_planting_112923.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 160,000 (50kg)', 
      description: 'Planting fertilizer blend for crop establishment.'
    },
    {
      id: 42, 
      name: 'NPK Sunflower 24.17.10', 
      imageName: 'npk_sunflower_241710.png', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 78,000 (50kg)', 
      description: 'Fertilizer specifically formulated for sunflower crops.'
    },
    {
      id: 43, 
      name: 'Nutriplant Organic', 
      imageName: 'nutriplant_organic.jpg', 
      category: 'Organic', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 117,150 (1L) | UGX 15,000 (100ml)', 
      description: 'Organic eliciting fertilizer with amino acids and trace elements.'
    },
    {
      id: 44, 
      name: 'Nutriplant Organic (Alt)', 
      imageName: 'nutriplant_organic_alt.jpg', 
      category: 'Organic', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 117,150 (1L) | UGX 15,000 (100ml)', 
      description: 'Alternative organic eliciting fertilizer with amino acids.'
    },
    {
      id: 45, 
      name: 'Omni K Potassium', 
      imageName: 'omni_k_potassium.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 366,000 (25kg)', 
      description: 'Water-soluble potassium nitrate for fertigation and foliar application.'
    },
    {
      id: 46, 
      name: 'Polyfeed 19-19-19 +Te', 
      imageName: 'polyfeed_191919_te.jpeg', 
      category: 'Water Soluble', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 350,000 (25kg)', 
      description: 'Balanced NPK with trace elements for complete nutrition.'
    },
    {
      id: 47, 
      name: 'Rootex Hormone', 
      imageName: 'rootex_hormone.jpg', 
      category: 'Hormone', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 170,000 (1L)', 
      description: 'Rooting hormone fertilizer for plant propagation.'
    },
    {
      id: 48, 
      name: 'Rosasol Even', 
      imageName: 'rosasol_even.png', 
      category: 'Water Soluble', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 260,000 (25kg)', 
      description: 'Water soluble NPK with trace elements for balanced nutrition.'
    },
    {
      id: 49, 
      name: 'Super Green Liquid', 
      imageName: 'super_green_liquid.jpg', 
      category: 'Liquid', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 11,000 (1L)', 
      description: 'Liquid complete water-soluble fertilizer for all crops.'
    },
    {
      id: 50, 
      name: 'Urea Prilled', 
      imageName: 'urea_prilled.png', 
      category: 'Nitrogen', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 125,000 (50kg)', 
      description: 'High nitrogen fertilizer for rapid plant growth.'
    },
    {
      id: 51, 
      name: 'Yara Mila 25.5.5+5S', 
      imageName: 'yara_mila_2555s.jpg', 
      category: 'NPK', 
      manufacturer: 'Yara',
      price: 'UGX 160,000 (50kg)', 
      description: 'Yara Mila NPK with sulfur for balanced nutrition.'
    },
    {
      id: 52, 
      name: 'Yara Mila Power Plus', 
      imageName: 'yara_mila_power_plus.jpeg', 
      category: 'NPK', 
      manufacturer: 'Yara',
      price: 'UGX 190,000 (50kg)', 
      description: 'Premium NPK fertilizer with micronutrients for maximum yield.'
    },
    {
      id: 53, 
      name: 'Yara Vera Amidas', 
      imageName: 'yara_vera_amidas.jpg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 146,000 (50kg)', 
      description: 'High nitrogen fertilizer (46% N) for all crops.'
    },
    {
      id: 54, 
      name: 'Yara Vera Amidas (Alt)', 
      imageName: 'yara_vera_amidas_alt.jpg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 146,000 (50kg)', 
      description: 'Alternative high nitrogen fertilizer (46% N) for all crops.'
    },
    {
      id: 55, 
      name: 'Yarabela Can', 
      imageName: 'yarabela_can.jpeg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 110,000 (50kg)', 
      description: 'Yarabela Can fertilizer for nitrogen supply.'
    },
    {
      id: 56, 
      name: 'Yarabela Sulfan', 
      imageName: 'yarabela_sulfan.jpeg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 125,000 (50kg)', 
      description: 'Yarabela Sulfan fertilizer with sulfur content.'
    },
    {
      id: 57, 
      name: 'Yaraliva Nitrabor', 
      imageName: 'yaraliva_nitrabor.jpg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 100,000 (50kg)', 
      description: 'Yaraliva Nitrabor fertilizer for nitrogen and boron supply.'
    },
    {
      id: 58, 
      name: 'Yaramila Java', 
      imageName: 'yaramila_java.jpg', 
      category: 'NPK', 
      manufacturer: 'Yara',
      price: 'UGX 162,000 (50kg)', 
      description: 'Yaramila Java fertilizer for balanced nutrition.'
    },
    {
      id: 59, 
      name: 'Yaramila Winner', 
      imageName: 'yaramila_winner.jpg', 
      category: 'NPK', 
      manufacturer: 'Yara',
      price: 'UGX 165,000 (50kg)', 
      description: 'Balanced NPK fertilizer for all crops and maximum yield.'
    },
    {
      id: 60, 
      name: 'Yaravita Boost (Alt)', 
      imageName: 'yaravita_boost_alt.png', 
      category: 'Foliar', 
      manufacturer: 'Yara',
      price: 'UGX 40,000 (1L)', 
      description: 'Alternative concentrated phosphorous foliar fertilizer.'
    },
    {
      id: 61, 
      name: 'Yaravita Crop Boost', 
      imageName: 'yaravita_crop_boost.png', 
      category: 'Foliar', 
      manufacturer: 'Yara',
      price: 'UGX 40,000 (1L)', 
      description: 'Concentrated phosphorous foliar fertilizer for enhanced crop growth.'
    }
  ], []);

  // Render item component with performance optimizations
  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.productItem}
      onPress={() => setSelectedProduct({ ...item, image: getImageSource(item.imageName) })}
    >
      <LazyImage 
        source={getImageSource(item.imageName)}
        style={styles.productImage} 
        resizeMode="cover"
        placeholder={require('../assets/fertilizers.png')}
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

  // Show detail screen if product is selected
  if (selectedProduct) {
    return (
      <FertilizerDetailScreen 
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
          <Text style={styles.headerTitle}>Fertilizer Products</Text>
        </View>
        <Text style={styles.headerSubtitle}>Complete range of agricultural fertilizers</Text>
      </View>

      {/* Products List with FlatList for better performance */}
      <FlatList
        data={fertilizerProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
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

export default FertilizerProductsScreen;
