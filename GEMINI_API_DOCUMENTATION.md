# AGROF Gemini AI API Documentation

## Overview
Your AGROF project has **TWO separate APIs** running:

### 1. **Python Flask API (Port 5000)** - Gemini AI Backend
- **Purpose**: AI-powered crop disease detection using Google Gemini
- **Base URL**: `http://192.168.1.14:5000`
- **Technology**: Python Flask + Google Gemini AI

### 2. **Node.js Store API (Port 3001)** - E-commerce Backend  
- **Purpose**: Product catalog, shopping cart, inventory management
- **Base URL**: `http://192.168.1.14:3001`
- **Technology**: Node.js + Express + SQLite

---

## 🤖 GEMINI AI API (Port 5000)

### Base Configuration
```bash
Base URL: http://192.168.1.14:5000
AI Engine: Google Gemini 1.5 Flash
CORS: Enabled for all origins
```

### API Endpoints

#### 1. Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "message": "AGROF AI Backend is running",
  "timestamp": "2025-09-24T14:28:39.123456",
  "ai_status": "Gemini AI Ready"
}
```

#### 2. Image Analysis (Main Endpoint)
```http
POST /api/analyze
Content-Type: multipart/form-data
```

**Request Body:**
- `image` (file): Image file (JPEG, PNG)
- `stakeholder` (string): "farmers", "researchers", "agronomists"

**Alternative Request (Base64):**
```json
POST /api/analyze
Content-Type: application/json

{
  "image_data": "base64_encoded_image_string",
  "stakeholder": "farmers"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Analysis completed successfully",
  "timestamp": "2025-09-24T14:28:39.123456",
  "stakeholder": "farmers",
  "analysis": {
    "crop_type": "Maize",
    "disease_type": "Leaf Blight",
    "health_status": "diseased",
    "confidence": 0.85,
    "severity": "moderate",
    "immediate_treatments": ["Apply fungicide", "Remove affected leaves"],
    "prevention": "Regular field monitoring",
    "economic_impact": "Medium yield loss expected",
    "detection_method": "gemini_ai",
    "api_source": "google_gemini"
  },
  "business_insights": {
    "economic_impact": "Medium yield loss expected",
    "recommendations": ["Apply fungicide", "Remove affected leaves"],
    "market_value": "Requires attention"
  },
  "post_harvest": {
    "loss_risk": "Medium",
    "storage_recommendations": "Standard storage conditions",
    "transport_advice": "Normal handling procedures"
  },
  "analysis_method": "gemini_ai",
  "api_source": "google_gemini"
}
```

#### 3. Test Endpoint
```http
GET /api/test
```
**Response:**
```json
{
  "message": "AGROF AI Backend is working!",
  "timestamp": "2025-09-24T14:28:39.123456",
  "status": "success",
  "ai_status": "Gemini AI Ready"
}
```

#### 4. Connection Test
```http
GET /api/connection-test
POST /api/connection-test
```
**Response:**
```json
{
  "status": "success",
  "message": "Frontend can connect to backend!",
  "timestamp": "2025-09-24T14:28:39.123456",
  "method": "GET",
  "ai_status": "Gemini AI Ready"
}
```

### Gemini AI Features

#### **AI Analysis Capabilities:**
- **Crop Disease Detection**: Identifies diseases, pests, and nutrient deficiencies
- **Crop Type Recognition**: Automatically detects crop species
- **Health Assessment**: Evaluates plant health status
- **Treatment Recommendations**: Provides specific treatment advice
- **Economic Impact Analysis**: Assesses potential yield losses
- **Prevention Strategies**: Suggests preventive measures

#### **Supported Stakeholders:**
- **Farmers**: Practical, actionable advice
- **Researchers**: Detailed scientific analysis
- **Agronomists**: Professional agricultural insights

#### **Image Processing:**
- **Format Support**: JPEG, PNG, WebP
- **Size Optimization**: Auto-resizes large images for faster processing
- **Base64 Support**: Direct base64 image data
- **File Upload**: Multipart form data

#### **Caching System:**
- **In-Memory Cache**: 1-hour TTL for faster repeated analysis
- **Cache Key**: MD5 hash of image data
- **Performance**: Reduces API calls and processing time

### Error Handling

#### Common Error Responses:
```json
{
  "status": "error",
  "message": "Analysis failed: [error details]"
}
```

#### Error Codes:
- **400**: Bad Request (no image data)
- **500**: Internal Server Error (AI analysis failed)

### Configuration

#### Environment Variables:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
HOST=0.0.0.0
```

#### Current Configuration:
- **API Key**: `AIzaSyC-iO6PkYIVcb4Z-9iixdFapdKe-HQL-58`
- **Model**: `gemini-1.5-flash`
- **Endpoint**: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`

### Usage Examples

#### 1. Using cURL (File Upload):
```bash
curl -X POST http://192.168.1.14:5000/api/analyze \
  -F "image=@crop_image.jpg" \
  -F "stakeholder=farmers"
```

#### 2. Using cURL (Base64):
```bash
curl -X POST http://192.168.1.14:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image_data": "base64_string_here", "stakeholder": "farmers"}'
```

#### 3. JavaScript Fetch:
```javascript
const formData = new FormData();
formData.append('image', imageFile);
formData.append('stakeholder', 'farmers');

fetch('http://192.168.1.14:5000/api/analyze', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### Performance Features

#### **Optimization:**
- **Image Compression**: Auto-resizes images to 1024x1024 max
- **Caching**: 1-hour cache for identical images
- **Async Processing**: Non-blocking AI analysis
- **Error Recovery**: Fallback responses when AI fails

#### **Monitoring:**
- **Logging**: Comprehensive request/response logging
- **Health Checks**: Real-time API status monitoring
- **Performance Metrics**: Response time tracking

---

## 🛒 STORE API (Port 3001)

### Base Configuration
```bash
Base URL: http://192.168.1.14:3001/api
Database: SQLite (store.db)
Products: 332+ agricultural products
```

### Key Endpoints:
- `GET /api/health` - Server status
- `GET /api/categories` - Product categories (6 categories)
- `GET /api/products` - All products
- `GET /api/search?q=query` - Search products
- `POST /api/cart/add` - Add to cart
- `GET /api/cart/:sessionId` - Get cart items

---

## 🔧 Current Status

### ✅ Running Services:
1. **Python Flask API** (Port 5000) - Gemini AI Backend
2. **Node.js Store API** (Port 3001) - E-commerce Backend
3. **Expo Development Server** - Mobile App

### 📊 Database Status:
- **Products**: 332+ items processed
- **Categories**: 6 categories (Fertilizers, Fungicides, Herbicides, Nursery Bed, Organic Chemicals, Seeds)
- **Database**: SQLite with full inventory management

### 🌐 Network Configuration:
- **Local IP**: 192.168.1.14
- **CORS**: Enabled for all origins
- **Access**: Available from mobile devices on same network

---

## 🚀 Quick Start

### Test Gemini AI:
```bash
curl http://192.168.1.14:5000/api/test
```

### Test Store API:
```bash
curl http://192.168.1.14:3001/api/health
```

### Analyze Crop Image:
```bash
curl -X POST http://192.168.1.14:5000/api/analyze \
  -F "image=@your_crop_image.jpg" \
  -F "stakeholder=farmers"
```

Your Gemini AI API is fully functional and ready for crop disease analysis! 🌱🤖


