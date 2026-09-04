import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, StyleSheet } from 'react-native';
import ComprehensiveCropDatabase from '../services/comprehensiveCropDatabase';

const CropSelectionTest = () => {
  const [allCrops, setAllCrops] = useState([]);
  const [showCropSelector, setShowCropSelector] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    loadAllCrops();
  }, []);

  const loadAllCrops = async () => {
    try {
      console.log('🔄 TEST: Loading all 19 crops from database...');
      console.log('🔍 TEST: ComprehensiveCropDatabase:', ComprehensiveCropDatabase);
      const crops = ComprehensiveCropDatabase.getAllCrops();
      console.log('🔍 TEST: Raw crops from database:', crops);
      
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
      console.log(`✅ TEST: Loaded ${cropsWithImages.length} crops with images`);
      console.log('TEST: Crops loaded:', cropsWithImages.map(c => c.name));
      console.log('🔍 TEST: All crops state set:', cropsWithImages.length);
      console.log('🔍 TEST: First crop:', cropsWithImages[0]);
      console.log('🔍 TEST: Last crop:', cropsWithImages[cropsWithImages.length - 1]);
    } catch (error) {
      console.error('❌ TEST: Failed to load crops:', error);
      setAllCrops([]);
    }
  };

  const selectCrop = (crop) => {
    console.log('🔍 TEST: Crop selected:', crop.name);
    setSelectedCrop(crop);
    setShowCropSelector(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crop Selection Test</Text>
      <Text style={styles.subtitle}>Testing crop selection functionality</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Crops Loaded: {allCrops.length}/19
        </Text>
        <Text style={styles.statusText}>
          Status: {allCrops.length === 19 ? '✅ All crops loaded' : '⚠️ Missing crops'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => {
          console.log('🔍 TEST: Opening crop selector with', allCrops.length, 'crops');
          console.log('🔍 TEST: Crops:', allCrops.map(c => c.name));
          console.log('🔍 TEST: allCrops state:', allCrops);
          setShowCropSelector(true);
        }}
      >
        <Text style={styles.selectButtonText}>
          {selectedCrop ? `Selected: ${selectedCrop.name}` : 'Select a Crop'}
        </Text>
      </TouchableOpacity>

      {selectedCrop && (
        <View style={styles.selectedCropContainer}>
          <Image source={selectedCrop.image} style={styles.selectedCropImage} />
          <Text style={styles.selectedCropName}>{selectedCrop.name}</Text>
          <Text style={styles.selectedCropCategory}>{selectedCrop.category}</Text>
        </View>
      )}

      {/* Crop Selector Modal */}
      <Modal
        visible={showCropSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCropSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Crop ({allCrops.length} Crops Available)</Text>
              <Text style={styles.modalSubtitle}>
                {allCrops.length === 19 ? '✅ All 19 crops loaded' : `⚠️ Only ${allCrops.length} crops loaded`}
              </Text>
              <TouchableOpacity
                onPress={() => setShowCropSelector(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.cropsGrid}>
                {allCrops.map((crop, index) => (
                  <TouchableOpacity
                    key={crop.name}
                    style={[
                      styles.cropCard,
                      selectedCrop?.name === crop.name && styles.selectedCropCard
                    ]}
                    onPress={() => selectCrop(crop)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  selectButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  selectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedCropContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCropImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  selectedCropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  selectedCropCategory: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 15,
  },
  modalCloseText: {
    color: '#666',
    fontSize: 14,
  },
  modalBody: {
    padding: 20,
  },
  cropsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cropCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCropCard: {
    backgroundColor: '#e8f5e8',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  cropCardNumber: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  cropImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  cropCardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  cropCardCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  cropCardROI: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default CropSelectionTest;














