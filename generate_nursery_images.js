// Generate nurseryImages object with new descriptive names
const fs = require('fs');
const path = require('path');

const nurserySimplePath = '/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/NURSERY_BED_SIMPLE';
const files = fs.readdirSync(nurserySimplePath);

console.log('  // Import all nursery bed images from simplified folder structure');
console.log('  const nurseryImages = {');

files.forEach((file, index) => {
  const nameWithoutExt = file.replace(/\.[^/.]+$/, "");
  const key = nameWithoutExt;
  
  console.log(`    '${key}': require('../assets/NURSERY_BED_SIMPLE/${file}'),`);
});

console.log('  };');
console.log('');
console.log(`// Total images: ${files.length}`);
