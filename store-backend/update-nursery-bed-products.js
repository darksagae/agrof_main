const fs = require('fs');
const path = require('path');

const NURSERY_BED_DIR = path.join(__dirname, '../agrof-main/mobile/app/assets/store/Nursery_bed');

const nurseryBedProducts = [
  {
    name: "Bogoya (Gros Michel)-banana T.c Plantlet",
    details: {
      supplier: "Senai Farm Supplies",
      overview: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Desert (yellow) banana; Planting to harvest time: 15-16 months; Susceptibility to weevils: Low; Susceptibility to wilt: High; Average finger size: Medium and long; Average bunch size: Small; Fruit texture: Soft and sweet.",
      other_packaging: "T.C Plantlet UGX 3,600"
    }
  },
  {
    name: "Rosemary Seedling",
    details: {
      supplier: "William Omwech",
      overview: "Rosemary is a perennial shrub and usually grows to about 1 meter (3.3 feet) in height, though some plants can reach up to 2 meters (6.6 feet) tall. The linear leaves are about 1 cm (0.4 inch) long and somewhat resemble small curved pine needles. They are dark green and shiny above, with a white underside and curled leaf margins. The small bluish flowers are borne in axillary clusters and are attractive to bees. Rosemary is fairly resistant to most pests and plant diseases, though it is susceptible to certain fungal infections, such as powdery mildew, in humid climates. Fresh rosemary is one of the most flavorful and fragrant herbs in the kitchen.\nIn ancient times rosemary was believed to strengthen the memory; in literature and folklore it is an emblem of remembrance and fidelity. Rosemary is slightly stimulating. In traditional medicine it was a popular aromatic constituent of tonics and liniments. Today its fragrant oil is an ingredient in numerous toiletry products and in vermouth.",
      gardening_tips: "• Grow in a sunny location. Rosemary thrives in 6-8 hours of direct sun.\n• Water when the soil feels dry. Once established, rosemary likes to stay on the dry side. Allow top inch of soil to dry out between watering, and then water thoroughly.\n• Re-pot as the plant gets larger and the roots fill the container. A rosemary plant that grows in a container can reach 1 to 3 feet high. Just keep transplanting to a larger container when the roots fill the pot.\n• Prune rosemary frequently. The more you trim, the bushier the plant grows. Prune the plant after it flowers to keep it compact.",
      other_packaging: "1 Piece UGX 5,600"
    }
  },
  {
    name: "Parsley Seedling",
    details: {
      supplier: "William Omwech",
      overview: "Parsley is a versatile herb that can be used in many ways, such in, sauces, juices, or as a garnish. Parsley contains several important nutrients, such as vitamins A, K, and C. It's also a good source of the mineral calcium, iron, magnesium, and potassium. This herb can easily be added to many tasty dishes. Parsley stays fresh for up to two weeks, whereas dried parsley may last up to a year. Adding parsley to your diet can boost your health while adding flavor to your favourite recipes.",
      gardening_tips: "Parsley enjoys well-draining soil that is rich in organic matter.\nPick a spot that gets full sun (6 to 8 hours of sunlight).\nTry to choose an area that is weed-free\nBe sure to keep parsley plants sufficiently watered, especially through the heat of summer.\nLightly mulch around the plants to conserve moisture.\nHarvesting: When the leaf stems have three segments, parsley is ready to be harvested",
      other_packaging: "1 Piece UGX 5,600"
    }
  },
  {
    name: "Lemon Balm Seedling",
    details: {
      supplier: "William Omwech",
      overview: "Lemon balm is an herb from the mint family. The leaves, which have a mild lemon aroma, are used to make herbal medicine and flavor foods. Lemon balm is a bushy herbaceous perennial that grows to about 0.6 meters (2 feet) tall. The wrinkled toothed leaves are roughly heart-shaped or oval and are borne in pairs along the square stems. The leaves can be smooth or somewhat hairy.\nLemon balm can be grown easily at home in almost any location. Lemon balm leaves are used fresh or dried to season and flavor foods such as salads, soups, sauces and as a flavoring in candies, liqueurs, wine, and fruit drinks. It is common in herbal teas and has long been used as an herbal remedy for a variety of ailments and as a digestive aid and sleep aid. The essential oil is popular in aromatherapy and is used as a scent in perfumery and cosmetics. Lemon balm is probably one of the easiest herbs to grow and is ideal for beginners. This perennial herb grows and spreads so readily.",
      other_packaging: "1 Piece UGX 5,600"
    }
  },
  {
    name: "Coriander Seedlings",
    details: {
      supplier: "William Omwech",
      overview: "Coriander is a very beautiful annual herb. Its green shade and the shape of the leaves come together perfectly. It is used as spice giving food an extra delicious taste. It has essential oils and vitamins associated with various health benefits such as immunity boosting, Regulation of blood sugars, anti-inflammatory, and anti-cancer properties. It matures very fast with the ability to bare edible mass in about 4-6 weeks. It is such a beautiful plant, looking like a flower. This makes it a perfect addition to your backyard or balcony garden due to its eye-catching beauty. It can also be grown as a sole commercial crop with great profitability potential.",
      other_packaging: "1 Piece UGX 5,600"
    }
  },
  {
    name: "Sweet Basil Seedling (Mujaaja)",
    details: {
      supplier: "William Omwech",
      overview: "Sweet Basil is one of the most iconic culinary herbs. It adds flavor to meals, and its nutrients may provide health benefits. Sweet basil has been used for thousands of years as a culinary and medicinal herb. It acts principally on the digestive and nervous systems, easing flatulence, stomach cramps, colic and indigestion.",
      gardening_tips: "Basil prefers is a sunny location, and a soil that is well supplied with organic matter and is fertile. Basil also likes to be kept well-watered. Poorly prepared soils that are low in nutrients result in slow growing basil that is not very flavorful. Basil is excellent as a decorative/culinary herb in patio or balcony containers or in the garden.\nHarvesting: Limited harvesting of the leaves can start on young plants and as they get larger, individual leaves as well as tips of the plants can be harvested.",
      other_packaging: "1 Piece UGX 5,600"
    }
  },
  {
    name: "Cinnamon Seedling",
    details: {
      supplier: "William Omwech",
      overview: "Cinnamon plant foliage is generally a glossy green to yellow-green, and they produce small flowers. Both the bark and leaves are aromatic It's inner bark can also be used to make the spice. Cinnamon generally has a slow to moderate growth rate and can be planted in the spring or early fall. Cinnamon is used to flavor a variety of foods, from confections to curries to beverages, and is popular in bakery products. Essential oil can be distilled from the bark fragments for use in food, liqueur, perfume, and drugs.",
      gardening_tips: "• When planting, make sure to leave enough space for the mature size of your plant. Choose a site several feet away from other trees and shrubs, so your cinnamon plant will get enough light. Dig a hole to the size of your plant's root ball, and amend the soil with compost. Plant the cinnamon, gently press down the soil, and water it well.\n• Cinnamon plants prefer a rich, well-draining soil. A sandy loam will work well. They don't do well sitting in waterlogged soils, and thus heavy clay or hardpan soils are not a recipe for success.",
      other_packaging: "1 Piece UGX 10,700"
    }
  },
  {
    name: "Oregano Seedling",
    details: {
      supplier: "William Omwech",
      overview: "Oregano is a loose, open plant with gray-green leaves and small purple or white flowers. Oregano, is a hardy rampant growing perennial. Oregano is marginally hardy perennial. Oregano is used in sauces, tomato dishes, pizza, Mexican dishes, salads and soups. Oregano is considered a staple herb in many cuisines around the world. It has a strong flavor and brings warmth to dishes, along with a hint of subtle sweetness. It can be used fresh, dried or as an oil. It has some significant health benefits.",
      key_benefits: "• Rich in Antioxidants\n• May Help Fight Bacteria\n• Could Have Anti-Cancer Properties\n• Could Decrease Inflammation\n• Easy to Add to Your Diet",
      other_packaging: "1 Piece UGX 5,600"
    }
  },
  {
    name: "Lemon Grass (Kisubi)",
    details: {
      supplier: "William Omwech",
      overview: "Lemon grass is a perennial herb with a light lemon scent and flavor.\nThis grass has a rich flavor of lemon citrus, can be used to brew tea as well as a herb for seasoning. Lemon grass essential oil can be used in aromatherapy, cosmetics, and as natural insecticide. It has a lemony flavour and can be dried and powdered or used fresh.",
      special_attributes: "• The crop can be harvested continuously for long.\n• Lemongrass can be grown in a pot or any other container and put on the veranda or balcony.",
      other_packaging: "1 Piece UGX 5,600"
    }
  },
  {
    name: "Pineapple Mint Seedling",
    details: {
      supplier: "William Omwech",
      overview: "Pineapple Mint is an herbaceous perennial plant commonly grown as a culinary herb. Like most mints, pineapple mint is a creeping plant that spreads from shallow underground rhizomes. Clumps grow 2 to 3 feet tall, and unlimited in width. The aromatic, opposite leaves are oval to oblong. The soft, furry leaves are crinkled and have hairs on both upper and lower surfaces, with downy undersides. Supposedly the leaves have a pineapple fragrance, although is not particularly strong and is more just somewhat sweet and fruity. The foliage tends to remain dense right to the ground, not dropping its lower leaves like many other mints. Pineapple mint typically has pale green leaves margined with cream. The cream and green variegation is quite variable, however, ranging from all-white to solid green and everything in between. It can be used as a tasty topping for fruit, ice cream, cold and hot tea, and juice drinks. Pineapple Mint offer a pleasing pineapple flavor that makes a nice addition to fruit cups, teas and punches when using fresh-cut leaves or, they may be dried for use in sachets.",
      gardening_tips: "Pineapple mint does best in full sun in cool climates (but needs some shade in hotter climates or the leaves will burn; in mild climates it will sprawl and flop over in too much shade), and tolerates all types of moist soil. It needs consistent moisture to look its best but becomes floppy in rich soils or when fertilized much, so is good planted in lean soil. Removing old, woody plants to allow new stems to fill in will keep it looking its best. Cut the foliage back to the ground at the end of the season.\nThey do great in containers. Pollinators love the flowers",
      other_packaging: "1 Piece UGX 5,600"
    }
  },
  {
    name: "Chocolate Mint Seedling",
    details: {
      supplier: "William Omwech",
      overview: "Chocolate mint plants are attractive, fragrant and easy to grow. The plant grows to about 2 feet tall and easily spreads by rhizomes into an attractive ground cover. The rounded, lance-shaped leaves are a darker green than other forms of mint. This plant is a vigorous grower. In cooking, chocolate mint can be used for flavoring desserts and drinks. In landscapes, this fast-growing perennial is often naturalized as a ground cover in moist areas or planted in rain gardens. The plant will spread as far as it is allowed, though it is not particularly hard to keep within its boundaries.",
      gardening_tips: "• Chocolate mint prefers moist, woods-like soil, so it's good to add some organic matter before planting.\n• Mint is one of the few culinary herbs that prefer part shade. You can grow it in full sun if you provide adequate moisture.",
      other_packaging: "1 Piece UGX 5,600"
    }
  },
  {
    name: "Mbwazirume-banana T.c Plantlet",
    details: {
      supplier: "Senai Farm Supplies",
      overview: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Matooke (cooking) banana; Planting to harvest time: 12-13 months; Susceptibility to weevils: Moderate; Susceptibility to wilt: Not susceptible; Average finger size: Medium and medium long; Av. bunch size: Big;Food texture: Soft and golden.",
      other_packaging: "1 T.C Plantlet UGX 3,600"
    }
  },
  {
    name: "M3 Banana Suckers",
    details: {
      supplier: "Zedekia Isabirye",
      overview: "• On a prepared land dig up pits of size of (45x45x45) cm.\n• Leave the pits exposed for some time to enable soil pests get exposed to sunshine.\n• Refill the pit with soil mixed with farmyard manure (10Kg).\n• Put suckers in the middle of the pit and soil around it compacted to keep it firm.\n• Water immediately to provide moisture to the planted sucker.",
      other_packaging: "Sucker UGX 5,000"
    }
  },
  {
    name: "Atwalira - Banana T.c Plantlet",
    details: {
      supplier: "Senai Farm Supplies",
      overview: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Matooke (cooking) banana; Planting to harvest: 13-14 months; Susceptibility to weevils: Moderate; Susceptibility to wilt: Not susceptible; Average finger size: Medium and medium long; Av bunch size: Medium; Food texture: Medium soft.",
      other_packaging: "1 T.C Plantlet UGX 3,600"
    }
  },
  {
    name: "Nakatansese - Banana T.c Plantlet",
    details: {
      supplier: "Senai Farm Supplies",
      overview: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Plantain (roasting) banana; Planting to harvest time: 14-15 months; Susceptibility to weevils: Moderate; Susceptibility to wilt: Moderate; Average finger size: Medium and medium long; Average bunch size: Large; Food texture: Soft and sweet.",
      other_packaging: "1 T.C Plantlet UGX 3,600"
    }
  },
  {
    name: "Musakala - Banana T.c Plantlet",
    details: {
      supplier: "Senai Farm Supplies",
      overview: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Matooke (cooking) banana; Planting to harvest time: 12-13 months; Susceptibility to weevils: Moderate; Susceptibility to wilt: Not susceptible; Average finger size: Large and long; Average bunch size: Big;Food texture: Soft.",
      other_packaging: "1 T.C Plantlet UGX 3,600"
    }
  },
  {
    name: "Mpologoma-banana T.c Plantlet",
    details: {
      supplier: "Senai Farm Supplies",
      overview: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Matooke (cooking) banana; Planting to harvest time: 11-12 months; Susceptibility to weevils: Low; Susceptibility to wilt: Not susceptible; Average finger size: Medium and long; Average bunch size: Big;Food texture: Soft.",
      other_packaging: "1 T.C Plantlet UGX 3,600"
    }
  },
  {
    name: "Kisansa - Banana T.c Plantlet",
    details: {
      supplier: "Senai Farm Supplies",
      overview: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Matooke (cooking) banana; Planting to harvest time: 12-13 months; Susceptibility to weevils: Moderate; Susceptibility to wilt: Not susceptible; Average finger size: Large and long; Average bunch size: Big;Food texture: Soft.",
      other_packaging: "1 T.C Plantlet UGX 3,600"
    }
  },
  {
    name: "Kibuzi - Banana T.c Plantlet",
    details: {
      supplier: "Senai Farm Supplies",
      overview: "These are laboratory bred, clean Tissue culture plantlets, free from pests and diseases. Banana type: Matooke (cooking) banana; Planting to harvest time: 12-13 months; Susceptibility to weevils: Moderate; Susceptibility to wilt: Not susceptible; Average finger size: Medium and medium long; Average bunch size: Big; Food texture: Medium soft.",
      other_packaging: "1 T.C Plantlet UGX 3,600"
    }
  },
  {
    name: "Aloe Vera Seedling",
    details: {
      supplier: "Mukama Mwesigwa Compound Designers",
      overview: "Aloe vera is a succulent plant species that is stemless or very short-stemmed with thick, greenish, fleshy leaves that fan out from the plant's central stem. The margin of the leaf is serrated with small teeth. The useful parts of aloe are the gel and latex. Aloe Vera is associated with a number of health benefits such as skin treatment for conditions such as Psoriasis, Seborrhea, Dandruff, Minor burns, Skin abrasions, Skin injured by radiation, Herpes sores, Acne, Anal fissures. The gel seems to help lower blood sugar levels in people with diabetes. Aloe vera has lately become a commercial crop with great potential for profitability due to the emergence of many herbal companies in Uganda.",
      special_attributes: "• It is easy to grow\n• Tolerant to most pests and diseases\n• Does well in hot climate.",
      other_packaging: "1 Piece UGX 5,600"
    }
  },
  {
    name: "Celery Seedling",
    details: {
      supplier: "Mukama Mwesigwa Compound Designers",
      overview: "This is a crisp, stringless green celery with tightly folded hearts, and broad, thick, well-rounded stalks. It is a vigorous grower without getting flimsy. This is a popular green celery for late use.",
      health_benefits: "• Celery is a negative-calorie food. This means compared to its calorie content, our body spends more calories breaking it down, resulting in an average loss of calories.\n• Celery is rich in fibre content that makes it a detoxification agent for the gut. All parts of celery can flush out the toxins regularly from the gut.\n• Celery contains vitamin A that is essential for stronger immunity, better eyes and healthier skin.",
      other_packaging: "1 Piece UGX 3,500"
    }
  },
  {
    name: "Strawberry Chandler Seedlings",
    details: {
      supplier: "William Omwech",
      overview: "Strawberries are low-growing herbaceous plants with a fibrous root system and a crown from which arise basal leaves. The leaves are compound, typically with three leaflets, sawtooth-edged, and usually hairy. The flowers, generally white, rarely reddish, are borne in small clusters on slender stalks arising, like the surface-creeping stems, from the axils of the leaves. As a plant ages, the root system becomes woody, and the \"mother\" crown sends out runners (e.g., stolons) that touch ground and root, thus enlarging the plant vegetatively. Botanically, the strawberry fruit is considered an \"accessory fruit\" and is not a true berry. The flesh consists of the greatly enlarged flower receptacle and is embedded with the many true fruits, or achenes, which are popularly called seeds.",
      key_benefits: "Packed with vitamins, fiber, and particularly high levels of antioxidants known as polyphenols, strawberries are a sodium-free, fat-free, cholesterol-free, low-calorie food. They are among the top 20 fruits in antioxidant capacity and are a good source of manganese and potassium. Just one serving -- about eight strawberries -- provides more vitamin C than an orange.",
      gardening_tips: "• Strawberry plants require 6-10 hours a day of direct sunlight, so choose your planting site accordingly.\n• Strawberries are tolerant of different soil types, although they prefer loamy soil that drains well. Ideally, begin working in aged manure or compost a couple months before planting. If you have clay soil, generally mix in 4 inches or more of compost, and rake the clay soil into raised mounds to further improve drainage. If your soil is sandy, simply cultivate lightly to remove weeds, and mix in a 1-inch layer of rich compost or rotted manure.\n• Soil pH should be between 5.5 and 7. If necessary, amend your soil in advance of planting. If soils in your area are naturally alkaline, it is best to grow strawberries in half-barrels or other large containers filled with compost-enriched potting soil.\n• The planting site must be well-drained. Raised beds are a particularly good option for strawberry plants.\n• Practice crop rotation for the most success. Unless you plan to amend your soil each year, do not plant in a site that recently had strawberries, tomatoes, peppers, or eggplant.",
      other_packaging: "1 Piece UGX 5,600"
    }
  },
  {
    name: "Mint Seedling",
    details: {
      supplier: "Mukama Mwesigwa Compound Designers",
      overview: "Mint is a perennial herb with very fragrant, toothed leaves and tiny purple, pink, or white flowers. It is fragrant, whether shiny, smooth, bright green. Mints are used as garden accents, ground covers, air fresheners, and herbal medicines. They are easy to grow due to the ability of thriving in sun and shade. Since mint can be vigorous spreaders, you simply have to be careful where you plant it. Not only does mint add fruity, aromatic flavor to foods and tea, but also, it's useful for health remedies such as aiding digestion and relieving headaches. All you need to do is confine this spreading perennial herb to a container or confined bed to keep it from taking over your yard.",
      key_benefits: "• It is easy to grow\n• Can be used for Soothing common cold symptoms due to its menthol composition.\n• It has anti-allergenic effects.\n• Contain an antioxidant and anti-inflammatory agents.",
      other_packaging: "1 Piece UGX 2,400"
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
  if (product.details.gardening_tips) {
    markdown += `## Gardening Tips\n${product.details.gardening_tips}\n\n`;
  }
  if (product.details.special_attributes) {
    markdown += `## Special Attributes\n${product.details.special_attributes}\n\n`;
  }
  if (product.details.key_benefits) {
    markdown += `## Key Benefits\n${product.details.key_benefits}\n\n`;
  }
  if (product.details.health_benefits) {
    markdown += `## Health Benefits\n${product.details.health_benefits}\n\n`;
  }
  if (product.details.other_packaging) {
    markdown += `## Other Packaging\n${product.details.other_packaging}\n\n`;
  }

  return markdown;
}

console.log("🔧 Updating nursery bed product.md files with correct data...");
console.log("==================================================");

let updatedCount = 0;
let errorCount = 0;

nurseryBedProducts.forEach(product => {
  // Sanitize product name to create a valid directory name
  const sanitizedProductName = product.name.replace(/[/\\?%*:|"<>]/g, '').replace(/\s-\s/g, '-').replace(/\s/g, '_');
  const productDirPath = path.join(NURSERY_BED_DIR, sanitizedProductName);
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

console.log("\n🎉 Nursery bed product.md files have been updated with correct information!");
