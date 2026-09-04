# 🟢 Supabase Setup Guide for AGROF

## ✅ Migration Complete!

Cloudinary has been successfully replaced with Supabase. The app now uses:
- **Firebase** for authentication
- **Supabase** for user data storage (with local AsyncStorage fallback)

## 📋 What Changed

### Files Created:
1. `config/supabaseConfig.js` - Supabase client configuration
2. `services/supabaseService.js` - Supabase data operations
3. `services/authService.js` - Unified auth service (Firebase + Supabase)

### Files Updated:
- ✅ `screens/LoginScreen.js` - Uses new authService
- ✅ `screens/SignupScreen.js` - Uses new authService
- ✅ `screens/DiseaseDetectionScreen.js` - Uses new authService
- ✅ `contexts/UserContext.js` - Uses new authService
- ✅ `components/AuthGate.js` - Uses new authService
- ✅ `App.js` - Uses new authService
- ✅ `package.json` - Added @supabase/supabase-js dependency

### Files Deprecated (can be removed):
- ❌ `services/authCloudinaryService.js` (replaced by authService.js)
- ❌ `services/cloudinaryService.js` (replaced by supabaseService.js)
- ❌ `config/cloudinaryConfig.js` (no longer needed)

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
cd /home/darksagae/Desktop/agrof-up/agrof-main/mobile/app
npm install @supabase/supabase-js
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: agrof-app
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to your users
5. Wait for project to be created (~2 minutes)

### Step 3: Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 4: Configure Supabase in Your App

Update `/home/darksagae/Desktop/agrof-up/agrof-main/mobile/app/config/supabaseConfig.js`:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

Or use environment variables (recommended for production):

```bash
export SUPABASE_URL='https://your-project-id.supabase.co'
export SUPABASE_ANON_KEY='your-anon-key-here'
```

### Step 5: Create Database Tables

In your Supabase dashboard, go to **SQL Editor** and run this:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  username TEXT,
  phone TEXT,
  profile_photo TEXT,
  agrof_balance DECIMAL(10,2) DEFAULT 0,
  email_verified BOOLEAN DEFAULT false,
  firebase_auth BOOLEAN DEFAULT true,
  contact_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies (users can read/update their own data)
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create storage bucket for user uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', true);

-- Storage policies
CREATE POLICY "Users can upload their own files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view uploaded files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-uploads');

CREATE POLICY "Users can update their own files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Step 6: Test the Setup

1. Start your app:
```bash
cd /home/darksagae/Desktop/agrof-up/agrof-main/mobile/app
npm start
```

2. Try to:
   - Sign up a new user
   - Log in
   - Update profile
   - Upload profile photo

3. Check Supabase Dashboard:
   - Go to **Table Editor** → **users** to see user data
   - Go to **Storage** → **user-uploads** to see uploaded files

## 🔄 How It Works

### Authentication Flow:
1. **Firebase Auth** handles email/password authentication
2. When user signs up/logs in, data is saved to **Supabase** database
3. If Supabase is unavailable, falls back to **AsyncStorage** (local storage)

### Data Storage:
- **Primary**: Supabase PostgreSQL database (cloud)
- **Fallback**: AsyncStorage (local device storage)
- **Profile Photos**: Supabase Storage (cloud) or local URI

### Correlation:
- Firebase Auth UID = Supabase users.id
- User data synced between Firebase Auth and Supabase
- App works offline with AsyncStorage fallback

## 📊 Supabase Features Used

- ✅ **PostgreSQL Database** - User data storage
- ✅ **Storage** - Profile photos and uploads
- ✅ **Row Level Security (RLS)** - Data privacy
- ✅ **Real-time** - Ready for future features
- ✅ **Auto-generated APIs** - REST and GraphQL

## 🎯 Future Enhancements

You can now easily add:
- Real-time chat/messaging
- Product inventory management
- Order history
- Shopping cart sync across devices
- Analytics and reporting

## 🐛 Troubleshooting

### "Supabase not connected"
- Check your SUPABASE_URL and SUPABASE_ANON_KEY in `config/supabaseConfig.js`
- Verify your internet connection
- App will work with local storage fallback

### "Cannot insert into users table"
- Make sure you ran the SQL schema creation script
- Check Row Level Security policies are created
- Verify the user is authenticated with Firebase

### Profile photo not uploading
- Check the `user-uploads` bucket exists in Supabase Storage
- Make sure storage policies are created
- Verify bucket is set to public

## 📝 Environment Variables (Production)

For production, use environment variables:

```env
# .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## 🔐 Security Notes

- ✅ Firebase handles authentication (email/password)
- ✅ Supabase RLS ensures users can only access their own data
- ✅ ANON_KEY is safe to expose (designed for client-side use)
- ✅ Service Role Key should NEVER be in client code

## 📞 Support

If you encounter issues:
1. Check Supabase Dashboard logs
2. Check app console logs (look for 🟢 emoji logs)
3. Verify all SQL scripts ran successfully
4. Test with a new user signup

## 🎉 You're Ready!

Your app is now using:
- 🔥 Firebase for authentication
- 🟢 Supabase for data storage
- 💾 AsyncStorage for offline fallback

Login should now work without Cloudinary! 🚀

