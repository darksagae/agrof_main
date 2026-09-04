// Test script to check what's in AsyncStorage
// This helps debug why user data isn't loading on restart

const AsyncStorage = require('@react-native-async-storage/async-storage');

async function testAsyncStorage() {
  console.log('🔍 Testing AsyncStorage for user data...\n');
  
  try {
    // Check for user data
    const agrofUsers = await AsyncStorage.getItem('agrof_users');
    
    if (agrofUsers) {
      console.log('✅ Found agrof_users in AsyncStorage:');
      const users = JSON.parse(agrofUsers);
      console.log(JSON.stringify(users, null, 2));
      
      console.log('\n📊 Summary:');
      const userIds = Object.keys(users);
      console.log(`   Total users: ${userIds.length}`);
      
      userIds.forEach((uid, index) => {
        const user = users[uid];
        console.log(`\n   User ${index + 1}:`);
        console.log(`   - UID: ${uid}`);
        console.log(`   - Email: ${user.email}`);
        console.log(`   - Full Name: ${user.fullName}`);
        console.log(`   - Phone: ${user.phone}`);
        console.log(`   - Username: ${user.username}`);
        console.log(`   - Photo: ${user.profilePhoto ? 'Yes' : 'No'}`);
      });
    } else {
      console.log('❌ No agrof_users found in AsyncStorage');
      console.log('   This means no user data has been saved yet.');
    }
    
    // Check for auth token
    const authToken = await AsyncStorage.getItem('firebase_auth_token');
    console.log('\n🔑 Firebase Auth Token:', authToken ? 'Exists' : 'Not found');
    
    // Check for UID
    const uid = await AsyncStorage.getItem('firebase_uid');
    console.log('🆔 Firebase UID:', uid || 'Not found');
    
    // List all keys
    console.log('\n📋 All AsyncStorage keys:');
    const allKeys = await AsyncStorage.getAllKeys();
    console.log(allKeys);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// For React Native, this would run in the app
// For Node.js testing, you'd need to mock AsyncStorage
console.log('💡 To run this in your React Native app:');
console.log('   1. Import this code in App.js');
console.log('   2. Call testAsyncStorage() in useEffect');
console.log('   3. Check console logs\n');

// Mock for Node.js testing (remove in production)
if (typeof AsyncStorage === 'undefined') {
  console.log('⚠️ Running in Node.js - AsyncStorage not available');
  console.log('   Run this code inside your React Native app instead');
}

module.exports = { testAsyncStorage };


// This helps debug why user data isn't loading on restart

const AsyncStorage = require('@react-native-async-storage/async-storage');

async function testAsyncStorage() {
  console.log('🔍 Testing AsyncStorage for user data...\n');
  
  try {
    // Check for user data
    const agrofUsers = await AsyncStorage.getItem('agrof_users');
    
    if (agrofUsers) {
      console.log('✅ Found agrof_users in AsyncStorage:');
      const users = JSON.parse(agrofUsers);
      console.log(JSON.stringify(users, null, 2));
      
      console.log('\n📊 Summary:');
      const userIds = Object.keys(users);
      console.log(`   Total users: ${userIds.length}`);
      
      userIds.forEach((uid, index) => {
        const user = users[uid];
        console.log(`\n   User ${index + 1}:`);
        console.log(`   - UID: ${uid}`);
        console.log(`   - Email: ${user.email}`);
        console.log(`   - Full Name: ${user.fullName}`);
        console.log(`   - Phone: ${user.phone}`);
        console.log(`   - Username: ${user.username}`);
        console.log(`   - Photo: ${user.profilePhoto ? 'Yes' : 'No'}`);
      });
    } else {
      console.log('❌ No agrof_users found in AsyncStorage');
      console.log('   This means no user data has been saved yet.');
    }
    
    // Check for auth token
    const authToken = await AsyncStorage.getItem('firebase_auth_token');
    console.log('\n🔑 Firebase Auth Token:', authToken ? 'Exists' : 'Not found');
    
    // Check for UID
    const uid = await AsyncStorage.getItem('firebase_uid');
    console.log('🆔 Firebase UID:', uid || 'Not found');
    
    // List all keys
    console.log('\n📋 All AsyncStorage keys:');
    const allKeys = await AsyncStorage.getAllKeys();
    console.log(allKeys);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// For React Native, this would run in the app
// For Node.js testing, you'd need to mock AsyncStorage
console.log('💡 To run this in your React Native app:');
console.log('   1. Import this code in App.js');
console.log('   2. Call testAsyncStorage() in useEffect');
console.log('   3. Check console logs\n');

// Mock for Node.js testing (remove in production)
if (typeof AsyncStorage === 'undefined') {
  console.log('⚠️ Running in Node.js - AsyncStorage not available');
  console.log('   Run this code inside your React Native app instead');
}

module.exports = { testAsyncStorage };



