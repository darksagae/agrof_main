import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Title, Paragraph, Button, Chip, Badge } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme';
import EnhancedImageAnalysisService from '../services/enhancedImageAnalysisService';

const { width, height } = Dimensions.get('window');

const EnhancedDiseaseDetectionScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModels, setSelectedModels] = useState(['all']);
  const [cropType, setCropType] = useState('');
  const [showModels, setShowModels] = useState(false);
  const [aiModelsStatus, setAiModelsStatus] = useState(null);
  const [storeProducts, setStoreProducts] = useState([]);

  // Available AI models
  const availableModels = [
    { id: 'all', name: 'All Models', description: 'Use all available AI models' },
    { id: 'gemini', name: 'Gemini AI', description: 'Google Gemini for comprehensive analysis' },
    { id: 'tensorflow', name: 'TensorFlow Hub', description: 'Crop classification and detection' },
    { id: 'pytorch', name: 'PyTorch Vision', description: 'Disease detection and classification' },
    { id: 'vision', name: 'Google Vision', description: 'Object detection and labeling' }
  ];

  // Common crop types
  const cropTypes = [
    'Watermelon', 'Tomato', 'Cabbage', 'Eggplant', 'Cucumber', 
    'Barley', 'Pumpkin', 'Pepper', 'Coriander', 'Other'
  ];

  useEffect(() => {
    loadAIModelsStatus();
  }, []);

  const loadAIModelsStatus = async () => {
    try {
      const status = await EnhancedImageAnalysisService.getAIModelsStatus();
      if (status.success) {
        setAiModelsStatus(status);
      }
    } catch (error) {
      console.error('Failed to load AI models status:', error);
    }
  };

  // Request permissions and pick image from gallery
  const pickImageFromGallery = async () => {
    try {
      setIsLoading(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery permission is needed to select images');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
        base64: false,
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        
        if (!image.uri) {
          throw new Error('Image URI is missing');
        }
        
        setSelectedImage(image);
        setAnalysisResult(null);
        setError(null);
        Alert.alert('Success', 'Image selected successfully!');
      } else {
        Alert.alert('Info', 'No image was selected');
      }
    } catch (error) {
      setError(`Gallery error: ${error.message}`);
      Alert.alert('Error', `Failed to pick image: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Request permissions and take photo with camera
  const takePhotoWithCamera = async () => {
    try {
      setIsLoading(true);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        base64: false,
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        
        if (!image.uri) {
          throw new Error('Image URI is missing');
        }
        
        setSelectedImage(image);
        setAnalysisResult(null);
        setError(null);
        Alert.alert('Success', 'Photo taken successfully!');
      }
    } catch (error) {
      setError(`Camera error: ${error.message}`);
      Alert.alert('Error', `Failed to take photo: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced disease analysis
  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await EnhancedImageAnalysisService.analyzeDiseaseEnhanced(
        selectedImage.uri,
        cropType,
        selectedModels
      );

      if (result.success) {
        setAnalysisResult(result);
        
        // Load store products for the detected disease
        if (result.analysis.disease_type && result.analysis.disease_type !== 'Unknown') {
          const products = await EnhancedImageAnalysisService.getStoreProducts(result.analysis.disease_type);
          if (products.success) {
            setStoreProducts(products.products);
          }
        }
        
        Alert.alert('Analysis Complete', 'Enhanced disease analysis completed successfully!');
      } else {
        throw new Error(result.error || 'Enhanced analysis failed');
      }
    } catch (error) {
      setError(error.message);
      Alert.alert('Analysis Failed', `Failed to analyze image: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset all states
  const resetAll = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(false);
    setIsLoading(false);
    setStoreProducts([]);
  };

  // Render AI models selection modal
  const renderModelsModal = () => (
    <Modal
      visible={showModels}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select AI Models</Text>
          <TouchableOpacity onPress={() => setShowModels(false)}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          {availableModels.map((model) => (
            <TouchableOpacity
              key={model.id}
              style={[
                styles.modelOption,
                selectedModels.includes(model.id) && styles.modelOptionSelected
              ]}
              onPress={() => {
                if (model.id === 'all') {
                  setSelectedModels(['all']);
                } else {
                  const newModels = selectedModels.includes('all') 
                    ? [model.id]
                    : selectedModels.includes(model.id)
                    ? selectedModels.filter(m => m !== model.id)
                    : [...selectedModels.filter(m => m !== 'all'), model.id];
                  setSelectedModels(newModels.length > 0 ? newModels : ['all']);
                }
              }}
            >
              <View style={styles.modelInfo}>
                <Text style={styles.modelName}>{model.name}</Text>
                <Text style={styles.modelDescription}>{model.description}</Text>
              </View>
              {selectedModels.includes(model.id) && (
                <MaterialIcons name="check" size={24} color="#4CAF50" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  // Render crop type selection
  const renderCropTypeSelection = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.cardTitle}>🌾 Crop Type (Optional)</Title>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {cropTypes.map((crop) => (
            <Chip
              key={crop}
              selected={cropType === crop}
              onPress={() => setCropType(cropType === crop ? '' : crop)}
              style={styles.cropChip}
            >
              {crop}
            </Chip>
          ))}
        </ScrollView>
      </Card.Content>
    </Card>
  );

  // Render AI models status
  const renderAIModelsStatus = () => {
    if (!aiModelsStatus) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>🤖 AI Models Status</Title>
          <View style={styles.modelsGrid}>
            {Object.entries(aiModelsStatus.models).map(([model, status]) => (
              <View key={model} style={styles.modelStatus}>
                <Text style={styles.modelName}>{model}</Text>
                <Badge 
                  style={[
                    styles.statusBadge,
                    { backgroundColor: status.status === 'active' ? '#4CAF50' : '#F44336' }
                  ]}
                >
                  {status.status}
                </Badge>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    );
  };

  // Render analysis results
  const renderAnalysisResults = () => {
    if (!analysisResult) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>🔬 Enhanced Analysis Results</Title>
          
          {/* Disease Information */}
          <View style={styles.resultSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="eco" size={24} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Disease Detection</Text>
            </View>
            <Text style={styles.diseaseName}>
              {analysisResult.analysis.disease_type}
            </Text>
            <Text style={styles.severity}>
              Severity: {analysisResult.analysis.severity_level}
            </Text>
            <Text style={styles.confidence}>
              Confidence: {Math.round(analysisResult.analysis.confidence * 100)}%
            </Text>
          </View>

          {/* Crop Information */}
          <View style={styles.resultSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="local-florist" size={24} color="#FF9800" />
              <Text style={styles.sectionTitle}>Crop Information</Text>
            </View>
            <Text style={styles.cropType}>
              Crop: {analysisResult.analysis.crop_type}
            </Text>
          </View>

          {/* Symptoms */}
          {analysisResult.analysis.symptoms && analysisResult.analysis.symptoms.length > 0 && (
            <View style={styles.resultSection}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="visibility" size={24} color="#2196F3" />
                <Text style={styles.sectionTitle}>Symptoms</Text>
              </View>
              {analysisResult.analysis.symptoms.map((symptom, index) => (
                <Text key={index} style={styles.symptom}>
                  • {symptom}
                </Text>
              ))}
            </View>
          )}

          {/* AI Models Used */}
          <View style={styles.resultSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="smart-toy" size={24} color="#9C27B0" />
              <Text style={styles.sectionTitle}>AI Models Used</Text>
            </View>
            <Text style={styles.modelsUsed}>
              {analysisResult.aiModels ? analysisResult.aiModels.join(', ') : 'All models'}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  // Render AGROF store treatments
  const renderStoreTreatments = () => {
    if (!analysisResult || !storeProducts.length) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>🛒 AGROF Store Treatments</Title>
          <Text style={styles.treatmentsSubtitle}>
            Recommended products for {analysisResult.analysis.disease_type}
          </Text>
          
          <FlatList
            data={storeProducts.slice(0, 5)} // Show top 5 products
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.treatmentItem}>
                <Text style={styles.treatmentName}>{item.name}</Text>
                {item.price && (
                  <Text style={styles.treatmentPrice}>{item.price}</Text>
                )}
                {item.application && (
                  <Text style={styles.treatmentApplication}>
                    Application: {item.application}
                  </Text>
                )}
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </Card.Content>
      </Card>
    );
  };

  // Render recommendations
  const renderRecommendations = () => {
    if (!analysisResult) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>💡 Recommendations</Title>
          
          {/* Immediate Actions */}
          {analysisResult.recommendations.immediate_actions && (
            <View style={styles.resultSection}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="flash-on" size={24} color="#FF5722" />
                <Text style={styles.sectionTitle}>Immediate Actions</Text>
              </View>
              {analysisResult.recommendations.immediate_actions.map((action, index) => (
                <Text key={index} style={styles.recommendation}>
                  • {action}
                </Text>
              ))}
            </View>
          )}

          {/* Prevention */}
          {analysisResult.recommendations.prevention && analysisResult.recommendations.prevention.length > 0 && (
            <View style={styles.resultSection}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="shield" size={24} color="#4CAF50" />
                <Text style={styles.sectionTitle}>Prevention</Text>
              </View>
              {analysisResult.recommendations.prevention.map((prevention, index) => (
                <Text key={index} style={styles.recommendation}>
                  • {prevention}
                </Text>
              ))}
            </View>
          )}

          {/* Follow-up */}
          {analysisResult.recommendations.follow_up && (
            <View style={styles.resultSection}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="schedule" size={24} color="#2196F3" />
                <Text style={styles.sectionTitle}>Follow-up</Text>
              </View>
              {analysisResult.recommendations.follow_up.map((followUp, index) => (
                <Text key={index} style={styles.recommendation}>
                  • {followUp}
                </Text>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🔬 Enhanced Disease Detection</Text>
          <Text style={styles.headerSubtitle}>Multi-model AI analysis with AGROF store integration</Text>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* AI Models Status */}
        {renderAIModelsStatus()}

        {/* Crop Type Selection */}
        {renderCropTypeSelection()}

        {/* Image Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>📸 Select Plant Image</Title>
            <Paragraph style={styles.cardSubtitle}>
              Take a photo or choose from gallery for enhanced AI analysis
            </Paragraph>
            
            {/* Image Display */}
            <View style={styles.imageContainer}>
              {selectedImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image 
                    source={{ uri: selectedImage.uri }} 
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity style={styles.removeButton} onPress={resetAll}>
                    <MaterialIcons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.imagePlaceholder}
                  onPress={pickImageFromGallery}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="large" color="#4CAF50" />
                  ) : (
                    <>
                      <MaterialIcons name="add-a-photo" size={64} color="#666" />
                      <Text style={styles.placeholderText}>Tap to select image</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.galleryButton]} 
                onPress={pickImageFromGallery}
                disabled={isLoading}
              >
                <MaterialIcons name="photo-library" size={24} color="#fff" />
                <Text style={styles.buttonText}>Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.cameraButton]} 
                onPress={takePhotoWithCamera}
                disabled={isLoading}
              >
                <MaterialIcons name="camera-alt" size={24} color="#fff" />
                <Text style={styles.buttonText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.modelsButton]} 
                onPress={() => setShowModels(true)}
              >
                <MaterialIcons name="smart-toy" size={24} color="#fff" />
                <Text style={styles.buttonText}>AI Models</Text>
              </TouchableOpacity>
            </View>

            {/* Analyze Button */}
            {selectedImage && (
              <Button
                mode="contained"
                onPress={analyzeImage}
                disabled={isAnalyzing}
                style={styles.analyzeButton}
                contentStyle={styles.analyzeButtonContent}
              >
                {isAnalyzing ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#fff' }}>Analyzing with AI...</Text>
                  </>
                ) : (
                  <Text style={{ color: '#fff' }}>🔍 Enhanced AI Analysis</Text>
                )}
              </Button>
            )}
          </Card.Content>
        </Card>

        {/* Error Display */}
        {error && (
          <Card style={[styles.card, styles.errorCard]}>
            <Card.Content>
              <View style={styles.errorContainer}>
                <MaterialIcons name="error" size={24} color="#F44336" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Analysis Results */}
        {renderAnalysisResults()}

        {/* Store Treatments */}
        {renderStoreTreatments()}

        {/* Recommendations */}
        {renderRecommendations()}
      </ScrollView>

      {/* AI Models Modal */}
      {renderModelsModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  imageContainer: {
    marginBottom: 16,
  },
  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  imagePreview: {
    width: width - 64,
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: width - 64,
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 8,
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.3,
    justifyContent: 'center',
  },
  galleryButton: {
    backgroundColor: '#4CAF50',
  },
  cameraButton: {
    backgroundColor: '#2196F3',
  },
  modelsButton: {
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 12,
  },
  analyzeButton: {
    backgroundColor: '#FF9800',
    marginTop: 8,
  },
  analyzeButtonContent: {
    paddingVertical: 8,
  },
  resultSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 4,
  },
  severity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  confidence: {
    fontSize: 14,
    color: '#666',
  },
  cropType: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  symptom: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  modelsUsed: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  treatmentItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  treatmentPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  treatmentApplication: {
    fontSize: 12,
    color: '#666',
  },
  treatmentsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  recommendation: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  errorCard: {
    borderColor: '#F44336',
    borderWidth: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#F44336',
    marginLeft: 8,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
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
  modelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  modelOptionSelected: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modelDescription: {
    fontSize: 14,
    color: '#666',
  },
  modelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modelStatus: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  statusBadge: {
    marginTop: 4,
  },
  cropChip: {
    marginRight: 8,
    marginBottom: 8,
  },
});

export default EnhancedDiseaseDetectionScreen;
