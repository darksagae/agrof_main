/**
 * ML Training Dashboard Component - Batch 5
 * Displays ML model training, evaluation, and performance metrics
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
import mlModelTrainingService from '../services/mlModelTrainingService';
import featureEngineeringService from '../services/featureEngineeringService';

const { width } = Dimensions.get('window');

const MLTrainingDashboard = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [trainingStats, setTrainingStats] = useState(null);
  const [featureInfo, setFeatureInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [trainingModels, setTrainingModels] = useState(false);

  useEffect(() => {
    loadMLData();
  }, []);

  const loadMLData = async () => {
    try {
      setLoading(true);
      
      // Initialize services
      await mlModelTrainingService.initialize();
      await featureEngineeringService.initialize();
      
      // Load model information
      const models = mlModelTrainingService.getAllModelInfo();
      setModelInfo(models);
      
      // Load training statistics
      const stats = mlModelTrainingService.getTrainingStatistics();
      setTrainingStats(stats);
      
      // Load feature information
      const features = featureEngineeringService.getAllFeatureInfo();
      setFeatureInfo(features);
      
    } catch (error) {
      console.error('❌ Failed to load ML data:', error);
      Alert.alert('Error', 'Failed to load ML training data');
    } finally {
      setLoading(false);
    }
  };

  const trainAllModels = async () => {
    try {
      setTrainingModels(true);
      
      const result = await mlModelTrainingService.trainAllModels();
      
      if (result.success) {
        Alert.alert('Success', `Successfully trained ${result.trained_models} out of ${result.total_models} models`);
        loadMLData(); // Reload data to show updated results
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('❌ Failed to train models:', error);
      Alert.alert('Error', 'Failed to train models');
    } finally {
      setTrainingModels(false);
    }
  };

  const trainModel = async (modelId) => {
    try {
      const result = await mlModelTrainingService.trainModel(modelId);
      
      if (result.success) {
        Alert.alert('Success', `Model ${modelId} trained successfully with accuracy: ${(result.accuracy * 100).toFixed(1)}%`);
        loadMLData();
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error(`❌ Failed to train model ${modelId}:`, error);
      Alert.alert('Error', `Failed to train model ${modelId}`);
    }
  };

  const evaluateModel = (modelId) => {
    const result = mlModelTrainingService.evaluateModel(modelId);
    
    if (result.success) {
      Alert.alert(
        'Model Evaluation',
        `Model: ${modelId}\nAccuracy: ${(result.evaluation.accuracy * 100).toFixed(1)}%\nGrade: ${result.evaluation.performance_grade}\nStatus: ${result.evaluation.status}`
      );
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>ML Training Overview</Text>
      
      {trainingStats && (
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Training Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trainingStats.total_models}</Text>
              <Text style={styles.statLabel}>Total Models</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trainingStats.trained_models}</Text>
              <Text style={styles.statLabel}>Trained</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trainingStats.untrained_models}</Text>
              <Text style={styles.statLabel}>Untrained</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {(trainingStats.average_accuracy * 100).toFixed(1)}%
              </Text>
              <Text style={styles.statLabel}>Avg Accuracy</Text>
            </View>
          </View>
        </View>
      )}
      
      <TouchableOpacity 
        style={[styles.trainButton, trainingModels && styles.trainButtonDisabled]}
        onPress={trainAllModels}
        disabled={trainingModels}
      >
        {trainingModels ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <MaterialIcons name="play_arrow" size={20} color="#fff" />
        )}
        <Text style={styles.trainButtonText}>
          {trainingModels ? 'Training Models...' : 'Train All Models'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderModelsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>ML Models</Text>
      
      {modelInfo && modelInfo.models && (
        <View>
          {Object.entries(modelInfo.models).map(([modelId, model]) => (
            <View key={modelId} style={styles.modelCard}>
              <View style={styles.modelHeader}>
                <Text style={styles.modelName}>{model.name}</Text>
                <View style={styles.modelStatus}>
                  <View style={[
                    styles.statusIndicator,
                    { backgroundColor: model.status === 'trained' ? '#4CAF50' : '#FF9800' }
                  ]} />
                  <Text style={styles.statusText}>
                    {model.status === 'trained' ? 'Trained' : 'Untrained'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.modelDetails}>
                <View style={styles.modelDetailRow}>
                  <Text style={styles.modelDetailLabel}>Type:</Text>
                  <Text style={styles.modelDetailValue}>{model.type}</Text>
                </View>
                <View style={styles.modelDetailRow}>
                  <Text style={styles.modelDetailLabel}>Algorithm:</Text>
                  <Text style={styles.modelDetailValue}>{model.algorithm}</Text>
                </View>
                <View style={styles.modelDetailRow}>
                  <Text style={styles.modelDetailLabel}>Accuracy:</Text>
                  <Text style={styles.modelDetailValue}>
                    {model.status === 'trained' ? `${(model.accuracy * 100).toFixed(1)}%` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.modelDetailRow}>
                  <Text style={styles.modelDetailLabel}>Training Data:</Text>
                  <Text style={styles.modelDetailValue}>{model.training_data_size} samples</Text>
                </View>
              </View>
              
              <View style={styles.modelActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => trainModel(modelId)}
                >
                  <MaterialIcons name="play_arrow" size={16} color="#4CAF50" />
                  <Text style={styles.actionButtonText}>Train</Text>
                </TouchableOpacity>
                
                {model.status === 'trained' && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => evaluateModel(modelId)}
                  >
                    <MaterialIcons name="assessment" size={16} color="#2196F3" />
                    <Text style={styles.actionButtonText}>Evaluate</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderFeaturesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Feature Engineering</Text>
      
      {featureInfo && (
        <View>
          <View style={styles.featuresCard}>
            <Text style={styles.cardTitle}>Feature Sets</Text>
            {Object.entries(featureInfo.feature_sets).map(([setName, features]) => (
              <View key={setName} style={styles.featureSet}>
                <Text style={styles.featureSetName}>{setName.replace('_', ' ').toUpperCase()}</Text>
                <View style={styles.featureCategories}>
                  <View style={styles.featureCategory}>
                    <Text style={styles.featureCategoryLabel}>Categorical:</Text>
                    <Text style={styles.featureCategoryValue}>{features.categorical.join(', ')}</Text>
                  </View>
                  <View style={styles.featureCategory}>
                    <Text style={styles.featureCategoryLabel}>Numerical:</Text>
                    <Text style={styles.featureCategoryValue}>{features.numerical.join(', ')}</Text>
                  </View>
                  <View style={styles.featureCategory}>
                    <Text style={styles.featureCategoryLabel}>Boolean:</Text>
                    <Text style={styles.featureCategoryValue}>{features.boolean.join(', ')}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          
          <View style={styles.featuresCard}>
            <Text style={styles.cardTitle}>Feature Importance</Text>
            {Object.entries(featureInfo.feature_importance).map(([feature, importance]) => (
              <View key={feature} style={styles.importanceItem}>
                <Text style={styles.importanceLabel}>{feature.replace('_', ' ')}</Text>
                <View style={styles.importanceBar}>
                  <View 
                    style={[
                      styles.importanceBarFill,
                      { width: `${importance * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.importanceValue}>
                  {(importance * 100).toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderMetricsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Model Metrics</Text>
      
      {modelInfo && modelInfo.metrics && (
        <View>
          {Object.entries(modelInfo.metrics).map(([modelId, metrics]) => (
            <View key={modelId} style={styles.metricsCard}>
              <Text style={styles.cardTitle}>{modelId.replace('_', ' ').toUpperCase()}</Text>
              
              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Accuracy</Text>
                  <Text style={styles.metricValue}>
                    {(metrics.accuracy * 100).toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Training Time</Text>
                  <Text style={styles.metricValue}>
                    {metrics.training_time}ms
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Iterations</Text>
                  <Text style={styles.metricValue}>
                    {metrics.iterations}
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Loss</Text>
                  <Text style={styles.metricValue}>
                    {metrics.loss.toFixed(4)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.metricStatus}>
                <MaterialIcons 
                  name={metrics.convergence ? "check_circle" : "error"} 
                  size={16} 
                  color={metrics.convergence ? "#4CAF50" : "#F44336"} 
                />
                <Text style={styles.metricStatusText}>
                  {metrics.convergence ? 'Converged' : 'Not Converged'}
                </Text>
              </View>
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
        <Text style={styles.loadingText}>Loading ML training data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ML Training Dashboard</Text>
      
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
          style={[styles.tab, selectedTab === 'models' && styles.activeTab]}
          onPress={() => setSelectedTab('models')}
        >
          <Text style={[styles.tabText, selectedTab === 'models' && styles.activeTabText]}>
            Models
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'features' && styles.activeTab]}
          onPress={() => setSelectedTab('features')}
        >
          <Text style={[styles.tabText, selectedTab === 'features' && styles.activeTabText]}>
            Features
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'metrics' && styles.activeTab]}
          onPress={() => setSelectedTab('metrics')}
        >
          <Text style={[styles.tabText, selectedTab === 'metrics' && styles.activeTabText]}>
            Metrics
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'models' && renderModelsTab()}
        {selectedTab === 'features' && renderFeaturesTab()}
        {selectedTab === 'metrics' && renderMetricsTab()}
        
        <TouchableOpacity style={styles.refreshButton} onPress={loadMLData}>
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
  statsCard: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: (width - 80) / 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  trainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  trainButtonDisabled: {
    backgroundColor: '#ccc',
  },
  trainButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  modelCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  modelStatus: {
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
  modelDetails: {
    marginBottom: 16,
  },
  modelDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modelDetailLabel: {
    fontSize: 14,
    color: '#666',
  },
  modelDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  modelActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 4,
  },
  featuresCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  featureSet: {
    marginBottom: 16,
  },
  featureSetName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  featureCategories: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12,
  },
  featureCategory: {
    marginBottom: 8,
  },
  featureCategoryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  featureCategoryValue: {
    fontSize: 12,
    color: '#333',
  },
  importanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  importanceLabel: {
    fontSize: 14,
    color: '#333',
    width: 120,
  },
  importanceBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  importanceBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  importanceValue: {
    fontSize: 12,
    color: '#666',
    width: 40,
    textAlign: 'right',
  },
  metricsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    width: (width - 80) / 2,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  metricStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricStatusText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
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

export default MLTrainingDashboard;




