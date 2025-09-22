import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SeedsDetailScreen from './SeedsDetailScreen';
import LazyImage from '../components/LazyImage';

const SeedsProductsScreen = ({ onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Static image mapping for all seed images
  const seedImages = {
    'anita_watermelon.jpg': require('../assets/SEEDS_SIMPLE/anita_watermelon.jpg'),
    'arjani_f1_eggplants.jpeg': require('../assets/SEEDS_SIMPLE/arjani_f1_eggplants.jpeg'),
    'arjuna_f1_pumpkin.jpg': require('../assets/SEEDS_SIMPLE/arjuna_f1_pumpkin.jpg'),
    'ashley_open_pollinated_cucumber_varirty_with_prolific_productivity.jpg': require('../assets/SEEDS_SIMPLE/ashley_open_pollinated_cucumber_varirty_with_prolific_productivity.jpg'),
    'bitter_gourd_palee_f1.jpg': require('../assets/SEEDS_SIMPLE/bitter_gourd_palee_f1.jpg'),
    'black_beauty_eggplants.jpeg': require('../assets/SEEDS_SIMPLE/black_beauty_eggplants.jpeg'),
    'cal_j_tomato_compact_and_determinate_variety_suitable_for_processing_and_fresh_market.jpg': require('../assets/SEEDS_SIMPLE/cal_j_tomato_compact_and_determinate_variety_suitable_for_processing_and_fresh_market.jpg'),
    'california_wonder_bamba_pepper.png': require('../assets/SEEDS_SIMPLE/california_wonder_bamba_pepper.png'),
    'california_wonder_sweet_pepper_variety_suitable_for_home_and_market_gardens.jpg': require('../assets/SEEDS_SIMPLE/california_wonder_sweet_pepper_variety_suitable_for_home_and_market_gardens.jpg'),
    'california_wonder.jpg': require('../assets/SEEDS_SIMPLE/california_wonder.jpg'),
    'cayenne_long_slim_hot_pepper_with_early_maturity_and_high_yield_potential.jpg': require('../assets/SEEDS_SIMPLE/cayenne_long_slim_hot_pepper_with_early_maturity_and_high_yield_potential.jpg'),
    'coatmeal_coriander.jpg': require('../assets/SEEDS_SIMPLE/coatmeal_coriander.jpg'),
    'copenhagen_market_cabbage_the_most_popular_early_maturing_ball_headed_variety.jpg': require('../assets/SEEDS_SIMPLE/copenhagen_market_cabbage_the_most_popular_early_maturing_ball_headed_variety.jpg'),
    'copenhagen.jpg': require('../assets/SEEDS_SIMPLE/copenhagen.jpg'),
    'corriander_dhania.jpg': require('../assets/SEEDS_SIMPLE/corriander_dhania.jpg'),
    'demon_f1_hotpaper.jpeg': require('../assets/SEEDS_SIMPLE/demon_f1_hotpaper.jpeg'),
    'dodo_elma.jpg': require('../assets/SEEDS_SIMPLE/dodo_elma.jpg'),
    'drumhead_cabbage.jpg': require('../assets/SEEDS_SIMPLE/drumhead_cabbage.jpg'),
    'e107_simsim.png': require('../assets/SEEDS_SIMPLE/e107_simsim.png'),
    'efia_hot_paper.jpeg': require('../assets/SEEDS_SIMPLE/efia_hot_paper.jpeg'),
    'fanaka_f1_cabbage_hybrid_with_excellent_heat_tolerance_and_high_adaptability.jpg': require('../assets/SEEDS_SIMPLE/fanaka_f1_cabbage_hybrid_with_excellent_heat_tolerance_and_high_adaptability.jpg'),
    'femi_f1_hybrid_eggplant_variety.png': require('../assets/SEEDS_SIMPLE/femi_f1_hybrid_eggplant_variety.png'),
    'frey_pepper_hybrid_f1.jpg': require('../assets/SEEDS_SIMPLE/frey_pepper_hybrid_f1.jpg'),
    'galia_f1_sweet_melon_with_firm_fruits_aromatic_flavour.jpg': require('../assets/SEEDS_SIMPLE/galia_f1_sweet_melon_with_firm_fruits_aromatic_flavour.jpg'),
    'georgia_sukuma_wiki_vigorous_and_hardy_collard_variety.jpg': require('../assets/SEEDS_SIMPLE/georgia_sukuma_wiki_vigorous_and_hardy_collard_variety.jpg'),
    'giant_drum_head_cabbage_variety_that_is_high_yielding_and_market_fit.jpg': require('../assets/SEEDS_SIMPLE/giant_drum_head_cabbage_variety_that_is_high_yielding_and_market_fit.jpg'),
    'grace_barley_seed.png': require('../assets/SEEDS_SIMPLE/grace_barley_seed.png'),
    'great_lakes_mesa_659_lettuce_variety_with_tip_burn_resistance_medium_large_solid_heads.jpg': require('../assets/SEEDS_SIMPLE/great_lakes_mesa_659_lettuce_variety_with_tip_burn_resistance_medium_large_solid_heads.jpg'),
    'green_aroma_coriander_dhania_variety_with_vigorous_and_fast_growing_plants.jpg': require('../assets/SEEDS_SIMPLE/green_aroma_coriander_dhania_variety_with_vigorous_and_fast_growing_plants.jpg'),
    'green_bunching_onion_non_bulbing_alliums_that_produce_yummy_green_stems.jpg': require('../assets/SEEDS_SIMPLE/green_bunching_onion_non_bulbing_alliums_that_produce_yummy_green_stems.jpg'),
    'green_coronet_f1_cabbage_medium_large_semi_upright_hybrid.jpg': require('../assets/SEEDS_SIMPLE/green_coronet_f1_cabbage_medium_large_semi_upright_hybrid.jpg'),
    'green_gold_f1_pepper_high_yielding_variety_with_excellent_fruit_set.jpg': require('../assets/SEEDS_SIMPLE/green_gold_f1_pepper_high_yielding_variety_with_excellent_fruit_set.jpg'),
    'green_sprouting_calabrese_broccoli_with_medium_sized_dark_green_heads.jpg': require('../assets/SEEDS_SIMPLE/green_sprouting_calabrese_broccoli_with_medium_sized_dark_green_heads.jpg'),
    'habanero_red_bonnet_pepper.png': require('../assets/SEEDS_SIMPLE/habanero_red_bonnet_pepper.png'),
    'habanero_yellow_bonnet_pepper.png': require('../assets/SEEDS_SIMPLE/habanero_yellow_bonnet_pepper.png'),
    'indica_f1_cabbage.jpg': require('../assets/SEEDS_SIMPLE/indica_f1_cabbage.jpg'),
    'julie_f1.jpg': require('../assets/SEEDS_SIMPLE/julie_f1.jpg'),
    'katana_f1_pumpkin.jpg': require('../assets/SEEDS_SIMPLE/katana_f1_pumpkin.jpg'),
    'kaveri_f1_sweet_pepper.jpg': require('../assets/SEEDS_SIMPLE/kaveri_f1_sweet_pepper.jpg'),
    'kifaru_f1_red_cabbage.jpg': require('../assets/SEEDS_SIMPLE/kifaru_f1_red_cabbage.jpg'),
    'kilele_f1hybrid.jpg': require('../assets/SEEDS_SIMPLE/kilele_f1hybrid.jpg'),
    'long_purple_eggplant_variety_with_a_high_yield_potential.jpg': require('../assets/SEEDS_SIMPLE/long_purple_eggplant_variety_with_a_high_yield_potential.jpg'),
    'mak_soy_3n_brac_seed.png': require('../assets/SEEDS_SIMPLE/mak_soy_3n_brac_seed.png'),
    'mammoth_red_rock_red_cabbage_producing_large_beautiful_deep_red_purple_heads.jpg': require('../assets/SEEDS_SIMPLE/mammoth_red_rock_red_cabbage_producing_large_beautiful_deep_red_purple_heads.jpg'),
    'maradona_f1_hybrid_papayapawpaw.png': require('../assets/SEEDS_SIMPLE/maradona_f1_hybrid_papayapawpaw.png'),
    'maxim_f1_tomato.jpg': require('../assets/SEEDS_SIMPLE/maxim_f1_tomato.jpg'),
    'merdan_f1_african_eggplants.jpeg': require('../assets/SEEDS_SIMPLE/merdan_f1_african_eggplants.jpeg'),
    'nakati_highly_nutritious_local_vegetable.jpg': require('../assets/SEEDS_SIMPLE/nakati_highly_nutritious_local_vegetable.jpg'),
    'namuche_3.jpg': require('../assets/SEEDS_SIMPLE/namuche_3.jpg'),
    'nouvelle_f1_tomatoes.jpg': require('../assets/SEEDS_SIMPLE/nouvelle_f1_tomatoes.jpg'),
    'poornima_008_f1_cauliflower.jpg': require('../assets/SEEDS_SIMPLE/poornima_008_f1_cauliflower.jpg'),
    'pusa_sawani_okra_variety_with_wide_adaptability.jpg': require('../assets/SEEDS_SIMPLE/pusa_sawani_okra_variety_with_wide_adaptability.jpg'),
    'pusa_sawani.jpg': require('../assets/SEEDS_SIMPLE/pusa_sawani.jpg'),
    'rambo_f1_tomato_seed.jpg': require('../assets/SEEDS_SIMPLE/rambo_f1_tomato_seed.jpg'),
    'red_beauty.jpeg': require('../assets/SEEDS_SIMPLE/red_beauty.jpeg'),
    'red_bugga_amaranthus.jpg': require('../assets/SEEDS_SIMPLE/red_bugga_amaranthus.jpg'),
    'roma_vfn_high_yielding_determinate_oval_shape_tomato.jpg': require('../assets/SEEDS_SIMPLE/roma_vfn_high_yielding_determinate_oval_shape_tomato.jpg'),
    'sc_duma_43_maize_seed_agro_supply.jpeg': require('../assets/SEEDS_SIMPLE/sc_duma_43_maize_seed_agro_supply.jpeg'),
    'sugar_baby_most_popular_and_grown_watermelon_variety_due_to_its_early_maturity.jpg': require('../assets/SEEDS_SIMPLE/sugar_baby_most_popular_and_grown_watermelon_variety_due_to_its_early_maturity.jpg'),
    'sugar_baby.jpg': require('../assets/SEEDS_SIMPLE/sugar_baby.jpg'),
    'sugar_king_sweet_corn.jpg': require('../assets/SEEDS_SIMPLE/sugar_king_sweet_corn.jpg'),
    'sukari_f1_watermelon.jpg': require('../assets/SEEDS_SIMPLE/sukari_f1_watermelon.jpg'),
    'swiss_chard_ford_hook_giant_tall_and_vigorous_spinach_variety.png': require('../assets/SEEDS_SIMPLE/swiss_chard_ford_hook_giant_tall_and_vigorous_spinach_variety.png'),
    'tall_utah_celery_variety_with_crisp_stringless_green_tightly_folded_hearts.jpg': require('../assets/SEEDS_SIMPLE/tall_utah_celery_variety_with_crisp_stringless_green_tightly_folded_hearts.jpg'),
    'tandi_f1_tomato.jpg': require('../assets/SEEDS_SIMPLE/tandi_f1_tomato.jpg'),
    'tengeru_97_determinate_round_tomato_with_a_high_yield_potential.png': require('../assets/SEEDS_SIMPLE/tengeru_97_determinate_round_tomato_with_a_high_yield_potential.png'),
    'tengeru.png': require('../assets/SEEDS_SIMPLE/tengeru.png'),
    'terere_amaranthus_indigenous_highly_nutritious_green_leafy_vegetable.jpg': require('../assets/SEEDS_SIMPLE/terere_amaranthus_indigenous_highly_nutritious_green_leafy_vegetable.jpg'),
    'tomato_assila.jpg': require('../assets/SEEDS_SIMPLE/tomato_assila.jpg'),
    'water_melon_pata_negra.jpg': require('../assets/SEEDS_SIMPLE/water_melon_pata_negra.jpg'),
    'yubi_f1_pakchoy_chinese_cabbage.png': require('../assets/SEEDS_SIMPLE/yubi_f1_pakchoy_chinese_cabbage.png'),
    'zawadi_f1_cabbage_high_yielding_variety_that_withstands_long_distance_transportation.jpg': require('../assets/SEEDS_SIMPLE/zawadi_f1_cabbage_high_yielding_variety_that_withstands_long_distance_transportation.jpg')
  };

  // Get image source from static mapping
  const getImageSource = (imageName) => {
    return seedImages[imageName] || require('../assets/seeds.png');
  };

  // Memoized products data - complete list of all 72 seed products
  const seedProducts = useMemo(() => [
    {
      id: 1, 
      name: 'Anita Watermelon', 
      imageName: 'anita_watermelon.jpg', 
      category: 'Watermelon', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 15,000 - UGX 40,000', 
      description: 'High-quality watermelon seeds for excellent fruit production.'
    },
    {
      id: 2, 
      name: 'Arjani F1 Eggplants', 
      imageName: 'arjani_f1_eggplants.jpeg', 
      category: 'Eggplant', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 hybrid eggplant variety with high yield potential.'
    },
    {
      id: 3, 
      name: 'Arjuna F1 Pumpkin', 
      imageName: 'arjuna_f1_pumpkin.jpg', 
      category: 'Pumpkin', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 hybrid pumpkin seeds for large, quality fruits.'
    },
    {
      id: 4, 
      name: 'Ashley Open Pollinated Cucumber Variety With Prolific Productivity', 
      imageName: 'ashley_open_pollinated_cucumber_varirty_with_prolific_productivity.jpg', 
      category: 'Cucumber', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 8,000 - UGX 20,000', 
      description: 'Open pollinated cucumber variety with prolific productivity.'
    },
    {
      id: 5, 
      name: 'Bitter Gourd Palee F1', 
      imageName: 'bitter_gourd_palee_f1.jpg', 
      category: 'Gourd', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 hybrid bitter gourd variety for quality production.'
    },
    {
      id: 6, 
      name: 'Black Beauty Eggplants', 
      imageName: 'black_beauty_eggplants.jpeg', 
      category: 'Eggplant', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 8,000 - UGX 22,000', 
      description: 'Black beauty eggplant variety with excellent fruit quality.'
    },
    {
      id: 7, 
      name: 'Cal J Tomato Compact and Determinate Variety Suitable For Processing and Fresh Market', 
      imageName: 'cal_j_tomato_compact_and_determinate_variety_suitable_for_processing_and_fresh_market.jpg', 
      category: 'Tomato', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 8,000 - UGX 25,000', 
      description: 'Compact and determinate tomato variety suitable for processing and fresh market.'
    },
    {
      id: 8, 
      name: 'California Wonder', 
      imageName: 'california_wonder.jpg', 
      category: 'Vegetable', 
      manufacturer: 'California Seeds',
      price: 'UGX 5,000 - UGX 30,000', 
      description: 'Sweet pepper variety suitable for home and market gardens.'
    },
    {
      id: 9, 
      name: 'California Wonder Bamba Pepper', 
      imageName: 'california_wonder_bamba_pepper.png', 
      category: 'Pepper', 
      manufacturer: 'California Seeds',
      price: 'UGX 10,000 - UGX 30,000', 
      description: 'Sweet pepper variety suitable for home and market gardens.'
    },
    {
      id: 10, 
      name: 'California Wonder Sweet Pepper Variety Suitable For Home and Market Gardens', 
      imageName: 'california_wonder_sweet_pepper_variety_suitable_for_home_and_market_gardens.jpg', 
      category: 'Pepper', 
      manufacturer: 'California Seeds',
      price: 'UGX 10,000 - UGX 30,000', 
      description: 'Sweet pepper variety suitable for home and market gardens.'
    },
    {
      id: 11, 
      name: 'Cayenne Long Slim Hot Pepper With Early Maturity and High Yield Potential', 
      imageName: 'cayenne_long_slim_hot_pepper_with_early_maturity_and_high_yield_potential.jpg', 
      category: 'Pepper', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 10,000 - UGX 30,000', 
      description: 'Long slim hot pepper with early maturity and high yield potential.'
    },
    {
      id: 12, 
      name: 'Coatmeal Coriander', 
      imageName: 'coatmeal_coriander.jpg', 
      category: 'Coriander', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 5,000 - UGX 15,000', 
      description: 'High-quality coriander seeds for fresh herb production.'
    },
    {
      id: 13, 
      name: 'Copenhagen', 
      imageName: 'copenhagen.jpg', 
      category: 'Cabbage', 
      manufacturer: 'Copenhagen Seeds',
      price: 'UGX 12,000 - UGX 28,000', 
      description: 'Quality cabbage seeds for excellent head formation.'
    },
    {
      id: 14, 
      name: 'Copenhagen Market Cabbage The Most Popular Early Maturing Ball Headed Variety', 
      imageName: 'copenhagen_market_cabbage_the_most_popular_early_maturing_ball_headed_variety.jpg', 
      category: 'Cabbage', 
      manufacturer: 'Copenhagen Seeds',
      price: 'UGX 12,000 - UGX 28,000', 
      description: 'The most popular early maturing ball headed cabbage variety.'
    },
    {
      id: 15, 
      name: 'Corriander Dhania', 
      imageName: 'corriander_dhania.jpg', 
      category: 'Coriander', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 5,000 - UGX 15,000', 
      description: 'Premium coriander seeds for aromatic herb production.'
    },
    {
      id: 16, 
      name: 'Demon F1 Hotpaper', 
      imageName: 'demon_f1_hotpaper.jpeg', 
      category: 'Vegetable', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'High-quality seed variety for agricultural use.'
    },
    {
      id: 17, 
      name: 'Dodo Elma', 
      imageName: 'dodo_elma.jpg', 
      category: 'Vegetable', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 5,000 - UGX 30,000', 
      description: 'High-quality seed variety for agricultural use.'
    },
    {
      id: 18, 
      name: 'Drumhead Cabbage', 
      imageName: 'drumhead_cabbage.jpg', 
      category: 'Cabbage', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 12,000 - UGX 28,000', 
      description: 'Giant drum head cabbage variety that is high yielding and market fit.'
    },
    {
      id: 19, 
      name: 'E107 Simsim', 
      imageName: 'e107_simsim.png', 
      category: 'Sesame', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 12,000 - UGX 30,000', 
      description: 'High-quality sesame seeds for oil production.'
    },
    {
      id: 20, 
      name: 'Efia Hot Paper', 
      imageName: 'efia_hot_paper.jpeg', 
      category: 'Vegetable', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 5,000 - UGX 30,000', 
      description: 'High-quality seed variety for agricultural use.'
    },
    {
      id: 21, 
      name: 'Fanaka F1 Cabbage Hybrid With Excellent Heat Tolerance and High Adaptability', 
      imageName: 'fanaka_f1_cabbage_hybrid_with_excellent_heat_tolerance_and_high_adaptability.jpg', 
      category: 'Cabbage', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 hybrid cabbage with excellent heat tolerance and high adaptability.'
    },
    {
      id: 22, 
      name: 'Femi F1 Hybrid Eggplant Variety', 
      imageName: 'femi_f1_hybrid_eggplant_variety.png', 
      category: 'Eggplant', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 hybrid eggplant variety with superior quality.'
    },
    {
      id: 23, 
      name: 'Frey Pepper Hybrid F1', 
      imageName: 'frey_pepper_hybrid_f1.jpg', 
      category: 'Pepper', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 hybrid pepper variety for excellent production.'
    },
    {
      id: 24, 
      name: 'Galia F1 Sweet Melon With Firm Fruits Aromatic Flavour', 
      imageName: 'galia_f1_sweet_melon_with_firm_fruits_aromatic_flavour.jpg', 
      category: 'Watermelon', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 sweet melon with firm fruits and aromatic flavour.'
    },
    {
      id: 25, 
      name: 'Georgia Sukuma Wiki Vigorous and Hardy Collard Variety', 
      imageName: 'georgia_sukuma_wiki_vigorous_and_hardy_collard_variety.jpg', 
      category: 'Vegetable', 
      manufacturer: 'Georgia Seeds',
      price: 'UGX 5,000 - UGX 30,000', 
      description: 'Vigorous and hardy collard variety for leafy green production.'
    },
    {
      id: 26, 
      name: 'Giant Drum Head Cabbage Variety That Is High Yielding and Market Fit', 
      imageName: 'giant_drum_head_cabbage_variety_that_is_high_yielding_and_market_fit.jpg', 
      category: 'Cabbage', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 12,000 - UGX 28,000', 
      description: 'Quality cabbage seeds for excellent head formation.'
    },
    {
      id: 27, 
      name: 'Grace Barley Seed', 
      imageName: 'grace_barley_seed.png', 
      category: 'Barley', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'High-quality barley seeds for grain production.'
    },
    {
      id: 28, 
      name: 'Great Lakes Mesa 659 Lettuce Variety With Tip Burn Resistance Medium Large Solid Heads', 
      imageName: 'great_lakes_mesa_659_lettuce_variety_with_tip_burn_resistance_medium_large_solid_heads.jpg', 
      category: 'Lettuce', 
      manufacturer: 'Great Lakes Seeds',
      price: 'UGX 8,000 - UGX 20,000', 
      description: 'Lettuce variety with tip burn resistance and medium large solid heads.'
    },
    {
      id: 29, 
      name: 'Green Aroma Coriander Dhania Variety With Vigorous and Fast Growing Plants', 
      imageName: 'green_aroma_coriander_dhania_variety_with_vigorous_and_fast_growing_plants.jpg', 
      category: 'Coriander', 
      manufacturer: 'Roma Seeds',
      price: 'UGX 5,000 - UGX 15,000', 
      description: 'Coriander variety with vigorous and fast growing plants.'
    },
    {
      id: 30, 
      name: 'Green Bunching Onion Non Bulbing Alliums That Produce Yummy Green Stems', 
      imageName: 'green_bunching_onion_non_bulbing_alliums_that_produce_yummy_green_stems.jpg', 
      category: 'Onion', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 6,000 - UGX 18,000', 
      description: 'Non-bulbing alliums that produce yummy green stems.'
    },
    {
      id: 31, 
      name: 'Green Coronet F1 Cabbage Medium Large Semi Upright Hybrid', 
      imageName: 'green_coronet_f1_cabbage_medium_large_semi_upright_hybrid.jpg', 
      category: 'Cabbage', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 cabbage medium large semi upright hybrid variety.'
    },
    {
      id: 32, 
      name: 'Green Gold F1 Pepper High Yielding Variety With Excellent Fruit Set', 
      imageName: 'green_gold_f1_pepper_high_yielding_variety_with_excellent_fruit_set.jpg', 
      category: 'Pepper', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 pepper high yielding variety with excellent fruit set.'
    },
    {
      id: 33, 
      name: 'Green Sprouting Calabrese Broccoli With Medium Sized Dark Green Heads', 
      imageName: 'green_sprouting_calabrese_broccoli_with_medium_sized_dark_green_heads.jpg', 
      category: 'Broccoli', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 12,000 - UGX 30,000', 
      description: 'Broccoli with medium sized dark green heads.'
    },
    {
      id: 34, 
      name: 'Habanero Red Bonnet Pepper', 
      imageName: 'habanero_red_bonnet_pepper.png', 
      category: 'Pepper', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 10,000 - UGX 30,000', 
      description: 'Red bonnet habanero pepper for hot pepper production.'
    },
    {
      id: 35, 
      name: 'Habanero Yellow Bonnet Pepper', 
      imageName: 'habanero_yellow_bonnet_pepper.png', 
      category: 'Pepper', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 10,000 - UGX 30,000', 
      description: 'Yellow bonnet habanero pepper for hot pepper production.'
    },
    {
      id: 36, 
      name: 'Indica F1 Cabbage', 
      imageName: 'indica_f1_cabbage.jpg', 
      category: 'Cabbage', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 cabbage variety with excellent characteristics.'
    },
    {
      id: 37, 
      name: 'Julie F1', 
      imageName: 'julie_f1.jpg', 
      category: 'Vegetable', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 hybrid variety for quality production.'
    },
    {
      id: 38, 
      name: 'Katana F1 Pumpkin', 
      imageName: 'katana_f1_pumpkin.jpg', 
      category: 'Pumpkin', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 pumpkin variety for excellent fruit production.'
    },
    {
      id: 39, 
      name: 'Kaveri F1 Sweet Pepper', 
      imageName: 'kaveri_f1_sweet_pepper.jpg', 
      category: 'Pepper', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 sweet pepper variety for quality production.'
    },
    {
      id: 40, 
      name: 'Kifaru F1 Red Cabbage', 
      imageName: 'kifaru_f1_red_cabbage.jpg', 
      category: 'Cabbage', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 red cabbage variety for quality production.'
    },
    {
      id: 41, 
      name: 'Kilele F1hybrid', 
      imageName: 'kilele_f1hybrid.jpg', 
      category: 'Vegetable', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 hybrid variety for excellent production.'
    },
    {
      id: 42, 
      name: 'Long Purple Eggplant Variety With A High Yield Potential', 
      imageName: 'long_purple_eggplant_variety_with_a_high_yield_potential.jpg', 
      category: 'Eggplant', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 8,000 - UGX 22,000', 
      description: 'Long purple eggplant variety with high yield potential.'
    },
    {
      id: 43, 
      name: 'Mak Soy 3N BRAC Seed', 
      imageName: 'mak_soy_3n_brac_seed.png', 
      category: 'Soybean', 
      manufacturer: 'BRAC Seeds',
      price: 'UGX 18,000 - UGX 45,000', 
      description: 'BRAC soybean seed variety for quality production.'
    },
    {
      id: 44, 
      name: 'Mammoth Red Rock Red Cabbage Producing Large Beautiful Deep Red Purple Heads', 
      imageName: 'mammoth_red_rock_red_cabbage_producing_large_beautiful_deep_red_purple_heads.jpg', 
      category: 'Cabbage', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 12,000 - UGX 28,000', 
      description: 'Red cabbage producing large beautiful deep red purple heads.'
    },
    {
      id: 45, 
      name: 'Maradona F1 Hybrid Papaya/Pawpaw', 
      imageName: 'maradona_f1_hybrid_papayapawpaw.png', 
      category: 'Papaya', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 hybrid papaya/pawpaw variety for quality production.'
    },
    {
      id: 46, 
      name: 'Maxim F1 Tomato', 
      imageName: 'maxim_f1_tomato.jpg', 
      category: 'Tomato', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 tomato variety for excellent production.'
    },
    {
      id: 47, 
      name: 'Merdan F1 African Eggplants', 
      imageName: 'merdan_f1_african_eggplants.jpeg', 
      category: 'Eggplant', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 African eggplant variety for quality production.'
    },
    {
      id: 48, 
      name: 'Nakati Highly Nutritious Local Vegetable', 
      imageName: 'nakati_highly_nutritious_local_vegetable.jpg', 
      category: 'Leafy Greens', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 4,000 - UGX 12,000', 
      description: 'Highly nutritious local vegetable for healthy production.'
    },
    {
      id: 49, 
      name: 'Namuche 3', 
      imageName: 'namuche_3.jpg', 
      category: 'Vegetable', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 5,000 - UGX 30,000', 
      description: 'Quality seed variety for excellent production.'
    },
    {
      id: 50, 
      name: 'Nouvelle F1 Tomatoes', 
      imageName: 'nouvelle_f1_tomatoes.jpg', 
      category: 'Tomato', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 tomato variety for quality production.'
    },
    {
      id: 51, 
      name: 'Poornima 008 F1 Cauliflower', 
      imageName: 'poornima_008_f1_cauliflower.jpg', 
      category: 'Cauliflower', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 cauliflower variety for quality production.'
    },
    {
      id: 52, 
      name: 'Pusa Sawani', 
      imageName: 'pusa_sawani.jpg', 
      category: 'Vegetable', 
      manufacturer: 'Pusa Seeds',
      price: 'UGX 5,000 - UGX 30,000', 
      description: 'High-quality seed variety for agricultural use.'
    },
    {
      id: 53, 
      name: 'Pusa Sawani Okra Variety With Wide Adaptability', 
      imageName: 'pusa_sawani_okra_variety_with_wide_adaptability.jpg', 
      category: 'Okra', 
      manufacturer: 'Pusa Seeds',
      price: 'UGX 6,000 - UGX 18,000', 
      description: 'Okra variety with wide adaptability for quality production.'
    },
    {
      id: 54, 
      name: 'Rambo F1 Tomato Seed', 
      imageName: 'rambo_f1_tomato_seed.jpg', 
      category: 'Tomato', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 tomato seed variety for excellent production.'
    },
    {
      id: 55, 
      name: 'Red Beauty', 
      imageName: 'red_beauty.jpeg', 
      category: 'Vegetable', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 5,000 - UGX 30,000', 
      description: 'Red beauty variety for quality production.'
    },
    {
      id: 56, 
      name: 'Red Bugga Amaranthus', 
      imageName: 'red_bugga_amaranthus.jpg', 
      category: 'Leafy Greens', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 4,000 - UGX 12,000', 
      description: 'Red bugga amaranthus for leafy green production.'
    },
    {
      id: 57, 
      name: 'Roma VFN High Yielding Determinate Oval Shape Tomato', 
      imageName: 'roma_vfn_high_yielding_determinate_oval_shape_tomato.jpg', 
      category: 'Tomato', 
      manufacturer: 'Roma Seeds',
      price: 'UGX 8,000 - UGX 25,000', 
      description: 'High yielding determinate oval shape tomato variety.'
    },
    {
      id: 58, 
      name: 'SC Duma 43 Maize Seed Agro Supply', 
      imageName: 'sc_duma_43_maize_seed_agro_supply.jpeg', 
      category: 'Maize', 
      manufacturer: 'SC Duma Seeds',
      price: 'UGX 25,000 - UGX 60,000', 
      description: 'SC Duma 43 maize seed for quality grain production.'
    },
    {
      id: 59, 
      name: 'Sugar Baby', 
      imageName: 'sugar_baby.jpg', 
      category: 'Vegetable', 
      manufacturer: 'Sugar Baby Seeds',
      price: 'UGX 5,000 - UGX 30,000', 
      description: 'High-quality seed variety for agricultural use.'
    },
    {
      id: 60, 
      name: 'Sugar Baby Most Popular and Grown Watermelon Variety Due To Its Early Maturity', 
      imageName: 'sugar_baby_most_popular_and_grown_watermelon_variety_due_to_its_early_maturity.jpg', 
      category: 'Watermelon', 
      manufacturer: 'Sugar Baby Seeds',
      price: 'UGX 15,000 - UGX 40,000', 
      description: 'Most popular and grown watermelon variety due to its early maturity.'
    },
    {
      id: 61, 
      name: 'Sugar King Sweet Corn', 
      imageName: 'sugar_king_sweet_corn.jpg', 
      category: 'Maize', 
      manufacturer: 'Sugar Baby Seeds',
      price: 'UGX 25,000 - UGX 60,000', 
      description: 'Sweet corn variety for quality grain production.'
    },
    {
      id: 62, 
      name: 'Sukari F1 Watermelon', 
      imageName: 'sukari_f1_watermelon.jpg', 
      category: 'Watermelon', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 watermelon variety for excellent fruit production.'
    },
    {
      id: 63, 
      name: 'Swiss Chard Ford Hook Giant Tall and Vigorous Spinach Variety', 
      imageName: 'swiss_chard_ford_hook_giant_tall_and_vigorous_spinach_variety.png', 
      category: 'Spinach', 
      manufacturer: 'Swiss Chard Seeds',
      price: 'UGX 6,000 - UGX 16,000', 
      description: 'Tall and vigorous spinach variety for leafy green production.'
    },
    {
      id: 64, 
      name: 'Tall Utah Celery Variety With Crisp Stringless Green Tightly Folded Hearts', 
      imageName: 'tall_utah_celery_variety_with_crisp_stringless_green_tightly_folded_hearts.jpg', 
      category: 'Celery', 
      manufacturer: 'Utah Celery Seeds',
      price: 'UGX 8,000 - UGX 22,000', 
      description: 'Celery variety with crisp stringless green tightly folded hearts.'
    },
    {
      id: 65, 
      name: 'Tandi F1 Tomato', 
      imageName: 'tandi_f1_tomato.jpg', 
      category: 'Tomato', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 tomato variety for quality production.'
    },
    {
      id: 66, 
      name: 'Tengeru', 
      imageName: 'tengeru.png', 
      category: 'Vegetable', 
      manufacturer: 'Tengeru Seeds',
      price: 'UGX 5,000 - UGX 30,000', 
      description: 'High-quality seed variety for agricultural use.'
    },
    {
      id: 67, 
      name: 'Tengeru 97 Determinate Round Tomato With A High Yield Potential', 
      imageName: 'tengeru_97_determinate_round_tomato_with_a_high_yield_potential.png', 
      category: 'Tomato', 
      manufacturer: 'Tengeru Seeds',
      price: 'UGX 8,000 - UGX 25,000', 
      description: 'Determinate round tomato with high yield potential.'
    },
    {
      id: 68, 
      name: 'Terere Amaranthus Indigenous Highly Nutritious Green Leafy Vegetable', 
      imageName: 'terere_amaranthus_indigenous_highly_nutritious_green_leafy_vegetable.jpg', 
      category: 'Leafy Greens', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 4,000 - UGX 12,000', 
      description: 'Indigenous highly nutritious green leafy vegetable.'
    },
    {
      id: 69, 
      name: 'Tomato Assila', 
      imageName: 'tomato_assila.jpg', 
      category: 'Tomato', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 8,000 - UGX 25,000', 
      description: 'Assila tomato variety for quality production.'
    },
    {
      id: 70, 
      name: 'Water Melon Pata Negra', 
      imageName: 'water_melon_pata_negra.jpg', 
      category: 'Watermelon', 
      manufacturer: 'Various Seed Suppliers',
      price: 'UGX 15,000 - UGX 40,000', 
      description: 'Pata negra watermelon variety for quality production.'
    },
    {
      id: 71, 
      name: 'Yubi F1 Pakchoy Chinese Cabbage', 
      imageName: 'yubi_f1_pakchoy_chinese_cabbage.png', 
      category: 'Cabbage', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 pakchoy Chinese cabbage variety for quality production.'
    },
    {
      id: 72, 
      name: 'Zawadi F1 Cabbage High Yielding Variety That Withstands Long Distance Transportation', 
      imageName: 'zawadi_f1_cabbage_high_yielding_variety_that_withstands_long_distance_transportation.jpg', 
      category: 'Cabbage', 
      manufacturer: 'Hybrid Seed Company',
      price: 'UGX 15,000 - UGX 35,000', 
      description: 'F1 cabbage high yielding variety that withstands long distance transportation.'
    }
  
  ], []);

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
          placeholder={require('../assets/seeds.png')}
        />
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
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
      <SeedsDetailScreen 
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
          <Text style={styles.headerTitle}>Seed Products</Text>
        </View>
        <Text style={styles.headerSubtitle}>Complete range of agricultural seeds</Text>
      </View>

      {/* Products List with FlatList for better performance */}
      <FlatList
        data={seedProducts}
        renderItem={renderProduct}
        keyExtractor={(item, index) => {
          if (!item || !item.id) {
            console.warn('Invalid item in keyExtractor:', item);
            return `seed-invalid-${index}`;
          }
          return `seed-${item.id}-${item.imageName || index}`;
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

export default SeedsProductsScreen;