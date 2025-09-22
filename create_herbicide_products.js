const fs = require('fs');
const path = require('path');

// Read the HERBICIDES_SIMPLE directory
const herbicidesDir = '/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/HERBICIDES_SIMPLE';
const files = fs.readdirSync(herbicidesDir);

// Filter out non-image files
const imageFiles = files.filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png'].includes(ext);
});

console.log('Found herbicide image files:', imageFiles.length);

// Function to convert filename to product name
function filenameToProductName(filename) {
  // Remove extension
  const nameWithoutExt = path.parse(filename).name;
  
  // Convert underscores to spaces and capitalize words
  const words = nameWithoutExt.split('_');
  const capitalizedWords = words.map(word => {
    // Handle special cases and numbers
    if (word.toLowerCase() === 'ec') return 'EC';
    if (word.toLowerCase() === 'sl') return 'SL';
    if (word.toLowerCase() === 'sc') return 'SC';
    if (word.toLowerCase() === 'wg') return 'WG';
    if (word.toLowerCase() === 'cs') return 'CS';
    if (word.toLowerCase() === 'xl') return 'XL';
    if (word.toLowerCase() === 'gl') return 'GL';
    if (word.toLowerCase() === 'se') return 'SE';
    if (word.toLowerCase() === 'alt') return '(Alt)';
    if (word.toLowerCase() === 'pre') return 'Pre';
    if (word.toLowerCase() === 'post') return 'Post';
    if (word.toLowerCase() === 'emergence') return 'Emergence';
    if (word.toLowerCase() === 'emergent') return 'Emergent';
    if (word.toLowerCase() === 'selective') return 'Selective';
    if (word.toLowerCase() === 'non') return 'Non';
    if (word.toLowerCase() === 'herbicide') return 'Herbicide';
    if (word.toLowerCase() === 'weed') return 'Weed';
    if (word.toLowerCase() === 'control') return 'Control';
    if (word.toLowerCase() === 'for') return 'For';
    if (word.toLowerCase() === 'in') return 'In';
    if (word.toLowerCase() === 'and') return 'and';
    if (word.toLowerCase() === 'of') return 'of';
    if (word.toLowerCase() === 'the') return 'the';
    if (word.toLowerCase() === 'annual') return 'Annual';
    if (word.toLowerCase() === 'perennial') return 'Perennial';
    if (word.toLowerCase() === 'broad') return 'Broad';
    if (word.toLowerCase() === 'leafed') return 'Leafed';
    if (word.toLowerCase() === 'leaf') return 'Leaf';
    if (word.toLowerCase() === 'weeds') return 'Weeds';
    if (word.toLowerCase() === 'grass') return 'Grass';
    if (word.toLowerCase() === 'grasses') return 'Grasses';
    if (word.toLowerCase() === 'leaved') return 'Leaved';
    if (word.toLowerCase() === 'systemic') return 'Systemic';
    if (word.toLowerCase() === 'herbaceous') return 'Herbaceous';
    if (word.toLowerCase() === 'tree') return 'Tree';
    if (word.toLowerCase() === 'stump') return 'Stump';
    if (word.toLowerCase() === 'regrowth') return 'Regrowth';
    if (word.toLowerCase() === 'woody') return 'Woody';
    if (word.toLowerCase() === 'plants') return 'Plants';
    if (word.toLowerCase() === 'vines') return 'Vines';
    if (word.toLowerCase() === 'early') return 'Early';
    if (word.toLowerCase() === 'general') return 'General';
    if (word.toLowerCase() === 'most') return 'Most';
    if (word.toLowerCase() === 'cereals') return 'Cereals';
    if (word.toLowerCase() === 'maize') return 'Maize';
    if (word.toLowerCase() === 'sorghum') return 'Sorghum';
    if (word.toLowerCase() === 'grassland') return 'Grassland';
    if (word.toLowerCase() === 'established') return 'Established';
    if (word.toLowerCase() === 'turf') return 'Turf';
    if (word.toLowerCase() === 'pineapple') return 'Pineapple';
    if (word.toLowerCase() === 'sugarcane') return 'Sugarcane';
    if (word.toLowerCase() === 'bananas') return 'Bananas';
    if (word.toLowerCase() === 'plantains') return 'Plantains';
    if (word.toLowerCase() === 'dry') return 'Dry';
    if (word.toLowerCase() === 'beans') return 'Beans';
    if (word.toLowerCase() === 'potato') return 'Potato';
    if (word.toLowerCase() === 'rice') return 'Rice';
    if (word.toLowerCase() === 'groundnuts') return 'Groundnuts';
    if (word.toLowerCase() === 'wheat') return 'Wheat';
    if (word.toLowerCase() === 'soy') return 'Soy';
    if (word.toLowerCase() === 'bean') return 'Bean';
    if (word.toLowerCase() === 'plantation') return 'Plantation';
    if (word.toLowerCase() === 'crops') return 'Crops';
    if (word.toLowerCase() === 'snow') return 'Snow';
    if (word.toLowerCase() === 'peas') return 'Peas';
    if (word.toLowerCase() === 'french') return 'French';
    if (word.toLowerCase() === 'plantations') return 'Plantations';
    if (word.toLowerCase() === 'barley') return 'Barley';
    if (word.toLowerCase() === 'force') return 'Force';
    if (word.toLowerCase() === 'clean') return 'Clean';
    if (word.toLowerCase() === 'super') return 'Super';
    if (word.toLowerCase() === 'up') return 'Up';
    if (word.toLowerCase() === 'top') return 'Top';
    if (word.toLowerCase() === 'granular') return 'Granular';
    if (word.toLowerCase() === 'excel') return 'Excel';
    if (word.toLowerCase() === 'glycel') return 'Glycel';
    if (word.toLowerCase() === 'round') return 'Round';
    if (word.toLowerCase() === 'turbo') return 'Turbo';
    if (word.toLowerCase() === 'weeder') return 'Weeder';
    if (word.toLowerCase() === 'weedall') return 'Weedall';
    if (word.toLowerCase() === 'weedmaster') return 'Weedmaster';
    if (word.toLowerCase() === 'wound') return 'Wound';
    if (word.toLowerCase() === 'out') return 'Out';
    if (word.toLowerCase() === 'zoomer') return 'Zoomer';
    if (word.toLowerCase() === 'zonex') return 'Zonex';
    if (word.toLowerCase() === 'stellar') return 'Stellar';
    if (word.toLowerCase() === 'star') return 'Star';
    if (word.toLowerCase() === 'stomp') return 'Stomp';
    if (word.toLowerCase() === 'sicometryn') return 'Sicometryn';
    if (word.toLowerCase() === 'servian') return 'Servian';
    if (word.toLowerCase() === 'ralon') return 'Ralon';
    if (word.toLowerCase() === 'primagram') return 'Primagram';
    if (word.toLowerCase() === 'gold') return 'Gold';
    if (word.toLowerCase() === 'potasun') return 'Potasun';
    if (word.toLowerCase() === 'piko') return 'Piko';
    if (word.toLowerCase() === 'oxygold') return 'Oxygold';
    if (word.toLowerCase() === 'oxyfen') return 'Oxyfen';
    if (word.toLowerCase() === 'metrazin') return 'Metrazin';
    if (word.toLowerCase() === 'metoneflagon') return 'Metoneflagon';
    if (word.toLowerCase() === 'megazine') return 'Megazine';
    if (word.toLowerCase() === 'atrizine') return 'Atrizine';
    if (word.toLowerCase() === 'succeed') return 'Succeed';
    if (word.toLowerCase() === 'maguguma') return 'Maguguma';
    if (word.toLowerCase() === 'lumax') return 'Lumax';
    if (word.toLowerCase() === 'jembe') return 'Jembe';
    if (word.toLowerCase() === 'huskie') return 'Huskie';
    if (word.toLowerCase() === 'herbkill') return 'Herbkill';
    if (word.toLowerCase() === 'hasunil') return 'Hasunil';
    if (word.toLowerCase() === 'hangzhou') return 'Hangzhou';
    if (word.toLowerCase() === 'hang') return 'Hang';
    if (word.toLowerCase() === 'ametryn') return 'Ametryn';
    if (word.toLowerCase() === 'glyphocel') return 'Glyphocel';
    if (word.toLowerCase() === 'glufosun') return 'Glufosun';
    if (word.toLowerCase() === 'fusilade') return 'Fusilade';
    if (word.toLowerCase() === 'forte') return 'Forte';
    if (word.toLowerCase() === 'fennut') return 'Fennut';
    if (word.toLowerCase() === 'dualgold') return 'Dualgold';
    if (word.toLowerCase() === 'd') return 'D';
    if (word.toLowerCase() === 'amine') return 'Amine';
    if (word.toLowerCase() === 'cleanspray') return 'Cleanspray';
    if (word.toLowerCase() === 'butanil') return 'Butanil';
    if (word.toLowerCase() === 'buta') return 'Buta';
    if (word.toLowerCase() === 'beansclean') return 'Beansclean';
    if (word.toLowerCase() === 'bastnate') return 'Bastnate';
    if (word.toLowerCase() === 'basagran') return 'Basagran';
    if (word.toLowerCase() === 'auxo') return 'Auxo';
    if (word.toLowerCase() === 'amino') return 'Amino';
    if (word.toLowerCase() === 'agriforce') return 'Agriforce';
    
    // Handle numbers and ratios
    if (/^\d+$/.test(word)) return word;
    if (/^\d+\.\d+$/.test(word)) return word;
    if (/^\d+\.\d+\.\d+$/.test(word)) return word;
    if (/^\d+\.\d+\.\d+\+\d+$/.test(word)) return word;
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
  
  if (name.includes('selective')) return 'Selective';
  if (name.includes('non') && name.includes('selective')) return 'Non-Selective';
  if (name.includes('pre') && name.includes('emergence')) return 'Pre-Emergence';
  if (name.includes('post') && name.includes('emergence')) return 'Post-Emergence';
  if (name.includes('systemic')) return 'Systemic';
  if (name.includes('contact')) return 'Contact';
  if (name.includes('glyphosate')) return 'Glyphosate';
  if (name.includes('2,4-d') || name.includes('2_4d')) return '2,4-D';
  if (name.includes('atrazine')) return 'Atrazine';
  if (name.includes('bentazon')) return 'Bentazon';
  if (name.includes('butachlor')) return 'Butachlor';
  if (name.includes('ametryne')) return 'Ametryne';
  if (name.includes('paraquat')) return 'Paraquat';
  
  return 'General';
}

// Function to determine manufacturer based on filename
function getManufacturer(filename) {
  const name = filename.toLowerCase();
  
  if (name.includes('round') || name.includes('roundup')) return 'Monsanto';
  if (name.includes('basagran')) return 'BASF';
  if (name.includes('primagram')) return 'Syngenta';
  if (name.includes('fusilade')) return 'Syngenta';
  if (name.includes('lumax')) return 'Syngenta';
  if (name.includes('stomp')) return 'BASF';
  if (name.includes('ralon')) return 'Bayer';
  if (name.includes('huskie')) return 'Bayer';
  if (name.includes('servian')) return 'Bayer';
  if (name.includes('hangzhou')) return 'Hangzhou';
  if (name.includes('hang')) return 'Hangzhou';
  if (name.includes('agriforce') || name.includes('amino') || name.includes('clean') || name.includes('buta') || name.includes('force')) return 'Agri Solutions';
  if (name.includes('beans') || name.includes('auxo') || name.includes('ametryne') || name.includes('butanil') || name.includes('cleanspray') || name.includes('d_amine') || name.includes('dualgold') || name.includes('fennut') || name.includes('glufosun') || name.includes('glyphocel') || name.includes('hasunil') || name.includes('herbkill') || name.includes('jembe') || name.includes('maguguma') || name.includes('maize') || name.includes('megazine') || name.includes('metoneflagon') || name.includes('metrazin') || name.includes('oxyfen') || name.includes('oxygold') || name.includes('piko') || name.includes('potasun') || name.includes('stellar') || name.includes('sicometryn') || name.includes('super') || name.includes('weedall') || name.includes('weedmaster') || name.includes('wound') || name.includes('zonex') || name.includes('zoomer')) return 'Various Suppliers';
  
  return 'Various Suppliers';
}

// Function to generate price based on product type
function generatePrice(filename, category) {
  const name = filename.toLowerCase();
  
  // Premium products
  if (name.includes('roundup') || name.includes('turbo') || name.includes('gold') || name.includes('super')) {
    return 'UGX 45,000 - UGX 65,000';
  }
  
  // Professional products
  if (name.includes('basagran') || name.includes('primagram') || name.includes('fusilade') || name.includes('lumax') || name.includes('stomp') || name.includes('ralon') || name.includes('huskie') || name.includes('servian')) {
    return 'UGX 50,000 - UGX 80,000';
  }
  
  // Standard products
  if (name.includes('selective') || name.includes('post') || name.includes('pre')) {
    return 'UGX 35,000 - UGX 55,000';
  }
  
  // Basic products
  if (name.includes('force') || name.includes('clean') || name.includes('weeder') || name.includes('weedall')) {
    return 'UGX 25,000 - UGX 45,000';
  }
  
  // Glyphosate products
  if (category === 'Glyphosate') {
    return 'UGX 30,000 - UGX 50,000';
  }
  
  // 2,4-D products
  if (category === '2,4-D') {
    return 'UGX 35,000 - UGX 55,000';
  }
  
  // Atrazine products
  if (category === 'Atrazine') {
    return 'UGX 40,000 - UGX 60,000';
  }
  
  // Bentazon products
  if (category === 'Bentazon') {
    return 'UGX 45,000 - UGX 65,000';
  }
  
  // Butachlor products
  if (category === 'Butachlor') {
    return 'UGX 35,000 - UGX 55,000';
  }
  
  // Ametryne products
  if (category === 'Ametryne') {
    return 'UGX 40,000 - UGX 60,000';
  }
  
  // Paraquat products
  if (category === 'Paraquat') {
    return 'UGX 30,000 - UGX 50,000';
  }
  
  // Default price range
  return 'UGX 25,000 - UGX 65,000';
}

// Function to generate description based on product name and category
function generateDescription(name, category, filename) {
  const lowerName = name.toLowerCase();
  const lowerFilename = filename.toLowerCase();
  
  // Specific product descriptions
  if (lowerName.includes('2,4d amine') || lowerName.includes('2_4d_amine')) {
    return 'Selective herbicide for broadleaf weed control in cereals, maize, sorghum, grassland and established turf.';
  }
  
  if (lowerName.includes('agriforce')) {
    return 'Professional herbicide for effective weed control in various crops.';
  }
  
  if (lowerName.includes('ametryne')) {
    return 'Selective post-emergence herbicide for weed control in pineapple, sugarcane, bananas and plantains.';
  }
  
  if (lowerName.includes('amino force')) {
    return 'Professional herbicide for effective weed control in various crops.';
  }
  
  if (lowerName.includes('auxo')) {
    return 'Selective herbicide for weed control in maize.';
  }
  
  if (lowerName.includes('basagran')) {
    return 'Herbicide for weed control in dry beans, maize and potato.';
  }
  
  if (lowerName.includes('bastnate')) {
    return 'Non-selective herbicide for the control of annual and perennial broad leafed weeds.';
  }
  
  if (lowerName.includes('beans clean')) {
    return 'Professional herbicide for weed control in beans.';
  }
  
  if (lowerName.includes('beansclean super')) {
    return 'Professional herbicide for weed control in beans.';
  }
  
  if (lowerName.includes('buta force')) {
    return 'Professional herbicide for effective weed control in various crops.';
  }
  
  if (lowerName.includes('butanil')) {
    return 'Selective pre and post-emergence herbicide for weed control in rice.';
  }
  
  if (lowerName.includes('clean force')) {
    return 'Professional herbicide for effective weed control in various crops.';
  }
  
  if (lowerName.includes('cleanspray')) {
    return 'Herbicide for weed control in wheat, maize, rice and plantation crops.';
  }
  
  if (lowerName.includes('d-amine') || lowerName.includes('d_amine')) {
    return 'Professional herbicide for effective weed control in various crops.';
  }
  
  if (lowerName.includes('dualgold')) {
    return 'Herbicide for control of annual grass weeds in maize.';
  }
  
  if (lowerName.includes('excel glycel')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('fennut')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('force top')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('force up')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('fusilade')) {
    return 'Post-emergence herbicide for use in snow peas and french beans.';
  }
  
  if (lowerName.includes('glufosun')) {
    return 'Herbicide for post-emergence weed control in plantations.';
  }
  
  if (lowerName.includes('glyphocel')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('hang ametryn')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('hangzhou')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('hasunil')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('herbkill')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('huskie')) {
    return 'Herbicide for the control of broadleaf weeds in wheat and barley.';
  }
  
  if (lowerName.includes('jembe')) {
    return 'Non-selective herbicide for control herbaceous weeds.';
  }
  
  if (lowerName.includes('lumax')) {
    return 'Herbicide for weed control in sugarcane and maize.';
  }
  
  if (lowerName.includes('maguguma')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('maize succeed')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('megazine') || lowerName.includes('atrizine')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('metoneflagon')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('metrazin')) {
    return 'Pre and post-emergence herbicide for weed control in maize.';
  }
  
  if (lowerName.includes('oxyfen')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('oxygold')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('piko')) {
    return 'Systemic herbicide for control of broad leaf weeds, tree stump regrowth, woody plants and vines.';
  }
  
  if (lowerName.includes('potasun')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('primagram')) {
    return 'Herbicide for the control of annual grass weeds in maize.';
  }
  
  if (lowerName.includes('ralon')) {
    return 'Herbicide for weed control in wheat and barley.';
  }
  
  if (lowerName.includes('round up') || lowerName.includes('roundup')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('roundup turbo')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('servian')) {
    return 'Selective early post-emergence herbicide.';
  }
  
  if (lowerName.includes('sicometryn')) {
    return 'Pre and post-emergence herbicide for the control of most annual grasses and broad leaved weeds.';
  }
  
  if (lowerName.includes('stellar star')) {
    return 'Post-emergence herbicide for weed control in maize.';
  }
  
  if (lowerName.includes('stomp')) {
    return 'Pre-emergent herbicide.';
  }
  
  if (lowerName.includes('super weeder')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('weedall')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('weedmaster')) {
    return 'Non-selective herbicide for general weed control.';
  }
  
  if (lowerName.includes('wound out')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  if (lowerName.includes('zonex')) {
    return 'Post-emergence herbicide for weed control in rice.';
  }
  
  if (lowerName.includes('zoomer')) {
    return 'Professional herbicide for effective weed control.';
  }
  
  // Generic descriptions based on category
  if (category === 'Selective') {
    return 'Selective herbicide for targeted weed control.';
  }
  
  if (category === 'Non-Selective') {
    return 'Non-selective herbicide for complete weed control.';
  }
  
  if (category === 'Pre-Emergence') {
    return 'Pre-emergence herbicide for early weed control.';
  }
  
  if (category === 'Post-Emergence') {
    return 'Post-emergence herbicide for established weed control.';
  }
  
  if (category === 'Systemic') {
    return 'Systemic herbicide for thorough weed control.';
  }
  
  if (category === 'Contact') {
    return 'Contact herbicide for immediate weed control.';
  }
  
  if (category === 'Glyphosate') {
    return 'Glyphosate-based herbicide for effective weed control.';
  }
  
  if (category === '2,4-D') {
    return '2,4-D herbicide for broadleaf weed control.';
  }
  
  if (category === 'Atrazine') {
    return 'Atrazine herbicide for selective weed control.';
  }
  
  if (category === 'Bentazon') {
    return 'Bentazon herbicide for broadleaf weed control.';
  }
  
  if (category === 'Butachlor') {
    return 'Butachlor herbicide for grass weed control.';
  }
  
  if (category === 'Ametryne') {
    return 'Ametryne herbicide for selective weed control.';
  }
  
  if (category === 'Paraquat') {
    return 'Paraquat herbicide for quick weed control.';
  }
  
  return 'Professional herbicide for effective weed control.';
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
let jsCode = '  const herbicideProducts = useMemo(() => [\n';
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

console.log('Generated herbicide products:', products.length);
console.log('\nJavaScript code for products array:');
console.log(jsCode);

// Write to file
fs.writeFileSync('/home/darksagae/Desktop/agrof-main/herbicide_products_generated.js', jsCode);
console.log('\nGenerated code written to herbicide_products_generated.js');
