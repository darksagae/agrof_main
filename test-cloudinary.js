// Test Cloudinary integration
const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dsr8twjxe',
  api_key: 'your_api_key', // Replace with your actual API key
  api_secret: 'your_api_secret', // Replace with your actual API secret
  secure: true
});

async function testCloudinary() {
  try {
    console.log('☁️ Testing Cloudinary connection...');
    
    // Test connection
    const pingResult = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log('📊 Ping result:', pingResult);
    
    // Test uploading a simple text file (user data simulation)
    console.log('\n📝 Testing file upload...');
    
    const testUserData = {
      uid: 'test_user_123',
      email: 'test@agrof.com',
      username: 'testuser',
      phone: '+256700000000',
      createdAt: new Date().toISOString()
    };
    
    const userDataString = JSON.stringify(testUserData, null, 2);
    
    const uploadResult = await cloudinary.uploader.upload(
      `data:application/json;base64,${Buffer.from(userDataString).toString('base64')}`,
      {
        public_id: 'agrof_test_user_data',
        folder: 'agrof/test',
        resource_type: 'raw',
        tags: ['test', 'agrof', 'userdata']
      }
    );
    
    console.log('✅ File upload successful!');
    console.log('📄 Upload result:', {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
      asset_id: uploadResult.asset_id
    });
    
    // Test retrieving the file
    console.log('\n📖 Testing file retrieval...');
    
    const resourceResult = await cloudinary.api.resource('agrof/test/agrof_test_user_data');
    console.log('✅ File retrieval successful!');
    console.log('📄 Resource result:', {
      public_id: resourceResult.public_id,
      secure_url: resourceResult.secure_url
    });
    
    console.log('\n🎉 Cloudinary integration test completed successfully!');
    console.log('🚀 Your AGROF app can now use Cloudinary for:');
    console.log('   ✅ Profile photo uploads');
    console.log('   ✅ User data storage');
    console.log('   ✅ Cloud-based file management');
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error.message);
    
    if (error.message.includes('Invalid API credentials')) {
      console.log('\n💡 To fix this:');
      console.log('1. Get your API credentials from Cloudinary Dashboard');
      console.log('2. Update the api_key and api_secret in cloudinaryConfig.js');
      console.log('3. Or set environment variables CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET');
    }
  }
}

testCloudinary();

const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dsr8twjxe',
  api_key: 'your_api_key', // Replace with your actual API key
  api_secret: 'your_api_secret', // Replace with your actual API secret
  secure: true
});

async function testCloudinary() {
  try {
    console.log('☁️ Testing Cloudinary connection...');
    
    // Test connection
    const pingResult = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log('📊 Ping result:', pingResult);
    
    // Test uploading a simple text file (user data simulation)
    console.log('\n📝 Testing file upload...');
    
    const testUserData = {
      uid: 'test_user_123',
      email: 'test@agrof.com',
      username: 'testuser',
      phone: '+256700000000',
      createdAt: new Date().toISOString()
    };
    
    const userDataString = JSON.stringify(testUserData, null, 2);
    
    const uploadResult = await cloudinary.uploader.upload(
      `data:application/json;base64,${Buffer.from(userDataString).toString('base64')}`,
      {
        public_id: 'agrof_test_user_data',
        folder: 'agrof/test',
        resource_type: 'raw',
        tags: ['test', 'agrof', 'userdata']
      }
    );
    
    console.log('✅ File upload successful!');
    console.log('📄 Upload result:', {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
      asset_id: uploadResult.asset_id
    });
    
    // Test retrieving the file
    console.log('\n📖 Testing file retrieval...');
    
    const resourceResult = await cloudinary.api.resource('agrof/test/agrof_test_user_data');
    console.log('✅ File retrieval successful!');
    console.log('📄 Resource result:', {
      public_id: resourceResult.public_id,
      secure_url: resourceResult.secure_url
    });
    
    console.log('\n🎉 Cloudinary integration test completed successfully!');
    console.log('🚀 Your AGROF app can now use Cloudinary for:');
    console.log('   ✅ Profile photo uploads');
    console.log('   ✅ User data storage');
    console.log('   ✅ Cloud-based file management');
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error.message);
    
    if (error.message.includes('Invalid API credentials')) {
      console.log('\n💡 To fix this:');
      console.log('1. Get your API credentials from Cloudinary Dashboard');
      console.log('2. Update the api_key and api_secret in cloudinaryConfig.js');
      console.log('3. Or set environment variables CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET');
    }
  }
}

testCloudinary();


