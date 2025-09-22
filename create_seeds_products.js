const fs = require('fs');
const path = require('path');

// Read the SEEDS_SIMPLE directory
const seedsDir = '/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/SEEDS_SIMPLE';
const files = fs.readdirSync(seedsDir);

// Filter out non-image files
const imageFiles = files.filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png'].includes(ext);
});

console.log('Found seed image files:', imageFiles.length);

// Function to convert filename to product name
function filenameToProductName(filename) {
  // Remove extension
  const nameWithoutExt = path.parse(filename).name;
  
  // Convert underscores to spaces and capitalize words
  const words = nameWithoutExt.split('_');
  const capitalizedWords = words.map(word => {
    // Handle special cases and numbers
    if (word.toLowerCase() === 'f1') return 'F1';
    if (word.toLowerCase() === 'f2') return 'F2';
    if (word.toLowerCase() === 'vfn') return 'VFN';
    if (word.toLowerCase() === 'brac') return 'BRAC';
    if (word.toLowerCase() === 'n') return 'N';
    if (word.toLowerCase() === 'sc') return 'SC';
    if (word.toLowerCase() === 'duma') return 'Duma';
    if (word.toLowerCase() === 'agro') return 'Agro';
    if (word.toLowerCase() === 'supply') return 'Supply';
    if (word.toLowerCase() === 'varirty') return 'Variety';
    if (word.toLowerCase() === 'productivity') return 'Productivity';
    if (word.toLowerCase() === 'prolific') return 'Prolific';
    if (word.toLowerCase() === 'pollinated') return 'Pollinated';
    if (word.toLowerCase() === 'open') return 'Open';
    if (word.toLowerCase() === 'compact') return 'Compact';
    if (word.toLowerCase() === 'determinate') return 'Determinate';
    if (word.toLowerCase() === 'suitable') return 'Suitable';
    if (word.toLowerCase() === 'processing') return 'Processing';
    if (word.toLowerCase() === 'fresh') return 'Fresh';
    if (word.toLowerCase() === 'market') return 'Market';
    if (word.toLowerCase() === 'gardens') return 'Gardens';
    if (word.toLowerCase() === 'home') return 'Home';
    if (word.toLowerCase() === 'and') return 'and';
    if (word.toLowerCase() === 'for') return 'For';
    if (word.toLowerCase() === 'with') return 'With';
    if (word.toLowerCase() === 'the') return 'The';
    if (word.toLowerCase() === 'most') return 'Most';
    if (word.toLowerCase() === 'popular') return 'Popular';
    if (word.toLowerCase() === 'early') return 'Early';
    if (word.toLowerCase() === 'maturing') return 'Maturing';
    if (word.toLowerCase() === 'ball') return 'Ball';
    if (word.toLowerCase() === 'headed') return 'Headed';
    if (word.toLowerCase() === 'variety') return 'Variety';
    if (word.toLowerCase() === 'hybrid') return 'Hybrid';
    if (word.toLowerCase() === 'excellent') return 'Excellent';
    if (word.toLowerCase() === 'heat') return 'Heat';
    if (word.toLowerCase() === 'tolerance') return 'Tolerance';
    if (word.toLowerCase() === 'high') return 'High';
    if (word.toLowerCase() === 'adaptability') return 'Adaptability';
    if (word.toLowerCase() === 'vigorous') return 'Vigorous';
    if (word.toLowerCase() === 'hardy') return 'Hardy';
    if (word.toLowerCase() === 'collard') return 'Collard';
    if (word.toLowerCase() === 'giant') return 'Giant';
    if (word.toLowerCase() === 'drum') return 'Drum';
    if (word.toLowerCase() === 'head') return 'Head';
    if (word.toLowerCase() === 'yielding') return 'Yielding';
    if (word.toLowerCase() === 'fit') return 'Fit';
    if (word.toLowerCase() === 'lakes') return 'Lakes';
    if (word.toLowerCase() === 'mesa') return 'Mesa';
    if (word.toLowerCase() === 'lettuce') return 'Lettuce';
    if (word.toLowerCase() === 'tip') return 'Tip';
    if (word.toLowerCase() === 'burn') return 'Burn';
    if (word.toLowerCase() === 'resistance') return 'Resistance';
    if (word.toLowerCase() === 'medium') return 'Medium';
    if (word.toLowerCase() === 'large') return 'Large';
    if (word.toLowerCase() === 'solid') return 'Solid';
    if (word.toLowerCase() === 'heads') return 'Heads';
    if (word.toLowerCase() === 'aroma') return 'Aroma';
    if (word.toLowerCase() === 'coriander') return 'Coriander';
    if (word.toLowerCase() === 'dhania') return 'Dhania';
    if (word.toLowerCase() === 'fast') return 'Fast';
    if (word.toLowerCase() === 'growing') return 'Growing';
    if (word.toLowerCase() === 'plants') return 'Plants';
    if (word.toLowerCase() === 'bunching') return 'Bunching';
    if (word.toLowerCase() === 'onion') return 'Onion';
    if (word.toLowerCase() === 'non') return 'Non';
    if (word.toLowerCase() === 'bulbing') return 'Bulbing';
    if (word.toLowerCase() === 'alliums') return 'Alliums';
    if (word.toLowerCase() === 'produce') return 'Produce';
    if (word.toLowerCase() === 'yummy') return 'Yummy';
    if (word.toLowerCase() === 'green') return 'Green';
    if (word.toLowerCase() === 'stems') return 'Stems';
    if (word.toLowerCase() === 'coronet') return 'Coronet';
    if (word.toLowerCase() === 'cabbage') return 'Cabbage';
    if (word.toLowerCase() === 'semi') return 'Semi';
    if (word.toLowerCase() === 'upright') return 'Upright';
    if (word.toLowerCase() === 'gold') return 'Gold';
    if (word.toLowerCase() === 'pepper') return 'Pepper';
    if (word.toLowerCase() === 'fruit') return 'Fruit';
    if (word.toLowerCase() === 'set') return 'Set';
    if (word.toLowerCase() === 'sprouting') return 'Sprouting';
    if (word.toLowerCase() === 'calabrese') return 'Calabrese';
    if (word.toLowerCase() === 'broccoli') return 'Broccoli';
    if (word.toLowerCase() === 'sized') return 'Sized';
    if (word.toLowerCase() === 'dark') return 'Dark';
    if (word.toLowerCase() === 'bonnet') return 'Bonnet';
    if (word.toLowerCase() === 'red') return 'Red';
    if (word.toLowerCase() === 'yellow') return 'Yellow';
    if (word.toLowerCase() === 'indica') return 'Indica';
    if (word.toLowerCase() === 'julie') return 'Julie';
    if (word.toLowerCase() === 'katana') return 'Katana';
    if (word.toLowerCase() === 'pumpkin') return 'Pumpkin';
    if (word.toLowerCase() === 'kaveri') return 'Kaveri';
    if (word.toLowerCase() === 'sweet') return 'Sweet';
    if (word.toLowerCase() === 'kifaru') return 'Kifaru';
    if (word.toLowerCase() === 'kilele') return 'Kilele';
    if (word.toLowerCase() === 'long') return 'Long';
    if (word.toLowerCase() === 'purple') return 'Purple';
    if (word.toLowerCase() === 'eggplant') return 'Eggplant';
    if (word.toLowerCase() === 'eggplants') return 'Eggplants';
    if (word.toLowerCase() === 'potential') return 'Potential';
    if (word.toLowerCase() === 'mak') return 'Mak';
    if (word.toLowerCase() === 'soy') return 'Soy';
    if (word.toLowerCase() === 'seed') return 'Seed';
    if (word.toLowerCase() === 'seeds') return 'Seeds';
    if (word.toLowerCase() === 'mammoth') return 'Mammoth';
    if (word.toLowerCase() === 'rock') return 'Rock';
    if (word.toLowerCase() === 'producing') return 'Producing';
    if (word.toLowerCase() === 'beautiful') return 'Beautiful';
    if (word.toLowerCase() === 'deep') return 'Deep';
    if (word.toLowerCase() === 'maradona') return 'Maradona';
    if (word.toLowerCase() === 'papayapawpaw') return 'Papaya/Pawpaw';
    if (word.toLowerCase() === 'maxim') return 'Maxim';
    if (word.toLowerCase() === 'tomato') return 'Tomato';
    if (word.toLowerCase() === 'tomatoes') return 'Tomatoes';
    if (word.toLowerCase() === 'merdan') return 'Merdan';
    if (word.toLowerCase() === 'african') return 'African';
    if (word.toLowerCase() === 'nakati') return 'Nakati';
    if (word.toLowerCase() === 'highly') return 'Highly';
    if (word.toLowerCase() === 'nutritious') return 'Nutritious';
    if (word.toLowerCase() === 'local') return 'Local';
    if (word.toLowerCase() === 'vegetable') return 'Vegetable';
    if (word.toLowerCase() === 'namuche') return 'Namuche';
    if (word.toLowerCase() === 'nouvelle') return 'Nouvelle';
    if (word.toLowerCase() === 'poornima') return 'Poornima';
    if (word.toLowerCase() === 'cauliflower') return 'Cauliflower';
    if (word.toLowerCase() === 'pusa') return 'Pusa';
    if (word.toLowerCase() === 'sawani') return 'Sawani';
    if (word.toLowerCase() === 'okra') return 'Okra';
    if (word.toLowerCase() === 'wide') return 'Wide';
    if (word.toLowerCase() === 'rambo') return 'Rambo';
    if (word.toLowerCase() === 'beauty') return 'Beauty';
    if (word.toLowerCase() === 'bugga') return 'Bugga';
    if (word.toLowerCase() === 'amaranthus') return 'Amaranthus';
    if (word.toLowerCase() === 'roma') return 'Roma';
    if (word.toLowerCase() === 'oval') return 'Oval';
    if (word.toLowerCase() === 'shape') return 'Shape';
    if (word.toLowerCase() === 'sugar') return 'Sugar';
    if (word.toLowerCase() === 'baby') return 'Baby';
    if (word.toLowerCase() === 'watermelon') return 'Watermelon';
    if (word.toLowerCase() === 'grown') return 'Grown';
    if (word.toLowerCase() === 'due') return 'Due';
    if (word.toLowerCase() === 'its') return 'Its';
    if (word.toLowerCase() === 'maturity') return 'Maturity';
    if (word.toLowerCase() === 'king') return 'King';
    if (word.toLowerCase() === 'corn') return 'Corn';
    if (word.toLowerCase() === 'sukari') return 'Sukari';
    if (word.toLowerCase() === 'swiss') return 'Swiss';
    if (word.toLowerCase() === 'chard') return 'Chard';
    if (word.toLowerCase() === 'ford') return 'Ford';
    if (word.toLowerCase() === 'hook') return 'Hook';
    if (word.toLowerCase() === 'tall') return 'Tall';
    if (word.toLowerCase() === 'spinach') return 'Spinach';
    if (word.toLowerCase() === 'utah') return 'Utah';
    if (word.toLowerCase() === 'celery') return 'Celery';
    if (word.toLowerCase() === 'crisp') return 'Crisp';
    if (word.toLowerCase() === 'stringless') return 'Stringless';
    if (word.toLowerCase() === 'tightly') return 'Tightly';
    if (word.toLowerCase() === 'folded') return 'Folded';
    if (word.toLowerCase() === 'hearts') return 'Hearts';
    if (word.toLowerCase() === 'tandi') return 'Tandi';
    if (word.toLowerCase() === 'tengeru') return 'Tengeru';
    if (word.toLowerCase() === 'round') return 'Round';
    if (word.toLowerCase() === 'terere') return 'Terere';
    if (word.toLowerCase() === 'indigenous') return 'Indigenous';
    if (word.toLowerCase() === 'leafy') return 'Leafy';
    if (word.toLowerCase() === 'assila') return 'Assila';
    if (word.toLowerCase() === 'melon') return 'Melon';
    if (word.toLowerCase() === 'pata') return 'Pata';
    if (word.toLowerCase() === 'negra') return 'Negra';
    if (word.toLowerCase() === 'yubi') return 'Yubi';
    if (word.toLowerCase() === 'pakchoy') return 'Pakchoy';
    if (word.toLowerCase() === 'chinese') return 'Chinese';
    if (word.toLowerCase() === 'zawadi') return 'Zawadi';
    if (word.toLowerCase() === 'withstands') return 'Withstands';
    if (word.toLowerCase() === 'distance') return 'Distance';
    if (word.toLowerCase() === 'transportation') return 'Transportation';
    if (word.toLowerCase() === 'gourd') return 'Gourd';
    if (word.toLowerCase() === 'palee') return 'Palee';
    if (word.toLowerCase() === 'black') return 'Black';
    if (word.toLowerCase() === 'cal') return 'Cal';
    if (word.toLowerCase() === 'j') return 'J';
    if (word.toLowerCase() === 'wonder') return 'Wonder';
    if (word.toLowerCase() === 'bamba') return 'Bamba';
    if (word.toLowerCase() === 'cayenne') return 'Cayenne';
    if (word.toLowerCase() === 'slim') return 'Slim';
    if (word.toLowerCase() === 'hot') return 'Hot';
    if (word.toLowerCase() === 'coatmeal') return 'Coatmeal';
    if (word.toLowerCase() === 'copenhagen') return 'Copenhagen';
    if (word.toLowerCase() === 'dodo') return 'Dodo';
    if (word.toLowerCase() === 'elma') return 'Elma';
    if (word.toLowerCase() === 'drumhead') return 'Drumhead';
    if (word.toLowerCase() === 'efia') return 'Efia';
    if (word.toLowerCase() === 'paper') return 'Paper';
    if (word.toLowerCase() === 'fanaka') return 'Fanaka';
    if (word.toLowerCase() === 'femi') return 'Femi';
    if (word.toLowerCase() === 'frey') return 'Frey';
    if (word.toLowerCase() === 'galia') return 'Galia';
    if (word.toLowerCase() === 'firm') return 'Firm';
    if (word.toLowerCase() === 'fruits') return 'Fruits';
    if (word.toLowerCase() === 'aromatic') return 'Aromatic';
    if (word.toLowerCase() === 'flavour') return 'Flavour';
    if (word.toLowerCase() === 'georgia') return 'Georgia';
    if (word.toLowerCase() === 'sukuma') return 'Sukuma';
    if (word.toLowerCase() === 'wiki') return 'Wiki';
    if (word.toLowerCase() === 'great') return 'Great';
    if (word.toLowerCase() === '659') return '659';
    if (word.toLowerCase() === '008') return '008';
    if (word.toLowerCase() === '43') return '43';
    if (word.toLowerCase() === '97') return '97';
    if (word.toLowerCase() === '3') return '3';
    if (word.toLowerCase() === '3n') return '3N';
    
    // Capitalize first letter of each word
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  
  return capitalizedWords.join(' ');
}

// Function to determine category based on filename
function getCategory(filename) {
  const name = filename.toLowerCase();
  
  if (name.includes('tomato') || name.includes('tomatoes')) return 'Tomato';
  if (name.includes('pepper') || name.includes('cayenne') || name.includes('habanero')) return 'Pepper';
  if (name.includes('cabbage') || name.includes('drumhead') || name.includes('copenhagen')) return 'Cabbage';
  if (name.includes('eggplant') || name.includes('eggplants')) return 'Eggplant';
  if (name.includes('watermelon') || name.includes('melon')) return 'Watermelon';
  if (name.includes('pumpkin')) return 'Pumpkin';
  if (name.includes('cucumber')) return 'Cucumber';
  if (name.includes('coriander') || name.includes('dhania')) return 'Coriander';
  if (name.includes('onion')) return 'Onion';
  if (name.includes('broccoli') || name.includes('calabrese')) return 'Broccoli';
  if (name.includes('lettuce')) return 'Lettuce';
  if (name.includes('cauliflower')) return 'Cauliflower';
  if (name.includes('okra')) return 'Okra';
  if (name.includes('amaranthus') || name.includes('terere') || name.includes('nakati')) return 'Leafy Greens';
  if (name.includes('spinach') || name.includes('chard')) return 'Spinach';
  if (name.includes('celery')) return 'Celery';
  if (name.includes('papaya') || name.includes('pawpaw')) return 'Papaya';
  if (name.includes('maize') || name.includes('corn')) return 'Maize';
  if (name.includes('barley')) return 'Barley';
  if (name.includes('soy')) return 'Soybean';
  if (name.includes('simsim')) return 'Sesame';
  if (name.includes('gourd') || name.includes('bitter')) return 'Gourd';
  if (name.includes('pakchoy') || name.includes('chinese')) return 'Chinese Cabbage';
  
  return 'Vegetable';
}

// Function to determine manufacturer based on filename
function getManufacturer(filename) {
  const name = filename.toLowerCase();
  
  if (name.includes('f1') || name.includes('hybrid')) return 'Hybrid Seed Company';
  if (name.includes('pusa')) return 'Pusa Seeds';
  if (name.includes('tengeru')) return 'Tengeru Seeds';
  if (name.includes('california') || name.includes('wonder')) return 'California Seeds';
  if (name.includes('sugar') || name.includes('baby')) return 'Sugar Baby Seeds';
  if (name.includes('roma') || name.includes('vfn')) return 'Roma Seeds';
  if (name.includes('sc') || name.includes('duma')) return 'SC Duma Seeds';
  if (name.includes('brac')) return 'BRAC Seeds';
  if (name.includes('copenhagen')) return 'Copenhagen Seeds';
  if (name.includes('california') || name.includes('wonder')) return 'California Wonder Seeds';
  if (name.includes('great') || name.includes('lakes')) return 'Great Lakes Seeds';
  if (name.includes('swiss') || name.includes('chard')) return 'Swiss Chard Seeds';
  if (name.includes('utah') || name.includes('celery')) return 'Utah Celery Seeds';
  if (name.includes('georgia') || name.includes('sukuma')) return 'Georgia Seeds';
  if (name.includes('fanaka') || name.includes('zawadi') || name.includes('kifaru') || name.includes('kilele') || name.includes('katana') || name.includes('kaveri') || name.includes('rambo') || name.includes('tandi') || name.includes('maxim') || name.includes('nouvelle') || name.includes('poornima') || name.includes('merdan') || name.includes('femi') || name.includes('galia') || name.includes('frey') || name.includes('efia') || name.includes('demon') || name.includes('dodo') || name.includes('coatmeal') || name.includes('cayenne') || name.includes('black') || name.includes('arjani') || name.includes('arjuna') || name.includes('ashley') || name.includes('anita') || name.includes('sukari') || name.includes('yubi') || name.includes('namuche') || name.includes('nakati') || name.includes('terere') || name.includes('assila') || name.includes('pata') || name.includes('negra') || name.includes('elma') || name.includes('bamba') || name.includes('palee') || name.includes('j') || name.includes('cal') || name.includes('drumhead') || name.includes('drum') || name.includes('head') || name.includes('mammoth') || name.includes('rock') || name.includes('maradona') || name.includes('papayapawpaw') || name.includes('indica') || name.includes('julie') || name.includes('mak') || name.includes('soy') || name.includes('3n') || name.includes('brac') || name.includes('seed') || name.includes('agro') || name.includes('supply') || name.includes('43') || name.includes('duma') || name.includes('sc') || name.includes('grace') || name.includes('barley') || name.includes('e107') || name.includes('simsim')) return 'Various Seed Suppliers';
  
  return 'Various Seed Suppliers';
}

// Function to generate price based on product type
function generatePrice(filename, category) {
  const name = filename.toLowerCase();
  
  // Premium hybrid varieties
  if (name.includes('f1') || name.includes('hybrid')) {
    return 'UGX 15,000 - UGX 35,000';
  }
  
  // Tomato varieties
  if (category === 'Tomato') {
    return 'UGX 8,000 - UGX 25,000';
  }
  
  // Pepper varieties
  if (category === 'Pepper') {
    return 'UGX 10,000 - UGX 30,000';
  }
  
  // Cabbage varieties
  if (category === 'Cabbage') {
    return 'UGX 12,000 - UGX 28,000';
  }
  
  // Eggplant varieties
  if (category === 'Eggplant') {
    return 'UGX 8,000 - UGX 22,000';
  }
  
  // Watermelon varieties
  if (category === 'Watermelon') {
    return 'UGX 15,000 - UGX 40,000';
  }
  
  // Pumpkin varieties
  if (category === 'Pumpkin') {
    return 'UGX 10,000 - UGX 25,000';
  }
  
  // Cucumber varieties
  if (category === 'Cucumber') {
    return 'UGX 8,000 - UGX 20,000';
  }
  
  // Coriander varieties
  if (category === 'Coriander') {
    return 'UGX 5,000 - UGX 15,000';
  }
  
  // Onion varieties
  if (category === 'Onion') {
    return 'UGX 6,000 - UGX 18,000';
  }
  
  // Broccoli varieties
  if (category === 'Broccoli') {
    return 'UGX 12,000 - UGX 30,000';
  }
  
  // Lettuce varieties
  if (category === 'Lettuce') {
    return 'UGX 8,000 - UGX 20,000';
  }
  
  // Cauliflower varieties
  if (category === 'Cauliflower') {
    return 'UGX 10,000 - UGX 25,000';
  }
  
  // Okra varieties
  if (category === 'Okra') {
    return 'UGX 6,000 - UGX 18,000';
  }
  
  // Leafy greens
  if (category === 'Leafy Greens') {
    return 'UGX 4,000 - UGX 12,000';
  }
  
  // Spinach varieties
  if (category === 'Spinach') {
    return 'UGX 6,000 - UGX 16,000';
  }
  
  // Celery varieties
  if (category === 'Celery') {
    return 'UGX 8,000 - UGX 22,000';
  }
  
  // Papaya varieties
  if (category === 'Papaya') {
    return 'UGX 20,000 - UGX 50,000';
  }
  
  // Maize varieties
  if (category === 'Maize') {
    return 'UGX 25,000 - UGX 60,000';
  }
  
  // Barley varieties
  if (category === 'Barley') {
    return 'UGX 15,000 - UGX 35,000';
  }
  
  // Soybean varieties
  if (category === 'Soybean') {
    return 'UGX 18,000 - UGX 45,000';
  }
  
  // Sesame varieties
  if (category === 'Sesame') {
    return 'UGX 12,000 - UGX 30,000';
  }
  
  // Gourd varieties
  if (category === 'Gourd') {
    return 'UGX 8,000 - UGX 20,000';
  }
  
  // Chinese cabbage varieties
  if (category === 'Chinese Cabbage') {
    return 'UGX 10,000 - UGX 25,000';
  }
  
  // Default price range
  return 'UGX 5,000 - UGX 30,000';
}

// Function to generate description based on product name and category
function generateDescription(name, category, filename) {
  const lowerName = name.toLowerCase();
  const lowerFilename = filename.toLowerCase();
  
  // Specific product descriptions based on filename
  if (lowerFilename.includes('anita_watermelon')) {
    return 'High-quality watermelon seeds for excellent fruit production.';
  }
  
  if (lowerFilename.includes('arjani_f1_eggplants')) {
    return 'F1 hybrid eggplant variety with high yield potential.';
  }
  
  if (lowerFilename.includes('arjuna_f1_pumpkin')) {
    return 'F1 hybrid pumpkin seeds for large, quality fruits.';
  }
  
  if (lowerFilename.includes('ashley_open_pollinated_cucumber')) {
    return 'Open pollinated cucumber variety with prolific productivity.';
  }
  
  if (lowerFilename.includes('bitter_gourd_palee_f1')) {
    return 'F1 hybrid bitter gourd variety for quality production.';
  }
  
  if (lowerFilename.includes('black_beauty_eggplants')) {
    return 'Black beauty eggplant variety with excellent fruit quality.';
  }
  
  if (lowerFilename.includes('cal_j_tomato')) {
    return 'Compact and determinate tomato variety suitable for processing and fresh market.';
  }
  
  if (lowerFilename.includes('california_wonder')) {
    return 'Sweet pepper variety suitable for home and market gardens.';
  }
  
  if (lowerFilename.includes('cayenne_long_slim_hot_pepper')) {
    return 'Long slim hot pepper with early maturity and high yield potential.';
  }
  
  if (lowerFilename.includes('coatmeal_coriander')) {
    return 'High-quality coriander seeds for fresh herb production.';
  }
  
  if (lowerFilename.includes('copenhagen_market_cabbage')) {
    return 'The most popular early maturing ball headed cabbage variety.';
  }
  
  if (lowerFilename.includes('drumhead_cabbage')) {
    return 'Giant drum head cabbage variety that is high yielding and market fit.';
  }
  
  if (lowerFilename.includes('e107_simsim')) {
    return 'High-quality sesame seeds for oil production.';
  }
  
  if (lowerFilename.includes('fanaka_f1_cabbage')) {
    return 'F1 hybrid cabbage with excellent heat tolerance and high adaptability.';
  }
  
  if (lowerFilename.includes('femi_f1_hybrid_eggplant')) {
    return 'F1 hybrid eggplant variety with superior quality.';
  }
  
  if (lowerFilename.includes('frey_pepper_hybrid_f1')) {
    return 'F1 hybrid pepper variety for excellent production.';
  }
  
  if (lowerFilename.includes('galia_f1_sweet_melon')) {
    return 'F1 sweet melon with firm fruits and aromatic flavour.';
  }
  
  if (lowerFilename.includes('georgia_sukuma_wiki')) {
    return 'Vigorous and hardy collard variety for leafy green production.';
  }
  
  if (lowerFilename.includes('great_lakes_mesa_659_lettuce')) {
    return 'Lettuce variety with tip burn resistance and medium large solid heads.';
  }
  
  if (lowerFilename.includes('green_aroma_coriander')) {
    return 'Coriander variety with vigorous and fast growing plants.';
  }
  
  if (lowerFilename.includes('green_bunching_onion')) {
    return 'Non-bulbing alliums that produce yummy green stems.';
  }
  
  if (lowerFilename.includes('green_coronet_f1_cabbage')) {
    return 'F1 cabbage medium large semi upright hybrid variety.';
  }
  
  if (lowerFilename.includes('green_gold_f1_pepper')) {
    return 'F1 pepper high yielding variety with excellent fruit set.';
  }
  
  if (lowerFilename.includes('green_sprouting_calabrese_broccoli')) {
    return 'Broccoli with medium sized dark green heads.';
  }
  
  if (lowerFilename.includes('habanero_red_bonnet_pepper')) {
    return 'Red bonnet habanero pepper for hot pepper production.';
  }
  
  if (lowerFilename.includes('habanero_yellow_bonnet_pepper')) {
    return 'Yellow bonnet habanero pepper for hot pepper production.';
  }
  
  if (lowerFilename.includes('indica_f1_cabbage')) {
    return 'F1 cabbage variety with excellent characteristics.';
  }
  
  if (lowerFilename.includes('julie_f1')) {
    return 'F1 hybrid variety for quality production.';
  }
  
  if (lowerFilename.includes('katana_f1_pumpkin')) {
    return 'F1 pumpkin variety for excellent fruit production.';
  }
  
  if (lowerFilename.includes('kaveri_f1_sweet_pepper')) {
    return 'F1 sweet pepper variety for quality production.';
  }
  
  if (lowerFilename.includes('kifaru_f1_red_cabbage')) {
    return 'F1 red cabbage variety for quality production.';
  }
  
  if (lowerFilename.includes('kilele_f1hybrid')) {
    return 'F1 hybrid variety for excellent production.';
  }
  
  if (lowerFilename.includes('long_purple_eggplant')) {
    return 'Long purple eggplant variety with high yield potential.';
  }
  
  if (lowerFilename.includes('mak_soy_3n_brac_seed')) {
    return 'BRAC soybean seed variety for quality production.';
  }
  
  if (lowerFilename.includes('mammoth_red_rock_red_cabbage')) {
    return 'Red cabbage producing large beautiful deep red purple heads.';
  }
  
  if (lowerFilename.includes('maradona_f1_hybrid_papayapawpaw')) {
    return 'F1 hybrid papaya/pawpaw variety for quality production.';
  }
  
  if (lowerFilename.includes('maxim_f1_tomato')) {
    return 'F1 tomato variety for excellent production.';
  }
  
  if (lowerFilename.includes('merdan_f1_african_eggplants')) {
    return 'F1 African eggplant variety for quality production.';
  }
  
  if (lowerFilename.includes('nakati_highly_nutritious_local_vegetable')) {
    return 'Highly nutritious local vegetable for healthy production.';
  }
  
  if (lowerFilename.includes('namuche_3')) {
    return 'Quality seed variety for excellent production.';
  }
  
  if (lowerFilename.includes('nouvelle_f1_tomatoes')) {
    return 'F1 tomato variety for quality production.';
  }
  
  if (lowerFilename.includes('poornima_008_f1_cauliflower')) {
    return 'F1 cauliflower variety for quality production.';
  }
  
  if (lowerFilename.includes('pusa_sawani_okra')) {
    return 'Okra variety with wide adaptability for quality production.';
  }
  
  if (lowerFilename.includes('rambo_f1_tomato_seed')) {
    return 'F1 tomato seed variety for excellent production.';
  }
  
  if (lowerFilename.includes('red_beauty')) {
    return 'Red beauty variety for quality production.';
  }
  
  if (lowerFilename.includes('red_bugga_amaranthus')) {
    return 'Red bugga amaranthus for leafy green production.';
  }
  
  if (lowerFilename.includes('roma_vfn_high_yielding_determinate_oval_shape_tomato')) {
    return 'High yielding determinate oval shape tomato variety.';
  }
  
  if (lowerFilename.includes('sc_duma_43_maize_seed_agro_supply')) {
    return 'SC Duma 43 maize seed for quality grain production.';
  }
  
  if (lowerFilename.includes('sugar_baby_most_popular_and_grown_watermelon')) {
    return 'Most popular and grown watermelon variety due to its early maturity.';
  }
  
  if (lowerFilename.includes('sugar_king_sweet_corn')) {
    return 'Sweet corn variety for quality grain production.';
  }
  
  if (lowerFilename.includes('sukari_f1_watermelon')) {
    return 'F1 watermelon variety for excellent fruit production.';
  }
  
  if (lowerFilename.includes('swiss_chard_ford_hook_giant')) {
    return 'Tall and vigorous spinach variety for leafy green production.';
  }
  
  if (lowerFilename.includes('tall_utah_celery')) {
    return 'Celery variety with crisp stringless green tightly folded hearts.';
  }
  
  if (lowerFilename.includes('tandi_f1_tomato')) {
    return 'F1 tomato variety for quality production.';
  }
  
  if (lowerFilename.includes('tengeru_97_determinate_round_tomato')) {
    return 'Determinate round tomato with high yield potential.';
  }
  
  if (lowerFilename.includes('terere_amaranthus_indigenous_highly_nutritious_green_leafy_vegetable')) {
    return 'Indigenous highly nutritious green leafy vegetable.';
  }
  
  if (lowerFilename.includes('tomato_assila')) {
    return 'Assila tomato variety for quality production.';
  }
  
  if (lowerFilename.includes('water_melon_pata_negra')) {
    return 'Pata negra watermelon variety for quality production.';
  }
  
  if (lowerFilename.includes('yubi_f1_pakchoy_chinese_cabbage')) {
    return 'F1 pakchoy Chinese cabbage variety for quality production.';
  }
  
  if (lowerFilename.includes('zawadi_f1_cabbage')) {
    return 'F1 cabbage high yielding variety that withstands long distance transportation.';
  }
  
  // Generic descriptions based on category
  if (category === 'Tomato') {
    return 'High-quality tomato seeds for excellent fruit production.';
  }
  
  if (category === 'Pepper') {
    return 'Premium pepper seeds for quality fruit production.';
  }
  
  if (category === 'Cabbage') {
    return 'Quality cabbage seeds for excellent head formation.';
  }
  
  if (category === 'Eggplant') {
    return 'High-quality eggplant seeds for superior fruit production.';
  }
  
  if (category === 'Watermelon') {
    return 'Premium watermelon seeds for sweet, juicy fruits.';
  }
  
  if (category === 'Pumpkin') {
    return 'Quality pumpkin seeds for large, nutritious fruits.';
  }
  
  if (category === 'Cucumber') {
    return 'High-quality cucumber seeds for crisp, fresh produce.';
  }
  
  if (category === 'Coriander') {
    return 'Premium coriander seeds for aromatic herb production.';
  }
  
  if (category === 'Onion') {
    return 'Quality onion seeds for excellent bulb formation.';
  }
  
  if (category === 'Broccoli') {
    return 'High-quality broccoli seeds for nutritious head production.';
  }
  
  if (category === 'Lettuce') {
    return 'Premium lettuce seeds for fresh, crisp leaves.';
  }
  
  if (category === 'Cauliflower') {
    return 'Quality cauliflower seeds for excellent head formation.';
  }
  
  if (category === 'Okra') {
    return 'High-quality okra seeds for tender pod production.';
  }
  
  if (category === 'Leafy Greens') {
    return 'Premium leafy green seeds for nutritious vegetable production.';
  }
  
  if (category === 'Spinach') {
    return 'Quality spinach seeds for healthy leafy green production.';
  }
  
  if (category === 'Celery') {
    return 'High-quality celery seeds for crisp stalk production.';
  }
  
  if (category === 'Papaya') {
    return 'Premium papaya seeds for sweet, tropical fruit production.';
  }
  
  if (category === 'Maize') {
    return 'Quality maize seeds for excellent grain production.';
  }
  
  if (category === 'Barley') {
    return 'High-quality barley seeds for grain production.';
  }
  
  if (category === 'Soybean') {
    return 'Premium soybean seeds for protein-rich crop production.';
  }
  
  if (category === 'Sesame') {
    return 'Quality sesame seeds for oil and grain production.';
  }
  
  if (category === 'Gourd') {
    return 'High-quality gourd seeds for nutritious vegetable production.';
  }
  
  if (category === 'Chinese Cabbage') {
    return 'Premium Chinese cabbage seeds for quality head production.';
  }
  
  return 'High-quality seed variety for agricultural use.';
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
let jsCode = '  const seedProducts = useMemo(() => [\n';
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

console.log('Generated seed products:', products.length);
console.log('\nJavaScript code for products array:');
console.log(jsCode);

// Write to file
fs.writeFileSync('/home/darksagae/Desktop/agrof-main/seeds_products_generated.js', jsCode);
console.log('\nGenerated code written to seeds_products_generated.js');
