/**
 * Advanced Accuracy Dashboard Component - Batch 7
 * Displays advanced accuracy features, ROI calculations, and optimization results
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
import advancedAccuracyService from '../services/advancedAccuracyService';

const { width } = Dimensions.get('window');

const AdvancedAccuracyDashboard = () => {
  const [accuracyData, setAccuracyData] = useState(null);
  const [roiCalculation, setROICalculation] = useState(null);
  const [successRateMonitoring, setSuccessRateMonitoring] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedCrop, setSelectedCrop] = useState('maize');
  const [selectedRegion, setSelectedRegion] = useState('Central');
  const [optimizing, setOptimizing] = useState(false);

  const crops = ['maize', 'tomatoes', 'beans', 'coffee', 'banana'];
  const regions = ['Northern', 'Eastern', 'Central', 'Western'];

  useEffect(() => {
    loadAccuracyData();
  }, []);

  useEffect(() => {
    if (selectedCrop && selectedRegion) {
      loadROICalculation();
      loadSuccessRateMonitoring();
    }
  }, [selectedCrop, selectedRegion]);

  const loadAccuracyData = async () => {
    try {
      setLoading(true);
      
      // Initialize service
      await advancedAccuracyService.initialize();
      
      // Load accuracy data
      const data = advancedAccuracyService.getAllAdvancedAccuracyData();
      setAccuracyData(data);
      
    } catch (error) {
      console.error('❌ Failed to load accuracy data:', error);
      Alert.alert('Error', 'Failed to load advanced accuracy data');
    } finally {
      setLoading(false);
    }
  };

  const loadROICalculation = async () => {
    try {
      // Mock recommendation data for ROI calculation
      const recommendationData = {
        market_price: 2500,
        yield: 800,
        demand_level: 0.8,
        seed_cost: 150,
        fertilizer_cost: 300,
        labor_cost: 200,
        equipment_cost: 150,
        weather_risk: 0.3,
        market_risk: 0.2,
        disease_risk: 0.4,
        growth_duration: 90,
        resource_efficiency: 0.8,
        sustainability: 0.7,
        market_condition: 'stable',
        user_preference: 0.8,
        accuracy: 0.85
      };

      const result = advancedAccuracyService.calculateDynamicROI(recommendationData, selectedCrop, selectedRegion);
      setROICalculation(result);
    } catch (error) {
      console.error('❌ Failed to load ROI calculation:', error);
    }
  };

  const loadSuccessRateMonitoring = async () => {
    try {
      const result = advancedAccuracyService.monitorSuccessRate(selectedCrop, selectedRegion);
      setSuccessRateMonitoring(result);
    } catch (error) {
      console.error('❌ Failed to load success rate monitoring:', error);
    }
  };

  const optimizeAccuracy = async () => {
    try {
      setOptimizing(true);
      
      const result = await advancedAccuracyService.optimizeAccuracy('accuracy_optimization');
      
      if (result.success) {
        setOptimizationResult(result);
        Alert.alert('Optimization Complete', `Accuracy improved by ${(result.improvement * 100).toFixed(1)}%`);
        loadAccuracyData(); // Reload data to show updated results
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('❌ Failed to optimize accuracy:', error);
      Alert.alert('Error', 'Failed to optimize accuracy');
    } finally {
      setOptimizing(false);
    }
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Advanced Accuracy Overview</Text>
      
      {accuracyData && (
        <View>
          <View style={styles.metricsCard}>
            <Text style={styles.cardTitle}>Accuracy Metrics</Text>
            {Object.entries(accuracyData.accuracy_metrics).map(([key, metric]) => (
              <View key={key} style={styles.metricItem}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricName}>{metric.name}</Text>
                  <Text style={styles.metricValue}>
                    {(metric.current * 100).toFixed(1)}%
                  </Text>
                </View>
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
              </View>
            ))}
          </View>
          
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
          </View>
          
          <TouchableOpacity 
            style={[styles.optimizeButton, optimizing && styles.optimizeButtonDisabled]}
            onPress={optimizeAccuracy}
            disabled={optimizing}
          >
            {optimizing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons name="auto_fix_high" size={20} color="#fff" />
            )}
            <Text style={styles.optimizeButtonText}>
              {optimizing ? 'Optimizing...' : 'Optimize Accuracy'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderROITab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Dynamic ROI Calculation</Text>
      
      {roiCalculation && roiCalculation.success && (
        <View>
          <View style={styles.roiCard}>
            <Text style={styles.cardTitle}>ROI Analysis for {selectedCrop} in {selectedRegion}</Text>
            <View style={styles.roiSummary}>
              <Text style={styles.roiValue}>
                {(roiCalculation.roi_calculations.final_roi * 100).toFixed(1)}%
              </Text>
              <Text style={styles.roiLabel}>Final ROI</Text>
            </View>
          </View>
          
          <View style={styles.roiComponentsCard}>
            <Text style={styles.cardTitle}>ROI Components</Text>
            <View style={styles.roiComponents}>
              <View style={styles.roiComponent}>
                <Text style={styles.roiComponentLabel}>Revenue</Text>
                <Text style={styles.roiComponentValue}>
                  {(roiCalculation.roi_components.revenue * 100).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.roiComponent}>
                <Text style={styles.roiComponentLabel}>Costs</Text>
                <Text style={styles.roiComponentValue}>
                  {(roiCalculation.roi_components.costs * 100).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.roiComponent}>
                <Text style={styles.roiComponentLabel}>Risks</Text>
                <Text style={styles.roiComponentValue}>
                  {(roiCalculation.roi_components.risks * 100).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.roiComponent}>
                <Text style={styles.roiComponentLabel}>Efficiency</Text>
                <Text style={styles.roiComponentValue}>
                  {(roiCalculation.roi_components.efficiency * 100).toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.roiCalculationsCard}>
            <Text style={styles.cardTitle}>ROI Calculations</Text>
            <View style={styles.roiCalculations}>
              <View style={styles.roiCalculation}>
                <Text style={styles.roiCalculationLabel}>Base ROI:</Text>
                <Text style={styles.roiCalculationValue}>
                  {(roiCalculation.roi_calculations.base_roi * 100).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.roiCalculation}>
                <Text style={styles.roiCalculationLabel}>Adjusted ROI:</Text>
                <Text style={styles.roiCalculationValue}>
                  {(roiCalculation.roi_calculations.adjusted_roi * 100).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.roiCalculation}>
                <Text style={styles.roiCalculationLabel}>Risk-Adjusted ROI:</Text>
                <Text style={styles.roiCalculationValue}>
                  {(roiCalculation.roi_calculations.risk_adjusted_roi * 100).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.roiCalculation}>
                <Text style={styles.roiCalculationLabel}>Efficiency-Adjusted ROI:</Text>
                <Text style={styles.roiCalculationValue}>
                  {(roiCalculation.roi_calculations.efficiency_adjusted_roi * 100).toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
          
          {roiCalculation.recommendations && (
            <View style={styles.recommendationsCard}>
              <Text style={styles.cardTitle}>ROI Recommendations</Text>
              {roiCalculation.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.recommendationHeader}>
                    <MaterialIcons 
                      name={rec.priority === 'high' ? 'warning' : 'info'} 
                      size={20} 
                      color={rec.priority === 'high' ? '#F44336' : '#2196F3'} 
                    />
                    <Text style={styles.recommendationType}>{rec.type.replace('_', ' ').toUpperCase()}</Text>
                  </View>
                  <Text style={styles.recommendationMessage}>{rec.message}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderMonitoringTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Success Rate Monitoring</Text>
      
      {successRateMonitoring && successRateMonitoring.success && (
        <View>
          <View style={styles.monitoringCard}>
            <Text style={styles.cardTitle}>Success Rate for {selectedCrop} in {selectedRegion}</Text>
            <View style={styles.monitoringSummary}>
              <Text style={styles.monitoringValue}>
                {(successRateMonitoring.success_rate * 100).toFixed(1)}%
              </Text>
              <Text style={styles.monitoringLabel}>Success Rate</Text>
              <Text style={styles.monitoringConfidence}>
                Confidence: {successRateMonitoring.confidence}
              </Text>
            </View>
          </View>
          
          {successRateMonitoring.alerts && successRateMonitoring.alerts.length > 0 && (
            <View style={styles.alertsCard}>
              <Text style={styles.cardTitle}>Monitoring Alerts</Text>
              {successRateMonitoring.alerts.map((alert, index) => (
                <View key={index} style={styles.alertItem}>
                  <View style={styles.alertHeader}>
                    <MaterialIcons 
                      name={alert.type === 'critical' ? 'error' : 
                           alert.type === 'warning' ? 'warning' : 'check_circle'} 
                      size={20} 
                      color={alert.type === 'critical' ? '#F44336' : 
                             alert.type === 'warning' ? '#FF9800' : '#4CAF50'} 
                    />
                    <Text style={styles.alertType}>{alert.type.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                </View>
              ))}
            </View>
          )}
          
          {successRateMonitoring.recommendations && (
            <View style={styles.recommendationsCard}>
              <Text style={styles.cardTitle}>Monitoring Recommendations</Text>
              {successRateMonitoring.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.recommendationHeader}>
                    <MaterialIcons 
                      name={rec.priority === 'high' ? 'warning' : 'info'} 
                      size={20} 
                      color={rec.priority === 'high' ? '#F44336' : '#2196F3'} 
                    />
                    <Text style={styles.recommendationType}>{rec.type.replace('_', ' ').toUpperCase()}</Text>
                  </View>
                  <Text style={styles.recommendationMessage}>{rec.message}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderOptimizationTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Accuracy Optimization</Text>
      
      {optimizationResult && optimizationResult.success && (
        <View>
          <View style={styles.optimizationCard}>
            <Text style={styles.cardTitle}>Optimization Results</Text>
            <View style={styles.optimizationSummary}>
              <Text style={styles.optimizationValue}>
                +{(optimizationResult.improvement * 100).toFixed(1)}%
              </Text>
              <Text style={styles.optimizationLabel}>Accuracy Improvement</Text>
            </View>
            <View style={styles.optimizationDetails}>
              <Text style={styles.optimizationDetail}>
                Final Accuracy: {(optimizationResult.final_accuracy * 100).toFixed(1)}%
              </Text>
              <Text style={styles.optimizationDetail}>
                Iterations: {optimizationResult.iterations}
              </Text>
              <Text style={styles.optimizationDetail}>
                Convergence: {optimizationResult.convergence ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
          
          {optimizationResult.recommendations && (
            <View style={styles.recommendationsCard}>
              <Text style={styles.cardTitle}>Optimization Recommendations</Text>
              {optimizationResult.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.recommendationHeader}>
                    <MaterialIcons 
                      name={rec.priority === 'high' ? 'warning' : 'info'} 
                      size={20} 
                      color={rec.priority === 'high' ? '#F44336' : '#2196F3'} 
                    />
                    <Text style={styles.recommendationType}>{rec.type.replace('_', ' ').toUpperCase()}</Text>
                  </View>
                  <Text style={styles.recommendationMessage}>{rec.message}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
      
      {accuracyData && (
        <View style={styles.algorithmsCard}>
          <Text style={styles.cardTitle}>Optimization Algorithms</Text>
          {Object.entries(accuracyData.optimization_algorithms).map(([key, algorithm]) => (
            <View key={key} style={styles.algorithmItem}>
              <View style={styles.algorithmHeader}>
                <Text style={styles.algorithmName}>{algorithm.name}</Text>
                <View style={styles.algorithmStatus}>
                  <View style={[
                    styles.statusIndicator,
                    { backgroundColor: algorithm.status === 'completed' ? '#4CAF50' : '#FF9800' }
                  ]} />
                  <Text style={styles.statusText}>
                    {algorithm.status === 'completed' ? 'Completed' : 'Ready'}
                  </Text>
                </View>
              </View>
              <Text style={styles.algorithmDescription}>{algorithm.description}</Text>
              <Text style={styles.algorithmType}>Algorithm: {algorithm.algorithm}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading advanced accuracy data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advanced Accuracy Dashboard</Text>
      
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
          style={[styles.tab, selectedTab === 'roi' && styles.activeTab]}
          onPress={() => setSelectedTab('roi')}
        >
          <Text style={[styles.tabText, selectedTab === 'roi' && styles.activeTabText]}>
            ROI
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'monitoring' && styles.activeTab]}
          onPress={() => setSelectedTab('monitoring')}
        >
          <Text style={[styles.tabText, selectedTab === 'monitoring' && styles.activeTabText]}>
            Monitoring
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'optimization' && styles.activeTab]}
          onPress={() => setSelectedTab('optimization')}
        >
          <Text style={[styles.tabText, selectedTab === 'optimization' && styles.activeTabText]}>
            Optimization
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'roi' && renderROITab()}
        {selectedTab === 'monitoring' && renderMonitoringTab()}
        {selectedTab === 'optimization' && renderOptimizationTab()}
        
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
  metricsCard: {
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
  metricItem: {
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricName: {
    fontSize: 14,
    color: '#333',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  metricBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 4,
  },
  metricBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  metricTarget: {
    fontSize: 12,
    color: '#666',
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
  optimizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  optimizeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  optimizeButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  roiCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  roiSummary: {
    alignItems: 'center',
    marginTop: 16,
  },
  roiValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  roiLabel: {
    fontSize: 14,
    color: '#666',
  },
  roiComponentsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  roiComponents: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roiComponent: {
    width: (width - 80) / 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  roiComponentLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  roiComponentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  roiCalculationsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  roiCalculations: {
    marginTop: 16,
  },
  roiCalculation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  roiCalculationLabel: {
    fontSize: 14,
    color: '#666',
  },
  roiCalculationValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  monitoringCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  monitoringSummary: {
    alignItems: 'center',
    marginTop: 16,
  },
  monitoringValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  monitoringLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  monitoringConfidence: {
    fontSize: 12,
    color: '#666',
  },
  alertsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
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
  optimizationCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  optimizationSummary: {
    alignItems: 'center',
    marginTop: 16,
  },
  optimizationValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  optimizationLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  optimizationDetails: {
    marginTop: 16,
  },
  optimizationDetail: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  algorithmsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  algorithmItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  algorithmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  algorithmName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  algorithmStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  algorithmDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  algorithmType: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  recommendationsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  recommendationItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 8,
  },
  recommendationMessage: {
    fontSize: 14,
    color: '#333',
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

export default AdvancedAccuracyDashboard;













