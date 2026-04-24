// frontend/src/pages/OrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await orderService.getUserOrders();
            setOrders(data);
        } catch (error) {
            console.error('Erreur chargement commandes:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Livré':
                return '#28a745';
            case 'En preparation':
                return '#ffc107';
            case 'Expedié':
                return '#17a2b8';
            case 'Annulé':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch(status) {
            case 'Payé':
                return '#28a745';
            case 'En attente':
                return '#ffc107';
            case 'Echoué':
                return '#dc3545';
            case 'Remboursé':
                return '#17a2b8';
            default:
                return '#6c757d';
        }
    };

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px'
        },
        title: {
            fontSize: '2em',
            marginBottom: '30px',
            color: '#333'
        },
        loading: {
            textAlign: 'center',
            padding: '50px'
        },
        noOrders: {
            textAlign: 'center',
            padding: '50px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
        },
        shopButton: {
            display: 'inline-block',
            padding: '12px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            marginTop: '20px'
        },
        ordersList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        },
        orderCard: {
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden'
        },
        orderHeader: {
            backgroundColor: '#f8f9fa',
            padding: '15px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #ddd'
        },
        orderNumber: {
            fontSize: '1.1em',
            fontWeight: 'bold',
            color: '#007bff'
        },
        orderDate: {
            color: '#666'
        },
        orderStatus: {
            padding: '5px 10px',
            borderRadius: '4px',
            color: 'white',
            fontSize: '0.9em',
            fontWeight: '500'
        },
        orderBody: {
            padding: '20px'
        },
        orderItems: {
            marginBottom: '20px'
        },
        orderItem: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: '1px solid #eee'
        },
        itemName: {
            textDecoration: 'none',
            color: '#333'
        },
        itemQuantity: {
            color: '#666'
        },
        orderTotal: {
            textAlign: 'right',
            fontSize: '1.2em',
            fontWeight: 'bold',
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '2px solid #ddd'
        },
        orderFooter: {
            backgroundColor: '#f8f9fa',
            padding: '15px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #ddd'
        },
        viewButton: {
            padding: '8px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
        },
        paymentStatus: {
            padding: '5px 10px',
            borderRadius: '4px',
            color: 'white',
            fontSize: '0.9em'
        }
    };

    if (loading) {
        return <div style={styles.loading}>Chargement des commandes...</div>;
    }

    if (!orders || orders.length === 0) {
        return (
            <div style={styles.container}>
                <h1 style={styles.title}>Mes commandes</h1>
                <div style={styles.noOrders}>
                    <h3>Vous n'avez pas encore passé de commande</h3>
                    <p>Découvrez nos produits et passez votre première commande !</p>
                    <Link to="/products" style={styles.shopButton}>
                        Voir les produits
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Mes commandes</h1>
            
            <div style={styles.ordersList}>
                {orders.map(order => (
                    <div key={order.id} style={styles.orderCard}>
                        <div style={styles.orderHeader}>
                            <div>
                                <span style={styles.orderNumber}>Commande #{order.id}</span>
                                <span style={styles.orderDate}>
                                    {' '}- {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div style={{...styles.orderStatus, backgroundColor: getStatusColor(order.status)}}>
                                {order.status}
                            </div>
                        </div>
                        
                        <div style={styles.orderBody}>
                            <div style={styles.orderItems}>
                                {order.items?.map(item => (
                                    <div key={item.id} style={styles.orderItem}>
                                        <Link to={`/products/${item.productId}`} style={styles.itemName}>
                                            {item.productName}
                                        </Link>
                                        <span>
                                            {item.quantity} x {item.price.toFixed(2)} € = {item.total.toFixed(2)} €
                                        </span>
                                    </div>
                                ))}
                            </div>
                            
                            <div style={styles.orderTotal}>
                                Total: {order.total.toFixed(2)} €
                            </div>
                        </div>
                        
                        <div style={styles.orderFooter}>
                            <div>
                                <span style={{...styles.paymentStatus, backgroundColor: getPaymentStatusColor(order.paymentStatus)}}>
                                    Paiement: {order.paymentStatus}
                                </span>
                                <span style={{marginLeft: '15px', color: '#666'}}>
                                    {order.paymentMethod}
                                </span>
                            </div>
                            <Link to={`/orders/${order.id}`} style={styles.viewButton}>
                                Voir détails
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;