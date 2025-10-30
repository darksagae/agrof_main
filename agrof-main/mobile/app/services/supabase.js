/**
 * Supabase Configuration
 * Database connection and configuration for the AgroF app
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
export const testSupabaseConnection = async () => {
  try {
    console.log('🔄 Testing Supabase connection...');
    const { data, error } = await supabase
      .from('crops')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
};

// Initialize Supabase
export const initializeSupabase = async () => {
  try {
    console.log('🔄 Initializing Supabase...');
    
    // Test connection
    const isConnected = await testSupabaseConnection();
    
    if (!isConnected) {
      console.warn('⚠️ Supabase connection failed, using fallback mode');
      return false;
    }
    
    console.log('✅ Supabase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Supabase:', error);
    return false;
  }
};

export default supabase;













