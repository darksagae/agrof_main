/**
 * Script to list all Firebase Authentication users
 * and update the Cloudinary users index
 */

require('dotenv').config();
const admin = require('firebase-admin');
const cloudinary = require('cloudinary').v2;

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  // Use environment variables or service account
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      // Or use service account key if you have it
    });
  } catch (error) {
    console.log('⚠️ Firebase Admin SDK requires service account credentials');
    console.log('For now, manually listing users...');
  }
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function listAllUsers() {
  try {
    console.log('👥 Fetching all Firebase users...\n');
    
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users;
    
    console.log(`✅ Found ${users.length} registered users:\n`);
    
    const userUIDs = [];
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email || 'No email'}`);
      console.log(`   UID: ${user.uid}`);
      console.log(`   Display Name: ${user.displayName || 'Not set'}`);
      console.log(`   Email Verified: ${user.emailVerified ? '✅' : '❌'}`);
      console.log(`   Created: ${new Date(user.metadata.creationTime).toLocaleDateString()}`);
      console.log('');
      
      userUIDs.push(user.uid);
    });
    
    // Update Cloudinary users index
    console.log('📇 Updating Cloudinary users index...\n');
    
    const usersIndex = {
      users: userUIDs,
      count: userUIDs.length,
      updatedAt: new Date().toISOString()
    };
    
    const result = await cloudinary.uploader.upload(
      `data:application/json;base64,${Buffer.from(JSON.stringify(usersIndex)).toString('base64')}`,
      {
        folder: 'agrof',
        public_id: 'users_index',
        resource_type: 'raw',
        overwrite: true,
        type: 'authenticated'
      }
    );
    
    console.log('✅ Users index updated in Cloudinary!');
    console.log(`📊 Total users: ${usersIndex.count}`);
    console.log(`🔗 URL: ${result.secure_url}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'app/no-app') {
      console.log('\n⚠️ Firebase Admin SDK not initialized');
      console.log('Please provide service account credentials or use Firebase Console');
    }
    
    process.exit(1);
  }
}

listAllUsers();



