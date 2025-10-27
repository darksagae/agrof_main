/**
 * Accuracy Dashboard Component - Batch 1
 * Displays accuracy metrics and statistics for recommendations
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import enhancedAccuracyService from '../services/enhancedAccuracyService';
import enhancedProductService from '../services/enhancedProductService';
import dynamicMarketService from '../services/dynamicMarketService';

const { width } = Dimensions.get('window');

const AccuracyDashboard = () => {
  const [accuracyStats, setAccuracyStats] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [marketStats, setMarketStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadAccuracyData();
  }, []);

  const loadAccuracyData = async () => {
    try {
      setLoading(true);
      
      // Load accuracy statistics
      const accuracyData = enhancedAccuracyService.getAccuracyStatistics();
      setAccuracyStats(accuracyData);
      
      // Load product statistics
      const productData = enhancedProductService.getRecommendationStatistics();
      setProductStats(productData);
      
      // Load market statistics
      const marketData = dynamicMarketService.getMarketStatistics();
      setMarketStats(marketData);
      
    } catch (error) {
      console.error('❌ Failed to load accuracy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Accuracy Overview</Text>
      
      {accuracyStats && (
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialIcons name="trending-up" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{accuracyStats.total_recommendations}</Text>
            <Text style={styles.statLabel}>Total Recommendations</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialIcons name="star" size={24} color="#FF9800" />
            <Text style={styles.statValue}>{accuracyStats.average_accuracy?.toFixed(2) || '0.00'}</Text>
            <Text style={styles.statLabel}>Average Accuracy</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{accuracyStats.high_accuracy_percentage?.toFixed(1) || '0'}%</Text>
            <Text style={styles.statLabel}>High Accuracy</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialIcons name="warning" size={24} color="#F44336" />
            <Text style={styles.statValue}>{accuracyStats.low_accuracy_percentage?.toFixed(1) || '0'}%</Text>
            <Text style={styles.statLabel}>Low Accuracy</Text>
          </View>
        </View>
      )}
      
      {productStats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Recommendations</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${productStats.high_accuracy_percentage}%`, backgroundColor: '#4CAF50' }
                ]} 
              />
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${productStats.medium_accuracy_percentage}%`, backgroundColor: '#FF9800' }
                ]} 
              />
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${productStats.low_accuracy_percentage}%`, backgroundColor: '#F44336' }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              High: {productStats.high_accuracy_percentage?.toFixed(1)}% | 
              Medium: {productStats.medium_accuracy_percentage?.toFixed(1)}% | 
              Low: {productStats.low_accuracy_percentage?.toFixed(1)}%
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderMarketTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Market Performance</Text>
      
      {marketStats && (
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialIcons name="inventory" size={24} color="#2196F3" />
            <Text style={styles.statValue}>{marketStats.total_crops}</Text>
            <Text style={styles.statLabel}>Total Crops</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{marketStats.in_stock}</Text>
            <Text style={styles.statLabel}>In Stock</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialIcons name="cancel" size={24} color="#F44336" />
            <Text style={styles.statValue}>{marketStats.out_of_stock}</Text>
            <Text style={styles.statLabel}>Out of Stock</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialIcons name="star" size={24} color="#FF9800" />
            <Text style={styles.statValue}>{marketStats.average_supplier_rating?.toFixed(1) || '0.0'}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>
      )}
      
      {marketStats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability Status</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${marketStats.availability_percentage}%`, backgroundColor: '#4CAF50' }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {marketStats.availability_percentage?.toFixed(1)}% Available
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderPerformanceTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Performance Metrics</Text>
      
      <View style={styles.metricCard}>
        <Text style={styles.metricTitle}>Confidence Scoring</Text>
        <Text style={styles.metricDescription}>
          AI confidence levels for disease detection and product recommendations
        </Text>
        <View style={styles.metricStatus}>
          <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
          <Text style={styles.metricStatusText}>Active</Text>
        </View>
      </View>
      
      <View style={styles.metricCard}>
        <Text style={styles.metricTitle}>Relevance Scoring</Text>
        <Text style={styles.metricDescription}>
          Product relevance based on disease symptoms and treatment requirements
        </Text>
        <View style={styles.metricStatus}>
          <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
          <Text style={styles.metricStatusText}>Active</Text>
        </View>
      </View>
      
      <View style={styles.metricCard}>
        <Text style={styles.metricTitle}>Market Service Scoring</Text>
        <Text style={styles.metricDescription}>
          Market-based scoring including price competitiveness and availability
        </Text>
        <View style={styles.metricStatus}>
          <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
          <Text style={styles.metricStatusText}>Active</Text>
        </View>
      </View>
      
      <View style={styles.metricCard}>
        <Text style={styles.metricTitle}>Real-time Market Data</Text>
        <Text style={styles.metricDescription}>
          Live market data integration for accurate pricing and availability
        </Text>
        <View style={styles.metricStatus}>
          <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
          <Text style={styles.metricStatusText}>Active</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading accuracy data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accuracy Dashboard</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
          onPress={() => setSelectedTab('overview')}
        >
          <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'market' && styles.activeTab]}
          onPress={() => setSelectedTab('market')}
        >
          <Text style={[styles.tabText, selectedTab === 'market' && styles.activeTabText]}>
            Market
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'performance' && styles.activeTab]}
          onPress={() => setSelectedTab('performance')}
        >
          <Text style={[styles.tabText, selectedTab === 'performance' && styles.activeTabText]}>
            Performance
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'market' && renderMarketTab()}
        {selectedTab === 'performance' && renderPerformanceTab()}
        
        <TouchableOpacity style={styles.refreshButton} onPress={loadAccuracyData}>
          <MaterialIcons name="refresh" size={20} color="#4CAF50" />
          <Text style={styles.refreshText}>Refresh Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 64) / 2,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  metricCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  metricDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  metricStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricStatusText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 8,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  refreshText: {
    fontSize: 16,
    color: '#4CAF50',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default AccuracyDashboard;











