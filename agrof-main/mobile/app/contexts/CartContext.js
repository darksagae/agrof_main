import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { cartApi } from '../services/storeApi';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
        loading: false,
      };

    case 'ADD_TO_CART':
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    loading: false,
    error: null,
  });

  // Load cart items on mount
  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const items = await cartApi.getItems();
      dispatch({ type: 'SET_ITEMS', payload: items });
    } catch (error) {
      console.error('Failed to load cart items:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addToCart = async (product) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Add to backend
      await cartApi.addItem(product.id, 1);
      
      // Reload cart items
      await loadCartItems();
      
      return { success: true };
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Remove from backend
      await cartApi.removeItem(itemId);
      
      // Update local state
      dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Update in backend
      await cartApi.updateQuantity(itemId, quantity);
      
      // Update local state
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to update cart item quantity:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Clear backend cart
      await cartApi.clear();
      
      // Update local state
      dispatch({ type: 'CLEAR_CART' });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to clear cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      const price = parseFloat(item.price?.replace(/[^\d.]/g, '') || 0);
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.product_id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    items: state.items,
    loading: state.loading,
    error: state.error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCartItems,
    getTotalPrice,
    getTotalItems,
    isInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};





