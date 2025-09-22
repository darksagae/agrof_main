// Create complete herbicideProducts array with all 54 products
const fs = require('fs');
const path = require('path');

const herbicideSimplePath = '/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/HERBICIDES_SIMPLE';
const files = fs.readdirSync(herbicideSimplePath);

// Product names mapping (simplified from folder names)
const productNames = [
  '2,4D Amine 720Gl - Selective Herbicide For Weed Control In Cereals Maize Sorghum Grassland And Established Tur',
  'Agriforce',
  'Ametryne 50% - Selective Post-emergence Herbicide For Weed Control In Pineapple, Sugarcane, Bananas And Plantains',
  'Amino Force',
  'Auxo EC – Selective Herbicide For Weed Control In Maize',
  'Basagran 480 Sl – Herbicide For Weed Control In Dry Beans, Maize And Potato',
  'Bastnate 200Sl – Non-selective Herbicide For The Control Of Annual And Perennial Broad-leafed Weeds',
  'Beans Clean',
  'Beansclean Super',
  'Buta Force',
  'Butanil-70 - Selective Pre-and Post-emergence Herbicide Weed Control In Rice',
  'Butanil S - Pre-emergence Herbicide For Weed Control In Rice, Maize, Groundnuts, Wheat, Soy Bean And Beans',
  'Clean Force',
  'Cleanspray 720 Sl – Herbicide For Weed Control In Wheat, Maize, Rice And Plantation Crops',
  'D-amine 720% Sl',
  'Dualgold 960 Ec - Herbicide For Control Of Annual Grass Weeds In Maize',
  'Excel Glycel',
  'Fennut 120 Sl',
  'Force Top',
  'Force Up',
  'Force Up – Granular',
  'Fusilade Forte 150 Ec- Post Emergence Herbicide For Use In Snow Peas And French Beans',
  'Glufosun – Herbicide For Post Emergence Weed Control In Plantations',
  'Glyphocel 48%',
  'Hang Ametryn 50 Sc',
  'Hangzhou 2-4D Amine',
  'Hasunil 160 Ec',
  'Herbkill 720 Sl',
  'Huskie 256 Ec - Herbicide For The Control Of Broadleaf Weeds In Wheat And Barley',
  'Jembe - Non-selective Herbicide For Control Herbaceous Weeds',
  'Lumax 537.5 Se – Herbicide For Weed Control In Sugarcane And Maize',
  'Maguguma',
  'Maize Succeed-herbicide',
  'Megazine (Atrizine) 500 Sc',
  'Metoneflagon',
  'Metrazin - Pre And Post-emergence Herbicide For Weed Control In Maize',
  'Oxyfen 24 Ec',
  'Oxygold 24 Ec',
  'Piko – Systemic Herbicide For Control Of Broad Leaf Weeds, Tree Stump Regrowth, Woody Plants And Vines',
  'Potasun 50 Ec',
  'Primagram Gold 660 Sc - A Herbicide For The Control Of Annual Grass Weeds In Maize',
  'Ralon Super Ew 144 – Herbicide For Weed Control In Wheat And Barley',
  'Round Up',
  'Roundup Turbo',
  'Servian 75 Wg - Selective Early Post-emergence Herbicide',
  'Sicometryn 500 Sc - Pre And Post-emergence Herbicide For The Control Of Most Annual Grasses And Broad Leaved',
  'Stellar Star – Post Emergence Herbicide For Weed Control In Maize',
  'Stomp 455 Cs – Pre-emergent Herbicide',
  'Super Weeder (Glyphosate 480 Sl)',
  'Weedall',
  'Weedmaster 75.7 Xl – Non Selective Herbicide For General Weed Control',
  'Wound-out 480 Sl',
  'Zonex 10 Sc – Post-emergence Herbicide For Weed Control In Rice',
  'Zoomer'
];

console.log('  const herbicideProducts = [');

files.forEach((file, index) => {
  const nameWithoutExt = file.replace(/\.[^/.]+$/, "");
  const productName = productNames[index] || `Herbicide Product ${index + 1}`;
  
  console.log(`    {`);
  console.log(`      id: ${index + 1},`);
  console.log(`      name: '${productName}',`);
  console.log(`      image: herbicideImages['${nameWithoutExt}'],`);
  console.log(`      description: 'Agricultural herbicide for effective weed control.',`);
  console.log(`      price: 'Contact for pricing',`);
  console.log(`      packaging: 'Contact for pricing',`);
  console.log(`      category: 'Herbicide',`);
  console.log(`      manufacturer: 'Contact for details',`);
  console.log(`      activeIngredient: 'Contact for details',`);
  console.log(`      formulation: 'Contact for details',`);
  console.log(`      targetCrops: 'Contact for details',`);
  console.log(`      targetWeeds: 'Contact for details',`);
  console.log(`      applicationMethod: 'Contact for details',`);
  console.log(`      preHarvestInterval: 'Contact for details'`);
  console.log(`    }${index < files.length - 1 ? ',' : ''}`);
});

console.log('  ];');
console.log('');
console.log(`// Total products: ${files.length}`);
