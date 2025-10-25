/**
 * Admin Commands Handler for WhatsApp Bot
 * Handles news management and other admin functions
 */

const fetch = require('node-fetch');

const ADMIN_NUMBERS = (process.env.ADMIN_NUMBERS || '').split(',').map(n => n.trim());
const STORE_API_URL = process.env.STORE_API || 'http://store-backend:3001/api';

class AdminCommandsHandler {
  constructor() {
    this.pendingNews = new Map(); // Store multi-step news creation
  }

  /**
   * Check if sender is admin
   */
  isAdmin(phoneNumber) {
    const cleanNumber = phoneNumber.replace(/[@c.us]/g, '');
    return ADMIN_NUMBERS.some(admin => cleanNumber.includes(admin));
  }

  /**
   * Handle admin commands
   */
  async handleAdminCommand(msg, text) {
    if (!this.isAdmin(msg.from)) {
      await msg.reply('❌ Unauthorized. Admin access required.');
      return true;
    }

    const command = text.toLowerCase().trim();

    // NEWS MANAGEMENT COMMANDS
    if (command.startsWith('admin news') || command.startsWith('#addnews')) {
      await this.startNewsCreation(msg);
      return true;
    }

    if (command.startsWith('#deletenews')) {
      const newsId = command.match(/\d+/)?.[0];
      if (newsId) {
        await this.deleteNews(msg, newsId);
      } else {
        await msg.reply('❌ Usage: #deletenews <id>\nExample: #deletenews 123');
      }
      return true;
    }

    if (command.startsWith('#resolvenews')) {
      const newsId = command.match(/\d+/)?.[0];
      if (newsId) {
        await this.resolveNews(msg, newsId);
      } else {
        await msg.reply('❌ Usage: #resolvenews <id>\nExample: #resolvenews 123');
      }
      return true;
    }

    if (command.startsWith('#listnews')) {
      await this.listNews(msg);
      return true;
    }

    // SELLER REQUEST COMMANDS
    if (command.startsWith('#listsellers') || command.startsWith('#sellerrequests')) {
      await this.listSellerRequests(msg);
      return true;
    }

    if (command.startsWith('#approve')) {
      const requestId = command.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)?.[0];
      if (requestId) {
        await this.approveSellerRequest(msg, requestId);
      } else {
        await msg.reply('❌ Usage: #approve <request-id>\nExample: #approve 286f1293-40e8-466b-922c-ebb903e2823c');
      }
      return true;
    }

    if (command.startsWith('#reject')) {
      const parts = command.split(' ');
      const requestId = parts[1];
      const reason = parts.slice(2).join(' ');
      
      if (requestId) {
        await this.rejectSellerRequest(msg, requestId, reason);
      } else {
        await msg.reply('❌ Usage: #reject <request-id> [reason]\nExample: #reject 286f1293-40e8-466b-922c-ebb903e2823c Missing documents');
      }
      return true;
    }

