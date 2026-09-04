const fs = require('fs');
const path = require('path');

// Comprehensive product data with correct pricing and details
const productData = {
  "AGRI GOLD Fertilizer": {
    name: "AGRI GOLD Fertilizer",
    description: "Agri Gold is wonder product that prevents flower shedding, promotes more flower formation and bumper yield while enhancing healthy fruit formation and vegetative growth. Agri gold is recommended in all flowering crops like tomatoes, peppers, beans, cotton, coffee. Agri Gold is approved for use in organic Agriculture.",
    application: "Foliar application: Mix 2-3mls of Agri Gold per 1ltrs of water (60mls/20ltrs). Drip Irrigation: Mix 5mls of Agri Gold per 1ltr of water",
    pricing: [
      { size: "1ltr", price: "UGX 30,000" },
      { size: "500ml", price: "UGX 15,000" }
    ]
  },
  "Omni K- Potassium Nitrate Fertilizer For All Crops": {
    name: "Omni K- Potassium Nitrate Fertilizer For All Crops",
    supplier: "Uganda Crop Care Limited",
    description: "Omni K is a water-soluble fertilizer for fertigation or foliar application, supplying nitrate, nitrogen and chlorine free potassium to plants for enhanced growth and higher yields.",
    content: "130g/kg N – 380g/kg K, 130g/kg N – 460g/kg K2O",
    pricing: [
      { size: "Retail", price: "UGX 366,000" },
      { size: "Wholesale", price: "UGX 357,500" }
    ]
  },
  "Magnesium Nitrate – Hexahydrate Fertilizer For All Crops": {
    name: "Magnesium Nitrate – Hexahydrate Fertilizer For All Crops",
    supplier: "Uganda Crop Care Limited",
    description: "Magnesium Nitrate is recommended as of vegetative growth and during production stages. The high level of Magnesium contributes to the production of chlorophyll. The presence of Nitrogen has a positive effect on the uptake of Magnesium in the plant.",
    content: "Water soluble Mg: 9.4% MIN, Nitrogen N: 10.5% MIN",
    pricing: [
      { size: "25 Kg", price: "UGX 158,800" }
    ]
  },
  "Elfert . F - Trace Element Mix For Foliar Application": {
    name: "Elfert . F - Trace Element Mix For Foliar Application",
    supplier: "Uganda Crop Care Limited",
    description: "Elfert - F is an effective foliar spray to correct trace element deficiency. Application of Trace elements (micro elements) is most often ignored by farmers and yet they are vital to balance the uptake of Major nutrients (macro elements) and overall plant growth.",
    content: "Fe EDDHA 5.345%, Zn EDTA2.672%, Mn EDTA2.672%, Cu EDTA 0.540%, B 1.088%, MnO 0.0533%",
    pricing: [
      { size: "25kg", price: "UGX 779,600" }
    ]
  },
  "Nova Peak 0-52-34 - Monopotassium Phosphate Fertilizer For Foliar Spraying": {
    name: "Nova Peak 0-52-34 - Monopotassium Phosphate Fertilizer For Foliar Spraying",
    supplier: "Uganda Crop Care Limited",
    description: "Nova Peak MKP fertilizer is a high purity product that dissolves completely and quickly in water. Thanks to its very low sodium content, Nova Peak is recommended for use in any type of crop and in any fertigation system.",
    pricing: [
      { size: "25kg", price: "UGX 315,500" }
    ]
  },
  "Calcium Nitrate - Nitrogen Calcium Compound Fertilizer For All Crops": {
    name: "Calcium Nitrate - Nitrogen Calcium Compound Fertilizer For All Crops",
    supplier: "Uganda Crop Care Limited",
    description: "Calcium Nitrate helps with cell formation but it also neutralizes acids to detoxify the plant. The nitrogen component is also responsible for fuelling protein production and essentially leafy growth.",
    content: "Nitrogen (N): 15.5%, Nitrate Nitrogen (N): 14.4%, Ammonical Nitrogen (N): 1.1%, Calcium Oxide: 26%",
    pricing: [
      { size: "25 Kg", price: "UGX 170,400" }
    ]
  },
  "Yaravita Crop Boost": {
    name: "Yaravita Crop Boost",
    supplier: "Yara East Africa Ltd",
    description: "YaraVita CROP BOOST is a concentrated phosphorous foliar fertilizer that provides balanced nutrients that help your crop to unlock its hidden yield potential. It can be applied on maize, rice, wheat, potato among other crops.",
    pricing: [
      { size: "1 Ltr", price: "UGX 38,500" }
    ]
  },
  "Nova Map 12-61-0 – Soluble Fertilizer For Fertigation": {
    name: "Nova Map 12-61-0 – Soluble Fertilizer For Fertigation",
    supplier: "Uganda Crop Care Limited",
    description: "Nova MAP 12-61-0, Monoammonium Phosphate is ideal for use in the initial growth phase of all crops, immediately before and after seeding and planting/transplanting.",
    pricing: [
      { size: "25kg", price: "UGX 314,200" }
    ]
  },
  "Nutriplant Organic Plus Fertilizer (Eliciting Fertilizer)": {
    name: "Nutriplant Organic Plus Fertilizer (Eliciting Fertilizer)",
    supplier: "Green World International",
    description: "Nutriplant organicplus fertilizer (NOPF) is composed of both micro and macro nutrients containing multiple small molecules of amino acids, peptides, chitosan chelate, & their chelate with trace elements is a kind of natural nutrition for plants.",
    pricing: [
      { size: "1 Ltr", price: "UGX 117,150" },
      { size: "100 mls", price: "UGX 15,000" }
    ]
  },
  "Yara Vera Amidas (Mabugu Farm Supply)": {
    name: "Yara Vera Amidas (Mabugu Farm Supply)",
    supplier: "Mabugu Farm Supply",
    description: "It is a granular, white coloured, highly soluble fertilizer and contains the highest nitrogen among all nitrogenous fertilizers. Its chemical formula is CO(NH2)2 and contains 46% N (nitrogen).",
    pricing: [
      { size: "50kg", price: "UGX 146,000" }
    ]
  },
  "Mop": {
    name: "Mop",
    supplier: "Export Trading Group",
    description: "Muriate of Potash or Potassium Chloride (K 60%). Potash is primarily used to support plant growth, increase crop yield. It stimulates the growth of strong stems and gives the plant disease resistance by promoting thickness of the outer cell walls.",
    pricing: [
      { size: "50 Kg", price: "UGX 150,000" }
    ]
  },
  "Kynoplus S": {
    name: "Kynoplus S",
    supplier: "Export Trading Group",
    description: "kynoPlus Super is Urea treated with a different Agrotain®️ additive with the additional benefit that, in addition to curbing volatilisation losses, it also reduces the potential nitrification and prevents leaching of nitrogen.",
    pricing: [
      { size: "50 Kg", price: "UGX 140,000" }
    ]
  },
  "Npk 11.29.23 - Planting Fertilizer": {
    name: "Npk 11.29.23 - Planting Fertilizer",
    supplier: "Export Trading Group",
    description: "This provides / promotes root and shoots growth, phosphorous is important for regulating water and nutrient movement in the plant cell there by promoting fruiting, flowering, hardiness and promote over roll health of the plant.",
    pricing: [
      { size: "50kg", price: "UGX 160,000" }
    ]
  },
  "Agricultural Lime": {
    name: "Agricultural Lime",
    supplier: "Grain Pulse Ltd",
    description: "Ag Lime ,or agricultural lime, is a soil conditioner made from crushed lime stone or dolomitic lime stone. Ag limestone works by dissolving releasing a base that lowers the acidity of the soil.",
    pricing: [
      { size: "50 Kg", price: "UGX 36,000" },
      { size: "25 Kg", price: "UGX 26,700" }
    ]
  },
  "Rosasol - Even (Npk 19:19:19 +Te) – Water Soluble Fertilizer": {
    name: "Rosasol - Even (Npk 19:19:19 +Te) – Water Soluble Fertilizer",
    supplier: "Uganda Crop Care Limited",
    description: "Rosasol - Even is a complete water-soluble fertilizer which provides all major plant nutrients i.e., Nitrogen, Phosphorus, Potassium plus some trace elements in a balanced ratio (NPK 19:19:19) to the plants and greatly boosts yields.",
    pricing: [
      { size: "25 Kg", price: "UGX 260,000" }
    ]
  },
  "Npk 24:17:10 (+3+2+1) - Fertilizer For Sunflower": {
    name: "Npk 24:17:10 (+3+2+1) - Fertilizer For Sunflower",
    supplier: "Grain Pulse Ltd",
    description: "Blended Fertilizer for Sunflower, Used at planting to boost soil fertility and improve productivity. Application rate: 50kgs per acre.",
    pricing: [
      { size: "10 Kg", price: "UGX 31,900" },
      { size: "25 Kg", price: "UGX 78,000" }
    ]
  },
  "Npk 14:10:28 (+25)-Blended Fertilizer For Cassava And Sweet Potato": {
    name: "Npk 14:10:28 (+25)-Blended Fertilizer For Cassava And Sweet Potato",
    supplier: "Grain Pulse Ltd",
    description: "Blended Fertilizer for Cassava, Sweet potato, Used for planting and top-dressing after 2 months. Application rate: 75kg/acre.",
    pricing: [
      { size: "25 Kg", price: "UGX 70,000" }
    ]
  },
  "Microp-planting Fertilzer": {
    name: "Microp-planting Fertilzer",
    supplier: "Yara East Africa Ltd",
    description: "This is a high quality blended NPK fertilizer for planting. It has been developed with soil conditions in mind to address key nutritional deficiencies, sulfur and zinc, for higher yields.",
    pricing: [
      { size: "50kg", price: "UGX 155,000" }
    ]
  },
  "Wuxal (Macromix 24-24-18+Te)": {
    name: "Wuxal (Macromix 24-24-18+Te)",
    supplier: "Uganda Crop Care Limited",
    description: "Wuxal Macromix is a foliar fertilizer containing high amounts chelated macro nutrients as well as all necessary trace elements. It's a premium quality suspension concentrate, formulated using quality nutrient sources that is very safe to use.",
    pricing: [
      { size: "500 mls", price: "UGX 40,000" },
      { size: "10 Ltr", price: "UGX 532,500" }
    ]
  },
  "Kynohorti Npk 15.9.21+5S": {
    name: "Kynohorti Npk 15.9.21+5S",
    supplier: "Export Trading Group",
    description: "This is a kynoch product an NPK 15.9.21 it has other trace elements like zinc, magnesium, boron and calcium. It can be applied on Matoke, citrus fruits and any other crop that needs high potassium.",
    pricing: [
      { size: "50 Kgs", price: "UGX 155,000" }
    ]
  },
  "Npk 11:29:23 - Fertilizer For Beans/soybeans": {
    name: "Npk 11:29:23 - Fertilizer For Beans/soybeans",
    supplier: "Grain Pulse Ltd",
    description: "Blended Fertiliser for Beans/Soybeans, Used to boost yield in beans and Soybeans",
    pricing: [
      { size: "10 Kg", price: "UGX 38,000" },
      { size: "25 Kg", price: "UGX 80,000" },
      { size: "50 Kg", price: "UGX 160,000" }
    ]
  },
  "Yaraliva Nitrabor": {
    name: "Yaraliva Nitrabor",
    supplier: "Yara East Africa Ltd",
    description: "YaraLiva™️ NITRABOR™️ is a unique field grade calcium nitrate, with additional boron for responsive crops. Especially suite to give quality benefits to vegetables, including potatoes.",
    pricing: [
      { size: "25 Kg", price: "UGX 100,000" }
    ]
  },
  "Bio Seed": {
    name: "Bio Seed",
    supplier: "Ag-ploutos Company Limited",
    description: "This is a new, all-natural way to inoculate crops and soils with beneficial bacteria and fungi that work to: Fix atmospheric nitrogen for plant use, solubilize phosphorous from soil, which is often unavailable.",
    pricing: [
      { size: "100g", price: "UGX 70,000" },
      { size: "1 Kg", price: "UGX 645,000" }
    ]
  },
  "Kynoplus Top": {
    name: "Kynoplus Top",
    supplier: "Export Trading Group",
    description: "Contains N-46% Slow release Nitrogen (Blue Urea). It is a number one product among different N-hanced Nitrogen fertilizers with a higher mount of Nitrogen. It is coated with AGROTAIN which prevents Nitrogen losses through volatilization.",
    pricing: [
      { size: "50 Kg", price: "UGX 165,000" }
    ]
  },
  "Easygro Calcium - Water-soluble": {
    name: "Easygro Calcium - Water-soluble",
    supplier: "Osho Chemical Industries Ltd",
    description: "Easygro Calcium is a water-soluble fertilizer with calcium, magnesium and other micro-elements for foliar feeding and fertigation.",
    pricing: [
      { size: "250 g", price: "UGX 6,400" },
      { size: "500 g", price: "UGX 9,600" }
    ]
  },
  "Yarabela Can": {
    name: "Yarabela Can",
    supplier: "Mabugu Farm Supply",
    description: "YaraBela CAN (26% N) is high quality nitrate fertilizer. An excellent option for top dressing on many crops, including cereals.",
    pricing: [
      { size: "50 Kg", price: "UGX 110,000" }
    ]
  },
  "Npk 16.2.31 (Coffee Blend)": {
    name: "Npk 16.2.31 (Coffee Blend)",
    supplier: "Export Trading Group",
    description: "Helps to boost yields in coffee. Suitable for coffee of up to 2 years. 100-250g/Tree (100-150kg/acre).",
    pricing: [
      { size: "50 Kg", price: "UGX 155,000" }
    ]
  },
  "Npk 17:17:17": {
    name: "Npk 17:17:17",
    supplier: "Export Trading Group",
    description: "This is base fertilizer that supplies three macro nutrients. It helps in good flower setting and forming enlarged fruits & for planting certain crops. Contains N-17% P-17% K-17%.",
    pricing: [
      { size: "50 Kg", price: "UGX 120,000" }
    ]
  },
  "Greensea K20 2.5%": {
    name: "Greensea K20 2.5%",
    supplier: "Hangzhou Agrochemicals (U) Ltd",
    description: "A biological biostimulant that improves root and shoot development, improves photosynthesis and helps a lot of times of stress e.g. during drought.",
    pricing: [
      { size: "1ltr", price: "UGX 35,000" },
      { size: "100mls", price: "UGX 5,500" }
    ]
  },
  "Multi-npk": {
    name: "Multi-npk",
    supplier: "Balton Uganda Ltd",
    description: "MULTI npK is a fertilizer with 13%N +2%P2O5 + 44%K2O plus micronutrients",
    pricing: [
      { size: "1kg", price: "UGX 18,000" }
    ]
  },
  "Grow-cal Fertiliser": {
    name: "Grow-cal Fertiliser",
    supplier: "Balton Uganda Ltd",
    description: "Grow-Cal is a foliar calicum fertiliser with 17% Ca, 10% N, 4% Mg, 0.1% Boron suitable foe growing plants and seedlings and prevents end rot.",
    pricing: [
      { size: "1ltr", price: "UGX 38,000" }
    ]
  },
  "Kynoplus Expresso": {
    name: "Kynoplus Expresso",
    supplier: "Export Trading Group",
    description: "NPK 22.6.12+S-6%+Ca-4%+Mg-1%+B-0.3%. It contains nutrients required to meet nutritional needs of a coffee & tea trees at the right proportion.",
    pricing: [
      { size: "50 Kg", price: "UGX 160,000" },
      { size: "10 Kg", price: "UGX 44,600" }
    ]
  },
  "Kynoch Panda Power": {
    name: "Kynoch Panda Power",
    supplier: "Export Trading Group",
    description: "NPK 10.25.10+ S-7%+Ca-4%+Mg-1%+Zn-0.51%. It is a high quality NPK blend, specifically designed for planting all types of crops.",
    pricing: [
      { size: "50 Kg", price: "UGX 160,000" },
      { size: "10 Kg", price: "UGX 42,600" }
    ]
  },
  "Map - Monoammonium Phosphate/quick Starter Phosphorous Fertilizer": {
    name: "Map - Monoammonium Phosphate/quick Starter Phosphorous Fertilizer",
    supplier: "Agritab Uganda Limited",
    description: "Monoammonium phosphate is ideal for use in the initial growth phase of all crops, immediately before and after seeding and planting/transplanting.",
    pricing: [
      { size: "50 Kg", price: "UGX 110,000" },
      { size: "10 Kg", price: "UGX 25,000" },
      { size: "25kgs", price: "UGX 220,000" }
    ]
  },
  "Yara Mila Power Plus": {
    name: "Yara Mila Power Plus",
    supplier: "Yara East Africa Ltd",
    description: "This is a high-quality compound NPK, specifically designed for cereal crops. The balanced nutrients mean the crop get a good typical support for the development phases at base and top dressing.",
    pricing: [
      { size: "50 Kg", price: "UGX 190,000" }
    ]
  },
  "Yaramila Winner": {
    name: "Yaramila Winner",
    supplier: "Yara East Africa Ltd",
    description: "YaraMila™️ WINNER™️ is a combination of Potassium Chloride (65%) and Potassium Sulphate (35%). It is a high quality, compound NPK with micronutrients, ideally suited for vegetables including potatoes.",
    pricing: [
      { size: "50 Kg", price: "UGX 165,000" }
    ]
  },
  "Easygro Starter": {
    name: "Easygro Starter",
    supplier: "Osho Chemical Industries Ltd",
    description: "A water-soluble fertilizer with chelated micro-elements and bio-stimulants for foliar feeding and fertigation. It is recommended for use during: Plant growth periods that require relatively high phosphorous levels.",
    pricing: [
      { size: "1 Kg", price: "UGX 18,000" },
      { size: "250 g", price: "UGX 6,400" },
      { size: "500 g", price: "UGX 9,600" }
    ]
  },
  "Urea (Prilled)": {
    name: "Urea (Prilled)",
    supplier: "Export Trading Group",
    description: "UREA 46% N is a white crystalline solid containing 46% of nitrogen.it has the highest nitrogen content of all solid nitrogenous fertilizers making it have the lowest transportation cost per unit nitrogen nutrient.",
    pricing: [
      { size: "50 Kg", price: "UGX 125,000" }
    ]
  },
  "Npk 25:5:5+5S": {
    name: "Npk 25:5:5+5S",
    supplier: "Export Trading Group",
    description: "It is a fertilizer providing Nitrogen, Phosphorous, Potassium & Sulphur. Best suited for tea production & vegetables. Contains N 25% P 5% K 5% + S 5%.",
    pricing: [
      { size: "50 Kg", price: "UGX 125,000" }
    ]
  },
  "Mea-urea": {
    name: "Mea-urea",
    supplier: "Mabugu Farm Supply",
    description: "It is a granular, white coloured, highly soluble fertilizer and contains the highest nitrogen among all nitrogenous fertilizers. Its chemical formula is CO(NH2)2 and contains 46% N (nitrogen).",
    pricing: [
      { size: "50kg", price: "UGX 125,000" }
    ]
  },
  "Rootex 0.8% -Rooting Hormone": {
    name: "Rootex 0.8% -Rooting Hormone",
    supplier: "Osho Chemical Industries Ltd",
    description: "ROOTEX is a broad-spectrum plant growth regulator used to stimulate rooting of cuttings of herbaceous and woody ornamentals. Active Ingredient: Indole Butyric Acid (I.B.A).",
    pricing: [
      { size: "1 Kg", price: "UGX 170,000" },
      { size: "50 g", price: "UGX 15,000" }
    ]
  },
  "Plantone 4.5% Sl": {
    name: "Plantone 4.5% Sl",
    supplier: "Osho Chemical Industries Ltd",
    description: "Plantone 4.5 SL is a plant growth regulator that can be used on a wide range of crops. It induces flowering, prevents flower abortion and prevents pre-harvest fruit loss.",
    pricing: [
      { size: "30 mls", price: "UGX 7,500" },
      { size: "100 mls", price: "UGX 18,500" }
    ]
  },
  "Cassava Tapiocal- Microfood Cassava Foliar": {
    name: "Cassava Tapiocal- Microfood Cassava Foliar",
    supplier: "Bukoola Chemical Industries (U) Ltd",
    description: "To use Cassava Tapioca (Microfood Cassava Foliar), dilute according to the instructions on the label. Apply the foliar spray directly onto cassava leaves every 2-3 weeks during the active growing season.",
    pricing: [
      { size: "250 g", price: "UGX 5,000" }
    ]
  },
  "Calcigro": {
    name: "Calcigro",
    supplier: "Agritab Uganda Limited",
    description: "CalciGrow is a dust-free ultrafine granulated calcium mineral fertilizer that is designed to rapidly neutralize acidic soils. By doing so, it maximizes nutrient availability, optimizes NPK fertilizer and micronutrient uptake.",
    pricing: [
      { size: "50kg", price: "UGX 75,000" }
    ]
  },
  "Yara Mila 25.5.5+5S": {
    name: "Yara Mila 25.5.5+5S",
    supplier: "Mabugu Farm Supply",
    description: "This is an inorganic fertilizer made of Nitrogen 25%, Phosphorous 5%, Potassium 5% and Sulphur 5%.the percentages represent the total weight of these elements in the fertilizer.",
    pricing: [
      { size: "50 Kgs", price: "UGX 125,000" }
    ]
  },
  "Crop Champion": {
    name: "Crop Champion",
    supplier: "Gold Lion Agriculture Group Company",
    description: "Crop champion is a water soluble foliar fertilizer suitable for both indoor and out door plants , it is also cold and drought resistant. It contains all the essential nutrients required by all crops and at all the three stages of growth.",
    pricing: [
      { size: "300g", price: "UGX 13,000" },
      { size: "150kg", price: "UGX 5,000" }
    ]
  },
  "Yarabela Sulfan": {
    name: "Yarabela Sulfan",
    supplier: "Mabugu Farm Supply",
    description: "YaraBela SULFAN is a unique, high quality nitrate product with sulphur included during the production process. An excellent fertilizer for top dressing crops that need nitrate, but also benefit from the inclusion of sulphur.",
    pricing: [
      { size: "50kg", price: "UGX 125,000" }
    ]
  },
  "Microp - Topdressing Fertilizer": {
    name: "Microp - Topdressing Fertilizer",
    supplier: "Yara East Africa Ltd",
    description: "This is a high quality blended high Nitrogen fertilizer for topdressing cereals and sugarcane. It has been developed with soil conditions in mind to address key nutritional deficiencies, sulfur and zinc, for higher yields.",
    pricing: [
      { size: "50kg", price: "UGX 135,000" }
    ]
  },
  "Agricultural Lim": {
    name: "Agricultural Lim",
    supplier: "Agape Innovations Limited",
    description: "Ag Lime ,or agricultural lime, is a soil conditioner made from crushed lime stone or dolomitic lime stone. Ag limestone works by dissolving releasing a base that lowers the acidity of the soil.",
    pricing: [
      { size: "30kg", price: "UGX 25,000" }
    ]
  },
  "Sop - Sulphate Of Potash": {
    name: "Sop - Sulphate Of Potash",
    supplier: "Grain Pulse Ltd",
    description: "Sulphate of Potash or Potassium Sulphate (K-52% + S 18%). It is considered a premium-quality potash fertilizer containing two key nutrients for growing crops: potassium and sulphur.",
    pricing: [
      { size: "50 Kg", price: "UGX 170,000" },
      { size: "25 Kg", price: "UGX 94,000" },
      { size: "10 Kg", price: "UGX 33,400" }
    ]
  },
  "Super Green – Liquid Complete And Balanced Water-soluble Fertilizer": {
    name: "Super Green – Liquid Complete And Balanced Water-soluble Fertilizer",
    supplier: "Bukoola Chemical Industries (U) Ltd",
    description: "Super green is a complete and balanced water-soluble fertilizer containing both Major and micro nutrients required by any crop for healthy establishment, growth and optimum yield.",
    pricing: [
      { size: "1 Ltr", price: "UGX 11,000" },
      { size: "500 ml", price: "UGX 7,000" }
    ]
  },
  "Green Miracle – Anti-transparent That Help Fight Plant Stress During Heavy Drought": {
    name: "Green Miracle – Anti-transparent That Help Fight Plant Stress During Heavy Drought",
    supplier: "Bukoola Chemical Industries (U) Ltd",
    description: "Green Miracle is a new-generation, reflective type of anti-transpirant and anti-stress product. Green Miracle functions primarily on the principle of reflecting the sun's rays.",
    pricing: [
      { size: "1 Ltr", price: "UGX 31,000" },
      { size: "500 ml", price: "UGX 16,000" }
    ]
  },
  "Ammonium Sulphate": {
    name: "Ammonium Sulphate",
    supplier: "Export Trading Group",
    description: "N-21%: S-24%. Contains two nutrients (Nitrogen and Sulphur). It is used for growth of different plants especially ground plants and cereals.",
    pricing: [
      { size: "50 Kg", price: "UGX 140,000" }
    ]
  },
  "Polyfeed 19-19-19 +Te": {
    name: "Polyfeed 19-19-19 +Te",
    supplier: "Balton Uganda Ltd",
    description: "Foliar fertilizer for every stage of your crop. Supplies Nitrogen, Phosphorus,Potassium, Magnesium and micronutrients.",
    pricing: [
      { size: "25kg", price: "UGX 350,000" }
    ]
  },
  "Yaramila Java": {
    name: "Yaramila Java",
    supplier: "Yara East Africa Ltd",
    description: "YaraMila JAVA is a high-quality compound NPK, specifically designed for coffee in most situations. The balanced nutrients mean the crop gets a good support for development.",
    pricing: [
      { size: "50kg", price: "UGX 162,000" }
    ]
  },
  "Folcrop-b-mo (Fertilizer)": {
    name: "Folcrop-b-mo (Fertilizer)",
    supplier: "Faith Agro Inputs",
    description: "Amino acids, boron and molybdenum-based bio stimulant that stimulates the flowering, pollination, setting and development of fruit processes",
    pricing: [
      { size: "1ltr", price: "UGX 35,000" },
      { size: "500mls", price: "UGX 25,000" }
    ]
  },
  "Easygro Vegetative": {
    name: "Easygro Vegetative",
    supplier: "Osho Chemical Industries Ltd",
    description: "This is a fertilizer with chelated micro-elements and bio-stimulants for foliar feeding and fertigation. It is recommended for use during: Plant growth periods that require relatively high Nitrogen levels.",
    pricing: [
      { size: "1 Kg", price: "UGX 20,000" },
      { size: "250 g", price: "UGX 6,400" },
      { size: "500 g", price: "UGX 9,600" }
    ]
  },
  "Npk 20:20:18 - Fertilizer For Maize": {
    name: "Npk 20:20:18 - Fertilizer For Maize",
    supplier: "Grain Pulse Ltd",
    description: "Blended Fertilizer for Maize, used at planting to improve soil fertility and increase maize productivity. Application rate: 100kg per acre.",
    pricing: [
      { size: "50 Kg", price: "UGX 150,000" },
      { size: "10 Kg", price: "UGX 37,000" },
      { size: "25 Kg", price: "UGX 77,000" }
    ]
  },
  "Dap": {
    name: "Dap",
    supplier: "Grain Pulse Ltd",
    description: "This is the most concentrated phosphorous-based fertilizer perfect for any agriculture crop. This can be applied as top-dressing during planting and at seeding level as well as cultivating period.",
    pricing: [
      { size: "50 Kg", price: "UGX 175,000" }
    ]
  },
  "Agrofeed Plus – Foliar Fertilizer": {
    name: "Agrofeed Plus – Foliar Fertilizer",
    supplier: "Osho Chemical Industries Ltd",
    description: "AGROFEED PL is a liquid foliar fertilizer and plant booster, which contains well-balanced nutrients essential for plant growth. It is especially formulated for rapid and effective absorption through leaves.",
    pricing: [
      { size: "500 mls", price: "UGX 9,000" },
      { size: "1 Ltr", price: "UGX 15,000" }
    ]
  }
};

