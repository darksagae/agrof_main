// Generate herbicideImages object with new descriptive names
const fs = require('fs');
const path = require('path');

const herbicideSimplePath = '/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/HERBICIDES_SIMPLE';
const files = fs.readdirSync(herbicideSimplePath);

console.log('// Import all herbicide images from simplified folder structure');
console.log('const herbicideImages = {');

files.forEach((file, index) => {
  const nameWithoutExt = file.replace(/\.[^/.]+$/, "");
  const key = nameWithoutExt;
  const extension = path.extname(file);
  
  console.log(`  '${key}': require('../assets/HERBICIDES_SIMPLE/${file}'),`);
});

console.log('};');
console.log('');
console.log(`// Total images: ${files.length}`);
