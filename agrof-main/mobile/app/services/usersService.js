/**
 * Users Service - Fetch all registered users from Firebase/Cloudinary
 * Used to display real buyers and sellers in the marketplace
 */

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import cloudinaryService from './cloudinaryService';

class UsersService {
  constructor() {
    this.cachedUsers = [];
    this.lastFetch = null;
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Fetch all users from Cloudinary via backend API
   * Returns array of user objects with profile data
   */
  async getAllUsers() {
    try {
      console.log('👥 UsersService: Fetching all users...');
      
      // Check cache first
      if (this.cachedUsers.length > 0 && this.lastFetch) {
        const cacheAge = Date.now() - this.lastFetch;
        if (cacheAge < this.CACHE_DURATION) {
          console.log('✅ Returning cached users:', this.cachedUsers.length);
          return { success: true, users: this.cachedUsers };
        }
      }

      // Fetch all users from Cloudinary backend
      const CLOUDINARY_BACKEND_URL = 'http://192.168.1.15:3002/api';
      console.log('🌐 Fetching users from:', CLOUDINARY_BACKEND_URL + '/users');
      
      const response = await fetch(`${CLOUDINARY_BACKEND_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000 // 15 second timeout
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.users) {
          console.log('✅ Loaded', result.users.length, 'users from Cloudinary');
          
          // Cache the users
          this.cachedUsers = result.users;
          this.lastFetch = Date.now();
          
          return { success: true, users: result.users };
        }
      }
      
      throw new Error('Failed to fetch users from backend');
    } catch (error) {
      console.error('❌ UsersService: Error fetching users:', error);
      return { success: false, error: error.message, users: [] };
    }
  }

  /**
   * Get users by role (buyer/seller)
   * For now, returns all users as both can be buyers and sellers
   */
  async getUsersByRole(role) {
    const result = await this.getAllUsers();
    if (result.success) {
      // In future: Filter by role in user profile
      // For now: All users can be both buyers and sellers
      return { success: true, users: result.users };
    }
    return result;
  }

  /**
   * Clear user cache
   */
  clearCache() {
    this.cachedUsers = [];
    this.lastFetch = null;
    console.log('🧹 UsersService: Cache cleared');
  }
}

export default new UsersService();

