import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FungicideDetailScreen from './FungicideDetailScreen';
import SimplePricingWidget from '../components/SimplePricingWidget';

const FungicidesScreen = ({ onBack }) => {
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
      const match = firstPrice.match(/(d+(?:.d+)?)s*([a-zA-Z]+):s*UGXs*([d,]+)/i);
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

  // Import all fungicide images from simplified folder structure
  const fungicideImages = {
    'alliete_flash_wg_80': require('../assets/FUNGICIDE_SIMPLE/alliete_flash_wg_80.png'),
    'amistar_250_sc': require('../assets/FUNGICIDE_SIMPLE/amistar_250_sc.png'),
    'apron_star_42ws': require('../assets/FUNGICIDE_SIMPLE/apron_star_42ws.png'),
    'ascopper_50_wp': require('../assets/FUNGICIDE_SIMPLE/ascopper_50_wp.jpg'),
    'ascosulph_80_wdg': require('../assets/FUNGICIDE_SIMPLE/ascosulph_80_wdg.jpg'),
    'ascozeb_80_wp': require('../assets/FUNGICIDE_SIMPLE/ascozeb_80_wp.jpg'),
    'bellis_38_wg': require('../assets/FUNGICIDE_SIMPLE/bellis_38_wg.png'),
    'bio_cure_b': require('../assets/FUNGICIDE_SIMPLE/bio_cure_b.jpg'),
    'control_70_wgd': require('../assets/FUNGICIDE_SIMPLE/control_70_wgd.png'),
    'copper_fungcure_500_wp': require('../assets/FUNGICIDE_SIMPLE/copper_fungcure_500_wp.jpg'),
    'daconil_720_sc': require('../assets/FUNGICIDE_SIMPLE/daconil_720_sc.png'),
    'emthane_m45_mancozeb_80_wp': require('../assets/FUNGICIDE_SIMPLE/emthane_m45_mancozeb_80_wp.jpg'),
    'equation_pro': require('../assets/FUNGICIDE_SIMPLE/equation_pro.png'),
    'fangocil': require('../assets/FUNGICIDE_SIMPLE/fangocil.jpg'),
    'fighter': require('../assets/FUNGICIDE_SIMPLE/fighter.png'),
    'folio_gold_537_sc': require('../assets/FUNGICIDE_SIMPLE/folio_gold_537_sc.png'),
    'fungo_force_72_wp': require('../assets/FUNGICIDE_SIMPLE/fungo_force_72_wp.png'),
    'goldazim_500_sc_alt': require('../assets/FUNGICIDE_SIMPLE/goldazim_500_sc_alt.png'),
    'goldazim_500_sc': require('../assets/FUNGICIDE_SIMPLE/goldazim_500_sc.png'),
    'harveseter': require('../assets/FUNGICIDE_SIMPLE/harveseter.jpg'),
    'harvestor_xl': require('../assets/FUNGICIDE_SIMPLE/harvestor_xl.jpg'),
    'indofil_m45': require('../assets/FUNGICIDE_SIMPLE/indofil_m45.jpg'),
    'milraz_wp_76': require('../assets/FUNGICIDE_SIMPLE/milraz_wp_76.png'),
    'mister_72_wp': require('../assets/FUNGICIDE_SIMPLE/mister_72_wp.jpg'),
    'mistress_72_wp': require('../assets/FUNGICIDE_SIMPLE/mistress_72_wp.jpg'),
    'nemasol_soil_fumigant': require('../assets/FUNGICIDE_SIMPLE/nemasol_soil_fumigant.jpg'),
    'nordox_super_75_wg': require('../assets/FUNGICIDE_SIMPLE/nordox_super_75_wg.jpg'),
    'orius_25_ew': require('../assets/FUNGICIDE_SIMPLE/orius_25_ew.jpg'),
    'oshothane_80_wp': require('../assets/FUNGICIDE_SIMPLE/oshothane_80_wp.jpg'),
    'pearl_500_sc': require('../assets/FUNGICIDE_SIMPLE/pearl_500_sc.jpg'),
    'proplant_722sl': require('../assets/FUNGICIDE_SIMPLE/proplant_722sl.png'),
    'ridomil_gold_mz_68wg': require('../assets/FUNGICIDE_SIMPLE/ridomil_gold_mz_68wg.png'),
    'sulcop_tomatoes': require('../assets/FUNGICIDE_SIMPLE/sulcop_tomatoes.jpeg'),
    'tata_master_72wp': require('../assets/FUNGICIDE_SIMPLE/tata_master_72wp.jpg'),
    'thiovit_jet': require('../assets/FUNGICIDE_SIMPLE/thiovit_jet.jpg'),
    'topilite_70_wp': require('../assets/FUNGICIDE_SIMPLE/topilite_70_wp.jpg'),
    'uthane_80_wp': require('../assets/FUNGICIDE_SIMPLE/uthane_80_wp.jpg'),
    'victory_72wp': require('../assets/FUNGICIDE_SIMPLE/victory_72wp.jpeg'),
    'winner_72_wp': require('../assets/FUNGICIDE_SIMPLE/winner_72_wp.jpg'),
    'z_force': require('../assets/FUNGICIDE_SIMPLE/z_force.jpg')
  };

  const fungicideProducts = [
    {
      id: 1,
      name: 'Alliete Flash WG 80',
      image: fungicideImages['alliete_flash_wg_80'],
      description: 'Professional fungicide for late blight, downy mildew, and phytophthora control.',
      price: 'UGX 45,000 (1kg) | UGX 25,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Syngenta',
      activeIngredient: 'Fosetyl-Al 80%',
      targetDiseases: ["Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Phytophthora root rot","Pythium damping-off","Phytophthora crown rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Systemic',
      crops: ['Potatoes', 'Tomatoes', 'Vegetables'],
      usageInstructions: 'Apply 2-3 kg per hectare for late blight, downy mildew, and phytophthora control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 45,000, 500g: UGX 25,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 2,
      name: 'Amistar 250 SC',
      image: fungicideImages['amistar_250_sc'],
      description: 'Professional fungicide for early blight, late blight, and powdery mildew control.',
      price: 'UGX 85,000 (1L) | UGX 45,000 (500ml)',
      category: 'Fungicide',
      manufacturer: 'Syngenta',
      activeIngredient: 'Azoxystrobin 250g/L',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Powdery mildew (Erysiphe spp.)","Rust diseases (Puccinia spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Stem canker"],
      applicationRate: '1-2 L per hectare',
      reEntryPeriod: '12 hours',
      preHarvestInterval: '3 days',
      whoClassification: 'Class II',
      modeOfAction: 'Systemic',
      crops: ['Tomatoes', 'Potatoes', 'Vegetables'],
      usageInstructions: 'Apply 1-2 L per hectare for early blight, late blight, and powdery mildew control. Re-entry period: 12 hours. Pre-harvest interval: 3 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1L: UGX 85,000, 500ml: UGX 45,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 3,
      name: 'Apron Star 42WS',
      image: fungicideImages['apron_star_42ws'],
      description: 'Professional seed treatment fungicide for seed and soil borne diseases.',
      price: 'UGX 120,000 (1L) | UGX 65,000 (500ml)',
      category: 'Fungicide',
      manufacturer: 'Syngenta',
      activeIngredient: 'Thiamethoxam + Metalaxyl-M + Fludioxonil',
      targetDiseases: ["Seed-borne diseases","Soil-borne diseases","Damping-off (Pythium spp.)","Root rot (Fusarium spp.)","Seedling blight","Wirestem"],
      applicationRate: '2-3 ml per kg seed',
      reEntryPeriod: '24 hours',
      preHarvestInterval: 'Not applicable',
      whoClassification: 'Class II',
      modeOfAction: 'Systemic seed treatment',
      crops: ['Maize', 'Beans', 'Vegetables'],
      usageInstructions: 'Apply 2-3 ml per kg seed for seed and soil borne diseases control. Re-entry period: 24 hours. Pre-harvest interval: Not applicable.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1L: UGX 120,000, 500ml: UGX 65,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 4,
      name: 'Ascopper 50 WP',
      image: fungicideImages['ascopper_50_wp'],
      description: 'Professional fungicide for bacterial blight and fungal diseases control.',
      price: 'UGX 35,000 (1kg) | UGX 20,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Ascot International',
      activeIngredient: 'Copper Oxychloride 50%',
      targetDiseases: ["Bacterial blight (Xanthomonas spp.)","Bacterial spot (Pseudomonas spp.)","Anthracnose (Colletotrichum spp.)","Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Coffee berry disease","Coffee leaf rust"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ['Coffee', 'Tomatoes', 'Vegetables'],
      usageInstructions: 'Apply 2-3 kg per hectare for bacterial blight and fungal diseases control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 35,000, 500g: UGX 20,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 5,
      name: 'Ascosulph 80 WDG',
      image: fungicideImages['ascosulph_80_wdg'],
      description: 'Professional fungicide for powdery mildew and rust diseases control.',
      price: 'UGX 30,000 (1kg) | UGX 18,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Ascot International',
      activeIngredient: 'Sulphur 80%',
      targetDiseases: ["Powdery mildew (Erysiphe spp.)","Rust diseases (Puccinia spp.)","Coffee leaf rust (Hemileia vastatrix)","Powdery scab","Sooty mold"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ['Coffee', 'Vegetables', 'Fruits'],
      usageInstructions: 'Apply 2-3 kg per hectare for powdery mildew and rust diseases control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 30,000, 500g: UGX 18,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 6,
      name: 'Ascozeb 80 WP',
      image: fungicideImages['ascozeb_80_wp'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 40,000 (1kg) | UGX 22,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Ascot International',
      activeIngredient: 'Mancozeb 80%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ['Tomatoes', 'Potatoes', 'Vegetables'],
      usageInstructions: 'Apply 2-3 kg per hectare for early blight, late blight, and downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 40,000, 500g: UGX 22,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 7,
      name: 'Bellis 38 WG',
      image: fungicideImages['bellis_38_wg'],
      description: 'Professional fungicide for botrytis, sclerotinia, and alternaria control.',
      price: 'UGX 95,000 (1kg) | UGX 50,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Bayer',
      activeIngredient: 'Pyraclostrobin + Boscalid',
      targetDiseases: ["Botrytis (Botrytis cinerea)","Sclerotinia (Sclerotinia sclerotiorum)","Alternaria (Alternaria spp.)","Gray mold","White mold","Fruit rot","Flower blight"],
      applicationRate: '1-2 kg per hectare',
      reEntryPeriod: '12 hours',
      preHarvestInterval: '3 days',
      whoClassification: 'Class II',
      modeOfAction: 'Systemic',
      crops: ['Vegetables', 'Flowers', 'Fruits'],
      usageInstructions: 'Apply 1-2 kg per hectare for botrytis, sclerotinia, and alternaria control. Re-entry period: 12 hours. Pre-harvest interval: 3 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 95,000, 500g: UGX 50,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 8,
      name: 'Bio Cure B',
      image: fungicideImages['bio_cure_b'],
      description: 'Biological fungicide for fungal and bacterial diseases control.',
      price: 'UGX 25,000 (1L) | UGX 15,000 (500ml)',
      category: 'Fungicide',
      manufacturer: 'Biotech International',
      activeIngredient: 'Bacillus subtilis',
      targetDiseases: ["Fungal diseases (general)","Bacterial diseases (general)","Root rot (Fusarium spp.)","Damping-off (Pythium spp.)","Seedling diseases","Soil-borne pathogens"],
      applicationRate: '2-3 ml per liter',
      reEntryPeriod: '0 hours',
      preHarvestInterval: '0 days',
      whoClassification: 'Class U',
      modeOfAction: 'Biological',
      crops: ['All crops'],
      usageInstructions: 'Apply 2-3 ml per liter for fungal and bacterial diseases control. Re-entry period: 0 hours. Pre-harvest interval: 0 days.',
      precautions: 'Minimal risk, organic product. WHO Classification: Class U.',
      packaging: '1L: UGX 25,000, 500ml: UGX 15,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 9,
      name: 'Control 70 WGD',
      image: fungicideImages['control_70_wgd'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 35,000 (1kg) | UGX 20,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Control Chemicals',
      activeIngredient: 'Mancozeb 70%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ['Tomatoes', 'Potatoes', 'Vegetables'],
      usageInstructions: 'Apply 2-3 kg per hectare for early blight, late blight, and downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 35,000, 500g: UGX 20,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 10,
      name: 'Copper Fungcure 500 WP',
      image: fungicideImages['copper_fungcure_500_wp'],
      description: 'Professional fungicide for bacterial blight and fungal diseases control.',
      price: 'UGX 38,000 (1kg) | UGX 22,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Fungicide Solutions',
      activeIngredient: 'Copper Oxychloride 500g/kg',
      targetDiseases: ["Bacterial blight (Xanthomonas spp.)","Bacterial spot (Pseudomonas spp.)","Anthracnose (Colletotrichum spp.)","Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Coffee berry disease","Coffee leaf rust"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ['Coffee', 'Tomatoes', 'Vegetables'],
      usageInstructions: 'Apply 2-3 kg per hectare for bacterial blight and fungal diseases control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 38,000, 500g: UGX 22,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 11,
      name: 'Daconil 720 SC',
      image: fungicideImages['daconil_720_sc'],
      description: 'Professional fungicide for early blight, late blight, and botrytis control.',
      price: 'UGX 75,000 (1L) | UGX 40,000 (500ml)',
      category: 'Fungicide',
      manufacturer: 'Syngenta',
      activeIngredient: 'Chlorothalonil 720g/L',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Botrytis (Botrytis cinerea)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot","Gray mold"],
      applicationRate: '1-2 L per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 1-2 L per hectare for Early blight, Late blight, Botrytis control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1L: UGX 75,000, 500ml: UGX 40,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 12,
      name: 'Emthane M45 Mancozeb 80 WP',
      image: fungicideImages['emthane_m45_mancozeb_80_wp'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 42,000 (1kg) | UGX 25,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Emthane Chemicals',
      activeIngredient: 'Mancozeb 80%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 42,000, 500g: UGX 25,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 13,
      name: 'Equation Pro',
      image: fungicideImages['equation_pro'],
      description: 'Professional fungicide for rust diseases and powdery mildew control.',
      price: 'UGX 65,000 (1L) | UGX 35,000 (500ml)',
      category: 'Fungicide',
      manufacturer: 'Equation Chemicals',
      activeIngredient: 'Propiconazole 250g/L',
      targetDiseases: ["Rust diseases (Puccinia spp.)","Powdery mildew (Erysiphe spp.)","Coffee leaf rust (Hemileia vastatrix)","Stem rust","Leaf rust","Crown rust"],
      applicationRate: '1-2 L per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Systemic',
      crops: ["Coffee","Vegetables","Fruits"],
      usageInstructions: 'Apply 1-2 L per hectare for Rust diseases, Powdery mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1L: UGX 65,000, 500ml: UGX 35,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 14,
      name: 'Fangocil',
      image: fungicideImages['fangocil'],
      description: 'Professional fungicide for late blight and downy mildew control.',
      price: 'UGX 55,000 (1kg) | UGX 30,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Fango Chemicals',
      activeIngredient: 'Fenamidone + Mancozeb',
      targetDiseases: ["Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Early blight (Alternaria solani)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Systemic + Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 55,000, 500g: UGX 30,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 15,
      name: 'Fighter',
      image: fungicideImages['fighter'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 38,000 (1kg) | UGX 22,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Fighter Chemicals',
      activeIngredient: 'Mancozeb 80%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 38,000, 500g: UGX 22,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 16,
      name: 'Folio Gold 537 SC',
      image: fungicideImages['folio_gold_537_sc'],
      description: 'Professional fungicide for early blight, late blight, and rust diseases control.',
      price: 'UGX 85,000 (1L) | UGX 45,000 (500ml)',
      category: 'Fungicide',
      manufacturer: 'Bayer',
      activeIngredient: 'Chlorothalonil + Propiconazole',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Rust diseases (Puccinia spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '1-2 L per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact + Systemic',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 1-2 L per hectare for Early blight, Late blight, Rust diseases control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1L: UGX 85,000, 500ml: UGX 45,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 17,
      name: 'Fungo Force 72 WP',
      image: fungicideImages['fungo_force_72_wp'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 40,000 (1kg) | UGX 23,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Fungo Chemicals',
      activeIngredient: 'Mancozeb 72%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 40,000, 500g: UGX 23,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 18,
      name: 'Goldazim 500 SC',
      image: fungicideImages['goldazim_500_sc'],
      description: 'Professional fungicide for fungal diseases and seed borne diseases control.',
      price: 'UGX 70,000 (1L) | UGX 38,000 (500ml)',
      category: 'Fungicide',
      manufacturer: 'Goldazim Chemicals',
      activeIngredient: 'Carbendazim 500g/L',
      targetDiseases: ["Fungal diseases (general)","Seed-borne diseases","Fusarium wilt (Fusarium spp.)","Verticillium wilt (Verticillium spp.)","Root rot (Fusarium spp.)","Stem canker"],
      applicationRate: '1-2 L per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Systemic',
      crops: ["All crops"],
      usageInstructions: 'Apply 1-2 L per hectare for Fungal diseases, Seed borne diseases control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1L: UGX 70,000, 500ml: UGX 38,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 19,
      name: 'Harveseter',
      image: fungicideImages['harveseter'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 42,000 (1kg) | UGX 25,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Harvest Chemicals',
      activeIngredient: 'Mancozeb 80%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 42,000, 500g: UGX 25,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 20,
      name: 'Harvestor XL',
      image: fungicideImages['harvestor_xl'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 45,000 (1kg) | UGX 28,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Harvest Chemicals',
      activeIngredient: 'Mancozeb 80%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 45,000, 500g: UGX 28,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 21,
      name: 'Indofil M45',
      image: fungicideImages['indofil_m45'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 38,000 (1kg) | UGX 22,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Indofil Chemicals',
      activeIngredient: 'Mancozeb 75%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 38,000, 500g: UGX 22,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 22,
      name: 'Milraz WP 76',
      image: fungicideImages['milraz_wp_76'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 40,000 (1kg) | UGX 23,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Milraz Chemicals',
      activeIngredient: 'Mancozeb 76%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 40,000, 500g: UGX 23,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 23,
      name: 'Mister 72 WP',
      image: fungicideImages['mister_72_wp'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 38,000 (1kg) | UGX 22,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Mister Chemicals',
      activeIngredient: 'Mancozeb 72%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 38,000, 500g: UGX 22,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 24,
      name: 'Mistress 72 WP',
      image: fungicideImages['mistress_72_wp'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 40,000 (1kg) | UGX 23,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Mistress Chemicals',
      activeIngredient: 'Mancozeb 72%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 40,000, 500g: UGX 23,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 25,
      name: 'Nemasol Soil Fumigant',
      image: fungicideImages['nemasol_soil_fumigant'],
      description: 'Professional soil fumigant for soil borne diseases and nematodes control.',
      price: 'UGX 180,000 (25kg) | UGX 75,000 (10kg)',
      category: 'Fungicide',
      manufacturer: 'Nemasol Chemicals',
      activeIngredient: 'Dazomet 98%',
      targetDiseases: ["Soil-borne diseases","Nematodes (Meloidogyne spp.)","Root-knot nematodes","Cyst nematodes","Damping-off (Pythium spp.)","Fusarium wilt (Fusarium spp.)","Verticillium wilt (Verticillium spp.)"],
      applicationRate: '50-100 kg per hectare',
      reEntryPeriod: '48 hours',
      preHarvestInterval: 'Not applicable',
      whoClassification: 'Class I',
      modeOfAction: 'Soil fumigant',
      crops: ["All crops"],
      usageInstructions: 'Apply 50-100 kg per hectare for Soil borne diseases, Nematodes control. Re-entry period: 48 hours. Pre-harvest interval: Not applicable.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class I.',
      packaging: '25kg: UGX 180,000, 10kg: UGX 75,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 26,
      name: 'Nordox Super 75 WG',
      image: fungicideImages['nordox_super_75_wg'],
      description: 'Professional fungicide for bacterial blight and fungal diseases control.',
      price: 'UGX 50,000 (1kg) | UGX 28,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Nordox Chemicals',
      activeIngredient: 'Copper Oxide 75%',
      targetDiseases: ["Bacterial blight (Xanthomonas spp.)","Bacterial spot (Pseudomonas spp.)","Anthracnose (Colletotrichum spp.)","Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Coffee berry disease","Coffee leaf rust"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Coffee","Tomatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Bacterial blight, Fungal diseases control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 50,000, 500g: UGX 28,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 27,
      name: 'Orius 25 EW',
      image: fungicideImages['orius_25_ew'],
      description: 'Professional fungicide for rust diseases and powdery mildew control.',
      price: 'UGX 70,000 (1L) | UGX 38,000 (500ml)',
      category: 'Fungicide',
      manufacturer: 'Orius Chemicals',
      activeIngredient: 'Tebuconazole 250g/L',
      targetDiseases: ["Rust diseases (Puccinia spp.)","Powdery mildew (Erysiphe spp.)","Coffee leaf rust (Hemileia vastatrix)","Stem rust","Leaf rust","Crown rust"],
      applicationRate: '1-2 L per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Systemic',
      crops: ["Coffee","Vegetables","Fruits"],
      usageInstructions: 'Apply 1-2 L per hectare for Rust diseases, Powdery mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1L: UGX 70,000, 500ml: UGX 38,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 28,
      name: 'Oshothane 80 WP',
      image: fungicideImages['oshothane_80_wp'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 42,000 (1kg) | UGX 25,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Oshothane Chemicals',
      activeIngredient: 'Mancozeb 80%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 42,000, 500g: UGX 25,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 29,
      name: 'Pearl 500 SC',
      image: fungicideImages['pearl_500_sc'],
      description: 'Professional fungicide for fungal diseases and seed borne diseases control.',
      price: 'UGX 75,000 (1L) | UGX 40,000 (500ml)',
      category: 'Fungicide',
      manufacturer: 'Pearl Chemicals',
      activeIngredient: 'Carbendazim 500g/L',
      targetDiseases: ["Fungal diseases (general)","Seed-borne diseases","Fusarium wilt (Fusarium spp.)","Verticillium wilt (Verticillium spp.)","Root rot (Fusarium spp.)","Stem canker"],
      applicationRate: '1-2 L per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Systemic',
      crops: ["All crops"],
      usageInstructions: 'Apply 1-2 L per hectare for Fungal diseases, Seed borne diseases control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1L: UGX 75,000, 500ml: UGX 40,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 30,
      name: 'Proplant 722SL',
      image: fungicideImages['proplant_722sl'],
      description: 'Professional fungicide for rust diseases and powdery mildew control.',
      price: 'UGX 65,000 (1L) | UGX 35,000 (500ml)',
      category: 'Fungicide',
      manufacturer: 'Proplant Chemicals',
      activeIngredient: 'Propiconazole 250g/L',
      targetDiseases: ["Rust diseases (Puccinia spp.)","Powdery mildew (Erysiphe spp.)","Coffee leaf rust (Hemileia vastatrix)","Stem rust","Leaf rust","Crown rust"],
      applicationRate: '1-2 L per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Systemic',
      crops: ["Coffee","Vegetables","Fruits"],
      usageInstructions: 'Apply 1-2 L per hectare for Rust diseases, Powdery mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1L: UGX 65,000, 500ml: UGX 35,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 31,
      name: 'Ridomil Gold MZ 68WG',
      image: fungicideImages['ridomil_gold_mz_68wg'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 85,800 (1kg) | UGX 23,900 (250g)',
      category: 'Fungicide',
      manufacturer: 'Syngenta',
      activeIngredient: 'Metalaxyl-M 40g/Kg + Mancozeb 640g/Kg',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Phytophthora root rot","Pythium damping-off","Seedling blight"],
      applicationRate: '2.5 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Systemic + Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2.5 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 85,800, 250g: UGX 23,900',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 32,
      name: 'Sulcop Tomatoes',
      image: fungicideImages['sulcop_tomatoes'],
      description: 'Professional fungicide for bacterial blight and fungal diseases control.',
      price: 'UGX 35,000 (1kg) | UGX 20,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Sulcop Chemicals',
      activeIngredient: 'Copper Oxychloride 50%',
      targetDiseases: ["Bacterial blight (Xanthomonas spp.)","Bacterial spot (Pseudomonas spp.)","Anthracnose (Colletotrichum spp.)","Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Tomato bacterial canker"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Bacterial blight, Fungal diseases control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 35,000, 500g: UGX 20,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 33,
      name: 'Tata Master 72WP',
      image: fungicideImages['tata_master_72wp'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 40,000 (1kg) | UGX 23,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Tata Chemicals',
      activeIngredient: 'Mancozeb 72%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 40,000, 500g: UGX 23,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 34,
      name: 'Thiovit Jet',
      image: fungicideImages['thiovit_jet'],
      description: 'Professional fungicide for powdery mildew and rust diseases control.',
      price: 'UGX 30,000 (1kg) | UGX 18,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Thiovit Chemicals',
      activeIngredient: 'Sulphur 80%',
      targetDiseases: ["Powdery mildew (Erysiphe spp.)","Rust diseases (Puccinia spp.)","Coffee leaf rust (Hemileia vastatrix)","Powdery scab","Sooty mold","Mite control"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Coffee","Vegetables","Fruits"],
      usageInstructions: 'Apply 2-3 kg per hectare for Powdery mildew, Rust diseases control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 30,000, 500g: UGX 18,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 35,
      name: 'Topilite 70 WP',
      image: fungicideImages['topilite_70_wp'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 38,000 (1kg) | UGX 22,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Topilite Chemicals',
      activeIngredient: 'Mancozeb 70%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 38,000, 500g: UGX 22,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 36,
      name: 'Uthane 80 WP',
      image: fungicideImages['uthane_80_wp'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 42,000 (1kg) | UGX 25,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Uthane Chemicals',
      activeIngredient: 'Mancozeb 80%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 42,000, 500g: UGX 25,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 37,
      name: 'Victory 72WP',
      image: fungicideImages['victory_72wp'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 40,000 (1kg) | UGX 23,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Victory Chemicals',
      activeIngredient: 'Mancozeb 72%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 40,000, 500g: UGX 23,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 38,
      name: 'Winner 72 WP',
      image: fungicideImages['winner_72_wp'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 42,000 (1kg) | UGX 25,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Winner Chemicals',
      activeIngredient: 'Mancozeb 72%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 42,000, 500g: UGX 25,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    },
    {
      id: 39,
      name: 'Z-Force',
      image: fungicideImages['z_force'],
      description: 'Professional fungicide for early blight, late blight, and downy mildew control.',
      price: 'UGX 45,000 (1kg) | UGX 28,000 (500g)',
      category: 'Fungicide',
      manufacturer: 'Z-Force Chemicals',
      activeIngredient: 'Mancozeb 80%',
      targetDiseases: ["Early blight (Alternaria solani)","Late blight (Phytophthora infestans)","Downy mildew (Peronospora spp.)","Anthracnose (Colletotrichum spp.)","Leaf spot diseases","Fruit rot"],
      applicationRate: '2-3 kg per hectare',
      reEntryPeriod: '24 hours',
      preHarvestInterval: '7 days',
      whoClassification: 'Class II',
      modeOfAction: 'Contact',
      crops: ["Tomatoes","Potatoes","Vegetables"],
      usageInstructions: 'Apply 2-3 kg per hectare for Early blight, Late blight, Downy mildew control. Re-entry period: 24 hours. Pre-harvest interval: 7 days.',
      precautions: 'Wear protective clothing during application. WHO Classification: Class II.',
      packaging: '1kg: UGX 45,000, 500g: UGX 28,000',
      benefits: ['Effective disease control', 'Long-lasting protection', 'Safe for crops', 'Easy to apply', 'Professional grade']
    }
  ];

  const renderProduct = (item) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => setSelectedProduct(item)}
    >
      <View style={styles.imageContainer}>
        {imageLoadingStates[item.id] && (
          <ActivityIndicator size="small" color="#4CAF50" style={styles.loadingIndicator} />
        )}
        <Image
          source={item.image}
          style={styles.productImage}
          onLoadStart={() => handleImageLoadStart(item.id)}
          onLoad={() => handleImageLoad(item.id)}
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <View style={styles.productDetails}>
          <Text style={styles.productDetail}>Manufacturer: {item.manufacturer}</Text>
          <Text style={styles.productDetail}>Active Ingredient: {item.activeIngredient}</Text>
          <Text style={styles.productDetail}>Target Diseases: {item.targetDiseases.join(', ')}</Text>
        </View>
        <TouchableOpacity
          style={styles.pricingButton}
          onPress={() => handlePricingPress(item)}
        >
          <MaterialIcons name="attach-money" size={16} color="#fff" />
          <Text style={styles.pricingButtonText}>View Pricing</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (selectedProduct) {
    return (
      <FungicideDetailScreen
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fungicides</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.productsGrid}>
          {fungicideProducts.map(renderProduct)}
        </View>
      </ScrollView>

      {/* Pricing Widget */}
      {selectedProductForPricing && (
        <SimplePricingWidget
          visible={pricingWidgetVisible}
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#4CAF50',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 120,
    backgroundColor: '#f8f8f8',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -10,
    marginLeft: -10,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  productDetails: {
    marginBottom: 12,
  },
  productDetail: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  pricingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  pricingButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default FungicidesScreen;
