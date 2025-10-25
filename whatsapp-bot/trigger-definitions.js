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
        { id: 8, label: '⚡ Bulk operations', action: 'bulk_operations' },
        { id: 9, label: '🚨 Inventory alerts', action: 'inventory_alerts' },
        { id: 10, label: '📊 Analytics', action: 'analytics' },
        { id: 11, label: '📤 Import/Export', action: 'import_export' },
        { id: 12, label: '💾 Backup/Restore', action: 'backup_restore' },
        { id: 13, label: '📋 Audit Logs', action: 'audit_logs' },
        { id: 14, label: '🔔 Notifications', action: 'notifications' },
        { id: 15, label: 'Cancel', action: 'cancel' }
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
          prompt: '*SELECT CATEGORY*\n\n1. Fertilizers\n2. Fungicides\n3. Herbicides\n4. Seeds\n5. Nursery Bed\n6. Organic Chemicals\n7. Tools\n\nReply with number',
          type: 'select',
          options: [
            { id: 1, value: 'fertilizers' },
            { id: 2, value: 'fungicides' },
            { id: 3, value: 'herbicides' },
            { id: 4, value: 'seeds' },
            { id: 5, value: 'nursery_bed' },
            { id: 6, value: 'organic_chemicals' },
            { id: 7, value: 'tools' }
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
      ],
      
      remove_product: [
        {
          step: 'search_product',
          prompt: '*FIND PRODUCT TO REMOVE*\n\nSearch by:\n- Product name (e.g., "Urea")\n- Product ID (e.g., "ID:12345")\n- Type BROWSE to see categories',
          type: 'text',
          dataKey: 'searchQuery'
        },
        {
          step: 'select_product',
          prompt: (data, context) => {
            let msg = '🗑️ *SELECT PRODUCT TO REMOVE*\n\nFound products:\n\n';
            context.products.forEach((p, i) => {
              msg += `${i + 1}️⃣ ${p.name}\n   ID: ${p.id} | Price: ${p.price}\n\n`;
            });
            msg += 'Reply with number or CANCEL';
            return msg;
          },
          type: 'select',
          dataKey: 'productIndex'
        },
        {
          step: 'confirm_delete',
          prompt: (data, context) => {
            const product = context.products[data.productIndex - 1];
            return `⚠️ *CONFIRM DELETION*\n\nProduct: "${product.name}"\nID: ${product.id}\nPrice: ${product.price}\n\nThis will permanently remove the product from the store.\n\nReply YES to delete or NO to cancel`;
          },
          type: 'yes_no'
        }
      ],
      
      update_stock: [
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
              msg += `${i + 1}️⃣ ${p.name}\n   ID: ${p.id} | Stock: ${p.quantity_in_stock || 0}\n\n`;
            });
            msg += 'Reply with number';
            return msg;
          },
          type: 'select',
          dataKey: 'productIndex'
        },
        {
          step: 'enter_new_stock',
          prompt: (data, context) => {
            const product = context.selectedProduct;
            return `📦 *UPDATE STOCK*\n\nProduct: ${product.name}\nCurrent Stock: ${product.quantity_in_stock || 0}\n\nEnter new stock quantity:\n▶ (Just the number, e.g., 100)`;
          },
          type: 'number',
          dataKey: 'newStock',
          validation: (stock) => stock >= 0
        },
        {
          step: 'confirm',
          prompt: (data, context) => {
            const product = context.selectedProduct;
            return `📦 *STOCK UPDATE CONFIRMATION*\n\nProduct: ${product.name}\nOld Stock: ${product.quantity_in_stock || 0}\nNew Stock: ${data.newStock}\n\nConfirm this stock update? (YES/NO)`;
          },
          type: 'yes_no'
        }
      ],
      
      update_description: [
        {
          step: 'search_product',
          prompt: '*FIND PRODUCT*\n\nSearch by:\n- Product name (e.g., "Urea")\n- Product ID (e.g., "ID:12345")\n- Type BROWSE to see categories',
          type: 'text',
          dataKey: 'searchQuery'
        },
        {
          step: 'select_product',
          prompt: (data, context) => {
            let msg = '📝 *SELECT PRODUCT*\n\nFound products:\n\n';
            context.products.forEach((p, i) => {
              msg += `${i + 1}️⃣ ${p.name}\n   ID: ${p.id} | Current: ${p.description || 'No description'}\n\n`;
            });
            msg += 'Reply with number';
            return msg;
          },
          type: 'select',
          dataKey: 'productIndex'
        },
        {
          step: 'enter_new_description',
          prompt: (data, context) => {
            const product = context.selectedProduct;
            return `📝 *UPDATE DESCRIPTION*\n\nProduct: ${product.name}\nCurrent Description: ${product.description || 'No description'}\n\nEnter new description:\n▶ (Send the new description)`;
          },
          type: 'text',
          dataKey: 'newDescription'
        },
        {
          step: 'confirm',
          prompt: (data, context) => {
            const product = context.selectedProduct;
            return `📝 *DESCRIPTION UPDATE CONFIRMATION*\n\nProduct: ${product.name}\nNew Description: "${data.newDescription}"\n\nConfirm this description update? (YES/NO)`;
          },
          type: 'yes_no'
        }
      ],
      
      product_stats: [
        {
          step: 'fetch_stats',
          prompt: '*FETCHING PRODUCT STATISTICS...*',
          action: 'fetch_product_statistics'
        }
      ],
      
      search_product: [
        {
          step: 'enter_search_query',
          prompt: '*SEARCH PRODUCTS*\n\nEnter search term:\n- Product name (e.g., "Urea")\n- Category (e.g., "fertilizers")\n- Type BROWSE to see all categories',
          type: 'text',
          dataKey: 'searchQuery'
        },
        {
          step: 'display_results',
          prompt: (data, context) => {
            let msg = `🔍 *SEARCH RESULTS*\n\nQuery: "${data.searchQuery}"\nFound: ${context.products.length} products\n\n`;
            context.products.forEach((p, i) => {
              msg += `${i + 1}️⃣ ${p.name}\n   ID: ${p.id} | Price: ${p.price}\n   Stock: ${p.quantity_in_stock || 0}\n\n`;
            });
            msg += 'Reply with number to view details or NEW to search again';
            return msg;
          },
          type: 'select',
          dataKey: 'productIndex'
        }
      ],
      
      bulk_operations: [
        {
          step: 'select_operation',
          prompt: '*⚡ BULK OPERATIONS*\n\n1. 📦 Bulk stock update\n2. 💰 Bulk price update\n3. 📝 Bulk description update\n4. 🗑️ Bulk product removal\n5. 📊 Bulk statistics\n\nSelect operation:',
          type: 'select',
          options: [
            { id: 1, value: 'bulk_stock' },
            { id: 2, value: 'bulk_price' },
            { id: 3, value: 'bulk_description' },
            { id: 4, value: 'bulk_remove' },
            { id: 5, value: 'bulk_stats' }
          ],
          dataKey: 'operation'
        },
        {
          step: 'select_category',
          prompt: '*SELECT CATEGORY FOR BULK OPERATION*\n\n1. Fertilizers\n2. Fungicides\n3. Herbicides\n4. Seeds\n5. Nursery Bed\n6. Organic Chemicals\n7. Tools\n8. All Categories\n\nReply with number',
          type: 'select',
          options: [
            { id: 1, value: 'fertilizers' },
            { id: 2, value: 'fungicides' },
            { id: 3, value: 'herbicides' },
            { id: 4, value: 'seeds' },
            { id: 5, value: 'nursery_bed' },
            { id: 6, value: 'organic_chemicals' },
            { id: 7, value: 'tools' },
            { id: 8, value: 'all' }
          ],
          dataKey: 'category'
        },
        {
          step: 'enter_bulk_value',
          prompt: (data, context) => {
            const operation = data.operation;
            if (operation === 'bulk_stock') {
              return '📦 *BULK STOCK UPDATE*\n\nEnter new stock quantity for all products in category:\n▶ (Just the number, e.g., 100)';
            } else if (operation === 'bulk_price') {
              return '💰 *BULK PRICE UPDATE*\n\nEnter new price for all products in category:\n▶ (Just the number, e.g., 50000)';
            } else if (operation === 'bulk_description') {
              return '📝 *BULK DESCRIPTION UPDATE*\n\nEnter new description for all products in category:\n▶ (Send the new description)';
            }
            return 'Enter value:';
          },
          type: 'text',
          dataKey: 'bulkValue'
        },
        {
          step: 'confirm_bulk',
          prompt: (data, context) => {
            const operation = data.operation;
            const category = data.category;
            const value = data.bulkValue;
            
            let msg = `⚠️ *BULK OPERATION CONFIRMATION*\n\n`;
            msg += `Operation: ${operation}\n`;
            msg += `Category: ${category}\n`;
            msg += `Value: ${value}\n\n`;
            msg += `This will affect ALL products in the selected category.\n\nConfirm? (YES/NO)`;
            return msg;
          },
          type: 'yes_no'
        }
      ],
      
      inventory_alerts: [
        {
          step: 'fetch_alerts',
          prompt: '*🚨 FETCHING INVENTORY ALERTS...*',
          action: 'fetch_inventory_alerts'
        }
      ],
      
      analytics: [
        {
          step: 'select_analytics',
          prompt: '*📊 ANALYTICS DASHBOARD*\n\n1. 📈 Sales analytics\n2. 📦 Inventory analytics\n3. 💰 Pricing analytics\n4. 🔍 Search analytics\n5. 📊 Full report\n\nSelect analytics:',
          type: 'select',
          options: [
            { id: 1, value: 'sales' },
            { id: 2, value: 'inventory' },
            { id: 3, value: 'pricing' },
            { id: 4, value: 'search' },
            { id: 5, value: 'full' }
          ],
          dataKey: 'analyticsType'
        }
      ],
      
      import_export: [
        {
          step: 'select_operation',
          prompt: '*📤 IMPORT/EXPORT*\n\n1. 📥 Import products from CSV\n2. 📤 Export products to CSV\n3. 📋 Export inventory report\n4. 📊 Export analytics report\n5. 🔄 Sync with external system\n\nSelect operation:',
          type: 'select',
          options: [
            { id: 1, value: 'import_csv' },
            { id: 2, value: 'export_csv' },
            { id: 3, value: 'export_inventory' },
            { id: 4, value: 'export_analytics' },
            { id: 5, value: 'sync_external' }
          ],
          dataKey: 'operation'
        },
        {
          step: 'select_category',
          prompt: '*SELECT CATEGORY FOR EXPORT*\n\n1. Fertilizers\n2. Fungicides\n3. Herbicides\n4. Seeds\n5. Nursery Bed\n6. Organic Chemicals\n7. Tools\n8. All Categories\n\nReply with number',
          type: 'select',
          options: [
            { id: 1, value: 'fertilizers' },
            { id: 2, value: 'fungicides' },
            { id: 3, value: 'herbicides' },
            { id: 4, value: 'seeds' },
            { id: 5, value: 'nursery_bed' },
            { id: 6, value: 'organic_chemicals' },
            { id: 7, value: 'tools' },
            { id: 8, value: 'all' }
          ],
          dataKey: 'category'
        },
        {
          step: 'confirm_export',
          prompt: (data, context) => {
            const operation = data.operation;
            const category = data.category;
            
            let msg = `📤 *EXPORT CONFIRMATION*\n\n`;
            msg += `Operation: ${operation}\n`;
            msg += `Category: ${category}\n\n`;
            msg += `This will generate a downloadable file with the selected data.\n\nConfirm? (YES/NO)`;
            return msg;
          },
          type: 'yes_no'
        }
      ],
      
      backup_restore: [
        {
          step: 'select_operation',
          prompt: '*💾 BACKUP/RESTORE*\n\n1. 💾 Create backup\n2. 📥 Restore from backup\n3. 📋 List backups\n4. 🗑️ Delete backup\n5. 🔄 Auto backup settings\n\nSelect operation:',
          type: 'select',
          options: [
            { id: 1, value: 'create_backup' },
            { id: 2, value: 'restore_backup' },
            { id: 3, value: 'list_backups' },
            { id: 4, value: 'delete_backup' },
            { id: 5, value: 'auto_backup' }
          ],
          dataKey: 'operation'
        },
        {
          step: 'backup_name',
          prompt: (data, context) => {
            if (data.operation === 'create_backup') {
              return '💾 *CREATE BACKUP*\n\nEnter backup name:\n▶ (e.g., "backup_2024_01_15")';
            } else if (data.operation === 'restore_backup') {
              return '📥 *RESTORE BACKUP*\n\nEnter backup name to restore:\n▶ (e.g., "backup_2024_01_15")';
            }
            return 'Enter name:';
          },
          type: 'text',
          dataKey: 'backupName'
        },
        {
          step: 'confirm_backup',
          prompt: (data, context) => {
            const operation = data.operation;
            const backupName = data.backupName;
            
            let msg = `💾 *BACKUP OPERATION CONFIRMATION*\n\n`;
            msg += `Operation: ${operation}\n`;
            msg += `Backup Name: ${backupName}\n\n`;
            if (operation === 'create_backup') {
              msg += `This will create a complete backup of the database.\n\nConfirm? (YES/NO)`;
            } else if (operation === 'restore_backup') {
              msg += `⚠️ This will replace the current database with the backup.\n\nConfirm? (YES/NO)`;
            }
            return msg;
          },
          type: 'yes_no'
        }
      ],
      
      audit_logs: [
        {
          step: 'select_log_type',
          prompt: '*📋 AUDIT LOGS*\n\n1. 📊 View all logs\n2. 🔍 Search logs\n3. 📅 Filter by date\n4. 👤 Filter by user\n5. 🔧 Filter by operation\n\nSelect log type:',
          type: 'select',
          options: [
            { id: 1, value: 'view_all' },
            { id: 2, value: 'search_logs' },
            { id: 3, value: 'filter_date' },
            { id: 4, value: 'filter_user' },
            { id: 5, value: 'filter_operation' }
          ],
          dataKey: 'logType'
        },
        {
          step: 'enter_search_term',
          prompt: (data, context) => {
            const logType = data.logType;
            if (logType === 'search_logs') {
              return '🔍 *SEARCH LOGS*\n\nEnter search term:\n▶ (e.g., "product", "price", "stock")';
            } else if (logType === 'filter_date') {
              return '📅 *FILTER BY DATE*\n\nEnter date (YYYY-MM-DD):\n▶ (e.g., "2024-01-15")';
            } else if (logType === 'filter_user') {
              return '👤 *FILTER BY USER*\n\nEnter user ID or phone number:\n▶ (e.g., "0743232441")';
            } else if (logType === 'filter_operation') {
              return '🔧 *FILTER BY OPERATION*\n\nEnter operation type:\n▶ (e.g., "add_product", "update_price")';
            }
            return 'Enter search term:';
          },
          type: 'text',
          dataKey: 'searchTerm'
        }
      ],
      
      notifications: [
        {
          step: 'select_notification_type',
          prompt: '*🔔 NOTIFICATIONS*\n\n1. 📊 View notification settings\n2. 🔔 Enable/disable alerts\n3. 📱 Test notification\n4. 📋 View notification history\n5. ⚙️ Configure auto-notifications\n\nSelect notification type:',
          type: 'select',
          options: [
            { id: 1, value: 'view_settings' },
            { id: 2, value: 'toggle_alerts' },
            { id: 3, value: 'test_notification' },
            { id: 4, value: 'view_history' },
            { id: 5, value: 'configure_auto' }
          ],
          dataKey: 'notificationType'
        },
        {
          step: 'configure_auto_notifications',
          prompt: (data, context) => {
            const notificationType = data.notificationType;
            if (notificationType === 'configure_auto') {
              return '⚙️ *CONFIGURE AUTO-NOTIFICATIONS*\n\n1. 📦 Low stock alerts\n2. ❌ Out of stock alerts\n3. 📊 Daily inventory reports\n4. 🔔 Price change alerts\n5. 📈 Weekly analytics\n\nSelect notification to configure:';
            }
            return 'Select option:';
          },
          type: 'select',
          options: [
            { id: 1, value: 'low_stock_alerts' },
            { id: 2, value: 'out_of_stock_alerts' },
            { id: 3, value: 'daily_reports' },
            { id: 4, value: 'price_alerts' },
            { id: 5, value: 'weekly_analytics' }
          ],
          dataKey: 'alertType'
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
  },

  // ⚡ NEXUS - Workflow Management
  nexus: {
    name: 'Workflow Control',
    description: 'Manage automation workflows and processes',
    
    mainMenu: {
      title: '*NEXUS - WORKFLOW CONTROL*',
      subtitle: 'Manage automation workflows and processes',
      options: [
        { id: 1, label: 'View all workflows', action: 'list_workflows' },
        { id: 2, label: 'Create new workflow', action: 'create_workflow' },
        { id: 3, label: 'Edit workflow', action: 'edit_workflow' },
        { id: 4, label: 'Start workflow', action: 'start_workflow' },
        { id: 5, label: 'Stop workflow', action: 'stop_workflow' },
        { id: 6, label: 'Workflow analytics', action: 'workflow_analytics' },
        { id: 7, label: 'Cancel', action: 'cancel' }
      ]
    },
    
    flows: {
      list_workflows: [
        {
          step: 'fetch_workflows',
          prompt: '*FETCHING WORKFLOWS...*',
          action: 'fetch_workflows'
        }
      ],
      
      create_workflow: [
        {
          step: 'enter_name',
          prompt: '*ENTER WORKFLOW NAME*',
          placeholder: 'e.g., Daily Stock Check',
          dataKey: 'name'
        },
        {
          step: 'select_trigger',
          prompt: '*SELECT TRIGGER TYPE*',
          options: [
            { id: 1, value: 'schedule', label: 'Scheduled (Time-based)' },
            { id: 2, value: 'webhook', label: 'Webhook (API call)' },
            { id: 3, value: 'event', label: 'Event (Database change)' },
            { id: 4, value: 'manual', label: 'Manual (Admin trigger)' }
          ],
          dataKey: 'trigger'
        },
        {
          step: 'enter_description',
          prompt: '*ENTER WORKFLOW DESCRIPTION*',
          placeholder: 'Describe what this workflow does',
          dataKey: 'description'
        },
        {
          step: 'confirm_creation',
          prompt: '*CONFIRM WORKFLOW CREATION*',
          action: 'create_workflow'
        }
      ],
      
      start_workflow: [
        {
          step: 'select_workflow',
          prompt: '*SELECT WORKFLOW TO START*',
          action: 'list_workflows_for_start'
        },
        {
          step: 'confirm_start',
          prompt: '*CONFIRM WORKFLOW START*',
          action: 'start_workflow'
        }
      ],
      
      stop_workflow: [
        {
          step: 'select_workflow',
          prompt: '*SELECT WORKFLOW TO STOP*',
          action: 'list_active_workflows'
        },
        {
          step: 'confirm_stop',
          prompt: '*CONFIRM WORKFLOW STOP*',
          action: 'stop_workflow'
        }
      ],
      
      workflow_analytics: [
        {
          step: 'fetch_analytics',
          prompt: '*FETCHING WORKFLOW ANALYTICS...*',
          action: 'fetch_workflow_analytics'
        }
      ]
    }
  }
};

