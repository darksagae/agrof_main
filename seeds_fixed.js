import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import SeedsDetailScreen from './SeedsDetailScreen';
import SimplePricingWidget from '../components/SimplePricingWidget';

const { width } = Dimensions.get('window');

const SeedsScreen = ({ onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pricingWidgetVisible, setPricingWidgetVisible] = useState(false);
  const [selectedProductForPricing, setSelectedProductForPricing] = useState(null);
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  // Helper function to check if product has multiple prices
  const hasMultiplePrices = (product) => {
    if (!product.packaging || typeof product.packaging !== 'string') {
      return false;
    }
    return product.packaging.includes(',') && product.packaging.includes('UGX');
  };

  // Helper function to get unit price for display
  const getUnitPrice = (product) => {
    if (!product.packaging || typeof product.packaging !== 'string') {
      return product.price || 'Price not available';
    }

    const priceRanges = product.packaging.split(',').map(item => item.trim());
    if (priceRanges.length > 0) {
      const firstPrice = priceRanges[0];
      const match = firstPrice.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+):\s*UGX\s*([\d,]+)/i);
      if (match) {
        const [, quantity, unit, price] = match;
        const pricePerUnit = parseInt(price.replace(/,/g, '')) / parseFloat(quantity);
        return `From UGX ${pricePerUnit.toFixed(0)} per ${unit}`;
      }
    }
    return product.price || 'Price not available';
  };

  // Handle pricing widget
  const handlePricingPress = (product) => {
    setSelectedProductForPricing(product);
    setPricingWidgetVisible(true);
  };

  // Optimized image loading handlers
  const handleImageLoad = useCallback((productId) => {
    setImageLoadingStates(prev => ({ ...prev, [productId]: false }));
  }, []);

  const handleImageLoadStart = useCallback((productId) => {
    setImageLoadingStates(prev => ({ ...prev, [productId]: true }));
  }, []);

  // Import all seeds images from simplified folder structure
  const seedImages = {
    'anita_watermelon': require('../assets/SEEDS_SIMPLE/anita_watermelon.jpg'),
    'arjani_f1_eggplants': require('../assets/SEEDS_SIMPLE/arjani_f1_eggplants.jpeg'),
    'arjuna_f1_pumpkin': require('../assets/SEEDS_SIMPLE/arjuna_f1_pumpkin.jpg'),
    'ashley_open_pollinated_cucumber_varirty_with_prolific_productivity': require('../assets/SEEDS_SIMPLE/ashley_open_pollinated_cucumber_varirty_with_prolific_productivity.jpg'),
    'bitter_gourd_palee_f1': require('../assets/SEEDS_SIMPLE/bitter_gourd_palee_f1.jpg'),
    'black_beauty_eggplants': require('../assets/SEEDS_SIMPLE/black_beauty_eggplants.jpeg'),
    'cal_j_tomato_compact_and_determinate_variety_suitable_for_processing_and_fresh_market': require('../assets/SEEDS_SIMPLE/cal_j_tomato_compact_and_determinate_variety_suitable_for_processing_and_fresh_market.jpg'),
    'california_wonder': require('../assets/SEEDS_SIMPLE/california_wonder.jpg'),
    'california_wonder_bamba_pepper': require('../assets/SEEDS_SIMPLE/california_wonder_bamba_pepper.png'),
    'california_wonder_sweet_pepper_variety_suitable_for_home_and_market_gardens': require('../assets/SEEDS_SIMPLE/california_wonder_sweet_pepper_variety_suitable_for_home_and_market_gardens.jpg'),
    'cayenne_long_slim_hot_pepper_with_early_maturity_and_high_yield_potential': require('../assets/SEEDS_SIMPLE/cayenne_long_slim_hot_pepper_with_early_maturity_and_high_yield_potential.jpg'),
    'coatmeal_coriander': require('../assets/SEEDS_SIMPLE/coatmeal_coriander.jpg'),
    'copenhagen': require('../assets/SEEDS_SIMPLE/copenhagen.jpg'),
    'copenhagen_market_cabbage_the_most_popular_early_maturing_ball_headed_variety': require('../assets/SEEDS_SIMPLE/copenhagen_market_cabbage_the_most_popular_early_maturing_ball_headed_variety.jpg'),
    'corriander_dhania': require('../assets/SEEDS_SIMPLE/corriander_dhania.jpg'),
    'demon_f1_hotpaper': require('../assets/SEEDS_SIMPLE/demon_f1_hotpaper.jpeg'),
    'dodo_elma': require('../assets/SEEDS_SIMPLE/dodo_elma.jpg'),
    'drumhead_cabbage': require('../assets/SEEDS_SIMPLE/drumhead_cabbage.jpg'),
    'e107_simsim': require('../assets/SEEDS_SIMPLE/e107_simsim.png'),
    'efia_hot_paper': require('../assets/SEEDS_SIMPLE/efia_hot_paper.jpeg'),
    'fanaka_f1_cabbage_hybrid_with_excellent_heat_tolerance_and_high_adaptability': require('../assets/SEEDS_SIMPLE/fanaka_f1_cabbage_hybrid_with_excellent_heat_tolerance_and_high_adaptability.jpg'),
    'femi_f1_hybrid_eggplant_variety': require('../assets/SEEDS_SIMPLE/femi_f1_hybrid_eggplant_variety.png'),
    'frey_pepper_hybrid_f1': require('../assets/SEEDS_SIMPLE/frey_pepper_hybrid_f1.jpg'),
    'galia_f1_sweet_melon_with_firm_fruits_aromatic_flavour': require('../assets/SEEDS_SIMPLE/galia_f1_sweet_melon_with_firm_fruits_aromatic_flavour.jpg'),
    'georgia_sukuma_wiki_vigorous_and_hardy_collard_variety': require('../assets/SEEDS_SIMPLE/georgia_sukuma_wiki_vigorous_and_hardy_collard_variety.jpg'),
    'giant_drum_head_cabbage_variety_that_is_high_yielding_and_market_fit': require('../assets/SEEDS_SIMPLE/giant_drum_head_cabbage_variety_that_is_high_yielding_and_market_fit.jpg'),
    'grace_barley_seed': require('../assets/SEEDS_SIMPLE/grace_barley_seed.png'),
    'great_lakes_mesa_659_lettuce_variety_with_tip_burn_resistance_medium_large_solid_heads': require('../assets/SEEDS_SIMPLE/great_lakes_mesa_659_lettuce_variety_with_tip_burn_resistance_medium_large_solid_heads.jpg'),
    'green_aroma_coriander_dhania_variety_with_vigorous_and_fast_growing_plants': require('../assets/SEEDS_SIMPLE/green_aroma_coriander_dhania_variety_with_vigorous_and_fast_growing_plants.jpg'),
    'green_bunching_onion_non_bulbing_alliums_that_produce_yummy_green_stems': require('../assets/SEEDS_SIMPLE/green_bunching_onion_non_bulbing_alliums_that_produce_yummy_green_stems.jpg'),
    'green_coronet_f1_cabbage_medium_large_semi_upright_hybrid': require('../assets/SEEDS_SIMPLE/green_coronet_f1_cabbage_medium_large_semi_upright_hybrid.jpg'),
    'green_gold_f1_pepper_high_yielding_variety_with_excellent_fruit_set': require('../assets/SEEDS_SIMPLE/green_gold_f1_pepper_high_yielding_variety_with_excellent_fruit_set.jpg'),
    'green_sprouting_calabrese_broccoli_with_medium_sized_dark_green_heads': require('../assets/SEEDS_SIMPLE/green_sprouting_calabrese_broccoli_with_medium_sized_dark_green_heads.jpg'),
    'habanero_red_bonnet_pepper': require('../assets/SEEDS_SIMPLE/habanero_red_bonnet_pepper.png'),
    'habanero_yellow_bonnet_pepper': require('../assets/SEEDS_SIMPLE/habanero_yellow_bonnet_pepper.png'),
    'indica_f1_cabbage': require('../assets/SEEDS_SIMPLE/indica_f1_cabbage.jpg'),
    'julie_f1': require('../assets/SEEDS_SIMPLE/julie_f1.jpg'),
    'katana_f1_pumpkin': require('../assets/SEEDS_SIMPLE/katana_f1_pumpkin.jpg'),
    'kaveri_f1_sweet_pepper': require('../assets/SEEDS_SIMPLE/kaveri_f1_sweet_pepper.jpg'),
    'kifaru_f1_red_cabbage': require('../assets/SEEDS_SIMPLE/kifaru_f1_red_cabbage.jpg'),
    'kilele_f1hybrid': require('../assets/SEEDS_SIMPLE/kilele_f1hybrid.jpg'),
    'long_purple_eggplant_variety_with_a_high_yield_potential': require('../assets/SEEDS_SIMPLE/long_purple_eggplant_variety_with_a_high_yield_potential.jpg'),
    'mak_soy_3n_brac_seed': require('../assets/SEEDS_SIMPLE/mak_soy_3n_brac_seed.png'),
    'mammoth_red_rock_red_cabbage_producing_large_beautiful_deep_red_purple_heads': require('../assets/SEEDS_SIMPLE/mammoth_red_rock_red_cabbage_producing_large_beautiful_deep_red_purple_heads.jpg'),
    'maradona_f1_hybrid_papayapawpaw': require('../assets/SEEDS_SIMPLE/maradona_f1_hybrid_papayapawpaw.png'),
    'maxim_f1_tomato': require('../assets/SEEDS_SIMPLE/maxim_f1_tomato.jpg'),
    'merdan_f1_african_eggplants': require('../assets/SEEDS_SIMPLE/merdan_f1_african_eggplants.jpeg'),
    'nakati_highly_nutritious_local_vegetable': require('../assets/SEEDS_SIMPLE/nakati_highly_nutritious_local_vegetable.jpg'),
    'namuche_3': require('../assets/SEEDS_SIMPLE/namuche_3.jpg'),
    'nouvelle_f1_tomatoes': require('../assets/SEEDS_SIMPLE/nouvelle_f1_tomatoes.jpg'),
    'poornima_008_f1_cauliflower': require('../assets/SEEDS_SIMPLE/poornima_008_f1_cauliflower.jpg'),
    'pusa_sawani': require('../assets/SEEDS_SIMPLE/pusa_sawani.jpg'),
    'pusa_sawani_okra_variety_with_wide_adaptability': require('../assets/SEEDS_SIMPLE/pusa_sawani_okra_variety_with_wide_adaptability.jpg'),
    'rambo_f1_tomato_seed': require('../assets/SEEDS_SIMPLE/rambo_f1_tomato_seed.jpg'),
    'red_beauty': require('../assets/SEEDS_SIMPLE/red_beauty.jpeg'),
    'red_bugga_amaranthus': require('../assets/SEEDS_SIMPLE/red_bugga_amaranthus.jpg'),
    'roma_vfn_high_yielding_determinate_oval_shape_tomato': require('../assets/SEEDS_SIMPLE/roma_vfn_high_yielding_determinate_oval_shape_tomato.jpg'),
    'sc_duma_43_maize_seed_agro_supply': require('../assets/SEEDS_SIMPLE/sc_duma_43_maize_seed_agro_supply.jpeg'),
    'sugar_baby': require('../assets/SEEDS_SIMPLE/sugar_baby.jpg'),
    'sugar_baby_most_popular_and_grown_watermelon_variety_due_to_its_early_maturity': require('../assets/SEEDS_SIMPLE/sugar_baby_most_popular_and_grown_watermelon_variety_due_to_its_early_maturity.jpg'),
    'sugar_king_sweet_corn': require('../assets/SEEDS_SIMPLE/sugar_king_sweet_corn.jpg'),
    'sukari_f1_watermelon': require('../assets/SEEDS_SIMPLE/sukari_f1_watermelon.jpg'),
    'swiss_chard_ford_hook_giant_tall_and_vigorous_spinach_variety': require('../assets/SEEDS_SIMPLE/swiss_chard_ford_hook_giant_tall_and_vigorous_spinach_variety.png'),
    'tall_utah_celery_variety_with_crisp_stringless_green_tightly_folded_hearts': require('../assets/SEEDS_SIMPLE/tall_utah_celery_variety_with_crisp_stringless_green_tightly_folded_hearts.jpg'),
    'tandi_f1_tomato': require('../assets/SEEDS_SIMPLE/tandi_f1_tomato.jpg'),
    'tengeru': require('../assets/SEEDS_SIMPLE/tengeru.png'),
    'tengeru_97_determinate_round_tomato_with_a_high_yield_potential': require('../assets/SEEDS_SIMPLE/tengeru_97_determinate_round_tomato_with_a_high_yield_potential.png'),
    'terere_amaranthus_indigenous_highly_nutritious_green_leafy_vegetable': require('../assets/SEEDS_SIMPLE/terere_amaranthus_indigenous_highly_nutritious_green_leafy_vegetable.jpg'),
    'tomato_assila': require('../assets/SEEDS_SIMPLE/tomato_assila.jpg'),
    'water_melon_pata_negra': require('../assets/SEEDS_SIMPLE/water_melon_pata_negra.jpg'),
    'yubi_f1_pakchoy_chinese_cabbage': require('../assets/SEEDS_SIMPLE/yubi_f1_pakchoy_chinese_cabbage.png'),
    'zawadi_f1_cabbage_high_yielding_variety_that_withstands_long_distance_transportation': require('../assets/SEEDS_SIMPLE/zawadi_f1_cabbage_high_yielding_variety_that_withstands_long_distance_transportation.jpg'),
  };

  const seedProducts = [
    {
      id: 1,
      name: 'Anita – Watermelon',
      image: seedImages['anita_watermelon'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
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
      name: 'Arjani F1 - Eggplants',
      image: seedImages['arjani_f1_eggplants'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
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
      name: 'Arjuna F1 – Pumpkin',
      image: seedImages['arjuna_f1_pumpkin'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
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
      name: 'Ashley – Open Pollinated Cucumber Varirty With Prolific Productivity',
      image: seedImages['ashley_open_pollinated_cucumber_varirty_with_prolific_productivity'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
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
      name: 'Bitter Gourd -Palee F1',
      image: seedImages['bitter_gourd_palee_f1'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
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
      name: 'Black Beauty - Eggplants',
      image: seedImages['black_beauty_eggplants'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
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
      name: 'California Wonder',
      image: seedImages['cal_j_tomato_compact_and_determinate_variety_suitable_for_processing_and_fresh_market'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
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
      name: 'California Wonder "Bamba" - Pepper',
      image: seedImages['california_wonder'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
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
      name: 'California Wonder – Sweet Pepper Variety Suitable For Home And Market Gardens',
      image: seedImages['california_wonder_bamba_pepper'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
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
      name: 'Cal-j Tomato Compact And Determinate Variety Suitable For Processing And Fresh Market',
      image: seedImages['california_wonder_sweet_pepper_variety_suitable_for_home_and_market_gardens'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 11,
      name: 'Cayenne Long Slim – Hot Pepper, With Early Maturity And High Yield Potential',
      image: seedImages['cayenne_long_slim_hot_pepper_with_early_maturity_and_high_yield_potential'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 12,
      name: 'Coatmeal - Coriander',
      image: seedImages['coatmeal_coriander'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 13,
      name: 'Copenhagen Market – Cabbage, The Most Popular Early Maturing Ball-headed Variety',
      image: seedImages['copenhagen'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 14,
      name: 'Corriander Dhania',
      image: seedImages['copenhagen_market_cabbage_the_most_popular_early_maturing_ball_headed_variety'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 15,
      name: 'Demon F1- Hotpaper',
      image: seedImages['corriander_dhania'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 16,
      name: 'Dodo (Elma)',
      image: seedImages['demon_f1_hotpaper'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 17,
      name: 'Drumhead - Cabbage',
      image: seedImages['dodo_elma'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 18,
      name: 'E107 (Simsim)',
      image: seedImages['drumhead_cabbage'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 19,
      name: 'Efia - Hot paper',
      image: seedImages['e107_simsim'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 20,
      name: 'Fanaka F1- Cabbage, Hybrid With Excellent Heat Tolerance And High Adaptability',
      image: seedImages['efia_hot_paper'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 21,
      name: 'Femi F1 – Hybrid Eggplant Variety',
      image: seedImages['fanaka_f1_cabbage_hybrid_with_excellent_heat_tolerance_and_high_adaptability'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 22,
      name: 'Frey - Pepper Hybrid F1',
      image: seedImages['femi_f1_hybrid_eggplant_variety'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 23,
      name: 'Galia F1 – Sweet Melon With Firm Fruits, Aromatic Flavour',
      image: seedImages['frey_pepper_hybrid_f1'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 24,
      name: 'Georgia Sukuma Wiki – Vigorous And Hardy Collard Variety',
      image: seedImages['galia_f1_sweet_melon_with_firm_fruits_aromatic_flavour'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 25,
      name: 'Grace - Barley Seed',
      image: seedImages['georgia_sukuma_wiki_vigorous_and_hardy_collard_variety'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 26,
      name: 'Great Lakes Mesa 659 – Lettuce Variety With Tip-burn Resistance & Medium-large, Solid Heads',
      image: seedImages['giant_drum_head_cabbage_variety_that_is_high_yielding_and_market_fit'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 27,
      name: 'Green Aroma- Coriander (Dhania) Variety with Vigorous and Fast growing Plants',
      image: seedImages['grace_barley_seed'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 28,
      name: 'Green Bunching – Onion, Non-bulbing Alliums That Produce Yummy Green Stems',
      image: seedImages['great_lakes_mesa_659_lettuce_variety_with_tip_burn_resistance_medium_large_solid_heads'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 29,
      name: 'Green Coronet F1 – Cabbage, Medium-large, Semi-upright Hybrid',
      image: seedImages['green_aroma_coriander_dhania_variety_with_vigorous_and_fast_growing_plants'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 30,
      name: 'Green Gold F1 – Pepper, High Yielding Variety With Excellent Fruit Set',
      image: seedImages['green_bunching_onion_non_bulbing_alliums_that_produce_yummy_green_stems'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 31,
      name: 'Green Sprouting Calabrese – Broccoli With Medium Sized Dark Green Heads',
      image: seedImages['green_coronet_f1_cabbage_medium_large_semi_upright_hybrid'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 32,
      name: 'Habanero Red – Bonnet Pepper',
      image: seedImages['green_gold_f1_pepper_high_yielding_variety_with_excellent_fruit_set'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 33,
      name: 'Habanero Yellow – Bonnet Pepper',
      image: seedImages['green_sprouting_calabrese_broccoli_with_medium_sized_dark_green_heads'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 34,
      name: 'Indica F1-cabbage',
      image: seedImages['habanero_red_bonnet_pepper'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 35,
      name: 'Julie F1',
      image: seedImages['habanero_yellow_bonnet_pepper'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 36,
      name: 'Kaveri F1 – Sweet Pepper',
      image: seedImages['indica_f1_cabbage'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 37,
      name: 'Katana F1 -Pumpkin',
      image: seedImages['julie_f1'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 38,
      name: 'Kifaru F1 – Red Cabbage',
      image: seedImages['katana_f1_pumpkin'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 39,
      name: 'Kilele F1hybrid',
      image: seedImages['kaveri_f1_sweet_pepper'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 40,
      name: 'Long Purple – Eggplant Variety With A High Yield Potential',
      image: seedImages['kifaru_f1_red_cabbage'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 41,
      name: 'Mak Soy 3N (Brac Seed)',
      image: seedImages['kilele_f1hybrid'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 42,
      name: 'Mammoth Red Rock – Red Cabbage Producing Large, Beautiful Deep Red-purple Heads',
      image: seedImages['long_purple_eggplant_variety_with_a_high_yield_potential'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 43,
      name: 'Maradona F1 – Hybrid Papayapawpaw',
      image: seedImages['mak_soy_3n_brac_seed'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 44,
      name: 'Merdan F1- African Eggplants',
      image: seedImages['mammoth_red_rock_red_cabbage_producing_large_beautiful_deep_red_purple_heads'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 45,
      name: 'Maxim F1 – Tomato',
      image: seedImages['maradona_f1_hybrid_papayapawpaw'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 46,
      name: 'Nakati - Highly Nutritious Local Vegetable',
      image: seedImages['maxim_f1_tomato'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 47,
      name: 'Namuche 3',
      image: seedImages['merdan_f1_african_eggplants'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 48,
      name: 'Nouvelle F1 - Tomatoes',
      image: seedImages['nakati_highly_nutritious_local_vegetable'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 49,
      name: 'Poornima 008 F1- Cauliflower',
      image: seedImages['namuche_3'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 50,
      name: 'Pusa Sawani – Okra Variety With Wide Adaptability',
      image: seedImages['nouvelle_f1_tomatoes'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 51,
      name: 'Rambo F1 – Tomato Seed',
      image: seedImages['poornima_008_f1_cauliflower'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 52,
      name: 'Red Beauty',
      image: seedImages['pusa_sawani'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 53,
      name: 'Red Bugga-amaranthus',
      image: seedImages['pusa_sawani_okra_variety_with_wide_adaptability'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 54,
      name: 'Roma Vfn – High Yielding Determinate Oval Shape Tomato',
      image: seedImages['rambo_f1_tomato_seed'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 55,
      name: 'Sc Duma 43 – Maize Seed (Agro Supply)',
      image: seedImages['red_beauty'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 56,
      name: 'Sugar Baby',
      image: seedImages['red_bugga_amaranthus'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 57,
      name: 'Sugar Baby – Most Popular And Grown Watermelon Variety Due To Its Early Maturity',
      image: seedImages['roma_vfn_high_yielding_determinate_oval_shape_tomato'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 58,
      name: 'Sugar King - Sweet Corn',
      image: seedImages['sc_duma_43_maize_seed_agro_supply'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 59,
      name: 'Sukari F1 – Watermelon',
      image: seedImages['sugar_baby'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 60,
      name: 'Swiss Chard Ford Hook Giant – Tall And Vigorous Spinach Variety',
      image: seedImages['sugar_baby_most_popular_and_grown_watermelon_variety_due_to_its_early_maturity'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 61,
      name: 'Tandi F1 – Tomato',
      image: seedImages['sugar_king_sweet_corn'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 62,
      name: 'Tall Utah – Celery Variety With Crisp, Stringless Green Tightly Folded Hearts',
      image: seedImages['sukari_f1_watermelon'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 63,
      name: 'Tengeru',
      image: seedImages['swiss_chard_ford_hook_giant_tall_and_vigorous_spinach_variety'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 64,
      name: 'Tengeru 97 - Determinate Round Tomato With A High Yield Potential',
      image: seedImages['tall_utah_celery_variety_with_crisp_stringless_green_tightly_folded_hearts'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 65,
      name: 'Terere – Amaranthus, Indigenous, Highly Nutritious Green Leafy Vegetable',
      image: seedImages['tandi_f1_tomato'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 66,
      name: 'Tomato Assila',
      image: seedImages['tengeru'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 67,
      name: 'Water Melon Pata Negra',
      image: seedImages['tengeru_97_determinate_round_tomato_with_a_high_yield_potential'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 68,
      name: 'Yubi F1 Pakchoy- Chinese Cabbage',
      image: seedImages['terere_amaranthus_indigenous_highly_nutritious_green_leafy_vegetable'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 69,
      name: 'Zawadi F1 – Cabbage, High Yielding Variety That Withstands Long Distance Transportation',
      image: seedImages['tomato_assila'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 70,
      name: 'Seed Product 70',
      image: seedImages['water_melon_pata_negra'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 71,
      name: 'Seed Product 71',
      image: seedImages['yubi_f1_pakchoy_chinese_cabbage'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 72,
      name: 'Seed Product 72',
      image: seedImages['zawadi_f1_cabbage_high_yielding_variety_that_withstands_long_distance_transportation'],
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Seeds',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    }
  ];

  console.log('🌱 SeedsScreen: Rendering with', seedProducts.length, 'products');

  // Optimized product rendering with memoization
  const renderProduct = useCallback(({ item: product }) => (
    <View style={styles.productItem}>
      {imageLoadingStates[product.id] && (
        <ActivityIndicator
          size="small"
          color="#4CAF50"
          style={styles.imageLoader}
        />
      )}
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => setSelectedProduct(product)}
        activeOpacity={0.8}
      >
        <Image
          source={product.image}
          style={styles.productImage}
          resizeMode="cover"
          onLoadStart={() => handleImageLoadStart(product.id)}
          onLoad={() => handleImageLoad(product.id)}
          onError={() => {
            console.log('Image load error for product:', product.name);
            handleImageLoad(product.id);
          }}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {product.description}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>
              {hasMultiplePrices(product) ? getUnitPrice(product) : product.price}
            </Text>
            {hasMultiplePrices(product) && (
              <TouchableOpacity
                style={styles.pricingButton}
                onPress={() => handlePricingPress(product)}
              >
                <Text style={styles.pricingButtonText}>View Prices</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  ), [imageLoadingStates, handleImageLoad, handleImageLoadStart]);

  // Memoized key extractor
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // Memoized getItemLayout for better performance
  const getItemLayout = useCallback((data, index) => ({
    length: 200, // Approximate item height
    offset: 200 * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seeds Products</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={seedProducts}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.productsGrid}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        getItemLayout={getItemLayout}
      />

      {selectedProduct && (
        <SeedsDetailScreen
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {pricingWidgetVisible && selectedProductForPricing && (
        <SimplePricingWidget
          product={selectedProductForPricing}
          onClose={() => {
            setPricingWidgetVisible(false);
            setSelectedProductForPricing(null);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  productsGrid: {
    padding: 16,
    paddingBottom: 100,
  },
  productItem: {
    flex: 1,
    margin: 8,
    maxWidth: (width - 48) / 2,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F5F5F5',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
    lineHeight: 18,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
    flex: 1,
  },
  pricingButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pricingButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  imageLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    zIndex: 1,
  },
});

export default SeedsScreen;
