import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Title, Paragraph, Chip, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
// LinearGradient not used in this component

import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

const SmartFarmingDashboard = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate loading dashboard data
      const data = {
        soilHealth: {
          score: 85,
          level: 'Good',
          moisture: 65,
          ph: 6.8,
          nutrients: 'Balanced'
        },
        weather: {
          temperature: 28,
          humidity: 70,
          rainfall: 15,
          forecast: 'Sunny'
        },
        crops: {
          total: 5,
          healthy: 4,
          diseased: 1,
          ready: 2
        },
        recommendations: [
          'Apply fertilizer in 3 days',
          'Monitor soil moisture levels',
          'Check for pest activity'
        ]
      };
      
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const renderSoilHealthCard = () => {
    if (!dashboardData?.soilHealth) return null;

    const { soilHealth } = dashboardData;
    const getScoreColor = (score) => {
      if (score >= 80) return '#4CAF50';
      if (score >= 60) return '#FF9800';
      return '#F44336';
    };

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>🌱 Soil Health</Title>
            <Chip 
              style={[styles.scoreChip, { backgroundColor: getScoreColor(soilHealth.score) }]}
              textStyle={{ color: '#fff' }}
            >
              {soilHealth.score}/100
            </Chip>
          </View>
          
          <View style={styles.healthMetrics}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Moisture</Text>
              <Text style={styles.metricValue}>{soilHealth.moisture}%</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>pH Level</Text>
              <Text style={styles.metricValue}>{soilHealth.ph}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Nutrients</Text>
              <Text style={styles.metricValue}>{soilHealth.nutrients}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderWeatherCard = () => {
    if (!dashboardData?.weather) return null;

    const { weather } = dashboardData;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>🌤️ Weather</Title>
            <Chip style={styles.weatherChip}>
              {weather.forecast}
            </Chip>
          </View>
          
          <View style={styles.weatherMetrics}>
            <View style={styles.weatherItem}>
              <MaterialIcons name="thermostat" size={24} color="#FF5722" />
              <Text style={styles.weatherText}>{weather.temperature}°C</Text>
            </View>
            <View style={styles.weatherItem}>
              <MaterialIcons name="opacity" size={24} color="#2196F3" />
              <Text style={styles.weatherText}>{weather.humidity}%</Text>
            </View>
            <View style={styles.weatherItem}>
              <MaterialIcons name="grain" size={24} color="#4CAF50" />
              <Text style={styles.weatherText}>{weather.rainfall}mm</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderCropsCard = () => {
    if (!dashboardData?.crops) return null;

    const { crops } = dashboardData;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>🌾 Crop Status</Title>
          
          <View style={styles.cropStats}>
            <View style={styles.cropStat}>
              <Text style={styles.cropNumber}>{crops.total}</Text>
              <Text style={styles.cropLabel}>Total Crops</Text>
            </View>
            <View style={styles.cropStat}>
              <Text style={[styles.cropNumber, { color: '#4CAF50' }]}>{crops.healthy}</Text>
              <Text style={styles.cropLabel}>Healthy</Text>
            </View>
            <View style={styles.cropStat}>
              <Text style={[styles.cropNumber, { color: '#F44336' }]}>{crops.diseased}</Text>
              <Text style={styles.cropLabel}>Diseased</Text>
            </View>
            <View style={styles.cropStat}>
              <Text style={[styles.cropNumber, { color: '#FF9800' }]}>{crops.ready}</Text>
              <Text style={styles.cropLabel}>Ready</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderRecommendationsCard = () => {
    if (!dashboardData?.recommendations) return null;

    const { recommendations } = dashboardData;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>💡 Recommendations</Title>
          
          {recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <MaterialIcons name="lightbulb" size={20} color="#FFC107" />
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderQuickActions = () => {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>⚡ Quick Actions</Title>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('DiseaseDetection')}
            >
              <MaterialIcons name="camera-alt" size={32} color="#fff" />
              <Text style={styles.actionText}>Scan Disease</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="analytics" size={32} color="#fff" />
              <Text style={styles.actionText}>View Analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="notifications" size={32} color="#fff" />
              <Text style={styles.actionText}>Alerts</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="settings" size={32} color="#fff" />
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (!dashboardData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title style={styles.headerTitle}>🚀 Smart Farming Dashboard</Title>
            <Paragraph style={styles.headerSubtitle}>
              Monitor your farm's health and get AI-powered insights
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Soil Health */}
        {renderSoilHealthCard()}

        {/* Weather */}
        {renderWeatherCard()}

        {/* Crops */}
        {renderCropsCard()}

        {/* Recommendations */}
        {renderRecommendationsCard()}

        {/* Quick Actions */}
        {renderQuickActions()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  headerCard: {
    marginBottom: 16,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreChip: {
    backgroundColor: theme.colors.primary,
  },
  weatherChip: {
    backgroundColor: '#E3F2FD',
  },
  healthMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weatherItem: {
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  cropStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cropStat: {
    alignItems: 'center',
  },
  cropNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cropLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 64) / 2,
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default SmartFarmingDashboard;
