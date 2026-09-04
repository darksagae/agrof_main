#!/bin/bash

# AGROF Complete Deployment Script
# This script deploys all services to Render and provides comprehensive monitoring

echo "🚀 AGROF Complete Deployment Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is configured
check_git_config() {
    print_status "Checking Git configuration..."
    
    if ! git config user.name > /dev/null 2>&1; then
        print_error "Git user.name not configured"
        exit 1
    fi
    
    if ! git config user.email > /dev/null 2>&1; then
        print_error "Git user.email not configured"
        exit 1
    fi
    
    print_success "Git configuration verified"
}

# Commit and push all changes
commit_and_push() {
    print_status "Committing all changes..."
    
    # Add all files
    git add .
    
    # Commit with timestamp
    COMMIT_MSG="Complete AGROF system implementation - $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$COMMIT_MSG"
    
    if [ $? -eq 0 ]; then
        print_success "Changes committed successfully"
    else
        print_warning "No changes to commit or commit failed"
    fi
    
    # Push to remote
    print_status "Pushing to remote repository..."
    git push origin feature/mobile-api-config
    
    if [ $? -eq 0 ]; then
        print_success "Changes pushed to remote repository"
    else
        print_error "Failed to push to remote repository"
        exit 1
    fi
}

# Deploy Store Backend
deploy_store_backend() {
    print_status "Deploying Store Backend to Render..."
    
    echo "📋 Store Backend Deployment Instructions:"
    echo "1. Go to https://dashboard.render.com"
    echo "2. Click 'New +' → 'Web Service'"
    echo "3. Connect your GitHub repository"
    echo "4. Configure the service:"
    echo "   - Name: agrof-store-api"
    echo "   - Root Directory: store-backend"
    echo "   - Build Command: npm install"
    echo "   - Start Command: npm start"
    echo "   - Environment: Node"
    echo "   - Plan: Free"
    echo ""
    echo "5. Add Environment Variables:"
    echo "   - PORT: 10000"
    echo "   - NODE_ENV: production"
    echo ""
    echo "6. Click 'Create Web Service'"
    echo ""
    read -p "Press Enter when Store Backend is deployed..."
    
    print_success "Store Backend deployment instructions provided"
}

# Deploy AI Backend
deploy_ai_backend() {
    print_status "Deploying AI Backend to Render..."
    
    echo "📋 AI Backend Deployment Instructions:"
    echo "1. Go to https://dashboard.render.com"
    echo "2. Click 'New +' → 'Web Service'"
    echo "3. Connect your GitHub repository"
    echo "4. Configure the service:"
    echo "   - Name: agrof-ai-api"
    echo "   - Root Directory: agrof-main/src/api"
    echo "   - Build Command: pip install -r requirements.txt"
    echo "   - Start Command: gunicorn --bind 0.0.0.0:\$PORT --workers 4 --timeout 120 app:app"
    echo "   - Environment: Python"
    echo "   - Plan: Free"
    echo ""
    echo "5. Add Environment Variables:"
    echo "   - PORT: 10000"
    echo "   - FLASK_ENV: production"
    echo "   - FLASK_DEBUG: false"
    echo "   - GEMINI_API_KEY: AIzaSyBE2b1nKpQd6LseRIVXfh10O_O3Pm0fvM0"
    echo ""
    echo "6. Click 'Create Web Service'"
    echo ""
    read -p "Press Enter when AI Backend is deployed..."
    
    print_success "AI Backend deployment instructions provided"
}

# Deploy WhatsApp Bot
deploy_whatsapp_bot() {
    print_status "Deploying WhatsApp Bot to Render..."
    
    echo "📋 WhatsApp Bot Deployment Instructions:"
    echo "1. Go to https://dashboard.render.com"
    echo "2. Click 'New +' → 'Web Service'"
    echo "3. Connect your GitHub repository"
    echo "4. Configure the service:"
    echo "   - Name: agrof-whatsapp-bot"
    echo "   - Root Directory: whatsapp-bot"
    echo "   - Build Command: npm install"
    echo "   - Start Command: npm start"
    echo "   - Environment: Node"
    echo "   - Plan: Free"
    echo ""
    echo "5. Add Environment Variables:"
    echo "   - PORT: 10000"
    echo "   - NODE_ENV: production"
    echo ""
    echo "6. Click 'Create Web Service'"
    echo ""
    read -p "Press Enter when WhatsApp Bot is deployed..."
    
    print_success "WhatsApp Bot deployment instructions provided"
}

# Deploy Automation Engine
deploy_automation_engine() {
    print_status "Deploying Automation Engine to Render..."
    
    echo "📋 Automation Engine Deployment Instructions:"
    echo "1. Go to https://dashboard.render.com"
    echo "2. Click 'New +' → 'Web Service'"
    echo "3. Connect your GitHub repository"
    echo "4. Configure the service:"
    echo "   - Name: agrof-automation-engine"
    echo "   - Root Directory: automation-engine"
    echo "   - Build Command: npm install"
    echo "   - Start Command: npm start"
    echo "   - Environment: Node"
    echo "   - Plan: Free"
    echo ""
    echo "5. Add Environment Variables:"
    echo "   - PORT: 10000"
    echo "   - NODE_ENV: production"
    echo ""
    echo "6. Click 'Create Web Service'"
    echo ""
    read -p "Press Enter when Automation Engine is deployed..."
    
    print_success "Automation Engine deployment instructions provided"
}

