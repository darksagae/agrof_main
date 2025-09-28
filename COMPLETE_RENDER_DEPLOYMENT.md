# 🚀 **Complete AGROF Deployment on Render**

## 📋 **Full Stack Deployment**

Deploy your entire AGROF platform on Render:
- ✅ **AI Backend** (Python Flask)
- ✅ **Store Backend** (Node.js)  
- ✅ **Frontend** (React Native Web)

## 🛠️ **Step-by-Step Deployment**

### **Step 1: Deploy AI Backend (Python Flask)**

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Click "Connect GitHub"
   - Select: `darksagae/agrof_main`
   - Click "Connect"

3. **Configure AI Backend**
   ```
   Name: agrof-ai-api
   Environment: Python 3
   Region: Oregon (US West)
   Branch: main
   Root Directory: agrof-main/src/api
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app --bind 0.0.0.0:$PORT
   ```

4. **Environment Variables**
   ```
   PORT=10000
   FLASK_ENV=production
   ```

5. **Click "Create Web Service"**

### **Step 2: Deploy Store Backend (Node.js)**

1. **Create Another Web Service**
   - Click "New +" → "Web Service"
   - Select same repository: `darksagae/agrof_main`

2. **Configure Store Backend**
   ```
   Name: agrof-store-api
   Environment: Node
   Region: Oregon (US West)
   Branch: main
   Root Directory: store-backend
   Build Command: npm install
   Start Command: npm start
   ```

3. **Environment Variables**
   ```
   PORT=10000
   NODE_ENV=production
   ```

4. **Click "Create Web Service"**

### **Step 3: Deploy Frontend (React Native Web)**

1. **Create Frontend Web Service**
   - Click "New +" → "Web Service"
   - Select same repository: `darksagae/agrof_main`

2. **Configure Frontend**
   ```
   Name: agrof-frontend
   Environment: Node
   Region: Oregon (US West)
   Branch: main
   Root Directory: agrof-main/mobile/app
   Build Command: npm install && npm run build:web
   Start Command: npx serve dist -s
   ```

3. **Environment Variables**
   ```
   PORT=10000
   NODE_ENV=production
   ```

4. **Click "Create Web Service"**

## 🌐 **Service URLs**

After deployment, your services will be available at:

- **AI Backend**: `https://agrof-ai-api.onrender.com`
- **Store Backend**: `https://agrof-store-api.onrender.com`
- **Frontend**: `https://agrof-frontend.onrender.com`

## 🔧 **Configuration Files**

### **AI Backend** (`agrof-main/src/api/render.yaml`)
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

### **Store Backend** (`store-backend/render.yaml`)
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

### **Frontend** (`agrof-main/mobile/app/render.yaml`)
```yaml
services:
  - type: web
    name: agrof-frontend
    env: node
    buildCommand: npm install && npm run build:web
    startCommand: npx serve dist -s
    envVars:
      - key: PORT
        value: 10000
      - key: NODE_ENV
        value: production
```

## 🔗 **Update API URLs**

After deployment, update your frontend to use the deployed backends:

```javascript
// In agrof-main/mobile/app/services/storeApi.js
const API_BASE_URLS = [
  'https://agrof-store-api.onrender.com/api',  // Store backend
  'https://agrof-ai-api.onrender.com/api',     // AI backend
  // ... fallback URLs
];
```

## 🚨 **Important Notes**

### **Free Tier Limitations**
- **Sleep Mode**: Services sleep after 15 minutes of inactivity
- **Cold Start**: First request after sleep may take 30+ seconds
- **Bandwidth**: Limited bandwidth on free tier

### **Production Considerations**
- **Upgrade to Paid Plan**: For production use
- **Custom Domains**: Configure custom domains
- **Environment Variables**: Set up proper environment variables
- **Database**: Consider using Render's PostgreSQL

## 🔍 **Testing Your Deployment**

### **Health Check Endpoints**
- **AI Backend**: `https://agrof-ai-api.onrender.com/health`
- **Store Backend**: `https://agrof-store-api.onrender.com/api/health`
- **Frontend**: `https://agrof-frontend.onrender.com`

### **Test Commands**
```bash
# Test AI Backend
curl https://agrof-ai-api.onrender.com/health

# Test Store Backend
curl https://agrof-store-api.onrender.com/api/health

# Test Frontend
curl https://agrof-frontend.onrender.com
```

## 📊 **Monitoring**

Monitor all services in the Render dashboard:
- **Logs**: Real-time service logs
- **Metrics**: CPU, memory, and request metrics
- **Deployments**: Deployment history and status

## 🎯 **Quick Deployment Checklist**

- [ ] Create Render account
- [ ] Deploy AI Backend (Python Flask)
- [ ] Deploy Store Backend (Node.js)
- [ ] Deploy Frontend (React Native Web)
- [ ] Test all three services
- [ ] Update API URLs in frontend
- [ ] Monitor services

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Build Failures**
   - Check Python/Node.js versions
   - Verify dependencies in requirements.txt/package.json
   - Check build logs in Render dashboard

2. **Service Not Starting**
   - Verify start commands
   - Check environment variables
   - Review service logs

3. **Frontend Not Loading**
   - Check if build completed successfully
   - Verify serve command is working
   - Check static file serving

4. **API Connection Issues**
   - Update API URLs in frontend
   - Check CORS configuration
   - Verify service health endpoints

## 🎉 **Success!**

Once deployed, you'll have:
- ✅ **AI Backend** running on Render
- ✅ **Store Backend** running on Render  
- ✅ **Frontend** running on Render
- ✅ **Full AGROF Platform** accessible via web browser

Your complete AGROF agricultural platform will be live and accessible worldwide! 🌱

## 🚀 **Next Steps**

1. **Deploy all three services** using the steps above
2. **Test all endpoints** to ensure they're working
3. **Update API URLs** in the frontend code
4. **Monitor services** in the Render dashboard
5. **Share your live platform** with users!

---

**Your AGROF platform will be fully deployed on Render! 🚀**

