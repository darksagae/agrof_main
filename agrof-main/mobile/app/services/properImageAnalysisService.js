/**
 * Proper Image Analysis Service - JavaScript-based AI image processing
 * Handles real image analysis using Gemini AI with proper image conversion
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Key comes from app.config.js -> extra.geminiApiKey, which reads process.env.GEMINI_API_KEY (.env, gitignored).
// Do NOT hardcode the key here — committed keys get auto-revoked by Google's leak scanner.
const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey || '';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

if (!GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY is missing. Set it in agrof-main/mobile/app/.env and restart Expo (npx expo start -c).');
}

/**
 * Convert image to base64 using React Native's built-in capabilities
 * @param {string} imageUri - Image URI
 * @returns {Promise<string>} Base64 encoded image
 */
const convertImageToBase64 = async (imageUri) => {
  try {
    console.log('🔄 Converting image to base64 (no quality restrictions)...');
    console.log('📸 Image URI:', imageUri);
    
    // For React Native, we'll use fetch to get the image
    const response = await fetch(imageUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    // Convert to blob first
    const blob = await response.blob();
    console.log('📊 Blob size:', blob.size, 'bytes');
    
    // Convert blob to base64 using FileReader
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Extract base64 string (remove data:image/jpeg;base64, prefix)
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    
    console.log('✅ Image converted to base64');
    console.log('📊 Base64 length:', base64.length);
    
    return base64;
  } catch (error) {
    console.error('❌ Error converting image to base64:', error);
    throw new Error(`Image conversion failed: ${error.message}`);
  }
};

/**
 * Analyze image using Gemini AI with proper image data
 * @param {string} imageUri - Image URI
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeImageWithProperMethod = async (imageUri) => {
  try {
    console.log('🤖 Starting proper image analysis with Gemini AI...');
    console.log('📸 Image URI:', imageUri);
    
    // Convert image to base64
    const imageBase64 = await convertImageToBase64(imageUri);
    
    // Accept any image data - no quality restrictions
    if (!imageBase64) {
      throw new Error('No image data received');
    }
    
    // Prepare the prompt for plant disease analysis and crop identification
    const prompt = `Analyze this plant image for disease detection and crop identification. 

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON object.

Return a JSON object with these exact fields:
{
  "crop_type": "specific crop name",
  "plant_family": "botanical family name", 
  "growth_stage": "seedling/vegetative/flowering/fruiting/mature",
  "health_status": "healthy or diseased",
  "disease_type": "specific disease name or none",
  "severity_level": "low/medium/high",
  "symptoms": ["list of symptoms"],
  "affected_parts": ["list of affected parts"],
  "recommendations": ["treatment recommendations"],
  "prevention": ["prevention strategies"],
  "confidence": 0.0
}

Analyze the plant for:
- Crop identification (tomato, corn, rice, wheat, etc.)
- Disease detection (fungal, bacterial, viral, pest damage)
- Health assessment (healthy, diseased, stressed)
- Treatment recommendations
- Prevention strategies

Be specific and accurate. If uncertain, set confidence lower and provide general advice.`;
    
    // Prepare the request payload
    const payload = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: imageBase64
            }
          }
        ]
      }]
    };
    
    console.log('📡 Sending image to Gemini API...');
    console.log('📊 Payload size:', JSON.stringify(payload).length, 'characters');
    console.log('📊 Base64 length:', imageBase64.length);
    
    // Send request to Gemini API
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Gemini API response received');
    
    // Parse the analysis result
    if (result.candidates && result.candidates.length > 0) {
      const analysisText = result.candidates[0].content.parts[0].text;
      console.log('🔍 Raw analysis text length:', analysisText.length);
      
      // Try to extract JSON from the response with multiple strategies
      try {
        console.log('🔍 Raw response text:', analysisText.substring(0, 200) + '...');
        
        // Strategy 1: Look for JSON object in the response
        let jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        
        // Strategy 2: If no JSON found, look for JSON array
        if (!jsonMatch) {
          jsonMatch = analysisText.match(/\[[\s\S]*\]/);
        }
        
        // Strategy 3: Try to find JSON after common prefixes
        if (!jsonMatch) {
          const jsonStart = analysisText.indexOf('{');
          if (jsonStart !== -1) {
            const jsonEnd = analysisText.lastIndexOf('}');
            if (jsonEnd > jsonStart) {
              jsonMatch = [analysisText.substring(jsonStart, jsonEnd + 1)];
            }
          }
        }
        
        if (jsonMatch) {
          console.log('📋 Found JSON match:', jsonMatch[0].substring(0, 100) + '...');
          const analysisJson = JSON.parse(jsonMatch[0]);
          console.log('✅ Parsed analysis JSON:', analysisJson);
          
          return {
            success: true,
            analysis: analysisJson,
            rawResponse: analysisText,
            timestamp: new Date().toISOString(),
            imageProcessed: true
          };
        } else {
          // Fallback: create structured response from text analysis
          console.log('⚠️ No JSON found, analyzing text response');
          
          // Try to extract information from the text
          const cropMatch = analysisText.match(/(?:crop|plant).*?(?:is|appears to be|looks like)\s+([a-zA-Z\s]+)/i);
          const diseaseMatch = analysisText.match(/(?:disease|problem|issue).*?(?:is|appears to be|looks like)\s+([a-zA-Z\s]+)/i);
          const healthMatch = analysisText.match(/(healthy|diseased|sick|infected)/i);
          
          return {
            success: true,
            analysis: {
              crop_type: cropMatch ? cropMatch[1].trim() : "unknown",
              plant_family: "unknown",
              growth_stage: "unknown",
              health_status: healthMatch ? healthMatch[1].toLowerCase() : "unknown",
              disease_type: diseaseMatch ? diseaseMatch[1].trim() : "none",
              severity_level: "unknown",
              symptoms: ["Analysis from text response"],
              affected_parts: ["unknown"],
              recommendations: ["Consult agricultural expert for detailed analysis"],
              prevention: ["Regular monitoring recommended"],
              confidence: 0.3
            },
            rawResponse: analysisText,
            timestamp: new Date().toISOString(),
            imageProcessed: true
          };
        }
      } catch (parseError) {
        console.error('❌ Error parsing Gemini response:', parseError);
        console.log('📋 Raw response that failed to parse:', analysisText.substring(0, 500));
        
        // Return a more helpful error response
        return {
          success: false,
          analysis: {
            crop_type: "unknown",
            plant_family: "unknown",
            growth_stage: "unknown",
            health_status: "unknown",
            disease_type: "analysis_failed",
            severity_level: "unknown",
            symptoms: ["Unable to parse AI response"],
            affected_parts: ["unknown"],
            recommendations: ["Please try again with a different image"],
            prevention: ["Regular monitoring recommended"],
            confidence: 0.0
          },
          error: `Failed to parse AI response: ${parseError.message}`,
          rawResponse: analysisText,
          timestamp: new Date().toISOString(),
          imageProcessed: true
        };
      }
    } else {
      throw new Error('No analysis results from Gemini API');
    }
    
  } catch (error) {
    console.error('❌ Proper image analysis failed:', error);
    throw new Error(`Proper image analysis failed: ${error.message}`);
  }
};

/**
 * Get proper image analysis with fallback
 * @param {string} imageUri - Image URI
 * @returns {Promise<Object>} Analysis result with fallback
 */
export const getProperImageAnalysis = async (imageUri) => {
  try {
    console.log('🔍 Starting proper image analysis...');
    console.log('📸 Processing image:', imageUri);
    
    const result = await analyzeImageWithProperMethod(imageUri);
    return result;
  } catch (error) {
    console.error('❌ Proper image analysis failed, using fallback');
    
    // Return a fallback response
    return {
      success: false,
      analysis: {
        crop_type: "unknown",
        plant_family: "unknown",
        growth_stage: "unknown",
        health_status: "unknown",
        disease_type: "analysis_failed",
        severity_level: "unknown",
        symptoms: ["Analysis unavailable - please try again"],
        affected_parts: ["unknown"],
        recommendations: ["Please try again or consult an expert"],
        prevention: ["Regular monitoring recommended"],
        confidence: 0.0
      },
      error: error.message,
      timestamp: new Date().toISOString(),
      imageProcessed: false
    };
  }
};

export default {
  analyzeImageWithProperMethod,
  getProperImageAnalysis
};