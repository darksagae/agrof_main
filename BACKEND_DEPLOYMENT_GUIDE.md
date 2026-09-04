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
