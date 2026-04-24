// frontend/src/services/cartService.js
import api from './api';

class CartService {
    async getCart() {
        try {
            console.log('🔍 Récupération du panier...');
            const response = await api.get('/cart');
            console.log('✅ Panier reçu:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur getCart:', error);
            throw error;
        }
    }

    async addItem(productId, quantity = 1) {
        try {
            console.log('📤 Ajout au panier:', { productId, quantity });
            const response = await api.post('/cart/items', { productId, quantity });
            console.log('✅ Réponse reçue:', response.data);
            
            // Vérifier la structure de la réponse
            if (response.data && response.data.cart) {
                return response.data;
            } else {
                console.error('❌ Structure de réponse inattendue:', response.data);
                return { cart: { items: [], total: 0 } };
            }
        } catch (error) {
            console.error('❌ Erreur addItem:', error);
            throw error;
        }
    }

    async updateItem(productId, quantity) {
        try {
            const response = await api.put('/cart/items', { productId, quantity });
            return response.data;
        } catch (error) {
            console.error('❌ Erreur updateItem:', error);
            throw error;
        }
    }

    async removeItem(productId) {
        try {
            const response = await api.delete(`/cart/items/${productId}`);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur removeItem:', error);
            throw error;
        }
    }

    async clearCart() {
        try {
            const response = await api.delete('/cart');
            return response.data;
        } catch (error) {
            console.error('❌ Erreur clearCart:', error);
            throw error;
        }
    }
}

export default new CartService();