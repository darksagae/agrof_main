# 🚀 AGROF System Deployment Guide

## 📋 System Overview

The AGROF system consists of **4 main components**:

1. **🌱 Mobile App (React Native + Expo)** - Frontend
2. **🛒 Store Backend (Node.js + Express)** - E-commerce API  
3. **🤖 AI Backend (Python + Flask)** - Disease detection & AI services
4. **📱 WhatsApp Bot (Node.js)** - Customer communication
5. **⚙️ Automation Engine (Node.js)** - Workflow automation

## 🎯 Deployment Strategy

### Backend Services → Render.com
- **Store Backend**: `https://agrof-store-api.onrender.com`
- **AI Backend**: `https://agrof-ai-api.onrender.com`  
- **WhatsApp Bot**: `https://agrof-whatsapp-bot.onrender.com`

### Frontend → EAS Expo
- **Mobile App**: Deploy to app stores via EAS Build
- **Web App**: Deploy to web via EAS Deploy

---

## 🛠️ Backend Deployment to Render

### 1. Store Backend Deployment

**Repository**: `store-backend/`
**Render Service**: `agrof-store-api`

```bash
# Navigate to store backend
cd /home/darksagae/Desktop/agrof-auto/store-backend

# Files needed for deployment:
# - render.yaml ✅ (Created)
# - package.json ✅ (Exists)
# - server.js ✅ (Exists)
# - Dockerfile ✅ (Exists)
```

**Environment Variables**:
- `PORT`: 10000
- `NODE_ENV`: production
- `SUPABASE_URL`: https://xtklayjpdpfykjbttaac.supabase.co
- `SUPABASE_ANON_KEY`: [Your Supabase Anon Key]
- `SUPABASE_SERVICE_ROLE_KEY`: [Your Supabase Service Role Key]

### 2. AI Backend Deployment

**Repository**: `agrof-main/src/api/`
**Render Service**: `agrof-ai-api`

```bash
# Navigate to AI backend
cd /home/darksagae/Desktop/agrof-auto/agrof-main/src/api

# Files needed for deployment:
# - render.yaml ✅ (Created)
# - requirements.txt ✅ (Exists)
# - app.py ✅ (Exists)
# - Dockerfile ✅ (Exists)
```

**Environment Variables**:
- `PORT`: 10000
- `FLASK_ENV`: production
- `FLASK_DEBUG`: false
- `GEMINI_API_KEY`: AIzaSyBE2b1nKpQd6LseRIVXfh10O_O3Pm0fvM0
- `SUPABASE_URL`: https://xtklayjpdpfykjbttaac.supabase.co
- `SUPABASE_ANON_KEY`: [Your Supabase Anon Key]
- `SUPABASE_SERVICE_ROLE_KEY`: [Your Supabase Service Role Key]

### 3. WhatsApp Bot Deployment

**Repository**: `whatsapp-bot/`
**Render Service**: `agrof-whatsapp-bot`

```bash
# Navigate to WhatsApp bot
cd /home/darksagae/Desktop/agrof-auto/whatsapp-bot

# Files needed for deployment:
# - render.yaml ✅ (Created)
# - package.json ✅ (Exists)
# - bot.js ✅ (Exists)
# - Dockerfile ✅ (Exists)
```

**Environment Variables**:
- `PORT`: 10000
- `NODE_ENV`: production
- `ADMIN_NUMBERS`: 256743232441
- `STORE_BACKEND_URL`: https://agrof-store-api.onrender.com
- `AUTOMATION_ENGINE_URL`: https://agrof-automation-engine.onrender.com

---

## 📱 Frontend Deployment to EAS Expo

### 1. Mobile App (EAS Build)

**Repository**: `agrof-main/mobile/app/`
**EAS Project ID**: `5078ace1-2ba3-4c26-8cfa-62c952a21a2c`

```bash
# Navigate to mobile app
cd /home/darksagae/Desktop/agrof-auto/agrof-main/mobile/app

# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS (if needed)
eas build --platform ios --profile production
```

### 2. Web App (EAS Deploy)

```bash
# Build web version
npx expo export --platform web

# Deploy to EAS
eas deploy --platform web
```

---

## 🔧 Configuration Updates

### API Configuration Updated

The mobile app's API configuration has been updated to use Render URLs:

```javascript
// config/apiConfig.js
const RENDER_URLS = [
  'https://agrof-store-api.onrender.com',    // Store Backend
  'https://agrof-ai-api.onrender.com',       // AI Backend  
  'https://agrof-whatsapp-bot.onrender.com' // WhatsApp Bot
];
```

### Environment Variables

All services are configured with production environment variables for Render deployment.

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend Services to Render

1. **Create Render Account**: Go to [render.com](https://render.com)
2. **Connect GitHub**: Link your repository
3. **Deploy Services**:
   - Create new Web Service for Store Backend
   - Create new Web Service for AI Backend  
   - Create new Web Service for WhatsApp Bot
4. **Configure Environment Variables** for each service
5. **Deploy**: Click "Create Web Service"

### Step 2: Deploy Frontend to EAS

1. **Install EAS CLI**: `npm install -g @expo/eas-cli`
2. **Login**: `eas login`
3. **Configure**: `eas build:configure`
4. **Build**: `eas build --platform android --profile production`
5. **Deploy Web**: `eas deploy --platform web`

### Step 3: Test Integration

1. **Test Store API**: `curl https://agrof-store-api.onrender.com/api/health`
2. **Test AI API**: `curl https://agrof-ai-api.onrender.com/health`
3. **Test WhatsApp Bot**: `curl https://agrof-whatsapp-bot.onrender.com/health`
4. **Test Mobile App**: Install APK and test features

---

## 📊 Expected URLs After Deployment

### Backend Services (Render)
- **Store API**: `https://agrof-store-api.onrender.com`
- **AI API**: `https://agrof-ai-api.onrender.com`
- **WhatsApp Bot**: `https://agrof-whatsapp-bot.onrender.com`

### Frontend (EAS)
- **Mobile App**: Available via EAS Build (APK/IPA)
- **Web App**: Available via EAS Deploy (Web URL)

---

## 🔍 Health Checks

### Store Backend
```bash
curl https://agrof-store-api.onrender.com/api/health
```

### AI Backend  
```bash
curl https://agrof-ai-api.onrender.com/health
```

### WhatsApp Bot
```bash
curl https://agrof-whatsapp-bot.onrender.com/health
```

---

## 🎉 Success Criteria

✅ **Backend Services**: All 3 services deployed and accessible on Render
✅ **Frontend**: Mobile app built and web app deployed via EAS
✅ **Integration**: Mobile app successfully connects to Render APIs
✅ **WhatsApp Bot**: Bot responds to messages and integrates with backend
✅ **Health Checks**: All services return healthy status

---

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**: Check environment variables and dependencies
2. **API Connection**: Verify Render URLs are correct
3. **WhatsApp Bot**: Ensure QR code scanning is completed
4. **Mobile App**: Check API configuration in `config/apiConfig.js`

### Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **EAS Documentation**: [docs.expo.dev](https://docs.expo.dev)
- **AGROF System**: Check logs in respective service directories

---

## 🎯 Next Steps After Deployment

1. **Monitor Services**: Check Render dashboard for service health
2. **Test Mobile App**: Install and test all features
3. **Configure WhatsApp**: Scan QR code to activate bot
4. **Set Up Monitoring**: Configure alerts for service downtime
5. **Scale Services**: Upgrade Render plans if needed

---

**🚀 Ready to deploy! Follow the steps above to get your AGROF system live on the cloud!**
