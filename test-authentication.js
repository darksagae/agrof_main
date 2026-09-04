// Test authentication functionality
const AsyncStorage = require('@react-native-async-storage/async-storage');

class FirebaseService {
  constructor() {
    this.currentUser = null;
  }

  async initialize() {
    console.log('🔥 AGROF: Initializing local storage service...');
    return true;
  }

  async healthCheck() {
    console.log('🔥 AGROF: Health check');
    return { connected: true, initialized: true };
  }

  async getCurrentUser() {
    try {
      console.log('🔥 AGROF: Getting current user');
      
      if (this.currentUser) {
        console.log('✅ AGROF: Current user found:', this.currentUser.email);
        return { 
          success: true, 
          user: this.currentUser,
          isVerified: this.currentUser.emailVerified || true
        };
      }
      
      // Try to get the most recent user from storage
      const existingUsers = await AsyncStorage.getItem('agrof_users');
      if (existingUsers) {
        const users = JSON.parse(existingUsers);
        const userIds = Object.keys(users);
        if (userIds.length > 0) {
          const latestUserId = userIds[userIds.length - 1];
          const user = users[latestUserId];
          this.currentUser = user;
          console.log('✅ AGROF: Loaded user from storage:', user.email);
          return { 
            success: true, 
            user: user,
            isVerified: user.emailVerified || true
          };
        }
      }
      
      console.log('⚠️ AGROF: No current user found');
      return { success: false, user: null };
    } catch (error) {
      console.error('❌ AGROF: Error getting current user:', error);
      return { success: false, error: error.message };
    }
  }

  async signInWithEmail(email, password) {
    try {
      console.log('🔥 AGROF: Sign in with local storage');
      console.log('📧 Email:', email);
      
      const existingUsers = await AsyncStorage.getItem('agrof_users');
      let users = existingUsers ? JSON.parse(existingUsers) : {};
      
      let user = null;
      let userId = null;
      
      for (const [uid, userData] of Object.entries(users)) {
        if (userData.email === email) {
          user = userData;
          userId = uid;
          break;
        }
      }
      
      if (!user) {
        console.log('👤 AGROF: Creating new user');
        userId = `user_${Date.now()}`;
        user = {
          uid: userId,
          email,
          fullName: email.split('@')[0],
          username: email.split('@')[0],
          phone: '+256700000000',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        users[userId] = user;
        await AsyncStorage.setItem('agrof_users', JSON.stringify(users));
        console.log('✅ AGROF: New user created and saved');
      } else {
        console.log('✅ AGROF: Existing user found');
      }
      
      this.currentUser = user;
      console.log('✅ AGROF: User signed in successfully');
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ AGROF: Sign in error:', error);
      return { success: false, error: error.message };
    }
  }
}

async function testAuthentication() {
  const firebaseService = new FirebaseService();
  
  console.log('🧪 Testing authentication system...');
  
  // Test initialization
  const initialized = await firebaseService.initialize();
  console.log('Initialization:', initialized);
  
  // Test health check
  const healthCheck = await firebaseService.healthCheck();
  console.log('Health check:', healthCheck);
  
  // Test login
  const loginResult = await firebaseService.signInWithEmail('test@agrof.com', 'password123');
  console.log('Login result:', loginResult.success ? 'SUCCESS' : 'FAILED');
  
  // Test get current user
  const currentUser = await firebaseService.getCurrentUser();
  console.log('Current user:', currentUser.success ? 'FOUND' : 'NOT FOUND');
  
  if (currentUser.success) {
    console.log('User details:', currentUser.user.email);
  }
}

testAuthentication();

const AsyncStorage = require('@react-native-async-storage/async-storage');

class FirebaseService {
  constructor() {
    this.currentUser = null;
  }

  async initialize() {
    console.log('🔥 AGROF: Initializing local storage service...');
    return true;
  }

  async healthCheck() {
    console.log('🔥 AGROF: Health check');
    return { connected: true, initialized: true };
  }

  async getCurrentUser() {
    try {
      console.log('🔥 AGROF: Getting current user');
      
      if (this.currentUser) {
        console.log('✅ AGROF: Current user found:', this.currentUser.email);
        return { 
          success: true, 
          user: this.currentUser,
          isVerified: this.currentUser.emailVerified || true
        };
      }
      
      // Try to get the most recent user from storage
      const existingUsers = await AsyncStorage.getItem('agrof_users');
      if (existingUsers) {
        const users = JSON.parse(existingUsers);
        const userIds = Object.keys(users);
        if (userIds.length > 0) {
          const latestUserId = userIds[userIds.length - 1];
          const user = users[latestUserId];
          this.currentUser = user;
          console.log('✅ AGROF: Loaded user from storage:', user.email);
          return { 
            success: true, 
            user: user,
            isVerified: user.emailVerified || true
          };
        }
      }
      
      console.log('⚠️ AGROF: No current user found');
      return { success: false, user: null };
    } catch (error) {
      console.error('❌ AGROF: Error getting current user:', error);
      return { success: false, error: error.message };
    }
  }

  async signInWithEmail(email, password) {
    try {
      console.log('🔥 AGROF: Sign in with local storage');
      console.log('📧 Email:', email);
      
      const existingUsers = await AsyncStorage.getItem('agrof_users');
      let users = existingUsers ? JSON.parse(existingUsers) : {};
      
      let user = null;
      let userId = null;
      
      for (const [uid, userData] of Object.entries(users)) {
        if (userData.email === email) {
          user = userData;
          userId = uid;
          break;
        }
      }
      
      if (!user) {
        console.log('👤 AGROF: Creating new user');
        userId = `user_${Date.now()}`;
        user = {
          uid: userId,
          email,
          fullName: email.split('@')[0],
          username: email.split('@')[0],
          phone: '+256700000000',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        users[userId] = user;
        await AsyncStorage.setItem('agrof_users', JSON.stringify(users));
        console.log('✅ AGROF: New user created and saved');
      } else {
        console.log('✅ AGROF: Existing user found');
      }
      
      this.currentUser = user;
      console.log('✅ AGROF: User signed in successfully');
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ AGROF: Sign in error:', error);
      return { success: false, error: error.message };
    }
  }
}

async function testAuthentication() {
  const firebaseService = new FirebaseService();
  
  console.log('🧪 Testing authentication system...');
  
  // Test initialization
  const initialized = await firebaseService.initialize();
  console.log('Initialization:', initialized);
  
  // Test health check
  const healthCheck = await firebaseService.healthCheck();
  console.log('Health check:', healthCheck);
  
  // Test login
  const loginResult = await firebaseService.signInWithEmail('test@agrof.com', 'password123');
  console.log('Login result:', loginResult.success ? 'SUCCESS' : 'FAILED');
  
  // Test get current user
  const currentUser = await firebaseService.getCurrentUser();
  console.log('Current user:', currentUser.success ? 'FOUND' : 'NOT FOUND');
  
  if (currentUser.success) {
    console.log('User details:', currentUser.user.email);
  }
}

testAuthentication();