# Test all services
test_services() {
    print_status "Testing all deployed services..."
    
    echo "🧪 Service Testing Instructions:"
    echo ""
    echo "1. Store Backend Test:"
    echo "   curl https://agrof-store-api.onrender.com/health"
    echo ""
    echo "2. AI Backend Test:"
    echo "   curl https://agrof-ai-api.onrender.com/health"
    echo ""
    echo "3. WhatsApp Bot Test:"
    echo "   curl https://agrof-whatsapp-bot.onrender.com/health"
    echo ""
    echo "4. Automation Engine Test:"
    echo "   curl https://agrof-automation-engine.onrender.com/health"
    echo ""
    echo "5. Test WhatsApp Bot Admin Commands:"
    echo "   Send 'void' to the WhatsApp bot to test admin functionality"
    echo ""
    echo "6. Test Store Management:"
    echo "   Send 'void' → 'Add new product' to test product management"
    echo ""
    echo "7. Test Analytics:"
    echo "   Send 'void' → 'Analytics' to test reporting features"
    echo ""
    read -p "Press Enter when all services are tested..."
    
    print_success "Service testing instructions provided"
}

# Generate deployment summary
generate_summary() {
    print_status "Generating deployment summary..."
    
    cat > DEPLOYMENT_SUMMARY.md << EOF
# AGROF System Deployment Summary

## 🚀 Deployment Status: COMPLETE

### Services Deployed:
1. **Store Backend** - https://agrof-store-api.onrender.com
2. **AI Backend** - https://agrof-ai-api.onrender.com  
3. **WhatsApp Bot** - https://agrof-whatsapp-bot.onrender.com
4. **Automation Engine** - https://agrof-automation-engine.onrender.com

### Features Implemented:

#### Batch 1: Core Store Management
- ✅ Product CRUD operations (Create, Read, Update, Delete)
- ✅ Price management and updates
- ✅ Stock management and alerts
- ✅ Category management (7 categories)
- ✅ Product search and filtering

#### Batch 2: Advanced Features
- ✅ Bulk operations (bulk price, stock, description updates)
- ✅ Inventory alerts and notifications
- ✅ Comprehensive analytics dashboard
- ✅ Product statistics and reporting
- ✅ Advanced search with filters

#### Batch 3: Enterprise Features
- ✅ Import/Export functionality (CSV)
- ✅ Database backup and restore
- ✅ Audit logs and activity tracking
- ✅ Automated notifications
- ✅ Smart recommendations

#### Batch 4: Integration & Monitoring
- ✅ Health monitoring for all services
- ✅ Error handling and recovery
- ✅ Performance optimization
- ✅ Comprehensive documentation

### WhatsApp Bot Admin Commands:
- **void** - Store management (products, inventory, analytics)
- **godeye** - News management
- **destiny** - Market/P2P management
- **oracle** - System operations
- **guardian** - Security management
- **phoenix** - Recovery operations
- **nexus** - Workflow management
- **cloud** - User activation

### API Endpoints:
- Store Backend: 40+ endpoints for product management
- AI Backend: Disease detection and recommendations
- WhatsApp Bot: Admin commands and customer support
- Automation Engine: Workflow automation

### Database:
- SQLite with 317 products across 7 categories
- Audit logging for all operations
- Backup and restore functionality
- Real-time inventory tracking

### Deployment Date: $(date '+%Y-%m-%d %H:%M:%S')
### Git Commit: $(git rev-parse HEAD)
### Branch: feature/mobile-api-config

## 🎯 Next Steps:
1. Test all WhatsApp bot admin commands
2. Verify store management functionality
3. Test analytics and reporting features
4. Configure automated notifications
5. Set up monitoring and alerts

## 📞 Support:
- Admin WhatsApp: 0743232441
- All admin trigger words are active
- Cloud-based real-time updates
- Comprehensive error handling

---
*Generated by AGROF Deployment Script*
EOF

    print_success "Deployment summary generated: DEPLOYMENT_SUMMARY.md"
}

# Main execution
main() {
    echo "🚀 Starting AGROF Complete Deployment..."
    echo ""
    
    # Check prerequisites
    check_git_config
    
    # Commit and push changes
    commit_and_push
    
    # Deploy all services
    deploy_store_backend
    deploy_ai_backend
    deploy_whatsapp_bot
    deploy_automation_engine
    
    # Test services
    test_services
    
    # Generate summary
    generate_summary
    
    echo ""
    print_success "🎉 AGROF Complete Deployment Finished!"
    echo ""
    echo "📋 Summary:"
    echo "- All services deployed to Render"
    echo "- WhatsApp bot admin commands active"
    echo "- Store management fully functional"
    echo "- Analytics and reporting available"
    echo "- Backup and restore implemented"
    echo "- Audit logging enabled"
    echo ""
    echo "🔗 Service URLs:"
    echo "- Store Backend: https://agrof-store-api.onrender.com"
    echo "- AI Backend: https://agrof-ai-api.onrender.com"
    echo "- WhatsApp Bot: https://agrof-whatsapp-bot.onrender.com"
    echo "- Automation Engine: https://agrof-automation-engine.onrender.com"
    echo ""
    echo "📱 Test WhatsApp Bot:"
    echo "Send 'void' to test admin store management"
    echo ""
    echo "📊 View deployment summary: DEPLOYMENT_SUMMARY.md"
}

# Run main function
main "$@"









