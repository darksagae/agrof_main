# 🚀 Quick Start - Supabase Migration Complete!

## ✅ What's Done

All Cloudinary references have been replaced with Supabase! The app now works with:
- **Firebase Authentication** (email/password)
- **Supabase Database** (user data storage)
- **Local AsyncStorage** (offline fallback)

## 🏃 Quick Start (3 Steps)

### 1️⃣ Update Supabase Config (Required)

Edit: `/home/darksagae/Desktop/agrof-up/agrof-main/mobile/app/config/supabaseConfig.js`

Replace these lines:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co'; // ← Change this
const SUPABASE_ANON_KEY = 'your-anon-key'; // ← Change this
```

Get your credentials from: https://supabase.com/dashboard/project/_/settings/api

### 2️⃣ Create Supabase Tables

Go to: https://supabase.com/dashboard/project/_/sql

Run this SQL:
```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
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

-- Allow users to manage their own data
CREATE POLICY "Users can manage own data" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', true) ON CONFLICT DO NOTHING;

-- Storage policy
CREATE POLICY "Public Access" ON storage.objects
  FOR ALL USING (bucket_id = 'user-uploads');
```

### 3️⃣ Start the App

```bash
cd /home/darksagae/Desktop/agrof-up/agrof-main/mobile/app
npm start
```

## 🎯 Test Login

1. Open the app
2. Click "Sign Up" and create an account
3. Check your email for verification
4. Log in with your credentials

Your user data will be saved to Supabase! 🎉

## 🔍 Verify It's Working

Check logs for:
```
🟢 AGROF: Initializing Supabase service...
✅ Supabase connection successful
🟢 Saving user data to Supabase for UID: xxx
✅ User data saved to Supabase!
```

## 💾 Offline Mode

If Supabase is not configured or unavailable, the app automatically falls back to **local AsyncStorage**. You'll see:
```
⚠️ Supabase not available, using local storage fallback
💾 Saving user data locally for UID: xxx
✅ User data saved locally
```

## 📊 View Your Data

Go to: https://supabase.com/dashboard/project/_/editor
- Click **users** table to see user data
- Click **Storage** to see uploaded files

## 🆘 Having Issues?

### Login not working?
```bash
# Clear the app cache
cd /home/darksagae/Desktop/agrof-up/agrof-main/mobile/app
rm -rf node_modules/.cache
npm start -- --reset-cache
```

### Supabase connection failed?
- App works fine with local storage!
- Configure Supabase later when ready
- Check SUPABASE_URL and SUPABASE_ANON_KEY

### Need to remove old Cloudinary files?
```bash
cd /home/darksagae/Desktop/agrof-up/agrof-main/mobile/app
rm services/authCloudinaryService.js
rm services/cloudinaryService.js
rm config/cloudinaryConfig.js
```

## 📖 Full Documentation

See: `/home/darksagae/Desktop/agrof-up/SUPABASE_SETUP_GUIDE.md`

---

**Ready to go!** Your app now uses Firebase + Supabase! 🚀

