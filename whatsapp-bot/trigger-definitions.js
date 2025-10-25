/**
 * Trigger Definitions
 * Defines all secret trigger words and their conversation flows
 */

module.exports = {
  
  // GODEYE - News & Alerts Management
  godeye: {
    name: 'News Control',
    description: 'Manage agricultural news, alerts, and announcements',
    
    mainMenu: {
      title: '*GODEYE - NEWS CONTROL*',
      subtitle: 'Manage agricultural news and alerts',
      options: [
        { id: 1, label: 'Create new news/alert', action: 'create_news' },
        { id: 2, label: 'View all active news', action: 'list_news' },
        { id: 3, label: 'Delete old news', action: 'delete_news' },
        { id: 4, label: 'Mark news as resolved', action: 'resolve_news' },
        { id: 5, label: 'News analytics', action: 'news_analytics' },
        { id: 6, label: 'Cancel', action: 'cancel' }
      ]
    },
    
    flows: {
      create_news: [
        {
          step: 'select_type',
          prompt: '*SELECT NEWS TYPE*',
          options: [
            { id: 1, value: 'fraud', label: 'Fraud Alert (Fake products/scams)' },
            { id: 2, value: 'price', label: 'Price Update (Price changes)' },
            { id: 3, value: 'disease', label: 'Disease Alert (Outbreak warnings)' },
            { id: 4, value: 'weather', label: 'Weather Advisory' },
            { id: 5, value: 'research', label: 'Research Update' },
            { id: 6, value: 'general', label: 'General News' }
          ],
          dataKey: 'type'
        },
        {
          step: 'select_priority',
          prompt: '*SELECT PRIORITY*',
          options: [
            { id: 1, value: 'urgent', label: 'URGENT (Immediate action needed)' },
            { id: 2, value: 'high', label: 'HIGH (Important)' },
            { id: 3, value: 'medium', label: 'MEDIUM (Normal)' },
            { id: 4, value: 'low', label: 'LOW (Informational)' }
          ],
          dataKey: 'priority'
        },
        {
          step: 'enter_title',
          prompt: '*ENTER TITLE*\n\nProvide a clear, concise title:\n(Send the title)',
          type: 'text',
          dataKey: 'title',
          validation: (text) => text.length >= 5 && text.length <= 100
        },
        {
          step: 'enter_message',
          prompt: '*ENTER MESSAGE*\n\nProvide the full message/description:\n(Send the detailed message)',
          type: 'text',
          dataKey: 'message',
          validation: (text) => text.length >= 10
        },
        {
          step: 'select_location',
          prompt: '*SELECT LOCATION*\n\nWhere does this apply?',
          options: [
            { id: 1, value: 'National', label: 'National (All Uganda)' },
            { id: 2, value: 'Central', label: 'Central Region' },
            { id: 3, value: 'Eastern', label: 'Eastern Region' },
            { id: 4, value: 'Western', label: 'Western Region' },
            { id: 5, value: 'Northern', label: 'Northern Region' }
          ],
          dataKey: 'location'
        },
        {
          step: 'confirm',
          prompt: (data) => `*CONFIRMATION*\n\nType: ${data.type}\nPriority: ${data.priority}\nLocation: ${data.location}\n\nTitle:\n"${data.title}"\n\nMessage:\n"${data.message}"\n\nReply YES to publish or NO to cancel`,
          type: 'yes_no'
        }
      ],
      
      delete_news: [
        {
          step: 'fetch_news_list',
          prompt: '📋 Fetching active news...',
          type: 'auto',
          action: 'fetch_news'
        },
        {
          step: 'select_news',
          prompt: (context) => {
            let msg = '🗑️ *DELETE NEWS*\n\nSelect news to delete:\n\n';
            context.newsList.forEach((news, index) => {
              msg += `${index + 1}️⃣ ${news.title}\n   ID: ${news.id} | ${news.priority}\n\n`;
            });
            msg += 'Reply with number or CANCEL';
            return msg;
          },
          type: 'select',
          dataKey: 'newsIndex'
        },
        {
          step: 'confirm_delete',
          prompt: (data, context) => {
            const news = context.newsList[data.newsIndex - 1];
            return `⚠️ *CONFIRM DELETION*\n\nTitle: "${news.title}"\nID: ${news.id}\n\nThis will remove the news from farmers' apps.\n\nReply YES to delete or NO to cancel`;
          },
          type: 'yes_no'
        }
      ]
    }
  },

  // VOID - Store Management
  void: {
    name: 'Store Control',
    description: 'Manage products, prices, and inventory',
    
    mainMenu: {
      title: '*VOID - STORE CONTROL*',
      subtitle: 'Product and inventory management',
      options: [
        { id: 1, label: 'Add new product', action: 'add_product' },
        { id: 2, label: 'Remove product', action: 'remove_product' },
        { id: 3, label: 'Update price', action: 'update_price' },
        { id: 4, label: 'Update stock', action: 'update_stock' },
        { id: 5, label: 'Update description', action: 'update_description' },
        { id: 6, label: 'View product stats', action: 'product_stats' },
        { id: 7, label: 'Search product', action: 'search_product' },
        { id: 8, label: 'Cancel', action: 'cancel' }
      ]
    },
    
    flows: {
      update_price: [
        {
          step: 'search_product',
          prompt: '*FIND PRODUCT*\n\nSearch by:\n- Product name (e.g., "Urea")\n- Product ID (e.g., "ID:12345")\n- Type BROWSE to see categories',
          type: 'text',
          dataKey: 'searchQuery'
        },
        {
          step: 'select_product',
          prompt: (data, context) => {
            let msg = '📦 *SELECT PRODUCT*\n\nFound products:\n\n';
            context.products.forEach((p, i) => {
              msg += `${i + 1}️⃣ ${p.name}\n   ID: ${p.id} | Current: ${p.price}\n\n`;
            });
            msg += 'Reply with number';
            return msg;
          },
          type: 'select',
          dataKey: 'productIndex'
        },
        {
          step: 'enter_new_price',
          prompt: (data, context) => {
            const product = context.selectedProduct;
            return `💰 *UPDATE PRICE*\n\nProduct: ${product.name}\nCurrent: ${product.price}\n\nEnter new price:\n▶ (Just the number, e.g., 38000)`;
          },
          type: 'number',
          dataKey: 'newPrice',
          validation: (price) => price > 0
        },
        {
          step: 'announce_option',
          prompt: (data, context) => {
            const product = context.selectedProduct;
            const oldPrice = parseInt(product.price.replace(/\D/g, ''));
            const newPrice = data.newPrice;
            const change = newPrice - oldPrice;
            const changePercent = ((change / oldPrice) * 100).toFixed(1);
            
            return `📊 *PRICE CHANGE SUMMARY*\n\nProduct: ${product.name}\nOld: UGX ${oldPrice.toLocaleString()}\nNew: UGX ${newPrice.toLocaleString()}\nChange: ${change > 0 ? '+' : ''}UGX ${change.toLocaleString()} (${changePercent}%)\n\nAnnounce to farmers?\n\n1️⃣ YES - Update & create news alert\n2️⃣ NO - Silent update only\n3️⃣ CANCEL`;
          },
          type: 'select',
          dataKey: 'announce'
        },
        {
          step: 'confirm',
          prompt: 'Confirm this price change? (YES/NO)',
          type: 'yes_no'
        }
      ],
      
      add_product: [
        {
          step: 'select_category',
          prompt: '*SELECT CATEGORY*\n\n1. Fertilizers\n2. Fungicides\n3. Herbicides\n4. Seeds\n5. Nursery Bed\n6. Organic Chemicals\n\nReply with number',
          type: 'select',
          options: [
            { id: 1, value: 'fertilizers' },
            { id: 2, value: 'fungicides' },
            { id: 3, value: 'herbicides' },
            { id: 4, value: 'seeds' },
            { id: 5, value: 'nursery_bed' },
            { id: 6, value: 'organic_chemicals' }
          ],
          dataKey: 'category'
        },
        {
          step: 'enter_name',
          prompt: '*PRODUCT NAME*\n\nEnter product name:\n(e.g., "Maxim F1 Tomato Seeds")',
          type: 'text',
          dataKey: 'name'
        },
        {
          step: 'enter_price',
          prompt: '*PRODUCT PRICE*\n\nEnter price in UGX:\n(e.g., 35000)',
          type: 'number',
          dataKey: 'price'
        },
        {
          step: 'enter_stock',
          prompt: '*STOCK QUANTITY*\n\nEnter quantity in stock:\n(e.g., 100)',
          type: 'number',
          dataKey: 'stock'
        },
        {
          step: 'enter_description',
          prompt: '*DESCRIPTION* (Optional)\n\nEnter product description:\nOr type SKIP',
          type: 'text',
          dataKey: 'description',
          optional: true
        },
        {
          step: 'upload_image',
          prompt: '📸 *PRODUCT IMAGE* (Optional)\n\nSend a product image:\n▶ Or type SKIP to use category default\n\n💡 Tip: Take a clear photo of the product packaging',
          type: 'image',
          dataKey: 'image',
          optional: true
        },
        {
          step: 'confirm',
          prompt: (data) => `*CONFIRM NEW PRODUCT*\n\nCategory: ${data.category}\nName: ${data.name}\nPrice: UGX ${data.price.toLocaleString()}\nStock: ${data.stock}\nDescription: ${data.description || 'None'}\nImage: ${data.image ? 'Provided' : 'Using default'}\n\nConfirm? (YES/NO)`,
          type: 'yes_no'
        }
      ]
    }
  },

  // ✨ DESTINY - Market/P2P Management
  destiny: {
    name: 'Market Control',
    icon: '✨',
    description: 'Manage P2P marketplace and broker deals',
    
    mainMenu: {
      title: '✨ *DESTINY - MARKET CONTROL*',
      subtitle: 'P2P Marketplace Management',
      options: [
        { id: 1, label: '👥 View buyer requests', action: 'view_buyers' },
        { id: 2, label: '🌾 View seller listings', action: 'view_sellers' },
        { id: 3, label: '🤝 View pending deals', action: 'view_deals' },
        { id: 4, label: '➕ Add new crop type', action: 'add_crop' },
        { id: 5, label: '✅ Approve listing', action: 'approve_listing' },
        { id: 6, label: '❌ Remove listing', action: 'remove_listing' },
        { id: 7, label: '📊 Market stats', action: 'market_stats' },
        { id: 8, label: '🚫 Cancel', action: 'cancel' }
      ]
    },
    
    flows: {
      add_crop: [
        {
          step: 'enter_crop_name',
          prompt: '🌾 *ADD NEW CROP*\n\nEnter crop name:\n▶ (e.g., "Pineapple", "Passion Fruit")',
          type: 'text',
          dataKey: 'cropName'
        },
        {
          step: 'enter_description',
          prompt: '*CROP DESCRIPTION*\n\nEnter description (optional):\nOr type SKIP',
          type: 'text',
          dataKey: 'description',
          optional: true
        },
        {
          step: 'confirm',
          prompt: (data) => `*CONFIRM*\n\nCrop: ${data.cropName}\nDescription: ${data.description || 'None'}\n\nAdd to marketplace? (YES/NO)`,
          type: 'yes_no'
        }
      ]
    }
  },

  // 🔮 ORACLE - Analytics & Reports
  oracle: {
    name: 'Analytics Portal',
    icon: '🔮',
    description: 'View sales, stats, and reports',
    
    mainMenu: {
      title: '🔮 *ORACLE - ANALYTICS PORTAL*',
      subtitle: 'Business intelligence and reports',
      options: [
        { id: 1, label: '📊 Sales summary', action: 'sales_summary' },
        { id: 2, label: '🔝 Top products', action: 'top_products' },
        { id: 3, label: '📦 Low stock alerts', action: 'low_stock' },
        { id: 4, label: '👥 Customer stats', action: 'customer_stats' },
        { id: 5, label: '💰 Revenue breakdown', action: 'revenue_breakdown' },
        { id: 6, label: '📰 News engagement', action: 'news_engagement' },
        { id: 7, label: '🌾 AI Planner usage', action: 'planner_stats' },
        { id: 8, label: '🚫 Cancel', action: 'cancel' }
      ]
    },
    
    flows: {
      sales_summary: [
        {
          step: 'select_period',
          prompt: '*SELECT PERIOD*\n\n1. Today\n2. This Week\n3. This Month\n4. Custom Range',
          type: 'select',
          dataKey: 'period'
        }
      ]
    }
  },

  // 🛡️ GUARDIAN - Customer Management
  guardian: {
    name: 'Customer Management',
    icon: '🛡️',
    description: 'Manage customers and orders',
    
    mainMenu: {
      title: '🛡️ *GUARDIAN - CUSTOMER MANAGEMENT*',
      subtitle: 'Customer support and management',
      options: [
        { id: 1, label: '👥 View all customers', action: 'list_customers' },
        { id: 2, label: '🔍 Search customer', action: 'search_customer' },
        { id: 3, label: '📦 Recent orders', action: 'recent_orders' },
        { id: 4, label: '💬 Send message to customer', action: 'message_customer' },
        { id: 5, label: '📊 Customer analytics', action: 'customer_analytics' },
        { id: 6, label: '🚫 Cancel', action: 'cancel' }
      ]
    }
  },

  // 🔥 PHOENIX - System Control
  phoenix: {
    name: 'System Operations',
    icon: '🔥',
    description: 'Restart services, maintenance',
    
    mainMenu: {
      title: '🔥 *PHOENIX - SYSTEM CONTROL*',
      subtitle: '⚠️ Advanced system operations',
      options: [
        { id: 1, label: '🔄 Restart store backend', action: 'restart_store' },
        { id: 2, label: '🔄 Restart automation engine', action: 'restart_automation' },
        { id: 3, label: '🧹 Clear caches', action: 'clear_cache' },
        { id: 4, label: '❤️ System health check', action: 'health_check' },
        { id: 5, label: '📋 View error logs', action: 'view_logs' },
        { id: 6, label: '💾 Database backup', action: 'backup_db' },
        { id: 7, label: '🚫 Cancel', action: 'cancel' }
      ]
    }
  },

  // ⚡ NEXUS - Automation Control
  nexus: {
    name: 'Automation Control',
    icon: '⚡',
    description: 'Manage workflows and automations',
    
    mainMenu: {
      title: '⚡ *NEXUS - AUTOMATION CONTROL*',
      subtitle: 'Workflow and automation management',
      options: [
        { id: 1, label: '📋 View active workflows', action: 'list_workflows' },
        { id: 2, label: '▶️ Start workflow', action: 'start_workflow' },
        { id: 3, label: '⏸️ Pause workflow', action: 'pause_workflow' },
        { id: 4, label: '📊 Workflow analytics', action: 'workflow_analytics' },
        { id: 5, label: '🔧 Workflow settings', action: 'workflow_settings' },
        { id: 6, label: '🚫 Cancel', action: 'cancel' }
      ]
    }
  },

  // CLOUD - User Activation Management
  cloud: {
    name: 'User Activation',
    description: 'Activate pending buyer/seller registrations',
    
    mainMenu: {
      title: '*CLOUD - USER ACTIVATION*',
      subtitle: 'Manage pending user registrations',
      options: [
        { id: 1, label: 'View pending buyers', action: 'list_pending_buyers' },
        { id: 2, label: 'View pending sellers', action: 'list_pending_sellers' },
        { id: 3, label: 'View all pending', action: 'list_all_pending' },
        { id: 4, label: 'Activate user', action: 'activate_user' },
        { id: 5, label: 'Reject user', action: 'reject_user' },
        { id: 6, label: 'User statistics', action: 'user_stats' },
        { id: 7, label: 'Cancel', action: 'cancel' }
      ]
    },
    
    flows: {
      list_pending_buyers: [
        {
          step: 'fetch_buyers',
          prompt: '*FETCHING PENDING BUYERS...*',
          action: 'fetch_pending_buyers'
        }
      ],
      
      list_pending_sellers: [
        {
          step: 'fetch_sellers', 
          prompt: '*FETCHING PENDING SELLERS...*',
          action: 'fetch_pending_sellers'
        }
      ],
      
      list_all_pending: [
        {
          step: 'fetch_all',
          prompt: '*FETCHING ALL PENDING REGISTRATIONS...*',
          action: 'fetch_all_pending'
        }
      ],
      
      activate_user: [
        {
          step: 'select_user_type',
          prompt: '*SELECT USER TYPE*',
          options: [
            { id: 1, value: 'buyer', label: 'Buyer Registration' },
            { id: 2, value: 'seller', label: 'Seller Registration' }
          ],
          dataKey: 'userType'
        },
        {
          step: 'enter_user_id',
          prompt: '*ENTER USER ID TO ACTIVATE*',
          placeholder: 'User ID (from pending list)',
          dataKey: 'userId'
        },
        {
          step: 'confirm_activation',
          prompt: '*CONFIRM USER ACTIVATION*',
          action: 'activate_user'
        }
      ],
      
      reject_user: [
        {
          step: 'select_user_type',
          prompt: '*SELECT USER TYPE*',
          options: [
            { id: 1, value: 'buyer', label: 'Buyer Registration' },
            { id: 2, value: 'seller', label: 'Seller Registration' }
          ],
          dataKey: 'userType'
        },
        {
          step: 'enter_user_id',
          prompt: '*ENTER USER ID TO REJECT*',
          placeholder: 'User ID (from pending list)',
          dataKey: 'userId'
        },
        {
          step: 'enter_reason',
          prompt: '*ENTER REJECTION REASON*',
          placeholder: 'Reason for rejection (optional)',
          dataKey: 'reason'
        },
        {
          step: 'confirm_rejection',
          prompt: '*CONFIRM USER REJECTION*',
          action: 'reject_user'
        }
      ],
      
      user_stats: [
        {
          step: 'fetch_stats',
          prompt: '*FETCHING USER STATISTICS...*',
          action: 'fetch_user_statistics'
        }
      ]
    }
  }
};

