/**
 * Seasonal Adjustments Dashboard Component - Batch 3
 * Displays seasonal adjustments, weather integration, and crop timing recommendations
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
import seasonalPriceService from '../services/seasonalPriceService';
import weatherIntegrationService from '../services/weatherIntegrationService';
import cropTimingService from '../services/cropTimingService';

const { width } = Dimensions.get('window');

const SeasonalAdjustmentsDashboard = () => {
  const [seasonalData, setSeasonalData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [cropTimingData, setCropTimingData] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('maize');
  const [selectedRegion, setSelectedRegion] = useState('Central');
  const [timingRecommendation, setTimingRecommendation] = useState(null);
  const [weatherAnalysis, setWeatherAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  const crops = [
    'maize', 'tomatoes', 'beans', 'coffee', 'banana',
    'onions', 'groundnuts', 'rice', 'cotton', 'sugarcane',
    'pineapple', 'mangoes', 'avocados', 'carrots', 'spinach',
    'millet', 'soybeans', 'cabbage', 'oranges'
  ];

  const regions = ['Northern', 'Eastern', 'Central', 'Western'];

  useEffect(() => {
    loadSeasonalData();
  }, []);

  useEffect(() => {
    if (selectedCrop && selectedRegion) {
      loadCropAnalysis();
    }
  }, [selectedCrop, selectedRegion]);

  const loadSeasonalData = async () => {
    try {
      setLoading(true);
      
      // Initialize services
      await seasonalPriceService.initialize();
      await weatherIntegrationService.initialize();
      await cropTimingService.initialize();
      
      // Load data
      const seasonal = seasonalPriceService.getAllSeasonalData();
      const weather = weatherIntegrationService.getAllWeatherData();
      const timing = cropTimingService.getAllCropTimingData();
      
      setSeasonalData(seasonal);
      setWeatherData(weather);
      setCropTimingData(timing);
      
    } catch (error) {
      console.error('❌ Failed to load seasonal data:', error);
      Alert.alert('Error', 'Failed to load seasonal adjustments data');
    } finally {
      setLoading(false);
    }
  };

  const loadCropAnalysis = async () => {
    try {
      // Get timing recommendation
      const timing = cropTimingService.getOptimalTimingRecommendation(selectedCrop, selectedRegion);
      setTimingRecommendation(timing);
      
      // Get weather analysis
      const weather = weatherIntegrationService.analyzeWeatherSuitability(selectedCrop, selectedRegion);
      setWeatherAnalysis(weather);
      
    } catch (error) {
      console.error('❌ Failed to load crop analysis:', error);
    }
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Seasonal Adjustments Overview</Text>
      
      {seasonalData && (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Current Season</Text>
          <Text style={styles.cardValue}>{seasonalData.current_season}</Text>
          <Text style={styles.cardSubtext}>Uganda Agricultural Calendar</Text>
        </View>
      )}
      
      {weatherData && (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Weather Status</Text>
          <Text style={styles.cardValue}>
            {weatherData.alerts?.length || 0} Active Alerts
          </Text>
          <Text style={styles.cardSubtext}>Weather monitoring active</Text>
        </View>
      )}
      
      <View style={styles.selectionContainer}>
        <Text style={styles.sectionTitle}>Crop Selection</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {crops.map((crop) => (
            <TouchableOpacity
              key={crop}
              style={[
                styles.selectionButton,
                selectedCrop === crop && styles.selectedButton
              ]}
              onPress={() => setSelectedCrop(crop)}
            >
              <Text style={[
                styles.selectionButtonText,
                selectedCrop === crop && styles.selectedButtonText
              ]}>
                {crop.charAt(0).toUpperCase() + crop.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.selectionContainer}>
        <Text style={styles.sectionTitle}>Region Selection</Text>
        <View style={styles.regionGrid}>
          {regions.map((region) => (
            <TouchableOpacity
              key={region}
              style={[
                styles.regionButton,
                selectedRegion === region && styles.selectedRegionButton
              ]}
              onPress={() => setSelectedRegion(region)}
            >
              <Text style={[
                styles.regionButtonText,
                selectedRegion === region && styles.selectedRegionButtonText
              ]}>
                {region}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderTimingTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Crop Timing Recommendations</Text>
      
      {timingRecommendation && (
        <View>
          <View style={styles.timingCard}>
            <Text style={styles.cardTitle}>Optimal Timing for {selectedCrop}</Text>
            <View style={styles.timingScore}>
              <Text style={styles.scoreValue}>
                {Math.round(timingRecommendation.timing_score * 100)}%
              </Text>
              <Text style={styles.scoreLabel}>Timing Score</Text>
            </View>
            
            <View style={styles.timingInfo}>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Current Season:</Text>
                <Text style={styles.timingValue}>{timingRecommendation.current_season}</Text>
              </View>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Growth Duration:</Text>
                <Text style={styles.timingValue}>{timingRecommendation.growth_duration}</Text>
              </View>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Optimal Planting:</Text>
                <Text style={styles.timingValue}>
                  {timingRecommendation.optimal_planting_times.join(', ')}
                </Text>
              </View>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Optimal Harvest:</Text>
                <Text style={styles.timingValue}>
                  {timingRecommendation.optimal_harvest_times.join(', ')}
                </Text>
              </View>
            </View>
          </View>
          
          {timingRecommendation.recommendations && (
            <View style={styles.recommendationsCard}>
              <Text style={styles.cardTitle}>Recommendations</Text>
              {timingRecommendation.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.recommendationHeader}>
                    <MaterialIcons 
                      name={rec.priority === 'high' ? 'warning' : 'info'} 
                      size={20} 
                      color={rec.priority === 'high' ? '#F44336' : '#2196F3'} 
                    />
                    <Text style={styles.recommendationType}>{rec.type.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.recommendationMessage}>{rec.message}</Text>
                  <Text style={styles.recommendationAction}>{rec.action}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderWeatherTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Weather Analysis</Text>
      
      {weatherAnalysis && (
        <View>
          <View style={styles.weatherCard}>
            <Text style={styles.cardTitle}>Weather Suitability for {selectedCrop}</Text>
            <View style={styles.weatherScore}>
              <Text style={styles.scoreValue}>
                {Math.round(weatherAnalysis.suitability_score * 100)}%
              </Text>
              <Text style={styles.scoreLabel}>Weather Suitability</Text>
            </View>
            
            <Text style={styles.weatherReason}>{weatherAnalysis.reason}</Text>
          </View>
          
          {weatherAnalysis.factors && (
            <View style={styles.factorsCard}>
              <Text style={styles.cardTitle}>Weather Factors</Text>
              
              <View style={styles.factorRow}>
                <Text style={styles.factorLabel}>Temperature:</Text>
                <Text style={styles.factorValue}>
                  {Math.round(weatherAnalysis.factors.temperature?.score * 100)}%
                </Text>
                <Text style={styles.factorStatus}>
                  {weatherAnalysis.factors.temperature?.status}
                </Text>
              </View>
              
              <View style={styles.factorRow}>
                <Text style={styles.factorLabel}>Humidity:</Text>
                <Text style={styles.factorValue}>
                  {Math.round(weatherAnalysis.factors.humidity?.score * 100)}%
                </Text>
                <Text style={styles.factorStatus}>
                  {weatherAnalysis.factors.humidity?.status}
                </Text>
              </View>
              
              <View style={styles.factorRow}>
                <Text style={styles.factorLabel}>Rainfall:</Text>
                <Text style={styles.factorValue}>
                  {Math.round(weatherAnalysis.factors.rainfall?.score * 100)}%
                </Text>
                <Text style={styles.factorStatus}>
                  {weatherAnalysis.factors.rainfall?.status}
                </Text>
              </View>
              
              <View style={styles.factorRow}>
                <Text style={styles.factorLabel}>Conditions:</Text>
                <Text style={styles.factorValue}>
                  {Math.round(weatherAnalysis.factors.conditions?.score * 100)}%
                </Text>
                <Text style={styles.factorStatus}>
                  {weatherAnalysis.factors.conditions?.status}
                </Text>
              </View>
            </View>
          )}
          
          {weatherAnalysis.recommendations && (
            <View style={styles.recommendationsCard}>
              <Text style={styles.cardTitle}>Weather Recommendations</Text>
              {weatherAnalysis.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.recommendationHeader}>
                    <MaterialIcons name="wb_sunny" size={20} color="#FF9800" />
                    <Text style={styles.recommendationType}>{rec.type.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.recommendationMessage}>{rec.message}</Text>
                  <Text style={styles.recommendationAction}>{rec.message}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderSeasonalTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Seasonal Adjustments</Text>
      
      {seasonalData && (
        <View>
          <View style={styles.seasonalCard}>
            <Text style={styles.cardTitle}>Seasonal Multipliers</Text>
            
            {Object.entries(seasonalData.seasonal_multipliers).map(([season, data]) => (
              <View key={season} style={styles.seasonalRow}>
                <Text style={styles.seasonalLabel}>{season}:</Text>
                <Text style={styles.seasonalValue}>
                  {data.multiplier}x
                </Text>
                <Text style={styles.seasonalDescription}>{data.description}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.seasonalCard}>
            <Text style={styles.cardTitle}>Weather Factors</Text>
            
            {Object.entries(seasonalData.weather_factors).map(([condition, data]) => (
              <View key={condition} style={styles.seasonalRow}>
                <Text style={styles.seasonalLabel}>{condition}:</Text>
                <Text style={styles.seasonalValue}>
                  {data.multiplier}x
                </Text>
                <Text style={styles.seasonalDescription}>{data.description}</Text>
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
        <Text style={styles.loadingText}>Loading seasonal adjustments data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seasonal Adjustments Dashboard</Text>
      
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
          style={[styles.tab, selectedTab === 'timing' && styles.activeTab]}
          onPress={() => setSelectedTab('timing')}
        >
          <Text style={[styles.tabText, selectedTab === 'timing' && styles.activeTabText]}>
            Timing
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'weather' && styles.activeTab]}
          onPress={() => setSelectedTab('weather')}
        >
          <Text style={[styles.tabText, selectedTab === 'weather' && styles.activeTabText]}>
            Weather
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'seasonal' && styles.activeTab]}
          onPress={() => setSelectedTab('seasonal')}
        >
          <Text style={[styles.tabText, selectedTab === 'seasonal' && styles.activeTabText]}>
            Seasonal
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'timing' && renderTimingTab()}
        {selectedTab === 'weather' && renderWeatherTab()}
        {selectedTab === 'seasonal' && renderSeasonalTab()}
        
        <TouchableOpacity style={styles.refreshButton} onPress={loadSeasonalData}>
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
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  cardSubtext: {
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
  selectionButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  selectionButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedButtonText: {
    color: '#fff',
  },
  regionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  regionButton: {
    width: (width - 80) / 2,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedRegionButton: {
    backgroundColor: '#4CAF50',
  },
  regionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedRegionButtonText: {
    color: '#fff',
  },
  timingCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  timingScore: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  timingInfo: {
    marginTop: 16,
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timingLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  timingValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  recommendationsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
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
    marginBottom: 4,
  },
  recommendationAction: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  weatherCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  weatherScore: {
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherReason: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  factorsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  factorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  factorLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  factorValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  factorStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  seasonalCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  seasonalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seasonalLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  seasonalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginRight: 8,
  },
  seasonalDescription: {
    fontSize: 12,
    color: '#666',
    flex: 2,
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
});

export default SeasonalAdjustmentsDashboard;











