/**
 * Proper Image Analysis Service - Backend API Integration
 * Sends images to AGROF backend which uses Gemini AI for analysis
 */

import { Platform } from 'react-native';
import { AI_API_URL } from '../config/apiConfig';

// Backend API endpoint (uses backend's Gemini integration)
const BACKEND_ANALYZE_URL = `${AI_API_URL}/analyze`;

/**
 * Analyze image using Backend API (which uses Gemini AI)
 * @param {string} imageUri - Image URI
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeImageWithProperMethod = async (imageUri) => {
  try {
    console.log('🤖 Starting image analysis via Backend API...');
    console.log('📸 Image URI:', imageUri);
    console.log('🌐 Backend URL:', BACKEND_ANALYZE_URL);
    
    // Create form data for multipart upload
    const formData = new FormData();
    
    // Get file name from URI
    const fileName = imageUri.split('/').pop() || 'plant-image.jpg';
    
    // Append image file
    formData.append('image', {
      uri: imageUri,
      name: fileName,
      type: 'image/jpeg'
    });
    
    // Append stakeholder type
    formData.append('stakeholder', 'farmers');
    
    console.log('📡 Sending image to backend API...');
    
    // Send request to backend API
    const response = await fetch(BACKEND_ANALYZE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
      timeout: 30000 // 30 second timeout
    });
    
    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend API Error:', errorText);
      throw new Error(`Backend API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Backend API response received');
    console.log('📊 Response:', result);
    
    // Parse the backend response
    if (result.status === 'success' && result.analysis) {
      console.log('✅ Analysis complete from backend');
      
      return {
        success: true,
        analysis: {
          crop_type: result.analysis.crop_type || 'Unknown',
          plant_family: result.analysis.plant_family || 'Unknown',
          growth_stage: result.analysis.growth_stage || 'unknown',
          health_status: result.analysis.health_status || 'unknown',
          disease_type: result.analysis.disease_type || 'Unknown',
          severity_level: result.analysis.severity_level || 'unknown',
          symptoms: result.analysis.symptoms || [],
          affected_parts: result.analysis.affected_parts || [],
          recommendations: result.analysis.recommendations || [],
          prevention: result.analysis.prevention || [],
          confidence: result.analysis.confidence || 0.0
        },
        rawResponse: JSON.stringify(result),
        timestamp: new Date().toISOString(),
        imageProcessed: true,
        source: 'Backend API (Gemini AI)'
      };
    } else {
      throw new Error(result.message || 'No analysis results from backend');
    }
    
  } catch (error) {
    console.error('❌ Backend image analysis failed:', error);
    throw new Error(`Backend analysis failed: ${error.message}`);
  }
};

/**
 * Get image analysis from backend with fallback
 * @param {string} imageUri - Image URI
 * @returns {Promise<Object>} Analysis result with fallback
 */
export const getProperImageAnalysis = async (imageUri) => {
  try {
    console.log('🔍 Starting backend image analysis...');
    console.log('📸 Processing image:', imageUri);
    
    const result = await analyzeImageWithProperMethod(imageUri);
    return result;
  } catch (error) {
    console.error('❌ Backend image analysis failed:', error.message);
    console.warn('⚠️ Check backend connection at:', BACKEND_ANALYZE_URL);
    
    // Return a fallback response
    return {
      success: false,
      analysis: {
        crop_type: "Unknown",
        plant_family: "Unknown",
        growth_stage: "unknown",
        health_status: "unknown",
        disease_type: "Backend Connection Failed",
        severity_level: "unknown",
        symptoms: ["Cannot connect to backend server", "Please check your network connection"],
        affected_parts: ["unknown"],
        recommendations: [
          "Ensure backend server is running",
          "Check network connection",
          "Try again in a moment",
          "Consult agricultural expert if issue persists"
        ],
        prevention: ["Regular monitoring recommended"],
        confidence: 0.0
      },
      error: error.message,
      timestamp: new Date().toISOString(),
      imageProcessed: false,
      source: 'Error - Backend Unavailable'
    };
  }
};

export default {
  analyzeImageWithProperMethod,
  getProperImageAnalysis
};
