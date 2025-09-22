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

      

      
      
      ice, wheat, vegetables, and fruit trees',
      applicationRate: 'Foliar spray: 1-2ml per liter of water. Apply every 7-10 days during active growth. For cereals: 1-2 liters per hectare. For vegetables: 500ml-1 liter per hectare.'
    },
    {
      id: 3, 
      name: 'Agri Gold Premium', 
      imageName: 'agri_gold_premium.jpg', 
      category: 'Premium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 (1L)', 
      description: 'Premium grade fertilizer for maximum crop performance and quality.',
      targetCrops: 'High-value crops like tomatoes, peppers, beans, and maize',
      applicationRate: 'Foliar spray: 2-3ml per liter of water. Apply every 10-14 days during critical growth stages. For high-value crops: 1-2 liters per hectare per application.'
    },
    {
      id: 4, 
      name: 'Agricultural Lime', 
      imageName: 'agricultural_lime.jpeg', 
      category: 'Soil Amendment', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 75,000 (50kg)', 
      description: 'High-quality agricultural lime for soil conditioning and pH adjustment.',
      targetCrops: 'All crops requiring pH correction, especially legumes, vegetables, and fruit trees',
      applicationRate: 'Broadcast application: 1-3 tons per hectare depending on soil pH. For pH correction: 2-4 tons per hectare. Apply 2-3 months before planting and incorporate into soil.'
    },
    {
      id: 5, 
      name: 'Agricultural Lime (Alt)', 
      imageName: 'agricultural_lime_alt.png', 
      category: 'Soil Amendment', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 75,000 (50kg)', 
      description: 'Agricultural limestone for soil pH correction and calcium supplementation.',
      targetCrops: 'All crops requiring pH correction, especially legumes, vegetables, and fruit trees',
      applicationRate: 'Broadcast application: 1-3 tons per hectare depending on soil pH. For pH correction: 2-4 tons per hectare. Apply 2-3 months before planting and incorporate into soil.'
    },
    {
      id: 6, 
      name: 'Calcium Nitrate Compound', 
      imageName: 'calcium_nitrate_compound.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 170,400 (25kg)', 
      description: 'Water-soluble calcium and nitrogen fertilizer for plant nutrition.',
      targetCrops: 'Greenhouse vegetables, tomatoes, peppers, lettuce, and calcium-deficient crops',
      applicationRate: 'Fertigation: 1-2kg per 1000 liters of water. Foliar spray: 0.5-1kg per 1000 liters. Apply every 7-14 days. For greenhouse crops: 2-4kg per hectare per application.'
    },
    {
      id: 7, 
      name: 'Calcium Nitrate WS', 
      imageName: 'calcium_nitrate_ws.png', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 170,400 (25kg)', 
      description: 'Water-soluble calcium nitrate for fertigation and foliar application.',
      targetCrops: 'Greenhouse vegetables, tomatoes, peppers, lettuce, and hydroponic crops',
      applicationRate: 'Fertigation: 1-2kg per 1000 liters of water. Foliar spray: 0.5-1kg per 1000 liters. Apply every 7-14 days. For hydroponics: 100-200ppm in nutrient solution.'
    },
    {
      id: 8, 
      name: 'Cassava Tapiocal', 
      imageName: 'cassava_tapiocal.jpg', 
      category: 'Specialized', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 5,500 (250g)', 
      description: 'Microfood foliar fertilizer specifically formulated for cassava cultivation.',
      targetCrops: 'Cassava, sweet potatoes, and other tuber crops requiring micronutrients',
      applicationRate: 'Foliar spray: 1-2g per liter of water. Apply every 10-15 days during vegetative growth. For cassava: 250g per hectare per application. Mix with 200-400 liters of water per hectare.'
    },
    {
      id: 9, 
      name: 'Crop Champion', 
      imageName: 'crop_champion.png', 
      category: 'Complete', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 13,000 (300g)', 
      description: 'Complete crop nutrition fertilizer for all growth stages.',
      targetCrops: 'All crops, especially vegetables, fruits, and ornamentals requiring balanced nutrition',
      applicationRate: 'Foliar spray: 1-2g per liter of water. Apply every 7-10 days during active growth. For vegetables: 300g per hectare per application. For fruits: 500g per hectare per application.'
    },
    {
      id: 10, 
      name: 'DAP Phosphate', 
      imageName: 'dap_phosphate.jpg', 
      category: 'Phosphorus', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 175,000 (50kg)', 
      description: 'Diammonium phosphate for phosphorus supply and plant growth.',
      targetCrops: 'Maize, wheat, rice, legumes (beans, soybeans), and root crops (potatoes, carrots)',
      applicationRate: 'Broadcast application: 200-400kg per hectare. Band application: 100-200kg per hectare placed 5-8cm below seed. For maize: 300-400kg per hectare. For legumes: 200-300kg per hectare.'
    },
    {
      id: 11, 
      name: 'Easygro Calcium', 
      imageName: 'easygro_calcium.jpg', 
      category: 'Calcium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 (1kg) | UGX 9,600 (500g) | UGX 6,400 (250g)', 
      description: 'Water-soluble calcium fertilizer for plant growth and development.',
      targetCrops: 'Tomatoes, peppers, lettuce, apples, and calcium-deficient crops',
      applicationRate: 'Foliar spray: 1-2g per liter of water. Apply every 10-14 days during fruit development. For tomatoes: 1-2kg per hectare per application. For apples: 2-3kg per hectare per application.'
    },
    {
      id: 12, 
      name: 'Easygro Starter', 
      imageName: 'easygro_starter.jpg', 
      category: 'Starter', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 (1kg)', 
      description: 'Starter fertilizer for young plants and seedlings.',
      targetCrops: 'Maize, rice, vegetables, and all transplanted crops',
      applicationRate: 'Foliar spray: 1-2g per liter of water. Apply every 7-10 days for first 4-6 weeks after planting. For seedlings: 1g per liter. For transplanted crops: 2g per liter.'
    },
    {
      id: 13, 
      name: 'Easygro Vegetative', 
      imageName: 'easygro_vegetative.jpg', 
      category: 'Vegetative', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 20,000 (1kg) | UGX 9,600 (500g) | UGX 6,400 (250g)', 
      description: 'Vegetative growth fertilizer for healthy plant development.',
      targetCrops: 'Maize, rice, wheat, vegetables, and leafy crops',
      applicationRate: 'Foliar spray: 1-2g per liter of water. Apply every 7-10 days during vegetative growth. For cereals: 1-2kg per hectare per application. For vegetables: 500g-1kg per hectare per application.'
    },
    {
      id: 14, 
      name: 'Elfert Trace Elements', 
      imageName: 'elfert_trace_elements.jpg', 
      category: 'Trace Elements', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 779,600 (25kg)', 
      description: 'Effective foliar spray to correct trace element deficiency.',
      targetCrops: 'All crops with micronutrient deficiencies, especially citrus, maize, and vegetables',
      applicationRate: 'Foliar spray: 1-2g per liter of water. Apply every 10-15 days until deficiency symptoms disappear. For citrus: 2-3kg per hectare per application. For maize: 1-2kg per hectare per application.'
    },
    {
      id: 15, 
      name: 'Folcrop Boron Mo', 
      imageName: 'folcrop_boron_mo.jpg', 
      category: 'Micronutrients', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 (1kg)', 
      description: 'Boron and molybdenum fertilizer for plant nutrition.',
      targetCrops: 'Legumes (beans, soybeans), cruciferous vegetables, and boron-deficient crops',
      applicationRate: 'Foliar spray: 0.5-1g per liter of water. Apply every 10-14 days during flowering and pod development. For legumes: 500g-1kg per hectare per application. For cruciferous vegetables: 1-2kg per hectare per application.'
    },
    {
      id: 16, 
      name: 'Green Miracle', 
      imageName: 'green_miracle.jpeg', 
      category: 'Anti-transpirant', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 31,000 (1L)', 
      description: 'Anti-transpirant for plant stress relief and water conservation.',
      targetCrops: 'All crops during drought stress, especially vegetables, fruits, and ornamentals',
      applicationRate: 'Foliar spray: 2-3ml per liter of water. Apply every 7-10 days during stress periods. For vegetables: 1-2 liters per hectare per application. For fruits: 2-3 liters per hectare per application.'
    },
    {
      id: 17, 
      name: 'Greensea K20', 
      imageName: 'greensea_k20.jpg', 
      category: 'Potassium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 (1kg)', 
      description: 'Potassium fertilizer for all crops and growth stages.',
      targetCrops: 'Potatoes, tomatoes, bananas, citrus fruits, and potassium-deficient crops',
      applicationRate: 'Foliar spray: 1-2g per liter of water. Apply every 10-14 days during fruit development. For potatoes: 2-3kg per hectare per application. For tomatoes: 1-2kg per hectare per application.'
    },
    {
      id: 18, 
      name: 'Grow Cal', 
      imageName: 'grow_cal.png', 
      category: 'Calcium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 38,000 (1kg)', 
      description: 'Calcium fertilizer for plant growth and development.',
      targetCrops: 'Tomatoes, peppers, apples, and calcium-deficient crops',
      applicationRate: 'Foliar spray: 1-2g per liter of water. Apply every 10-14 days during fruit development. For tomatoes: 1-2kg per hectare per application. For apples: 2-3kg per hectare per application.'
    },
    {
      id: 19, 
      name: 'Kynoch Panda Power', 
      imageName: 'kynoch_panda_power.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 160,000 (50kg)', 
      description: 'High-performance NPK fertilizer blend for maximum yield.',
      targetCrops: 'Maize, rice, wheat, and high-yield cereal crops',
      applicationRate: 'Broadcast application: 300-500kg per hectare. Band application: 200-300kg per hectare. For maize: 400-500kg per hectare. For rice: 300-400kg per hectare. Apply at planting and top-dress during growth.'
    },
    {
      id: 20, 
      name: 'Kynohorti NPK 15.9.21+5S', 
      imageName: 'kynohorti_npk_15921s.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 155,000 (50kg)', 
      description: 'Specialized NPK blend with sulfur for horticultural crops.',
      targetCrops: 'Vegetables, fruits, flowers, and horticultural crops',
      applicationRate: 'Broadcast application: 200-400kg per hectare. For vegetables: 300-400kg per hectare. For fruits: 400-500kg per hectare. For flowers: 200-300kg per hectare. Apply at planting and during growth stages.'
    },
    {
      id: 21, 
      name: 'Kynoplus Expresso', 
      imageName: 'kynoplus_expresso.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 160,000 (50kg)', 
      description: 'Quick-release NPK fertilizer for rapid plant growth.',
      targetCrops: 'Maize, rice, vegetables, and crops requiring rapid establishment',
      applicationRate: 'Broadcast application: 200-400kg per hectare. For rapid establishment: 300-400kg per hectare. For vegetables: 200-300kg per hectare. Apply at planting and early growth stages.'
    },
    {
      id: 22, 
      name: 'Kynoplus S', 
      imageName: 'kynoplus_s.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 140,000 (50kg)', 
      description: 'Sulfur-enriched NPK fertilizer for balanced nutrition.',
      targetCrops: 'Cruciferous vegetables, legumes, and sulfur-deficient crops',
      applicationRate: 'Broadcast application: 200-400kg per hectare. For cruciferous vegetables: 300-400kg per hectare. For legumes: 200-300kg per hectare. Apply at planting and during growth stages.'
    },
    {
      id: 23, 
      name: 'Kynoplus Top', 
      imageName: 'kynoplus_top.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 165,000 (50kg)', 
      description: 'Top-dressing NPK fertilizer for crop maintenance.',
      targetCrops: 'Maize, rice, wheat, and established crops requiring maintenance nutrition',
      applicationRate: 'Top-dressing application: 100-200kg per hectare. For maize: 150-200kg per hectare at 4-6 weeks after planting. For rice: 100-150kg per hectare at tillering stage. For wheat: 100-150kg per hectare at stem elongation.'
    },
    {
      id: 24, 
      name: 'Magnesium Nitrate (Alt)', 
      imageName: 'magnesium_nitrate_alt.png', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 158,800 (25kg)', 
      description: 'Alternative magnesium nitrate formulation for plant nutrition.',
      targetCrops: 'Tomatoes, peppers, potatoes, and magnesium-deficient crops',
      applicationRate: 'Fertigation: 1-2kg per 1000 liters of water. Foliar spray: 0.5-1kg per 1000 liters. Apply every 7-14 days. For tomatoes: 2-3kg per hectare per application. For potatoes: 1-2kg per hectare per application.'
    },
    {
      id: 25, 
      name: 'Magnesium Nitrate Hexa', 
      imageName: 'magnesium_nitrate_hexa.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 158,800 (25kg)', 
      description: 'Hexahydrate magnesium nitrate for vegetative growth.',
      targetCrops: 'Tomatoes, peppers, potatoes, and magnesium-deficient crops',
      applicationRate: 'Fertigation: 1-2kg per 1000 liters of water. Foliar spray: 0.5-1kg per 1000 liters. Apply every 7-14 days during vegetative growth. For tomatoes: 2-3kg per hectare per application.'
    },
    {
      id: 26, 
      name: 'Magnesium Nitrate WS', 
      imageName: 'magnesium_nitrate_ws.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 158,800 (25kg)', 
      description: 'Water-soluble magnesium nitrate for fertigation.',
      targetCrops: 'Greenhouse vegetables, tomatoes, peppers, and hydroponic crops',
      applicationRate: 'Fertigation: 1-2kg per 1000 liters of water. For hydroponics: 50-100ppm in nutrient solution. Apply every 7-14 days. For greenhouse vegetables: 2-3kg per hectare per application.'
    },
    {
      id: 27, 
      name: 'MEA Urea', 
      imageName: 'mea_urea.jpg', 
      category: 'Nitrogen', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 140,000 (50kg)', 
      description: 'MEA-urea fertilizer blend for nitrogen supply.',
      targetCrops: 'Maize, rice, wheat, and all nitrogen-demanding crops',
      applicationRate: 'Broadcast application: 200-400kg per hectare. For maize: 300-400kg per hectare. For rice: 200-300kg per hectare. For wheat: 200-300kg per hectare. Apply at planting and top-dress during growth.'
    },
    {
      id: 28, 
      name: 'Microp Planting', 
      imageName: 'microp_planting.png', 
      category: 'Planting', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 155,000 (50kg)', 
      description: 'Planting fertilizer for crops and seedlings.',
      targetCrops: 'Maize, rice, vegetables, and all transplanted crops',
      applicationRate: 'Broadcast application: 200-400kg per hectare. For planting: 300-400kg per hectare. For seedlings: 200-300kg per hectare. Apply at planting and incorporate into soil.'
    },
    {
      id: 29, 
      name: 'Microp Topdressing', 
      imageName: 'microp_topdressing.png', 
      category: 'Topdressing', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 135,000 (50kg)', 
      description: 'Topdressing fertilizer for crop maintenance.',
      targetCrops: 'Maize, rice, wheat, and established crops requiring maintenance nutrition',
      applicationRate: 'Top-dressing application: 100-200kg per hectare. For maize: 150-200kg per hectare at 4-6 weeks. For rice: 100-150kg per hectare at tillering. For wheat: 100-150kg per hectare at stem elongation.'
    },
    {
      id: 30, 
      name: 'MOP Potash', 
      imageName: 'mop_potash.jpg', 
      category: 'Potassium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 150,000 (50kg)', 
      description: 'Muriate of potash fertilizer for potassium supply.',
      targetCrops: 'Potatoes, tomatoes, bananas, citrus fruits, and potassium-deficient crops',
      applicationRate: 'Broadcast application: 100-200kg per hectare. For potatoes: 150-200kg per hectare. For tomatoes: 100-150kg per hectare. For bananas: 200-300kg per hectare. Apply at planting and during fruit development.'
    },
    {
      id: 31, 
      name: 'Multi NPK', 
      imageName: 'multi_npk.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 (1kg)', 
      description: 'Multi-nutrient NPK fertilizer for balanced nutrition.',
      targetCrops: 'All crops requiring balanced nutrition, especially vegetables and ornamentals'
    },
    {
      id: 32, 
      name: 'Nova Map 12-61-0', 
      imageName: 'nova_map_12610.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 314,200 (25kg)', 
      description: 'Soluble fertilizer for fertigation and early growth stages.',
      targetCrops: 'Maize, rice, vegetables, and crops requiring early phosphorus'
    },
    {
      id: 33, 
      name: 'Nova Map 12-61-0 (Alt)', 
      imageName: 'nova_map_12610_alt.png', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 314,200 (25kg)', 
      description: 'Alternative soluble fertilizer for fertigation and early growth.',
      targetCrops: 'Maize, rice, vegetables, and crops requiring early phosphorus'
    },
    {
      id: 34, 
      name: 'Nova Peak 0-52-34', 
      imageName: 'nova_peak_05234.png', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 315,500 (25kg)', 
      description: 'Monopotassium phosphate for foliar spraying.',
      targetCrops: 'Tomatoes, peppers, potatoes, and crops requiring phosphorus and potassium',
      applicationRate: 'Foliar spray: 1-2g per liter of water. Apply every 10-14 days during flowering and fruiting. For tomatoes: 1-2kg per hectare per application. For potatoes: 2-3kg per hectare per application.'
    },
    {
      id: 35, 
      name: 'Nova Peak Monophosphate', 
      imageName: 'nova_peak_monophosphate.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 315,500 (25kg)', 
      description: 'High purity monopotassium phosphate that dissolves completely.',
      targetCrops: 'Tomatoes, peppers, potatoes, and crops requiring phosphorus and potassium',
      applicationRate: 'Foliar spray: 1-2g per liter of water. Apply every 10-14 days during flowering and fruiting. For tomatoes: 1-2kg per hectare per application. For potatoes: 2-3kg per hectare per application.'
    },
    {
      id: 36, 
      name: 'NPK 25.5.5+5S', 
      imageName: 'npk_2555s.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 160,000 (50kg)', 
      description: 'High phosphorus NPK with sulfur for plant nutrition.',
      targetCrops: 'Maize, rice, vegetables, and crops requiring high phosphorus.'
    },
    {
      id: 37, 
      name: 'NPK Balanced 17.17.17', 
      imageName: 'npk_balanced_171717.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 120,000 (50kg)', 
      description: 'Balanced NPK fertilizer for all crops.',
      targetCrops: 'All crops, especially vegetables, fruits, and ornamentals.'
    },
    {
      id: 38, 
      name: 'NPK Beans 11.29.23', 
      imageName: 'npk_beans_112923.png', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 160,000 (50kg)', 
      description: 'Fertilizer specifically formulated for beans and soybeans.',
      targetCrops: 'Beans, soybeans, peas, and other legumes.'
    },
    {
      id: 39, 
      name: 'NPK Cassava 14.10.28', 
      imageName: 'npk_cassava_141028.png', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 70,000 (50kg)', 
      description: 'Blended fertilizer for cassava and sweet potato cultivation.',
      targetCrops: 'Cassava, sweet potatoes, and other tuber crops.'
    },
    {
      id: 40, 
      name: 'NPK Coffee 16.2.31', 
      imageName: 'npk_coffee_16231.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 155,000 (50kg)', 
      description: 'Specialized fertilizer for coffee cultivation.',
      targetCrops: 'Coffee, tea, and other perennial crops.'
    },
    {
      id: 41, 
      name: 'NPK Planting 11.29.23', 
      imageName: 'npk_planting_112923.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 160,000 (50kg)', 
      description: 'Planting fertilizer blend for crop establishment.',
      targetCrops: 'Maize, rice, vegetables, and all transplanted crops.'
    },
    {
      id: 42, 
      name: 'NPK Sunflower 24.17.10', 
      imageName: 'npk_sunflower_241710.png', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 78,000 (50kg)', 
      description: 'Fertilizer specifically formulated for sunflower crops.',
      targetCrops: 'Sunflowers, oilseeds, and flowering crops.'
    },
    {
      id: 43, 
      name: 'Nutriplant Organic', 
      imageName: 'nutriplant_organic.jpg', 
      category: 'Organic', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 117,150 (1L) | UGX 15,000 (100ml)', 
      description: 'Organic eliciting fertilizer with amino acids and trace elements.',
      targetCrops: 'All crops, especially organic vegetables, fruits, and ornamentals.'
    },
    {
      id: 44, 
      name: 'Nutriplant Organic (Alt)', 
      imageName: 'nutriplant_organic_alt.jpg', 
      category: 'Organic', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 117,150 (1L) | UGX 15,000 (100ml)', 
      description: 'Alternative organic eliciting fertilizer with amino acids.',
      targetCrops: 'All crops, especially organic vegetables, fruits, and ornamentals.'
    },
    {
      id: 45, 
      name: 'Omni K Potassium', 
      imageName: 'omni_k_potassium.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 366,000 (25kg)', 
      description: 'Water-soluble potassium nitrate for fertigation and foliar application.',
      targetCrops: 'Tomatoes, peppers, potatoes, and potassium-deficient crops.'
    },
    {
      id: 46, 
      name: 'Polyfeed 19-19-19 +Te', 
      imageName: 'polyfeed_191919_te.jpeg', 
      category: 'Water Soluble', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 350,000 (25kg)', 
      description: 'Balanced NPK with trace elements for complete nutrition.',
      targetCrops: 'All crops, especially vegetables, fruits, and ornamentals.'
    },
    {
      id: 47, 
      name: 'Rootex Hormone', 
      imageName: 'rootex_hormone.jpg', 
      category: 'Hormone', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 170,000 (1L)', 
      description: 'Rooting hormone fertilizer for plant propagation.',
      targetCrops: 'All crops requiring root development, especially cuttings and transplants.'
    },
    {
      id: 48, 
      name: 'Rosasol Even', 
      imageName: 'rosasol_even.png', 
      category: 'Water Soluble', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 260,000 (25kg)', 
      description: 'Water soluble NPK with trace elements for balanced nutrition.',
      targetCrops: 'All crops, especially vegetables, fruits, and ornamentals.'
    },
    {
      id: 49, 
      name: 'Super Green Liquid', 
      imageName: 'super_green_liquid.jpg', 
      category: 'Liquid', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 11,000 (1L)', 
      description: 'Liquid complete water-soluble fertilizer for all crops.',
      targetCrops: 'All crops, especially vegetables, fruits, and ornamentals.'
    },
    {
      id: 50, 
      name: 'Urea Prilled', 
      imageName: 'urea_prilled.png', 
      category: 'Nitrogen', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 140,000 (50kg)', 
      description: 'High nitrogen fertilizer for rapid plant growth.',
      targetCrops: 'Maize, rice, wheat, and all nitrogen-demanding crops.'
    },
    {
      id: 51, 
      name: 'Yara Mila 25.5.5+5S', 
      imageName: 'yara_mila_2555s.jpg', 
      category: 'NPK', 
      manufacturer: 'Yara',
      price: 'UGX 160,000 (50kg)', 
      description: 'Yara Mila NPK with sulfur for balanced nutrition.',
      targetCrops: 'Maize, rice, wheat, and crops requiring balanced nutrition.'
    },
    {
      id: 52, 
      name: 'Yara Mila Power Plus', 
      imageName: 'yara_mila_power_plus.jpeg', 
      category: 'NPK', 
      manufacturer: 'Yara',
      price: 'UGX 190,000 (50kg)', 
      description: 'Premium NPK fertilizer with micronutrients for maximum yield.',
      targetCrops: 'Maize, rice, wheat, and high-yield cereal crops.'
    },
    {
      id: 53, 
      name: 'Yara Vera Amidas', 
      imageName: 'yara_vera_amidas.jpg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 146,000 (50kg)', 
      description: 'High nitrogen fertilizer (46% N) for all crops.',
      targetCrops: 'Maize, rice, wheat, and all nitrogen-demanding crops.'
    },
    {
      id: 54, 
      name: 'Yara Vera Amidas (Alt)', 
      imageName: 'yara_vera_amidas_alt.jpg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 146,000 (50kg)', 
      description: 'Alternative high nitrogen fertilizer (46% N) for all crops.',
      targetCrops: 'Maize, rice, wheat, and all nitrogen-demanding crops.'
    },
    {
      id: 55, 
      name: 'Yarabela Can', 
      imageName: 'yarabela_can.jpeg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 110,000 (50kg)', 
      description: 'Yarabela Can fertilizer for nitrogen supply.',
      targetCrops: 'Potatoes, sugar beets, vegetables, and crops requiring balanced nitrogen.'
    },
    {
      id: 56, 
      name: 'Yarabela Sulfan', 
      imageName: 'yarabela_sulfan.jpeg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 125,000 (50kg)', 
      description: 'Yarabela Sulfan fertilizer with sulfur content.',
      targetCrops: 'Cruciferous vegetables, legumes, and sulfur-deficient crops.'
    },
    {
      id: 57, 
      name: 'Yaraliva Nitrabor', 
      imageName: 'yaraliva_nitrabor.jpg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 100,000 (50kg)', 
      description: 'Yaraliva Nitrabor fertilizer for nitrogen and boron supply.',
      targetCrops: 'Legumes, cruciferous vegetables, and boron-deficient crops.'
    },
    {
      id: 58, 
      name: 'Yaramila Java', 
      imageName: 'yaramila_java.jpg', 
      category: 'NPK', 
      manufacturer: 'Yara',
      price: 'UGX 162,000 (50kg)', 
      description: 'Yaramila Java fertilizer for balanced nutrition.',
      targetCrops: 'All crops, especially vegetables, fruits, and ornamentals.'
    },
    {
      id: 59, 
      name: 'Yaramila Winner', 
      imageName: 'yaramila_winner.jpg', 
      category: 'NPK', 
      manufacturer: 'Yara',
      price: 'UGX 165,000 (50kg)', 
      description: 'Balanced NPK fertilizer for all crops and maximum yield.',
      targetCrops: 'All crops, especially vegetables, fruits, and ornamentals.'
    },
    {
      id: 60, 
      name: 'Yaravita Boost (Alt)', 
      imageName: 'yaravita_boost_alt.png', 
      category: 'Foliar', 
      manufacturer: 'Yara',
      price: 'UGX 40,000 (1L)', 
      description: 'Alternative concentrated phosphorous foliar fertilizer.',
      targetCrops: 'All crops requiring phosphorus, especially during flowering and fruiting.'
    },
    {
      id: 61, 
      name: 'Yaravita Crop Boost', 
      imageName: 'yaravita_crop_boost.png', 
      category: 'Foliar', 
      manufacturer: 'Yara',
      price: 'UGX 40,000 (1L)', 
      description: 'Concentrated phosphorous foliar fertilizer for enhanced crop growth.',
      targetCrops: 'All crops requiring phosphorus, especially during flowering and fruiting.'
    },
    {
      id: 62, 
      name: 'CAN (Calcium Ammonium Nitrate)', 
      imageName: 'yarabela_can.jpeg', 
      category: 'Nitrogen', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 105,000 (50kg)', 
      description: 'Calcium ammonium nitrate fertilizer for nitrogen and calcium supply.',
      targetCrops: 'Potatoes, sugar beets, vegetables, and crops requiring balanced nitrogen.'
    },
    {
      id: 63, 
      name: 'Micro Food - All Crops Foliar Fertilizer', 
      imageName: 'cassava_tapiocal.jpg', 
      category: 'Micronutrients', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 5,500 (250g)', 
      description: 'Essential micro-nutrients for proper crop function and growth.',
      targetCrops: 'All crops with micronutrient deficiencies, especially citrus, maize, and vegetables.'
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
