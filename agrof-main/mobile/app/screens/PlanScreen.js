import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeTranslation } from '../i18n';
import FloatingNewsWidget from '../components/FloatingNewsWidget';
import ProductBudgetCard from '../components/ProductBudgetCard';
import cropPlanningService from '../services/cropPlanningService';
import agricultureNewsService from '../services/agricultureNewsService';
import { useCart } from '../contexts/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const PlanScreen = ({ onNavigateToStore }) => {
  const { t } = useSafeTranslation();
  const { addToCart } = useCart();
  
  // Tab state
  const [selectedTab, setSelectedTab] = useState('calendar');
  
  // News state
  const [news, setNews] = useState([]);
  const [showNews, setShowNews] = useState(true);
  
  // Crop planning state
  const [showCropSelector, setShowCropSelector] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [farmSize, setFarmSize] = useState('1');
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  
  // Load news and saved plans on mount
  useEffect(() => {
    loadNews();
    loadSavedPlans();
  }, []);

  const loadNews = async () => {
    try {
      const newsData = await agricultureNewsService.fetchNews({ limit: 20 });
      setNews(newsData);
      console.log(`📰 Loaded ${newsData.length} news articles`);
    } catch (error) {
      console.error('Error loading news:', error);
      setNews(agricultureNewsService.getSampleNews());
    }
  };

  const loadSavedPlans = async () => {
    try {
      const saved = await AsyncStorage.getItem('crop_plans');
      if (saved) {
        setSavedPlans(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved plans:', error);
    }
  };

  const savePlan = async (plan) => {
    try {
      const planWithId = {
        ...plan,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      
      const updated = [...savedPlans, planWithId];
      await AsyncStorage.setItem('crop_plans', JSON.stringify(updated));
      setSavedPlans(updated);
      
      Alert.alert('Success', 'Farm plan saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save plan');
    }
  };

  const deletePlan = async (planId) => {
    Alert.alert(
      'Delete Plan',
      'Are you sure you want to delete this plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = savedPlans.filter(p => p.id !== planId);
            await AsyncStorage.setItem('crop_plans', JSON.stringify(updated));
            setSavedPlans(updated);
          }
        }
      ]
    );
  };

  // Available crops with emojis
  const availableCrops = [
    { id: 'tomatoes', name: 'Tomatoes', emoji: '🍅', color: '#f44336' },
    { id: 'maize', name: 'Maize', emoji: '🌽', color: '#FF9800' },
    { id: 'banana', name: 'Matooke/Banana', emoji: '🍌', color: '#FFC107' },
    { id: 'beans', name: 'Beans', emoji: '🫘', color: '#8BC34A' },
    { id: 'cabbage', name: 'Cabbage', emoji: '🥬', color: '#4CAF50' },
    { id: 'watermelon', name: 'Watermelon', emoji: '🍉', color: '#E91E63' },
  ];

  const handleGeneratePlan = async () => {
    if (!selectedCrop || !farmSize || parseFloat(farmSize) <= 0) {
      Alert.alert('Error', 'Please select a crop and enter valid farm size');
      return;
    }

    setGeneratingPlan(true);
    try {
      console.log(`🌾 Generating plan for ${selectedCrop.name} on ${farmSize} acres...`);
      
      const plan = await cropPlanningService.generateCropPlan(
        selectedCrop.id,
        parseFloat(farmSize)
      );
      
      setCurrentPlan(plan);
      setShowCropSelector(false);
      setSelectedTab('budget');
      
      console.log('✅ Plan generated:', plan);
    } catch (error) {
      console.error('Error generating plan:', error);
      Alert.alert('Error', 'Failed to generate plan. Please try again.');
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handleBuyProduct = (product) => {
    if (product.can_buy && product.id) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price || product.total_cost,
        quantity: product.quantity || 1,
        image: product.image_url
      });
      Alert.alert('Added to Cart', `${product.name} added to your cart!`);
    } else {
      Alert.alert('Info', 'This item is not available in the store');
    }
  };

  const handleBuyAllProducts = () => {
    if (!currentPlan) return;
    
    let totalProducts = 0;
    let totalCost = 0;
    
    currentPlan.budget_items.forEach(section => {
      section.products.forEach(product => {
        if (product.can_buy && product.id) {
          addToCart({
            id: product.id,
            name: product.name,
            price: product.price || product.total_cost,
            quantity: product.quantity || 1,
            image: product.image_url
          });
          totalProducts++;
          totalCost += product.total_cost || 0;
        }
      });
    });

    Alert.alert(
      'Added to Cart!',
      `${totalProducts} products added to cart\nTotal: UGX ${totalCost.toLocaleString()}`,
      [
        { text: 'Continue Planning', style: 'cancel' },
        { text: 'Go to Store', onPress: () => onNavigateToStore && onNavigateToStore() }
      ]
    );
  };

  const formatUGX = (amount) => {
    if (!amount || amount === 0) return 'Contact for pricing';
    return `UGX ${Math.round(amount).toLocaleString()}`;
  };

  // Render crop selector modal
  const renderCropSelector = () => (
    <Modal
      visible={showCropSelector}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setShowCropSelector(false)}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowCropSelector(false)}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Plan Your Crop</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Step 1: Select Crop */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Your Crop</Text>
            <View style={styles.cropGrid}>
              {availableCrops.map(crop => (
                <TouchableOpacity
                  key={crop.id}
                  style={[
                    styles.cropCard,
                    selectedCrop?.id === crop.id && styles.cropCardSelected,
                    { borderColor: crop.color }
                  ]}
                  onPress={() => setSelectedCrop(crop)}
                >
                  <Text style={styles.cropEmoji}>{crop.emoji}</Text>
                  <Text style={styles.cropName}>{crop.name}</Text>
                  {selectedCrop?.id === crop.id && (
                    <View style={[styles.selectedBadge, { backgroundColor: crop.color }]}>
                      <MaterialIcons name="check" size={16} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Step 2: Farm Size */}
          {selectedCrop && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Farm Size</Text>
              <View style={styles.farmSizeInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter acres"
                  value={farmSize}
                  onChangeText={setFarmSize}
                  keyboardType="decimal-pad"
                />
                <Text style={styles.inputSuffix}>acres</Text>
              </View>
              <Text style={styles.hint}>
                {selectedCrop.emoji} Planning {farmSize || '0'} acre(s) of {selectedCrop.name}
              </Text>
            </View>
          )}

          {/* Generate Button */}
          {selectedCrop && farmSize && parseFloat(farmSize) > 0 && (
            <TouchableOpacity
              style={[styles.generateButton, { backgroundColor: selectedCrop.color }]}
              onPress={handleGeneratePlan}
              disabled={generatingPlan}
            >
              {generatingPlan ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialIcons name="auto-awesome" size={20} color="white" />
                  <Text style={styles.generateButtonText}>Generate AI Farm Plan</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  // Render calendar tab
  const renderCalendarTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Add New Plan Button */}
      <TouchableOpacity
        style={styles.addPlanButton}
        onPress={() => setShowCropSelector(true)}
      >
        <MaterialIcons name="add-circle" size={24} color="white" />
        <Text style={styles.addPlanButtonText}>Plan New Crop</Text>
      </TouchableOpacity>

      {/* Saved Plans */}
      {savedPlans.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="agriculture" size={80} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Farm Plans Yet</Text>
          <Text style={styles.emptyStateText}>
            Start by planning your first crop!
          </Text>
        </View>
      ) : (
        savedPlans.map((plan, index) => (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planCardHeader}>
              <Text style={styles.planCardCrop}>
                {availableCrops.find(c => c.id === plan.crop?.toLowerCase())?.emoji || '🌾'} {plan.crop}
              </Text>
              <Text style={styles.planCardAcres}>{plan.acres} acres</Text>
            </View>
            
            <View style={styles.planCardStats}>
              <View style={styles.planStat}>
                <Text style={styles.planStatLabel}>Investment</Text>
                <Text style={styles.planStatValue}>{formatUGX(plan.total_investment)}</Text>
              </View>
              <View style={styles.planStat}>
                <Text style={styles.planStatLabel}>Expected Profit</Text>
                <Text style={[styles.planStatValue, { color: '#4CAF50' }]}>
                  {formatUGX(plan.expected_profit?.min)}
                </Text>
              </View>
              <View style={styles.planStat}>
                <Text style={styles.planStatLabel}>ROI</Text>
                <Text style={[styles.planStatValue, { color: '#FF9800' }]}>
                  {plan.roi_percentage?.min}%
                </Text>
              </View>
            </View>

            <View style={styles.planCardActions}>
              <TouchableOpacity
                style={styles.planViewButton}
                onPress={() => {
                  setCurrentPlan(plan);
                  setSelectedTab('budget');
                }}
              >
                <MaterialIcons name="visibility" size={18} color="#2196F3" />
                <Text style={styles.planViewButtonText}>View Budget</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.planDeleteButton}
                onPress={() => deletePlan(plan.id)}
              >
                <MaterialIcons name="delete" size={18} color="#f44336" />
                <Text style={styles.planDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  // Render budget tab
  const renderBudgetTab = () => {
    if (!currentPlan) {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="receipt-long" size={80} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Active Budget</Text>
          <Text style={styles.emptyStateText}>
            Create a crop plan to see detailed budget
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => {
              setSelectedTab('calendar');
              setShowCropSelector(true);
            }}
          >
            <Text style={styles.emptyStateButtonText}>Plan New Crop</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const storeProductsTotal = currentPlan.budget_items
      .flatMap(section => section.products)
      .filter(p => p.can_buy)
      .reduce((sum, p) => sum + (p.total_cost || 0), 0);

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* Budget Header */}
        <View style={styles.budgetHeader}>
          <Text style={styles.budgetCropTitle}>
            {availableCrops.find(c => c.id === currentPlan.crop?.toLowerCase())?.emoji || '🌾'} {currentPlan.crop}
          </Text>
          <Text style={styles.budgetAcres}>{currentPlan.acres} acre(s)</Text>
        </View>

        {/* Investment Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Investment</Text>
              <Text style={styles.summaryValue}>{formatUGX(currentPlan.total_investment)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Expected Revenue</Text>
              <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                {formatUGX(currentPlan.expected_revenue?.min)}+
              </Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Expected Profit</Text>
              <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                {formatUGX(currentPlan.expected_profit?.min)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>ROI</Text>
              <Text style={[styles.summaryValue, { color: '#FF9800' }]}>
                {currentPlan.roi_percentage?.min}% - {currentPlan.roi_percentage?.max}%
              </Text>
            </View>
          </View>
        </View>

        {/* Budget Sections */}
        {currentPlan.budget_items.map((section, index) => (
          <View key={index} style={styles.budgetSection}>
            <Text style={styles.budgetSectionTitle}>{section.section}</Text>
            {section.products.map((product, pIndex) => (
              <ProductBudgetCard
                key={pIndex}
                product={product}
                onViewDetails={onNavigateToStore}
                onAddToCart={handleBuyProduct}
              />
            ))}
          </View>
        ))}

        {/* Action Buttons */}
        <View style={styles.budgetActions}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => savePlan(currentPlan)}
          >
            <MaterialIcons name="save" size={20} color="white" />
            <Text style={styles.saveButtonText}>Save Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buyAllButton}
            onPress={handleBuyAllProducts}
          >
            <MaterialIcons name="shopping-cart" size={20} color="white" />
            <Text style={styles.buyAllButtonText}>
              Buy Products ({formatUGX(storeProductsTotal)})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Planting Guide */}
        {currentPlan.planting_guide && (
          <View style={styles.guideSection}>
            <Text style={styles.guideSectionTitle}>📋 Planting Guide</Text>
            <View style={styles.guideCard}>
              <View style={styles.guideRow}>
                <Text style={styles.guideLabel}>Duration:</Text>
                <Text style={styles.guideValue}>{currentPlan.duration}</Text>
              </View>
              <View style={styles.guideRow}>
                <Text style={styles.guideLabel}>Best Seasons:</Text>
                <Text style={styles.guideValue}>{currentPlan.planting_seasons?.join(', ')}</Text>
              </View>
              <View style={styles.guideRow}>
                <Text style={styles.guideLabel}>Spacing:</Text>
                <Text style={styles.guideValue}>{currentPlan.planting_guide.spacing}</Text>
              </View>
              {currentPlan.expected_yield && (
                <View style={styles.guideRow}>
                  <Text style={styles.guideLabel}>Expected Yield:</Text>
                  <Text style={styles.guideValue}>
                    {currentPlan.expected_yield.min} - {currentPlan.expected_yield.max} {currentPlan.expected_yield.unit}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    );
  };

  // Render rotation tab
  const renderRotationTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.infoCard}>
        <MaterialIcons name="info" size={24} color="#2196F3" />
        <Text style={styles.infoText}>
          Crop rotation recommendations based on disease prevention and soil health
        </Text>
      </View>

      {/* Rotation Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Rotation Cycles</Text>
        
        {[
          { season: 'Season 1', crops: ['Maize', 'Beans'], reason: 'Beans fix nitrogen for next crop' },
          { season: 'Season 2', crops: ['Tomatoes', 'Cabbage'], reason: 'High-value vegetables after legumes' },
          { season: 'Season 3', crops: ['Maize', 'Watermelon'], reason: 'Break disease cycle' },
          { season: 'Season 4', crops: ['Beans', 'Rest'], reason: 'Soil recovery' },
        ].map((rotation, index) => (
          <View key={index} style={styles.rotationCard}>
            <View style={styles.rotationHeader}>
              <MaterialIcons name="autorenew" size={24} color="#4CAF50" />
              <Text style={styles.rotationSeason}>{rotation.season}</Text>
            </View>
            <Text style={styles.rotationCrops}>{rotation.crops.join(' → ')}</Text>
            <Text style={styles.rotationReason}>💡 {rotation.reason}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // Render ROI tab
  const renderROITab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {!currentPlan ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="analytics" size={80} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Plan to Analyze</Text>
          <Text style={styles.emptyStateText}>Create a crop plan first</Text>
        </View>
      ) : (
        <>
          {/* ROI Calculator */}
          <View style={styles.roiCard}>
            <Text style={styles.roiTitle}>📊 Return on Investment Analysis</Text>
            
            <View style={styles.roiRow}>
              <Text style={styles.roiLabel}>Investment</Text>
              <Text style={styles.roiValue}>{formatUGX(currentPlan.total_investment)}</Text>
            </View>

            <View style={styles.roiDivider} />

            <View style={styles.roiRow}>
              <Text style={styles.roiLabel}>Expected Revenue</Text>
              <Text style={[styles.roiValue, { color: '#4CAF50' }]}>
                {formatUGX(currentPlan.expected_revenue?.min)} - {formatUGX(currentPlan.expected_revenue?.max)}
              </Text>
            </View>

            <View style={styles.roiRow}>
              <Text style={styles.roiLabel}>Expected Profit</Text>
              <Text style={[styles.roiValue, { color: '#4CAF50', fontSize: 20, fontWeight: 'bold' }]}>
                {formatUGX(currentPlan.expected_profit?.min)} - {formatUGX(currentPlan.expected_profit?.max)}
              </Text>
            </View>

            <View style={styles.roiDivider} />

            <View style={styles.roiHighlight}>
              <Text style={styles.roiHighlightLabel}>Return on Investment (ROI)</Text>
              <Text style={styles.roiHighlightValue}>
                {currentPlan.roi_percentage?.min}% - {currentPlan.roi_percentage?.max}%
              </Text>
            </View>
          </View>

          {/* Profit Scenarios */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profit Scenarios</Text>
            
            <View style={styles.scenarioCard}>
              <Text style={styles.scenarioTitle}>🎯 Conservative (Minimum)</Text>
              <Text style={styles.scenarioProfit}>{formatUGX(currentPlan.expected_profit?.min)}</Text>
              <Text style={styles.scenarioDesc}>Based on minimum market prices</Text>
            </View>

            <View style={styles.scenarioCard}>
              <Text style={styles.scenarioTitle}>🚀 Optimistic (Maximum)</Text>
              <Text style={[styles.scenarioProfit, { color: '#4CAF50' }]}>
                {formatUGX(currentPlan.expected_profit?.max)}
              </Text>
              <Text style={styles.scenarioDesc}>Based on maximum market prices</Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <MaterialIcons name="analytics" size={28} color="white" />
          <Text style={styles.headerTitle}>AI Farm Planner</Text>
        </View>
        <Text style={styles.headerSubtitle}>Smart farming with real Uganda data</Text>
        
        {/* Test Button */}
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => {
            // Navigate to test screen
            console.log('🔍 Opening crop selection test...');
          }}
        >
          <MaterialIcons name="bug-report" size={20} color="white" />
          <Text style={styles.testButtonText}>Test Crop Selection</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'calendar' && styles.activeTab]}
          onPress={() => setSelectedTab('calendar')}
        >
          <MaterialIcons
            name="calendar-today"
            size={20}
            color={selectedTab === 'calendar' ? '#4CAF50' : '#666'}
          />
          <Text style={[styles.tabText, selectedTab === 'calendar' && styles.activeTabText]}>
            Calendar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'budget' && styles.activeTab]}
          onPress={() => setSelectedTab('budget')}
        >
          <MaterialIcons
            name="account-balance-wallet"
            size={20}
            color={selectedTab === 'budget' ? '#4CAF50' : '#666'}
          />
          <Text style={[styles.tabText, selectedTab === 'budget' && styles.activeTabText]}>
            Budget
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'rotation' && styles.activeTab]}
          onPress={() => setSelectedTab('rotation')}
        >
          <MaterialIcons
            name="autorenew"
            size={20}
            color={selectedTab === 'rotation' ? '#4CAF50' : '#666'}
          />
          <Text style={[styles.tabText, selectedTab === 'rotation' && styles.activeTabText]}>
            Rotation
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'roi' && styles.activeTab]}
          onPress={() => setSelectedTab('roi')}
        >
          <MaterialIcons
            name="trending-up"
            size={20}
            color={selectedTab === 'roi' ? '#4CAF50' : '#666'}
          />
          <Text style={[styles.tabText, selectedTab === 'roi' && styles.activeTabText]}>
            ROI
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {selectedTab === 'calendar' && renderCalendarTab()}
      {selectedTab === 'budget' && renderBudgetTab()}
      {selectedTab === 'rotation' && renderRotationTab()}
      {selectedTab === 'roi' && renderROITab()}

      {/* Crop Selector Modal */}
      {renderCropSelector()}

      {/* Floating News Widget */}
      {showNews && news.length > 0 && (
        <FloatingNewsWidget
          news={news}
          onNewsPress={(newsItem) => console.log('News clicked:', newsItem)}
          onClose={() => setShowNews(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 50,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
  },
  testButton: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  
  // Crop Selector Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    padding: 15,
    paddingTop: 50,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContent: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  cropGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cropCard: {
    width: (width - 54) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  cropCardSelected: {
    borderWidth: 3,
    elevation: 4,
  },
  cropEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  cropName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  farmSizeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 15,
  },
  inputSuffix: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  hint: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 18,
    marginTop: 20,
    gap: 10,
    elevation: 3,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Calendar Tab
  addPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 15,
    margin: 15,
    gap: 10,
    elevation: 3,
  },
  addPlanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planCardCrop: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  planCardAcres: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  planStat: {
    alignItems: 'center',
  },
  planStatLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  planStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  planCardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  planViewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
    gap: 6,
  },
  planViewButtonText: {
    color: '#2196F3',
    fontSize: 13,
    fontWeight: '600',
  },
  planDeleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f44336',
    gap: 6,
  },
  planDeleteButtonText: {
    color: '#f44336',
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Budget Tab
  budgetHeader: {
    backgroundColor: 'white',
    padding: 15,
    margin: 15,
    borderRadius: 12,
    elevation: 2,
  },
  budgetCropTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  budgetAcres: {
    fontSize: 14,
    color: '#666',
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  budgetSection: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  budgetSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  budgetActions: {
    flexDirection: 'row',
    gap: 10,
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buyAllButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  buyAllButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  guideSection: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  guideSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  guideCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 1,
  },
  guideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  guideLabel: {
    fontSize: 13,
    color: '#666',
  },
  guideValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  
  // Rotation Tab
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    gap: 12,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 18,
  },
  rotationCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  rotationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  rotationSeason: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rotationCrops: {
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 6,
  },
  rotationReason: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  
  // ROI Tab
  roiCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 15,
    elevation: 3,
  },
  roiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  roiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  roiLabel: {
    fontSize: 14,
    color: '#666',
  },
  roiValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  roiDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  roiHighlight: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  roiHighlightLabel: {
    fontSize: 13,
    color: '#2E7D32',
    marginBottom: 6,
  },
  roiHighlightValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  scenarioCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  scenarioTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  scenarioProfit: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 6,
  },
  scenarioDesc: {
    fontSize: 12,
    color: '#888',
  },
});

export default PlanScreen;

