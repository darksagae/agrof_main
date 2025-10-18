/**
 * AGROF TFLite Service - Loads and uses the trained agrof_5crop_model.tflite
 * 
 * This service specifically loads the model we trained in Google Colab
 * for 5 crops (Beans, Coffee, Tomato, Potato, Pepper) with 20 disease classes.
 */

// Note: TensorFlow imports commented out for Expo Go compatibility
// Uncomment these when building with EAS Build for full TFLite support
// import * as tf from '@tensorflow/tfjs';
// import '@tensorflow/tfjs-react-native';
// import * as FileSystem from 'expo-file-system';
// import * as ImageManipulator from 'expo-image-manipulator';
// import { Asset } from 'expo-asset';

// Model path - our trained model
// Note: .tflite files need to be loaded differently in React Native
const AGROF_MODEL_PATH = '../assets/models/agrof_5crop_model.tflite';

// Class labels for our model (20 classes)
const AGROF_CLASSES = [
  "Beans_angular_leaf_spot",
  "Beans_bean_rust",
  "Beans_healthy",
  "Coffee_miner_img_xml",
  "Coffee_rust_xml_image",
  "Pepper_bell_Bacterial_spot",
  "Pepper_bell_healthy",
  "Potato_Early_blight",
  "Potato_Late_blight",
  "Potato_healthy",
  "Tomato_Bacterial_spot",
  "Tomato_Early_blight",
  "Tomato_Late_blight",
  "Tomato_Leaf_Mold",
  "Tomato_Septoria_leaf_spot",
  "Tomato_Spider_mites_Two_spotted_spider_mite",
  "Tomato_Target_Spot",
  "Tomato_Tomato_YellowLeaf_Curl_Virus",
  "Tomato_Tomato_mosaic_virus",
  "Tomato_healthy"
];

class AgrofTFLiteService {
  constructor() {
    this.model = null;
    this.isModelLoaded = false;
    this.isInitialized = false;
    this.imageSize = 224; // Our model expects 224x224 images
  }

  /**
   * Initialize TensorFlow.js
   */
  async initialize() {
    console.log('🤖 AGROF TFLite Service (Expo Go Mode)');
    console.log('⚠️  TFLite requires EAS Build - not available in Expo Go');
    console.log('✅ Will use Gemini AI fallback instead');
    
    // In Expo Go, we can't use TensorFlow, so just return false
    // This tells the hybrid service to skip TFLite and use Gemini
    this.isInitialized = false;
    this.isModelLoaded = false;
    
    return false;
  }

  /**
   * Load the AGROF model
   */
  async loadModel() {
    console.log('⚠️  TFLite not available in Expo Go');
    throw new Error('TFLite requires EAS Build. Using Gemini AI.');
  }

  /**
   * Preprocess image for model input
   */
  async preprocessImage(imageUri) {
    throw new Error('TFLite preprocessing not available in Expo Go');
  }

  /**
   * Analyze image and return predictions
   */
  async analyze(imageUri) {
    console.log('⚠️  TFLite analysis not available in Expo Go');
    throw new Error('TFLite requires EAS Build. Using Gemini AI fallback.');
  }

  /**
   * Check if model is ready
   */
  isReady() {
    // In Expo Go, TFLite is never ready (needs native modules)
    // Return false so hybrid service uses Gemini instead
    return false;
  }

  /**
   * Get model info
   */
  getInfo() {
    return {
      name: 'AGROF 5-Crop Disease Detection',
      crops: ['Beans', 'Coffee', 'Tomato', 'Potato', 'Pepper'],
      classes: AGROF_CLASSES.length,
      imageSize: this.imageSize,
      isLoaded: this.isModelLoaded,
      isInitialized: this.isInitialized
    };
  }

  /**
   * Cleanup resources
   */
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isModelLoaded = false;
    }
    console.log('🧹 AGROF TFLite Service cleaned up');
  }
}

// Create singleton instance
const agrofTFLiteService = new AgrofTFLiteService();

export default agrofTFLiteService;
export { AgrofTFLiteService, AGROF_CLASSES };

