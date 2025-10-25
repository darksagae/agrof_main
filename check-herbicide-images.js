/**
 * Check which herbicide products have real images vs placeholders
 */

const fs = require('fs');
const path = require('path');

const herbicideDir = './agrof-main/mobile/app/assets/store/HERBICIDE';
const folders = fs.readdirSync(herbicideDir).filter(f => 
  fs.statSync(path.join(herbicideDir, f)).isDirectory()
);

console.log('='.repeat(70));
console.log('HERBICIDE PRODUCTS - IMAGE STATUS');
console.log('='.repeat(70));
console.log();

let hasRealImage = [];
let hasUUIDImage = [];
let noImage = [];

folders.forEach(folder => {
  const productDir = path.join(herbicideDir, folder);
  const imageFiles = fs.readdirSync(productDir)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  
  if (imageFiles.length === 0) {
    noImage.push(folder);
  } else {
    const imageName = imageFiles[0];
    // Check if it's a UUID placeholder (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.png)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg)$/i.test(imageName)) {
      hasUUIDImage.push({ folder, image: imageName });
    } else {
      hasRealImage.push({ folder, image: imageName });
    }
  }
});

console.log(`✅ Products with REAL images: ${hasRealImage.length}`);
hasRealImage.forEach(p => console.log(`   - ${p.folder}: ${p.image}`));
console.log();

console.log(`❌ Products with UUID placeholder images: ${hasUUIDImage.length}`);
hasUUIDImage.forEach(p => console.log(`   - ${p.folder}: ${p.image}`));
console.log();

console.log(`⚠️  Products with NO images: ${noImage.length}`);
noImage.forEach(p => console.log(`   - ${p}`));
console.log();

console.log('='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70));
console.log(`Total folders: ${folders.length}`);
console.log(`✅ Real images: ${hasRealImage.length}`);
console.log(`❌ UUID placeholders: ${hasUUIDImage.length}`);
console.log(`⚠️  No images: ${noImage.length}`);
console.log();
console.log('Action: Fix products with real images, mark UUID ones for manual download');




