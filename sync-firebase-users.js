/**
 * Fetch all users from Firebase and add them to Cloudinary users index
 * This script uses your existing Firebase configuration
 */

const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');

// Your Firebase configuration (from firebaseConfig.js)
const firebaseConfig = {
  apiKey: "AIzaSyDPvSVaojBNt4jePYVDvdH8oSjpXI1IqP4",
  authDomain: "agrof-e05c3.firebaseapp.com",
  projectId: "agrof-e05c3",
  storageBucket: "agrof-e05c3.firebasestorage.app",
  messagingSenderId: "1017756045878",
  appId: "1:1017756045878:web:7a41e1652fb31b1f8e9c48",
  measurementId: "G-VN2FHW20CZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log('🔥 Firebase initialized');
console.log('📊 Project:', firebaseConfig.projectId);
console.log('');

console.log('⚠️  IMPORTANT:');
console.log('The Firebase Client SDK cannot list all users (security restriction).');
console.log('Only Firebase Admin SDK can list users.');
console.log('');
console.log('📋 TO ADD USERS MANUALLY:');
console.log('');
console.log('1. Go to Firebase Console:');
console.log('   https://console.firebase.google.com/project/agrof-e05c3/authentication/users');
console.log('');
console.log('2. Copy each User UID (the long string under "User UID" column)');
console.log('');
console.log('3. Run this command:');
console.log('   cd /home/darksagae/Desktop/agrof-up/cloudinary-backend');
console.log('   node add-users-to-index.js UID1 UID2 UID3');
console.log('');
console.log('📌 Example:');
console.log('   node add-users-to-index.js QBTloeeYLkTEYjbI05QDWuN7pBm1 k8zjxHKhuVUtfR9y16ywNVt4vj92');
console.log('');

process.exit(0);



