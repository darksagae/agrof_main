const fs = require('fs');
const path = require('path');

const FUNGICIDES_DIR = path.join(__dirname, '../agrof-main/mobile/app/assets/store/FUNGICIDES');

const fungicideProducts = [
  {
    name: "Nemasol – Soil Fumigant",
    details: {
      supplier: "Uganda Crop Care Limited",
      overview: "Nemasol is a soil fumigant for the control of soil fungi and nematodes in agricultural soils and seedbeds.\nNemasol is a soil disinfectant which gives effective control of fungi and nematodes prior to crop seeding or planting. When it comes into contact with wet soil, Metam sodium decomposes into Methyl iso thiocyanate, a gas which is the active substance. Metam Soidium acts quickly after application, decomposes and does not damage or leave residue in the planted field.",
      active_ingredient: "Metam Sodium 510g/L",
      direction_for_use: "Nemasol is a water miscible soil fumigant and is applied by drenching infected soils. Do not apply Nemasol when soil temperature are below 100C. For optimal efficacy, apply when soil temperatures are between 100C and 250C. Sub-optimal efficacy of Nemasol may occur on turf soils due to insufficient water penetration and soils with high organic matter content (high absorption coefficient).\nPre-treatment preparations: Prepare the surface to be treated up to a depth of 40-50 cm and remove undecayed organic matter. Bring soil moisture to field capacity and at least 14 days before application and keep the soil moist up to application time.\nPost- treatment procedure: To prevent excessive evaporation, seal treated areas with either follow-up irrigation or plastic sheet Aerate treated area thoroughly. 2-3 weeks after application by cultivating the soil. Lower soil temperatures (less than 160C) and soils with clay and organic matter content will retain more Nemasol and therefore require a longer waiting period.\nNote: Ensure the treated area is ready for use by conducting Germination test.",
      rates_of_application: "Soil Fungi (Fusarium, Pythium, Rhizoctonia, Pyrenochaeta, Sclerotium spp.): Mix 13 18mls/20ltrs of water and apply at a rate of 650-900ltrs/Ha.\nNematodes (Meloidogyne spp, Pratylenchus spp, Trichodorus spp.): Mix 13-18mls/20ltrs of water and apply at a rate of 650-900ltrs/Ha.",
      re_entry_period: "48 hours",
      use_limitations: "Do not treat within 5m of existing trees and field crops.",
      other_packaging: "60 Ltrs UGX 830,800"
    }
  },
  {
    name: "Proplant 722Sl – Systemic Fungicide",
    details: {
      supplier: "Uganda Crop Care Limited",
      overview: "Proplant 722SL is a fungicide for the control of Downey mildew on Roses and dumping off on pepper.\nProplant is a fungicide with systemic activity for the control of downy mildew on Roses and Dumping off on Pepper.",
      mode_action: "Proplant is a systemic fungicide that is absorbed by roots and translocated throughout the plant to aerial parts. It disrupts the formation of fungal cell walls by interfering with synthesis of phospholipids and Fatty Acids. It affects mycelia growth, spore production and germination. It has limited systemic activity when applied to the leaves.",
      active_ingredient: "Propamocarb hydrochloride 722g/L",
      recommendations_for_use: "Roses (Downy Mildew): Foliar spray - 1.5-3ltrs/Ha, 150-300mls/100ltrs of water or 30-60mls/20ltrs of water sat a spray interval of 7-10 days; Drenching - `3-6ltrs/Ha, apply on moist soil.\nPepper (Dumping off): Foliar spray – 0.8ltrs/Ha, 80mls/100ltrs of water, 15mls/20ltrs of water at an application interval of 7-10 days. Drenching – 1ltr/Ha, apply on moist soil.",
      pre_harvest_interval: "Pepper 3 days",
      re_entry_interval: "6 hours",
      preparation_of_spray: "Half fill the spray tank (Knapsack) with water. Add the required amount of Proplant then fill water to the required level and mix or agitate thoroughly to uniformity. Ensure that the mixture is used the same day.",
      other_packaging: "1ltr UGX 95,800"
    }
  },
  {
    name: "Goldazim 500 Sc - Fungicide For The Control Of Botrytis And Black Spots",
    details: {
      supplier: "Uganda Crop Care Limited",
      overview: "This is a Systemic Curative fungicide with Carbendazim 500g/L active ingredient. It is effective for the control of Powdery Mildew, Botrytis blight, Anthracnose spots, Fusarium Root rot, Ascochyta spots, Helminthosporium spots/ blight, Septoria leaf spots and Rhizoctonia root.",
      dosage: "20mls/20ltrs of water. Re-Entry interval: 6 days.\nSpray Interval: 10-14 days",
      who_classification: "Class III (slightly hazardous)",
      formulation: "Suspension Concentrate (SC)",
      other_packaging: "1 Ltr UGX 90,700"
    }
  },
  {
    name: "Alliete Flash Wg 80 - Systemic Fungicide For The Control Of Downy Mildew In Roses",
    details: {
      supplier: "Uganda Crop Care Limited",
      overview: "Alliete Flash WG 80 is a systemic fungicide for the control of downy mildew in Roses. It can be Applied as a preventive schedule or during early disease symptoms.",
      active_ingredient: "Fosetyl-Aluminium 800g/kg",
      formulation: "Water Dispersible Granules",
      directions_for_use: "Roses (Foliar spray): 20-25g/20ltrs of water (2.0-2.5kg/Ha in 1200 – 2000ltrs of water).\nRoses (Soil drench application): 5-6kg/Ha in 1000ltrs of water at a 2 weeks interval",
      other_packaging: "1 Kg UGX 148,500"
    }
  },
  {
    name: "Folio Gold 537.5 Sc - Fungicide For Control Of Downy Mildew",
    details: {
      supplier: "Uganda Crop Care Limited",
      overview: "Folio Gold 537.5 SC is a systemic and residual fungicide for the control of Downy Mildew and white rust in ornamentals/flowers.",
      active_ingredients: "37.5g/ltr Metalaxyl-M + 500g/ltr Chlorothalonil",
      formulation: "Soluble concentrate (SC)",
      who_classification: "III",
      directions_for_use: "Roses: Apply a maximum of 3 Folio Gold®️ 537.5 SC sprays per season. Downy mildew: Apply at 2.0-2.5 lt./ha (200-250 g/100litres water or 40-50g/20ltr Knapsack sprayer). Do not exceed the recommended rate per hectare when using the hector-liter recommendations. Begin applications when conditions are favorable for disease, but before infection, and continue at 10–14-day intervals.",
      mode_of_action: "Metalaxyl-M is a systemic fungicide which is rapidly taken up by the green plant part (within 30 min.) transported upwards in the sap stream and is distributed thus provides control of fungi from within the plant. Chlorothalonil provides a protective film over plant surfaces hence inhibits germination of the spores.",
      targets: "An innovative fungicide mix developed and introduced in order to improve the control in the key plant diseases like downy mildew, botrytis and white rust.",
      other_packaging: "1 Ltr UGX 153,600"
    }
  },
  {
    name: "Amistar 250 Sc – Broad Spectrum Fungicide",
    details: {
      supplier: "Uganda Crop Care Limited",
      overview: "Amistar is a broad-spectrum fungicide ideally suited for use in IPM programs in a wide range of crops to control fungal diseases such as Net blotch, leaf rust, spot blotch and scald. Amistar is a strobilurin fungicide based on naturally occurring substances found in certain species of wild mushrooms. The active ingredient in Amistar, azoxystrobin, controls a very wide spectrum of disease in wheat and barley. Amistar not only controls the key late-season flag leaf and ear diseases that erode yield and quality, but also promotes a range of beneficial physiological and greening effects, so helping the crop towards its full genetic potential.",
      formulation: "Soluble concentrate (SC)",
      who_classification: "III",
      rates_of_application: "Apply at 0.75 ltrs/ha",
      other_key_benefits: "• Stops disease even before it starts.\n• Delays onset senescence hence prolonging Green leaf Area (GLA).\n• Treated crop able to cope better with water stress (water use efficiency).\n• Treated crop has improved ability to use nitrogen efficiently and assimilate it into proteins.",
      reg_number: "UgC/2017/001576/Fu/R",
      other_packaging: "5 Ltrs UGX 1,142,500"
    }
  },
  {
    name: "Apron Star 42Ws - Seed Treatment Fungicide-insecticide",
    details: {
      supplier: "Uganda Crop Care Limited",
      overview: "APRON STAR is a seed treatment fungicide-insecticide mixture for controlling downy mildew, damping-off diseases as well as for protection of seeds and seedlings against early season insect pests and soil borne diseases in beans, sorghum, maize, cotton and vegetables.\nIt offers outstanding control of early season insect pests and diseases, Increased crop vigour and Greater yields.",
      active_ingredient_content: "Thiamethoxam 20% + Metalaxyl - 20% + Difenoconazole 2%",
      mode_of_action: "Thiamethoxam: Interferes with the receptor protein nicotinic and acetyl choline of the nervous system. It has contact, stomach and systemic activity. Insects susceptible to Thiamethoxam almost die instantly. Targets wireworms, whiteflies, aphids, jassids, beanfly, thrips and termites.\nMetalaxyl -M: Penetrates the seed coat and is systemically translocated to both shoots and roots during germination, providing protection from pre-emergence damping-off caused by pythium spp. Good protection from soil and airborne downy mildews is also achieved during and after germination for a period of up to 4 weeks.\nDifenoconazole: Systemic triazole fungicide with a broad spectrum anti-fungal activity. It is taken up by the seed and translocated within the seedling. It provides protection from damping-off, fusarium spp. and Septoria spp.\nAPRON STAR shows root, leaf and stem systemic activity.",
      triple_power: "The three-way powered seedling protection is based on modern chemistry. Some of the vegetable crops where APRON STAR has been used successfully include: French beans, Runner beans, Snow peas, Sugar snaps, Garden peas and Baby corn.",
      compatibility: "APRON STAR has a broad spectrum of activity and is not expected to be mixed with other products.",
      other_key_benefits: "It stimulates root development leading to vigorous starts, uniform growth and higher yields\nStrong against critical early season diseases - Pythium, Fusarium and early seasons pests - Bean Fly, Termites, Thrips, Jassids, Whiteflies etc.\nControls sucking pests for about 21 days / 3 weeks after planting",
      reg_number: "UgC/2018/001803/Fu/RRRRR",
      other_packaging: "1 Kg UGX 438,300"
    }
  },
  {
    name: "Tata Master 72Wp",
    details: {
      supplier: "Nsanja Agrochemicals Ltd",
      overview: "Systemic and contact fungicide for the control of early and late blight on potatoes, tomatoes, grapes; downy mildew in all crops including roses; fungal leaf spot diseases and damping off in vegetables. Tata Master 72WP is a fungicide trusted by farmers for control of diseases such as downy mildew, damping off and blight. The action on downy mildew disease is remarkably fast. And also very effective in preventing damping off invading young tomatoes, potatoes, and other vegetables.",
      dosage: "Use 50g of Tata Master 72WP per 20 Ltrs water and ensure 2.5kg per Ha is used for thorough coverage, PHI: 14 days",
      other_packaging: "100 g UGX 5,300\n250 g UGX 10,800\n500 g UGX 21,600\n1 Kg UGX 40,000"
    }
  },
  {
    name: "Ascozeb 80 Wp - Broad Spectrum Preventive Fungicide",
    details: {
      supplier: "Syova Seed (U) Ltd",
      overview: "Ascozeb 80 WP is a broad spectrum preventive fungicide for use against early and late blight in potatoes, tomatoes, blotch and downy mildew in onions and botrytis in roses.",
      active_ingredient: "Mancozeb 800g/kg",
      directions_for_use: "Rate of use: 1kg/acre, Mixing: 40-60g/20ltrs of water for tomatoes, potatoes and onions. 50-60g/20ltrs of water for roses.\nPre-Harvest Interval (PHI): 7 days.",
      other_packaging: "250 g UGX 6,800\n1 Kg UGX 22,000\n10 Kg UGX 179,900\n25 Kg UGX 365,900"
    }
  },
  {
    name: "Milraz Wp 76 - Broad Spectrum Preventive & Curative Fungicide",
    details: {
      supplier: "Uganda Crop Care Limited",
      overview: "Milraz WP 76 is a broad-spectrum preventive & curative fungicide for the control of early and late blight in potatoes, downy mildew and anthracnose in cucurbits, downy mildew and purple blotch in onions. Milraz WP 76 is a foliar applied combination product of two active ingredients –Propineb, the contact fungicide, and Cymoxanil, the local systemic fungicide.",
      directions_for_use: "Potatoes and tomatoes: Early blight and late blight – 2kgs/ha or 40g/20ltrs of water: Apply first spray early before disease symptoms appear on the crop and as soon as climatic conditions are conducive to the development of blight- cool overcast conditions followed by humid weather. Repeat at 14 days interval, reduce spray interval to 7-10days when the infection has occurred or in irrigated crops. Pre-Harvest Interval (PHI) 14 days in potatoes and 7 days in tomatoes.\nCucurbits (Watermelon, sweet melon and squash): Downy Mildew and anthracnose - 2kgs/ha or 40g/20ltrs of water. Repeat at 14 days interval, reduce spray interval to 7-10days when the infection has occurred, Pre-Harvest Interval (PHI): 7days.\nOnions: Downy mildew and purple blotch: 2kgs/ha or 40g/20ltrs of water. Repeat at 14 days interval, reduce spray interval to 7-10days when the infection has occurred, Pre-Harvest Interval (PHI): 14days.",
      other_packaging: "1 Kg UGX 148,500\n500 gms UGX 80,100"
    }
  }
];

