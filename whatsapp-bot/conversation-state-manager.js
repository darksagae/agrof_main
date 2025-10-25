/**
 * Conversation State Manager
 * Manages admin conversation sessions and state transitions
 */

class ConversationStateManager {
  constructor() {
    this.sessions = new Map();
    this.sessionTimeout = 5 * 60 * 1000; // 5 minutes
    
    // Start cleanup interval
    setInterval(() => this.cleanupExpiredSessions(), 60000); // Every minute
  }

  /**
   * Start a new session
   */
  startSession(phone, trigger, context = {}) {
    const session = {
      trigger,
      step: 'main_menu',
      data: {},
      context,
      startedAt: Date.now(),
      lastActivity: Date.now(),
      history: []
    };
    
    this.sessions.set(phone, session);
    console.log(`📱 Started ${trigger} session for ${phone}`);
    return session;
  }

  /**
   * Get active session
   */
  getSession(phone) {
    const session = this.sessions.get(phone);
    
    if (!session) return null;
    
    // Check if expired
    if (Date.now() - session.lastActivity > this.sessionTimeout) {
      console.log(`⏱️ Session expired for ${phone}`);
      this.sessions.delete(phone);
      return null;
    }
    
    return session;
  }

  /**
   * Update session state
   */
  updateSession(phone, updates) {
    const session = this.getSession(phone);
    if (!session) return null;
    
    // Add to history
    session.history.push({
      step: session.step,
      data: { ...session.data },
      timestamp: Date.now()
    });
    
    // Apply updates
    Object.assign(session, updates);
    session.lastActivity = Date.now();
    
    this.sessions.set(phone, session);
    return session;
  }

  /**
   * Set session step
   */
  setStep(phone, step, additionalData = {}) {
    return this.updateSession(phone, {
      step,
      data: { ...this.getSession(phone)?.data, ...additionalData }
    });
  }

  /**
   * Store data in session
   */
  storeData(phone, key, value) {
    const session = this.getSession(phone);
    if (!session) return null;
    
    session.data[key] = value;
    session.lastActivity = Date.now();
    
    this.sessions.set(phone, session);
    return session;
  }

  /**
   * Get data from session
   */
  getData(phone, key) {
    const session = this.getSession(phone);
    return session?.data[key];
  }

  /**
   * Clear session
   */
  clearSession(phone) {
    console.log(`🗑️ Cleared session for ${phone}`);
    this.sessions.delete(phone);
  }

  /**
   * Check if user has active session
   */
  hasActiveSession(phone) {
    return this.getSession(phone) !== null;
  }

  /**
   * Go back one step
   */
  goBack(phone) {
    const session = this.getSession(phone);
    if (!session || session.history.length === 0) return null;
    
    const previous = session.history.pop();
    session.step = previous.step;
    session.data = previous.data;
    session.lastActivity = Date.now();
    
    this.sessions.set(phone, session);
    return session;
  }

  /**
   * Cleanup expired sessions
   */
  cleanupExpiredSessions() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [phone, session] of this.sessions.entries()) {
      if (now - session.lastActivity > this.sessionTimeout) {
        this.sessions.delete(phone);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} expired sessions`);
    }
  }

  /**
   * Get all active sessions (for monitoring)
   */
  getActiveSessions() {
    return Array.from(this.sessions.entries()).map(([phone, session]) => ({
      phone,
      trigger: session.trigger,
      step: session.step,
      duration: Date.now() - session.startedAt,
      lastActivity: Date.now() - session.lastActivity
    }));
  }
}

module.exports = new ConversationStateManager();

