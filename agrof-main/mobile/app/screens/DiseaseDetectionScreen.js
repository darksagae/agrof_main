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
import { getProperImageAnalysis } from '../services/properImageAnalysisService';

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
      console.log('📸 Requesting gallery permissions...');
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery permission is needed to select images');
        return;
      }

      console.log('📸 Opening gallery with alternative method...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
        base64: false,
        exif: false,
      });

      console.log('📸 Gallery result:', JSON.stringify(result, null, 2));

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        console.log('📸 Selected image details:', {
          uri: image.uri,
          width: image.width,
          height: image.height,
          type: image.type,
          fileSize: image.fileSize
        });
        
        // Validate image data
        if (!image.uri) {
          throw new Error('Image URI is missing');
        }
        
        setSelectedImage(image);
        setAnalysisResult(null);
        setError(null);
        console.log('📸 Image set successfully');
        Alert.alert('Success', 'Image selected successfully!');
      } else {
        console.log('📸 Image selection canceled or no assets');
        Alert.alert('Info', 'No image was selected');
      }
    } catch (error) {
      console.error('📸 Gallery error:', error);
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
      console.log('📷 Requesting camera permissions...');
      
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos');
        return;
      }

      console.log('📷 Opening camera with alternative method...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        base64: false,
        exif: false,
      });

      console.log('📷 Camera result:', JSON.stringify(result, null, 2));

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        console.log('📷 Captured image details:', {
          uri: image.uri,
          width: image.width,
          height: image.height,
          type: image.type,
          fileSize: image.fileSize
        });
        
        // Validate image data
        if (!image.uri) {
          throw new Error('Image URI is missing');
        }
        
        setSelectedImage(image);
        setAnalysisResult(null);
        setError(null);
        console.log('📷 Image set successfully');
        Alert.alert('Success', 'Photo taken successfully!');
      } else {
        console.log('📷 Photo capture canceled or no assets');
      }
    } catch (error) {
      console.error('📷 Camera error:', error);
      setError(`Camera error: ${error.message}`);
      Alert.alert('Error', `Failed to take photo: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze image with Gemini AI
  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('🤖 Starting JavaScript-based image analysis...');
      console.log('📸 Image URI:', selectedImage.uri);

      // Use proper image analysis service
      const result = await getProperImageAnalysis(selectedImage.uri);
      console.log('🤖 Analysis result:', result);

      if (result.success) {
        setAnalysisResult({
          status: 'success',
          message: 'Disease analysis completed using JavaScript AI',
          analysis: result.analysis,
          timestamp: result.timestamp
        });
        Alert.alert('Analysis Complete', 'Disease analysis completed successfully!');
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('🤖 Analysis error:', error);
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
                  console.error('Image load error:', error);
                  setError('Failed to load image. URI: ' + selectedImage.uri);
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', selectedImage.uri);
                }}
                onLoadStart={() => {
                  console.log('Image loading started:', selectedImage.uri);
                }}
                onLoadEnd={() => {
                  console.log('Image loading ended:', selectedImage.uri);
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
              <View style={styles.imageDebugInfo}>
                <Text style={styles.debugText}>URI: {selectedImage.uri}</Text>
                <Text style={styles.debugText}>Type: {selectedImage.type}</Text>
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



        {/* Debug Button */}
        <TouchableOpacity 
          style={styles.debugButton} 
          onPress={() => {
            console.log('🔧 Current state:', {
              selectedImage,
              isLoading,
              isAnalyzing,
              error
            });
            Alert.alert('Debug Info', `Selected Image: ${selectedImage ? 'Yes' : 'No'}\nLoading: ${isLoading}\nAnalyzing: ${isAnalyzing}\nError: ${error || 'None'}`);
          }}
        >
          <Text style={styles.debugButtonText}>🔧 Debug Info</Text>
        </TouchableOpacity>

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
          <Title style={styles.cardTitle}><Text>🔬 Analysis Results</Text></Title>
          
          {/* Crop Identification */}
          <View style={styles.resultSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="eco" size={24} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Crop Identification</Text>
            </View>
            <View style={styles.cropInfo}>
              <Text style={styles.cropType}>
                🌾 {analysisResult.analysis?.crop_type || 'Unknown Crop'}
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
              <Text>{analysisResult.analysis?.health_status === 'healthy' ? '🌱 Healthy Plant' : '🦠 Diseased Plant'}</Text>
            </Chip>
          </View>

          {/* Disease Information */}
          {analysisResult.analysis?.disease_type && analysisResult.analysis.disease_type !== 'none' && (
            <View style={styles.resultSection}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="warning" size={24} color="#FF9800" />
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
                <MaterialIcons name="lightbulb" size={24} color="#2196F3" />
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
                <MaterialIcons name="analytics" size={24} color="#9C27B0" />
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title style={styles.headerTitle}><Text>🔬 Disease Detection</Text></Title>
            <Paragraph style={styles.headerSubtitle}>
              <Text>AI-powered plant disease detection using advanced image analysis</Text>
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Image Selection */}
        {renderImageSelection()}

        {/* Error Display */}
        {renderError()}

        {/* Analysis Results */}
        {renderAnalysisResults()}

        {/* Instructions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}><Text>📋 Instructions</Text></Title>
            <Text style={styles.instructionText}>
              • Take a clear photo of the affected plant part{'\n'}
              • Ensure good lighting and focus{'\n'}
              • Include leaves, stems, or fruits in the image{'\n'}
              • Avoid blurry or dark images{'\n'}
              • The AI will analyze and provide disease diagnosis
            </Text>
          </Card.Content>
        </Card>
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
  headerCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
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
  debugText: {
    color: '#fff',
    fontSize: 10,
    marginBottom: 2,
  },
  debugButton: {
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: '#17a2b8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'center',
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
  placeholderSubtext: {
    marginTop: 4,
    color: '#999',
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
    backgroundColor: '#2196F3',
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
    color: '#666',
    marginBottom: 2,
  },
  growthStage: {
    fontSize: 14,
    color: '#666',
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
    color: '#666',
  },
  recommendation: {
    fontSize: 14,
    color: '#333',
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
    color: '#666',
    lineHeight: 20,
  },
});

export default DiseaseDetectionScreen;