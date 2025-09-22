  const fertilizerProducts = useMemo(() => [
    {
      id: 1, 
      name: 'Agri Gold (Alt)', 
      imageName: 'agri_gold_alt.jpg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 5,000 - UGX 366,000', 
      description: 'Agri Gold is a wonder product that prevents flower shedding, promotes more flower formation and bumper yield while enhancing healthy fruit formation and vegetative growth.'
    },
    {
      id: 2, 
      name: 'Agri Gold Foliar', 
      imageName: 'agri_gold_foliar.png', 
      category: 'Foliar', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 30,000 - UGX 38,500', 
      description: 'Agri Gold is a wonder product that prevents flower shedding, promotes more flower formation and bumper yield while enhancing healthy fruit formation and vegetative growth.'
    },
    {
      id: 3, 
      name: 'Agri Gold Premium', 
      imageName: 'agri_gold_premium.jpg', 
      category: 'Premium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 - UGX 190,000', 
      description: 'Agri Gold is a wonder product that prevents flower shedding, promotes more flower formation and bumper yield while enhancing healthy fruit formation and vegetative growth.'
    },
    {
      id: 4, 
      name: 'Agricultural Lime', 
      imageName: 'agricultural_lime.jpeg', 
      category: 'Calcium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 6,400 - UGX 38,000', 
      description: 'Agricultural limestone for soil conditioning.'
    },
    {
      id: 5, 
      name: 'Agricultural Lime (Alt)', 
      imageName: 'agricultural_lime_alt.png', 
      category: 'Calcium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 6,400 - UGX 38,000', 
      description: 'Agricultural limestone for soil conditioning.'
    },
    {
      id: 6, 
      name: 'Calcium Nitrate Compound', 
      imageName: 'calcium_nitrate_compound.jpg', 
      category: 'Calcium', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 6,400 - UGX 38,000', 
      description: 'Helps with cell formation and neutralizes acids to detoxify plants.'
    },
    {
      id: 7, 
      name: 'Calcium Nitrate WS', 
      imageName: 'calcium_nitrate_ws.png', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 158,800 - UGX 366,000', 
      description: 'Helps with cell formation and neutralizes acids to detoxify plants.'
    },
    {
      id: 8, 
      name: 'Cassava Tapiocal', 
      imageName: 'cassava_tapiocal.jpg', 
      category: 'Specialized', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 5,000 - UGX 160,000', 
      description: 'Microfood foliar fertilizer for cassava.'
    },
    {
      id: 9, 
      name: 'Crop Champion', 
      imageName: 'crop_champion.png', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 5,000 - UGX 366,000', 
      description: 'Complete crop nutrition fertilizer.'
    },
    {
      id: 10, 
      name: 'DAP Phosphate', 
      imageName: 'dap_phosphate.jpg', 
      category: 'Phosphorus', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 175,000 (50kg)', 
      description: 'Diammonium phosphate for phosphorus supply.'
    },
    {
      id: 11, 
      name: 'Easygro Calcium', 
      imageName: 'easygro_calcium.jpg', 
      category: 'Calcium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 6,400 - UGX 38,000', 
      description: 'Water-soluble calcium fertilizer.'
    },
    {
      id: 12, 
      name: 'Easygro Starter', 
      imageName: 'easygro_starter.jpg', 
      category: 'Starter', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 (1kg)', 
      description: 'Starter fertilizer for young plants.'
    },
    {
      id: 13, 
      name: 'Easygro Vegetative', 
      imageName: 'easygro_vegetative.jpg', 
      category: 'Vegetative', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 20,000 (1kg)', 
      description: 'Vegetative growth fertilizer.'
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
      description: 'Boron and molybdenum fertilizer.'
    },
    {
      id: 16, 
      name: 'Green Miracle', 
      imageName: 'green_miracle.jpeg', 
      category: 'Anti-transpirant', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 31,000 (1L)', 
      description: 'Anti-transpirant for plant stress relief.'
    },
    {
      id: 17, 
      name: 'Greensea K20', 
      imageName: 'greensea_k20.jpg', 
      category: 'Potassium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 - UGX 150,000', 
      description: 'Potassium fertilizer for all crops.'
    },
    {
      id: 18, 
      name: 'Grow Cal', 
      imageName: 'grow_cal.png', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 5,000 - UGX 366,000', 
      description: 'Agricultural fertilizer for crop nutrition.'
    },
    {
      id: 19, 
      name: 'Kynoch Panda Power', 
      imageName: 'kynoch_panda_power.jpg', 
      category: 'General', 
      manufacturer: 'Kynoch',
      price: 'UGX 35,000 - UGX 190,000', 
      description: 'High-performance NPK fertilizer blend.'
    },
    {
      id: 20, 
      name: 'Kynohorti NPK 15921s', 
      imageName: 'kynohorti_npk_15921s.jpg', 
      category: 'NPK', 
      manufacturer: 'Kynoch',
      price: 'UGX 18,000 - UGX 165,000', 
      description: 'Specialized NPK blend with sulfur.'
    },
    {
      id: 21, 
      name: 'Kynoplus Expresso', 
      imageName: 'kynoplus_expresso.jpg', 
      category: 'General', 
      manufacturer: 'Kynoch',
      price: 'UGX 35,000 - UGX 190,000', 
      description: 'Quick-release NPK fertilizer.'
    },
    {
      id: 22, 
      name: 'Kynoplus S', 
      imageName: 'kynoplus_s.jpg', 
      category: 'General', 
      manufacturer: 'Kynoch',
      price: 'UGX 35,000 - UGX 190,000', 
      description: 'Sulfur-enriched NPK fertilizer.'
    },
    {
      id: 23, 
      name: 'Kynoplus Top', 
      imageName: 'kynoplus_top.jpg', 
      category: 'Topdressing', 
      manufacturer: 'Kynoch',
      price: 'UGX 35,000 - UGX 190,000', 
      description: 'Top-dressing NPK fertilizer.'
    },
    {
      id: 24, 
      name: 'Magnesium Nitrate (Alt)', 
      imageName: 'magnesium_nitrate_alt.png', 
      category: 'Magnesium', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 158,800 (25kg)', 
      description: 'Recommended for vegetative growth and during production stages.'
    },
    {
      id: 25, 
      name: 'Magnesium Nitrate Hexa', 
      imageName: 'magnesium_nitrate_hexa.jpg', 
      category: 'Magnesium', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 158,800 (25kg)', 
      description: 'Recommended for vegetative growth and during production stages.'
    },
    {
      id: 26, 
      name: 'Magnesium Nitrate WS', 
      imageName: 'magnesium_nitrate_ws.jpg', 
      category: 'Water Soluble', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 158,800 - UGX 366,000', 
      description: 'Recommended for vegetative growth and during production stages.'
    },
    {
      id: 27, 
      name: 'MEA Urea', 
      imageName: 'mea_urea.jpg', 
      category: 'Nitrogen', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 110,000 - UGX 146,000', 
      description: 'High nitrogen fertilizer for plant growth.'
    },
    {
      id: 28, 
      name: 'Microp Planting', 
      imageName: 'microp_planting.png', 
      category: 'Starter', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 (1kg)', 
      description: 'Planting and topdressing fertilizer for crops.'
    },
    {
      id: 29, 
      name: 'Microp Topdressing', 
      imageName: 'microp_topdressing.png', 
      category: 'Topdressing', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 135,000 - UGX 165,000', 
      description: 'Planting and topdressing fertilizer for crops.'
    },
    {
      id: 30, 
      name: 'MOP Potash', 
      imageName: 'mop_potash.jpg', 
      category: 'Potassium', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 35,000 - UGX 150,000', 
      description: 'Muriate of potash fertilizer.'
    },
    {
      id: 31, 
      name: 'Multi NPK', 
      imageName: 'multi_npk.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 - UGX 165,000', 
      description: 'Multi-nutrient NPK fertilizer.'
    },
    {
      id: 32, 
      name: 'Nova Map 12610', 
      imageName: 'nova_map_12610.jpg', 
      category: 'General', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 5,000 - UGX 366,000', 
      description: 'Soluble fertilizer for fertigation and early growth stages.'
    },
    {
      id: 33, 
      name: 'Nova Map 12610 (Alt)', 
      imageName: 'nova_map_12610_alt.png', 
      category: 'General', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 5,000 - UGX 366,000', 
      description: 'Soluble fertilizer for fertigation and early growth stages.'
    },
    {
      id: 34, 
      name: 'Nova Peak 05234', 
      imageName: 'nova_peak_05234.png', 
      category: 'General', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 5,000 - UGX 366,000', 
      description: 'High purity product that dissolves completely and quickly in water.'
    },
    {
      id: 35, 
      name: 'Nova Peak Monophosphate', 
      imageName: 'nova_peak_monophosphate.jpg', 
      category: 'Phosphorus', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 175,000 (50kg)', 
      description: 'High purity product that dissolves completely and quickly in water.'
    },
    {
      id: 36, 
      name: 'NPK 2555s', 
      imageName: 'npk_2555s.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 - UGX 165,000', 
      description: 'NPK fertilizer for balanced plant nutrition.'
    },
    {
      id: 37, 
      name: 'NPK Balanced 171717', 
      imageName: 'npk_balanced_171717.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 - UGX 165,000', 
      description: 'Balanced NPK fertilizer.'
    },
    {
      id: 38, 
      name: 'NPK Beans 112923', 
      imageName: 'npk_beans_112923.png', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 - UGX 165,000', 
      description: 'Fertilizer for beans and soybeans.'
    },
    {
      id: 39, 
      name: 'NPK Cassava 141028', 
      imageName: 'npk_cassava_141028.png', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 - UGX 165,000', 
      description: 'Microfood foliar fertilizer for cassava.'
    },
    {
      id: 40, 
      name: 'NPK Coffee 16231', 
      imageName: 'npk_coffee_16231.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 - UGX 165,000', 
      description: 'Specialized fertilizer for coffee cultivation.'
    },
    {
      id: 41, 
      name: 'NPK Planting 112923', 
      imageName: 'npk_planting_112923.jpg', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 - UGX 165,000', 
      description: 'Planting fertilizer blend.'
    },
    {
      id: 42, 
      name: 'NPK Sunflower 241710', 
      imageName: 'npk_sunflower_241710.png', 
      category: 'NPK', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 18,000 - UGX 165,000', 
      description: 'Fertilizer for sunflower crops.'
    },
    {
      id: 43, 
      name: 'Nutriplant Organic', 
      imageName: 'nutriplant_organic.jpg', 
      category: 'Organic', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 117,150 (1L)', 
      description: 'Organic eliciting fertilizer with amino acids and trace elements.'
    },
    {
      id: 44, 
      name: 'Nutriplant Organic (Alt)', 
      imageName: 'nutriplant_organic_alt.jpg', 
      category: 'Organic', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 117,150 (1L)', 
      description: 'Organic eliciting fertilizer with amino acids and trace elements.'
    },
    {
      id: 45, 
      name: 'Omni K Potassium', 
      imageName: 'omni_k_potassium.jpg', 
      category: 'Potassium', 
      manufacturer: 'Uganda Crop Care Limited',
      price: 'UGX 35,000 - UGX 150,000', 
      description: 'Water-soluble fertilizer for fertigation or foliar application, supplying nitrate, nitrogen and chlorine free potassium to plants.'
    },
    {
      id: 46, 
      name: 'Polyfeed 191919 +Te', 
      imageName: 'polyfeed_191919_te.jpeg', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 5,000 - UGX 366,000', 
      description: 'Balanced NPK with trace elements.'
    },
    {
      id: 47, 
      name: 'Rootex Hormone', 
      imageName: 'rootex_hormone.jpg', 
      category: 'Hormone', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 170,000 (1L)', 
      description: 'Rooting hormone fertilizer.'
    },
    {
      id: 48, 
      name: 'Rosasol Even', 
      imageName: 'rosasol_even.png', 
      category: 'General', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 5,000 - UGX 366,000', 
      description: 'Water soluble NPK with trace elements.'
    },
    {
      id: 49, 
      name: 'Super Green Liquid', 
      imageName: 'super_green_liquid.jpg', 
      category: 'Liquid', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 11,000 (1L)', 
      description: 'Liquid complete water-soluble fertilizer.'
    },
    {
      id: 50, 
      name: 'Urea Prilled', 
      imageName: 'urea_prilled.png', 
      category: 'Nitrogen', 
      manufacturer: 'Various Suppliers',
      price: 'UGX 110,000 - UGX 146,000', 
      description: 'High nitrogen fertilizer for rapid growth.'
    },
    {
      id: 51, 
      name: 'Yara Mila 2555s', 
      imageName: 'yara_mila_2555s.jpg', 
      category: 'General', 
      manufacturer: 'Yara',
      price: 'UGX 5,000 - UGX 366,000', 
      description: 'Agricultural fertilizer for crop nutrition.'
    },
    {
      id: 52, 
      name: 'Yara Mila Power Plus', 
      imageName: 'yara_mila_power_plus.jpeg', 
      category: 'General', 
      manufacturer: 'Yara',
      price: 'UGX 35,000 - UGX 190,000', 
      description: 'Premium NPK fertilizer with micronutrients.'
    },
    {
      id: 53, 
      name: 'Yara Vera Amidas', 
      imageName: 'yara_vera_amidas.jpg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 110,000 - UGX 146,000', 
      description: 'High nitrogen fertilizer (46% N) for all crops.'
    },
    {
      id: 54, 
      name: 'Yara Vera Amidas (Alt)', 
      imageName: 'yara_vera_amidas_alt.jpg', 
      category: 'Nitrogen', 
      manufacturer: 'Yara',
      price: 'UGX 110,000 - UGX 146,000', 
      description: 'High nitrogen fertilizer (46% N) for all crops.'
    },
    {
      id: 55, 
      name: 'Yarabela Can', 
      imageName: 'yarabela_can.jpeg', 
      category: 'General', 
      manufacturer: 'Yara',
      price: 'UGX 5,000 - UGX 366,000', 
      description: 'Yarabela fertilizer for nitrogen supply.'
    },
    {
      id: 56, 
      name: 'Yarabela Sulfan', 
      imageName: 'yarabela_sulfan.jpeg', 
      category: 'General', 
      manufacturer: 'Yara',
      price: 'UGX 5,000 - UGX 366,000', 
      description: 'Yarabela fertilizer for nitrogen supply.'
    },
    {
      id: 57, 
      name: 'Yaraliva Nitrabor', 
      imageName: 'yaraliva_nitrabor.jpg', 
      category: 'General', 
      manufacturer: 'Yara',
      price: 'UGX 5,000 - UGX 366,000', 
      description: 'Yaraliva Nitrabor fertilizer.'
    },
    {
      id: 58, 
      name: 'Yaramila Java', 
      imageName: 'yaramila_java.jpg', 
      category: 'General', 
      manufacturer: 'Yara',
      price: 'UGX 5,000 - UGX 366,000', 
      description: 'Yaramila Java fertilizer.'
    },
    {
      id: 59, 
      name: 'Yaramila Winner', 
      imageName: 'yaramila_winner.jpg', 
      category: 'General', 
      manufacturer: 'Yara',
      price: 'UGX 5,000 - UGX 366,000', 
      description: 'Balanced NPK fertilizer for all crops.'
    },
    {
      id: 60, 
      name: 'Yaravita Boost (Alt)', 
      imageName: 'yaravita_boost_alt.png', 
      category: 'Foliar', 
      manufacturer: 'Yara',
      price: 'UGX 30,000 - UGX 38,500', 
      description: 'Concentrated phosphorous foliar fertilizer for enhanced crop growth.'
    },
    {
      id: 61, 
      name: 'Yaravita Crop Boost', 
      imageName: 'yaravita_crop_boost.png', 
      category: 'Foliar', 
      manufacturer: 'Yara',
      price: 'UGX 30,000 - UGX 38,500', 
      description: 'Concentrated phosphorous foliar fertilizer for enhanced crop growth.'
    }
  ], []);
