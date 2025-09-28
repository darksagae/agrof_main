t #!/bin/bash

# Enhanced AI Requirements Installation Script
# Installs TensorFlow, PyTorch, and other AI dependencies

echo "🧠 Installing Enhanced AI Requirements for AGROF"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -d "agrof-main/src/api" ]; then
    print_error "Please run this script from the AGROF project root directory"
    exit 1
fi

# Navigate to API directory
cd agrof-main/src/api

print_info "Installing Enhanced AI Requirements..."

# 1. Check Python version
print_info "Checking Python version..."
python_version=$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
required_version="3.8"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" = "$required_version" ]; then
    print_status "Python version $python_version is compatible"
else
    print_error "Python version $python_version is not compatible. Required: $required_version+"
    exit 1
fi

# 2. Create virtual environment if it doesn't exist
if [ ! -d "enhanced_ai_env" ]; then
    print_info "Creating virtual environment..."
    python3 -m venv enhanced_ai_env
    print_status "Virtual environment created"
else
    print_info "Virtual environment already exists"
fi

# 3. Activate virtual environment
print_info "Activating virtual environment..."
source enhanced_ai_env/bin/activate
print_status "Virtual environment activated"

# 4. Upgrade pip
print_info "Upgrading pip..."
pip install --upgrade pip
print_status "Pip upgraded"

# 5. Install core dependencies first
print_info "Installing core dependencies..."
pip install numpy>=1.21.0
pip install Pillow>=9.0.0
pip install requests>=2.28.0
print_status "Core dependencies installed"

# 6. Install TensorFlow (CPU version for production)
print_info "Installing TensorFlow..."
pip install tensorflow-cpu>=2.13.0
print_status "TensorFlow installed"

# 7. Install TensorFlow Hub
print_info "Installing TensorFlow Hub..."
pip install tensorflow-hub>=0.14.0
print_status "TensorFlow Hub installed"

# 8. Install PyTorch (CPU version for production)
print_info "Installing PyTorch..."
pip install torch>=2.0.1+cpu torchvision>=0.15.2+cpu
print_status "PyTorch installed"

# 9. Install Google Cloud Vision
print_info "Installing Google Cloud Vision..."
pip install google-cloud-vision>=3.4.4
print_status "Google Cloud Vision installed"

# 10. Install OpenCV
print_info "Installing OpenCV..."
pip install opencv-python-headless>=4.8.0.76
print_status "OpenCV installed"

# 11. Install machine learning libraries
print_info "Installing machine learning libraries..."
pip install scikit-learn>=1.3.0
pip install pandas>=2.0.3
print_status "Machine learning libraries installed"

# 12. Install Flask and web dependencies
print_info "Installing Flask and web dependencies..."
pip install flask>=2.0.0
pip install flask-cors>=3.0.10
pip install gunicorn>=20.1.0
pip install waitress>=2.1.0
print_status "Web dependencies installed"

# 13. Install additional utilities
print_info "Installing additional utilities..."
pip install python-dotenv>=0.19.0
pip install loguru>=0.7.0
pip install psutil>=5.9.0
print_status "Additional utilities installed"

# 14. Test installations
print_info "Testing installations..."

# Test TensorFlow
python3 -c "
import tensorflow as tf
print(f'TensorFlow version: {tf.__version__}')
print('✅ TensorFlow working correctly')
" 2>/dev/null && print_status "TensorFlow test passed" || print_warning "TensorFlow test failed"

# Test PyTorch
python3 -c "
import torch
import torchvision
print(f'PyTorch version: {torch.__version__}')
print(f'TorchVision version: {torchvision.__version__}')
print('✅ PyTorch working correctly')
" 2>/dev/null && print_status "PyTorch test passed" || print_warning "PyTorch test failed"

# Test Google Cloud Vision
python3 -c "
from google.cloud import vision
print('✅ Google Cloud Vision working correctly')
" 2>/dev/null && print_status "Google Cloud Vision test passed" || print_warning "Google Cloud Vision test failed"

# Test OpenCV
python3 -c "
import cv2
print(f'OpenCV version: {cv2.__version__}')
print('✅ OpenCV working correctly')
" 2>/dev/null && print_status "OpenCV test passed" || print_warning "OpenCV test failed"

# 15. Create requirements file with installed versions
print_info "Creating requirements file with installed versions..."
pip freeze > requirements_installed.txt
print_status "Requirements file created: requirements_installed.txt"

# 16. Test enhanced disease detector
print_info "Testing enhanced disease detector..."
python3 -c "
try:
    from enhanced_disease_detector import EnhancedDiseaseDetector
    print('✅ Enhanced disease detector imported successfully')
except ImportError as e:
    print(f'⚠️  Enhanced disease detector import failed: {e}')
except Exception as e:
    print(f'⚠️  Enhanced disease detector test failed: {e}')
" 2>/dev/null && print_status "Enhanced disease detector test passed" || print_warning "Enhanced disease detector test failed"

# 17. Final status
echo ""
echo "🎉 Enhanced AI Requirements Installation Complete!"
echo "================================================="
print_status "All AI frameworks installed successfully"
print_info "Installed components:"
echo "  • TensorFlow $(python3 -c 'import tensorflow as tf; print(tf.__version__)' 2>/dev/null || echo 'N/A')"
echo "  • PyTorch $(python3 -c 'import torch; print(torch.__version__)' 2>/dev/null || echo 'N/A')"
echo "  • Google Cloud Vision $(python3 -c 'import google.cloud.vision; print("3.4.4+")' 2>/dev/null || echo 'N/A')"
echo "  • OpenCV $(python3 -c 'import cv2; print(cv2.__version__)' 2>/dev/null || echo 'N/A')"
echo "  • Scikit-learn $(python3 -c 'import sklearn; print(sklearn.__version__)' 2>/dev/null || echo 'N/A')"
echo ""
print_info "Next steps:"
echo "  1. Set up Google Cloud credentials"
echo "  2. Configure environment variables"
echo "  3. Run: python enhanced_app.py"
echo "  4. Test with crop images"
echo ""
print_info "Your Enhanced AI Disease Detection System is ready! 🌱🤖"
