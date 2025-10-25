/**
 * Regional Pricing Dashboard Component - Batch 2
 * Displays regional pricing variations and market insights
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
import regionalPriceService from '../services/regionalPriceService';
import seasonalPriceService from '../services/seasonalPriceService';

const { width } = Dimensions.get('window');

const RegionalPricingDashboard = () => {
  const [regionalData, setRegionalData] = useState(null);
  const [seasonalData, setSeasonalData] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('maize');
  const [selectedRegion, setSelectedRegion] = useState('Central');
  const [priceCalculation, setPriceCalculation] = useState(null);
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
    loadRegionalData();
  }, []);

  useEffect(() => {
    if (selectedCrop && selectedRegion) {
      calculateRegionalPrice();
    }
  }, [selectedCrop, selectedRegion]);

  const loadRegionalData = async () => {
    try {
      setLoading(true);
      
      // Initialize services
      await regionalPriceService.initialize();
      await seasonalPriceService.initialize();
      
      // Load data
      const regional = regionalPriceService.getAllRegionalData();
      const seasonal = seasonalPriceService.getAllSeasonalData();
      
      setRegionalData(regional);
      setSeasonalData(seasonal);
      
    } catch (error) {
      console.error('❌ Failed to load regional data:', error);
      Alert.alert('Error', 'Failed to load regional pricing data');
    } finally {
      setLoading(false);
    }
  };

  const calculateRegionalPrice = async () => {
    try {
      const basePrice = 1000; // Base price in UGX per kg
      const quantity = 100; // 100 kg
      
      // Calculate regional price
      const regionalPrice = regionalPriceService.calculateRegionalPrice(
        selectedCrop,
        selectedRegion,
        quantity
      );
      
      // Calculate seasonal price
      const seasonalPrice = seasonalPriceService.calculateSeasonalPrice(
        selectedCrop,
        basePrice
      );
      
      // Get regional suitability
      const suitability = regionalPriceService.getRegionalSuitability(
        selectedCrop,
        selectedRegion
      );
      
      // Get seasonal insights
      const seasonalInsights = seasonalPriceService.getSeasonalMarketInsights(selectedCrop);
      
      setPriceCalculation({
        regional: regionalPrice,
        seasonal: seasonalPrice,
        suitability: suitability,
        seasonalInsights: seasonalInsights
      });
      
    } catch (error) {
      console.error('❌ Failed to calculate regional price:', error);
    }
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Regional Pricing Overview</Text>
      
      {regionalData && (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Current Location</Text>
          <Text style={styles.cardValue}>
            {regionalData.user_location?.region || 'Unknown'}
          </Text>
          <Text style={styles.cardSubtext}>
            Lat: {regionalData.user_location?.latitude?.toFixed(4)}, 
            Lng: {regionalData.user_location?.longitude?.toFixed(4)}
          </Text>
        </View>
      )}
      
      {seasonalData && (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Current Season</Text>
          <Text style={styles.cardValue}>{seasonalData.current_season}</Text>
          <Text style={styles.cardSubtext}>Uganda Agricultural Calendar</Text>
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

  const renderPricingTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Price Calculations</Text>
      
      {priceCalculation && (
        <View>
          <View style={styles.priceCard}>
            <Text style={styles.cardTitle}>Regional Price</Text>
            <Text style={styles.priceValue}>
              UGX {priceCalculation.regional.final_price?.toLocaleString() || '0'}
            </Text>
            <Text style={styles.priceSubtext}>
              for {priceCalculation.regional.quantity}kg in {selectedRegion}
            </Text>
            
            <View style={styles.priceBreakdown}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Base Price:</Text>
                <Text style={styles.breakdownValue}>
                  UGX {priceCalculation.regional.total_price?.toLocaleString()}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Transport Cost:</Text>
                <Text style={styles.breakdownValue}>
                  UGX {priceCalculation.regional.transport_cost?.toLocaleString()}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Regional Multiplier:</Text>
                <Text style={styles.breakdownValue}>
                  {priceCalculation.regional.multiplier?.toFixed(2)}x
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.priceCard}>
            <Text style={styles.cardTitle}>Seasonal Price</Text>
            <Text style={styles.priceValue}>
              UGX {priceCalculation.seasonal.seasonal_price?.toLocaleString() || '0'}
            </Text>
            <Text style={styles.priceSubtext}>
              Base price adjusted for {seasonalData?.current_season}
            </Text>
            
            <View style={styles.priceBreakdown}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Base Price:</Text>
                <Text style={styles.breakdownValue}>
                  UGX {priceCalculation.seasonal.base_price?.toLocaleString()}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Seasonal Multiplier:</Text>
                <Text style={styles.breakdownValue}>
                  {priceCalculation.seasonal.seasonal_multiplier?.toFixed(2)}x
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Weather Multiplier:</Text>
                <Text style={styles.breakdownValue}>
                  {priceCalculation.seasonal.weather_multiplier?.toFixed(2)}x
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const renderSuitabilityTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Regional Suitability</Text>
      
      {priceCalculation && (
        <View>
          <View style={styles.suitabilityCard}>
            <Text style={styles.cardTitle}>Suitability for {selectedRegion}</Text>
            <View style={styles.suitabilityScore}>
              <Text style={styles.scoreValue}>
                {Math.round(priceCalculation.suitability.suitability_score * 100)}%
              </Text>
              <Text style={styles.scoreLabel}>Suitability Score</Text>
            </View>
            <Text style={styles.suitabilityReason}>
              {priceCalculation.suitability.reason}
            </Text>
            
            {priceCalculation.suitability.recommended_regions && (
              <View style={styles.recommendedRegions}>
                <Text style={styles.recommendedTitle}>Recommended Regions:</Text>
                {priceCalculation.suitability.recommended_regions.map((region, index) => (
                  <Text key={index} style={styles.recommendedRegion}>
                    • {region}
                  </Text>
                ))}
              </View>
            )}
          </View>
          
          {priceCalculation.seasonalInsights && (
            <View style={styles.insightsCard}>
              <Text style={styles.cardTitle}>Seasonal Insights</Text>
              <View style={styles.insightRow}>
                <Text style={styles.insightLabel}>Market Condition:</Text>
                <Text style={styles.insightValue}>
                  {priceCalculation.seasonalInsights.market_condition}
                </Text>
              </View>
              <View style={styles.insightRow}>
                <Text style={styles.insightLabel}>Demand Level:</Text>
                <Text style={styles.insightValue}>
                  {priceCalculation.seasonalInsights.seasonal_insights?.demand_level}
                </Text>
              </View>
              <View style={styles.insightRow}>
                <Text style={styles.insightLabel}>Supply Level:</Text>
                <Text style={styles.insightValue}>
                  {priceCalculation.seasonalInsights.seasonal_insights?.supply_level}
                </Text>
              </View>
              <View style={styles.insightRow}>
                <Text style={styles.insightLabel}>Price Trend:</Text>
                <Text style={styles.insightValue}>
                  {priceCalculation.seasonalInsights.price_trend}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading regional pricing data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Regional Pricing Dashboard</Text>
      
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
          style={[styles.tab, selectedTab === 'pricing' && styles.activeTab]}
          onPress={() => setSelectedTab('pricing')}
        >
          <Text style={[styles.tabText, selectedTab === 'pricing' && styles.activeTabText]}>
            Pricing
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'suitability' && styles.activeTab]}
          onPress={() => setSelectedTab('suitability')}
        >
          <Text style={[styles.tabText, selectedTab === 'suitability' && styles.activeTabText]}>
            Suitability
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'pricing' && renderPricingTab()}
        {selectedTab === 'suitability' && renderSuitabilityTab()}
        
        <TouchableOpacity style={styles.refreshButton} onPress={loadRegionalData}>
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
  priceCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  priceSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  priceBreakdown: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  suitabilityCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  suitabilityScore: {
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
  suitabilityReason: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  recommendedRegions: {
    marginTop: 16,
  },
  recommendedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  recommendedRegion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  insightsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  insightLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  insightValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
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

export default RegionalPricingDashboard;




