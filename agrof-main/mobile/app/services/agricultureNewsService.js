/**
 * Agriculture News Service
 * Fetches and manages agricultural news, alerts, and updates
 */

import { STORE_API_URL } from '../config/apiConfig';

class AgricultureNewsService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Fetch agricultural news
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} News articles
   */
  async fetchNews(options = {}) {
    const { type, priority, location, limit = 50 } = options;
    
    const cacheKey = `news_${type || 'all'}_${priority || 'all'}_${location || 'all'}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        console.log('📰 Using cached news');
        return cached.data;
      }
    }

    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (priority) params.append('priority', priority);
      if (location) params.append('location', location);
      params.append('limit', limit);

      const url = `${STORE_API_URL}/news?${params.toString()}`;
      console.log('📰 Fetching news from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const news = await response.json();
      
      // Add time ago
      const newsWithTime = news.map(item => ({
        ...item,
        timeAgo: this.getTimeAgo(item.created_at)
      }));

      // Cache the results
      this.cache.set(cacheKey, {
        data: newsWithTime,
        timestamp: Date.now()
      });

      console.log(`📰 Fetched ${newsWithTime.length} news articles`);
      return newsWithTime;
    } catch (error) {
      console.error('Error fetching news:', error);
      
      // Return sample data if API fails
      return this.getSampleNews();
    }
  }

  /**
   * Get urgent/high priority news
   */
  async getUrgentNews() {
    return await this.fetchNews({ priority: 'urgent,high', limit: 10 });
  }

  /**
   * Get fraud alerts
   */
  async getFraudAlerts() {
    return await this.fetchNews({ type: 'fraud', limit: 20 });
  }

  /**
   * Get price updates
   */
  async getPriceUpdates() {
    return await this.fetchNews({ type: 'price', limit: 20 });
  }

  /**
   * Get disease alerts
   */
  async getDiseaseAlerts() {
    return await this.fetchNews({ type: 'disease', limit: 20 });
  }

  /**
   * Calculate time ago
   */
  getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 604800)} weeks ago`;
  }

  /**
   * Sample news data for fallback
   */
  getSampleNews() {
    return [
      {
        id: 1,
        type: 'fraud',
        priority: 'urgent',
        title: 'Fake DAP Fertilizer Alert',
        message: 'Ministry of Agriculture warns against counterfeit DAP in Kampala markets.',
        timeAgo: '2 hours ago',
        location: 'Central',
        source: 'Ministry of Agriculture'
      },
      {
        id: 2,
        type: 'price',
        priority: 'high',
        title: 'Urea Price Reduced',
        message: 'Urea fertilizer now UGX 35,000 (was 41,000). Limited stock!',
        timeAgo: 'Today',
        location: 'National',
        source: 'AGROF Store'
      },
      {
        id: 3,
        type: 'disease',
        priority: 'urgent',
        title: 'Fall Armyworm Alert',
        message: 'Fall armyworm detected in Eastern Uganda maize fields. Spray immediately.',
        timeAgo: 'Yesterday',
        location: 'Eastern',
        source: 'Ministry of Agriculture'
      }
    ];
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

export default new AgricultureNewsService();

