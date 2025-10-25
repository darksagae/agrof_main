import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ComprehensiveCropDatabase from '../services/comprehensiveCropDatabase';

const { width } = Dimensions.get('window');

const CropCalendar = ({ savedAnalyses, onSavePlan }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [cropPlans, setCropPlans] = useState([]);
  const [budgetPlans, setBudgetPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState({
    crop: '',
    area: '',
    startDate: '',
    endDate: '',
    budget: '',
    notes: ''
  });
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [allCrops, setAllCrops] = useState([]);
  const [showCropSelector, setShowCropSelector] = useState(false);

  // Load all crops on component mount
  useEffect(() => {
    loadAllCrops();
  }, []);

  const loadAllCrops = async () => {
    try {
      console.log('🔄 Loading all 19 crops from database...');
      const crops = ComprehensiveCropDatabase.getAllCrops();
      
      // Static image mapping to avoid dynamic require issues
      const cropImageMap = {
        'maize.png': require('../assets/crops/maize.png'),
        'tomatoes.png': require('../assets/crops/tomatoes.png'),
        'beans.png': require('../assets/crops/beans.png'),
        'coffee.png': require('../assets/crops/coffee.png'),
        'banana.png': require('../assets/crops/banana.png'),
        'onions.png': require('../assets/crops/onions.png'),
        'groundnuts.png': require('../assets/crops/groundnuts.png'),
        'rice.png': require('../assets/crops/rice.png'),
        'cotton.png': require('../assets/crops/cotton.png'),
        'sugarcane.png': require('../assets/crops/sugarcane.png'),
        'pineapple.png': require('../assets/crops/pineapple.png'),
        'mangoes.png': require('../assets/crops/mangoes.png'),
        'avocados.png': require('../assets/crops/avocados.png'),
        'carrot.png': require('../assets/crops/carrot.png'),
        'spinach.png': require('../assets/crops/spinach.png'),
        'millet.png': require('../assets/crops/millet.png'),
        'soyabeans.png': require('../assets/crops/soyabeans.png'),
        'cabbage.png': require('../assets/crops/cabbage.png'),
        'orangoes.png': require('../assets/crops/orangoes.png')
      };
      
      // Add image paths to each crop
      const cropsWithImages = crops.map(crop => {
        return {
          ...crop,
          image: cropImageMap[crop.image] || require('../assets/crops/maize.png') // fallback to maize
        };
      });
      
      setAllCrops(cropsWithImages);
      console.log(`✅ Loaded ${cropsWithImages.length} crops with images`);
      console.log('Crops loaded:', cropsWithImages.map(c => c.name));
      
      // Debug: Show first few crops
      console.log('First 3 crops:', cropsWithImages.slice(0, 3));
    } catch (error) {
      console.error('❌ Failed to load crops for calendar:', error);
      
      // No fallback crops - database must work
      console.error('❌ ComprehensiveCropDatabase failed to load - no fallback available');
      setAllCrops([]);
    }
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

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty days for padding
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: '', isEmpty: true });
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const hasPlan = cropPlans.some(plan => {
        const planStart = new Date(plan.startDate);
        const planEnd = new Date(plan.endDate);
        return currentDate >= planStart && currentDate <= planEnd;
      });
      
      days.push({
        day: i,
        date: currentDate,
        hasPlan,
        isEmpty: false
      });
    }
    
    return days;
  };

  // Get crop rotation recommendations based on saved analyses
  const getCropRotationRecommendations = () => {
    if (!savedAnalyses || savedAnalyses.length === 0) {
      return [];
    }

    const cropTypes = [...new Set(savedAnalyses.map(analysis => analysis.crop))];
    const recommendations = [];
    
    cropTypes.forEach((cropName, index) => {
      // Find the crop in our database
      const cropData = allCrops.find(crop => crop.name.toLowerCase() === cropName.toLowerCase());
      
      if (cropData) {
        const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
        const season = seasons[index % seasons.length];
        const duration = cropData.duration_days || cropData.duration_months || '90 days';
        const budget = cropData.market_price_min ? 
          formatUGX(cropData.market_price_min * 1000) + '/acre' : 
          'Price varies';
        
        recommendations.push({ 
          crop: cropName, 
          season, 
          duration, 
          budget,
          category: cropData.category,
          roi: cropData.roi_percentage
        });
      }
    });
    
    return recommendations;
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle start date change
  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      setCurrentPlan({...currentPlan, startDate: formatDate(selectedDate)});
    }
  };

  // Handle end date change
  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
      setCurrentPlan({...currentPlan, endDate: formatDate(selectedDate)});
    }
  };

  // Calculate budget based on crop type and area
  const calculateBudget = (crop, area) => {
    // Get crop data from comprehensive database
    const cropData = allCrops.find(c => c.name.toLowerCase() === crop.toLowerCase());
    
    if (cropData) {
      // Use real crop data from comprehensive database
      const seedCost = cropData.seed_cost_per_acre || 150;
      const fertilizerCost = cropData.fertilizer_cost_per_acre || 300;
      const laborCost = cropData.labor_cost_per_acre || 200;
      const equipmentCost = cropData.equipment_cost_per_acre || 150;
      
      const totalCost = seedCost + fertilizerCost + laborCost + equipmentCost;
      return (totalCost * parseFloat(area)).toFixed(2);
    }
    
    // Fallback to default costs if crop not found
    const defaultCosts = { seed: 150, fertilizer: 300, labor: 200, equipment: 150 };
    const totalCost = Object.values(defaultCosts).reduce((sum, cost) => sum + cost, 0);
    return (totalCost * parseFloat(area)).toFixed(2);
  };

  // Add new crop plan
  const addCropPlan = () => {
    if (!currentPlan.crop || !currentPlan.area || !currentPlan.startDate || !currentPlan.endDate) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    const budget = calculateBudget(currentPlan.crop, currentPlan.area);

    if (editingPlanId) {
      // Update existing plan
      const updatedPlans = cropPlans.map(plan => 
        plan.id === editingPlanId 
          ? { ...currentPlan, id: editingPlanId, budget, createdAt: plan.createdAt }
          : plan
      );
      setCropPlans(updatedPlans);

      // Update budget plans
      const updatedBudgetPlans = budgetPlans.map(plan =>
        plan.id === editingPlanId
          ? {
              id: editingPlanId,
              crop: currentPlan.crop,
              area: currentPlan.area,
              budget: parseFloat(budget),
              date: currentPlan.startDate,
              type: 'expense'
            }
          : plan
      );
      setBudgetPlans(updatedBudgetPlans);

      Alert.alert('Success', 'Crop plan updated successfully!');
      setEditingPlanId(null);
    } else {
      // Add new plan
      const newPlan = {
        ...currentPlan,
        id: Date.now(),
        budget,
        createdAt: new Date().toISOString()
      };

      setCropPlans([...cropPlans, newPlan]);
      
      // Add to budget plans
      const budgetPlan = {
        id: newPlan.id,
        crop: currentPlan.crop,
        area: currentPlan.area,
        budget: parseFloat(budget),
        date: newPlan.startDate,
        type: 'expense'
      };
      
      setBudgetPlans([...budgetPlans, budgetPlan]);
      
      Alert.alert('Success', 'Crop plan added successfully!');
    }
    
    // Reset form
    setCurrentPlan({
      crop: '',
      area: '',
      startDate: '',
      endDate: '',
      budget: '',
      notes: ''
    });
    
    setShowPlanModal(false);
  };

  // Delete crop plan
  const deleteCropPlan = (planId) => {
    Alert.alert(
      'Delete Plan',
      'Are you sure you want to delete this crop plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCropPlans(cropPlans.filter(plan => plan.id !== planId));
            setBudgetPlans(budgetPlans.filter(plan => plan.id !== planId));
            Alert.alert('Success', 'Crop plan deleted successfully!');
          }
        }
      ]
    );
  };

  // Edit crop plan
  const editCropPlan = (plan) => {
    setCurrentPlan({
      crop: plan.crop,
      area: plan.area,
      startDate: plan.startDate,
      endDate: plan.endDate,
      notes: plan.notes || ''
    });
    // Parse dates for date pickers
    if (plan.startDate) {
      setStartDate(new Date(plan.startDate));
    }
    if (plan.endDate) {
      setEndDate(new Date(plan.endDate));
    }
    setEditingPlanId(plan.id);
    setShowPlanModal(true);
  };

  // Get month name
  const getMonthName = (date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[date.getMonth()];
  };

  // Navigate months
  const changeMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const calendarDays = generateCalendarDays();
  const recommendations = getCropRotationRecommendations();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Crop Calendar & Planning</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowPlanModal(true)}
        >
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Add Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Navigation */}
      <View style={styles.calendarNav}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
          <MaterialIcons name="chevron-left" size={24} color="#2c5530" />
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {getMonthName(selectedDate)} {selectedDate.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
          <MaterialIcons name="chevron-right" size={24} color="#2c5530" />
        </TouchableOpacity>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendar}>
        <View style={styles.weekDays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Text key={day} style={styles.weekDay}>{day}</Text>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {calendarDays.map((day, index) => (
            <View key={index} style={[styles.day, day.isEmpty && styles.emptyDay]}>
              {!day.isEmpty && (
                <>
                  <Text style={styles.dayNumber}>{day.day}</Text>
                  {day.hasPlan && <View style={styles.planIndicator} />}
                </>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Crop Rotation Recommendations - Only show if user has analyses */}
      {recommendations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crop Rotation Strategy</Text>
          <Text style={styles.sectionSubtitle}>
            Based on your {savedAnalyses?.length || 0} crop analyses
          </Text>
          {recommendations.map((rec, index) => (
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

      {/* Budget Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget Planning</Text>
        <View style={styles.budgetSummary}>
          <View style={styles.budgetCard}>
            <Text style={styles.budgetLabel}>Total Planned</Text>
            <Text style={styles.budgetAmount}>
              ${budgetPlans.reduce((sum, plan) => sum + plan.budget, 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.budgetCard}>
            <Text style={styles.budgetLabel}>Active Plans</Text>
            <Text style={styles.budgetAmount}>{cropPlans.length}</Text>
          </View>
        </View>
      </View>

      {/* Current Plans */}
      {cropPlans.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Crop Plans</Text>
          {cropPlans.map(plan => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <MaterialIcons name="local-florist" size={20} color="#4CAF50" />
                <Text style={styles.planCrop}>{plan.crop}</Text>
                <Text style={styles.planBudget}>${plan.budget}</Text>
              </View>
              <Text style={styles.planDetails}>
                Area: {plan.area} acres | {plan.startDate} to {plan.endDate}
              </Text>
              {plan.notes && <Text style={styles.planNotes}>{plan.notes}</Text>}
              
              {/* Action Buttons */}
              <View style={styles.planActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => editCropPlan(plan)}
                >
                  <MaterialIcons name="edit" size={18} color="#4CAF50" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteCropPlan(plan.id)}
                >
                  <MaterialIcons name="delete" size={18} color="#f44336" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Add Plan Modal */}
      <Modal
        visible={showPlanModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPlanModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingPlanId ? 'Edit Crop Plan' : 'Add Crop Plan'}
              </Text>
              <TouchableOpacity onPress={() => {
                setShowPlanModal(false);
                setEditingPlanId(null);
                setCurrentPlan({
                  crop: '',
                  area: '',
                  startDate: '',
                  endDate: '',
                  budget: '',
                  notes: ''
                });
              }}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {/* Crop Selection */}
              <Text style={styles.label}>Select Crop ({allCrops.length} Crops Available)</Text>
              <TouchableOpacity
                style={styles.cropSelector}
                onPress={() => setShowCropSelector(true)}
              >
                {currentPlan.crop ? (
                  <Image 
                    source={allCrops.find(c => c.name === currentPlan.crop)?.image || require('../assets/crops/maize.png')} 
                    style={styles.cropSelectorImage}
                    resizeMode="cover"
                  />
                ) : (
                  <MaterialIcons name="agriculture" size={20} color="#4CAF50" />
                )}
                <Text style={styles.cropSelectorText}>
                  {currentPlan.crop || `Select a crop from ${allCrops.length} available options`}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Area (acres)"
                value={currentPlan.area}
                onChangeText={(text) => setCurrentPlan({...currentPlan, area: text})}
                keyboardType="numeric"
              />
              
              {/* Start Date Picker */}
              <Text style={styles.dateLabel}>Start Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <MaterialIcons name="event" size={20} color="#4CAF50" />
                <Text style={styles.dateButtonText}>
                  {currentPlan.startDate || 'Select Start Date'}
                </Text>
              </TouchableOpacity>
              
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onStartDateChange}
                />
              )}
              
              {/* End Date Picker */}
              <Text style={styles.dateLabel}>End Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <MaterialIcons name="event" size={20} color="#4CAF50" />
                <Text style={styles.dateButtonText}>
                  {currentPlan.endDate || 'Select End Date'}
                </Text>
              </TouchableOpacity>
              
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onEndDateChange}
                  minimumDate={startDate}
                />
              )}
              
              <TextInput
                style={styles.input}
                placeholder="Notes (optional)"
                value={currentPlan.notes}
                onChangeText={(text) => setCurrentPlan({...currentPlan, notes: text})}
                multiline
              />
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowPlanModal(false)}
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

      {/* Crop Selector Modal */}
      <Modal
        visible={showCropSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCropSelector(false)}
      >
        <View style={styles.cropModalOverlay}>
          <View style={styles.cropModalContent}>
            <View style={styles.cropModalHeader}>
              <Text style={styles.cropModalTitle}>Select Crop ({allCrops.length} Crops Available)</Text>
              <Text style={styles.cropModalSubtitle}>
                {allCrops.length === 19 ? '✅ All 19 crops loaded' : `⚠️ Only ${allCrops.length} crops loaded`}
              </Text>
              <TouchableOpacity
                onPress={() => setShowCropSelector(false)}
                style={styles.cropModalCloseButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.cropModalBody}>
              <View style={styles.cropsGrid}>
                {allCrops.map((crop, index) => (
                  <TouchableOpacity
                    key={crop.name}
                    style={[
                      styles.cropCard,
                      currentPlan.crop === crop.name && styles.selectedCropCard
                    ]}
                    onPress={() => {
                      setCurrentPlan({...currentPlan, crop: crop.name});
                      setShowCropSelector(false);
                    }}
                  >
                    <Text style={styles.cropCardNumber}>{index + 1}</Text>
                    <Image 
                      source={crop.image} 
                      style={styles.cropImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.cropCardName}>{crop.name}</Text>
                    <Text style={styles.cropCardCategory}>{crop.category}</Text>
                    <Text style={styles.cropCardROI}>ROI: {crop.roi_percentage.min}-{crop.roi_percentage.max}%</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5530',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  calendarNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  navButton: {
    padding: 8,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c5530',
  },
  calendar: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  weekDays: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 12,
    fontWeight: '600',
    color: '#666',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: width / 7 - 2,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  emptyDay: {
    backgroundColor: '#f8f9fa',
  },
  dayNumber: {
    fontSize: 16,
    color: '#333',
  },
  planIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
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
    marginBottom: 8,
  },
  planActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  editButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#f44336',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
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
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 4,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
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
  // Crop Selector Styles
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cropSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
  },
  cropSelectorText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  cropSelectorImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  cropModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
  },
  cropModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cropModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5530',
    flex: 1,
  },
  cropModalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    flex: 1,
  },
  cropModalCloseButton: {
    padding: 8,
  },
  cropModalBody: {
    padding: 16,
  },
  cropsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cropCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    width: '48%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  cropImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  selectedCropCard: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  cropCardNumber: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cropCardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c5530',
    textAlign: 'center',
  },
  cropCardCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  cropCardROI: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default CropCalendar;
