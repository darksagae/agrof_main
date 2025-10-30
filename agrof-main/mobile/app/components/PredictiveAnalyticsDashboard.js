/**
 * Predictive Analytics Dashboard Component - Batch 6
 * Displays predictive analytics, trend analysis, and anomaly detection
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
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import predictiveAnalyticsService from '../services/predictiveAnalyticsService';

const { width } = Dimensions.get('window');

const PredictiveAnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [trendAnalysis, setTrendAnalysis] = useState(null);
  const [anomalyDetection, setAnomalyDetection] = useState(null);
  const [predictiveInsights, setPredictiveInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedCrop, setSelectedCrop] = useState('maize');
  const [selectedRegion, setSelectedRegion] = useState('Central');
  const [selectedMetric, setSelectedMetric] = useState('accuracy_score');

  const crops = ['maize', 'tomatoes', 'beans', 'coffee', 'banana'];
  const regions = ['Northern', 'Eastern', 'Central', 'Western'];
  const metrics = ['accuracy_score', 'success_rate', 'market_price', 'demand_level', 'weather_score'];

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  useEffect(() => {
    if (selectedCrop && selectedRegion) {
      loadPredictiveInsights();
    }
  }, [selectedCrop, selectedRegion]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Initialize service
      await predictiveAnalyticsService.initialize();
      
      // Load analytics data
      const analytics = predictiveAnalyticsService.getAllAnalyticsData();
      setAnalyticsData(analytics);
      
    } catch (error) {
      console.error('❌ Failed to load analytics data:', error);
      Alert.alert('Error', 'Failed to load predictive analytics data');
    } finally {
      setLoading(false);
    }
  };

  const loadPredictiveInsights = async () => {
    try {
      const insights = predictiveAnalyticsService.generatePredictiveInsights(selectedCrop, selectedRegion);
      setPredictiveInsights(insights);
    } catch (error) {
      console.error('❌ Failed to load predictive insights:', error);
    }
  };

  const analyzeTrends = async () => {
    try {
      const result = predictiveAnalyticsService.analyzeTrends(selectedMetric, 'weekly', selectedCrop, selectedRegion);
      
      if (result.success) {
        setTrendAnalysis(result);
        Alert.alert('Trend Analysis', `Trend: ${result.trend_metrics.trend_direction}, Strength: ${result.trend_metrics.trend_strength.toFixed(2)}`);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('❌ Failed to analyze trends:', error);
      Alert.alert('Error', 'Failed to analyze trends');
    }
  };

  const detectAnomalies = async () => {
    try {
      const result = predictiveAnalyticsService.detectAnomalies(selectedMetric, selectedCrop, selectedRegion);
      
      if (result.success) {
        setAnomalyDetection(result);
        Alert.alert('Anomaly Detection', `${result.anomalies.length} anomalies detected`);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('❌ Failed to detect anomalies:', error);
      Alert.alert('Error', 'Failed to detect anomalies');
    }
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Predictive Analytics Overview</Text>
      
      {analyticsData && (
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>Analytics Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {analyticsData.analytics_data?.historical?.length || 0}
              </Text>
              <Text style={styles.summaryLabel}>Historical Data Points</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {analyticsData.analytics_data?.current?.length || 0}
              </Text>
              <Text style={styles.summaryLabel}>Current Data Points</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {Object.keys(analyticsData.trend_analysis || {}).length}
              </Text>
              <Text style={styles.summaryLabel}>Trend Analysis Types</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {Object.keys(analyticsData.anomaly_detection || {}).length}
              </Text>
              <Text style={styles.summaryLabel}>Anomaly Detection Types</Text>
            </View>
          </View>
        </View>
      )}
      
      <View style={styles.selectionContainer}>
        <Text style={styles.sectionTitle}>Analysis Parameters</Text>
        
        <View style={styles.parameterRow}>
          <Text style={styles.parameterLabel}>Crop:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {crops.map((crop) => (
              <TouchableOpacity
                key={crop}
                style={[
                  styles.parameterButton,
                  selectedCrop === crop && styles.parameterButtonActive
                ]}
                onPress={() => setSelectedCrop(crop)}
              >
                <Text style={[
                  styles.parameterButtonText,
                  selectedCrop === crop && styles.parameterButtonTextActive
                ]}>
                  {crop.charAt(0).toUpperCase() + crop.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.parameterRow}>
          <Text style={styles.parameterLabel}>Region:</Text>
          <View style={styles.regionGrid}>
            {regions.map((region) => (
              <TouchableOpacity
                key={region}
                style={[
                  styles.parameterButton,
                  selectedRegion === region && styles.parameterButtonActive
                ]}
                onPress={() => setSelectedRegion(region)}
              >
                <Text style={[
                  styles.parameterButtonText,
                  selectedRegion === region && styles.parameterButtonTextActive
                ]}>
                  {region}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.parameterRow}>
          <Text style={styles.parameterLabel}>Metric:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {metrics.map((metric) => (
              <TouchableOpacity
                key={metric}
                style={[
                  styles.parameterButton,
                  selectedMetric === metric && styles.parameterButtonActive
                ]}
                onPress={() => setSelectedMetric(metric)}
              >
                <Text style={[
                  styles.parameterButtonText,
                  selectedMetric === metric && styles.parameterButtonTextActive
                ]}>
                  {metric.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={analyzeTrends}>
          <MaterialIcons name="trending_up" size={20} color="#4CAF50" />
          <Text style={styles.actionButtonText}>Analyze Trends</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={detectAnomalies}>
          <MaterialIcons name="warning" size={20} color="#FF9800" />
          <Text style={styles.actionButtonText}>Detect Anomalies</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTrendsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Trend Analysis</Text>
      
      {trendAnalysis && (
        <View>
          <View style={styles.trendCard}>
            <Text style={styles.cardTitle}>Trend Analysis Results</Text>
            <View style={styles.trendMetrics}>
              <View style={styles.trendMetric}>
                <Text style={styles.trendMetricLabel}>Trend Direction:</Text>
                <Text style={[
                  styles.trendMetricValue,
                  { color: trendAnalysis.trend_metrics.trend_direction === 'up' ? '#4CAF50' : 
                           trendAnalysis.trend_metrics.trend_direction === 'down' ? '#F44336' : '#666' }
                ]}>
                  {trendAnalysis.trend_metrics.trend_direction.toUpperCase()}
                </Text>
              </View>
              <View style={styles.trendMetric}>
                <Text style={styles.trendMetricLabel}>Trend Strength:</Text>
                <Text style={styles.trendMetricValue}>
                  {(trendAnalysis.trend_metrics.trend_strength * 100).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.trendMetric}>
                <Text style={styles.trendMetricLabel}>Average Value:</Text>
                <Text style={styles.trendMetricValue}>
                  {trendAnalysis.trend_metrics.average_value.toFixed(2)}
                </Text>
              </View>
              <View style={styles.trendMetric}>
                <Text style={styles.trendMetricLabel}>Volatility:</Text>
                <Text style={styles.trendMetricValue}>
                  {(trendAnalysis.trend_metrics.volatility * 100).toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
          
          {trendAnalysis.insights && (
            <View style={styles.insightsCard}>
              <Text style={styles.cardTitle}>Trend Insights</Text>
              {trendAnalysis.insights.map((insight, index) => (
                <View key={index} style={styles.insightItem}>
                  <View style={styles.insightHeader}>
                    <MaterialIcons 
                      name={insight.type === 'positive_trend' ? 'trending_up' : 
                           insight.type === 'negative_trend' ? 'trending_down' : 'info'} 
                      size={20} 
                      color={insight.type === 'positive_trend' ? '#4CAF50' : 
                             insight.type === 'negative_trend' ? '#F44336' : '#2196F3'} 
                    />
                    <Text style={styles.insightType}>{insight.type.replace('_', ' ').toUpperCase()}</Text>
                  </View>
                  <Text style={styles.insightMessage}>{insight.message}</Text>
                </View>
              ))}
            </View>
          )}
          
          {trendAnalysis.predictions && (
            <View style={styles.predictionsCard}>
              <Text style={styles.cardTitle}>Predictions</Text>
              {trendAnalysis.predictions.map((prediction, index) => (
                <View key={index} style={styles.predictionItem}>
                  <View style={styles.predictionHeader}>
                    <Text style={styles.predictionTimeframe}>
                      {prediction.timeframe.replace('_', ' ').toUpperCase()}
                    </Text>
                    <Text style={styles.predictionDays}>
                      {prediction.days} days
                    </Text>
                  </View>
                  <View style={styles.predictionDetails}>
                    <Text style={styles.predictionValue}>
                      Predicted: {prediction.predicted_value.toFixed(2)}
                    </Text>
                    <Text style={styles.predictionConfidence}>
                      Confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderAnomaliesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Anomaly Detection</Text>
      
      {anomalyDetectionAna && (
        <View>
          <View style={styles.anomalyCard}>
            <Text style={styles.cardTitle}>Anomaly Detection Results</Text>
            <View style={styles.anomalySummary}>
              <Text style={styles.anomalyCount}>
                {anomalyDetection.anomalies.length} Anomalies Detected
              </Text>
              <Text style={styles.anomalyDataPoints}>
                Out of {anomalyDetection.total_data_points} data points
              </Text>
            </View>
          </View>
          
          {anomalyDetection.anomalies && anomalyDetection.anomalies.length > 0 && (
            <View style={styles.anomaliesList}>
              <Text style={styles.cardTitle}>Detected Anomalies</Text>
              {anomalyDetection.anomalies.slice(0, 10).map((anomaly, index) => (
                <View key={index} style={styles.anomalyItem}>
                  <View style={styles.anomalyHeader}>
                    <Text style={styles.anomalyDate}>{anomaly.date}</Text>
                    <View style={[
                      styles.anomalySeverity,
                      { backgroundColor: this.getSeverityColor(anomaly.severity) }
                    ]}>
                      <Text style={styles.anomalySeverityText}>
                        {anomaly.severity.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.anomalyValue}>
                    Value: {anomaly.value.toFixed(2)} (Deviation: {anomaly.deviation.toFixed(2)})
                  </Text>
                </View>
              ))}
            </View>
          )}
          
          {anomalyDetection.insights && (
            <View style={styles.insightsCard}>
              <Text style={styles.cardTitle}>Anomaly Insights</Text>
              {anomalyDetection.insights.map((insight, index) => (
                <View key={index} style={styles.insightItem}>
                  <View style={styles.insightHeader}>
                    <MaterialIcons 
                      name={insight.type === 'critical_anomalies' ? 'error' : 
                           insight.type === 'high_anomalies' ? 'warning' : 'info'} 
                      size={20} 
                      color={insight.type === 'critical_anomalies' ? '#F44336' : 
                             insight.type === 'high_anomalies' ? '#FF9800' : '#2196F3'} 
                    />
                    <Text style={styles.insightType}>{insight.type.replace('_', ' ').toUpperCase()}</Text>
                  </View>
                  <Text style={styles.insightMessage}>{insight.message}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderInsightsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Predictive Insights</Text>
      
      {predictiveInsights && (
        <View>
          <View style={styles.insightsCard}>
            <Text style={styles.cardTitle}>Predictive Insights for {selectedCrop} in {selectedRegion}</Text>
            {predictiveInsights.insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <View style={styles.insightHeader}>
                  <MaterialIcons 
                    name={insight.type === 'accuracy_prediction' ? 'assessment' : 
                         insight.type === 'market_prediction' ? 'trending_up' : 
                         insight.type === 'anomaly_detection' ? 'warning' : 'info'} 
                    size={20} 
                    color={insight.priority === 'high' ? '#F44336' : 
                           insight.priority === 'medium' ? '#FF9800' : '#4CAF50'} 
                  />
                  <Text style={styles.insightType}>{insight.type.replace('_', ' ').toUpperCase()}</Text>
                </View>
                <Text style={styles.insightMessage}>{insight.message}</Text>
                <Text style={styles.insightConfidence}>
                  Confidence: {(insight.confidence * 100).toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#F44336';
      case 'high': return '#FF9800';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading predictive analytics data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Predictive Analytics Dashboard</Text>
      
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
          style={[styles.tab, selectedTab === 'trends' && styles.activeTab]}
          onPress={() => setSelectedTab('trends')}
        >
          <Text style={[styles.tabText, selectedTab === 'trends' && styles.activeTabText]}>
            Trends
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'anomalies' && styles.activeTab]}
          onPress={() => setSelectedTab('anomalies')}
        >
          <Text style={[styles.tabText, selectedTab === 'anomalies' && styles.activeTabText]}>
            Anomalies
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'insights' && styles.activeTab]}
          onPress={() => setSelectedTab('insights')}
        >
          <Text style={[styles.tabText, selectedTab === 'insights' && styles.activeTabText]}>
            Insights
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'trends' && renderTrendsTab()}
        {selectedTab === 'anomalies' && renderAnomaliesTab()}
        {selectedTab === 'insights' && renderInsightsTab()}
        
        <TouchableOpacity style={styles.refreshButton} onPress={loadAnalyticsData}>
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
  overviewCard: {
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: (width - 80) / 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  selectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  parameterRow: {
    marginBottom: 16,
  },
  parameterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  parameterButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  parameterButtonActive: {
    backgroundColor: '#4CAF50',
  },
  parameterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  parameterButtonTextActive: {
    color: '#fff',
  },
  regionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  trendCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  trendMetrics: {
    marginTop: 16,
  },
  trendMetric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  trendMetricLabel: {
    fontSize: 14,
    color: '#666',
  },
  trendMetricValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  insightsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  insightItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 8,
  },
  insightMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  insightConfidence: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  predictionsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  predictionItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  predictionTimeframe: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  predictionDays: {
    fontSize: 12,
    color: '#666',
  },
  predictionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  predictionValue: {
    fontSize: 14,
    color: '#333',
  },
  predictionConfidence: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  anomalyCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  anomalySummary: {
    alignItems: 'center',
    marginTop: 16,
  },
  anomalyCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 4,
  },
  anomalyDataPoints: {
    fontSize: 14,
    color: '#666',
  },
  anomaliesList: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  anomalyItem: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  anomalyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  anomalyDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  anomalySeverity: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  anomalySeverityText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  anomalyValue: {
    fontSize: 12,
    color: '#666',
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

export default PredictiveAnalyticsDashboard;













