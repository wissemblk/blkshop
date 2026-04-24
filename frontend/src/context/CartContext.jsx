// frontend/src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

// Create the context
const CartContext = createContext();

// Initial state
const initialState = {
    items: [],
    loading: false,
    error: null
};

// Cart reducer for managing cart state
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return {
                ...state,
                items: action.payload,
                loading: false,
                error: null
            };
        
        case 'ADD_ITEM':
            const existingItemIndex = state.items.findIndex(
                item => item.productId === action.payload.productId
            );
            
            if (existingItemIndex >= 0) {
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
                };
                return {
                    ...state,
                    items: updatedItems
                };
            } else {
                return {
                    ...state,
                    items: [...state.items, action.payload]
                };
            }
        
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.productId === action.payload.productId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };
        
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.productId !== action.payload)
            };
        
        case 'CLEAR_CART':
            return {
                ...state,
                items: []
            };
        
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        
        default:
            return state;
    }
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { user, isAuthenticated } = useAuth(); // Assuming you have user from auth

    // Load cart from BACKEND when user is authenticated
    useEffect(() => {
        if (isAuthenticated() && user) {
            loadCartFromBackend();
        } else {
            // Clear cart when not authenticated
            dispatch({ type: 'CLEAR_CART' });
        }
    }, [isAuthenticated, user]);

    // Load cart from backend
    const loadCartFromBackend = async () => {
        console.log('Loading cart from backend...');
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            const response = await cartService.getCart();
            console.log('Cart loaded from backend:', response);
            
            // Handle different response structures
            let cartItems = [];
            if (response && response.items) {
                cartItems = response.items;
            } else if (Array.isArray(response)) {
                cartItems = response;
            } else if (response && response.cart && response.cart.items) {
                cartItems = response.cart.items;
            }
            
            dispatch({ type: 'SET_CART', payload: cartItems });
        } catch (error) {
            console.error('Error loading cart:', error);
            dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to load cart' });
            dispatch({ type: 'SET_CART', payload: [] });
        }
    };

    // Get total number of items in cart
    const getCartItemCount = () => {
        return state.items.reduce((total, item) => total + (item.quantity || 0), 0);
    };
    
    // Get total price of all items in cart
    const getCartTotal = () => {
        return state.items.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);
    };
    
    // Add item to cart (sync with backend)
    const addToCart = async (product, quantity = 1) => {
        console.log('Adding to cart:', product, quantity);
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            // Call backend API
            const response = await cartService.addItem(product._id || product.id, quantity);
            console.log('Add to cart response:', response);
            
            // Reload cart from backend to ensure consistency
            await loadCartFromBackend();
            
            dispatch({ type: 'SET_LOADING', payload: false });
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to add item' });
            dispatch({ type: 'SET_LOADING', payload: false });
            return false;
        }
    };
    
    // Update item quantity (sync with backend)
    const updateCartItem = async (productId, quantity) => {
        console.log('Updating cart item:', productId, quantity);
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            if (quantity <= 0) {
                await cartService.removeItem(productId);
            } else {
                await cartService.updateItem(productId, quantity);
            }
            
            // Reload cart from backend
            await loadCartFromBackend();
            
            dispatch({ type: 'SET_LOADING', payload: false });
            return true;
        } catch (error) {
            console.error('Error updating cart:', error);
            dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to update item' });
            dispatch({ type: 'SET_LOADING', payload: false });
            return false;
        }
    };
    
    // Remove item from cart (sync with backend)
    const removeFromCart = async (productId) => {
        console.log('Removing from cart:', productId);
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            await cartService.removeItem(productId);
            await loadCartFromBackend();
            
            dispatch({ type: 'SET_LOADING', payload: false });
            return true;
        } catch (error) {
            console.error('Error removing from cart:', error);
            dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to remove item' });
            dispatch({ type: 'SET_LOADING', payload: false });
            return false;
        }
    };
    
    // Clear entire cart (sync with backend)
    const clearCart = async () => {
        console.log('Clearing cart...');
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            await cartService.clearCart();
            await loadCartFromBackend();
            
            dispatch({ type: 'SET_LOADING', payload: false });
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to clear cart' });
            dispatch({ type: 'SET_LOADING', payload: false });
            return false;
        }
    };
    
    // Check if item is in cart
    const isInCart = (productId) => {
        return state.items.some(item => item.productId === productId);
    };
    
    // Get item quantity in cart
    const getItemQuantity = (productId) => {
        const item = state.items.find(item => item.productId === productId);
        return item ? item.quantity : 0;
    };
    
    // Value object
    const value = {
        cart: { items: state.items },
        loading: state.loading,
        error: state.error,
        getCartItemCount,
        getCartTotal,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        isInCart,
        getItemQuantity,
        loadCartFromBackend  // Expose this for manual reload if needed
    };
    
    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};