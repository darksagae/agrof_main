const fs = require('fs');
const path = require('path');

// Read the FERTILIZERS_SIMPLE directory
const fertilizersDir = '/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/FERTILIZERS_SIMPLE';
const files = fs.readdirSync(fertilizersDir);

// Filter out non-image files and the details folder
const imageFiles = files.filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png'].includes(ext) && file !== 'fertilizer_2.xcf';
});

console.log('Found image files:', imageFiles.length);

// Function to convert filename to product name
function filenameToProductName(filename) {
  // Remove extension
  const nameWithoutExt = path.parse(filename).name;
  
  // Convert underscores to spaces and capitalize words
  const words = nameWithoutExt.split('_');
  const capitalizedWords = words.map(word => {
    // Handle special cases
    if (word.toLowerCase() === 'npk') return 'NPK';
    if (word.toLowerCase() === 'alt') return '(Alt)';
    if (word.toLowerCase() === 'ws') return 'WS';
    if (word.toLowerCase() === 'te') return '+Te';
    if (word.toLowerCase() === 'mo') return 'Mo';
    if (word.toLowerCase() === 'can') return 'Can';
    if (word.toLowerCase() === 'sulfan') return 'Sulfan';
    if (word.toLowerCase() === 'nitrabor') return 'Nitrabor';
    if (word.toLowerCase() === 'java') return 'Java';
    if (word.toLowerCase() === 'winner') return 'Winner';
    if (word.toLowerCase() === 'boost') return 'Boost';
    if (word.toLowerCase() === 'crop') return 'Crop';
    if (word.toLowerCase() === 'power') return 'Power';
    if (word.toLowerCase() === 'plus') return 'Plus';
    if (word.toLowerCase() === 'expresso') return 'Expresso';
    if (word.toLowerCase() === 'top') return 'Top';
    if (word.toLowerCase() === 'hexa') return 'Hexa';
    if (word.toLowerCase() === 'compound') return 'Compound';
    if (word.toLowerCase() === 'foliar') return 'Foliar';
    if (word.toLowerCase() === 'premium') return 'Premium';
    if (word.toLowerCase() === 'lime') return 'Lime';
    if (word.toLowerCase() === 'tapiocal') return 'Tapiocal';
    if (word.toLowerCase() === 'champion') return 'Champion';
    if (word.toLowerCase() === 'phosphate') return 'Phosphate';
    if (word.toLowerCase() === 'calcium') return 'Calcium';
    if (word.toLowerCase() === 'starter') return 'Starter';
    if (word.toLowerCase() === 'vegetative') return 'Vegetative';
    if (word.toLowerCase() === 'elements') return 'Elements';
    if (word.toLowerCase() === 'boron') return 'Boron';
    if (word.toLowerCase() === 'miracle') return 'Miracle';
    if (word.toLowerCase() === 'grow') return 'Grow';
    if (word.toLowerCase() === 'panda') return 'Panda';
    if (word.toLowerCase() === 'multi') return 'Multi';
    if (word.toLowerCase() === 'map') return 'Map';
    if (word.toLowerCase() === 'peak') return 'Peak';
    if (word.toLowerCase() === 'monophosphate') return 'Monophosphate';
    if (word.toLowerCase() === 'balanced') return 'Balanced';
    if (word.toLowerCase() === 'beans') return 'Beans';
    if (word.toLowerCase() === 'cassava') return 'Cassava';
    if (word.toLowerCase() === 'coffee') return 'Coffee';
    if (word.toLowerCase() === 'planting') return 'Planting';
    if (word.toLowerCase() === 'sunflower') return 'Sunflower';
    if (word.toLowerCase() === 'organic') return 'Organic';
    if (word.toLowerCase() === 'potassium') return 'Potassium';
    if (word.toLowerCase() === 'hormone') return 'Hormone';
    if (word.toLowerCase() === 'even') return 'Even';
    if (word.toLowerCase() === 'liquid') return 'Liquid';
    if (word.toLowerCase() === 'prilled') return 'Prilled';
    if (word.toLowerCase() === 'mila') return 'Mila';
    if (word.toLowerCase() === 'vera') return 'Vera';
    if (word.toLowerCase() === 'amidas') return 'Amidas';
    if (word.toLowerCase() === 'yarabela') return 'Yarabela';
    if (word.toLowerCase() === 'yaraliva') return 'Yaraliva';
    if (word.toLowerCase() === 'yaramila') return 'Yaramila';
    if (word.toLowerCase() === 'yaravita') return 'Yaravita';
    if (word.toLowerCase() === 'kynoch') return 'Kynoch';
    if (word.toLowerCase() === 'kynohorti') return 'Kynohorti';
    if (word.toLowerCase() === 'kynoplus') return 'Kynoplus';
    if (word.toLowerCase() === 'nova') return 'Nova';
    if (word.toLowerCase() === 'nutriplant') return 'Nutriplant';
    if (word.toLowerCase() === 'omni') return 'Omni';
    if (word.toLowerCase() === 'polyfeed') return 'Polyfeed';
    if (word.toLowerCase() === 'rootex') return 'Rootex';
    if (word.toLowerCase() === 'rosasol') return 'Rosasol';
    if (word.toLowerCase() === 'super') return 'Super';
    if (word.toLowerCase() === 'green') return 'Green';
    if (word.toLowerCase() === 'urea') return 'Urea';
    if (word.toLowerCase() === 'yara') return 'Yara';
    if (word.toLowerCase() === 'agri') return 'Agri';
    if (word.toLowerCase() === 'gold') return 'Gold';
    if (word.toLowerCase() === 'agricultural') return 'Agricultural';
    if (word.toLowerCase() === 'magnesium') return 'Magnesium';
    if (word.toLowerCase() === 'nitrate') return 'Nitrate';
    if (word.toLowerCase() === 'mea') return 'MEA';
    if (word.toLowerCase() === 'microp') return 'Microp';
    if (word.toLowerCase() === 'mop') return 'MOP';
    if (word.toLowerCase() === 'elfert') return 'Elfert';
    if (word.toLowerCase() === 'folcrop') return 'Folcrop';
    if (word.toLowerCase() === 'greensea') return 'Greensea';
    if (word.toLowerCase() === 'crop') return 'Crop';
    if (word.toLowerCase() === 'easygro') return 'Easygro';
    if (word.toLowerCase() === 'dap') return 'DAP';
    if (word.toLowerCase() === 'trace') return 'Trace';
    
    // Handle numbers (like NPK ratios)
    if (/^\d+$/.test(word)) return word;
    if (/^\d+\.\d+$/.test(word)) return word;
    if (/^\d+\.\d+\.\d+$/.test(word)) return word;
    if (/^\d+\.\d+\.\d+\+\d+s$/.test(word)) return word;
    if (/^\d+\.\d+\.\d+\+\d+te$/.test(word)) return word;
    if (/^\d+\.\d+\.\d+\+\d+mo$/.test(word)) return word;
    if (/^\d+\.\d+\.\d+\+\d+$/.test(word)) return word;
    if (/^\d+\.\d+\.\d+$/.test(word)) return word;
    if (/^\d+\.\d+$/.test(word)) return word;
    if (/^\d+$/.test(word)) return word;
    
    // Capitalize first letter of each word
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  
  return capitalizedWords.join(' ');
}

// Function to determine category based on filename
function getCategory(filename) {
  const name = filename.toLowerCase();
  
  if (name.includes('foliar') || name.includes('boost')) return 'Foliar';
  if (name.includes('water') || name.includes('ws') || name.includes('soluble')) return 'Water Soluble';
  if (name.includes('trace') || name.includes('elements')) return 'Trace Elements';
  if (name.includes('organic')) return 'Organic';
  if (name.includes('npk')) return 'NPK';
  if (name.includes('nitrogen') || name.includes('urea') || name.includes('amidas')) return 'Nitrogen';
  if (name.includes('phosphorus') || name.includes('phosphate') || name.includes('dap')) return 'Phosphorus';
  if (name.includes('potassium') || name.includes('potash') || name.includes('k20')) return 'Potassium';
  if (name.includes('calcium') || name.includes('lime')) return 'Calcium';
  if (name.includes('magnesium')) return 'Magnesium';
  if (name.includes('starter') || name.includes('planting')) return 'Starter';
  if (name.includes('topdressing') || name.includes('top')) return 'Topdressing';
  if (name.includes('liquid')) return 'Liquid';
  if (name.includes('hormone')) return 'Hormone';
  if (name.includes('anti-transpirant') || name.includes('miracle')) return 'Anti-transpirant';
  if (name.includes('soil') || name.includes('lime')) return 'Soil Amendment';
  if (name.includes('micronutrients') || name.includes('boron') || name.includes('mo')) return 'Micronutrients';
  if (name.includes('specialized') || name.includes('cassava') || name.includes('coffee') || name.includes('beans') || name.includes('sunflower')) return 'Specialized';
  if (name.includes('premium')) return 'Premium';
  if (name.includes('complete')) return 'Complete';
  if (name.includes('vegetative')) return 'Vegetative';
  
  return 'General';
}

// Function to determine manufacturer based on filename
function getManufacturer(filename) {
  const name = filename.toLowerCase();
  
  if (name.includes('yara')) return 'Yara';
  if (name.includes('kynoch') || name.includes('kynoplus') || name.includes('kynohorti')) return 'Kynoch';
  if (name.includes('nova')) return 'Uganda Crop Care Limited';
  if (name.includes('agri') || name.includes('gold')) return 'Various Suppliers';
  if (name.includes('easygro')) return 'Various Suppliers';
  if (name.includes('nutriplant')) return 'Various Suppliers';
  if (name.includes('omni')) return 'Uganda Crop Care Limited';
  if (name.includes('elfert')) return 'Uganda Crop Care Limited';
  if (name.includes('magnesium') && name.includes('nitrate')) return 'Uganda Crop Care Limited';
  if (name.includes('calcium') && name.includes('nitrate')) return 'Uganda Crop Care Limited';
  if (name.includes('polyfeed')) return 'Various Suppliers';
  if (name.includes('rootex')) return 'Various Suppliers';
  if (name.includes('rosasol')) return 'Various Suppliers';
  if (name.includes('super') && name.includes('green')) return 'Various Suppliers';
  if (name.includes('greensea')) return 'Various Suppliers';
  if (name.includes('folcrop')) return 'Various Suppliers';
  if (name.includes('microp')) return 'Various Suppliers';
  if (name.includes('crop') && name.includes('champion')) return 'Various Suppliers';
  if (name.includes('green') && name.includes('miracle')) return 'Various Suppliers';
  if (name.includes('grow') && name.includes('cal')) return 'Various Suppliers';
  if (name.includes('multi') && name.includes('npk')) return 'Various Suppliers';
  if (name.includes('mop')) return 'Various Suppliers';
  if (name.includes('mea') && name.includes('urea')) return 'Various Suppliers';
  if (name.includes('dap')) return 'Various Suppliers';
  if (name.includes('urea') && name.includes('prilled')) return 'Various Suppliers';
  if (name.includes('agricultural') && name.includes('lime')) return 'Various Suppliers';
  
  return 'Various Suppliers';
}

// Function to generate price based on product type
function generatePrice(filename, category) {
  const name = filename.toLowerCase();
  
  // Premium products
  if (name.includes('premium') || name.includes('power') || name.includes('plus')) {
    return 'UGX 35,000 - UGX 190,000';
  }
  
  // Water soluble products (usually more expensive)
  if (category === 'Water Soluble') {
    return 'UGX 158,800 - UGX 366,000';
  }
  
  // Organic products
  if (category === 'Organic') {
    return 'UGX 117,150 (1L)';
  }
  
  // NPK products
  if (category === 'NPK') {
    return 'UGX 18,000 - UGX 165,000';
  }
  
  // Nitrogen products
  if (category === 'Nitrogen') {
    return 'UGX 110,000 - UGX 146,000';
  }
  
  // Phosphorus products
  if (category === 'Phosphorus') {
    return 'UGX 175,000 (50kg)';
  }
  
  // Potassium products
  if (category === 'Potassium') {
    return 'UGX 35,000 - UGX 150,000';
  }
  
  // Calcium products
  if (category === 'Calcium') {
    return 'UGX 6,400 - UGX 38,000';
  }
  
  // Magnesium products
  if (category === 'Magnesium') {
    return 'UGX 158,800 (25kg)';
  }
  
  // Foliar products
  if (category === 'Foliar') {
    return 'UGX 30,000 - UGX 38,500';
  }
  
  // Liquid products
  if (category === 'Liquid') {
    return 'UGX 11,000 (1L)';
  }
  
  // Hormone products
  if (category === 'Hormone') {
    return 'UGX 170,000 (1L)';
  }
  
  // Anti-transpirant products
  if (category === 'Anti-transpirant') {
    return 'UGX 31,000 (1L)';
  }
  
  // Soil amendment products
  if (category === 'Soil Amendment') {
    return 'UGX 25,000 - UGX 36,000';
  }
  
  // Micronutrients
  if (category === 'Micronutrients') {
    return 'UGX 35,000 (1kg)';
  }
  
  // Specialized products
  if (category === 'Specialized') {
    return 'UGX 5,000 - UGX 160,000';
  }
  
  // Starter products
  if (category === 'Starter') {
    return 'UGX 18,000 (1kg)';
  }
  
  // Topdressing products
  if (category === 'Topdressing') {
    return 'UGX 135,000 - UGX 165,000';
  }
  
  // Complete products
  if (category === 'Complete') {
    return 'UGX 13,000 (300g)';
  }
  
  // Vegetative products
  if (category === 'Vegetative') {
    return 'UGX 20,000 (1kg)';
  }
  
  // Trace elements
  if (category === 'Trace Elements') {
    return 'UGX 779,600 (25kg)';
  }
  
  // Default price range
  return 'UGX 5,000 - UGX 366,000';
}

// Function to generate description based on product name and category
function generateDescription(name, category, filename) {
  const lowerName = name.toLowerCase();
  const lowerFilename = filename.toLowerCase();
  
  // Specific product descriptions
  if (lowerName.includes('agri gold')) {
    return 'Agri Gold is a wonder product that prevents flower shedding, promotes more flower formation and bumper yield while enhancing healthy fruit formation and vegetative growth.';
  }
  
  if (lowerName.includes('omni k')) {
    return 'Water-soluble fertilizer for fertigation or foliar application, supplying nitrate, nitrogen and chlorine free potassium to plants.';
  }
  
  if (lowerName.includes('magnesium nitrate')) {
    return 'Recommended for vegetative growth and during production stages.';
  }
  
  if (lowerName.includes('elfert')) {
    return 'Effective foliar spray to correct trace element deficiency.';
  }
  
  if (lowerName.includes('nova peak')) {
    return 'High purity product that dissolves completely and quickly in water.';
  }
  
  if (lowerName.includes('calcium nitrate')) {
    return 'Helps with cell formation and neutralizes acids to detoxify plants.';
  }
  
  if (lowerName.includes('yaravita')) {
    return 'Concentrated phosphorous foliar fertilizer for enhanced crop growth.';
  }
  
  if (lowerName.includes('nova map')) {
    return 'Soluble fertilizer for fertigation and early growth stages.';
  }
  
  if (lowerName.includes('nutriplant')) {
    return 'Organic eliciting fertilizer with amino acids and trace elements.';
  }
  
  if (lowerName.includes('yara vera amidas')) {
    return 'High nitrogen fertilizer (46% N) for all crops.';
  }
  
  if (lowerName.includes('crop champion')) {
    return 'Complete crop nutrition fertilizer.';
  }
  
  if (lowerName.includes('rosasol')) {
    return 'Water soluble NPK with trace elements.';
  }
  
  if (lowerName.includes('easygro starter')) {
    return 'Starter fertilizer for young plants.';
  }
  
  if (lowerName.includes('microp')) {
    return 'Planting and topdressing fertilizer for crops.';
  }
  
  if (lowerName.includes('npk') && lowerName.includes('beans')) {
    return 'Fertilizer for beans and soybeans.';
  }
  
  if (lowerName.includes('cassava')) {
    return 'Microfood foliar fertilizer for cassava.';
  }
  
  if (lowerName.includes('kynoch panda power')) {
    return 'High-performance NPK fertilizer blend.';
  }
  
  if (lowerName.includes('multi npk')) {
    return 'Multi-nutrient NPK fertilizer.';
  }
  
  if (lowerName.includes('kynohorti')) {
    return 'Specialized NPK blend with sulfur.';
  }
  
  if (lowerName.includes('greensea')) {
    return 'Potassium fertilizer for all crops.';
  }
  
  if (lowerName.includes('kynoplus top')) {
    return 'Top-dressing NPK fertilizer.';
  }
  
  if (lowerName.includes('polyfeed')) {
    return 'Balanced NPK with trace elements.';
  }
  
  if (lowerName.includes('yara mila power plus')) {
    return 'Premium NPK fertilizer with micronutrients.';
  }
  
  if (lowerName.includes('kynoplus s')) {
    return 'Sulfur-enriched NPK fertilizer.';
  }
  
  if (lowerName.includes('npk') && lowerName.includes('cassava')) {
    return 'Blended fertilizer for cassava and sweet potato.';
  }
  
  if (lowerName.includes('npk') && lowerName.includes('coffee')) {
    return 'Specialized fertilizer for coffee cultivation.';
  }
  
  if (lowerName.includes('rootex')) {
    return 'Rooting hormone fertilizer.';
  }
  
  if (lowerName.includes('easygro calcium')) {
    return 'Water-soluble calcium fertilizer.';
  }
  
  if (lowerName.includes('mop')) {
    return 'Muriate of potash fertilizer.';
  }
  
  if (lowerName.includes('kynoplus expresso')) {
    return 'Quick-release NPK fertilizer.';
  }
  
  if (lowerName.includes('folcrop')) {
    return 'Boron and molybdenum fertilizer.';
  }
  
  if (lowerName.includes('npk') && lowerName.includes('planting')) {
    return 'Planting fertilizer blend.';
  }
  
  if (lowerName.includes('yarabela')) {
    return 'Yarabela fertilizer for nitrogen supply.';
  }
  
  if (lowerName.includes('mea-urea')) {
    return 'MEA-urea fertilizer blend.';
  }
  
  if (lowerName.includes('yaramila java')) {
    return 'Yaramila Java fertilizer.';
  }
  
  if (lowerName.includes('npk') && lowerName.includes('balanced')) {
    return 'Balanced NPK fertilizer.';
  }
  
  if (lowerName.includes('green miracle')) {
    return 'Anti-transpirant for plant stress relief.';
  }
  
  if (lowerName.includes('grow-cal')) {
    return 'Calcium fertilizer for plant growth.';
  }
  
  if (lowerName.includes('agricultural lime')) {
    return 'Agricultural limestone for soil conditioning.';
  }
  
  if (lowerName.includes('easygro vegetative')) {
    return 'Vegetative growth fertilizer.';
  }
  
  if (lowerName.includes('urea') && lowerName.includes('prilled')) {
    return 'High nitrogen fertilizer for rapid growth.';
  }
  
  if (lowerName.includes('npk') && lowerName.includes('sunflower')) {
    return 'Fertilizer for sunflower crops.';
  }
  
  if (lowerName.includes('super green')) {
    return 'Liquid complete water-soluble fertilizer.';
  }
  
  if (lowerName.includes('yaraliva')) {
    return 'Yaraliva Nitrabor fertilizer.';
  }
  
  if (lowerName.includes('yaramila winner')) {
    return 'Balanced NPK fertilizer for all crops.';
  }
  
  if (lowerName.includes('dap')) {
    return 'Diammonium phosphate for phosphorus supply.';
  }
  
  // Generic descriptions based on category
  if (category === 'Foliar') {
    return 'Foliar fertilizer for enhanced crop growth and yield improvement.';
  }
  
  if (category === 'Water Soluble') {
    return 'Water-soluble fertilizer for fertigation and foliar application.';
  }
  
  if (category === 'NPK') {
    return 'NPK fertilizer for balanced plant nutrition.';
  }
  
  if (category === 'Nitrogen') {
    return 'High nitrogen fertilizer for plant growth.';
  }
  
  if (category === 'Phosphorus') {
    return 'Phosphorus fertilizer for root development.';
  }
  
  if (category === 'Potassium') {
    return 'Potassium fertilizer for plant health.';
  }
  
  if (category === 'Calcium') {
    return 'Calcium fertilizer for plant growth and development.';
  }
  
  if (category === 'Magnesium') {
    return 'Magnesium fertilizer for plant nutrition.';
  }
  
  if (category === 'Organic') {
    return 'Organic fertilizer for sustainable agriculture.';
  }
  
  if (category === 'Liquid') {
    return 'Liquid fertilizer for easy application.';
  }
  
  if (category === 'Hormone') {
    return 'Plant hormone for growth regulation.';
  }
  
  if (category === 'Anti-transpirant') {
    return 'Anti-transpirant for water conservation.';
  }
  
  if (category === 'Soil Amendment') {
    return 'Soil amendment for pH correction.';
  }
  
  if (category === 'Micronutrients') {
    return 'Micronutrient fertilizer for plant nutrition.';
  }
  
  if (category === 'Specialized') {
    return 'Specialized fertilizer for specific crops.';
  }
  
  if (category === 'Starter') {
    return 'Starter fertilizer for young plants.';
  }
  
  if (category === 'Topdressing') {
    return 'Topdressing fertilizer for crop maintenance.';
  }
  
  if (category === 'Complete') {
    return 'Complete fertilizer for all growth stages.';
  }
  
  if (category === 'Vegetative') {
    return 'Vegetative growth fertilizer.';
  }
  
  if (category === 'Trace Elements') {
    return 'Trace element fertilizer for plant nutrition.';
  }
  
  return 'Agricultural fertilizer for crop nutrition.';
}

// Generate products array
const products = imageFiles.map((filename, index) => {
  const name = filenameToProductName(filename);
  const category = getCategory(filename);
  const manufacturer = getManufacturer(filename);
  const price = generatePrice(filename, category);
  const description = generateDescription(name, category, filename);
  
  return {
    id: index + 1,
    name,
    imageName: filename,
    category,
    manufacturer,
    price,
    description
  };
});

// Generate the JavaScript code for the products array
let jsCode = '  const fertilizerProducts = useMemo(() => [\n';
products.forEach((product, index) => {
  jsCode += `    {\n`;
  jsCode += `      id: ${product.id}, \n`;
  jsCode += `      name: '${product.name}', \n`;
  jsCode += `      imageName: '${product.imageName}', \n`;
  jsCode += `      category: '${product.category}', \n`;
  jsCode += `      manufacturer: '${product.manufacturer}',\n`;
  jsCode += `      price: '${product.price}', \n`;
  jsCode += `      description: '${product.description}'\n`;
  jsCode += `    }${index < products.length - 1 ? ',' : ''}\n`;
});
jsCode += '  ], []);\n';

console.log('Generated products:', products.length);
console.log('\nJavaScript code for products array:');
console.log(jsCode);

// Write to file
fs.writeFileSync('/home/darksagae/Desktop/agrof-main/fertilizer_products_generated.js', jsCode);
console.log('\nGenerated code written to fertilizer_products_generated.js');
