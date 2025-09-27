# 🚀 AGROF Render Deployment Guide

## 📋 Overview

This guide will help you deploy the AGROF project to Render with the following services:

1. **AI Backend** (Python Flask) - Disease detection and AI analysis
2. **Store Backend** (Node.js) - E-commerce API and product management
3. **Frontend** (React Native) - Mobile app (deployed via Expo)

## 🛠️ Prerequisites

- Render account (sign up at https://render.com)
- Git repository with your code
- Render CLI installed (optional, for command-line deployment)

## 📦 Service Architecture

```
AGROF Project
├── AI Backend (Python Flask)
│   ├── Disease detection API
│   ├── Image analysis
│   └── AI-powered recommendations
├── Store Backend (Node.js)
│   ├── E-commerce API
│   ├── Product management
│   ├── Shopping cart
│   └── Inventory system
└── Frontend (React Native)
    ├── Mobile app
    ├── Disease detection UI
    ├── Store interface
    └── Dashboard
```

## 🚀 Deployment Steps

### Option 1: Automated Deployment (Recommended)

```bash
# Run the deployment script
./deploy-render.sh
```

### Option 2: Manual Deployment

#### 1. Deploy AI Backend (Python Flask)

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect your Git repository
   - Select the repository containing your code

3. **Configure Service**
   - **Name**: `agrof-ai-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
   - **Root Directory**: `agrof-main/src/api`

4. **Environment Variables**
   ```
   PORT=10000
   FLASK_ENV=production
   ```

#### 2. Deploy Store Backend (Node.js)

1. **Create New Web Service**
   - Click "New +" → "Web Service"

2. **Configure Service**
   - **Name**: `agrof-store-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `store-backend`

3. **Environment Variables**
   ```
   PORT=10000
   NODE_ENV=production
   ```

## 🔧 Configuration Files

### AI Backend (`agrof-main/src/api/render.yaml`)
```yaml
services:
  - type: web
    name: agrof-ai-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app --bind 0.0.0.0:$PORT
    envVars:
      - key: PORT
        value: 10000
      - key: FLASK_ENV
        value: production
```

### Store Backend (`store-backend/render.yaml`)
```yaml
services:
  - type: web
    name: agrof-store-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: PORT
        value: 10000
      - key: NODE_ENV
        value: production
```

## 🌐 Service URLs

After deployment, your services will be available at:

- **AI Backend**: `https://agrof-ai-api.onrender.com`
- **Store Backend**: `https://agrof-store-api.onrender.com`

## 📱 Frontend Deployment

The React Native frontend is deployed via Expo:

```bash
# Navigate to mobile app directory
cd agrof-main/mobile/app

# Deploy to Expo
npx eas update --platform all
```

## 🔗 API Integration

Update your mobile app's API configuration to use the deployed services:

```javascript
// In mobile/app/services/storeApi.js
const API_BASE_URLS = [
  'https://agrof-store-api.onrender.com/api',  // Store backend
  'https://agrof-ai-api.onrender.com/api',     // AI backend
  // ... fallback URLs
];
```

## 🚨 Important Notes

### Free Tier Limitations
- **Sleep Mode**: Free services sleep after 15 minutes of inactivity
- **Cold Start**: First request after sleep may take 30+ seconds
- **Bandwidth**: Limited bandwidth on free tier

### Production Considerations
- **Upgrade to Paid Plan**: For production use, consider upgrading
- **Custom Domains**: Configure custom domains for better branding
- **Environment Variables**: Set up proper environment variables
- **Database**: Consider using Render's PostgreSQL for production

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Python/Node.js versions
   - Verify all dependencies in requirements.txt/package.json
   - Check build logs in Render dashboard

2. **Service Not Starting**
   - Verify start commands
   - Check environment variables
   - Review service logs

3. **API Connection Issues**
   - Update API URLs in mobile app
   - Check CORS configuration
   - Verify service health endpoints

### Health Check Endpoints

- **AI Backend**: `https://agrof-ai-api.onrender.com/health`
- **Store Backend**: `https://agrof-store-api.onrender.com/api/health`

## 📊 Monitoring

Monitor your services in the Render dashboard:
- **Logs**: Real-time service logs
- **Metrics**: CPU, memory, and request metrics
- **Deployments**: Deployment history and status

## 🎯 Next Steps

1. **Deploy Services**: Use the automated script or manual deployment
2. **Test APIs**: Verify all endpoints are working
3. **Update Mobile App**: Configure API URLs in the mobile app
4. **Deploy Frontend**: Deploy the React Native app via Expo
5. **Monitor**: Set up monitoring and alerts

## 🆘 Support

- **Render Documentation**: https://render.com/docs
- **Render Support**: https://render.com/support
- **Project Issues**: Check the project's GitHub issues

---

**Happy Deploying! 🚀**
