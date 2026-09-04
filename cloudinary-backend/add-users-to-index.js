/**
 * Manually add users to Cloudinary users index
 * Usage: node add-users-to-index.js UID1 UID2 UID3 ...
 */

require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function addUsersToIndex() {
  try {
    // Get UIDs from command line arguments
    const newUIDs = process.argv.slice(2);
    
    if (newUIDs.length === 0) {
      console.log('❌ No UIDs provided!');
      console.log('');
      console.log('Usage: node add-users-to-index.js UID1 UID2 UID3 ...');
      console.log('');
      console.log('Example:');
      console.log('  node add-users-to-index.js QBTloeeYLkTEYjbI05QDWuN7pBm1 ABC123xyz456 DEF789uvw012');
      process.exit(1);
    }
    
    console.log(`📝 Adding ${newUIDs.length} user(s) to index...\n`);
    
    // Fetch existing index
    console.log('📖 Fetching current index...');
    const indexPath = 'agrof/users_index';
    const signedUrl = cloudinary.url(indexPath, {
      resource_type: 'raw',
      type: 'authenticated',
      sign_url: true
    });
    
    let usersIndex = { users: [] };
    try {
      const response = await fetch(signedUrl);
      if (response.ok) {
        usersIndex = await response.json();
        console.log(`✅ Current index has ${usersIndex.users.length} users\n`);
      }
    } catch (error) {
      console.log('   Creating new index\n');
    }
    
    // Add new UIDs (avoid duplicates)
    let addedCount = 0;
    newUIDs.forEach(uid => {
      if (!usersIndex.users.includes(uid)) {
        usersIndex.users.push(uid);
        console.log(`   ✅ Added: ${uid}`);
        addedCount++;
      } else {
        console.log(`   ⚠️ Already in index: ${uid}`);
      }
    });
    
    console.log('');
    
    if (addedCount === 0) {
      console.log('⚠️ No new users added (all already in index)');
      process.exit(0);
    }
    
    // Update metadata
    usersIndex.count = usersIndex.users.length;
    usersIndex.updatedAt = new Date().toISOString();
    
    // Save to Cloudinary
    console.log('💾 Saving updated index to Cloudinary...');
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
    
    console.log('✅ Users index updated!');
    console.log(`📊 Total users now: ${usersIndex.count}`);
    console.log(`➕ New users added: ${addedCount}`);
    console.log(`🔗 URL: ${result.secure_url}\n`);
    
    // List all users
    console.log('📋 Complete user list:');
    usersIndex.users.forEach((uid, index) => {
      console.log(`   ${index + 1}. ${uid}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addUsersToIndex();



