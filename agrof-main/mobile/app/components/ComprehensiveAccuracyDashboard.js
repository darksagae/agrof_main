/**
 * Comprehensive Accuracy Dashboard Component - Batch 8
 * Comprehensive accuracy dashboard integrating all accuracy systems
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import comprehensiveAccuracyDashboardService from '../services/comprehensiveAccuracyDashboardService';

const { width } = Dimensions.get('window');

const ComprehensiveAccuracyDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState(null);
  const [integratedAnalytics, setIntegratedAnalytics] = useState(null);
  const [performanceIndicators, setPerformanceIndicators] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Set up auto-refresh
    const interval = setInterval(() => {
      if (autoRefresh) {
        refreshData();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Initialize service
      await comprehensiveAccuracyDashboardService.initialize();
      
      // Load comprehensive dashboard data
      const data = comprehensiveAccuracyDashboardService.getComprehensiveDashboardData();
      
      if (data.success) {
        setDashboardData(data.dashboard_data);
        setRealTimeMetrics(data.real_time_metrics);
        setIntegratedAnalytics(data.integrated_analytics);
        setPerformanceIndicators(data.performance_indicators);
        setAlerts(data.alerts);
      } else {
        Alert.alert('Error', data.error);
      }
      
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error);
      Alert.alert('Error', 'Failed to load comprehensive dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      
      // Get real-time updates
      const updates = comprehensiveAccuracyDashboardService.getRealTimeUpdates();
      
      if (updates.success) {
        setRealTimeMetrics(updates.real_time_metrics);
        setPerformanceIndicators(updates.performance_indicators);
        setAlerts(updates.alerts);
      }
      
    } catch (error) {
      console.error('❌ Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Comprehensive Accuracy Overview</Text>
      
      {realTimeMetrics && (
        <View>
          <View style={styles.metricsGrid}>
            {Object.entries(realTimeMetrics).map(([key, metric]) => (
              <View key={key} style={styles.metricCard}>
                <Text style={styles.metricName}>{metric.name || key.replace('_', ' ').toUpperCase()}</Text>
                <Text style={styles.metricValue}>
                  {(metric.current * 100).toFixed(1)}%
                </Text>
                <View style={styles.metricBar}>
                  <View 
                    style={[
                      styles.metricBarFill,
                      { width: `${metric.current * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.metricTarget}>
                  Target: {(metric.target * 100).toFixed(1)}%
                </Text>
                <Text style={styles.metricConfidence}>
                  Confidence: {metric.confidence}
                </Text>
              </View>
            ))}
          </View>
          
          {alerts && alerts.length > 0 && (
            <View style={styles.alertsCard}>
              <Text style={styles.cardTitle}>Active Alerts</Text>
              {alerts.map((alert, index) => (
                <View key={index} style={styles.alertItem}>
                  <View style={styles.alertHeader}>
                    <MaterialIcons 
                      name={alert.type === 'critical' ? 'error' : 
                           alert.type === 'warning' ? 'warning' : 'info'} 
                      size={20} 
                      color={alert.type === 'critical' ? '#F44336' : 
                             alert.type === 'warning' ? '#FF9800' : '#2196F3'} 
                    />
                    <Text style={styles.alertType}>{alert.type.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderPerformanceTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Performance Indicators</Text>
      
      {performanceIndicators && (
        <View>
          <View style={styles.performanceGrid}>
            {Object.entries(performanceIndicators).map(([key, indicator]) => (
              <View key={key} style={styles.performanceCard}>
                <View style={styles.performanceHeader}>
                  <Text style={styles.performanceName}>{indicator.name}</Text>
                  <View style={styles.statusIndicator}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(indicator.status) }
                    ]} />
                    <Text style={styles.statusText}>{indicator.status}</Text>
                  </View>
                </View>
                <Text style={styles.performanceValue}>
                  {(indicator.value * 100).toFixed(1)}%
                </Text>
                <View style={styles.performanceBar}>
                  <View 
                    style={[
                      styles.performanceBarFill,
                      { width: `${(indicator.value / indicator.target) * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.performanceTarget}>
                  Target: {(indicator.target * 100).toFixed(1)}%
                </Text>
                <Text style={styles.performanceTrend}>
                  Trend: {indicator.trend}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderAnalyticsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Integrated Analytics</Text>
      
      {integratedAnalytics && (
        <View>
          {Object.entries(integratedAnalytics).map(([key, analytics]) => (
            <View key={key} style={styles.analyticsCard}>
              <Text style={styles.cardTitle}>{analytics.name}</Text>
              <Text style={styles.analyticsDescription}>{analytics.description}</Text>
              
              {analytics.data && analytics.data.length > 0 && (
                <View style={styles.analyticsData}>
                  {analytics.data.map((item, index) => (
                    <View key={index} style={styles.analyticsItem}>
                      <Text style={styles.analyticsItemLabel}>{item.system || item.metric1 || item.metric}</Text>
                      <Text style={styles.analyticsItemValue}>
                        {item.value ? (item.value * 100).toFixed(1) + '%' : 
                         item.correlation ? item.correlation.toFixed(2) :
                         item.score ? (item.score * 100).toFixed(1) + '%' : 'N/A'}
                      </Text>
                      {item.trend && (
                        <Text style={styles.analyticsItemTrend}>{item.trend}</Text>
                      )}
                      {item.strength && (
                        <Text style={styles.analyticsItemStrength}>{item.strength}</Text>
                      )}
                      {item.status && (
                        <Text style={styles.analyticsItemStatus}>{item.status}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
              
              {analytics.insights && analytics.insights.length > 0 && (
                <View style={styles.analyticsInsights}>
                  <Text style={styles.insightsTitle}>Insights</Text>
                  {analytics.insights.map((insight, index) => (
                    <View key={index} style={styles.insightItem}>
                      <MaterialIcons 
                        name={insight.priority === 'high' ? 'warning' : 'info'} 
                        size={16} 
                        color={insight.priority === 'high' ? '#F44336' : '#2196F3'} 
                      />
                      <Text style={styles.insightText}>{insight.message}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderSystemsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>System Health</Text>
      
      {dashboardData && (
        <View>
          {Object.entries(dashboardData).map(([key, systemData]) => (
            <View key={key} style={styles.systemCard}>
              <Text style={styles.cardTitle}>{key.replace('_', ' ').toUpperCase()}</Text>
              
              {systemData && typeof systemData === 'object' && (
                <View style={styles.systemData}>
                  {Object.entries(systemData).slice(0, 5).map(([dataKey, value]) => (
                    <View key={dataKey} style={styles.systemDataItem}>
                      <Text style={styles.systemDataLabel}>{dataKey.replace('_', ' ')}</Text>
                      <Text style={styles.systemDataValue}>
                        {typeof value === 'number' ? value.toFixed(2) : 
                         typeof value === 'object' ? JSON.stringify(value).slice(0, 50) + '...' :
                         String(value).slice(0, 50)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'warning': return '#FF9800';
      case 'critical': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading comprehensive dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comprehensive Accuracy Dashboard</Text>
        <View style={styles.headerControls}>
          <TouchableOpacity 
            style={styles.autoRefreshButton}
            onPress={() => setAutoRefresh(!autoRefresh)}
          >
            <MaterialIcons 
              name={autoRefresh ? 'pause' : 'play_arrow'} 
              size={20} 
              color={autoRefresh ? '#4CAF50' : '#666'} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.refreshButton} onPress={refreshData}>
            <MaterialIcons name="refresh" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
      
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
          style={[styles.tab, selectedTab === 'performance' && styles.activeTab]}
          onPress={() => setSelectedTab('performance')}
        >
          <Text style={[styles.tabText, selectedTab === 'performance' && styles.activeTabText]}>
            Performance
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'analytics' && styles.activeTab]}
          onPress={() => setSelectedTab('analytics')}
        >
          <Text style={[styles.tabText, selectedTab === 'analytics' && styles.activeTabText]}>
            Analytics
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'systems' && styles.activeTab]}
          onPress={() => setSelectedTab('systems')}
        >
          <Text style={[styles.tabText, selectedTab === 'systems' && styles.activeTabText]}>
            Systems
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
        }
      >
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'performance' && renderPerformanceTab()}
        {selectedTab === 'analytics' && renderAnalyticsTab()}
        {selectedTab === 'systems' && renderSystemsTab()}
        
        <TouchableOpacity style={styles.fullRefreshButton} onPress={loadDashboardData}>
          <MaterialIcons name="refresh" size={20} color="#4CAF50" />
          <Text style={styles.fullRefreshText}>Full Refresh</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoRefreshButton: {
    marginRight: 12,
    padding: 8,
  },
  refreshButton: {
    padding: 8,
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
    fontSize: 12,
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 80) / 2,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  metricName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  metricBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  metricBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  metricTarget: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricConfidence: {
    fontSize: 12,
    color: '#666',
  },
  alertsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  alertItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 8,
  },
  alertMessage: {
    fontSize: 14,
    color: '#333',
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  performanceCard: {
    width: (width - 80) / 2,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  performanceName: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#666',
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  performanceBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  performanceBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  performanceTarget: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  performanceTrend: {
    fontSize: 12,
    color: '#666',
  },
  analyticsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  analyticsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  analyticsData: {
    marginBottom: 16,
  },
  analyticsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  analyticsItemLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  analyticsItemValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  analyticsItemTrend: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  analyticsItemStrength: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  analyticsItemStatus: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  analyticsInsights: {
    marginTop: 16,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  systemCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  systemData: {
    marginTop: 16,
  },
  systemDataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  systemDataLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  systemDataValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
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
  fullRefreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  fullRefreshText: {
    fontSize: 16,
    color: '#4CAF50',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default ComprehensiveAccuracyDashboard;














