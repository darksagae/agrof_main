import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import cloudinaryService from './cloudinaryService';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthCloudinaryService {
  constructor() {
    this.isInitialized = false;
    this.currentUser = null;
    this.authStateListener = null;
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes session timeout
    this.lastActiveTime = null;
  }
  
  // Check if session has expired
  async isSessionValid() {
    try {
      const lastActive = await AsyncStorage.getItem('agrof_last_active');
      if (!lastActive) return false;
      
      const now = Date.now();
      const timeSinceActive = now - parseInt(lastActive);
      
      console.log('⏰ Session check:', {
        lastActive: new Date(parseInt(lastActive)).toLocaleString(),
        timeSinceActive: Math.round(timeSinceActive / 1000 / 60), // minutes
        sessionTimeout: this.sessionTimeout / 1000 / 60 // minutes
      });
      
      // If more than session timeout, session expired
      if (timeSinceActive > this.sessionTimeout) {
        console.log('⚠️ Session expired - requiring sign in');
        return false;
      }
      
      console.log('✅ Session still valid');
      return true;
    } catch (error) {
      console.error('❌ Error checking session:', error);
      return false;
    }
  }
  
  // Update last active time
  async updateLastActive() {
    try {
      await AsyncStorage.setItem('agrof_last_active', Date.now().toString());
      this.lastActiveTime = Date.now();
    } catch (error) {
      console.error('❌ Error updating last active:', error);
    }
  }
  
  // Clear session
  async clearSession() {
    try {
      await AsyncStorage.removeItem('agrof_last_active');
      this.lastActiveTime = null;
    } catch (error) {
      console.error('❌ Error clearing session:', error);
    }
  }

  // Initialize the hybrid service
  async initialize() {
    try {
      console.log('🔥☁️ AGROF: Initializing Firebase Auth + Cloudinary service...');
      
      // Initialize Cloudinary first
      const cloudinarySuccess = await cloudinaryService.initialize();
      if (!cloudinarySuccess) {
        console.log('⚠️ Cloudinary initialization failed, continuing with Firebase Auth only');
      }
      
      // Wait for Firebase Auth to determine auth state
      console.log('🔥 Waiting for Firebase Auth state...');
      await new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          console.log('🔥 Firebase Auth state determined:', user ? user.uid : 'No user');
          
          if (user) {
            // Reload user to get latest emailVerified status from Firebase
            await user.reload();
            console.log('🔄 User reloaded - Email verified:', user.emailVerified);
            
            // Check if session is still valid (30 min timeout)
            const sessionValid = await this.isSessionValid();
            
            if (!sessionValid) {
              console.log('⏰ Session expired - signing out');
              await signOut(auth);
              this.currentUser = null;
              await this.clearSession();
            } else {
              this.currentUser = user;
              
              console.log('👤 User signed in:', {
                uid: user.uid,
                email: user.email,
                phoneNumber: user.phoneNumber,
                emailVerified: user.emailVerified
              });
              
              // Update last active time
              await this.updateLastActive();
              
              // Load user data from storage
              console.log('📥 Loading user profile data...');
              await this.loadUserDataFromCloudinary(user.uid);
            }
          } else {
            console.log('👤 No user signed in');
            this.currentUser = null;
          }
          
          // Set up persistent listener for future auth changes
          this.authStateListener = onAuthStateChanged(auth, async (updatedUser) => {
            console.log('🔥 Firebase Auth state changed:', updatedUser ? updatedUser.uid : 'No user');
            this.currentUser = updatedUser;
            
            if (updatedUser) {
              await this.loadUserDataFromCloudinary(updatedUser.uid);
            }
          });
          
          unsubscribe(); // Unsubscribe from the initial check
          resolve();
        });
      });
      
      this.isInitialized = true;
      console.log('✅ AGROF: Firebase Auth + Cloudinary service initialized');
      return true;
    } catch (error) {
      console.error('❌ AGROF: Service initialization failed:', error);
      return false;
    }
  }

  // Sign up with email and password
  async signUpWithEmail(email, password, userData = {}) {
    try {
      console.log('🔥 AGROF: Signing up with Firebase Auth');
      console.log('📧 Email:', email);
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Send email verification
      await sendEmailVerification(user);
      console.log('✅ Email verification sent');
      
      // Update Firebase Auth profile with full name
      await updateProfile(user, {
        displayName: userData.fullName || userData.username || email.split('@')[0],
        photoURL: null // Will be updated when user uploads profile photo
      });
      
      console.log('📝 Saving contact information:', {
        email: user.email,
        fullName: userData.fullName,
        phone: userData.phone
      });
      
      // Prepare complete user data
      const completeUserData = {
        uid: user.uid,
        email: user.email,                          // ✅ Email (from Firebase Auth)
        fullName: userData.fullName || email.split('@')[0],  // ✅ Full Name (from signup form)
        username: userData.username || userData.fullName || email.split('@')[0],  // ✅ Username (editable)
        phone: userData.phone || '',                // ✅ Phone Number (from signup form)
        emailVerified: user.emailVerified,
        profilePhoto: null,
        agrofBalance: 0,                           // ✅ AGROF balance starts at 0
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        firebaseAuth: true,                        // Flag to indicate this user came from Firebase Auth
        // Contact information for future use
        contactInfo: {
          email: user.email,
          phone: userData.phone || '',
          fullName: userData.fullName || email.split('@')[0]
        }
      };
      
      // Save to Cloudinary/AsyncStorage
      console.log('☁️ Saving user data to storage...');
      console.log('📝 Data to save:', {
        uid: user.uid,
        email: completeUserData.email,
        fullName: completeUserData.fullName,
        phone: completeUserData.phone,
        contactPhone: completeUserData.contactInfo.phone
      });
      
      const saveResult = await cloudinaryService.saveUserData(user.uid, completeUserData);
      
      if (saveResult.success) {
        console.log('✅ User data (including phone) saved successfully!');
        console.log('   Phone saved:', completeUserData.phone);
      } else {
        console.error('❌ Failed to save user data:', saveResult.error);
      }
      
      // Sign out user until email is verified
      console.log('🔒 Signing out user until email verification');
      await signOut(auth);
      
      console.log('✅ AGROF: Signup complete - user must verify email before logging in');
      return { 
        success: true, 
        user: completeUserData,
        needsEmailVerification: true
      };
    } catch (error) {
      console.error('❌ AGROF: Sign up error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign in with email and password
  async signInWithEmail(email, password) {
    try {
      console.log('🔥 AGROF: Signing in with Firebase Auth');
      console.log('📧 Email:', email);
      
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      let user = userCredential.user;
      
      console.log('✅ Firebase Auth sign in successful');
      
      // Reload user to get latest emailVerified status
      await user.reload();
      console.log('🔄 User data reloaded from Firebase');
      console.log('📧 Email verified status:', user.emailVerified);
      
      // Check if email is verified
      if (!user.emailVerified) {
        console.log('❌ Email not verified');
        // Keep user signed in temporarily so they can resend verification email
        // They will be signed out when they click resend or cancel
        return { 
          success: false, 
          error: '📧 Email Not Verified\n\nPlease check your email and click the verification link before logging in.\n\nCheck your spam folder if you don\'t see it!',
          needsVerification: true,
          userEmail: user.email
        };
      }
      
      console.log('✅ Email verified - proceeding with login');
      
      // Load user data from Cloudinary/local storage
      console.log('☁️ Loading user data from Cloudinary...');
      const userDataResult = await cloudinaryService.getUserData(user.uid);
      
      let userData;
      if (userDataResult.success) {
        userData = userDataResult.data;
        console.log('✅ User data loaded (including phone number)');
        console.log('📞 Phone from storage:', userData.phone);
      } else {
        // Create basic user data if not found
        console.log('⚠️ User data not found, creating basic profile');
        userData = {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName || email.split('@')[0],
          username: user.displayName || email.split('@')[0],
          phone: '',
          emailVerified: user.emailVerified,
          profilePhoto: null,
          agrofBalance: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          firebaseAuth: true,
          contactInfo: {
            email: user.email,
            phone: '',
            fullName: user.displayName || email.split('@')[0]
          }
        };
        
        // Save basic user data to Cloudinary
        await cloudinaryService.saveUserData(user.uid, userData);
        console.log('✅ Basic profile saved to Cloudinary');
      }
      
      // Update last active time (session tracking)
      await this.updateLastActive();
      
      console.log('✅ AGROF: User signed in successfully');
      console.log('⏰ Session will expire in 30 minutes of inactivity');
      return { 
        success: true, 
        user: userData,
        firebaseUser: user
      };
    } catch (error) {
      console.error('❌ AGROF: Sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  // Resend verification email
  async resendVerificationEmail(email, password = null) {
    try {
      console.log('📧 Resending verification email to:', email);
      
      let user = auth.currentUser;
      let wasSignedIn = !!user;
      
      // If no current user, we can't resend without password
      // The user will need to try logging in again
      if (!user) {
        console.log('⚠️ No current user - cannot resend verification email');
        console.log('💡 User should try logging in again to trigger resend');
        return { 
          success: false, 
          error: 'Session expired. Please try logging in again to resend the verification email.' 
        };
      }
      
      if (user.emailVerified) {
        return { 
          success: false, 
          error: 'Email is already verified! You can now log in.' 
        };
      }
      
      // Send verification email
      await sendEmailVerification(user);
      console.log('✅ Verification email sent');
      
      // Sign out if we weren't already signed in
      if (!wasSignedIn) {
        await signOut(auth);
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error resending verification email:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign out
  async signOut() {
    try {
      console.log('🔥 AGROF: Signing out from Firebase Auth');
      await signOut(auth);
      this.currentUser = null;
      
      // Clear all cached user data from AsyncStorage
      console.log('🧹 Clearing cached user data...');
      await AsyncStorage.removeItem('agrof_users');
      await AsyncStorage.removeItem('firebase_auth_token');
      await AsyncStorage.removeItem('firebase_uid');
      
      console.log('✅ AGROF: User signed out successfully and cache cleared');
      return { success: true };
    } catch (error) {
      console.error('❌ AGROF: Sign out error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Force clear all auth data (for debugging/troubleshooting)
  async clearAllAuthData() {
    try {
      console.log('🧹 Force clearing all authentication data...');
      
      // Sign out from Firebase
      await signOut(auth);
      this.currentUser = null;
      
      // Clear AsyncStorage
      await AsyncStorage.removeItem('agrof_users');
      await AsyncStorage.removeItem('firebase_auth_token');
      await AsyncStorage.removeItem('firebase_uid');
      await AsyncStorage.clear(); // Clear everything for good measure
      
      console.log('✅ All auth data cleared - app reset to fresh state');
      return { success: true };
    } catch (error) {
      console.error('❌ Error clearing auth data:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      console.log('🔥☁️ AGROF: Getting current user');
      
      if (this.currentUser) {
        console.log('✅ Current Firebase user found:', this.currentUser.uid);
        
        // Reload user to get latest emailVerified status
        await this.currentUser.reload();
        console.log('🔄 User reloaded - Email verified:', this.currentUser.emailVerified);
        
        // Get user data from Cloudinary (or local cache)
        const userDataResult = await cloudinaryService.getUserData(this.currentUser.uid);
        if (userDataResult.success) {
          console.log('✅ User profile loaded from storage');
          return { 
            success: true, 
            user: {
              ...userDataResult.data,
              uid: this.currentUser.uid,
              email: this.currentUser.email,
              emailVerified: this.currentUser.emailVerified,
              phoneNumber: this.currentUser.phoneNumber || userDataResult.data.phone
            },
            firebaseUser: this.currentUser,
            isVerified: this.currentUser.emailVerified
          };
        } else {
          // Create basic user object from Firebase Auth data
          console.log('⚠️ No stored profile found, creating from Firebase Auth data');
          const basicUser = {
            uid: this.currentUser.uid,
            email: this.currentUser.email,
            fullName: this.currentUser.displayName || this.currentUser.email.split('@')[0],
            username: this.currentUser.displayName || this.currentUser.email.split('@')[0],
            phone: this.currentUser.phoneNumber || '',
            emailVerified: this.currentUser.emailVerified,
            profilePhoto: this.currentUser.photoURL || null,
            firebaseAuth: true
          };
          
          // Save this basic profile to Cloudinary
          await cloudinaryService.saveUserData(this.currentUser.uid, basicUser);
          
          return { 
            success: true, 
            user: basicUser,
            firebaseUser: this.currentUser,
            isVerified: this.currentUser.emailVerified
          };
        }
      }
      
      console.log('⚠️ No current user found in Firebase Auth');
      return { success: false, user: null };
    } catch (error) {
      console.error('❌ AGROF: Error getting current user:', error);
      return { success: false, error: error.message };
    }
  }

  // Load user data from Cloudinary
  async loadUserDataFromCloudinary(uid) {
    try {
      console.log('☁️ Loading user data from Cloudinary for UID:', uid);
      const result = await cloudinaryService.getUserData(uid);
      
      if (result.success) {
        console.log('✅ User data loaded from Cloudinary:', result.data.username);
        return result.data;
      } else {
        console.log('⚠️ No user data found in Cloudinary for UID:', uid);
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading user data from Cloudinary:', error);
      return null;
    }
  }

  // Update user data (saves to Cloudinary)
  async updateUserData(uid, data) {
    try {
      console.log('🔥☁️ AGROF: Updating user data');
      console.log('👤 UID:', uid);
      console.log('📝 Data:', data);
      
      // Update data in Cloudinary
      const result = await cloudinaryService.updateUserData(uid, data);
      
      if (result.success) {
        console.log('✅ User data updated in Cloudinary');
        return { success: true, message: 'Profile updated successfully!' };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ AGROF: Error updating user data:', error);
      return { success: false, error: error.message };
    }
  }

  // Upload profile photo (saves to Cloudinary)
  async uploadProfilePhoto(uid, imageUri) {
    try {
      console.log('📸 AGROF: Uploading profile photo');
      console.log('👤 UID:', uid);
      
      // Upload photo to Cloudinary
      const result = await cloudinaryService.uploadProfilePhoto(uid, imageUri);
      
      if (result.success) {
        console.log('✅ Profile photo uploaded to Cloudinary');
        return { success: true, url: result.url };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ AGROF: Error uploading profile photo:', error);
      return { success: false, error: error.message };
    }
  }

  // Health check
  async healthCheck() {
    try {
      console.log('🔥☁️ AGROF: Health check');
      
      const cloudinaryHealth = await cloudinaryService.healthCheck();
      
      return { 
        connected: true, 
        initialized: this.isInitialized,
        firebaseAuth: !!this.currentUser,
        cloudinaryAvailable: cloudinaryHealth.cloudinaryAvailable,
        storageType: cloudinaryHealth.storageType,
        currentUser: this.currentUser ? this.currentUser.uid : null
      };
    } catch (error) {
      console.error('❌ AGROF: Health check error:', error);
      return { 
        connected: false, 
        initialized: false,
        firebaseAuth: false,
        cloudinaryAvailable: false,
        storageType: 'None',
        error: error.message
      };
    }
  }

  // Cleanup
  destroy() {
    if (this.authStateListener) {
      this.authStateListener();
    }
  }

  // Expose Firebase onAuthStateChanged listener for UserContext
  onAuthStateChanged(callback) {
    console.log('👂 AGROF: Setting up auth state listener');
    return onAuthStateChanged(auth, callback);
  }
}

export default new AuthCloudinaryService();
