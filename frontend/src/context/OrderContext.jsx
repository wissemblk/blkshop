// frontend/src/context/OrderContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import orderService from '../services/orderService';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Charger les commandes de l'utilisateur
    const loadUserOrders = useCallback(async () => {
        if (!user) return;
        
        setLoading(true);
        try {
            const data = await orderService.getUserOrders();
            setOrders(data);
        } catch (err) {
            console.error('Erreur chargement commandes:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Créer une commande
    const createOrder = async (orderData) => {
        setLoading(true);
        try {
            const response = await orderService.create(orderData);
            await loadUserOrders(); // Recharger la liste
            return { success: true, order: response.order };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Annuler une commande
    const cancelOrder = async (orderId) => {
        setLoading(true);
        try {
            await orderService.cancelOrder(orderId);
            await loadUserOrders();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        orders,
        currentOrder,
        loading,
        loadUserOrders,
        createOrder,
        cancelOrder,
        setCurrentOrder
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};