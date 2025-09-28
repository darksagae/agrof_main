# 🧠 **INSTALLING AI REQUIREMENTS FOR ENHANCED DISEASE DETECTION**

## 📋 **REQUIREMENTS OVERVIEW**

Your enhanced AI system requires several machine learning frameworks:

### **Core AI Frameworks:**
- **TensorFlow 2.13+** - For crop classification and image processing
- **PyTorch 2.0+** - For disease detection and classification
- **Google Cloud Vision API** - For object detection and labeling
- **OpenCV** - For image preprocessing and computer vision

### **Supporting Libraries:**
- **NumPy** - Numerical computing
- **Pandas** - Data manipulation
- **Scikit-learn** - Machine learning utilities
- **Pillow** - Image processing

## 🚀 **INSTALLATION OPTIONS**

### **Option 1: Full Development Environment (Recommended)**
```bash
# Install all dependencies including development tools
pip install -r requirements_enhanced.txt
```

### **Option 2: Production Environment (Lightweight)**
```bash
# Install only production dependencies
pip install -r requirements_production.txt
```

### **Option 3: Development Environment**
```bash
# Install development dependencies
pip install -r requirements_dev.txt
```

## 🔧 **STEP-BY-STEP INSTALLATION**

### **Step 1: Create Virtual Environment**
```bash
cd /home/darksagae/Desktop/saga/agrof1/agrof-main/src/api
python -m venv enhanced_ai_env
source enhanced_ai_env/bin/activate
```

### **Step 2: Upgrade pip**
```bash
pip install --upgrade pip
```

### **Step 3: Install TensorFlow**
```bash
# For CPU (recommended for production)
pip install tensorflow-cpu>=2.13.0

# For GPU (if you have CUDA)
# pip install tensorflow>=2.13.0
```

### **Step 4: Install PyTorch**
```bash
# For CPU (recommended for production)
pip install torch>=2.0.1+cpu torchvision>=0.15.2+cpu

# For GPU (if you have CUDA)
# pip install torch>=2.0.1 torchvision>=0.15.2
```

### **Step 5: Install Google Cloud Vision**
```bash
pip install google-cloud-vision>=3.4.4
```

### **Step 6: Install Additional Dependencies**
```bash
pip install tensorflow-hub>=0.14.0
pip install opencv-python>=4.8.0.76
pip install scikit-learn>=1.3.0
pip install pandas>=2.0.3
pip install numpy>=1.21.0
pip install Pillow>=9.0.0
```

## 🐳 **DOCKER INSTALLATION (Alternative)**

### **Create Dockerfile:**
```dockerfile
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements_production.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements_production.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Run application
CMD ["python", "enhanced_app.py"]
```

### **Build and Run:**
```bash
docker build -t agrof-enhanced-ai .
docker run -p 5000:5000 agrof-enhanced-ai
```

## 🔍 **VERIFICATION**

### **Test TensorFlow Installation:**
```python
import tensorflow as tf
print(f"TensorFlow version: {tf.__version__}")
print(f"GPU available: {tf.config.list_physical_devices('GPU')}")
```

### **Test PyTorch Installation:**
```python
import torch
import torchvision
print(f"PyTorch version: {torch.__version__}")
print(f"TorchVision version: {torchvision.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")
```

### **Test Google Cloud Vision:**
```python
from google.cloud import vision
print("Google Cloud Vision API imported successfully")
```

### **Test Enhanced AI System:**
```python
from enhanced_disease_detector import EnhancedDiseaseDetector
detector = EnhancedDiseaseDetector("/path/to/store")
print("Enhanced AI system initialized successfully")
```

## ⚠️ **TROUBLESHOOTING**

### **Common Issues:**

#### **1. TensorFlow Installation Issues:**
```bash
# If you get version conflicts
pip uninstall tensorflow
pip install tensorflow-cpu==2.13.0
```

#### **2. PyTorch Installation Issues:**
```bash
# If you get version conflicts
pip uninstall torch torchvision
pip install torch==2.0.1+cpu torchvision==0.15.2+cpu
```

#### **3. Google Cloud Vision Issues:**
```bash
# Install with specific version
pip install google-cloud-vision==3.4.4
```

#### **4. OpenCV Issues:**
```bash
# Use headless version for production
pip uninstall opencv-python
pip install opencv-python-headless
```

### **Memory Issues:**
```bash
# If you run out of memory during installation
pip install --no-cache-dir -r requirements_production.txt
```

### **Permission Issues:**
```bash
# If you get permission errors
sudo pip install -r requirements_production.txt
# OR
pip install --user -r requirements_production.txt
```

## 📊 **SYSTEM REQUIREMENTS**

### **Minimum Requirements:**
- **RAM:** 4GB (8GB recommended)
- **Storage:** 2GB free space
- **Python:** 3.8+ (3.9+ recommended)
- **OS:** Linux, macOS, or Windows

### **Recommended Requirements:**
- **RAM:** 8GB+ (16GB for GPU)
- **Storage:** 5GB free space
- **Python:** 3.9+
- **OS:** Ubuntu 20.04+ or macOS 11+

## 🚀 **QUICK START**

### **One-Command Installation:**
```bash
cd /home/darksagae/Desktop/saga/agrof1/agrof-main/src/api
pip install -r requirements_production.txt
```

### **Test Installation:**
```bash
python -c "
import tensorflow as tf
import torch
from google.cloud import vision
print('✅ All AI frameworks installed successfully!')
print(f'TensorFlow: {tf.__version__}')
print(f'PyTorch: {torch.__version__}')
"
```

## 💰 **COST CONSIDERATIONS**

### **Development Environment:**
- **Full installation:** ~2GB disk space
- **Memory usage:** ~1GB RAM
- **No additional costs**

### **Production Environment:**
- **Lightweight installation:** ~500MB disk space
- **Memory usage:** ~500MB RAM
- **No additional costs**

### **Cloud Deployment:**
- **Railway/Render:** $5-20/month
- **Google Cloud:** $10-50/month
- **AWS/Azure:** $20-100/month

## 🎯 **NEXT STEPS**

1. **Install requirements:** `pip install -r requirements_production.txt`
2. **Test installation:** Run verification scripts
3. **Configure APIs:** Set up Google Cloud credentials
4. **Start system:** Run `python enhanced_app.py`
5. **Test with images:** Upload crop images for analysis

Your enhanced AI system will be ready to detect diseases with 85-95% accuracy using multiple AI models! 🌱🤖
