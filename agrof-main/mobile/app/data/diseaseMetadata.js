/**
 * Disease Metadata Database
 * 
 * This file contains detailed information for all 20 disease classes
 * trained in the TFLite model. It enriches the basic TFLite predictions
 * with Gemini-quality information (symptoms, treatments, prevention).
 * 
 * Structure matches the Gemini AI output format for consistency.
 */

export const DISEASE_METADATA = {
  // ========================================
  // BEANS (3 classes)
  // ========================================
  
  "Beans_angular_leaf_spot": {
    crop_type: "Beans",
    plant_family: "Fabaceae (Leguminosae)",
    disease_type: "Angular Leaf Spot",
    health_status: "diseased",
    severity_level: "medium",
    symptoms: [
      "Angular brown spots on leaves with yellow halos",
      "Water-soaked lesions that turn brown",
      "Leaf tissue death in affected areas",
      "Spots may merge causing large necrotic areas",
      "Reduced pod quality and yield"
    ],
    affected_parts: ["leaves", "pods", "stems"],
    recommendations: [
      "Apply copper-based bactericide (e.g., copper hydroxide)",
      "Remove and destroy infected plant debris immediately",
      "Avoid working in fields when plants are wet",
      "Use disease-free certified seeds for next planting",
      "Implement crop rotation with non-legume crops for 2-3 years",
      "Space plants properly (30-45cm) for air circulation"
    ],
    prevention: [
      "Plant resistant bean varieties if available locally",
      "Maintain wide plant spacing (30-45cm between plants)",
      "Avoid overhead irrigation - use drip irrigation",
      "Practice strict crop rotation every 2-3 years",
      "Keep fields clean of plant debris between seasons",
      "Avoid touching plants when leaves are wet"
    ],
    growth_stage_default: "vegetative"
  },

  "Beans_bean_rust": {
    crop_type: "Beans",
    plant_family: "Fabaceae (Leguminosae)",
    disease_type: "Bean Rust",
    health_status: "diseased",
    severity_level: "high",
    symptoms: [
      "Small white spots on leaf undersides (early stage)",
      "Orange to reddish-brown pustules on leaves",
      "Powdery rust spores visible on leaf surfaces",
      "Premature leaf yellowing and drop",
      "Reduced photosynthesis and plant vigor",
      "Severe infections can kill plants"
    ],
    affected_parts: ["leaves", "stems", "pods"],
    recommendations: [
      "Apply sulfur-based fungicide or mancozeb immediately",
      "Remove and burn severely infected plants",
      "Improve air circulation by pruning dense foliage",
      "Reduce leaf wetness - avoid overhead watering",
      "Monitor neighboring fields for rust outbreaks",
      "Harvest unaffected pods early if disease is severe"
    ],
    prevention: [
      "Plant rust-resistant bean varieties",
      "Apply preventive fungicide during rainy season",
      "Space plants widely (30-45cm) for good airflow",
      "Avoid planting beans in the same field consecutively",
      "Remove volunteer bean plants that harbor rust",
      "Plant early in season to avoid peak rust periods"
    ],
    growth_stage_default: "vegetative"
  },

  "Beans_healthy": {
    crop_type: "Beans",
    plant_family: "Fabaceae (Leguminosae)",
    disease_type: "None - Healthy Plant",
    health_status: "healthy",
    severity_level: "none",
    symptoms: [
      "Uniform green leaves without spots or discoloration",
      "Strong, upright growth habit",
      "No visible signs of disease or pest damage",
      "Healthy pod development",
      "Normal plant vigor and growth"
    ],
    affected_parts: [],
    recommendations: [
      "Continue current good agricultural practices",
      "Monitor plants weekly for early disease signs",
      "Maintain proper watering schedule",
      "Apply balanced fertilizer as needed",
      "Keep field clean of weeds and debris",
      "Scout for pests regularly"
    ],
    prevention: [
      "Continue wide plant spacing",
      "Maintain crop rotation schedule",
      "Use certified disease-free seeds",
      "Practice integrated pest management",
      "Keep farming tools clean and sanitized",
      "Monitor weather for disease-favorable conditions"
    ],
    growth_stage_default: "vegetative"
  },

  // ========================================
  // COFFEE (2 classes)
  // ========================================

  "Coffee_rust_xml_image": {
    crop_type: "Coffee",
    plant_family: "Rubiaceae",
    disease_type: "Coffee Leaf Rust (Roya)",
    health_status: "diseased",
    severity_level: "high",
    symptoms: [
      "Yellow-orange powdery spots on leaf undersides",
      "Pale yellow spots visible on upper leaf surface",
      "Premature leaf drop (defoliation)",
      "Reduced photosynthesis and berry production",
      "Weakened plant vigor over time",
      "Orange rust spores transfer easily by touch"
    ],
    affected_parts: ["leaves"],
    recommendations: [
      "Apply copper-based fungicide (copper hydroxide or oxychloride)",
      "Use systemic fungicides like triadimefon or propiconazole",
      "Remove and destroy fallen infected leaves",
      "Improve air circulation through pruning",
      "Reduce shade to decrease humidity around plants",
      "Monitor plants every 1-2 weeks during rainy season",
      "Consider replanting with rust-resistant varieties"
    ],
    prevention: [
      "Plant rust-resistant coffee varieties (Ruiru 11, Batian in East Africa)",
      "Maintain proper plant spacing (2-3 meters)",
      "Apply preventive fungicides at start of rainy season",
      "Prune regularly for good air circulation and sunlight penetration",
      "Monitor neighboring coffee farms for rust outbreaks",
      "Fertilize properly to maintain plant health and resistance",
      "Adjust shade levels (30-40% shade optimal)"
    ],
    growth_stage_default: "mature"
  },

  "Coffee_miner_img_xml": {
    crop_type: "Coffee",
    plant_family: "Rubiaceae",
    disease_type: "Coffee Leaf Miner Damage",
    health_status: "diseased",
    severity_level: "medium",
    symptoms: [
      "Serpentine (winding) mines or tunnels in leaves",
      "Blotch-like mines on leaf surface",
      "Brown dried areas where larvae fed",
      "Premature leaf drop in severe cases",
      "Reduced photosynthesis",
      "Tiny exit holes where adult moths emerged"
    ],
    affected_parts: ["leaves"],
    recommendations: [
      "Apply appropriate insecticide (e.g., imidacloprid, thiamethoxam)",
      "Remove and destroy heavily mined leaves",
      "Monitor adult moth populations with pheromone traps",
      "Time sprays during adult moth emergence (early morning or evening)",
      "Encourage natural predators (wasps, spiders)",
      "Improve plant nutrition to enhance tolerance"
    ],
    prevention: [
      "Monitor regularly for early detection (check new leaves)",
      "Maintain healthy plants with proper fertilization",
      "Prune to improve air circulation and sunlight",
      "Use pheromone traps to monitor and reduce populations",
      "Avoid excessive nitrogen fertilizer (attracts miners)",
      "Preserve natural enemies by reducing broad-spectrum pesticides",
      "Remove alternate host plants near coffee"
    ],
    growth_stage_default: "mature"
  },

  // ========================================
  // PEPPER (2 classes)
  // ========================================

  "Pepper_bell_Bacterial_spot": {
    crop_type: "Pepper (Bell Pepper)",
    plant_family: "Solanaceae",
    disease_type: "Bacterial Spot",
    health_status: "diseased",
    severity_level: "medium",
    symptoms: [
      "Small dark brown spots with yellow halos on leaves",
      "Raised corky spots on fruits",
      "Leaf spots may merge causing large dead areas",
      "Defoliation in severe infections",
      "Reduced fruit quality and marketability",
      "Water-soaked appearance in early stages"
    ],
    affected_parts: ["leaves", "stems", "fruits"],
    recommendations: [
      "Apply copper-based bactericide (copper hydroxide)",
      "Remove infected plant debris from field",
      "Avoid overhead irrigation to reduce leaf wetness",
      "Do not work in fields when plants are wet",
      "Use disease-free transplants",
      "Rotate with non-Solanaceae crops for 2-3 years"
    ],
    prevention: [
      "Use certified disease-free seeds and transplants",
      "Plant resistant pepper varieties if available",
      "Space plants properly (45-60cm) for air circulation",
      "Use drip irrigation instead of overhead sprinklers",
      "Practice 2-3 year crop rotation",
      "Disinfect tools and equipment between fields",
      "Avoid working with wet plants"
    ],
    growth_stage_default: "vegetative"
  },

  "Pepper_bell_healthy": {
    crop_type: "Pepper (Bell Pepper)",
    plant_family: "Solanaceae",
    disease_type: "None - Healthy Plant",
    health_status: "healthy",
    severity_level: "none",
    symptoms: [
      "Dark green, uniform leaves",
      "No spots, discoloration, or lesions",
      "Strong stem and good plant structure",
      "Normal fruit development",
      "No signs of pest or disease damage"
    ],
    affected_parts: [],
    recommendations: [
      "Maintain current good agricultural practices",
      "Monitor plants regularly for disease signs",
      "Ensure proper watering and fertilization",
      "Continue weed and pest control measures",
      "Scout for early signs of bacterial spot or other diseases",
      "Keep field clean and well-maintained"
    ],
    prevention: [
      "Continue proper plant spacing and air circulation",
      "Use drip irrigation",
      "Practice crop rotation",
      "Keep tools and equipment sanitized",
      "Use disease-free seeds and transplants",
      "Monitor for pests and diseases weekly"
    ],
    growth_stage_default: "vegetative"
  },

  // ========================================
  // POTATO (3 classes)
  // ========================================

  "Potato_Early_blight": {
    crop_type: "Potato",
    plant_family: "Solanaceae",
    disease_type: "Early Blight",
    health_status: "diseased",
    severity_level: "medium",
    symptoms: [
      "Dark brown spots with concentric rings (target pattern)",
      "Spots appear first on older, lower leaves",
      "Yellow halo around spots",
      "Leaves turn yellow and drop prematurely",
      "Dark lesions on stems",
      "Tuber infection possible through wounds"
    ],
    affected_parts: ["leaves", "stems", "tubers"],
    recommendations: [
      "Apply fungicide (chlorothalonil, mancozeb, or azoxystrobin)",
      "Remove and destroy infected lower leaves",
      "Improve air circulation by hilling soil around plants",
      "Avoid overhead irrigation - use drip or furrow",
      "Apply fungicide every 7-10 days during wet weather",
      "Harvest tubers carefully to avoid wounds"
    ],
    prevention: [
      "Plant certified disease-free seed potatoes",
      "Use resistant varieties if available",
      "Space rows widely (75-90cm) for air circulation",
      "Apply preventive fungicide from flowering stage",
      "Remove volunteer potato plants and weeds",
      "Practice 3-4 year crop rotation",
      "Avoid excessive nitrogen fertilizer"
    ],
    growth_stage_default: "vegetative"
  },

  "Potato_Late_blight": {
    crop_type: "Potato",
    plant_family: "Solanaceae",
    disease_type: "Late Blight",
    health_status: "diseased",
    severity_level: "high",
    symptoms: [
      "Water-soaked dark brown lesions on leaves",
      "White fuzzy mold on leaf undersides in humid conditions",
      "Rapid spreading - can kill plants in days",
      "Dark brown streaks on stems",
      "Tuber rot with purple-brown discoloration",
      "Foul odor from rotting tubers"
    ],
    affected_parts: ["leaves", "stems", "tubers"],
    recommendations: [
      "Apply systemic fungicide immediately (metalaxyl, cymoxanil)",
      "Remove and destroy all infected plants completely",
      "Do not compost infected material - burn or bury deep",
      "Harvest healthy tubers immediately before infection spreads",
      "Improve field drainage",
      "Spray every 5-7 days during favorable disease weather",
      "Alert neighboring farmers of outbreak"
    ],
    prevention: [
      "Plant certified late blight-free seed potatoes",
      "Use resistant varieties (check local agricultural office)",
      "Hill soil high around plants for drainage",
      "Apply preventive fungicide before disease appears",
      "Monitor weather - spray before rain if blight is in area",
      "Remove volunteer potatoes and tomatoes (alternate hosts)",
      "Space plants for good air circulation (30-40cm)",
      "Avoid overhead irrigation especially in evening"
    ],
    growth_stage_default: "vegetative"
  },

  "Potato_healthy": {
    crop_type: "Potato",
    plant_family: "Solanaceae",
    disease_type: "None - Healthy Plant",
    health_status: "healthy",
    severity_level: "none",
    symptoms: [
      "Vigorous green foliage",
      "No leaf spots or discoloration",
      "Strong stems and healthy growth",
      "Normal flower and tuber development",
      "No signs of disease or severe pest damage"
    ],
    affected_parts: [],
    recommendations: [
      "Continue current management practices",
      "Monitor closely during rainy season for blight",
      "Maintain proper hilling and drainage",
      "Apply balanced fertilizer as needed",
      "Scout weekly for disease and pest signs",
      "Prepare for preventive fungicide if weather favors disease"
    ],
    prevention: [
      "Continue using certified seed potatoes",
      "Maintain wide row spacing",
      "Practice crop rotation (3-4 years)",
      "Keep fields free of volunteer potatoes",
      "Monitor weather for disease-favorable conditions",
      "Have fungicides ready for quick action"
    ],
    growth_stage_default: "vegetative"
  },

  // ========================================
  // TOMATO (10 classes)
  // ========================================

  "Tomato_Bacterial_spot": {
    crop_type: "Tomato",
    plant_family: "Solanaceae",
    disease_type: "Bacterial Spot",
    health_status: "diseased",
    severity_level: "medium",
    symptoms: [
      "Small dark spots with yellow halos on leaves",
      "Greasy-looking spots on fruits",
      "Raised, corky lesions on older fruit spots",
      "Defoliation in severe cases",
      "Reduced fruit quality and yield",
      "Spots on stems and leaf petioles"
    ],
    affected_parts: ["leaves", "stems", "fruits"],
    recommendations: [
      "Apply copper-based bactericide + mancozeb",
      "Remove heavily infected plants from field",
      "Avoid overhead irrigation",
      "Do not work in wet fields",
      "Use disease-free transplants only",
      "Disinfect tools between plants (10% bleach solution)"
    ],
    prevention: [
      "Use certified disease-free seeds and transplants",
      "Plant resistant varieties (check seed catalogs)",
      "Space plants properly (45-60cm)",
      "Use drip irrigation or furrow irrigation",
      "Rotate with non-Solanaceae crops (3 years)",
      "Mulch to prevent soil splash",
      "Sanitize stakes and trellises between seasons"
    ],
    growth_stage_default: "vegetative"
  },

  "Tomato_Early_blight": {
    crop_type: "Tomato",
    plant_family: "Solanaceae",
    disease_type: "Early Blight",
    health_status: "diseased",
    severity_level: "medium",
    symptoms: [
      "Brown spots with concentric rings (target pattern)",
      "Spots first appear on older lower leaves",
      "Yellow halo around lesions",
      "Progressive upward spread on plant",
      "Stem lesions with dark brown rings",
      "Fruit infection near stem end (target spots on fruit)"
    ],
    affected_parts: ["leaves", "stems", "fruits"],
    recommendations: [
      "Apply fungicide (chlorothalonil, mancozeb, or azoxystrobin)",
      "Remove infected lower leaves and destroy",
      "Stake or cage plants to improve air circulation",
      "Mulch around plants to prevent soil splash",
      "Apply fungicide every 7-10 days during wet periods",
      "Water at base of plants, not overhead"
    ],
    prevention: [
      "Use certified disease-free transplants",
      "Space plants adequately (45-60cm)",
      "Stake or trellis tomatoes for airflow",
      "Apply preventive fungicide starting at first flowers",
      "Mulch with straw or plastic to prevent soil splash",
      "Rotate crops (3 years out of Solanaceae)",
      "Remove plant debris after harvest"
    ],
    growth_stage_default: "vegetative"
  },

  "Tomato_Late_blight": {
    crop_type: "Tomato",
    plant_family: "Solanaceae",
    disease_type: "Late Blight",
    health_status: "diseased",
    severity_level: "high",
    symptoms: [
      "Large dark brown water-soaked lesions on leaves",
      "White mold on leaf undersides in moist conditions",
      "Rapid plant death (can kill in 3-7 days)",
      "Dark brown streaks on stems",
      "Firm brown spots on green and ripe fruits",
      "Entire plants can collapse quickly"
    ],
    affected_parts: ["leaves", "stems", "fruits"],
    recommendations: [
      "Apply systemic fungicide immediately (metalaxyl + mancozeb)",
      "Remove and destroy all infected plants completely",
      "Burn or bury infected material (do not compost)",
      "Harvest unaffected fruits immediately",
      "Spray every 5-7 days if disease persists in area",
      "Alert neighbors to prevent spread",
      "Improve drainage in field"
    ],
    prevention: [
      "Plant resistant varieties when available",
      "Space plants for excellent air circulation",
      "Use drip irrigation only",
      "Apply preventive fungicide before rainy season",
      "Monitor weather - spray before rain if blight nearby",
      "Remove volunteer tomatoes and potatoes",
      "Avoid planting near potato fields",
      "Do not save seeds from infected fields"
    ],
    growth_stage_default: "fruiting"
  },

  "Tomato_Leaf_Mold": {
    crop_type: "Tomato",
    plant_family: "Solanaceae",
    disease_type: "Leaf Mold",
    health_status: "diseased",
    severity_level: "medium",
    symptoms: [
      "Yellow spots on upper leaf surfaces",
      "Olive-green to brown fuzzy mold on leaf undersides",
      "Older leaves affected first",
      "Leaves curl, turn brown, and drop",
      "Reduced photosynthesis and yield",
      "More severe in humid, enclosed conditions (greenhouses)"
    ],
    affected_parts: ["leaves"],
    recommendations: [
      "Improve air circulation (prune lower leaves, space plants)",
      "Reduce humidity (improve ventilation in greenhouse)",
      "Apply fungicide (chlorothalonil or mancozeb)",
      "Remove and destroy infected leaves",
      "Water in morning to allow leaves to dry",
      "Avoid overhead watering"
    ],
    prevention: [
      "Plant resistant varieties (check 'Cf' resistance genes)",
      "Provide excellent air circulation and ventilation",
      "Space plants widely in field (60cm or more)",
      "Use drip irrigation",
      "Prune lower leaves for airflow",
      "In greenhouses: use fans, open vents, control humidity",
      "Disinfect greenhouse structures between crops"
    ],
    growth_stage_default: "vegetative"
  },

  "Tomato_Septoria_leaf_spot": {
    crop_type: "Tomato",
    plant_family: "Solanaceae",
    disease_type: "Septoria Leaf Spot",
    health_status: "diseased",
    severity_level: "medium",
    symptoms: [
      "Small circular spots with dark brown margins",
      "Gray-white centers with tiny black dots (fungal structures)",
      "Spots first appear on lower older leaves",
      "Progressive upward spread",
      "Severe defoliation possible",
      "Does not typically affect fruits"
    ],
    affected_parts: ["leaves"],
    recommendations: [
      "Apply fungicide (chlorothalonil, mancozeb, or copper)",
      "Remove and destroy lower infected leaves",
      "Mulch around plants to prevent soil splash",
      "Stake or cage plants for air circulation",
      "Water at soil level, avoid wetting foliage",
      "Apply fungicide every 7-10 days in wet weather"
    ],
    prevention: [
      "Use certified disease-free transplants",
      "Space plants adequately (50-60cm)",
      "Mulch to prevent soil splash onto leaves",
      "Stake or trellis plants",
      "Rotate crops (3 years)",
      "Remove all plant debris after harvest",
      "Apply preventive fungicide if disease occurred previously"
    ],
    growth_stage_default: "vegetative"
  },

  "Tomato_Spider_mites_Two_spotted_spider_mite": {
    crop_type: "Tomato",
    plant_family: "Solanaceae",
    disease_type: "Spider Mite Infestation",
    health_status: "diseased",
    severity_level: "medium",
    symptoms: [
      "Yellow stippling or speckling on leaves",
      "Fine webbing on leaf undersides and between leaves",
      "Leaves turn bronze or gray in severe infestations",
      "Premature leaf drop",
      "Stunted plant growth",
      "Reduced fruit production",
      "Tiny spider-like mites visible with magnifying glass"
    ],
    affected_parts: ["leaves", "stems"],
    recommendations: [
      "Spray with miticide (abamectin, bifenazate) or insecticidal soap",
      "Apply strong water spray to dislodge mites",
      "Release predatory mites (Phytoseiulus persimilis) if available",
      "Remove and destroy heavily infested leaves",
      "Treat all plants in area simultaneously",
      "Repeat treatments every 5-7 days (target eggs)",
      "Avoid dusty conditions - irrigate pathways"
    ],
    prevention: [
      "Monitor plants weekly, especially in hot dry weather",
      "Maintain adequate soil moisture (mites prefer dry conditions)",
      "Avoid excessive nitrogen fertilizer",
      "Preserve natural predators (ladybugs, lacewings, predatory mites)",
      "Remove weeds that harbor mites",
      "Use reflective mulches to deter mites",
      "Avoid broad-spectrum insecticides that kill predators"
    ],
    growth_stage_default: "vegetative"
  },

  "Tomato_Target_Spot": {
    crop_type: "Tomato",
    plant_family: "Solanaceae",
    disease_type: "Target Spot",
    health_status: "diseased",
    severity_level: "medium",
    symptoms: [
      "Brown spots with concentric rings (target pattern)",
      "Spots have gray-brown centers",
      "Affects leaves, stems, and fruits",
      "Leaf spots can merge causing large dead areas",
      "Defoliation in severe cases",
      "Fruit lesions are sunken and dark"
    ],
    affected_parts: ["leaves", "stems", "fruits"],
    recommendations: [
      "Apply fungicide (chlorothalonil, mancozeb, or azoxystrobin)",
      "Remove infected leaves from lower plant parts",
      "Improve air circulation through staking/pruning",
      "Mulch to prevent soil splash",
      "Water at base of plants only",
      "Apply fungicide every 7-10 days during wet periods"
    ],
    prevention: [
      "Use disease-free transplants",
      "Space plants properly (50-60cm)",
      "Stake or cage plants for airflow",
      "Apply mulch to prevent soil splash",
      "Use drip irrigation",
      "Rotate crops (3 years)",
      "Remove all plant debris after harvest",
      "Apply preventive fungicide in humid conditions"
    ],
    growth_stage_default: "vegetative"
  },

  "Tomato_Tomato_YellowLeaf_Curl_Virus": {
    crop_type: "Tomato",
    plant_family: "Solanaceae",
    disease_type: "Tomato Yellow Leaf Curl Virus (TYLCV)",
    health_status: "diseased",
    severity_level: "high",
    symptoms: [
      "Severe upward leaf curling and cupping",
      "Yellowing of leaf margins",
      "Stunted plant growth",
      "Reduced fruit set or no fruits",
      "Small, misshapen fruits if produced",
      "Bushy appearance due to shortened internodes",
      "Transmitted by whiteflies"
    ],
    affected_parts: ["leaves", "whole plant"],
    recommendations: [
      "Remove and destroy infected plants immediately",
      "Control whitefly vectors with insecticides (imidacloprid, thiamethoxam)",
      "Use yellow sticky traps to monitor and reduce whiteflies",
      "Cover young plants with insect-proof netting",
      "Plant early in season to avoid peak whitefly populations",
      "There is NO cure - prevention and vector control are essential"
    ],
    prevention: [
      "Plant virus-resistant varieties (TYLCV-resistant cultivars)",
      "Use virus-free certified transplants",
      "Control whiteflies from the start (spray seedlings)",
      "Use reflective silver mulches to repel whiteflies",
      "Remove weeds that harbor whiteflies and viruses",
      "Install yellow sticky traps early",
      "Plant away from previous tomato fields",
      "Use insect-proof netting on nursery beds"
    ],
    growth_stage_default: "vegetative"
  },

  "Tomato_Tomato_mosaic_virus": {
    crop_type: "Tomato",
    plant_family: "Solanaceae",
    disease_type: "Tomato Mosaic Virus (ToMV)",
    health_status: "diseased",
    severity_level: "high",
    symptoms: [
      "Mosaic pattern of light and dark green on leaves",
      "Leaf distortion and malformation",
      "Stunted plant growth",
      "Reduced fruit set",
      "Mottled, uneven ripening of fruits",
      "Internal browning of fruits",
      "Spread by contact, tools, and hands"
    ],
    affected_parts: ["leaves", "fruits", "whole plant"],
    recommendations: [
      "Remove and destroy infected plants immediately",
      "Disinfect all tools and hands with 10% bleach solution or milk",
      "Do not touch healthy plants after touching diseased ones",
      "Control aphids and other potential vectors",
      "Do not smoke near tomatoes (tobacco mosaic virus spreads to tomatoes)",
      "There is NO cure - prevention is critical"
    ],
    prevention: [
      "Use virus-resistant varieties (ToMV-resistant)",
      "Start with certified virus-free seeds and transplants",
      "Disinfect hands before working with plants",
      "Disinfect tools frequently (10% bleach or milk dip)",
      "Remove and destroy any infected plants immediately",
      "Control aphids and other sap-sucking insects",
      "Don't smoke or use tobacco products near tomatoes",
      "Avoid planting near peppers (alternate host)"
    ],
    growth_stage_default: "vegetative"
  },

  "Tomato_healthy": {
    crop_type: "Tomato",
    plant_family: "Solanaceae",
    disease_type: "None - Healthy Plant",
    health_status: "healthy",
    severity_level: "none",
    symptoms: [
      "Vibrant green leaves without spots or discoloration",
      "Strong, upright growth",
      "Normal flowering and fruit set",
      "No visible signs of disease or severe pest damage",
      "Healthy root system and nutrient uptake"
    ],
    affected_parts: [],
    recommendations: [
      "Continue excellent management practices",
      "Monitor plants regularly for any disease signs",
      "Maintain proper watering and fertilization schedule",
      "Scout weekly for pests and diseases",
      "Be prepared with fungicides if weather favors disease",
      "Keep field clean and well-maintained"
    ],
    prevention: [
      "Continue proper spacing and staking",
      "Use mulch to suppress weeds and prevent soil splash",
      "Practice crop rotation",
      "Use drip irrigation",
      "Sanitize tools and equipment",
      "Remove plant debris promptly after harvest",
      "Monitor weather for disease-favorable conditions"
    ],
    growth_stage_default: "vegetative"
  }
};

