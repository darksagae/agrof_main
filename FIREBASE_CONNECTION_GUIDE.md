# 🔥 Firebase Connection Guide

## Prerequisites
- Google Account (Gmail or Google Workspace)
- Internet connection
- Node.js and npm installed ✅

## Step 1: Firebase Account Setup

### Option A: Create New Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter project name: `agrof-ai-app`
4. Enable Google Analytics (optional)
5. Click "Create project"

### Option B: Use Existing Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your existing project
3. Note the project ID

## Step 2: Enable Firebase Hosting

1. In Firebase Console, go to your project
2. Click "Hosting" in the left sidebar
3. Click "Get started"
4. Follow the setup wizard

## Step 3: Firebase CLI Authentication

### Method 1: Interactive Login (Recommended)
```bash
npx firebase-tools@latest login
```
- This will open your browser
- Sign in with your Google account
- Grant permissions to Firebase CLI

### Method 2: Non-Interactive Login (Alternative)
```bash
npx firebase-tools@latest login --no-localhost
```
- Copy the authorization URL
- Open in browser and sign in
- Copy the authorization code back to terminal

## Step 4: Connect to Your Project

```bash
# List available projects
npx firebase-tools@latest projects:list

# Use your project
npx firebase-tools@latest use agrof-ai-app

# Or use project ID if different
npx firebase-tools@latest use YOUR_PROJECT_ID
```

## Step 5: Initialize Firebase (if needed)

```bash
# Initialize Firebase hosting
npx firebase-tools@latest init hosting

# Select your project
# Set public directory: agrof-main/mobile/app/dist
# Configure as single-page app: Yes
# Set up automatic builds: No
```

## Step 6: Deploy Your App

```bash
# Build the app first
cd agrof-main/mobile/app
npm install
npm run build:web

# Deploy to Firebase
cd ../../..
npx firebase-tools@latest deploy --only hosting
```

## Troubleshooting

### Authentication Issues
```bash
# Check login status
npx firebase-tools@latest login:list

# Re-authenticate if needed
npx firebase-tools@latest logout
npx firebase-tools@latest login
```

### Project Issues
```bash
# List projects
npx firebase-tools@latest projects:list

# Switch projects
npx firebase-tools@latest use PROJECT_ID

# Check current project
npx firebase-tools@latest projects:list --filter="current"
```

### Build Issues
```bash
# Install dependencies
cd agrof-main/mobile/app
npm install

# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build:web
```

## Expected Results

After successful deployment:
- **URL**: `https://agrof-ai-app.web.app`
- **Features**: Full AGROF AI functionality
- **Performance**: Optimized with caching

## Quick Commands Summary

```bash
# 1. Login to Firebase
npx firebase-tools@latest login

# 2. Use your project
npx firebase-tools@latest use agrof-ai-app

# 3. Build the app
cd agrof-main/mobile/app && npm install && npm run build:web

# 4. Deploy
cd ../../.. && npx firebase-tools@latest deploy --only hosting
```

## Support Resources

- [Firebase Console](https://console.firebase.google.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Expo Web Deployment](https://docs.expo.dev/workflow/web/)

---

**Status**: Ready for Firebase connection
**Last Updated**: $(date)
