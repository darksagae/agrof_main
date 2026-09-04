import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme';
import hybridDiseaseDetection from '../services/hybridDiseaseDetection';
import networkManager from '../services/networkManager';
import ProductRecommendationCards from '../components/ProductRecommendationCards';

const { width, height } = Dimensions.get('window');

const DiseaseDetectionScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Request permissions and pick image from gallery (Alternative Method)
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
        
        // Validate image data
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

  // Request permissions and take photo with camera (Alternative Method)
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
        
        // Validate image data
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

  // Analyze image with Hybrid Detection (Gemini AI or TensorFlow Lite)
  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Initialize network manager
      await networkManager.initialize();
      const networkStatus = networkManager.getStatus();
      
      console.log('📡 Network Status:', networkStatus.isOnline ? 'Online' : 'Offline');
      console.log('🔬 Starting hybrid disease detection...');

      // Use hybrid detection service (auto-switches between Gemini AI and TensorFlow Lite)
      const result = await hybridDiseaseDetection.analyzeImage(selectedImage.uri);

      console.log('🔬 Detection result:', result);

      if (result.success) {
        // Format the result for display
        const detectionMethod = result.source === 'gemini_ai' ? 'Gemini AI (Online)' : 
                               result.source === 'tensorflow_lite' ? 'TensorFlow Lite (Offline)' : 
                               'Unknown';
        
        setAnalysisResult({
          status: 'success',
          message: `Analysis completed using ${detectionMethod}`,
          analysis: {
            disease: result.disease || 'Disease detected',
            severity: result.severity || 'medium',
            treatment: result.treatment || result.message,
            confidence: result.confidencePercent || result.confidence || 'N/A',
            method: result.method,
            accuracy: result.accuracy,
            dataUsed: result.dataUsed || '0 KB'
          },
          timestamp: new Date().toISOString(),
          source: result.source
        });
        
        Alert.alert(
          'Analysis Complete', 
          `${detectionMethod}\n${result.isConfident === false ? '⚠️ Low confidence - Connect to WiFi for better accuracy' : '✅ High confidence detection'}`
        );
      } else {
        // Handle failure
        throw new Error(result.message || result.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('❌ Disease detection error:', error);
      setError(error.message);
      Alert.alert('Analysis Failed', `${error.message}\n\nTip: ${networkManager.isOnline ? 'Try TensorFlow Lite model' : 'Connect to WiFi for AI analysis'}`);
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
  };

  // Render image selection area
  const renderImageSelection = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.cardTitle}><Text>📸 Select Plant Image</Text></Title>
        <Paragraph style={styles.cardSubtitle}>
          <Text>Take a photo or choose from gallery to detect plant diseases</Text>
        </Paragraph>
        
        {/* Image Display Area */}
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image 
                source={{ uri: selectedImage.uri }} 
                style={styles.imagePreview}
                onError={(error) => {
                  setError('Failed to load image. Please try again.');
                }}
              />
              <TouchableOpacity style={styles.removeButton} onPress={resetAll}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.imageInfo}>
                <Text style={styles.imageInfoText}>
                  {selectedImage.width}x{selectedImage.height} • {Math.round((selectedImage.fileSize || 0) / 1024)}KB
                </Text>
              </View>
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
                  <Text style={styles.placeholderSubtext}>or use buttons below</Text>
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
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.cameraButton]} 
            onPress={takePhotoWithCamera}
            disabled={isLoading}
          >
            <MaterialIcons name="camera-alt" size={24} color="#fff" />
            <Text style={styles.buttonText}>Take Photo</Text>
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
                <Text style={{ color: '#fff' }}>Analyzing...</Text>
              </>
            ) : (
              <Text style={{ color: '#fff' }}>🔍 Analyze Disease</Text>
            )}
          </Button>
        )}
      </Card.Content>
    </Card>
  );

  // Render analysis results
  const renderAnalysisResults = () => {
    if (!analysisResult) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}><Text>Analysis Results</Text></Title>
          
          {/* Crop Identification */}
          <View style={styles.resultSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="eco" size={24} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Crop Identification</Text>
            </View>
            <View style={styles.cropInfo}>
              <Text style={styles.cropType}>
                {analysisResult.analysis?.crop_type || 'Unknown Crop'}
              </Text>
              <Text style={styles.plantFamily}>
                Family: {analysisResult.analysis?.plant_family || 'Unknown'}
              </Text>
              <Text style={styles.growthStage}>
                Stage: {analysisResult.analysis?.growth_stage || 'Unknown'}
              </Text>
            </View>
          </View>

          {/* Health Status */}
          <View style={styles.resultSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons 
                name="favorite" 
                size={24} 
                color={analysisResult.analysis?.health_status === 'healthy' ? '#4CAF50' : '#FF5722'} 
              />
              <Text style={styles.sectionTitle}>Health Status</Text>
            </View>
            <Chip 
              style={[
                styles.healthChip,
                { backgroundColor: analysisResult.analysis?.health_status === 'healthy' ? '#E8F5E8' : '#FFEBEE' }
              ]}
              textStyle={{
                color: analysisResult.analysis?.health_status === 'healthy' ? '#2E7D32' : '#C62828'
              }}
            >
              <Text>{analysisResult.analysis?.health_status === 'healthy' ? 'Healthy Plant' : 'Diseased Plant'}</Text>
            </Chip>
          </View>

          {/* Disease Information */}
          {analysisResult.analysis?.disease_type && analysisResult.analysis.disease_type !== 'none' && (
            <View style={styles.resultSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Disease Detected</Text>
              </View>
              <Text style={styles.diseaseName}>
                {analysisResult.analysis.disease_type}
              </Text>
              {analysisResult.analysis.severity_level && (
                <Text style={styles.severity}>
                  Severity: {analysisResult.analysis.severity_level}
                </Text>
              )}
            </View>
          )}

          {/* Recommendations */}
          {analysisResult.analysis?.recommendations && analysisResult.analysis.recommendations.length > 0 && (
            <View style={styles.resultSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommendations</Text>
              </View>
              {analysisResult.analysis.recommendations.map((rec, index) => (
                <Text key={index} style={styles.recommendation}>
                  • {rec}
                </Text>
              ))}
            </View>
          )}

          {/* Confidence Score */}
          {analysisResult.analysis?.confidence && (
            <View style={styles.resultSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Confidence Score</Text>
              </View>
              <Text style={styles.confidence}>
                {Math.round(analysisResult.analysis.confidence * 100)}%
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  // Render error message
  const renderError = () => {
    if (!error) return null;

    return (
      <Card style={[styles.card, styles.errorCard]}>
        <Card.Content>
          <View style={styles.errorContainer}>
            <MaterialIcons name="error" size={24} color="#F44336" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
          <Button mode="outlined" onPress={() => setError(null)} style={styles.retryButton}>
            <Text style={{ color: '#F44336' }}>Dismiss</Text>
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        source={require('../assets/green.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Content Overlay */}
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header with Back Button */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#2E7D32" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Disease Detection</Text>
              <Text style={styles.headerSubtitle}>Advanced plant health analysis and crop monitoring</Text>
            </View>
          </View>
          
          <ScrollView contentContainerStyle={styles.scrollContent}>

            {/* Image Selection */}
            {renderImageSelection()}

            {/* Error Display */}
            {renderError()}

            {/* Analysis Results */}
            {renderAnalysisResults()}

            {/* Product Recommendations */}
            {analysisResult && (
              <ProductRecommendationCards
                diseaseType={analysisResult.analysis?.disease_type}
                symptoms={analysisResult.analysis?.symptoms}
                onProductPress={(product) => {
                  // Navigate to product detail or handle product selection
                  console.log('Product selected:', product);
                }}
              />
            )}

          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent overlay for better text readability
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.8)', // Semi-transparent dark background
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 51, 51, 0.5)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#333333',
  },
  headerContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#cccccc',
  },
  card: {
    marginBottom: 16,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    elevation: 2,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#cccccc',
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
  imageInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  imageInfoText: {
    color: '#fff',
    fontSize: 12,
  },
  imageDebugInfo: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    maxWidth: width - 100,
  },
  imagePlaceholder: {
    width: width - 64,
    height: 200,
    backgroundColor: '#333333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 8,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeholderSubtext: {
    marginTop: 4,
    color: '#cccccc',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.45,
    justifyContent: 'center',
  },
  galleryButton: {
    backgroundColor: '#4CAF50',
  },
  cameraButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
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
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
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
    color: '#ffffff',
  },
  healthChip: {
    alignSelf: 'flex-start',
  },
  cropInfo: {
    marginTop: 8,
  },
  cropType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  plantFamily: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 2,
  },
  growthStage: {
    fontSize: 14,
    color: '#cccccc',
    fontStyle: 'italic',
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 4,
  },
  severity: {
    fontSize: 14,
    color: '#cccccc',
  },
  recommendation: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
    lineHeight: 20,
  },
  confidence: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  errorCard: {
    borderColor: '#F44336',
    borderWidth: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorText: {
    color: '#F44336',
    marginLeft: 8,
    flex: 1,
  },
  retryButton: {
    borderColor: '#F44336',
  },
  instructionText: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
});

export default DiseaseDetectionScreen;