function formatProductDetailsToMarkdown(product) {
  let markdown = `# ${product.name}\n\n`;

  if (product.details.supplier) {
    markdown += `## Supplier\n${product.details.supplier}\n\n`;
  }
  if (product.details.overview) {
    markdown += `## Overview\n${product.details.overview}\n\n`;
  }
  if (product.details.active_ingredient) {
    markdown += `## Active Ingredient\n${product.details.active_ingredient}\n\n`;
  }
  if (product.details.active_ingredients) {
    markdown += `## Active Ingredients\n${product.details.active_ingredients}\n\n`;
  }
  if (product.details.active_ingredient_content) {
    markdown += `## Active Ingredient Content\n${product.details.active_ingredient_content}\n\n`;
  }
  if (product.details.formulation) {
    markdown += `## Formulation\n${product.details.formulation}\n\n`;
  }
  if (product.details.mode_action) {
    markdown += `## Mode of Action\n${product.details.mode_action}\n\n`;
  }
  if (product.details.mode_of_action) {
    markdown += `## Mode of Action\n${product.details.mode_of_action}\n\n`;
  }
  if (product.details.direction_for_use) {
    markdown += `## Direction for Use\n${product.details.direction_for_use}\n\n`;
  }
  if (product.details.directions_for_use) {
    markdown += `## Directions for Use\n${product.details.directions_for_use}\n\n`;
  }
  if (product.details.recommendations_for_use) {
    markdown += `## Recommendations for Use\n${product.details.recommendations_for_use}\n\n`;
  }
  if (product.details.rates_of_application) {
    markdown += `## Rates of Application\n${product.details.rates_of_application}\n\n`;
  }
  if (product.details.dosage) {
    markdown += `## Dosage\n${product.details.dosage}\n\n`;
  }
  if (product.details.who_classification) {
    markdown += `## WHO Classification\n${product.details.who_classification}\n\n`;
  }
  if (product.details.pre_harvest_interval) {
    markdown += `## Pre-Harvest Interval\n${product.details.pre_harvest_interval}\n\n`;
  }
  if (product.details.re_entry_interval) {
    markdown += `## Re-Entry Interval\n${product.details.re_entry_interval}\n\n`;
  }
  if (product.details.re_entry_period) {
    markdown += `## Re-Entry Period\n${product.details.re_entry_period}\n\n`;
  }
  if (product.details.preparation_of_spray) {
    markdown += `## Preparation of Spray\n${product.details.preparation_of_spray}\n\n`;
  }
  if (product.details.targets) {
    markdown += `## Targets\n${product.details.targets}\n\n`;
  }
  if (product.details.triple_power) {
    markdown += `## Triple Power\n${product.details.triple_power}\n\n`;
  }
  if (product.details.compatibility) {
    markdown += `## Compatibility\n${product.details.compatibility}\n\n`;
  }
  if (product.details.other_key_benefits) {
    markdown += `## Other Key Benefits\n${product.details.other_key_benefits}\n\n`;
  }
  if (product.details.use_limitations) {
    markdown += `## Use Limitations\n${product.details.use_limitations}\n\n`;
  }
  if (product.details.reg_number) {
    markdown += `## Registration Number\n${product.details.reg_number}\n\n`;
  }
  if (product.details.other_packaging) {
    markdown += `## Other Packaging\n${product.details.other_packaging}\n\n`;
  }

  return markdown;
}

