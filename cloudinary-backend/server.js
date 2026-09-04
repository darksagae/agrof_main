require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const PORT = process.env.PORT || 3002;

// Cloudinary Configuration from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dsr8twjxe',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verify Cloudinary configuration
if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('⚠️ WARNING: Cloudinary API credentials not configured!');
  console.error('   Please create a .env file with CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET');
  console.error('   Get credentials from: https://cloudinary.com/console');
} else {
  console.log('✅ Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME);
}

app.use(cors());
app.use(express.json());

// Helper function to update users index
async function updateUsersIndex(uid) {
  try {
    console.log('📇 Updating users index with UID:', uid);
    
    // Fetch existing index
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
      }
    } catch (error) {
      console.log('   📝 Creating new users index');
    }

    // Add UID if not already in index
    if (!usersIndex.users.includes(uid)) {
      usersIndex.users.push(uid);
      usersIndex.updatedAt = new Date().toISOString();
      
      // Save updated index to Cloudinary
      await cloudinary.uploader.upload(
        `data:application/json;base64,${Buffer.from(JSON.stringify(usersIndex)).toString('base64')}`,
        {
          folder: 'agrof',
          public_id: 'users_index',
          resource_type: 'raw',
          overwrite: true,
          type: 'authenticated'
        }
      );
      
      console.log('✅ Users index updated - Total users:', usersIndex.users.length);
    } else {
      console.log('   ✅ User already in index');
    }
  } catch (error) {
    console.error('⚠️ Failed to update users index:', error.message);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cloudinary Backend is running' });
});

// Save user data (JSON) to Cloudinary
app.post('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const userData = req.body;

    console.log('📝 Saving user data for UID:', uid);
    console.log('📞 Phone:', userData.phone);

    // Upload user data as JSON file to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:application/json;base64,${Buffer.from(JSON.stringify(userData)).toString('base64')}`,
      {
        folder: `agrof/users/${uid}`,
        public_id: 'profile',
        resource_type: 'raw',
        overwrite: true,
        type: 'authenticated' // Private upload
      }
    );

    console.log('✅ User data saved to Cloudinary:', result.secure_url);

    // Update users index
    await updateUsersIndex(uid);

    res.json({
      success: true,
      url: result.secure_url,
      message: 'User data saved successfully'
    });
  } catch (error) {
    console.error('❌ Error saving user data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user data from Cloudinary
app.get('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    console.log('📖 Fetching user data for UID:', uid);

    // Use Cloudinary Admin API to get the resource
    const publicId = `agrof/users/${uid}/profile`;
    
    try {
      // Get resource info first
      const resourceInfo = await cloudinary.api.resource(publicId, {
        resource_type: 'raw',
        type: 'authenticated'
      });
      
      // Generate a signed URL to fetch the content
      const signedUrl = cloudinary.url(publicId, {
        resource_type: 'raw',
        type: 'authenticated',
        sign_url: true
      });

      console.log('🔐 Fetching from signed URL');
      
      // Fetch the actual content
      const response = await fetch(signedUrl);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ User data loaded from Cloudinary');
        console.log('📞 Phone:', userData.phone);

        res.json({
          success: true,
          data: userData
        });
      } else {
        throw new Error('Failed to fetch user data content');
      }
    } catch (cloudinaryError) {
      if (cloudinaryError.error && cloudinaryError.error.http_code === 404) {
        throw new Error('User data not found in Cloudinary');
      }
      throw cloudinaryError;
    }
  } catch (error) {
    console.error('❌ Error fetching user data:', error);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// Upload profile photo to Cloudinary
app.post('/api/users/:uid/photo', upload.single('photo'), async (req, res) => {
  try {
    const { uid } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No photo provided'
      });
    }

    console.log('📸 Uploading profile photo for UID:', uid);

    // Convert buffer to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: `agrof/users/${uid}`,
      public_id: `profile_${Date.now()}`,
      resource_type: 'image',
      overwrite: true,
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    console.log('✅ Profile photo uploaded:', result.secure_url);

    res.json({
      success: true,
      url: result.secure_url,
      message: 'Photo uploaded successfully'
    });
  } catch (error) {
    console.error('❌ Error uploading photo:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update user data in Cloudinary
app.patch('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const updates = req.body;

    console.log('🔄 Updating user data for UID:', uid);
    console.log('📝 Updates:', updates);

    // Fetch existing data
    const url = `https://res.cloudinary.com/dsr8twjxe/raw/upload/agrof/users/${uid}/profile.json`;
    const response = await fetch(url);
    
    let existingData = {};
    if (response.ok) {
      existingData = await response.json();
    }

    // Merge with updates
    const updatedData = {
      ...existingData,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Upload updated data
    const result = await cloudinary.uploader.upload(
      `data:application/json;base64,${Buffer.from(JSON.stringify(updatedData)).toString('base64')}`,
      {
        folder: `agrof/users/${uid}`,
        public_id: 'profile',
        resource_type: 'raw',
        overwrite: true,
        type: 'authenticated'
      }
    );

    console.log('✅ User data updated in Cloudinary');

    res.json({
      success: true,
      url: result.secure_url,
      data: updatedData,
      message: 'User data updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating user data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// List all users (for marketplace/trading features)
// NOTE: Uses a users index file since Cloudinary Admin API listing requires paid plan
app.get('/api/users', async (req, res) => {
  try {
    console.log('👥 Fetching all users from Cloudinary index');

    // Fetch the users index file (contains list of all user UIDs)
    const indexPath = 'agrof/users_index';
    const signedIndexUrl = cloudinary.url(indexPath, {
      resource_type: 'raw',
      type: 'authenticated',
      sign_url: true
    });

    console.log('📖 Fetching users index from:', indexPath);
    
    let userUIDs = [];
    try {
      const indexResponse = await fetch(signedIndexUrl);
      if (indexResponse.ok) {
        const indexData = await indexResponse.json();
        userUIDs = indexData.users || [];
        console.log('📊 Users index contains:', userUIDs.length, 'user IDs');
      } else {
        console.log('⚠️ No users index found, returning empty list');
        console.log('   (Users index will be created automatically as users sign up)');
      }
    } catch (error) {
      console.log('⚠️ Users index not found:', error.message);
    }

    // Fetch each user's full profile data
    const users = [];
    for (const uid of userUIDs) {
      try {
        const userPath = `agrof/users/${uid}/profile`;
        const signedUrl = cloudinary.url(userPath, {
          resource_type: 'raw',
          type: 'authenticated',
          sign_url: true
        });

        const userResponse = await fetch(signedUrl);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          users.push(userData);
          console.log('   ✅ Loaded:', userData.fullName || userData.email);
        }
      } catch (error) {
        console.log('   ⚠️ Skipped user', uid, ':', error.message);
      }
    }

    console.log('✅ Successfully loaded', users.length, 'user profiles');

    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('❌ Error listing users:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      users: []
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Cloudinary Backend running on port ${PORT}`);
  console.log(`📡 Endpoint: http://0.0.0.0:${PORT}`);
  console.log('✅ Ready to store user data in Cloudinary!');
});


