/**
 * Network Diagnostic Service
 * Helps diagnose and fix network connectivity issues
 */

import NetInfo from '@react-native-community/netinfo';
import { AI_BASE_URL, STORE_BASE_URL } from '../config/apiConfig';

class NetworkDiagnosticService {
  constructor() {
    this.diagnosticResults = [];
  }

  /**
   * Run comprehensive network diagnostics
   */
  async runDiagnostics() {
    console.log('🔍 Running network diagnostics...');
    
    const results = {
      timestamp: new Date().toISOString(),
      networkInfo: null,
      apiEndpoints: {},
      recommendations: []
    };

    try {
      // Check network connectivity
      const networkState = await NetInfo.fetch();
      results.networkInfo = {
        isConnected: networkState.isConnected,
        isInternetReachable: networkState.isInternetReachable,
        type: networkState.type,
        details: networkState.details
      };

      console.log('📊 Network Info:', results.networkInfo);

      // Test API endpoints
      results.apiEndpoints = await this.testApiEndpoints();

      // Generate recommendations
      results.recommendations = this.generateRecommendations(results);

      this.diagnosticResults.push(results);
      
      console.log('✅ Network diagnostics complete');
      return results;

    } catch (error) {
      console.error('❌ Network diagnostics failed:', error);
      return {
        ...results,
        error: error.message,
        recommendations: ['Check your internet connection and try again']
      };
    }
  }

  /**
   * Test API endpoints
   */
  async testApiEndpoints() {
    const endpoints = {
      aiBackend: AI_BASE_URL,
      storeBackend: STORE_BASE_URL
    };

    const results = {};

    for (const [name, url] of Object.entries(endpoints)) {
      try {
        console.log(`🌐 Testing ${name}: ${url}`);
        
        const response = await fetch(`${url}/health`, {
          method: 'GET',
          timeout: 5000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          results[name] = {
            status: 'success',
            url: url,
            responseTime: Date.now(),
            data: data
          };
          console.log(`✅ ${name} is accessible`);
        } else {
          results[name] = {
            status: 'error',
            url: url,
            error: `HTTP ${response.status}`,
            responseTime: Date.now()
          };
          console.log(`❌ ${name} returned ${response.status}`);
        }
      } catch (error) {
        results[name] = {
          status: 'error',
          url: url,
          error: error.message,
          responseTime: Date.now()
        };
        console.log(`❌ ${name} failed: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Generate recommendations based on diagnostic results
   */
  generateRecommendations(results) {
    const recommendations = [];

    // Network connectivity issues
    if (!results.networkInfo?.isConnected) {
      recommendations.push({
        type: 'critical',
        title: 'No Network Connection',
        description: 'Your device is not connected to any network',
        action: 'Connect to WiFi or mobile data'
      });
    } else if (!results.networkInfo?.isInternetReachable) {
      recommendations.push({
        type: 'critical',
        title: 'No Internet Access',
        description: 'Connected to network but no internet access',
        action: 'Check your internet connection or try a different network'
      });
    }

    // API endpoint issues
    for (const [name, result] of Object.entries(results.apiEndpoints)) {
      if (result.status === 'error') {
        recommendations.push({
          type: 'warning',
          title: `${name} API Unavailable`,
          description: `Cannot connect to ${name} backend`,
          action: `Check if ${name} backend is running on ${result.url}`,
          technical: result.error
        });
      }
    }

    // Network type recommendations
    if (results.networkInfo?.type === 'cellular') {
      recommendations.push({
        type: 'info',
        title: 'Using Mobile Data',
        description: 'AI analysis may consume significant data',
        action: 'Consider using WiFi for better performance'
      });
    }

    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        title: 'Network Status Good',
        description: 'All systems are accessible',
        action: 'You can proceed with AI analysis'
      });
    }

    return recommendations;
  }

  /**
   * Get diagnostic history
   */
  getDiagnosticHistory() {
    return this.diagnosticResults;
  }

  /**
   * Clear diagnostic history
   */
  clearHistory() {
    this.diagnosticResults = [];
  }

  /**
   * Get current network status
   */
  async getCurrentStatus() {
    try {
      const networkState = await NetInfo.fetch();
      return {
        isConnected: networkState.isConnected,
        isInternetReachable: networkState.isInternetReachable,
        type: networkState.type,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        isConnected: false,
        isInternetReachable: false,
        type: 'unknown',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Test specific endpoint
   */
  async testEndpoint(url, timeout = 5000) {
    try {
      console.log(`🔍 Testing endpoint: ${url}`);
      
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'GET',
        timeout: timeout,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        return {
          status: 'success',
          url: url,
          responseTime: responseTime,
          data: data
        };
      } else {
        return {
          status: 'error',
          url: url,
          responseTime: responseTime,
          error: `HTTP ${response.status}`
        };
      }
    } catch (error) {
      return {
        status: 'error',
        url: url,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export default new NetworkDiagnosticService();