    if (command.startsWith('#view')) {
      const requestId = command.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)?.[0];
      if (requestId) {
        await this.viewSellerRequest(msg, requestId);
      } else {
        await msg.reply('❌ Usage: #view <request-id>\nExample: #view 286f1293-40e8-466b-922c-ebb903e2823c');
      }
      return true;
    }

    if (command.startsWith('#sellerstats')) {
      await this.getSellerRequestStats(msg);
      return true;
    }

    // General admin help
    if (command === 'admin' || command === 'admin help') {
      await this.sendAdminHelp(msg);
      return true;
    }

    return false;
  }

  /**
   * Start news creation flow
   */
  async startNewsCreation(msg) {
    const help = `📰 *CREATE NEWS ARTICLE*

Send your news in this format:

\`\`\`
Type: fraud
Priority: urgent
Title: Fake DAP Fertilizer Alert
Message: Ministry warns against counterfeit DAP in Kampala markets. Check for authentic seals.
Location: Central
\`\`\`

*Types:* fraud, price, disease, weather, research, general
*Priorities:* urgent, high, medium, low
*Locations:* National, Central, Eastern, Western, Northern

Or use quick format:
\`\`\`
#addnews fraud urgent
Fake Fertilizer Alert
Ministry warns...
\`\`\``;

    await msg.reply(help);
  }

  /**
   * Parse and create news
   */
  async createNews(msg, text) {
    try {
      // Parse news data
      const lines = text.split('\n').filter(l => l.trim());
      
      let type = 'general';
      let priority = 'medium';
      let title = '';
      let message = '';
      let location = 'National';

      // Quick format: #addnews fraud urgent Title\nMessage
      if (text.includes('#addnews')) {
        const parts = text.split('\n');
        const cmdLine = parts[0].split(' ');
        if (cmdLine.length >= 3) {
          type = cmdLine[1];
          priority = cmdLine[2];
        }
        title = parts[1] || 'Alert';
        message = parts.slice(2).join('\n') || parts[1];
      } else {
        // Full format parsing
        for (const line of lines) {
          if (line.toLowerCase().startsWith('type:')) {
            type = line.split(':')[1].trim().toLowerCase();
          } else if (line.toLowerCase().startsWith('priority:')) {
            priority = line.split(':')[1].trim().toLowerCase();
          } else if (line.toLowerCase().startsWith('title:')) {
            title = line.split(':')[1].trim();
          } else if (line.toLowerCase().startsWith('message:')) {
            message = lines.slice(lines.indexOf(line) + 1).join('\n').trim();
            break;
          } else if (line.toLowerCase().startsWith('location:')) {
            location = line.split(':')[1].trim();
          }
        }
      }

      if (!title || !message) {
        await msg.reply('❌ Missing title or message');
        return;
      }

      // Create news via API
      const response = await fetch(`${STORE_API_URL}/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          priority,
          title,
          message,
          location,
          source: 'AGROF Admin',
          created_by: 'whatsapp_admin'
        })
      });

      const result = await response.json();

      if (result.success) {
        const icon = type === 'fraud' ? '⚠️' : 
                    type === 'price' ? '💰' :
                    type === 'disease' ? '🦠' :
                    type === 'weather' ? '🌧️' : '📰';
        
        await msg.reply(`✅ *NEWS CREATED!*

${icon} *${title}*
ID: ${result.id}
Type: ${type}
Priority: ${priority}
Location: ${location}

This news will now appear in the mobile app for all farmers!`);
      } else {
        await msg.reply(`❌ Failed to create news: ${result.error}`);
      }

    } catch (error) {
      console.error('Error creating news:', error);
      await msg.reply(`❌ Error: ${error.message}`);
    }
  }

  /**
   * Delete news
   */
  async deleteNews(msg, newsId) {
    try {
      const response = await fetch(`${STORE_API_URL}/news/${newsId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        await msg.reply(`✅ News article #${newsId} deleted successfully!`);
      } else {
        await msg.reply(`❌ Failed to delete: ${result.error}`);
      }
    } catch (error) {
      await msg.reply(`❌ Error: ${error.message}`);
    }
  }

  /**
   * Resolve news (mark as resolved)
   */
  async resolveNews(msg, newsId) {
    try {
      const response = await fetch(`${STORE_API_URL}/news/${newsId}/resolve`, {
        method: 'PATCH'
      });

      const result = await response.json();

      if (result.success) {
        await msg.reply(`✅ News #${newsId} marked as resolved!`);
      } else {
        await msg.reply(`❌ Failed: ${result.error}`);
      }
    } catch (error) {
      await msg.reply(`❌ Error: ${error.message}`);
    }
  }

  /**
   * List recent news
   */
  async listNews(msg) {
    try {
      const response = await fetch(`${STORE_API_URL}/news?limit=10`);
      const news = await response.json();

      if (news.length === 0) {
        await msg.reply('📰 No active news articles');
        return;
      }

      let list = '*📰 RECENT NEWS*\n\n';
      news.forEach((item, index) => {
        const icon = item.type === 'fraud' ? '⚠️' : 
                    item.type === 'price' ? '💰' :
                    item.type === 'disease' ? '🦠' :
                    item.type === 'weather' ? '🌧️' : '📰';
        
        list += `${index + 1}. ${icon} *${item.title}*\n`;
        list += `   ID: ${item.id} | ${item.priority.toUpperCase()} | ${item.location}\n`;
        list += `   ${item.message.substring(0, 60)}...\n\n`;
      });

      list += `\nCommands:\n#deletenews <id>\n#resolvenews <id>`;

      await msg.reply(list);
    } catch (error) {
      await msg.reply(`❌ Error: ${error.message}`);
    }
  }

  /**
   * List pending seller requests
   */
  async listSellerRequests(msg) {
    try {
      console.log('📋 Fetching pending seller requests...');
      
      const response = await fetch(`${STORE_API_URL}/admin/seller-requests`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': process.env.ADMIN_TOKEN || 'agrof-admin-2024'
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.requests.length > 0) {
        let message = `📋 *PENDING SELLER REQUESTS*\n\n`;
        
        data.requests.forEach((request, index) => {
          message += `${index + 1}. *${request.business_name}*\n`;
          message += `   📧 ${request.contact_email}\n`;
          message += `   📱 ${request.contact_phone}\n`;
          message += `   🏢 ${request.business_address?.city}, ${request.business_address?.district}\n`;
          message += `   🆔 ID: ${request.id}\n`;
          message += `   📅 ${new Date(request.created_at).toLocaleDateString()}\n\n`;
        });
        
        message += `\n*Commands:*\n`;
        message += `• #approve <id> - Approve request\n`;
        message += `• #reject <id> - Reject request\n`;
        message += `• #view <id> - View full details\n`;
        message += `• #sellerstats - View statistics`;
        
        await msg.reply(message);
      } else {
        await msg.reply('✅ No pending seller requests');
      }
    } catch (error) {
      console.error('Error listing seller requests:', error);
      await msg.reply('❌ Error fetching seller requests');
    }
  }

  /**
   * Approve seller request
   */
  async approveSellerRequest(msg, requestId) {
    try {
      console.log(`✅ Approving seller request: ${requestId}`);
      
      const response = await fetch(`${STORE_API_URL}/admin/approve-seller-request`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': process.env.ADMIN_TOKEN || 'agrof-admin-2024'
        },
        body: JSON.stringify({ 
          requestId: requestId,
          adminId: msg.from,
          notes: 'Approved via WhatsApp bot'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await msg.reply(`✅ *SELLER REQUEST APPROVED!*\n\n🆔 Request ID: ${requestId}\n👤 User can now list products\n📱 They'll receive notification`);
      } else {
        await msg.reply(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error approving seller request:', error);
      await msg.reply('❌ Error approving request');
    }
  }

  /**
   * Reject seller request
   */
  async rejectSellerRequest(msg, requestId, reason = '') {
    try {
      console.log(`❌ Rejecting seller request: ${requestId}`);
      
      const response = await fetch(`${STORE_API_URL}/admin/reject-seller-request`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': process.env.ADMIN_TOKEN || 'agrof-admin-2024'
        },
        body: JSON.stringify({ 
          requestId: requestId,
          adminId: msg.from,
          reason: reason || 'Rejected via WhatsApp bot'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await msg.reply(`❌ *SELLER REQUEST REJECTED!*\n\n🆔 Request ID: ${requestId}\n📝 Reason: ${reason || 'Not specified'}\n📱 User will be notified`);
      } else {
        await msg.reply(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error rejecting seller request:', error);
      await msg.reply('❌ Error rejecting request');
    }
  }

  /**
   * View seller request details
   */
  async viewSellerRequest(msg, requestId) {
    try {
      console.log(`📋 Viewing seller request details: ${requestId}`);
      
      const response = await fetch(`${STORE_API_URL}/admin/seller-request/${requestId}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': process.env.ADMIN_TOKEN || 'agrof-admin-2024'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const request = data.request;
        let message = `📋 *SELLER REQUEST DETAILS*\n\n`;
        message += `🆔 *ID:* ${request.id}\n`;
        message += `📧 *Email:* ${request.contact_email}\n`;
        message += `📱 *Phone:* ${request.contact_phone}\n`;
        message += `🏢 *Business:* ${request.business_name}\n`;
        message += `📍 *Location:* ${request.business_address?.city}, ${request.business_address?.district}\n`;
        message += `📄 *License:* ${request.business_license || 'Not provided'}\n`;
        message += `🆔 *Tax ID:* ${request.tax_id || 'Not provided'}\n`;
        message += `📝 *Description:* ${request.business_description || 'Not provided'}\n`;
        message += `📅 *Submitted:* ${new Date(request.created_at).toLocaleString()}\n`;
        message += `📊 *Status:* ${request.status}\n\n`;
        
        message += `*Actions:*\n`;
        message += `• #approve ${request.id} - Approve\n`;
        message += `• #reject ${request.id} - Reject`;
        
        await msg.reply(message);
      } else {
        await msg.reply(`❌ Request not found: ${requestId}`);
      }
    } catch (error) {
      console.error('Error viewing seller request:', error);
      await msg.reply('❌ Error fetching request details');
    }
  }

  /**
   * Get seller request statistics
   */
  async getSellerRequestStats(msg) {
    try {
      console.log('📊 Fetching seller request statistics...');
      
      const response = await fetch(`${STORE_API_URL}/admin/seller-requests/stats`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': process.env.ADMIN_TOKEN || 'agrof-admin-2024'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const stats = data.stats;
        let message = `📊 *SELLER REQUEST STATISTICS*\n\n`;
        message += `⏳ *Pending:* ${stats.pending}\n`;
        message += `✅ *Approved:* ${stats.approved}\n`;
        message += `❌ *Rejected:* ${stats.rejected}\n`;
        message += `🔍 *Under Review:* ${stats.under_review}\n`;
        message += `📈 *Total:* ${stats.total}\n\n`;
        
        if (stats.pending > 0) {
          message += `*Action Required:*\n`;
          message += `• #listsellers - View pending requests\n`;
          message += `• #sellerstats - Refresh statistics`;
        }
        
        await msg.reply(message);
      } else {
        await msg.reply(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error fetching seller request stats:', error);
      await msg.reply('❌ Error fetching statistics');
    }
  }

  /**
   * Send admin help
   */
  async sendAdminHelp(msg) {
    const help = `🔧 *ADMIN COMMANDS*

*NEWS MANAGEMENT:*
\`#addnews\` - Create news article
\`#listnews\` - View all news
\`#deletenews <id>\` - Delete news
\`#resolvenews <id>\` - Mark as resolved

*SELLER REQUESTS:*
\`#listsellers\` - List pending requests
\`#approve <id>\` - Approve request
\`#reject <id> [reason]\` - Reject request
\`#view <id>\` - View request details
\`#sellerstats\` - View statistics

*QUICK NEWS FORMAT:*
\`\`\`
#addnews fraud urgent
Fake Fertilizer Alert
Ministry warns against counterfeit DAP in Kampala
\`\`\`

*FULL NEWS FORMAT:*
\`\`\`
Type: price
Priority: high
Title: Urea Price Reduced
Message: Urea now UGX 35,000 (was 41,000)
Location: National
\`\`\`

*SELLER REQUEST EXAMPLES:*
\`\`\`
#approve 286f1293-40e8-466b-922c-ebb903e2823c
#reject 286f1293-40e8-466b-922c-ebb903e2823c Missing documents
#view 286f1293-40e8-466b-922c-ebb903e2823c
\`\`\`

*NEWS TYPES:*
• fraud - Fake products/scams
• price - Price changes
• disease - Disease outbreaks
• weather - Weather advisories
• research - New research/varieties
• general - General news

*PRIORITIES:*
• urgent - Immediate action needed
• high - Important
• medium - Normal
• low - Informational`;

    await msg.reply(help);
  }

  /**
   * Process admin message (check if it's news creation)
   */
  async processAdminMessage(msg, text) {
    if (!this.isAdmin(msg.from)) return false;

    // Check if message contains news data
    if (text.includes('Type:') && text.includes('Title:') && text.includes('Message:')) {
      await this.createNews(msg, text);
      return true;
    }

    // Check quick format
    if (text.startsWith('#addnews') && text.split('\n').length >= 2) {
      await this.createNews(msg, text);
      return true;
    }

    return false;
  }
}

module.exports = new AdminCommandsHandler();
