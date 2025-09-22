// Test module resolution for seeds images
console.log('Testing module resolution...');

try {
  const testImage = require('./agrof-main/mobile/app/assets/SEEDS_SIMPLE/anita_watermelon.jpg');
  console.log('✅ Module resolution successful:', testImage);
} catch (error) {
  console.log('❌ Module resolution failed:', error.message);
}

try {
  const testImage2 = require('./agrof-main/mobile/app/assets/SEEDS_SIMPLE/arjani_f1_eggplants.jpeg');
  console.log('✅ Module resolution successful:', testImage2);
} catch (error) {
  console.log('❌ Module resolution failed:', error.message);
}
