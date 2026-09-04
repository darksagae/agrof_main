/**
 * Offline Chatbot Service - AGROF
 * Rule-based chatbot using keyword matching and pre-written responses
 * Works 100% offline without API calls
 */

import knowledgeBase from '../data/offline/chatbotKnowledge.json';

class OfflineChatbotService {
  constructor() {
    this.knowledge = knowledgeBase.entries || [];
    this.conversationHistory = [];
    this.initialized = false;
  }

  /**
   * Initialize chatbot
   */
  initialize() {
    if (this.initialized) return;
    
    console.log(`🤖 Offline Chatbot initialized: ${this.knowledge.length} Q&As available`);
    this.initialized = true;
  }

  /**
   * Process user message and generate response
   */
  async sendMessage(message, context = {}) {
    this.initialize();

    const cleanMessage = message.trim().toLowerCase();
    
    if (cleanMessage.length === 0) {
      return {
        success: true,
        message: "Please ask me a question about farming, crop diseases, pests, or products!",
        source: 'offline',
        confidence: 'high'
      };
    }

    // Search knowledge base
    const matches = this.searchKnowledge(cleanMessage);

    if (matches.length > 0) {
      // Found matches - return best match
      const bestMatch = matches[0];
      
      // Save to conversation history
      this.conversationHistory.push({
        user: message,
        bot: bestMatch.answer,
        timestamp: Date.now()
      });

      return {
        success: true,
        message: bestMatch.answer,
        source: 'offline',
        confidence: bestMatch.confidence,
        relatedProducts: bestMatch.relatedProducts,
        category: bestMatch.category,
        crop: bestMatch.crop,
        matchedKeywords: bestMatch.matchedKeywords
      };
    }

    // No match found - provide helpful response
    return this.handleNoMatch(cleanMessage, context);
  }

  /**
   * Search knowledge base for matching entries
   */
  searchKnowledge(query) {
    const queryWords = query.split(/\s+/);
    const matches = [];

    this.knowledge.forEach(entry => {
      let score = 0;
      const matchedKeywords = [];

      // Check keywords
      entry.keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        
        // Exact keyword match in query
        if (query.includes(keywordLower)) {
          score += 10;
          matchedKeywords.push(keyword);
        }
        
        // Individual word matches
        queryWords.forEach(word => {
          if (word.length > 2 && keywordLower.includes(word)) {
            score += 5;
          }
        });
      });

      // Check question text
      const questionLower = entry.question.toLowerCase();
      queryWords.forEach(word => {
        if (word.length > 2 && questionLower.includes(word)) {
          score += 3;
        }
      });

      if (score > 0) {
        matches.push({
          ...entry,
          score,
          matchedKeywords
        });
      }
    });

    // Sort by score (highest first)
    matches.sort((a, b) => b.score - a.score);

    console.log(`🔍 Found ${matches.length} matches for: "${query}"`);
    if (matches.length > 0) {
      console.log(`✅ Best match: "${matches[0].question}" (score: ${matches[0].score})`);
    }

    return matches;
  }

  /**
   * Handle case when no match is found
   */
  handleNoMatch(query, context) {
    // Try to suggest related topics
    const suggestions = this.getSuggestions(query);

    let message = "I don't have specific information about that in my offline database.\n\n";

    if (suggestions.length > 0) {
      message += "Did you mean to ask about:\n";
      suggestions.slice(0, 3).forEach((suggestion, index) => {
        message += `${index + 1}. ${suggestion.question}\n`;
      });
      message += "\n";
    }

    message += "💡 Tips:\n";
    message += "• Connect to WiFi for AI-powered answers\n";
    message += "• Try browsing our product catalog\n";
    message += "• Ask about: diseases, pests, fertilizers, planting\n\n";
    message += "🔥 Popular questions:\n";
    message += "• Why are my tomato leaves yellow?\n";
    message += "• How do I control aphids?\n";
    message += "• What fertilizer for maize?\n";
    message += "• When to plant beans?";

    return {
      success: true,
      message,
      source: 'offline',
      confidence: 'low',
      suggestions: suggestions.slice(0, 3).map(s => s.question),
      needsOnline: true
    };
  }

  /**
   * Get suggestions based on partial matches
   */
  getSuggestions(query) {
    const queryWords = query.split(/\s+/).filter(w => w.length > 2);
    const suggestions = [];

    this.knowledge.forEach(entry => {
      let score = 0;

      queryWords.forEach(word => {
        // Check if any keyword contains this word
        entry.keywords.forEach(keyword => {
          if (keyword.toLowerCase().includes(word)) {
            score += 2;
          }
        });

        // Check category and crop
        if (entry.category.includes(word)) score += 3;
        if (entry.crop && entry.crop.includes(word)) score += 3;
      });

      if (score > 0) {
        suggestions.push({
          ...entry,
          score
        });
      }
    });

    suggestions.sort((a, b) => b.score - a.score);
    return suggestions;
  }

  /**
   * Get popular/frequently asked questions
   */
  getPopularQuestions(limit = 10) {
    // Return top questions from each category
    const categories = ['diseases', 'nutrients', 'pests', 'farming', 'products'];
    const popular = [];

    categories.forEach(category => {
      const categoryEntries = this.knowledge.filter(e => e.category === category);
      if (categoryEntries.length > 0) {
        popular.push(...categoryEntries.slice(0, 2)); // 2 per category
      }
    });

    return popular.slice(0, limit).map(entry => ({
      id: entry.id,
      question: entry.question,
      category: entry.category,
      crop: entry.crop
    }));
  }

  /**
   * Get questions by category
   */
  getQuestionsByCategory(category) {
    return this.knowledge
      .filter(e => e.category === category)
      .map(entry => ({
        id: entry.id,
        question: entry.question,
        crop: entry.crop,
        keywords: entry.keywords
      }));
  }

  /**
   * Get questions by crop
   */
  getQuestionsByCrop(crop) {
    const cropLower = crop.toLowerCase();
    return this.knowledge
      .filter(e => e.crop && e.crop.toLowerCase() === cropLower)
      .map(entry => ({
        id: entry.id,
        question: entry.question,
        category: entry.category
      }));
  }

  /**
   * Get conversation history
   */
  getHistory() {
    return this.conversationHistory;
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
    console.log('🗑️ Conversation history cleared');
  }

  /**
   * Get chatbot statistics
   */
  getStats() {
    const byCategory = {};
    const byCrop = {};

    this.knowledge.forEach(entry => {
      // Count by category
      byCategory[entry.category] = (byCategory[entry.category] || 0) + 1;
      
      // Count by crop
      if (entry.crop) {
        byCrop[entry.crop] = (byCrop[entry.crop] || 0) + 1;
      }
    });

    return {
      totalEntries: this.knowledge.length,
      categories: byCategory,
      crops: byCrop,
      conversationLength: this.conversationHistory.length
    };
  }

  /**
   * Search for product recommendations based on query
   */
  async getProductRecommendations(query) {
    const matches = this.searchKnowledge(query);
    
    if (matches.length > 0 && matches[0].relatedProducts) {
      return {
        success: true,
        products: matches[0].relatedProducts,
        context: matches[0].category
      };
    }

    return {
      success: false,
      products: [],
      message: 'No product recommendations available for this query'
    };
  }
}

// Export singleton instance
export default new OfflineChatbotService();



