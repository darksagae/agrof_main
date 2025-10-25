/**
 * Import Herbicide Products with Real Images to Database
 * Based on source data - 55 products with real images
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const db = new sqlite3.Database('./store-backend/store.db');
const herbicideDir = './agrof-main/mobile/app/assets/store/HERBICIDE';

// Complete herbicide data from source (first 30 products)
const herbicideData = {
  "Auxo Ec – Selective Herbicide For Weed Control In Maize": {
    supplier: "Uganda Crop Care Limited",
    price: 126500,
    packages: "5ltrs: UGX 605,600 | 1ltr: UGX 126,500",
    details: "Auxo EC is a post-emergence herbicide for control of Grasses & Broadleaf weeds in Maize varieties grown in mid and high altitudes only. Active Ingredients: Tembotrione 50g/l + Bromoxynil Octanoate 262g/l."
  },
  "Stomp 455 Cs – Pre-emergent Herbicide": {
    supplier: "Uganda Crop Care Limited",
    price: 523700,
    packages: "10 Ltr: UGX 523,700",
    details: "Stomp 455 CS is a pre-emergent herbicide for the control of Setaria spp. in barley, annual grasses and some broad leaf weeds in wheat, sugarcane and maize. Active Ingredient: Pendimethalin 455 g/l."
  },
  "Fusilade Forte 150 Ec- Post Emergence Herbicide For Use In Snow Peas And French Beans": {
    supplier: "Uganda Crop Care Limited",
    price: 153600,
    packages: "1ltr: UGX 153,600",
    details: "Fusilade Forte is a superior post emergence grass weed herbicide which is used in fruits and vegetables. Apply at a recommended rate of 150ml/20L of water, 1.5l/Ha or 600ml per Acre. Active ingredient: Fluazifop-p-butyl 150 g/l"
  },
  "Basagran 480 Sl – Herbicide For Weed Control In Dry Beans, Maize And Potato": {
    supplier: "Uganda Crop Care Limited",
    price: 305200,
    packages: "5 Ltr: UGX 305,200",
    details: "Basagran 480 SL is a post-emergence Herbicide for the control of Broad leaf weeds in dry beans, maize and potato. Active Ingredient: Bentazone 480 g/l."
  },
  "Dualgold 960 Ec - Herbicide For Control Of Annual Grass Weeds In Maize": {
    supplier: "Uganda Crop Care Limited",
    price: 392300,
    packages: "5 Ltrs: UGX 392,300",
    details: "Dual Gold 960 EC is a pre-emergence herbicide for the control of annual grass weeds in beans, maize and sugarcane. Active ingredient: 960g/L S-metolachlor."
  },
  "Sicometryn 500 Sc - Pre And Post-emergence Herbicide For The Control Of Most Annual Grasses And Broad Leaved": {
    supplier: "Syova Seed (U) Ltd",
    price: 14800,
    packages: "500 mls: UGX 14,800 | 1 Ltr: UGX 41,800",
    details: "Sicometryn 500 SC is a pre and post-emergence herbicide for the control of most annual grasses and broad leaved weeds in Pineapples, Sugarcane, banana, cotton, maize and non-crop land. Active ingredient: Ametryn 500g/ltr."
  },
  "Megazine (Atrizine) 500 Sc": {
    supplier: "Nsanja Agrochemicals Ltd",
    price: 25500,
    packages: "1 Ltr: UGX 25,500",
    details: "A suspension concentrated herbicide for the control of annual broadleaf weeds and grasses in maize sorghum and sugarcane. Dosage: Maize and Sorghum: Use 200ml/20 Ltr water (2.5-5 Ltr/Ha)."
  },
  "Ralon Super Ew 144 – Herbicide For Weed Control In Wheat And Barley": {
    supplier: "Uganda Crop Care Limited",
    price: 728500,
    packages: "5 Ltrs: UGX 728,500",
    details: "Ralon Super EW 144 is a selective post -emergence systemic herbicide for the control of annual grasses in Wheat and Barley. Active Ingredients: Fenoxyprop-P-ethyl 69g/l + Mefenpyr-diethyl 75g/kg"
  },
  "Excel Glycel": {
    supplier: "Twiga Chemical Industries (U) Ltd",
    price: 29700,
    packages: "1 Ltr: UGX 29,700",
    details: "Glycel is a systemic, broad spectrum, non-selective post emergent herbicide. It is effective in controlling all weeds including annuals, perennials, grassy, broadleaf weeds and sedges. Active ingredient: Glyphosate 48% SL (IPA Salt)"
  },
  "Wound-out 480 Sl": {
    supplier: "Osho Chemical Industries Ltd",
    price: 25300,
    packages: "1ltr: UGX 25,300 | 20ltr J/Can: UGX 239,400",
    details: "This is a broad spectrum non-selective post-emergence herbicide used to kill all greases and broad leaf weeds plus nut sedges. Mixing: 200mls per 20ltrs of water. Application rate: 1.2ltrs per acre. Active Ingredient: Glyphosate."
  },
  "Stellar Star – Post Emergence Herbicide For Weed Control In Maize": {
    supplier: "Uganda Crop Care Limited",
    price: 189500,
    packages: "1 Ltr: UGX 189,500",
    details: "Stellar Star is a broad-spectrum, post-emergence maize herbicide with the widest flexibility of application. Active Ingredients: Topramezone 50g/l + Dicamba 160g/L. Dosage: 100mls/20ltrs of water. Rate of application: 400mls per acre"
  },
  "Beans Clean": {
    supplier: "Hangzhou Agrochemicals (U) Ltd",
    price: 23900,
    packages: "1Litre: UGX 43,600 | 500ml: UGX 23,900",
    details: "Selective weed killer for beans and soya"
  },
  "Huskie 256 Ec - Herbicide For The Control Of Broadleaf Weeds In Wheat And Barley": {
    supplier: "Uganda Crop Care Limited",
    price: 187500,
    packages: "5ltrs: UGX 187,500",
    details: "Huskie 256 EC is a post emergence herbicide for the control of Broadleaf weeds in Wheat and Barley. Active Ingredients: Pyrasulfotole 27.5g/l + Bromoxynil 210g/l + Mefenpyr diethyl 9.39g/l."
  },
  "Lumax 537.5 Se – Herbicide For Weed Control In Sugarcane And Maize": {
    supplier: "Uganda Crop Care Limited",
    price: 82000,
    packages: "5 Ltr: UGX 385,000 | 1 Ltr: UGX 82,000",
    details: "Lumax 537.5 SE is a selective herbicide for pre- and early post-emergence control of grasses and broad leaf weeds in sugarcane and maize. Rate of application: 1.6ltrs/acre. Active Ingredients: 125g/L Terbuthylazine + 7.5g/L Mesotrione + 375 g/L S-metolachlor"
  },
  "Super Weeder (Glyphosate 480 Sl)": {
    supplier: "Agrifarm Uganda",
    price: 20000,
    packages: "1 Ltr: UGX 20,000 | 20 Ltr: UGX 489,500",
    details: "It's a leaf herbicide that gives long-lasting control of many kinds of grass, sedges, broadleaf weeds and woody species in cropland, industrial and non-cropped areas. Dosage: 3-4 Litres per Ha. Composition: Glyphosate 480g/L"
  },
  "Hangzhou 2-4D Amine": {
    supplier: "Hangzhou Agrochemicals (U) Ltd",
    price: 16000,
    packages: "1 Ltr: UGX 16,000 | 20 Ltr: UGX 280,000",
    details: "Herbicide for broad leaved annual and perennial weeds. Mixing: 100mls/20ltr. Available in 20ltr and 1ltr pack"
  },
  "Hang Ametryn 50 Sc": {
    supplier: "Hangzhou Agrochemicals (U) Ltd",
    price: 25000,
    packages: "1 Ltr: UGX 25,000 | 20 Ltr: UGX 450,000",
    details: "Selective post-emergence herbicide for weed control in pineapples. Mixing: 200mls/20ltr. Available in 20ltr and 1ltr"
  },
  "Beansclean Super": {
    supplier: "Hangzhou Agrochemicals (U) Ltd",
    price: 22000,
    packages: "1 Ltr: UGX 41,000 | 500 ml: UGX 22,000",
    details: "Selective post-emergence herbicide for weed control in beans and soybeans. Mixing: 200mls/20ltr. Available in 1ltr and 500mls pack."
  },
  "Piko – Systemic Herbicide For Control Of Broad Leaf Weeds, Tree Stump Regrowth, Woody Plants And Vines": {
    supplier: "Bukoola Chemical Industries (U) Ltd",
    price: 32000,
    packages: "500 mls: UGX 32,000 | 1 Ltr: UGX 60,000",
    details: "A systemic, persistent herbicide used for control of unwanted annual and perennial broad leaf weeds, woody plants and vines on forest planting sites and non-agricultural sites. Mixing: 2 ltrs per 20 ltrs of water."
  },
  "Herbkill 720 Sl": {
    supplier: "Nsanja Agrochemicals Ltd",
    price: 14000,
    packages: "1 Ltr: UGX 14,000 | 20 Ltr: UGX 209,000",
    details: "A selective herbicide for control of a range of broadleaf weeds in cereals and pasture. Dosage: Wheat and barley: 1.1-1.7ltrs/Ha, Mixing:110mls/20ltrs of water"
  },
  "Glyphocel 48%": {
    supplier: "Export Trading Group",
    price: 13750,
    packages: "1 Ltr: UGX 13,750 | 20 Ltr: UGX 240,000",
    details: "It is a non-selective, post-emerge herbicide that provides tough, long-lasting control of a broad spectrum of annual, biennial, and perennial grasses & broadleaf weeds. Dosage: 150mls-200mls/20L (1.5L-2L/Acre), Active Ingredient: Glyphosate IPA (Isopropyl-amine salt 480g/L)."
  },
  "Maguguma": {
    supplier: "Hangzhou Agrochemicals (U) Ltd",
    price: 31000,
    packages: "1 Ltr: UGX 31,000 | 20 Ltr: UGX 585,100",
    details: "Selective herbicide for control of weeds in Maize. Mixing: 200mls per 20ltr. Available in 20ltr and 1ltr pack."
  },
  "Hasunil 160 Ec": {
    supplier: "Hangzhou Agrochemicals (U) Ltd",
    price: 18000,
    packages: "1 Ltr: UGX 33,000 | 500 mls: UGX 18,000",
    details: "Selective post-emergence herbicide for weed control in rice. Mixing: 200mls/20ltr. Available in 1ltr pack"
  },
  "Metoneflagon": {
    supplier: "Hangzhou Agrochemicals (U) Ltd",
    price: 13000,
    packages: "100mls: UGX 13,000",
    details: "Selective post-emergence herbicide for weed control in carrots. Mixing: 100mls/20ltr. Available in 100mls pack."
  },
  "Round Up": {
    supplier: "Balton Uganda Ltd",
    price: 30500,
    packages: "1ltr: UGX 30,500 | 20ltr J/Can: UGX 205,200",
    details: "Roundup Herbicide is a non-selective, systemic weed killer with glyphosate as its active ingredient. It kills a wide range of weeds by inhibiting essential plant enzymes."
  },
  "Roundup Turbo": {
    supplier: "Balton Uganda Ltd",
    price: 810000,
    packages: "20ltr J/Can: UGX 810,000",
    details: "Roundup®️ TURBO is a soluble concentrate containing 450 g/ℓ glyphosate, present as 607 g/ℓ of the potassium salt of glyphosate. It contains 25% more active ingredients than the standard Roundup 360 formulation."
  },
  "Maize Succeed-herbicide": {
    supplier: "Balton Uganda Ltd",
    price: 49000,
    packages: "1ltr: UGX 49,000",
    details: "Early Post-Emergence herbicide for the control of broad-leaf and grass weeds in maize"
  },
  "Primagram Gold 660 Sc - A Herbicide For The Control Of Annual Grass Weeds In Maize": {
    supplier: "Uganda Crop Care Limited",
    price: 71000,
    packages: "5 Ltrs: UGX 320,000 | 1 Ltr: UGX 71,000",
    details: "Primagram Gold 660 SC is a pre-emergence herbicide for broad-spectrum annual weed control in maize. Active Ingredient: 290 g/L S-metolachlor + 370 g/L Atrazine. Mixing: 300mls/20ltrs of water. Rate of use: 3 L / Ha or 1.2 L / acre"
  },
  "Clean Force": {
    supplier: "Jubaili Agrotec Limited",
    price: 22470,
    packages: "1 Ltr: UGX 22,470 | 20 Ltrs: UGX 365,940",
    details: "Selective post -emergence herbicide used to control weeds in pineapple, Sugarcanes, bananas, Citrus, Cassava, tea, Cocoa and Palm oil. Active ingredient: Ametryn 50 % SC, Rate of use: 3L/ha, Mixing: 150 ml/20ltrs of water."
  },
  "Force Top": {
    supplier: "Jubaili Agrotec Limited",
    price: 27000,
    packages: "1 Ltr: UGX 27,000",
    details: "Selective pre emergence herbicide used to control weeds in rice, vegetables, leguminous crops, Active ingredient: Pendemethlin 33%, Rate of use: 4L/ha, Mixing: 200 ml/20ltrs of water."
  },
  "Oxygold 24 Ec": {
    supplier: "Osho Chemical Industries Ltd",
    price: 10700,
    packages: "1ltr: UGX 60,000 | 100 mls: UGX 10,700",
    details: "OXYGOLD 24 EC is a selective pre-emergence herbicide for controlling broadleaf weeds and annual grasses in Tomato, Cabbage and onions. Apply before weed emergence. Mixing: 50mls per 20ltrs of water. Application rate: 300-500mls per Acre."
  },
  "Amino Force": {
    supplier: "Jubaili Agrotec Limited",
    price: 6955,
    packages: "1ltr: UGX 12,305 | 500 mls: UGX 6,955",
    details: "Selective post -emergence herbicide used to control weeds in rice, maize, sorghum, sugarcane & wheat, Active ingredient: 2,4D amine 720 g /L SL, Rate of use: 1-3 L/ha, Mixing: 150 ml/20ltrs of water."
  },
  "D-amine 720% Sl": {
    supplier: "Osho Chemical Industries Ltd",
    price: 18150,
    packages: "1 Ltr: UGX 18,150 | 20 Ltr J/Can: UGX 251,900",
    details: "D-AMINE 720% is a systemic, selective post-emergence herbicide for the control of annual and perennial broad-leaved weeds in Maize, Rice, wheat, sorghum, sugarcane, orchards, forestry and non-crop land. Mixing: 120-150mls per 20ltrs of water. Active Ingredient: Dimethyl Amine Salt of 2,4 D-Dichlorophenyl"
  },
  "Zonex 10 Sc – Post-emergence Herbicide For Weed Control In Rice": {
    supplier: "Agritab Uganda Limited",
    price: 43600,
    packages: "1 Ltr: UGX 43,600",
    details: "Zonex 10 SC is a post emergence herbicide with contact action for the control of a wide range of annual and broadleaf weeds. Active Ingredient: Bispyribac sodium 100g/L. Mixing/Dosage: Grasses, sedges and broadleaf weeds; 7.5-10mls/10ltrs of water."
  },
  "Agriforce": {
    supplier: "Jubaili Agrotec Limited",
    price: 7100,
    packages: "100 mls: UGX 7,100",
    details: "Selective post-emergence herbicide used to control grasses, broad -leaved weeds in rice, Active ingredient: Bispyribac sodium 10 %, Rate of use: 400 ml/ha, Mixing: 25 ml/20ltrs of water"
  },
  "Cleanspray 720 Sl – Herbicide For Weed Control In Wheat, Maize, Rice And Plantation Crops": {
    supplier: "Uganda Crop Care Limited",
    price: 14800,
    packages: "1 Ltr: UGX 14,800",
    details: "Cleanspray 720 SL is a selective systemic herbicide used to control broad leaved weeds in wheat, maize, rice and plantation crops like rubber, oil palm and sugarcane. Active Ingredient: 2,4-Dynethylamine Salt 720g/ltr. Dosage: 150mls/20ltrs of water."
  },
  "Zoomer": {
    supplier: "Balton Uganda Ltd",
    price: 48400,
    packages: "1ltr: UGX 48,400",
    details: "Zoomer is a non-selective, contact and systemic herbicide with foliar and soil activity. It has broad spectrum activity on grasses, sedges & broad-leaved weeds. It can be used as post emergence application on non-crop, Orchard and plantation crops. Rate: Tea- 800mls/acre. Mixing: 125mls/20ltrs of water."
  },
  "Weedall": {
    supplier: "Hangzhou Agrochemicals (U) Ltd",
    price: 15000,
    packages: "1 Ltr: UGX 15,000 | 20 Ltr: UGX 230,000",
    details: "Systematic non-selective herbicide for control of grasses in land preparation. Mixing: 200mls per 20ltr. Available in 20ltr and 1ltr pack"
  },
  "Force Up": {
    supplier: "Jubaili Agrotec Limited",
    price: 8000,
    packages: "500 mls: UGX 8,000 | 5 Ltr: UGX 60,990",
    details: "Non selective, Systemic herbicide used to control grasses, broad leaved weeds, Active ingredient: Glyphosate 480 % SL, Rate of use: 4 L/ha, Mixing: 200 ml/20ltrs of water."
  },
  "Force Up – Granular": {
    supplier: "Jubaili Agrotec Limited",
    price: 4173,
    packages: "250 gms: UGX 4,875 | 70 gms: UGX 4,173",
    details: "Non selective, Systemic herbicide used to control grasses, broad leaved weeds, Active ingredient: Glyphosate 75.5 % WG, Rate of use: 1.5 kg/ha, Mixing: 70 g/20ltrs of water."
  },
  "Oxyfen 24 Ec": {
    supplier: "Hangzhou Agrochemicals (U) Ltd",
    price: 9000,
    packages: "1 Ltr: UGX 50,000 | 500 mls: UGX 30,000 | 100 mls: UGX 9,000 | 250 gms: UGX 18,000",
    details: "Selective post-emergence herbicide for weed control in onions. Mixing: 40mls/20ltr. Available in 1ltr and 100mls pack."
  },
  "Metrazin - Pre And Post-emergence Herbicide For Weed Control In Maize": {
    supplier: "Bukoola Chemical Industries (U) Ltd",
    price: 16000,
    packages: "1 Ltr: UGX 30,000 | 500 mls: UGX 16,000",
    details: "Metrazin is used to prevent pre and post-emergence broadleaf weeds in crops such as maize (corn) and sugarcane. This product effectively controls weeds such as black jack, thistle, ergonica and many more."
  },
  "Glufosun – Herbicide For Post Emergence Weed Control In Plantations": {
    supplier: "Bukoola Chemical Industries (U) Ltd",
    price: 11000,
    packages: "1 Ltr: UGX 20,000 | 500 ml: UGX 11,000",
    details: "This is a herbicide used for non-residual post emergence control of broadleaf and grass weeds before planting or prior to emergence of select crops. Glufosun is also used to control weeds in tree crops, bananas, cassava, coffee and many others. Dosage: 100-120ml in 20L of water."
  },
  "Bastnate 200Sl – Non-selective Herbicide For The Control Of Annual And Perennial Broad-leafed Weeds": {
    supplier: "Uganda Crop Care Limited",
    price: 19000,
    packages: "1 Ltr: UGX 38,000 | 500ml: UGX 19,000",
    details: "Bastnate 200SL is a non-selective herbicide for the control of annual and perennial broad-leafed weeds and annual grasses in agricultural, non-crop areas and industrial areas. Active Ingredient: Glufosinate ammonium 200g/L/. Dosage: 100mls/20ltrs of water."
  },
  "Potasun 50 Ec": {
    supplier: "Hangzhou Agrochemicals (U) Ltd",
    price: 26000,
    packages: "1 Ltr: UGX 48,000 | 500 mls: UGX 26,000",
    details: "Selective post-emergence herbicide for weed control in Irish potatoes. Mixing: 200mls/20ltr. Available in 1ltr pack"
  },
  "Ametryne 50% - Selective Post-emergence Herbicide For Weed Control In Pineapple, Sugarcane, Bananas And Plantains": {
    supplier: "Bukoola Chemical Industries (U) Ltd",
    price: 22500,
    packages: "1 Ltr: UGX 22,500",
    details: "Ametryne is a selective herbicide for control of broadleaf and grass weeds in pineapple, sugarcane, bananas and plantains. Applications may be made pre-emergence or and post-emergence. Dosage: Mix 200-250ml of Ametryne per 20L of water."
  },
  "Servian 75 Wg - Selective Early Post-emergence Herbicide": {
    supplier: "Uganda Crop Care Limited",
    price: 110000,
    packages: "50gms: UGX 110,000",
    details: "Servian is a selective early post-emergence herbicide for control of yellow nutsedge and purple nutsedges and certain broadleaf weeds in barley, wheat, maize and sugarcane. Active Ingredient: 750g/kg Halosulfuron-methyl. Rate of Application: Apply 50g/ha"
  },
  "Butanil S - Pre-emergence Herbicide For Weed Control In Rice, Maize, Groundnuts, Wheat, Soy Bean And Beans": {
    supplier: "Bukoola Chemical Industries (U) Ltd",
    price: 30000,
    packages: "1 ltr: UGX 30,000",
    details: "Butanil S is a strong and effective selective pre-emergence herbicide used for weed control in rice, maize, groundnuts, wheat, soy bean and Beans. Butanil-S works by inhibiting protein synthesis. Mix 150-200ml of Butanil-S in 20L of water."
  },
  "Buta Force": {
    supplier: "Jubaili Agrotec Limited",
    price: 29000,
    packages: "1 Ltr: UGX 29,000",
    details: "Selective pre emergence herbicide used to control weeds in rice, cotton, peanut, cabbage, Active ingredient: Butachlor 50 % SL, Rate of use: 2-4L /ha, Mixing: 80-120 ml/20ltrs of water."
  },
  "Jembe - Non-selective Herbicide For Control Herbaceous Weeds": {
    supplier: "Bukoola Chemical Industries (U) Ltd",
    price: 5750,
    packages: "500 mls: UGX 5,750 | 1 Ltr: UGX 13,000",
    details: "JEMBE is a water-soluble non-selective herbicide that mixes well with water to be applied as a foliar spray for the control of most herbaceous plants. Mixing/dosage: Half fill the spray tank with clean water and add 150-200mls of JEMBE in a 15 to 20ltrs respectively."
  },
  "2,4D Amine 720Gl - Selective Herbicide For Weed Control In Cereals Maize Sorghum Grassland And Established Tur": {
    supplier: "Bukoola Chemical Industries (U) Ltd",
    price: 6700,
    packages: "500 mls: UGX 6,700 | 1 Ltr: UGX 12,000",
    details: "2,4D Amine systemic herbicide readily absorbed by foliage accumulating at growing points of shoots and roots to inhibit further growth of broad leaf weeds. Used for post emergence control of annual and perennial broad leaf weeds in cereals, Maize, Sorghum, Grasslands, established turf."
  },
  "Weedmaster 75.7 Xl – Non Selective Herbicide For General Weed Control": {
    supplier: "Bukoola Chemical Industries (U) Ltd",
    price: 7000,
    packages: "250 g: UGX 7,000 | 500 g: UGX 13,000",
    details: "WeedMaster 75.7 XL is the most widely used agricultural herbicide for general weed control. WeedMaster 75.7 XL effectively controls brushes, soft annual weeds and stubborn perennial weeds and grasses like spear, couch and star grasses. Mix 80-100g of Weedmaster XL per 20L of water."
  },
  "Fennut 120 Sl": {
    supplier: "Hangzhou Agrochemicals (U) Ltd",
    price: 31000,
    packages: "500 mls: UGX 31,000",
    details: "Selective post-emergence herbicide for weed control in groundnuts. Mixing: 200mls/20ltr. Available in 500mls pack"
  },
  "Butanil-70 - Selective Pre-and Post-emergence Herbicide Weed Control In Rice": {
    supplier: "Bukoola Chemical Industries (U) Ltd",
    price: 29000,
    packages: "1 Ltr: UGX 29,000",
    details: "butanil-70 is a selective Pre and post-emergence herbicide for control of weeds in rice. It is used against numerous grasses and broadleaved weeds in rice and wheat. Dosage: 200-250ml of Butanil-70 per 20L of water."
  }
};

console.log('='.repeat(60));
console.log('UPDATING HERBICIDE PRODUCTS IN DATABASE');
console.log('='.repeat(60));
console.log();

// Get herbicide category ID
db.get("SELECT id FROM categories WHERE name LIKE '%herbicide%'", (err, category) => {
  if (err || !category) {
    console.error('❌ Herbicide category not found!');
    db.close();
    return;
  }

  const categoryId = category.id;
  console.log(`✅ Herbicide category ID: ${categoryId}\n`);

  // Get products with real images (not UUID)
  const folders = fs.readdirSync(herbicideDir).filter(f => 
    fs.statSync(path.join(herbicideDir, f)).isDirectory()
  );

  let updated = 0;
  let skipped = 0;

  folders.forEach((folder, index) => {
    const productDir = path.join(herbicideDir, folder);
    const imageFiles = fs.readdirSync(productDir)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    
    if (imageFiles.length === 0) {
      console.log(`[${index + 1}/${folders.length}] ⏭️  No image: ${folder.substring(0, 50)}...`);
      skipped++;
      return;
    }

    const imageName = imageFiles[0];
    
    // Skip UUID placeholders
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg)$/i.test(imageName)) {
      console.log(`[${index + 1}/${folders.length}] ⏭️  UUID placeholder: ${folder.substring(0, 40)}...`);
      skipped++;
      return;
    }

    // Get pricing data for this product
    const productInfo = herbicideData[folder];
    
    if (!productInfo) {
      console.log(`[${index + 1}/${folders.length}] ⏭️  No source data: ${folder.substring(0, 40)}...`);
      skipped++;
      return;
    }

    const imageUrl = `/images/HERBICIDE/${encodeURIComponent(folder)}/${imageName}`;
    
    // Update or insert product
    db.run(`
      INSERT OR REPLACE INTO products (
        category_id, name, description, price, 
        selling_price, quantity_in_stock,
        unit_of_measure, supplier_name, image_url, availability
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      categoryId,
      folder,
      productInfo.details,
      `UGX ${productInfo.price.toLocaleString()}`,
      productInfo.price,
      100,
      productInfo.packages.split('|')[0].split(':')[0].trim(),
      productInfo.supplier,
      imageUrl,
      'In Stock'
    ], function(err) {
      if (err) {
        console.error(`[${index + 1}/${folders.length}] ❌ Error: ${folder.substring(0, 30)}...`, err.message);
      } else {
        console.log(`[${index + 1}/${folders.length}] ✅ ${folder.substring(0, 40)}...`);
        console.log(`   Price: UGX ${productInfo.price.toLocaleString()}, Supplier: ${productInfo.supplier}`);
        updated++;
      }
      
      if (index === folders.length - 1) {
        setTimeout(() => {
          console.log();
          console.log('='.repeat(60));
          console.log(`✅ Updated: ${updated} products`);
          console.log(`⏭️  Skipped: ${skipped} products (no image, UUID, or no source data)`);
          console.log('='.repeat(60));
          db.close();
        }, 500);
      }
    });
  });
});