console.log("🔧 Updating fungicide product.md files with correct data...");
console.log("==================================================");

let updatedCount = 0;
let errorCount = 0;

fungicideProducts.forEach(product => {
  // Sanitize product name to create a valid directory name
  const sanitizedProductName = product.name.replace(/[/\\?%*:|"<>]/g, '').replace(/\s-\s/g, '-').replace(/\s/g, '_');
  const productDirPath = path.join(FUNGICIDES_DIR, sanitizedProductName);
  const productFilePath = path.join(productDirPath, 'product.md');

  if (!fs.existsSync(productDirPath)) {
    try {
      fs.mkdirSync(productDirPath, { recursive: true });
    } catch (dirErr) {
      console.error(`❌ Error creating directory for ${product.name}:`, dirErr);
      errorCount++;
      return;
    }
  }

  try {
    const markdownContent = formatProductDetailsToMarkdown(product);
    fs.writeFileSync(productFilePath, markdownContent, 'utf8');
    console.log(`✅ Updated: ${product.name}`);
    updatedCount++;
  } catch (fileErr) {
    console.error(`❌ Error writing product.md for ${product.name}:`, fileErr);
    errorCount++;
  }
});

console.log("\n📊 Update summary:");
console.log(`✅ Successfully updated: ${updatedCount} products`);
console.log(`❌ Errors: ${errorCount} products`);
console.log(`🔧 Total processed: ${updatedCount + errorCount} products`);

console.log("\n🎉 Fungicide product.md files have been updated with correct information!");
