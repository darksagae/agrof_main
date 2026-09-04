const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'agrof-ef825'
});

const db = admin.firestore();

async function setupFirestore() {
  try {
    console.log('🔥 Setting up Firestore collections...');
    
    // Create a test user document
    const testUserRef = db.collection('users').doc('test-user-123');
    await testUserRef.set({
      uid: 'test-user-123',
      email: 'test@agrof.com',
      fullName: 'Test User',
      username: 'testuser',
      phone: '+256700000000',
      emailVerified: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Test user document created successfully!');
    
    // Create a test pending user document
    const testPendingUserRef = db.collection('pendingUsers').doc('pending-user-456');
    await testPendingUserRef.set({
      uid: 'pending-user-456',
      email: 'pending@agrof.com',
      fullName: 'Pending User',
      phone: '+256700000001',
      emailVerified: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Test pending user document created successfully!');
    
    // Test reading the documents
    const userDoc = await testUserRef.get();
    const pendingUserDoc = await testPendingUserRef.get();
    
    console.log('📖 Test user data:', userDoc.data());
    console.log('📖 Test pending user data:', pendingUserDoc.data());
    
    console.log('🎉 Firestore setup completed successfully!');
    console.log('🔗 View your data at: https://console.firebase.google.com/project/agrof-ef825/firestore');
    
  } catch (error) {
    console.error('❌ Error setting up Firestore:', error);
  }
}

setupFirestore();


// Initialize Firebase Admin
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'agrof-ef825'
});

const db = admin.firestore();

async function setupFirestore() {
  try {
    console.log('🔥 Setting up Firestore collections...');
    
    // Create a test user document
    const testUserRef = db.collection('users').doc('test-user-123');
    await testUserRef.set({
      uid: 'test-user-123',
      email: 'test@agrof.com',
      fullName: 'Test User',
      username: 'testuser',
      phone: '+256700000000',
      emailVerified: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Test user document created successfully!');
    
    // Create a test pending user document
    const testPendingUserRef = db.collection('pendingUsers').doc('pending-user-456');
    await testPendingUserRef.set({
      uid: 'pending-user-456',
      email: 'pending@agrof.com',
      fullName: 'Pending User',
      phone: '+256700000001',
      emailVerified: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Test pending user document created successfully!');
    
    // Test reading the documents
    const userDoc = await testUserRef.get();
    const pendingUserDoc = await testPendingUserRef.get();
    
    console.log('📖 Test user data:', userDoc.data());
    console.log('📖 Test pending user data:', pendingUserDoc.data());
    
    console.log('🎉 Firestore setup completed successfully!');
    console.log('🔗 View your data at: https://console.firebase.google.com/project/agrof-ef825/firestore');
    
  } catch (error) {
    console.error('❌ Error setting up Firestore:', error);
  }
}

setupFirestore();