/**
 * Enrich TFLite prediction with detailed metadata
 * 
 * @param {string} tfliteClassName - Class name from TFLite model (e.g., "Tomato_Late_blight")
 * @param {number} confidence - Confidence score from model (0.0 to 1.0)
 * @returns {object} - Complete analysis matching Gemini format
 */
export function enrichTFLiteResult(tfliteClassName, confidence) {
  const metadata = DISEASE_METADATA[tfliteClassName];
  
  if (!metadata) {
    console.warn(`⚠️  No metadata found for class: ${tfliteClassName}`);
    return {
      crop_type: 'Unknown',
      plant_family: 'Unknown',
      growth_stage: 'unknown',
      health_status: 'unknown',
      disease_type: 'Unknown',
      severity_level: 'unknown',
      symptoms: ['Unable to provide detailed analysis'],
      affected_parts: [],
      recommendations: ['Consult local agricultural extension officer'],
      prevention: ['Maintain good agricultural practices'],
      confidence: confidence,
      source: 'TensorFlow Lite',
      analysisMethod: 'tensorflow_lite',
      error: 'Metadata not found'
    };
  }
  
  // Return enriched result matching Gemini format
  return {
    crop_type: metadata.crop_type,
    plant_family: metadata.plant_family,
    growth_stage: metadata.growth_stage_default,
    health_status: metadata.health_status,
    disease_type: metadata.disease_type,
    severity_level: metadata.severity_level,
    symptoms: metadata.symptoms,
    affected_parts: metadata.affected_parts,
    recommendations: metadata.recommendations,
    prevention: metadata.prevention,
    confidence: confidence,
    source: 'TensorFlow Lite + Metadata',
    analysisMethod: 'tensorflow_lite',
    timestamp: new Date().toISOString()
  };
}

/**
 * Get plant family by crop type
 */
export function getPlantFamily(cropType) {
  const families = {
    'Beans': 'Fabaceae (Leguminosae)',
    'Coffee': 'Rubiaceae',
    'Tomato': 'Solanaceae',
    'Potato': 'Solanaceae',
    'Pepper': 'Solanaceae',
    'Bell Pepper': 'Solanaceae'
  };
  return families[cropType] || 'Unknown';
}

/**
 * Get all available disease classes
 */
export function getAllDiseaseClasses() {
  return Object.keys(DISEASE_METADATA);
}

/**
 * Get diseases by crop type
 */
export function getDiseasesByCrop(cropType) {
  return Object.keys(DISEASE_METADATA).filter(key => 
    DISEASE_METADATA[key].crop_type === cropType
  );
}


