// Simple verification that Firestore is working
console.log('🔥 Verifying Firestore setup...');

// Check if we can access Firebase project
const { execSync } = require('child_process');

try {
  // Check Firebase project status
  console.log('📋 Checking Firebase project status...');
  const projectInfo = execSync('firebase projects:list', { encoding: 'utf8' });
  console.log('✅ Firebase project accessible:', projectInfo.includes('agrof-ef825'));
  
  // Check Firestore databases
  console.log('📋 Checking Firestore databases...');
  const databases = execSync('firebase firestore:databases:list', { encoding: 'utf8' });
  console.log('✅ Firestore databases:', databases);
  
  // Check deployed rules
  console.log('📋 Checking deployed rules...');
  const rules = execSync('firebase firestore:rules:get', { encoding: 'utf8' });
  console.log('✅ Firestore rules deployed successfully!');
  
  console.log('🎉 Firestore is ready for your AGROF app!');
  console.log('🔗 View your database at: https://console.firebase.google.com/project/agrof-ef825/firestore');
  
} catch (error) {
  console.error('❌ Error verifying Firestore:', error.message);
}

console.log('🔥 Verifying Firestore setup...');

// Check if we can access Firebase project
const { execSync } = require('child_process');

try {
  // Check Firebase project status
  console.log('📋 Checking Firebase project status...');
  const projectInfo = execSync('firebase projects:list', { encoding: 'utf8' });
  console.log('✅ Firebase project accessible:', projectInfo.includes('agrof-ef825'));
  
  // Check Firestore databases
  console.log('📋 Checking Firestore databases...');
  const databases = execSync('firebase firestore:databases:list', { encoding: 'utf8' });
  console.log('✅ Firestore databases:', databases);
  
  // Check deployed rules
  console.log('📋 Checking deployed rules...');
  const rules = execSync('firebase firestore:rules:get', { encoding: 'utf8' });
  console.log('✅ Firestore rules deployed successfully!');
  
  console.log('🎉 Firestore is ready for your AGROF app!');
  console.log('🔗 View your database at: https://console.firebase.google.com/project/agrof-ef825/firestore');
  
} catch (error) {
  console.error('❌ Error verifying Firestore:', error.message);
}