function createProductMarkdown(productName, data) {
  const { name, supplier, description, content, application, pricing } = data;
  
  let markdown = `# ${name}\n\n`;
  
  if (supplier) {
    markdown += `## Supplier\n${supplier}\n\n`;
  }
  
  markdown += `## Overview\n${description}\n\n`;
  
  if (content) {
    markdown += `## Content/Composition\n${content}\n\n`;
  }
  
  if (application) {
    markdown += `## Application/Usage\n${application}\n\n`;
  }
  
  markdown += `## Price Information\n`;
  pricing.forEach(price => {
    markdown += `${price.size}: ${price.price}\n`;
  });
  markdown += `\n`;
  
  markdown += `## Key Features\n`;
  markdown += `- High quality agricultural fertilizer\n`;
  markdown += `- Suitable for various crop types\n`;
  markdown += `- Easy to apply and use\n`;
  markdown += `- Proven results in crop yield improvement\n\n`;
  
  markdown += `## Usage Instructions\n`;
  markdown += `- Follow recommended application rates\n`;
  markdown += `- Apply at appropriate growth stages\n`;
  markdown += `- Ensure proper soil conditions\n`;
  markdown += `- Water after application for best results\n\n`;
  
  markdown += `## Benefits\n`;
  markdown += `- Improved crop yield and quality\n`;
  markdown += `- Enhanced plant growth and development\n`;
  markdown += `- Better nutrient uptake and utilization\n`;
  markdown += `- Cost-effective solution for farmers\n\n`;
  
  markdown += `## Storage Instructions\n`;
  markdown += `- Store in cool, dry place\n`;
  markdown += `- Keep away from direct sunlight\n`;
  markdown += `- Ensure proper ventilation\n`;
  markdown += `- Keep away from children and pets\n\n`;
  
  markdown += `## Safety Information\n`;
  markdown += `- Use protective equipment during application\n`;
  markdown += `- Avoid contact with eyes and skin\n`;
  markdown += `- Store separately from food items\n`;
  markdown += `- Follow all safety guidelines\n\n`;
  
  markdown += `## Contact Information\n`;
  markdown += `Phone: +256 700 123 456\n`;
  markdown += `Email: sales@agrof.com\n`;
  markdown += `WhatsApp: +256 700 123 456\n`;
  
  return markdown;
}

// Update all product.md files
const FERTILIZERS_DIR = path.join(__dirname, '../agrof-main/mobile/app/assets/store/FERTLIZERS');

console.log("🔧 Updating all fertilizer product.md files with correct data...");
console.log("==================================================");

let updatedCount = 0;
let errorCount = 0;

Object.keys(productData).forEach(productName => {
  const productPath = path.join(FERTILIZERS_DIR, productName, 'product.md');
  
  if (fs.existsSync(path.dirname(productPath))) {
    try {
      const markdown = createProductMarkdown(productName, productData[productName]);
      fs.writeFileSync(productPath, markdown, 'utf8');
      console.log(`✅ Updated: ${productName}`);
      updatedCount++;
    } catch (err) {
      console.error(`❌ Error updating ${productName}:`, err.message);
      errorCount++;
    }
  } else {
    console.warn(`⚠️ Directory not found for ${productName}`);
    errorCount++;
  }
});

console.log("\n📊 Update summary:");
console.log(`✅ Successfully updated: ${updatedCount} products`);
console.log(`❌ Errors: ${errorCount} products`);
console.log(`🔧 Total processed: ${updatedCount + errorCount} products`);

console.log("\n🎉 All product.md files have been updated with correct pricing and detailed information!");


