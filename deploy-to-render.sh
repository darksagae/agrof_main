#!/bin/bash

echo "🌐 AGROF Backend Cloud Deployment to Render"
echo "==========================================="

# Navigate to project directory
cd "$(dirname "$0")"

echo "📋 This script will help you deploy both backends to Render:"
echo "   1. Python Flask API (AI Disease Detection)"
echo "   2. Node.js Store Backend (Product Store)"
echo ""

echo "🔧 Step 1: Prepare Python Flask API for Render..."

# Create render.yaml for Python API
cat > agrof-main/src/api/render.yaml << 'EOF'
services:
  - type: web
    name: agrof-ai-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python app.py
    envVars:
      - key: PORT
        value: 10000
      - key: PYTHON_VERSION
        value: 3.9.0
EOF

echo "✅ Created render.yaml for Python API"

echo "🔧 Step 2: Prepare Node.js Store Backend for Render..."

# Create render.yaml for Node.js API
cat > store-backend/render.yaml << 'EOF'
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
EOF

echo "✅ Created render.yaml for Node.js API"

echo "🔧 Step 3: Create deployment instructions..."

cat > BACKEND_DEPLOYMENT_GUIDE.md << 'EOF'
# 🚀 AGROF Backend Deployment Guide

## Overview
This guide will help you deploy both AGROF backends to Render (free cloud hosting).

## Backend Services
1. **Python Flask API** - AI Disease Detection (Port 5000)
2. **Node.js Store Backend** - Product Store (Port 3001)

## Deployment Steps

### Option 1: Deploy to Render (Recommended)

#### For Python Flask API:
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `agrof-main/src/api` directory
5. Use these settings:
   - **Name**: agrof-ai-api
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Port**: 10000 (auto-detected)

#### For Node.js Store Backend:
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `store-backend` directory
5. Use these settings:
   - **Name**: agrof-store-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Port**: 10000 (auto-detected)

### Option 2: Deploy to Railway

#### For Python Flask API:
1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose the `agrof-main/src/api` directory
5. Railway will auto-detect Python and deploy

#### For Node.js Store Backend:
1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose the `store-backend` directory
5. Railway will auto-detect Node.js and deploy

## Expected Results

After deployment, you'll get URLs like:
- **AI API**: `https://agrof-ai-api.onrender.com`
- **Store API**: `https://agrof-store-api.onrender.com`

## Frontend Configuration

Update your frontend to use the deployed backend URLs:

```javascript
// In your frontend API configuration
const API_CONFIG = {
  AI_API_URL: 'https://agrof-ai-api.onrender.com',
  STORE_API_URL: 'https://agrof-store-api.onrender.com'
};
```

## Testing Your Deployment

### Test AI API:
```bash
curl https://agrof-ai-api.onrender.com/health
curl https://agrof-ai-api.onrender.com/api/test
```

### Test Store API:
```bash
curl https://agrof-store-api.onrender.com/api/health
curl https://agrof-store-api.onrender.com/api/products
```

## Troubleshooting

### Common Issues:
1. **Build Failures**: Check that all dependencies are in requirements.txt/package.json
2. **Port Issues**: Ensure your apps use `process.env.PORT` or `os.environ.get('PORT')`
3. **CORS Issues**: Make sure CORS is enabled for your frontend domain

### Debug Commands:
```bash
# Check if services are running
curl -I https://your-api-url.onrender.com/health

# Check logs in Render dashboard
# Go to your service → Logs tab
```

## Cost Information
- **Render**: Free tier available (750 hours/month)
- **Railway**: Free tier available (500 hours/month)
- **Both**: Auto-sleep when not in use

## Next Steps
1. Deploy both backends using the steps above
2. Update your frontend API URLs
3. Test the complete system
4. Monitor performance in the cloud dashboards

---

**Status**: Ready for deployment
**Last Updated**: $(date)
EOF

echo "✅ Created BACKEND_DEPLOYMENT_GUIDE.md"

echo ""
echo "🎉 Backend deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Read BACKEND_DEPLOYMENT_GUIDE.md for detailed instructions"
echo "   2. Deploy to Render or Railway (both are free)"
echo "   3. Update your frontend to use the new backend URLs"
echo ""
echo "🌐 Recommended deployment order:"
echo "   1. Deploy Python Flask API first"
echo "   2. Deploy Node.js Store Backend second"
echo "   3. Update frontend configuration"
echo "   4. Test complete system"
echo ""
echo "💡 Both Render and Railway offer free tiers perfect for your AGROF app!"
