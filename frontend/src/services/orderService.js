// frontend/src/services/orderService.js
import api from './api';

class OrderService {
    async create(orderData) {
        const response = await api.post('/orders', orderData);
        return response.data;
    }

    async getUserOrders() {
        const response = await api.get('/orders');
        return response.data;
    }

    async getById(id) {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    }

    async cancelOrder(id) {
        const response = await api.post(`/orders/${id}/cancel`);
        return response.data;
    }
}

export default new OrderService();