import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Dimensions, FlatList, Modal, TextInput } from 'react-native';
// ImagePicker removed - camera functionality disabled
import { StatusBar } from 'expo-status-bar';
import { Video, ResizeMode } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import ChatBot from './components/ChatBot';
import ChatBotButton from './components/ChatBotButton';
// ChatBotTraining removed - AI functionality disabled
import FuturisticTechShowcase from './components/ShaderPlayground';
// AI components removed
import BackgroundImage from './components/BackgroundImage';
import StoreScreen from './screens/StoreScreen';
import StocksStyleScreen from './screens/StocksStyleScreen';
import ProductTradingScreen from './screens/ProductTradingScreen';
// SmartFarmingDashboard removed - dashboard functionality disabled
import DiseaseDetectionScreen from './screens/DiseaseDetectionScreen';
import { CartProvider } from './contexts/CartContext';
import { cropProducts } from './data/cropProducts';


const { width, height } = Dimensions.get('window');

// Update API URL to use deployed backend
const API_URL = 'https://loyal-wholeness-production.up.railway.app'; // Deployed Railway backend
// const API_URL = 'http://192.168.1.10:5000'; // Use your computer's IP address for local testing
// const API_URL = 'http://localhost:5000'; // For web browser testing

export default function App() {
  const [currentTab, setCurrentTab] = useState('welcome');
  const [currentScreen, setCurrentScreen] = useState('disease-detection');
  const [userCategory, setUserCategory] = useState('');
  const [navigationStack, setNavigationStack] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  // AI training removed
  const [showAgrofVideo, setShowAgrofVideo] = useState(false);
  // AI analysis removed
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [cropPlans, setCropPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('calendar'); // calendar, rotation, budget
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    crop: '',
    area: '',
    startDate: '',
    endDate: '',
    budget: '',
    notes: ''
  });
  const [currentAccountScreen, setCurrentAccountScreen] = useState('main'); // main, about, help
  const [showChatbot, setShowChatbot] = useState(false); // For bot image chatbot
  const agrofVideoRef = useRef(null);

  // Camera permissions removed - camera functionality disabled

  // Test backend connection on app start
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        console.log('🔍 Testing backend connection...');
        const response = await fetch(`${API_URL}/api/connection-test`);
        const data = await response.json();
        console.log('✅ Backend connection successful:', data);
      } catch (error) {
        console.error('❌ Backend connection failed:', error);
        Alert.alert(
          'Connection Error',
          'Failed to connect to backend. Please check your internet connection.',
          [{ text: 'OK' }]
        );
      }
    };

    testBackendConnection();
  }, []);

  // Start background video when Care tab is active
  // Background video removed - no longer needed

  const userCategories = [
    { id: 'farmer', title: 'Farmer', icon: 'agriculture', description: 'I grow crops and need disease detection' },
    { id: 'researcher', title: 'Researcher', icon: 'biotech', description: 'I conduct agricultural research' }
  ];

  // Blog and community posts data removed

  // Save analysis result
  const saveAnalysis = (analysisResult) => {
    const newAnalysis = {
      id: Date.now(),
      ...analysisResult,
      timestamp: new Date().toISOString(),
      image: image
    };
    setSavedAnalyses(prev => [newAnalysis, ...prev]);
  };

  // Delete analysis
  const deleteAnalysis = (analysisId) => {
    setSavedAnalyses(prev => prev.filter(analysis => analysis.id !== analysisId));
  };

  // View analysis details
  const viewAnalysis = (analysis) => {
    setResult(analysis);
    setShowAIAnalysis(true);
  };

  // Save crop plan
  const saveCropPlan = (plan) => {
    setCropPlans(prev => [plan, ...prev]);
  };

  // Calculate budget based on crop type and area
  const calculateBudget = (crop, area) => {
    const baseCosts = {
      'Maize': { seed: 150, fertilizer: 300, labor: 200, equipment: 150 },
      'Coffee': { seed: 300, fertilizer: 400, labor: 400, equipment: 200 },
      'Beans': { seed: 80, fertilizer: 150, labor: 120, equipment: 100 },
      'Wheat': { seed: 120, fertilizer: 250, labor: 180, equipment: 120 }
    };
    
    const costs = baseCosts[crop] || baseCosts['Maize'];
    const totalCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    
    // Convert to UGX
    return convertToUGX(totalCost * parseFloat(area));
  };

  // Add new crop plan
  const addCropPlan = () => {
    if (!newPlan.crop || !newPlan.area || !newPlan.startDate || !newPlan.endDate) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    const budget = calculateBudget(newPlan.crop, newPlan.area);
    const plan = {
      ...newPlan,
      id: Date.now(),
      budget,
      createdAt: new Date().toISOString()
    };

    saveCropPlan(plan);
    setNewPlan({ crop: '', area: '', startDate: '', endDate: '', budget: '', notes: '' });
    setShowAddPlan(false);
    Alert.alert('Success', 'Crop plan added successfully!');
  };

  // Convert USD to Ugandan Shillings (UGX)
  const convertToUGX = (usdAmount) => {
    const exchangeRate = 3800; // 1 USD = ~3800 UGX (approximate rate)
    return Math.round(usdAmount * exchangeRate);
  };

  // Format currency in UGX
  const formatUGX = (amount) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  // Get crop rotation recommendations
  const getCropRotationRecommendations = () => {
    if (!savedAnalyses || savedAnalyses.length === 0) {
      return [
        { crop: 'Maize', season: 'Spring', duration: '90 days', budget: formatUGX(convertToUGX(800)) + '/acre' },
        { crop: 'Beans', season: 'Summer', duration: '60 days', budget: formatUGX(convertToUGX(400)) + '/acre' },
        { crop: 'Wheat', season: 'Fall', duration: '120 days', budget: formatUGX(convertToUGX(600)) + '/acre' }
      ];
    }

    const cropTypes = [...new Set(savedAnalyses.map(analysis => analysis.crop))];
    const recommendations = [];
    
    cropTypes.forEach((crop, index) => {
      const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
      const season = seasons[index % seasons.length];
      const duration = crop === 'Maize' ? '90 days' : crop === 'Coffee' ? '180 days' : '60 days';
      const usdAmount = crop === 'Maize' ? 800 : crop === 'Coffee' ? 1200 : 400;
      const budget = formatUGX(convertToUGX(usdAmount)) + '/acre';
      
      recommendations.push({ crop, season, duration, budget });
    });
    
    return recommendations;
  };

  // pickImage function removed - gallery functionality disabled

  // takePhoto function removed - camera functionality disabled

  // analyzeImage function removed - disease detection disabled

  // Welcome screen with AGROF falling animation - Updated
  const renderWelcomeScreen = () => (
    <View style={styles.screen}>
      <FuturisticTechShowcase />
      
      <View style={styles.welcomeOverlay}>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => setCurrentScreen('category')}
        >
          <Text style={styles.nextButtonText}>Continue to AGROF →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategoryScreen = () => (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Which of the following best describes you?</Text>
      <Text style={styles.screenSubtitle}>Choose your role to personalize your experience</Text>
      
      <ScrollView style={styles.categoryList} showsVerticalScrollIndicator={false}>
        {userCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              userCategory === category.id && styles.selectedCategory
            ]}
            onPress={() => setUserCategory(category.id)}
          >
            <MaterialIcons name={category.icon} size={40} color="#4CAF50" style={styles.categoryIcon} />
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={[styles.nextButton, !userCategory && styles.disabledButton]} 
        onPress={() => userCategory && setCurrentScreen('welcome2')}
        disabled={!userCategory}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderWelcome2Screen = () => (
    <View style={styles.fullScreenContainer}>
      {showAgrofVideo ? (
        <View style={styles.fullScreenVideoContainer}>
          <Video
            ref={agrofVideoRef}
            source={require('./assets/agrof.mp4')}
            style={styles.fullScreenVideo}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            isLooping={false}
            shouldPlay={true}
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                setShowAgrofVideo(false);
                setCurrentScreen('manual');
              }
            }}
          />
          <View style={styles.videoOverlay}>
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={() => {
                setShowAgrofVideo(false);
                setCurrentScreen('manual');
              }}
            >
              <Text style={styles.skipButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <Image 
            source={require('./assets/background-image.png')} 
            style={styles.welcomeFullScreenImage}
            resizeMode="cover"
          />
          <View style={styles.welcomeOverlay}>
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeTitle}>AGROF</Text>
              <Text style={styles.welcomeSubtitle}>
                Your AI Powered Crop Health Companion
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={() => setShowAgrofVideo(true)}
            >
              <Text style={styles.nextButtonText}>Watch Introduction</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  const renderManualScreen = () => (
    <View style={styles.screen}>
              <Text style={styles.screenTitle}>How to Use AGROF AI</Text>
      
      <ScrollView style={styles.manualContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.manualStep}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepTitle}>Take or Select Photo</Text>
          <Text style={styles.stepDescription}>
            Disease detection functionality has been removed from this application
          </Text>
        </View>

        <View style={styles.manualStep}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepTitle}>AI Analysis</Text>
          <Text style={styles.stepDescription}>
            Our AI will analyze the image and identify any diseases or health issues
          </Text>
        </View>

        <View style={styles.manualStep}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepTitle}>Detailed Results</Text>
          <Text style={styles.stepDescription}>
            Get comprehensive information including disease identification, treatment options, and care instructions
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={() => {
          setCurrentScreen('main');
          setCurrentTab('care');
        }}
      >
        <Text style={styles.nextButtonText}>Start Using App</Text>
      </TouchableOpacity>
    </View>
  );

  // Enhanced result display with business analysis
  // Helper function for severity colors
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'high':
        return '#F44336';
      case 'critical':
        return '#9C27B0';
      default:
        return '#607D8B';
    }
  };

  const renderAnalysisResults = () => {
    if (!result) {
      console.log('No result to display');
      return null;
    }
    
    console.log('Rendering results with data:', result);
    
    // Extract data from new backend structure
    const analysis = result.analysis || {};
    const businessInsights = result.business_insights || {};
    
    console.log('Extracted analysis:', analysis);
    console.log('Extracted business insights:', businessInsights);
    
    return (
      <View style={styles.resultCard}>
        {/* Professional Header */}
        <View style={styles.resultHeader}>
          <MaterialIcons name="science" size={32} color="#2196F3" />
          <Text style={styles.resultTitle}>AI-Powered Crop Analysis Report</Text>
          <Text style={styles.resultSubtitle}>Comprehensive Disease Detection & Treatment Plan</Text>
        </View>
        
        {/* Crop Identification Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="eco" size={24} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Crop Identification</Text>
          </View>
          <View style={styles.cropInfo}>
            <Text style={styles.cropName}>
              {analysis.crop_type || 'Unknown Crop'}
            </Text>
            <View style={styles.confidenceBar}>
              <View style={[styles.confidenceFill, { width: `${(analysis.confidence * 100) || 0}%` }]} />
            </View>
            <Text style={styles.confidenceText}>
              Confidence: {(analysis.confidence * 100).toFixed(1)}%
            </Text>
            <Text style={styles.analysisMethod}>
              Detection Method: {analysis.analysis_method || 'Smart Detection'}
            </Text>
          </View>
        </View>
        
        {/* Health Status */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="favorite" size={24} color={analysis.health_status === 'healthy' ? '#4CAF50' : '#FF5722'} />
            <Text style={styles.sectionTitle}>Health Status</Text>
          </View>
          <View style={[styles.healthIndicator, { backgroundColor: analysis.health_status === 'healthy' ? '#E8F5E8' : '#FFEBEE' }]}>
            <Text style={[styles.healthText, { color: analysis.health_status === 'healthy' ? '#2E7D32' : '#C62828' }]}>
              {analysis.health_status === 'healthy' ? '🌱 Healthy Plant' : '🦠 Diseased Plant'}
            </Text>
          </View>
        </View>
        
        {/* Disease Detection */}
        {analysis.disease_type && analysis.disease_type !== 'none' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="warning" size={24} color="#FF9800" />
              <Text style={styles.sectionTitle}>Disease Detection</Text>
            </View>
            <Text style={styles.diseaseName}>
              Disease: {analysis.disease_type}
            </Text>
            <Text style={styles.severity}>
              Severity: {analysis.severity_level || 'Unknown'}
            </Text>
          </View>
        )}
        
        {/* Business Insights */}
        {businessInsights && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="business" size={24} color="#9C27B0" />
              <Text style={styles.sectionTitle}>Business Analysis</Text>
            </View>
            
            {/* Economic Impact */}
            {businessInsights.economic_impact && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>💰 Economic Impact</Text>
                <Text style={styles.infoText}>
                  {businessInsights.economic_impact}
                </Text>
              </View>
            )}
            
            {/* Risk Level */}
            {businessInsights.risk_level && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>⚠️ Risk Assessment</Text>
                <Text style={styles.infoText}>
                  Risk Level: {businessInsights.risk_level}
                </Text>
              </View>
            )}
            
            {/* Immediate Treatments */}
            {businessInsights.immediate_treatments && Array.isArray(businessInsights.immediate_treatments) && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>💊 Immediate Treatments</Text>
                {businessInsights.immediate_treatments.map((treatment, index) => (
                  <Text key={index} style={styles.treatmentText}>
                    {index + 1}. {treatment}
                  </Text>
                ))}
              </View>
            )}
            
            {/* Business Recommendations */}
            {businessInsights.business_recommendations && Array.isArray(businessInsights.business_recommendations) && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>🏢 Business Recommendations</Text>
                {businessInsights.business_recommendations.map((rec, index) => (
                  <Text key={index} style={styles.treatmentText}>
                    {index + 1}. {rec}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
        
        {/* Analysis Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="info" size={24} color="#607D8B" />
            <Text style={styles.sectionTitle}>Analysis Details</Text>
          </View>
          <Text style={styles.infoText}>
            Timestamp: {result.timestamp || 'Unknown'}
          </Text>
          <Text style={styles.infoText}>
            Stakeholder: {result.stakeholder || 'Farmers'}
          </Text>
          <Text style={styles.infoText}>
            Success: {result.success ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.infoText}>
            Detection Method: {result.analysis?.analysis_method || 'Unknown'}
          </Text>
          {result.analysis?.api_source && result.analysis.api_source !== 'offline_detection' && (
            <Text style={styles.infoText}>
              Source: {result.analysis.api_source}
            </Text>
          )}
        </View>
        
        {/* AI Analysis Results */}
        {result.analysis?.symptoms && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="psychology" size={24} color="#9C27B0" />
              <Text style={styles.sectionTitle}>AI Analysis Results</Text>
            </View>
            
            {/* Symptoms */}
            {result.analysis.symptoms && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>🔍 Symptoms</Text>
                <Text style={styles.infoText}>
                  {result.analysis.symptoms}
                </Text>
              </View>
            )}
            
            {/* Immediate Treatments */}
            {result.analysis.immediate_treatments && Array.isArray(result.analysis.immediate_treatments) && result.analysis.immediate_treatments.length > 0 && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>💊 Immediate Treatments</Text>
                {result.analysis.immediate_treatments.map((treatment, index) => (
                  <Text key={index} style={styles.treatmentText}>
                    {index + 1}. {treatment}
                  </Text>
                ))}
              </View>
            )}
            
            {/* Long-term Strategies */}
            {result.analysis.long_term_strategies && Array.isArray(result.analysis.long_term_strategies) && result.analysis.long_term_strategies.length > 0 && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>🌱 Long-term Strategies</Text>
                {result.analysis.long_term_strategies.map((strategy, index) => (
                  <Text key={index} style={styles.treatmentText}>
                    {index + 1}. {strategy}
                  </Text>
                ))}
              </View>
            )}
            
            {/* Prevention */}
            {result.analysis.prevention && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>🛡️ Prevention</Text>
                <Text style={styles.infoText}>
                  {result.analysis.prevention}
                </Text>
              </View>
            )}
          </View>
        )}
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setResult(null)}>
            <MaterialIcons name="refresh" size={20} color="white" />
            <Text style={styles.actionButtonText}>New Analysis</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => {
            // Share results functionality
            Alert.alert('Share Results', 'Results sharing feature coming soon!');
          }}>
            <MaterialIcons name="share" size={20} color="white" />
            <Text style={styles.actionButtonText}>Share Results</Text>
          </TouchableOpacity>
        </View>
        

      </View>
    );
  };

  // Main Care screen
  const renderHomeScreen = () => (
    <View style={styles.screen}>
      {/* Main Content with ScrollView */}
      <ScrollView 
        style={styles.screenContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <MaterialIcons name="eco" size={32} color="white" />
            <Text style={styles.headerTitle}> AGROF AI</Text>
          </View>
                      <Text style={styles.headerSubtitle}>AI-Powered Crop Management</Text>
        </View>

        {/* Smart Farming Features */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="smart-toy" size={24} color="#2c5530" />
            <Text style={styles.sectionTitle}> Smart Farming</Text>
          </View>
          <Text style={styles.sectionSubtitle}>AI-powered crop management and monitoring</Text>
          
          <View style={styles.smartFarmingGrid}>
            <TouchableOpacity 
              style={styles.smartFeatureButton} 
              onPress={() => setCurrentScreen('disease-detection')}
            >
              <MaterialIcons name="search" size={24} color="white" />
              <Text style={styles.smartFeatureText}>Disease Detection</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.smartFeatureButton} 
              onPress={() => setCurrentTab('store')}
            >
              <MaterialIcons name="store" size={24} color="white" />
              <Text style={styles.smartFeatureText}>Market Connect</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bot Image - Clickable to open chatbot */}
        <TouchableOpacity 
          style={styles.botImageContainer}
          onPress={() => setShowChatbot(true)}
        >
          <Image 
            source={require('./assets/bot.png')} 
            style={styles.botImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Identify section removed */}

        {/* Diagnose section removed */}

        {/* Blog section removed */}
        


        {/* Camera functionality removed */}
      </ScrollView>
    </View>
  );

  // renderGeneralFeedScreen function removed - blog/feed functionality completely removed

  // Plan tab with integrated features
  const renderPlanScreen = () => {





    return (
      <View style={styles.screen}>
        <View style={styles.tabHeader}>
          <View style={styles.tabTitleContainer}>
            <MaterialIcons name="assignment" size={28} color="white" />
                            <Text style={styles.tabTitle}> AI Farm Planning</Text>
          </View>
                      <Text style={styles.tabSubtitle}>AI-powered agricultural planning</Text>
        </View>
        
        {/* Plan Type Selector */}
        <View style={styles.planTypeSelector}>
          <TouchableOpacity 
            style={[styles.planTypeTab, selectedPlan === 'calendar' && styles.activePlanTypeTab]}
            onPress={() => setSelectedPlan('calendar')}
          >
            <MaterialIcons name="calendar-today" size={20} color={selectedPlan === 'calendar' ? 'white' : '#666'} />
            <Text style={[styles.planTypeText, selectedPlan === 'calendar' && styles.activePlanTypeText]}>Calendar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.planTypeTab, selectedPlan === 'rotation' && styles.activePlanTypeTab]}
            onPress={() => setSelectedPlan('rotation')}
          >
            <MaterialIcons name="autorenew" size={20} color={selectedPlan === 'rotation' ? 'white' : '#666'} />
            <Text style={[styles.planTypeText, selectedPlan === 'rotation' && styles.activePlanTypeText]}>Rotation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.planTypeTab, selectedPlan === 'budget' && styles.activePlanTypeTab]}
            onPress={() => setSelectedPlan('budget')}
          >
            <MaterialIcons name="account-balance-wallet" size={20} color={selectedPlan === 'budget' ? 'white' : '#666'} />
            <Text style={[styles.planTypeText, selectedPlan === 'budget' && styles.activePlanTypeText]}>Budget</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
          {/* Calendar Planning */}
          {selectedPlan === 'calendar' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Crop Calendar Planning</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setShowAddPlan(true)}
                >
                  <MaterialIcons name="add" size={20} color="white" />
                  <Text style={styles.addButtonText}>Add Plan</Text>
                </TouchableOpacity>
              </View>
              
              {cropPlans.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialIcons name="calendar-today" size={48} color="#ccc" />
                  <Text style={styles.emptyStateText}>No crop plans yet. Add your first plan!</Text>
                </View>
              ) : (
                cropPlans.map(plan => (
                  <View key={plan.id} style={styles.planCard}>
                    <View style={styles.planHeader}>
                      <MaterialIcons name="local-florist" size={24} color="#4CAF50" />
                      <Text style={styles.planCrop}>{plan.crop}</Text>
                      <Text style={styles.planBudget}>{formatUGX(plan.budget)}</Text>
                    </View>
                    <Text style={styles.planDetails}>
                      Area: {plan.area} acres | {plan.startDate} to {plan.endDate}
                    </Text>
                    {plan.notes && <Text style={styles.planNotes}>{plan.notes}</Text>}
                  </View>
                ))
              )}
            </View>
          )}

          {/* Crop Rotation */}
          {selectedPlan === 'rotation' && (
            <View>
              <Text style={styles.sectionTitle}>Crop Rotation Strategy</Text>
              <Text style={styles.sectionSubtitle}>
                Based on your {savedAnalyses?.length || 0} crop analyses
              </Text>
              
              {getCropRotationRecommendations().map((rec, index) => (
                <View key={index} style={styles.recommendationCard}>
                  <View style={styles.recommendationHeader}>
                    <MaterialIcons name="agriculture" size={24} color="#4CAF50" />
                    <Text style={styles.recommendationCrop}>{rec.crop}</Text>
                  </View>
                  <View style={styles.recommendationDetails}>
                    <Text style={styles.recommendationText}>Season: {rec.season}</Text>
                    <Text style={styles.recommendationText}>Duration: {rec.duration}</Text>
                    <Text style={styles.recommendationText}>Budget: {rec.budget}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Budget Planning */}
          {selectedPlan === 'budget' && (
            <View>
              <Text style={styles.sectionTitle}>Budget Planning</Text>
              
              <View style={styles.budgetSummary}>
                <View style={styles.budgetCard}>
                  <Text style={styles.budgetLabel}>Total Planned</Text>
                  <Text style={styles.budgetAmount}>
                    {formatUGX(cropPlans.reduce((sum, plan) => sum + plan.budget, 0))}
                  </Text>
                </View>
                <View style={styles.budgetCard}>
                  <Text style={styles.budgetLabel}>Active Plans</Text>
                  <Text style={styles.budgetAmount}>{cropPlans.length}</Text>
                </View>
              </View>
              
              {cropPlans.length > 0 && (
                <View style={styles.budgetBreakdown}>
                  <Text style={styles.budgetBreakdownTitle}>Budget Breakdown</Text>
                  {cropPlans.map(plan => (
                    <View key={plan.id} style={styles.budgetItem}>
                      <Text style={styles.budgetItemCrop}>{plan.crop}</Text>
                      <Text style={styles.budgetItemAmount}>{formatUGX(plan.budget)}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Add Plan Modal */}
        <Modal
          visible={showAddPlan}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddPlan(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Crop Plan</Text>
                <TouchableOpacity onPress={() => setShowAddPlan(false)}>
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalBody}>
                <TextInput
                  style={styles.input}
                  placeholder="Crop Type (e.g., Maize, Coffee)"
                  value={newPlan.crop}
                  onChangeText={(text) => setNewPlan({...newPlan, crop: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Area (acres)"
                  value={newPlan.area}
                  onChangeText={(text) => setNewPlan({...newPlan, area: text})}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Start Date (YYYY-MM-DD)"
                  value={newPlan.startDate}
                  onChangeText={(text) => setNewPlan({...newPlan, startDate: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="End Date (YYYY-MM-DD)"
                  value={newPlan.endDate}
                  onChangeText={(text) => setNewPlan({...newPlan, endDate: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Notes (optional)"
                  value={newPlan.notes}
                  onChangeText={(text) => setNewPlan({...newPlan, notes: text})}
                  multiline
                />
              </ScrollView>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowAddPlan(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={addCropPlan}
                >
                  <Text style={styles.saveButtonText}>Save Plan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  // Saved tab with dynamic content
  const renderSavedScreen = () => (
    <View style={styles.screen}>
      <View style={styles.tabHeader}>
        <View style={styles.tabTitleContainer}>
          <MaterialIcons name="save" size={28} color="white" />
                          <Text style={styles.tabTitle}> Analysis History</Text>
        </View>
                  <Text style={styles.tabSubtitle}>Your crop analysis history</Text>
      </View>
    
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* Recent Activities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Recent Activities</Text>
          {savedAnalyses.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="inbox" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No scans completed yet. Start by analyzing your first crop image!</Text>
            </View>
          ) : (
            <View style={styles.activityCard}>
              <Text style={styles.activityText}>• Analyzed {savedAnalyses.length} crop images</Text>
              <Text style={styles.activityText}>• Detected {savedAnalyses.filter(a => a.disease && a.disease !== 'No disease detected').length} disease cases</Text>
              <Text style={styles.activityText}>• Saved {savedAnalyses.length} treatment recommendations</Text>
              <Text style={styles.activityText}>• Completed {cropPlans.length} farm planning sessions</Text>
            </View>
          )}
        </View>

        {/* Crop Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌾 Crop Overview</Text>
          <View style={styles.cropGrid}>
            {cropProducts.map((crop) => (
              <View key={crop.id} style={styles.cropItem}>
                <Image source={crop.image} style={styles.cropImage} />
                <Text style={styles.cropLabel}>{crop.name}</Text>
                <Text style={styles.cropCount}>{savedAnalyses.filter(a => a.crop === crop.name).length} analyses</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Saved Images section removed */}
      </ScrollView>
    </View>
  );



  // Account tab
  const renderAccountScreen = () => (
    <View style={styles.screen}>
      <View style={styles.tabHeader}>
        <View style={styles.tabTitleContainer}>
          <MaterialIcons name="account-circle" size={28} color="white" />
          <Text style={styles.tabTitle}> My Account</Text>
        </View>
        <Text style={styles.tabSubtitle}>Manage your AGROF account and profile</Text>
      </View>
      
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.section}>
          <View style={styles.welcomeAccountCard}>
            <View style={styles.welcomeHeader}>
              <MaterialIcons name="account-circle" size={50} color="#4CAF50" />
              <View style={styles.welcomeInfo}>
                <Text style={styles.welcomeTitle}>Welcome back!</Text>
                <Text style={styles.welcomeEmail}>user@agrof.com</Text>
              </View>
            </View>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>AGROF Balance</Text>
              <Text style={styles.balanceAmount}>UGX 25,000</Text>
            </View>
          </View>
        </View>

        {/* Need Assistance */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.assistanceCard}
            onPress={() => setCurrentAccountScreen('about')}
          >
            <MaterialIcons name="help" size={30} color="#4CAF50" />
            <View style={styles.assistanceContent}>
              <Text style={styles.assistanceTitle}>Need Assistance?</Text>
              <Text style={styles.assistanceSubtitle}>Help & Support</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Account Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="inbox" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Inbox</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="star" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Rating & Review</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="store" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Seller</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="visibility" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Recently Viewed</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="search" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Recently Searched</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* My Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Settings</Text>
          
          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="payment" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Payment Settings</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="manage-accounts" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Account Management</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="close" size={24} color="#FF5722" />
            <Text style={[styles.accountItemText, { color: '#FF5722' }]}>Close Account</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="logout" size={24} color="#FF5722" />
            <Text style={[styles.accountItemText, { color: '#FF5722' }]}>Logout</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  // About AGROF screen
  const renderAboutAgrofScreen = () => (
    <View style={styles.screen}>
      <View style={styles.tabHeader}>
        <View style={styles.tabTitleContainer}>
          <TouchableOpacity onPress={() => setCurrentAccountScreen('main')}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.tabTitle}> About AGROF</Text>
        </View>
        <Text style={styles.tabSubtitle}>Learn about AGROF services and support</Text>
      </View>
      
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* AGROF Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AGROF Services</Text>
          
          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="storefront" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Sell on AGROF</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="contact-phone" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Contact Us</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Help Center */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.assistanceCard}
            onPress={() => setCurrentAccountScreen('help')}
          >
            <MaterialIcons name="help-center" size={30} color="#4CAF50" />
            <View style={styles.assistanceContent}>
              <Text style={styles.assistanceTitle}>Help Center</Text>
              <Text style={styles.assistanceSubtitle}>Get help with orders, payments, and more</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  // Help Center screen
  const renderHelpCenterScreen = () => (
    <View style={styles.screen}>
      <View style={styles.tabHeader}>
        <View style={styles.tabTitleContainer}>
          <TouchableOpacity onPress={() => setCurrentAccountScreen('about')}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.tabTitle}> Help Center</Text>
        </View>
        <Text style={styles.tabSubtitle}>Get help with your AGROF experience</Text>
      </View>
      
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* Order Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Management</Text>
          
          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="track-changes" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Track Your Order</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="shopping-cart" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Place an Order</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="payment" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Pay for Order</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="cancel" size={24} color="#FF5722" />
            <Text style={[styles.accountItemText, { color: '#FF5722' }]}>Cancel Order</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="assignment-return" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Create a Return</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Support Topics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support Topics</Text>
          
          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="help" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Frequently Asked Questions</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="payment" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Payment</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="local-shipping" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Delivery</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="inventory" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Products</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="account-circle" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Account</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="storefront" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Sell on AGROF</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="security" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Warranty</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Contact Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          
          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="chat" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Live Chat</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="phone" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Call: +256 700 123 456</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <MaterialIcons name="email" size={24} color="#4CAF50" />
            <Text style={styles.accountItemText}>Email: support@agrof.com</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  // Consult tab - AGROF Bot AI assistant removed
  const renderConsultScreen = () => (
    <View style={styles.screen}>
      <View style={styles.tabHeader}>
        <View style={styles.tabTitleContainer}>
          <MaterialIcons name="smart-toy" size={28} color="white" />
          <Text style={styles.tabTitle}> Expert Consultation</Text>
        </View>
        <Text style={styles.tabSubtitle}>Agricultural consultation services</Text>
      </View>
      
      {/* AGROF Bot AI assistant dashboard removed */}
      <View style={styles.consultContent}>
        <Text style={styles.consultMessage}>
          Expert consultation services are currently being updated. 
          Please check back later for AI-powered agricultural assistance.
        </Text>
      </View>
    </View>
  );

  // Navigation tabs
  const renderNavigationTabs = () => {
    if (currentTab === 'welcome') return null;
    
    return (
      <View style={styles.navigationTabs}>
        {/* Consult tab removed - functionality moved to bot image */}
        
        <TouchableOpacity 
          style={[styles.tab, currentTab === 'plan' && styles.activeTab]} 
          onPress={() => {
            console.log('Plan tab pressed, current tab:', currentTab);
            setCurrentTab('plan');
          }}
        >
          <MaterialIcons 
            name="assignment" 
            size={24} 
            color={currentTab === 'plan' ? '#4CAF50' : '#666'} 
            style={styles.tabIcon} 
          />
          <Text style={[styles.tabLabel, currentTab === 'plan' && styles.activeTabLabel]}>AI Plan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, currentTab === 'care' && styles.activeTab]} 
          onPress={() => {
            console.log('Care tab pressed, current tab:', currentTab);
            setCurrentTab('care');
          }}
        >
          <MaterialIcons 
            name="psychology" 
            size={24} 
            color={currentTab === 'care' ? '#4CAF50' : '#666'} 
            style={styles.tabIcon} 
          />
          <Text style={[styles.tabLabel, currentTab === 'care' && styles.activeTabLabel]}>AI Care</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, currentTab === 'stocks' && styles.activeTab]} 
          onPress={() => {
            console.log('Stocks tab pressed, current tab:', currentTab);
            setCurrentTab('stocks');
          }}
        >
          <MaterialIcons 
            name="trending-up" 
            size={24} 
            color={currentTab === 'stocks' ? '#4CAF50' : '#666'} 
            style={styles.tabIcon} 
          />
          <Text style={[styles.tabLabel, currentTab === 'stocks' && styles.activeTabLabel]}>Blocker</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, currentTab === 'store' && styles.activeTab]} 
          onPress={() => {
            console.log('Store tab pressed, current tab:', currentTab);
            setCurrentTab('store');
          }}
        >
          <MaterialIcons 
            name="store" 
            size={24} 
            color={currentTab === 'store' ? '#4CAF50' : '#666'} 
            style={styles.tabIcon} 
          />
          <Text style={[styles.tabLabel, currentTab === 'store' && styles.activeTabLabel]}>Store</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, currentTab === 'account' && styles.activeTab]} 
          onPress={() => {
            console.log('Account tab pressed, current tab:', currentTab);
            setCurrentTab('account');
          }}
        >
          <MaterialIcons 
            name="person" 
            size={24} 
            color={currentTab === 'account' ? '#4CAF50' : '#666'} 
            style={styles.tabIcon} 
          />
          <Text style={[styles.tabLabel, currentTab === 'account' && styles.activeTabLabel]}>Account</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCareSubTabs = () => {
    if (currentTab !== 'care') return null;
    
    return (
      <View style={styles.subTabs}>
        
        {/* General Feed tab removed */}
      </View>
    );
  };

  // Navigation functions
  const navigate = (screen, params = {}) => {
    setNavigationStack(prev => [...prev, { screen, params }]);
  };

  const goBack = () => {
    setNavigationStack(prev => prev.slice(0, -1));
  };

  const getCurrentScreen = () => {
    if (navigationStack.length > 0) {
      const current = navigationStack[navigationStack.length - 1];
      return { screen: current.screen, params: current.params };
    }
    return null;
  };

  const renderTabContent = () => {
    console.log('Rendering tab content for currentTab:', currentTab);
    const currentNav = getCurrentScreen();
    
    if (currentNav && currentNav.screen === 'ProductTrading') {
      return <ProductTradingScreen 
        route={{ params: currentNav.params }} 
        navigation={{ navigate, goBack }} 
      />;
    }

    if (currentTab === 'welcome') {
      if (currentScreen === 'welcome') return renderWelcomeScreen();
      if (currentScreen === 'category') return renderCategoryScreen();
      if (currentScreen === 'welcome2') return renderWelcome2Screen();
      if (currentScreen === 'manual') return renderManualScreen();
    }
    
    // Consult tab removed - functionality moved to bot image
    if (currentTab === 'plan') {
      console.log('Rendering plan screen');
      return renderPlanScreen();
    }
    if (currentTab === 'care') {
      console.log('Rendering care screen');
      // Feed screen removed
      // Dashboard and IoT monitoring removed
      if (currentScreen === 'disease-detection') return <DiseaseDetectionScreen navigation={{ navigate, goBack: () => setCurrentTab('welcome') }} />;
      // Default to disease detection screen
      return <DiseaseDetectionScreen navigation={{ navigate, goBack: () => setCurrentTab('welcome') }} />;
    }
    if (currentTab === 'stocks') {
      console.log('Rendering stocks screen');
      return <StocksStyleScreen navigation={{ navigate }} />;
    }
    if (currentTab === 'store') {
      console.log('Rendering store screen');
      return <StoreScreen />;
    }
    if (currentTab === 'account') {
      console.log('Rendering account screen');
      if (currentAccountScreen === 'about') return renderAboutAgrofScreen();
      if (currentAccountScreen === 'help') return renderHelpCenterScreen();
      return renderAccountScreen();
    }
    
    console.log('Rendering default home screen');
    return renderHomeScreen();
  };

  // AI training functionality removed

  // Get background image based on current screen and tab
  const getBackgroundImage = () => {
    // Welcome and onboarding screens
    if (currentScreen === 'welcome') {
      return 'welcome';  // Initial app opening uses welcome.png
    } else if (currentScreen === 'welcome2' || currentScreen === 'manual') {
      return 'welcome';  // Other welcome screens also use welcome.png
    } 
    // Category selection screen
    else if (currentScreen === 'category') {
      return 'background1';
    } 
    // Feed screen removed
    // Analysis and results screens
    else if (currentScreen === 'analysis') {
      return 'fungicides';  // Analysis screen - fungicides background
    } else if (currentScreen === 'results') {
      return 'herbicides';  // Results screen - herbicides background
    } 
    // Store-related screens
    else if (currentScreen === 'store') {
      return 'seeds';       // Store screen - seeds background
    } else if (currentScreen === 'nursery') {
      return 'nursery';     // Nursery screen - nursery bed background
    }
    // Default fallback
    return 'welcome';
  };

  return (
    <CartProvider>
      <BackgroundImage overlayOpacity={0.4} backgroundImage={getBackgroundImage()}>
        <StatusBar style="auto" />
        
        {renderTabContent()}
        
        {renderCareSubTabs()}
        
        {renderNavigationTabs()}
        
        {/* ChatBot Button - Available on all screens except welcome */}
        {currentTab !== 'welcome' && (
          <ChatBotButton onPress={() => setShowChatbot(true)} />
        )}
        
        {/* Chatbot Modal */}
        {showChatbot && (
          <Modal
            visible={showChatbot}
            animationType="slide"
            presentationStyle="fullScreen"
          >
            <View style={styles.chatbotModal}>
              <View style={styles.chatbotHeader}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowChatbot(false)}
                >
                  <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.chatbotTitle}>AGROF AI Assistant</Text>
              </View>
              <ChatBot onShowTraining={() => setShowChatbot(false)} />
            </View>
          </Modal>
        )}
        
        {/* Futuristic AI Analysis Screen component was removed */}
      </BackgroundImage>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  welcomeOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  // Welcome screens
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  welcomeIcon: {
    marginBottom: 20,
  },
  welcomeImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  welcomeBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  welcomeFullScreenImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  welcomeOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  agrofLogoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 1000,
  },
  skipButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    lineHeight: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginHorizontal: 30,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  planTypeSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  planTypeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activePlanTypeTab: {
    backgroundColor: '#4CAF50',
  },
  planTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
  },
  activePlanTypeText: {
    color: 'white',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  planCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planCrop: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c5530',
    marginLeft: 8,
    flex: 1,
  },
  planBudget: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  planDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  planNotes: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  recommendationCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationCrop: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c5530',
    marginLeft: 8,
  },
  recommendationDetails: {
    marginLeft: 32,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  budgetSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  budgetCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  budgetBreakdown: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  budgetBreakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c5530',
    marginBottom: 12,
  },
  budgetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  budgetItemCrop: {
    fontSize: 14,
    color: '#333',
  },
  budgetItemAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5530',
  },
  modalBody: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },


  disabledButton: {
    backgroundColor: '#ccc',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  screenSubtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  categoryList: {
    flex: 1,
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCategory: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  categoryIcon: {
    alignSelf: 'center',
    marginBottom: 10,
  },

  manualContainer: {
    flex: 1,
    marginBottom: 20,
  },
  manualStep: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  stepNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  // Video styles
  fullScreenVideoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  fullScreenVideo: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },

  // Background video styles - REMOVED
  screenContent: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 15,
  },

  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  // Identify and camera button styles removed
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonIcon: {
    marginRight: 5,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  analyzeButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resultCard: {
    backgroundColor: '#E8F5E8',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 8,
  },
  
  // Enhanced Result Styles
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cropInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  cropName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 10,
    textAlign: 'center',
  },
  confidenceBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  analysisMethod: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  healthIndicator: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  healthText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  diseaseInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  severityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  severityLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  severityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  severityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  economicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  economicItem: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  economicLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  economicValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  postHarvestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  postHarvestItem: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  postHarvestLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  postHarvestValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  treatmentsList: {
    marginBottom: 15,
  },
  treatmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  treatmentNumber: {
    width: 24,
    height: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  treatmentNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  businessList: {
    marginBottom: 15,
  },
  businessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 6,
  },
  businessText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  insightsList: {
    marginBottom: 15,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 6,
  },
  insightsText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5722',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 5,
  },
  confidence: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  severity: {
    fontSize: 14,
    color: '#666',
  },
  detailedInfo: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginTop: 10,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 3,
  },
  // Diagnose styles removed
  blogScroll: {
    marginTop: 10,
  },
  blogCard: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    width: 150,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  blogIcon: {
    textAlign: 'center',
    marginBottom: 8,
  },
  blogTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 5,
    textAlign: 'center',
  },
  blogDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  nextSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#FF5722',
    marginTop: 10,
  },
  // Tab styles
  tabHeader: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#2c5530',
  },
  tabTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  tabTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tabSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  navigationTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: '#E8F5E8',
    borderRadius: 10,
  },
  tabIcon: {
    marginBottom: 4,
  },
  activeTabText: {
    color: '#4CAF50',
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
  },
  activeTabLabel: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  subTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  subTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  activeSubTab: {
    backgroundColor: '#4CAF50',
  },
  subTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  subTabIcon: {
    marginRight: 5,
  },
  activeSubTabText: {
    color: 'white',
  },
  // Feature cards
  featureCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIcon: {
    textAlign: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 5,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  featureButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  featureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Activity and graph styles
  activityCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 5,
  },
  graphCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 15,
    textAlign: 'center',
  },
  graphBar: {
    marginBottom: 15,
  },
  graphBarFill: {
    height: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    marginBottom: 5,
  },
  graphLabel: {
    fontSize: 12,
    color: '#666',
  },
  // Crop grid styles
  cropGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  cropItem: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cropImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
    borderRadius: 25,
  },
  cropLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 4,
    textAlign: 'center',
  },
  cropCount: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  savedItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  savedIcon: {
    marginRight: 15,
  },
  savedContent: {
    flex: 1,
  },
  savedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 3,
  },
  savedDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 3,
  },
  savedDescription: {
    fontSize: 14,
    color: '#666',
  },
  // Settings styles
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingIcon: {
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 3,
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
  },
  toggleButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dataUsageCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dataUsageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 15,
    textAlign: 'center',
  },
  dataUsageBar: {
    marginBottom: 15,
  },
  dataUsageFill: {
    height: 20,
    backgroundColor: '#FF9800',
    borderRadius: 10,
    marginBottom: 5,
  },
  dataUsageLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  dataUsageStats: {
    marginTop: 10,
  },
  dataUsageStat: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 3,
  },
  // Feed styles
  feedHeader: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#2c5530',
  },
  feedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  feedSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
  },
  feedList: {
    flex: 1,
    padding: 20,
  },
  feedCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  feedCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  feedIcon: {
    marginRight: 15,
  },
  feedUserInfo: {
    flex: 1,
  },
  feedUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 3,
  },
  feedLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  feedTime: {
    fontSize: 12,
    color: '#999',
  },
  feedDiseaseInfo: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 15,
  },
  feedDiseaseTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 5,
  },
  feedDiseaseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 3,
  },
  feedConfidence: {
    fontSize: 14,
    color: '#666',
  },
  // Help button
  helpButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  helpButtonText: {
    color: 'white',
    fontSize: 24,
  },
  treatmentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 3,
  },
  subSection: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 8,
  },
  debugSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 5,
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  // Account screen styles
  welcomeAccountCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeInfo: {
    marginLeft: 15,
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 5,
  },
  welcomeEmail: {
    fontSize: 14,
    color: '#666',
  },
  balanceCard: {
    backgroundColor: '#E8F5E8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  assistanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  assistanceContent: {
    flex: 1,
    marginLeft: 15,
  },
  assistanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 3,
  },
  assistanceSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  accountItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  // Smart Farming Styles
  smartFarmingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  smartFeatureButton: {
    backgroundColor: '#2196F3',
    width: (width - 60) / 2,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  smartFeatureText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  // Disabled functionality styles
  disabledSection: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    margin: 15,
    alignItems: 'center',
  },
  disabledText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Consult content styles
  consultContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  consultMessage: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  // Bot image styles - positioned near the tabs
  botImageContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    zIndex: 1000,
    elevation: 10,
  },
  botImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Makes it perfectly circular
    borderWidth: 3,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // Chatbot modal styles
  chatbotModal: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatbotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2c5530',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  chatbotTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Compensate for close button
  },
});


