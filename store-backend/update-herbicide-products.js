const fs = require('fs');
const path = require('path');

const HERBICIDES_DIR = path.join(__dirname, '../agrof-main/mobile/app/assets/store/HERBICIDE');

const herbicideProducts = [
  {
    name: "Auxo Ec – Selective Herbicide For Weed Control In Maize",
    details: {
      supplier: "Uganda Crop Care Limited",
      overview: "Auxo EC is a post-emergence herbicide for control of Grasses & Broadleaf weeds in Maize varieties grown in mid and high altitudes only.",
      active_ingredients: "Tembotrione 50g/l + Bromoxynil Octanoate 262g/l",
      formulation: "Emulsifiable concentrate",
      other_packaging: "5ltrs UGX 605,600\n1ltr UGX 126,500"
    }
  },
  {
    name: "Stomp 455 Cs – Pre-emergent Herbicide",
    details: {
      supplier: "Uganda Crop Care Limited",
      overview: "Stomp 455 CS is a pre-emergent herbicide for the control of Setaria spp. in barley, annual grasses and some broad leaf weeds in wheat, sugarcane and maize.",
      active_ingredient: "Pendimethalin 455 g/l",
      mode_of_action: "Stomp 455 CS is a meristematic inhibitor that interferes with the plant's cellular division or mitosis.",
      directions_for_use: "Half fill the spray tank with clean water and start agitation.\nShake the product before opening and measure the required amount of Stomp 455 CS and add into the spray tank. Add clean water and continue agitation or recirculation to the recommended volume.\nHomogenize the spray wash by agitation (e.g. recirculation or stirring) during spraying.",
      mixing_and_rate: "Barley, wheat, maize: 3.0ltrs/ha or 300 ml in 20ltrs of water. Use spray volume of 200ltrs/ha. Applied once. Pre-emergence of the crop. Apply Stomp 455 CS as soon as possible after sowing.\nSugarcane: 3.5ltrs/ha or 350 ml in 20ltrs of water Use spray volume of 200ltrs/ha. Pre-emergence application to weeds, in plant and ratoon cane.",
      phi: "90 days",
      re_entry_interval: "24 Hour, unless wearing protective clothing",
      remarks: "Stomp 455 CS is capsulated and can be applied on dry soils. Some soil moisture must be present for the product to be activated. Best results will be obtained if rainfall or irrigation occurs within seven days of application.\nResidual control may be reduced:\n• Under prolonged dry conditions.\n• On soils with a high Kd factor.\n• Where organic matter exceeds 6%.\n• Where ash content is high.",
      other_packaging: "10 Ltr UGX 523,700"
    }
  },
  {
    name: "Fusilade Forte 150 Ec- Post Emergence Herbicide For Use In Snow Peas And French Beans",
    details: {
      supplier: "Uganda Crop Care Limited",
      overview: "Fusilade Forte is a superior post emergence grass weed herbicide which is used in fruits and vegetables. Fusilade Forte is applied when weeds are between 2- 8 leaf stage. Fusilade Forte kills all germinated Grass weeds and is able to select a wide variety of vegetables and fruits.",
      rates_of_application: "Apply at a recommended rate of 150ml/20L of water, 1.5l/Ha or 600ml per Acre",
      active_ingredient: "Fluazifop-p-butyl 150 g/l",
      formulation: "Emulsifiable Concentrate (EC)",
      who_classification: "III",
      mode_of_action: "Fusilade Forte is a systemic herbicide which moves from the treated foliage into the shoots, roots, rhizomes, stolons, and growing points of treated grass weeds. Growth of treated grass weeds stops soon after application as Fusilade Forte is rapidly absorbed by green leaves and subsequently translocated throughout the plant where it accumulates at growing points, both above ground and in the roots, rhizomes and stolons. The first symptoms are generally not evident for approximately a week following application. Growing points turn brown and rot; shoot tips can be easily pulled out after 2 to 3 weeks. Young leaves turn yellow or redden soon after this, but more mature leaves may remain green for an extended period. Weed control is usually complete 3 to 5 weeks after application. Fusilade Forte inhibits acetyl-CoA carboxylase (ACCase), the enzyme catalysing the first committed step in de novo fatty acid synthesis.",
      main_benefits: "Optimal penetration hence giving immediate kill of all grass weeds., Economical - gives all season grass weed control eliminating the need for manual weeding, Eliminates competition hence higher yields.",
      reg_number: "UgC/2018/001804/He/RRRRR",
      other_packaging: "1ltr UGX 153,600"
    }
  },
  {
    name: "Basagran 480 Sl – Herbicide For Weed Control In Dry Beans, Maize And Potato",
    details: {
      supplier: "Uganda Crop Care Limited",
      overview: "Basagran 480 SL is a post-emergence Herbicide for the control of Broad leaf weeds in dry beans, maize and potato.",
      directions_for_use: "Dosage: Beans: 1.5-3.0 L/ha (150-300 ml/ 20ltrs of water), Maize: 2.0-3.0 L/ha (200-300 ml/20ltrs of water), Potatoes: 1.75 - 3.0 l/ha (175-300 ml/20L of water)",
      active_ingredient: "Bentazone 480 g/l",
      who_class: "Class II: Moderately Hazardous",
      mode_of_action: "The active ingredient is taken up through the green parts of the plant. The leaves and stems must therefore be adequately wetted with the spray solution. Warmth and good growing weather accelerate the action of the product. Basagran 480 SL is sprayed post emergence, i.e., when the weeds have already emerged. After treatment no rain should fall for six hours, so that the active ingredient can penetrate the weeds. Basagran 480 SL has no biologically active vapour pressure and so constitutes no risk to neighbouring crops in this way.",
      other_packaging: "5 Ltr UGX 305,200"
    }
  },
  {
    name: "Dualgold 960 Ec - Herbicide For Control Of Annual Grass Weeds In Maize",
    details: {
      supplier: "Uganda Crop Care Limited",
      overview: "Dual Gold 960 EC is a pre-emergence herbicide for the control of annual grass weeds in beans, maize and sugarcane.",
      active_ingredient: "960g/L S-metolachlor",
      formulation: "Emulsifiable concentrate (EC)",
      who_classification: "III",
      directions_for_use: "Maize: Pre-emergence or pre-plant incorporation.\nRate: 0.6-1.6 lt./ha. Use the higher rates in heavier soil or with heavy weed infestation. Pre-plant incorporation may be preferred under dry surface conditions in regions where long periods without rain prevail after application. Incorporation of Dual Gold 960 EC®️ has to be shallow (5 cm).\nNote: Avoid using Dual Gold 960 EC®️ where adjacent desirable plants may be injured.\nKnapsack rate: Use 160 ml per 20 litres of water.",
      precautions: "Shake well before use. Replace cap after pouring. Dual Gold 960 EC®️ must be applied in annual crops at time of planting or up to 3 days after planting. In perennial crops establish a weed-free soil surface prior to application either by hand weeding, mechanical cultivation or by the use of contact herbicides. The soil should have a smooth firm surface, free of clods. To ensure good results it is necessary that application is carried out shortly before rain or irrigation, or within 48 hours after good rain but before the crop emerges and before the top layer of the soil is dry again. If rainfall does not occur in time and weeds begin to emerge and develop, a light cultivation must be carried out with a rotary hoe to destroy these weeds and to mix the herbicide into the top 2-3 cm of soil.",
      timing: "Dual Gold 960 EC®️ has to be applied pre-emergence to the crops for optimum results.\nPre-plant surface application: Only for minimum tillage or no tillage systems. Dual Gold 960 EC®️ can be applied up to 45 days before planting certain crops.\nPre-planted incorporated (PPi): Apply Dual Gold 960 EC®️ to the soil and incorporate 5 cm of soil within 14 days before planting using a finishing disk, harrow, rolling cultivator or similar implement. Use pre-plant incorporated application when a period of dry weather after application is expected.",
      other_packaging: "5 Ltrs UGX 392,300"
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
  if (product.details.active_ingredients) {
    markdown += `## Active Ingredients\n${product.details.active_ingredients}\n\n`;
  }
  if (product.details.active_ingredient) {
    markdown += `## Active Ingredient\n${product.details.active_ingredient}\n\n`;
  }
  if (product.details.formulation) {
    markdown += `## Formulation\n${product.details.formulation}\n\n`;
  }
  if (product.details.mode_of_action) {
    markdown += `## Mode of Action\n${product.details.mode_of_action}\n\n`;
  }
  if (product.details.directions_for_use) {
    markdown += `## Directions for Use\n${product.details.directions_for_use}\n\n`;
  }
  if (product.details.mixing_and_rate) {
    markdown += `## Mixing and Rate of Application\n${product.details.mixing_and_rate}\n\n`;
  }
  if (product.details.rates_of_application) {
    markdown += `## Rates of Application\n${product.details.rates_of_application}\n\n`;
  }
  if (product.details.who_classification) {
    markdown += `## WHO Classification\n${product.details.who_classification}\n\n`;
  }
  if (product.details.who_class) {
    markdown += `## WHO Class\n${product.details.who_class}\n\n`;
  }
  if (product.details.phi) {
    markdown += `## PHI\n${product.details.phi}\n\n`;
  }
  if (product.details.re_entry_interval) {
    markdown += `## Re-Entry Interval\n${product.details.re_entry_interval}\n\n`;
  }
  if (product.details.remarks) {
    markdown += `## Remarks\n${product.details.remarks}\n\n`;
  }
  if (product.details.main_benefits) {
    markdown += `## Main Benefits\n${product.details.main_benefits}\n\n`;
  }
  if (product.details.reg_number) {
    markdown += `## Registration Number\n${product.details.reg_number}\n\n`;
  }
  if (product.details.precautions) {
    markdown += `## Precautions\n${product.details.precautions}\n\n`;
  }
  if (product.details.timing) {
    markdown += `## Timing\n${product.details.timing}\n\n`;
  }
  if (product.details.other_packaging) {
    markdown += `## Other Packaging\n${product.details.other_packaging}\n\n`;
  }

  return markdown;
}

console.log("🔧 Updating herbicide product.md files with correct data...");
console.log("==================================================");

let updatedCount = 0;
let errorCount = 0;

herbicideProducts.forEach(product => {
  // Sanitize product name to create a valid directory name
  const sanitizedProductName = product.name.replace(/[/\\?%*:|"<>]/g, '').replace(/\s-\s/g, '-').replace(/\s/g, '_');
  const productDirPath = path.join(HERBICIDES_DIR, sanitizedProductName);
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

console.log("\n🎉 Herbicide product.md files have been updated with correct information!");
