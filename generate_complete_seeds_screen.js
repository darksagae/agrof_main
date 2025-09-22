const fs = require('fs');

// Read the current seeds screen structure
const currentScreen = fs.readFileSync('/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/screens/SeedsProductsScreen.js', 'utf8');

// Read the generated products
const generatedProducts = fs.readFileSync('/home/darksagae/Desktop/agrof-main/seeds_products_generated.js', 'utf8');

// Extract the products array from the generated file
const productsMatch = generatedProducts.match(/const seedProducts = useMemo\(\(\) => \[([\s\S]*?)\], \[\]\);/);
if (!productsMatch) {
  console.error('Could not extract products from generated file');
  process.exit(1);
}

const productsArray = productsMatch[1];

// Create the complete seeds screen
const completeScreen = `import React, { useState, useMemo } from 'react';
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
  const seedProducts = useMemo(() => [${productsArray}
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
            return \`seed-invalid-\${index}\`;
          }
          return \`seed-\${item.id}-\${item.imageName || index}\`;
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

export default SeedsProductsScreen;`;

// Write the complete screen to file
fs.writeFileSync('/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/screens/SeedsProductsScreenComplete.js', completeScreen);

console.log('Complete seeds screen generated successfully!');
console.log('File saved as: SeedsProductsScreenComplete.js');
