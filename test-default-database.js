// Test the 'default' database specifically
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, setDoc, updateDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAPqAFqia-2SsOiyJ322HczYsDNymhX52Q",
  authDomain: "agrof-ef825.firebaseapp.com",
  projectId: "agrof-ef825",
  storageBucket: "agrof-ef825.appspot.com",
  messagingSenderId: "471115379901",
  appId: "1:471115379901:web:agrof-mobile-app"
};

async function testDefaultDatabase() {
  try {
    console.log('🔥 Testing DEFAULT database (not the (default) one)...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'default'); // Use 'default' database
    
    console.log('📖 Testing read operation from users collection...');
    
    // Test reading from users collection first
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    console.log('✅ SUCCESS: Read operation worked! Found', snapshot.size, 'users');
    
    if (snapshot.size > 0) {
      console.log('📋 Users found:');
      snapshot.forEach(doc => {
        console.log('  -', doc.id, ':', doc.data());
      });
    }
    
    console.log('📝 Testing write operation to default database...');
    
    // Test writing a user document
    const testUserRef = doc(db, 'users', 'test-user-456');
    await setDoc(testUserRef, {
      uid: 'test-user-456',
      email: 'test2@agrof.com',
      username: 'testuser2',
      phone: '+256700000001',
      updatedAt: new Date()
    });
    
    console.log('✅ SUCCESS: Write operation to default database worked!');
    
    // Test update
    await updateDoc(testUserRef, {
      username: 'updateduser2',
      updatedAt: new Date()
    });
    
    console.log('✅ SUCCESS: Update operation worked!');
    console.log('🎉 DEFAULT database and users collection are fully functional!');
    
  } catch (error) {
    console.error('❌ Error with default database:', error.message);
    if (error.code === 'permission-denied') {
      console.log('   This might be a security rules issue');
    } else if (error.message.includes('billing')) {
      console.log('   This database also requires billing');
    }
  }
}

testDefaultDatabase();

const { getFirestore, collection, getDocs, doc, setDoc, updateDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAPqAFqia-2SsOiyJ322HczYsDNymhX52Q",
  authDomain: "agrof-ef825.firebaseapp.com",
  projectId: "agrof-ef825",
  storageBucket: "agrof-ef825.appspot.com",
  messagingSenderId: "471115379901",
  appId: "1:471115379901:web:agrof-mobile-app"
};

async function testDefaultDatabase() {
  try {
    console.log('🔥 Testing DEFAULT database (not the (default) one)...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'default'); // Use 'default' database
    
    console.log('📖 Testing read operation from users collection...');
    
    // Test reading from users collection first
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    console.log('✅ SUCCESS: Read operation worked! Found', snapshot.size, 'users');
    
    if (snapshot.size > 0) {
      console.log('📋 Users found:');
      snapshot.forEach(doc => {
        console.log('  -', doc.id, ':', doc.data());
      });
    }
    
    console.log('📝 Testing write operation to default database...');
    
    // Test writing a user document
    const testUserRef = doc(db, 'users', 'test-user-456');
    await setDoc(testUserRef, {
      uid: 'test-user-456',
      email: 'test2@agrof.com',
      username: 'testuser2',
      phone: '+256700000001',
      updatedAt: new Date()
    });
    
    console.log('✅ SUCCESS: Write operation to default database worked!');
    
    // Test update
    await updateDoc(testUserRef, {
      username: 'updateduser2',
      updatedAt: new Date()
    });
    
    console.log('✅ SUCCESS: Update operation worked!');
    console.log('🎉 DEFAULT database and users collection are fully functional!');
    
  } catch (error) {
    console.error('❌ Error with default database:', error.message);
    if (error.code === 'permission-denied') {
      console.log('   This might be a security rules issue');
    } else if (error.message.includes('billing')) {
      console.log('   This database also requires billing');
    }
  }
}

testDefaultDatabase();
