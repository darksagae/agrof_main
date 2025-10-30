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
      const items = await cartApi.getItems();
      dispatch({ type: 'SET_ITEMS', payload: items });
    } catch (error) {
      console.error('Failed to load cart items:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addToCart = async (product) => {
    try {
      // Extract price from complex product structure
      let normalizedPrice = 0;
      
      if (product.price) {
        // Simple price field exists
        normalizedPrice = typeof product.price === 'string'
          ? parseFloat(product.price.replace(/[^\d.]/g, ''))
          : Number(product.price || 0);
      } else if (product.packages && product.packages.length > 0) {
        // Extract price from first package, first tier
        const firstPackage = product.packages[0];
        if (firstPackage.tiers && firstPackage.tiers.length > 0) {
          normalizedPrice = firstPackage.tiers[0].price || 0;
        }
      } else if (product.selling_price) {
        // Use selling_price if available
        normalizedPrice = typeof product.selling_price === 'string'
          ? parseFloat(product.selling_price.replace(/[^\d.]/g, ''))
          : Number(product.selling_price || 0);
      }

      // Generate unique cart item ID
      const cartItemId = `${product.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Optimistic update: update UI immediately
      dispatch({ type: 'ADD_TO_CART', payload: { ...product, id: cartItemId, price: normalizedPrice, quantity: product.quantity || 1 } });

      // Persist in background (best-effort)
      cartApi.addItem(product.id, product.quantity || 1).catch((e) => {
        console.warn('Cart persistence failed (add):', e.message);
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      // Optimistic remove: update UI immediately
      dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });

      // Persist in background (best-effort)
      cartApi.removeItem(itemId).catch((e) => {
        console.warn('Cart persistence failed (remove):', e.message);
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      // Optimistic update
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });

      // Persist in background
      cartApi.updateQuantity(itemId, quantity).catch((e) => {
        console.warn('Cart persistence failed (update quantity):', e.message);
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to update cart item quantity:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const clearCart = async () => {
    try {
      // Optimistic clear
      dispatch({ type: 'CLEAR_CART' });

      // Persist in background
      cartApi.clear().catch((e) => {
        console.warn('Cart persistence failed (clear):', e.message);
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to clear cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      // Extract price from complex product structure
      let price = 0;
      
      if (item.price) {
        // Simple price field exists
        price = parseFloat(item.price || 0);
      } else if (item.packages && item.packages.length > 0) {
        // Extract price from first package, first tier
        const firstPackage = item.packages[0];
        if (firstPackage.tiers && firstPackage.tiers.length > 0) {
          price = firstPackage.tiers[0].price || 0;
        }
      } else if (item.selling_price) {
        // Use selling_price if available
        price = parseFloat(item.selling_price || 0);
      }
      
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  const getDeliveryFee = () => {
    // Calculate delivery fee based on product weight
    let totalWeight = 0;
    state.items.forEach(item => {
      const weight = parseFloat(item.weight || item.quantity_in_stock || 1); // Default to 1 if no weight
      totalWeight += weight * item.quantity;
    });
    
    // Heavy products (>10kg total) = 18000, Light products = 5000
    return totalWeight > 10 ? 18000 : 5000;
  };

  const getSubtotal = () => {
    return getTotalPrice();
  };

  const getGrandTotal = () => {
    return getSubtotal() + getDeliveryFee();
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
    getDeliveryFee,
    getSubtotal,
    getGrandTotal,
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





