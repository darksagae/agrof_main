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
      description: 'Agri Gold is a wonder product that prevents flower shedding, promotes more flower formation and bumper yield while enhancing healthy fruit formation and vegetative growth. This foliar fertilizer contains essential nutrients and plant growth regulators that support optimal flowering and fruiting stages, ensuring maximum crop productivity and quality.'
    },
    {
      id: 2, 
      name: 'Agri Gold Foliar', 
      imageName: 'agri_gold_foliar.png', 
      category: 'Foliar', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 30,000 (1L) | UGX 15,000 (500ml)', 
      description: 'Agri Gold Foliar is a premium foliar fertilizer containing balanced NPK and essential micronutrients for enhanced crop growth and yield improvement. This wonder product prevents flower shedding, promotes more flower formation and bumper yield while enhancing healthy fruit formation and vegetative growth. Formulated for rapid plant uptake through leaves, supporting healthy vegetative growth and optimal flowering stages.'
    },
    {
      id: 3, 
      name: 'Agri Gold Premium', 
      imageName: 'agri_gold_premium.jpg', 
      category: 'Premium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 (1L)', 
      description: 'Agri Gold Premium is a premium grade fertilizer engineered for maximum crop performance and quality. This wonder product prevents flower shedding, promotes more flower formation and bumper yield while enhancing healthy fruit formation and vegetative growth. Contains advanced nutrient formulations and plant growth enhancers that promote superior yield, fruit quality, and overall plant health.'
    },
    {
      id: 4, 
      name: 'Agricultural Lime', 
      imageName: 'agricultural_lime.jpeg', 
      category: 'Soil Amendment', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 (50kg)', 
      description: 'High-quality agricultural lime for soil conditioning and pH adjustment. Contains calcium carbonate that neutralizes soil acidity, improves soil structure, and provides essential calcium for plant nutrition and root development. Essential for correcting soil pH levels and providing calcium for proper plant cell wall formation and overall plant health.'
    },
    {
      id: 5, 
      name: 'Agricultural Lime (Alt)', 
      imageName: 'agricultural_lime_alt.png', 
      category: 'Soil Amendment', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 25,000 (50kg)', 
      description: 'Agricultural limestone for soil pH correction and calcium supplementation. Provides long-lasting pH adjustment while supplying essential calcium for plant cell wall development and overall plant health. Improves soil structure and enhances nutrient availability for optimal plant growth and development.'
    },
    {
      id: 6, 
      name: 'Calcium Nitrate Compound', 
      imageName: 'calcium_nitrate_compound.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 170,400 (25kg)', 
      description: 'Water-soluble calcium and nitrogen fertilizer providing essential nutrients for plant nutrition. Calcium promotes strong cell walls and fruit quality, while nitrogen supports vigorous vegetative growth and overall plant development. Ideal for preventing calcium deficiency disorders and ensuring proper fruit development and quality.'
    },
    {
      id: 7, 
      name: 'Calcium Nitrate WS', 
      imageName: 'calcium_nitrate_ws.png', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 170,400 (25kg)', 
      description: 'Water-soluble calcium nitrate specifically designed for fertigation and foliar application. Provides readily available calcium and nitrogen in forms that are immediately absorbed by plants for optimal nutrition. Essential for preventing blossom end rot and ensuring proper fruit development in tomatoes, peppers, and other calcium-sensitive crops.',
      targetCrops: 'Greenhouse vegetables, tomatoes, peppers, lettuce, and hydroponic crops'
    },
    {
      id: 8, 
      name: 'Cassava Tapiocal', 
      imageName: 'cassava_tapiocal.jpg', 
      category: 'Specialized', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 5,000 (250g)', 
      description: 'Microfood foliar fertilizer specifically formulated for cassava cultivation. Contains essential micronutrients including Iron, Manganese, Zinc, Copper, Molybdenum, Boron, and Magnesium in forms readily available for plant uptake. These nutrients catalyze metabolic reactions and support food manufacturing processes within the plant, leading to robust produce and optimal cassava tuber development.',
      targetCrops: 'Cassava, sweet potatoes, and other tuber crops requiring micronutrients'
    },
    {
      id: 9, 
      name: 'Crop Champion', 
      imageName: 'crop_champion.png', 
      category: 'Complete', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 13,000 (300g)', 
      description: 'Complete crop nutrition fertilizer providing comprehensive nutrition for all growth stages. Contains balanced NPK plus essential micronutrients that support healthy plant development from establishment through flowering and fruiting. Formulated to enhance crop yield, improve fruit quality, and provide resistance to diseases and environmental stress.',
      targetCrops: 'All crops, especially vegetables, fruits, and ornamentals requiring balanced nutrition'
    },
    {
      id: 10, 
      name: 'DAP Phosphate', 
      imageName: 'dap_phosphate.jpg', 
      category: 'Phosphorus', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 175,000 (50kg)', 
      description: 'Diammonium phosphate (DAP) providing high phosphorus content (46% P2O5) and nitrogen (18% N) for phosphorus supply and plant growth. Essential for root development, flowering, and early plant establishment. This concentrated phosphorus source promotes strong root systems, enhances flowering and fruiting, and supports overall plant vigor and productivity.',
      targetCrops: 'Maize, wheat, rice, legumes (beans, soybeans), and root crops (potatoes, carrots)'
    },
    {
      id: 11, 
      name: 'Easygro Calcium', 
      imageName: 'easygro_calcium.jpg', 
      category: 'Calcium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 (1kg) | UGX 9,600 (500g) | UGX 6,400 (250g)', 
      description: 'High-quality water-soluble calcium fertilizer that provides essential calcium for plant cell wall development, fruit quality improvement, and prevention of calcium deficiency disorders. Contains readily available calcium that promotes strong plant structure, enhances fruit firmness, and improves shelf life of harvested produce. Essential for preventing blossom end rot and ensuring proper fruit development.',
      targetCrops: 'Tomatoes, peppers, lettuce, apples, and calcium-deficient crops'
    },
    {
      id: 12, 
      name: 'Easygro Starter', 
      imageName: 'easygro_starter.jpg', 
      category: 'Starter', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 (1kg)', 
      description: 'Easygro Starter is a water-soluble fertilizer containing chelated micro-elements and bio-stimulants, designed for foliar feeding and fertigation. It is recommended during plant growth periods requiring high phosphorus levels, such as for seedlings, transplants, and young plants. It enhances plant water-use efficiency, improves nutrient use efficiency, contributes to disease and moisture stress resistance, and accelerates plant maturity through better growth. The composition includes N.P.K 18:20:21 plus trace elements and bio-stimulants.',
      targetCrops: 'Maize, rice, vegetables, and all transplanted crops'
    },
    {
      id: 13, 
      name: 'Easygro Vegetative', 
      imageName: 'easygro_vegetative.jpg', 
      category: 'Vegetative', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 20,000 (1kg) | UGX 9,600 (500g) | UGX 6,400 (250g)', 
      description: 'Specialized vegetative growth fertilizer formulated to support healthy plant development during the active growing phase. Contains balanced nutrients that promote strong stem development, lush foliage growth, and robust root systems essential for optimal crop establishment and yield potential. Ideal for crops requiring vigorous vegetative growth before flowering.'
    },
    {
      id: 14, 
      name: 'Elfert Trace Elements', 
      imageName: 'elfert_trace_elements.jpg', 
      category: 'Trace Elements', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 779,600 (25kg)', 
      description: 'Comprehensive trace element fertilizer containing essential micronutrients including Iron, Manganese, Zinc, Copper, Molybdenum, Boron, and Magnesium in forms readily available for plant uptake. These nutrients catalyze metabolic reactions and support food manufacturing processes within the plant, leading to robust produce and optimal crop function. Essential for correcting micronutrient deficiencies and ensuring proper plant metabolism.'
    },
    {
      id: 15, 
      name: 'Folcrop Boron Mo', 
      imageName: 'folcrop_boron_mo.jpg', 
      category: 'Micronutrients', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 (1kg)', 
      description: 'Specialized micronutrient fertilizer containing Boron and Molybdenum, essential elements for proper plant development. Boron is crucial for cell wall formation, pollen germination, and fruit development, while Molybdenum is vital for nitrogen fixation in legumes and enzyme activity in plants. Essential for preventing boron and molybdenum deficiencies that can severely impact crop yield and quality.'
    },
    {
      id: 16, 
      name: 'Green Miracle', 
      imageName: 'green_miracle.jpeg', 
      category: 'Anti-transpirant', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 31,000 (1L)', 
      description: 'Advanced anti-transpirant formulation designed to reduce water loss through plant leaves during stress periods. Forms a protective film that helps plants conserve water, maintain turgor pressure, and survive drought conditions while maintaining optimal growth and productivity. Essential for crop protection during water stress and extreme weather conditions.'
    },
    {
      id: 17, 
      name: 'Greensea K20', 
      imageName: 'greensea_k20.jpg', 
      category: 'Potassium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 (1kg)', 
      description: 'High-quality potassium fertilizer containing 20% K2O, essential for plant water regulation, disease resistance, and fruit quality improvement. Potassium plays a crucial role in enzyme activation, protein synthesis, and carbohydrate transport within plants. Essential for improving fruit quality, enhancing disease resistance, and ensuring proper plant water balance and stress tolerance.'
    },
    {
      id: 18, 
      name: 'Grow Cal', 
      imageName: 'grow_cal.png', 
      category: 'Calcium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 38,000 (1kg)', 
      description: 'Premium calcium fertilizer specifically formulated to provide readily available calcium for plant nutrition. Essential for cell wall development, membrane stability, and enzyme activation. Particularly effective in preventing calcium deficiency disorders and improving fruit quality and shelf life. Essential for proper fruit development and preventing physiological disorders.'
    },
    {
      id: 19, 
      name: 'Kynoch Panda Power', 
      imageName: 'kynoch_panda_power.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 160,000 (50kg)', 
      description: 'Premium NPK fertilizer blend engineered for maximum crop yield and performance. Contains balanced proportions of Nitrogen, Phosphorus, and Potassium along with essential micronutrients. Formulated to provide sustained nutrient release and enhance crop productivity across various agricultural applications. Ideal for high-yield agriculture and precision farming.'
    },
    {
      id: 20, 
      name: 'Kynohorti NPK 15.9.21+5S', 
      imageName: 'kynohorti_npk_15921s.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 155,000 (50kg)', 
      description: 'Specialized NPK blend (15-9-21) enriched with 5% sulfur, specifically formulated for horticultural crops. The balanced nutrient ratio supports optimal plant development, while sulfur content enhances protein synthesis and improves crop quality. Essential for vegetables, fruits, flowers, and ornamental plants requiring precise nutrition and enhanced quality.'
    },
    {
      id: 21, 
      name: 'Kynoplus Expresso', 
      imageName: 'kynoplus_expresso.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 160,000 (50kg)', 
      description: 'Fast-acting NPK fertilizer designed for rapid plant establishment and growth. Features quick-release nitrogen for immediate plant uptake, balanced phosphorus for root development, and potassium for stress resistance and rapid establishment. Ideal for crops requiring rapid establishment and early season growth stimulation for maximum yield potential.'
    },
    {
      id: 22, 
      name: 'Kynoplus S', 
      imageName: 'kynoplus_s.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 140,000 (50kg)', 
      description: 'Sulfur-enriched NPK fertilizer providing balanced nutrition with essential sulfur content. Sulfur is crucial for protein synthesis, enzyme activity, and chlorophyll formation. This formulation ensures optimal plant nutrition while addressing sulfur deficiency common in many agricultural soils. Essential for cruciferous vegetables and sulfur-demanding crops.'
    },
    {
      id: 23, 
      name: 'Kynoplus Top', 
      imageName: 'kynoplus_top.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 165,000 (50kg)', 
      description: 'Specialized top-dressing NPK fertilizer formulated for crop maintenance and continued nutrition throughout the growing season. Provides sustained nutrient release to support ongoing plant development, flowering, and fruiting stages. Ideal for established crops requiring additional nutrition during critical growth periods for maximum yield and quality.'
    },
    {
      id: 24, 
      name: 'Magnesium Nitrate (Alt)', 
      imageName: 'magnesium_nitrate_alt.png', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 158,800 (25kg)', 
      description: 'High-purity magnesium nitrate formulation providing essential magnesium and nitrogen for plant nutrition. Magnesium is vital for chlorophyll production and photosynthesis, while nitrogen supports vegetative growth. This water-soluble formulation ensures rapid plant uptake and immediate nutrient availability. Essential for preventing magnesium deficiency and ensuring proper photosynthesis.'
    },
    {
      id: 25, 
      name: 'Magnesium Nitrate Hexa', 
      imageName: 'magnesium_nitrate_hexa.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 158,800 (25kg)', 
      description: 'Hexahydrate magnesium nitrate specifically formulated for vegetative growth stages. The hexahydrate form provides stable magnesium and nitrogen supply, essential for chlorophyll synthesis, protein formation, and overall plant vigor during active growth periods. Ideal for crops requiring sustained magnesium nutrition throughout the growing season.'
    },
    {
      id: 26, 
      name: 'Magnesium Nitrate WS', 
      imageName: 'magnesium_nitrate_ws.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 158,800 (25kg)', 
      description: 'Premium water-soluble magnesium nitrate designed for fertigation and hydroponic systems. Provides readily available magnesium and nitrogen in forms that are immediately absorbed by plant roots. Ideal for precision agriculture and controlled environment growing systems. Essential for preventing magnesium deficiency in hydroponic and greenhouse production systems.'
    },
    {
      id: 27, 
      name: 'MEA Urea', 
      imageName: 'mea_urea.jpg', 
      category: 'Nitrogen', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 140,000 (50kg)', 
      description: 'MEA-urea fertilizer blend providing high nitrogen content for rapid plant growth and development. Urea is the most concentrated solid nitrogen fertilizer, containing 46% nitrogen. This formulation ensures efficient nitrogen delivery for maximum crop productivity and yield enhancement. Essential for crops requiring high nitrogen levels during active growth periods.'
    },
    {
      id: 28, 
      name: 'Microp Planting', 
      imageName: 'microp_planting.png', 
      category: 'Planting', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 155,000 (50kg)', 
      description: 'Specialized planting fertilizer formulated for optimal crop establishment and early growth. Contains balanced nutrients essential for seed germination, root development, and initial plant establishment. Provides the foundation nutrition needed for healthy crop development from planting through early growth stages. Essential for ensuring strong crop establishment and early vigor.'
    },
    {
      id: 29, 
      name: 'Microp Topdressing', 
      imageName: 'microp_topdressing.png', 
      category: 'Topdressing', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 135,000 (50kg)', 
      description: 'Topdressing fertilizer designed for crop maintenance and continued nutrition throughout the growing season. Provides additional nutrients to established crops during critical growth periods, supporting flowering, fruiting, and yield development. Ideal for crops requiring supplemental nutrition during active growth phases for maximum yield potential.'
    },
    {
      id: 30, 
      name: 'MOP Potash', 
      imageName: 'mop_potash.jpg', 
      category: 'Potassium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 150,000 (50kg)', 
      description: 'Muriate of potash (MOP) fertilizer containing 60% K2O, providing essential potassium for plant nutrition. Potassium is vital for water regulation, disease resistance, fruit quality, and overall plant health. This high-analysis potassium source ensures optimal crop performance and yield quality. Essential for improving fruit quality and enhancing disease resistance.'
    },
    {
      id: 31, 
      name: 'Multi NPK', 
      imageName: 'multi_npk.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 (1kg)', 
      description: 'Multi-nutrient NPK fertilizer providing balanced nutrition for optimal plant growth and development. Contains essential macronutrients in proportions that support healthy plant development, flowering, and fruiting. Suitable for a wide range of crops requiring comprehensive nutrition throughout all growth stages. Ideal for general-purpose crop nutrition and maintenance.'
    },
    {
      id: 32, 
      name: 'Nova Map 12-61-0', 
      imageName: 'nova_map_12610.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 314,200 (25kg)', 
      description: 'High-analysis soluble fertilizer (12-61-0) specifically designed for fertigation and early growth stages. The high phosphorus content (61% P2O5) promotes strong root development and early plant establishment. Ideal for crops requiring immediate phosphorus availability during critical growth phases. Essential for rapid root development and early plant vigor.'
    },
    {
      id: 33, 
      name: 'Nova Map 12-61-0 (Alt)', 
      imageName: 'nova_map_12610_alt.png', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 314,200 (25kg)', 
      description: 'Alternative high-analysis soluble fertilizer (12-61-0) formulated for fertigation systems and early crop growth. Provides concentrated phosphorus for root development and plant establishment. The water-soluble formulation ensures rapid nutrient availability for optimal crop performance. Essential for precision agriculture and controlled environment growing systems.'
    },
    {
      id: 34, 
      name: 'Nova Peak 0-52-34', 
      imageName: 'nova_peak_05234.png', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 315,500 (25kg)', 
      description: 'High-purity monopotassium phosphate (0-52-34) specifically formulated for foliar application. Provides concentrated phosphorus and potassium in forms readily absorbed through plant leaves. Ideal for correcting nutrient deficiencies and supporting flowering and fruiting stages. Essential for precision foliar nutrition and rapid nutrient correction.'
    },
    {
      id: 35, 
      name: 'Nova Peak Monophosphate', 
      imageName: 'nova_peak_monophosphate.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 315,500 (25kg)', 
      description: 'Ultra-high purity monopotassium phosphate (0-52-34) that dissolves completely in water, leaving no residue. Provides concentrated phosphorus and potassium in forms that are immediately available to plants. Ideal for precision agriculture, hydroponics, and foliar application systems. Essential for high-purity nutrient solutions and precision feeding programs.'
    },
    {
      id: 36, 
      name: 'NPK 25.5.5+5S', 
      imageName: 'npk_2555s.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 160,000 (50kg)', 
      description: 'High phosphorus NPK fertilizer (25-5-5) enriched with 5% sulfur for comprehensive plant nutrition. The high phosphorus content promotes strong root development and early plant establishment, while sulfur enhances protein synthesis and crop quality. Ideal for crops requiring high phosphorus during establishment phases and sulfur nutrition.'
    },
    {
      id: 37, 
      name: 'NPK Balanced 17.17.17', 
      imageName: 'npk_balanced_171717.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 120,000 (50kg)', 
      description: 'Balanced NPK fertilizer (17-17-17) providing equal proportions of Nitrogen, Phosphorus, and Potassium for comprehensive plant nutrition. This balanced formulation supports all growth stages from establishment through flowering and fruiting. Ideal for general-purpose crop nutrition and maintenance throughout the growing season.'
    },
    {
      id: 38, 
      name: 'NPK Beans 11.29.23', 
      imageName: 'npk_beans_112923.png', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 160,000 (50kg)', 
      description: 'NPK 11.29.23 is a field-grade fertilizer specifically formulated for beans, soybeans, and other leguminous crops. Composed of nitrogen, phosphorus, and potassium in balanced proportions, it promotes root and shoot growth, enhances fruiting and flowering, and improves overall plant health. The high phosphorus content (29% P2O5) supports root development and nitrogen fixation, while being water-soluble for immediate plant uptake during seed and seedling stages.'
    },
    {
      id: 39, 
      name: 'NPK Cassava 14.10.28', 
      imageName: 'npk_cassava_141028.png', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 70,000 (50kg)', 
      description: 'Specialized blended fertilizer (14-10-28) formulated specifically for cassava, sweet potatoes, and other tuber crops. The high potassium content (28% K2O) promotes tuber development and starch accumulation, while balanced nitrogen and phosphorus support healthy plant growth and root formation. Essential for optimal tuber development and starch content.'
    },
    {
      id: 40, 
      name: 'NPK Coffee 16.2.31', 
      imageName: 'npk_coffee_16231.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 155,000 (50kg)', 
      description: 'Specialized NPK fertilizer (16-2-31) specifically formulated for coffee, tea, and other perennial crops. The high potassium content (31% K2O) enhances fruit quality and disease resistance, while the balanced nitrogen supports vegetative growth and the low phosphorus content is ideal for established perennial crops. Essential for optimal coffee and tea production and quality.'
    },
    {
      id: 41, 
      name: 'NPK Planting 11.29.23', 
      imageName: 'npk_planting_112923.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 160,000 (50kg)', 
      description: 'NPK 11.29.23 is a field-grade planting fertilizer composed of nitrogen, phosphorus, and potassium in balanced proportions, suitable for improved production of most crops. It is universal and can be used on all crops, from vegetables to fruit trees. It promotes root and shoot growth, enhances fruiting and flowering, and improves overall plant health, providing resistance to diseases. Being water-soluble, it can be taken up by plants almost immediately, supplying essential nutrients during the seed and seedling stages.'
    },
    {
      id: 42, 
      name: 'NPK Sunflower 24.17.10', 
      imageName: 'npk_sunflower_241710.png', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 78,000 (50kg)', 
      description: 'Specialized NPK fertilizer (24-17-10) specifically formulated for sunflowers, oilseeds, and flowering crops. The high nitrogen content (24% N) supports vigorous vegetative growth, while the balanced phosphorus and potassium promote strong flowering and seed development essential for oilseed production. Ideal for maximizing oil content and seed quality.'
    },
    {
      id: 43, 
      name: 'Nutriplant Organic', 
      imageName: 'nutriplant_organic.jpg', 
      category: 'Organic', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 117,150 (1L) | UGX 15,000 (100ml)', 
      description: 'Nutriplant Organic Plus Fertilizer (NOPF) is composed of both micro and macro nutrients, including amino acids, peptides, chitosan chelate, and their chelates with trace elements, serving as natural nutrition for plants. It is non-toxic and environmentally safe, providing plants with various nutrients, including macro (N, P, K, Ca, Mg, S) and micro (Fe, Zn, Cu, B, Mn, Mo, Na, Co, Cl) elements. It promotes growth of roots, stems, and leaves, improves quality and flavor of harvestable parts, enhances resistance to drought, infertility, diseases, and pests, aids in faster seed germination, improves soil structure, and enhances soil bioactivity.'
    },
    {
      id: 44, 
      name: 'Nutriplant Organic (Alt)', 
      imageName: 'nutriplant_organic_alt.jpg', 
      category: 'Organic', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 117,150 (1L) | UGX 15,000 (100ml)', 
      description: 'Alternative Nutriplant Organic Plus Fertilizer (NOPF) composed of both micro and macro nutrients, including amino acids, peptides, chitosan chelate, and their chelates with trace elements, serving as natural nutrition for plants. It is non-toxic and environmentally safe, providing plants with various nutrients, including macro (N, P, K, Ca, Mg, S) and micro (Fe, Zn, Cu, B, Mn, Mo, Na, Co, Cl) elements. It promotes growth of roots, stems, and leaves, improves quality and flavor of harvestable parts, enhances resistance to drought, infertility, diseases, and pests, aids in faster seed germination, improves soil structure, and enhances soil bioactivity.'
    },
    {
      id: 45, 
      name: 'Omni K Potassium', 
      imageName: 'omni_k_potassium.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 366,000 (25kg)', 
      description: 'High-purity water-soluble potassium nitrate (13-0-46) designed for fertigation and foliar application. Provides readily available potassium and nitrogen in forms that are immediately absorbed by plants. Ideal for precision agriculture, hydroponic systems, and crops requiring high-quality potassium nutrition. Essential for high-value crops and precision feeding programs.'
    },
    {
      id: 46, 
      name: 'Polyfeed 19-19-19 +Te', 
      imageName: 'polyfeed_191919_te.jpeg', 
      category: 'Water Soluble', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 350,000 (25kg)', 
      description: 'Balanced NPK fertilizer (19-19-19) enriched with essential trace elements for complete plant nutrition. Contains all major nutrients plus micronutrients like Magnesium, Boron, Iron, and Zinc. Provides comprehensive nutrition for healthy crop establishment, growth, and optimal yield across all growth stages. Ideal for complete crop nutrition and micronutrient supplementation.'
    },
    {
      id: 47, 
      name: 'Rootex Hormone', 
      imageName: 'rootex_hormone.jpg', 
      category: 'Hormone', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 170,000 (1L)', 
      description: 'Specialized rooting hormone fertilizer containing plant growth regulators that stimulate root development and enhance plant propagation success. Formulated to promote rapid root formation in cuttings, transplants, and seedlings, improving establishment rates and overall plant vigor during propagation and early growth stages. Essential for successful plant propagation and rapid establishment.'
    },
    {
      id: 48, 
      name: 'Rosasol Even', 
      imageName: 'rosasol_even.png', 
      category: 'Water Soluble', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 260,000 (25kg)', 
      description: 'Water-soluble NPK fertilizer enriched with essential trace elements for balanced plant nutrition. Provides readily available nutrients in forms that are immediately absorbed by plants through both root and foliar uptake. Ideal for precision agriculture and controlled environment growing systems. Essential for complete crop nutrition and rapid nutrient availability.'
    },
    {
      id: 49, 
      name: 'Super Green Liquid', 
      imageName: 'super_green_liquid.jpg', 
      category: 'Liquid', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 11,000 (1L)', 
      description: 'Super Green is a comprehensive water-soluble fertilizer containing both major and micro-nutrients essential for healthy plant growth. It is particularly effective during nutrient deficiency periods, offering rapid absorption and response. The formulation includes NPK (19:19:19) along with trace elements like Magnesium (Mg), Boron (B), Iron (Fe), and Zinc (Zn). For optimal results, mix 50-100g in 20 liters of water and apply to foliage every 14-21 days during the early establishment and vegetative growth stages.'
    },
    {
      id: 50, 
      name: 'Urea Prilled', 
      imageName: 'urea_prilled.png', 
      category: 'Nitrogen', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 125,000 (50kg)', 
      description: 'High nitrogen fertilizer containing 46% nitrogen in prilled form for rapid plant growth and development. Urea is the most concentrated solid nitrogen fertilizer, providing efficient nitrogen delivery for maximum crop productivity. Ideal for crops requiring high nitrogen levels during active growth periods. Essential for rapid vegetative growth and high-yield agriculture.'
    },
    {
      id: 51, 
      name: 'Yara Mila 25.5.5+5S', 
      imageName: 'yara_mila_2555s.jpg', 
      category: 'NPK', 
      manufacturer: 'Yara',
      price: 'UGX 160,000 (50kg)', 
      description: 'Yara Mila NPK fertilizer (25-5-5) enriched with 5% sulfur for balanced plant nutrition. The high nitrogen content (25% N) supports vigorous vegetative growth, while sulfur enhances protein synthesis and crop quality. Formulated for crops requiring high nitrogen during establishment and early growth phases. Essential for high-yield agriculture and precision farming.'
    },
    {
      id: 52, 
      name: 'Yara Mila Power Plus', 
      imageName: 'yara_mila_power_plus.jpeg', 
      category: 'NPK', 
      manufacturer: 'Yara',
      price: 'UGX 190,000 (50kg)', 
      description: 'Premium Yara Mila Power Plus NPK fertilizer with advanced micronutrient technology for maximum crop yield and quality. Contains balanced NPK plus essential micronutrients in forms that are readily available to plants. Engineered for high-yield agriculture and precision farming applications. Essential for maximum crop productivity and superior quality.'
    },
    {
      id: 53, 
      name: 'Yara Vera Amidas', 
      imageName: 'yara_vera_amidas.jpg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 146,000 (50kg)', 
      description: 'Yara Vera Amidas high nitrogen fertilizer containing 46% nitrogen in ammonium form for all crops. Provides efficient nitrogen delivery for maximum crop productivity and yield enhancement. The ammonium form ensures stable nitrogen supply and reduces nitrogen losses through volatilization. Essential for high-yield agriculture and efficient nitrogen management.'
    },
    {
      id: 54, 
      name: 'Yara Vera Amidas (Alt)', 
      imageName: 'yara_vera_amidas_alt.jpg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 146,000 (50kg)', 
      description: 'Alternative Yara Vera Amidas high nitrogen fertilizer containing 46% nitrogen for comprehensive crop nutrition. Provides efficient nitrogen delivery in ammonium form, ensuring stable nutrient supply and optimal plant uptake for maximum crop productivity and yield enhancement. Essential for high-yield agriculture and efficient nitrogen management.'
    },
    {
      id: 55, 
      name: 'Yarabela Can', 
      imageName: 'yarabela_can.jpeg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 110,000 (50kg)', 
      description: 'Yarabela CAN (Calcium Ammonium Nitrate) is a nitrogenous and calcareous fertilizer known for its high efficiency in quickly supplying nitrogen. It improves soil structure by granulating the soil, making it resistant to caking. When applied to fruits, vegetables, flowers, and industrial crops, it extends flowering periods, stimulates normal growth of roots, stems, and leaves, ensures vibrant fruit colors, and increases carbohydrate content in fruits. CAN is considered a high-efficiency, environmentally friendly greening fertilizer.'
    },
    {
      id: 56, 
      name: 'Yarabela Sulfan', 
      imageName: 'yarabela_sulfan.jpeg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 125,000 (50kg)', 
      description: 'Yarabela Sulfan fertilizer containing nitrogen and sulfur for comprehensive plant nutrition. The sulfur content enhances protein synthesis, enzyme activity, and chlorophyll formation. Ideal for crops requiring both nitrogen and sulfur nutrition, particularly in sulfur-deficient soils. Essential for cruciferous vegetables and sulfur-demanding crops.'
    },
    {
      id: 57, 
      name: 'Yaraliva Nitrabor', 
      imageName: 'yaraliva_nitrabor.jpg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 100,000 (50kg)', 
      description: 'Yaraliva Nitrabor fertilizer providing nitrogen and boron for specialized crop nutrition. Contains nitrogen for vegetative growth and boron for proper cell division, flowering, and fruit development. Essential for crops requiring boron nutrition, particularly legumes and cruciferous vegetables. Ideal for preventing boron deficiency and ensuring proper fruit development.'
    },
    {
      id: 58, 
      name: 'Yaramila Java', 
      imageName: 'yaramila_java.jpg', 
      category: 'NPK', 
      manufacturer: 'Yara',
      price: 'UGX 162,000 (50kg)', 
      description: 'Yaramila Java balanced NPK fertilizer providing comprehensive nutrition for optimal crop development. Contains balanced proportions of Nitrogen, Phosphorus, and Potassium plus essential micronutrients. Formulated for crops requiring consistent nutrition throughout the growing season for maximum yield and quality. Essential for high-yield agriculture and consistent crop nutrition.'
    },
    {
      id: 59, 
      name: 'Yaramila Winner', 
      imageName: 'yaramila_winner.jpg', 
      category: 'NPK', 
      manufacturer: 'Yara',
      price: 'UGX 165,000 (50kg)', 
      description: 'Yaramila Winner balanced NPK fertilizer engineered for maximum crop yield and quality. Contains optimized nutrient ratios for comprehensive plant nutrition throughout all growth stages. Formulated for high-yield agriculture and precision farming applications requiring consistent nutrition delivery. Essential for maximum crop productivity and superior quality.'
    },
    {
      id: 60, 
      name: 'Yaravita Boost (Alt)', 
      imageName: 'yaravita_boost_alt.png', 
      category: 'Foliar', 
      manufacturer: 'Yara',
      price: 'UGX 40,000 (1L)', 
      description: 'Alternative Yaravita concentrated phosphorus foliar fertilizer for enhanced crop growth and development. Provides readily available phosphorus for flowering, fruiting, and root development. Formulated for foliar application to correct phosphorus deficiencies and support critical growth stages. Essential for precision foliar nutrition and rapid phosphorus correction.'
    },
    {
      id: 61, 
      name: 'Yaravita Crop Boost', 
      imageName: 'yaravita_crop_boost.png', 
      category: 'Foliar', 
      manufacturer: 'Yara',
      price: 'UGX 40,000 (1L)', 
      description: 'Yaravita Crop Boost concentrated phosphorus foliar fertilizer designed for enhanced crop growth and development. Provides high-analysis phosphorus in forms readily absorbed through plant leaves. Essential for flowering, fruiting, and root development during critical growth stages. Ideal for precision foliar nutrition and rapid phosphorus correction.'
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
