// Test Firestore connection to diagnose WebChannel errors
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, setDoc } = require('firebase/firestore');

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAPqAFqia-2SsOiyJ322HczYsDNymhX52Q",
  authDomain: "agrof-ef825.firebaseapp.com",
  projectId: "agrof-ef825",
  storageBucket: "agrof-ef825.appspot.com",
  messagingSenderId: "471115379901",
  appId: "1:471115379901:web:agrof-mobile-app"
};

async function testFirestoreConnection() {
  try {
    console.log('🔥 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'default'); // Use the 'default' database
    
    console.log('🔥 Testing Firestore connection...');
    
    // Test 1: Try to read from a collection
    console.log('📖 Test 1: Reading from test collection...');
    try {
      const testRef = collection(db, 'test');
      const snapshot = await getDocs(testRef);
      console.log('✅ Test collection read successful:', snapshot.size, 'documents');
    } catch (error) {
      console.log('⚠️ Test collection read failed (this is normal):', error.message);
    }
    
    // Test 2: Try to write a test document
    console.log('📝 Test 2: Writing test document...');
    try {
      const testDocRef = doc(db, 'test', 'connection-test');
      await setDoc(testDocRef, {
        message: 'Connection test',
        timestamp: new Date().toISOString(),
        success: true
      });
      console.log('✅ Test document write successful');
    } catch (error) {
      console.log('⚠️ Test document write failed:', error.message);
    }
    
    // Test 3: Try to read from users collection (your actual collection)
    console.log('👤 Test 3: Reading from users collection...');
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      console.log('✅ Users collection read successful:', snapshot.size, 'users');
    } catch (error) {
      console.log('⚠️ Users collection read failed:', error.message);
    }
    
    console.log('🎉 Firestore connection test completed!');
    console.log('💡 WebChannel warnings are usually just connection retries and don\'t affect functionality');
    
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
  }
}

testFirestoreConnection();

const { getFirestore, collection, getDocs, doc, setDoc } = require('firebase/firestore');

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAPqAFqia-2SsOiyJ322HczYsDNymhX52Q",
  authDomain: "agrof-ef825.firebaseapp.com",
  projectId: "agrof-ef825",
  storageBucket: "agrof-ef825.appspot.com",
  messagingSenderId: "471115379901",
  appId: "1:471115379901:web:agrof-mobile-app"
};

async function testFirestoreConnection() {
  try {
    console.log('🔥 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'default'); // Use the 'default' database
    
    console.log('🔥 Testing Firestore connection...');
    
    // Test 1: Try to read from a collection
    console.log('📖 Test 1: Reading from test collection...');
    try {
      const testRef = collection(db, 'test');
      const snapshot = await getDocs(testRef);
      console.log('✅ Test collection read successful:', snapshot.size, 'documents');
    } catch (error) {
      console.log('⚠️ Test collection read failed (this is normal):', error.message);
    }
    
    // Test 2: Try to write a test document
    console.log('📝 Test 2: Writing test document...');
    try {
      const testDocRef = doc(db, 'test', 'connection-test');
      await setDoc(testDocRef, {
        message: 'Connection test',
        timestamp: new Date().toISOString(),
        success: true
      });
      console.log('✅ Test document write successful');
    } catch (error) {
      console.log('⚠️ Test document write failed:', error.message);
    }
    
    // Test 3: Try to read from users collection (your actual collection)
    console.log('👤 Test 3: Reading from users collection...');
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      console.log('✅ Users collection read successful:', snapshot.size, 'users');
    } catch (error) {
      console.log('⚠️ Users collection read failed:', error.message);
    }
    
    console.log('🎉 Firestore connection test completed!');
    console.log('💡 WebChannel warnings are usually just connection retries and don\'t affect functionality');
    
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
  }
}

testFirestoreConnection();
