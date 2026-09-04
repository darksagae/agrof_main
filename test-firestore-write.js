// Test Firestore write operations to see if it's working
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAPqAFqia-2SsOiyJ322HczYsDNymhX52Q",
  authDomain: "agrof-ef825.firebaseapp.com",
  projectId: "agrof-ef825",
  storageBucket: "agrof-ef825.appspot.com",
  messagingSenderId: "471115379901",
  appId: "1:471115379901:web:agrof-mobile-app"
};

async function testFirestoreWrite() {
  try {
    console.log('🔥 Testing Firestore write operations...');
    
    const app = initializeApp(firebaseConfig);
    
    // Test both databases
    const databases = ['(default)', 'default'];
    
    for (const dbName of databases) {
      console.log(`\n📝 Testing ${dbName} database...`);
      
      const db = getFirestore(app, dbName === '(default)' ? undefined : dbName);
      
      try {
        // Try to write a test document
        const testDocRef = doc(db, 'users', 'test-user-write');
        await setDoc(testDocRef, {
          email: 'test@agrof.com',
          username: 'testuser',
          phone: '+256700000000',
          createdAt: new Date().toISOString(),
          testWrite: true
        });
        
        console.log(`✅ SUCCESS: Write operation to ${dbName} worked!`);
        
        // Try to read it back
        const docSnap = await getDoc(testDocRef);
        if (docSnap.exists()) {
          console.log(`✅ SUCCESS: Read operation from ${dbName} worked!`);
          console.log('   Data:', docSnap.data());
        } else {
          console.log(`⚠️ Document not found in ${dbName}`);
        }
        
      } catch (error) {
        console.log(`❌ FAILED: ${dbName} database error:`, error.message);
        if (error.code === 'permission-denied') {
          console.log('   → This suggests security rules need to be updated');
        } else if (error.message.includes('billing')) {
          console.log('   → This database requires billing to be enabled');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testFirestoreWrite();

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAPqAFqia-2SsOiyJ322HczYsDNymhX52Q",
  authDomain: "agrof-ef825.firebaseapp.com",
  projectId: "agrof-ef825",
  storageBucket: "agrof-ef825.appspot.com",
  messagingSenderId: "471115379901",
  appId: "1:471115379901:web:agrof-mobile-app"
};

async function testFirestoreWrite() {
  try {
    console.log('🔥 Testing Firestore write operations...');
    
    const app = initializeApp(firebaseConfig);
    
    // Test both databases
    const databases = ['(default)', 'default'];
    
    for (const dbName of databases) {
      console.log(`\n📝 Testing ${dbName} database...`);
      
      const db = getFirestore(app, dbName === '(default)' ? undefined : dbName);
      
      try {
        // Try to write a test document
        const testDocRef = doc(db, 'users', 'test-user-write');
        await setDoc(testDocRef, {
          email: 'test@agrof.com',
          username: 'testuser',
          phone: '+256700000000',
          createdAt: new Date().toISOString(),
          testWrite: true
        });
        
        console.log(`✅ SUCCESS: Write operation to ${dbName} worked!`);
        
        // Try to read it back
        const docSnap = await getDoc(testDocRef);
        if (docSnap.exists()) {
          console.log(`✅ SUCCESS: Read operation from ${dbName} worked!`);
          console.log('   Data:', docSnap.data());
        } else {
          console.log(`⚠️ Document not found in ${dbName}`);
        }
        
      } catch (error) {
        console.log(`❌ FAILED: ${dbName} database error:`, error.message);
        if (error.code === 'permission-denied') {
          console.log('   → This suggests security rules need to be updated');
        } else if (error.message.includes('billing')) {
          console.log('   → This database requires billing to be enabled');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testFirestoreWrite();


