// Test the login functionality
const AsyncStorage = require('@react-native-async-storage/async-storage');

class FirebaseService {
  constructor() {
    this.currentUser = null;
  }

  async signInWithEmail(email, password) {
    try {
      console.log('🔥 AGROF: Sign in with local storage');
      console.log('📧 Email:', email);
      
      // Check if user exists in local storage
      const existingUsers = await AsyncStorage.getItem('agrof_users');
      let users = existingUsers ? JSON.parse(existingUsers) : {};
      
      // Look for user by email
      let user = null;
      let userId = null;
      
      for (const [uid, userData] of Object.entries(users)) {
        if (userData.email === email) {
          user = userData;
          userId = uid;
          break;
        }
      }
      
      // If user doesn't exist, create a new one
      if (!user) {
        console.log('👤 AGROF: Creating new user');
        userId = `user_${Date.now()}`;
        user = {
          uid: userId,
          email,
          fullName: email.split('@')[0], // Use email prefix as name
          username: email.split('@')[0],
          phone: '+256700000000',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Save new user
        users[userId] = user;
        await AsyncStorage.setItem('agrof_users', JSON.stringify(users));
        console.log('✅ AGROF: New user created and saved');
      } else {
        console.log('✅ AGROF: Existing user found');
      }
      
      // Set as current user
      this.currentUser = user;
      console.log('✅ AGROF: User signed in successfully');
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ AGROF: Sign in error:', error);
      return { success: false, error: error.message };
    }
  }
}

async function testLogin() {
  const firebaseService = new FirebaseService();
  
  console.log('🧪 Testing login functionality...');
  
  // Test login
  const result = await firebaseService.signInWithEmail('test@agrof.com', 'password123');
  
  if (result.success) {
    console.log('✅ Login test successful!');
    console.log('User:', result.user);
  } else {
    console.log('❌ Login test failed:', result.error);
  }
}

testLogin();

const AsyncStorage = require('@react-native-async-storage/async-storage');

class FirebaseService {
  constructor() {
    this.currentUser = null;
  }

  async signInWithEmail(email, password) {
    try {
      console.log('🔥 AGROF: Sign in with local storage');
      console.log('📧 Email:', email);
      
      // Check if user exists in local storage
      const existingUsers = await AsyncStorage.getItem('agrof_users');
      let users = existingUsers ? JSON.parse(existingUsers) : {};
      
      // Look for user by email
      let user = null;
      let userId = null;
      
      for (const [uid, userData] of Object.entries(users)) {
        if (userData.email === email) {
          user = userData;
          userId = uid;
          break;
        }
      }
      
      // If user doesn't exist, create a new one
      if (!user) {
        console.log('👤 AGROF: Creating new user');
        userId = `user_${Date.now()}`;
        user = {
          uid: userId,
          email,
          fullName: email.split('@')[0], // Use email prefix as name
          username: email.split('@')[0],
          phone: '+256700000000',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Save new user
        users[userId] = user;
        await AsyncStorage.setItem('agrof_users', JSON.stringify(users));
        console.log('✅ AGROF: New user created and saved');
      } else {
        console.log('✅ AGROF: Existing user found');
      }
      
      // Set as current user
      this.currentUser = user;
      console.log('✅ AGROF: User signed in successfully');
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ AGROF: Sign in error:', error);
      return { success: false, error: error.message };
    }
  }
}

async function testLogin() {
  const firebaseService = new FirebaseService();
  
  console.log('🧪 Testing login functionality...');
  
  // Test login
  const result = await firebaseService.signInWithEmail('test@agrof.com', 'password123');
  
  if (result.success) {
    console.log('✅ Login test successful!');
    console.log('User:', result.user);
  } else {
    console.log('❌ Login test failed:', result.error);
  }
}

testLogin();


