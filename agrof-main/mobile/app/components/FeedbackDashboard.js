/**
 * Feedback Dashboard Component - Batch 4
 * Displays user feedback, success rates, and recommendation refinement insights
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
  Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import userFeedbackService from '../services/userFeedbackService';
import recommendationRefinementService from '../services/recommendationRefinementService';

const { width } = Dimensions.get('window');

const FeedbackDashboard = () => {
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [refinementInsights, setRefinementInsights] = useState(null);
  const [successRateData, setSuccessRateData] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    recommendation_id: '',
    crop_id: '',
    region: '',
    user_id: 'user_001',
    accuracy: 0,
    relevance: 0,
    price: 0,
    availability: 0,
    quality: 0,
    delivery: 0,
    overall: 0
  });

  const crops = [
    'maize', 'tomatoes', 'beans', 'coffee', 'banana',
    'onions', 'groundnuts', 'rice', 'cotton', 'sugarcane',
    'pineapple', 'mangoes', 'avocados', 'carrots', 'spinach',
    'millet', 'soybeans', 'cabbage', 'oranges'
  ];

  const regions = ['Northern', 'Eastern', 'Central', 'Western'];

  useEffect(() => {
    loadFeedbackData();
  }, []);

  const loadFeedbackData = async () => {
    try {
      setLoading(true);
      
      // Initialize services
      await userFeedbackService.initialize();
      await recommendationRefinementService.initialize();
      
      // Load feedback statistics
      const stats = userFeedbackService.getFeedbackStatistics();
      setFeedbackStats(stats);
      
      // Load refinement insights
      const insights = recommendationRefinementService.getRefinementInsights();
      setRefinementInsights(insights);
      
      // Load success rate data
      const successData = {};
      crops.forEach(crop => {
        regions.forEach(region => {
          const key = `${crop}_${region}`;
          successData[key] = userFeedbackService.getSuccessRate(crop, region);
        });
      });
      setSuccessRateData(successData);
      
      // Load user preferences
      const prefs = userFeedbackService.getUserPreferences('user_001');
      setUserPreferences(prefs);
      
    } catch (error) {
      console.error('❌ Failed to load feedback data:', error);
      Alert.alert('Error', 'Failed to load feedback data');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    try {
      const result = await userFeedbackService.submitFeedback(
        feedbackForm.recommendation_id,
        feedbackForm
      );

      if (result.success) {
        Alert.alert('Success', 'Feedback submitted successfully');
        setShowFeedbackModal(false);
        setFeedbackForm({
          recommendation_id: '',
          crop_id: '',
          region: '',
          user_id: 'user_001',
          accuracy: 0,
          relevance: 0,
          price: 0,
          availability: 0,
          quality: 0,
          delivery: 0,
          overall: 0
        });
        loadFeedbackData();
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('❌ Failed to submit feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback');
    }
  };

  const renderRatingInput = (label, value, onChange) => (
    <View style={styles.ratingInput}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.ratingButtons}>
        {[1, 2, 3, 4, 5].map(rating => (
          <TouchableOpacity
            key={rating}
            style={[
              styles.ratingButton,
              value >= rating && styles.ratingButtonActive
            ]}
            onPress={() => onChange(rating)}
          >
            <MaterialIcons 
              name="star" 
              size={20} 
              color={value >= rating ? '#FFD700' : '#ccc'} 
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFeedbackModal = () => (
    <Modal
      visible={showFeedbackModal}
      animationType="slide"
      onRequestClose={() => setShowFeedbackModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Submit Feedback</Text>
          <TouchableOpacity onPress={() => setShowFeedbackModal(false)}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Recommendation ID</Text>
            <Text style={styles.formInput}>
              {feedbackForm.recommendation_id || 'rec_001'}
            </Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Crop</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {crops.map(crop => (
                <TouchableOpacity
                  key={crop}
                  style={[
                    styles.formButton,
                    feedbackForm.crop_id === crop && styles.formButtonActive
                  ]}
                  onPress={() => setFeedbackForm({...feedbackForm, crop_id: crop})}
                >
                  <Text style={[
                    styles.formButtonText,
                    feedbackForm.crop_id === crop && styles.formButtonTextActive
                  ]}>
                    {crop.charAt(0).toUpperCase() + crop.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Region</Text>
            <View style={styles.regionGrid}>
              {regions.map(region => (
                <TouchableOpacity
                  key={region}
                  style={[
                    styles.formButton,
                    feedbackForm.region === region && styles.formButtonActive
                  ]}
                  onPress={() => setFeedbackForm({...feedbackForm, region: region})}
                >
                  <Text style={[
                    styles.formButtonText,
                    feedbackForm.region === region && styles.formButtonTextActive
                  ]}>
                    {region}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {renderRatingInput('Accuracy', feedbackForm.accuracy, (value) => 
            setFeedbackForm({...feedbackForm, accuracy: value})
          )}
          
          {renderRatingInput('Relevance', feedbackForm.relevance, (value) => 
            setFeedbackForm({...feedbackForm, relevance: value})
          )}
          
          {renderRatingInput('Price', feedbackForm.price, (value) => 
            setFeedbackForm({...feedbackForm, price: value})
          )}
          
          {renderRatingInput('Availability', feedbackForm.availability, (value) => 
            setFeedbackForm({...feedbackForm, availability: value})
          )}
          
          {renderRatingInput('Quality', feedbackForm.quality, (value) => 
            setFeedbackForm({...feedbackForm, quality: value})
          )}
          
          {renderRatingInput('Delivery', feedbackForm.delivery, (value) => 
            setFeedbackForm({...feedbackForm, delivery: value})
          )}
          
          {renderRatingInput('Overall Satisfaction', feedbackForm.overall, (value) => 
            setFeedbackForm({...feedbackForm, overall: value})
          )}
        </ScrollView>
        
        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={submitFeedback}
          >
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Feedback Overview</Text>
      
      {feedbackStats && (
        <View>
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>Feedback Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{feedbackStats.total_feedback}</Text>
                <Text style={styles.statLabel}>Total Feedback</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {feedbackStats.average_rating.toFixed(1)}
                </Text>
                <Text style={styles.statLabel}>Avg Rating</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.round(feedbackStats.success_rate * 100)}%
                </Text>
                <Text style={styles.statLabel}>Success Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{feedbackStats.successful_recommendations}</Text>
                <Text style={styles.statLabel}>Successful</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>Rating Distribution</Text>
            <View style={styles.ratingDistribution}>
              {Object.entries(feedbackStats.rating_distribution).map(([rating, count]) => (
                <View key={rating} style={styles.ratingBar}>
                  <Text style={styles.ratingLabel}>{rating}★</Text>
                  <View style={styles.ratingBarContainer}>
                    <View 
                      style={[
                        styles.ratingBarFill,
                        { width: `${(count / feedbackStats.total_feedback) * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.ratingCount}>{count}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.submitFeedbackButton}
        onPress={() => setShowFeedbackModal(true)}
      >
        <MaterialIcons name="feedback" size={20} color="#4CAF50" />
        <Text style={styles.submitFeedbackText}>Submit New Feedback</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSuccessRateTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Success Rate Analysis</Text>
      
      {successRateData && (
        <View>
          <View style={styles.successRateCard}>
            <Text style={styles.cardTitle}>Success Rate by Crop & Region</Text>
            <ScrollView style={styles.successRateList}>
              {Object.entries(successRateData).map(([key, data]) => (
                <View key={key} style={styles.successRateItem}>
                  <View style={styles.successRateHeader}>
                    <Text style={styles.successRateLabel}>
                      {data.crop_id} - {data.region}
                    </Text>
                    <Text style={styles.successRateValue}>
                      {Math.round(data.success_rate * 100)}%
                    </Text>
                  </View>
                  <View style={styles.successRateDetails}>
                    <Text style={styles.successRateDetail}>
                      Total: {data.total_recommendations}
                    </Text>
                    <Text style={styles.successRateDetail}>
                      Successful: {data.successful_recommendations}
                    </Text>
                    <Text style={styles.successRateDetail}>
                      Failed: {data.failed_recommendations}
                    </Text>
                    <Text style={styles.successRateDetail}>
                      Avg Rating: {data.average_rating.toFixed(1)}
                    </Text>
                  </View>
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>
                      Confidence: {data.confidence}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );

  const renderRefinementTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Refinement Insights</Text>
      
      {refinementInsights && (
        <View>
          <View style={styles.insightsCard}>
            <Text style={styles.cardTitle}>Performance Metrics</Text>
            {Object.entries(refinementInsights.performance_metrics).map(([metric, data]) => (
              <View key={metric} style={styles.metricItem}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricLabel}>{metric.charAt(0).toUpperCase() + metric.slice(1)}</Text>
                  <Text style={styles.metricValue}>
                    {Math.round(data.current * 100)}%
                  </Text>
                </View>
                <View style={styles.metricBar}>
                  <View 
                    style={[
                      styles.metricBarFill,
                      { width: `${data.current * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.metricTarget}>
                  Target: {Math.round(data.target * 100)}%
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.insightsCard}>
            <Text style={styles.cardTitle}>Insights & Recommendations</Text>
            {refinementInsights.insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <View style={styles.insightHeader}>
                  <MaterialIcons 
                    name={insight.type === 'improvement_needed' ? 'warning' : 'check_circle'} 
                    size={20} 
                    color={insight.type === 'improvement_needed' ? '#F44336' : '#4CAF50'} 
                  />
                  <Text style={styles.insightType}>{insight.type.replace('_', ' ').toUpperCase()}</Text>
                </View>
                <Text style={styles.insightMessage}>
                  {insight.message || `${insight.metric}: ${insight.current.toFixed(2)} (Target: ${insight.target.toFixed(2)})`}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderPreferencesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>User Preferences</Text>
      
      {userPreferences && (
        <View>
          <View style={styles.preferencesCard}>
            <Text style={styles.cardTitle}>User Preferences Analysis</Text>
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Price Sensitivity</Text>
              <View style={styles.preferenceBar}>
                <View 
                  style={[
                    styles.preferenceBarFill,
                    { width: `${userPreferences.preferences.price_sensitivity * 100}%` }
                  ]}
                />
              </View>
              <Text style={styles.preferenceValue}>
                {userPreferences.preferences.price_sensitivity.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Quality Preference</Text>
              <View style={styles.preferenceBar}>
                <View 
                  style={[
                    styles.preferenceBarFill,
                    { width: `${userPreferences.preferences.quality_preference * 100}%` }
                  ]}
                />
              </View>
              <Text style={styles.preferenceValue}>
                {userPreferences.preferences.quality_preference.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Availability Preference</Text>
              <View style={styles.preferenceBar}>
                <View 
                  style={[
                    styles.preferenceBarFill,
                    { width: `${userPreferences.preferences.availability_preference * 100}%` }
                  ]}
                />
              </View>
              <Text style={styles.preferenceValue}>
                {userPreferences.preferences.availability_preference.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Delivery Preference</Text>
              <View style={styles.preferenceBar}>
                <View 
                  style={[
                    styles.preferenceBarFill,
                    { width: `${userPreferences.preferences.delivery_preference * 100}%` }
                  ]}
                />
              </View>
              <Text style={styles.preferenceValue}>
                {userPreferences.preferences.delivery_preference.toFixed(2)}
              </Text>
            </View>
          </View>
          
          <View style={styles.preferencesCard}>
            <Text style={styles.cardTitle}>Crop Preferences</Text>
            {Object.entries(userPreferences.preferences.crop_preferences).map(([crop, preference]) => (
              <View key={crop} style={styles.cropPreferenceItem}>
                <Text style={styles.cropPreferenceLabel}>
                  {crop.charAt(0).toUpperCase() + crop.slice(1)}
                </Text>
                <View style={styles.cropPreferenceBar}>
                  <View 
                    style={[
                      styles.cropPreferenceBarFill,
                      { width: `${preference * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.cropPreferenceValue}>
                  {preference.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading feedback data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback Dashboard</Text>
      
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
          style={[styles.tab, selectedTab === 'success' && styles.activeTab]}
          onPress={() => setSelectedTab('success')}
        >
          <Text style={[styles.tabText, selectedTab === 'success' && styles.activeTabText]}>
            Success Rate
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'refinement' && styles.activeTab]}
          onPress={() => setSelectedTab('refinement')}
        >
          <Text style={[styles.tabText, selectedTab === 'refinement' && styles.activeTabText]}>
            Refinement
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'preferences' && styles.activeTab]}
          onPress={() => setSelectedTab('preferences')}
        >
          <Text style={[styles.tabText, selectedTab === 'preferences' && styles.activeTabText]}>
            Preferences
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'success' && renderSuccessRateTab()}
        {selectedTab === 'refinement' && renderRefinementTab()}
        {selectedTab === 'preferences' && renderPreferencesTab()}
        
        <TouchableOpacity style={styles.refreshButton} onPress={loadFeedbackData}>
          <MaterialIcons name="refresh" size={20} color="#4CAF50" />
          <Text style={styles.refreshText}>Refresh Data</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {renderFeedbackModal()}
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
  ratingDistribution: {
    marginTop: 16,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#333',
    width: 40,
  },
  ratingBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginHorizontal: 8,
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
    width: 30,
    textAlign: 'right',
  },
  submitFeedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  submitFeedbackText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  successRateCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  successRateList: {
    maxHeight: 400,
  },
  successRateItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  successRateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'Polite',
    marginBottom: 8,
  },
  successRateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  successRateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  successRateDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  successRateDetail: {
    fontSize: 12,
    color: '#666',
    marginRight: 16,
  },
  confidenceBadge: {
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
    padding: 4,
    alignSelf: 'flex-start',
  },
  confidenceText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  insightsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
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
  metricLabel: {
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
  },
  preferencesCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  preferenceItem: {
    marginBottom: 16,
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  preferenceBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 4,
  },
  preferenceBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  preferenceValue: {
    fontSize: 12,
    color: '#666',
  },
  cropPreferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cropPreferenceLabel: {
    fontSize: 14,
    color: '#333',
    width: 100,
  },
  cropPreferenceBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  cropPreferenceBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  cropPreferenceValue: {
    fontSize: 12,
    color: '#666',
    width: 40,
    textAlign: 'right',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    fontSize: 16,
    color: '#666',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  formButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  formButtonActive: {
    backgroundColor: '#4CAF50',
  },
  formButtonText: {
    fontSize: 14,
    color: '#666',
  },
  formButtonTextActive: {
    color: '#fff',
  },
  regionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modalFooter: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  ratingInput: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  ratingButtons: {
    flexDirection: 'row',
  },
  ratingButton: {
    marginRight: 8,
  },
  ratingButtonActive: {
    // Active state handled by star color
  },
});

export default FeedbackDashboard;














