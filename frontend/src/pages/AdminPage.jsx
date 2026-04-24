// frontend/src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import orderService from '../services/orderService';

const AdminPage = () => {
    const { isAdmin, user } = useAuth();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    
    // Form states
    const [productForm, setProductForm] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: ''
    });

    useEffect(() => {
        if (!isAdmin()) {
            navigate('/');
        } else {
            loadData();
        }
    }, [isAdmin, navigate]);

    const loadData = async () => {
        setLoading(true);
        try {
            const productsData = await productService.getAll();
            setProducts(productsData);
            
            // Note: Vous aurez besoin d'une route pour récupérer toutes les commandes
            // const ordersData = await orderService.getAllOrders();
            // setOrders(ordersData);
        } catch (error) {
            console.error('Erreur chargement données:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await productService.update(editingProduct.id, productForm);
            } else {
                await productService.create(productForm);
            }
            resetForm();
            loadData();
        } catch (error) {
            console.error('Erreur sauvegarde produit:', error);
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            price: product.price,
            description: product.description || '',
            category: product.category,
            image: product.image || ''
        });
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
            try {
                await productService.delete(productId);
                loadData();
            } catch (error) {
                console.error('Erreur suppression produit:', error);
            }
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setProductForm({
            name: '',
            price: '',
            description: '',
            category: '',
            image: ''
        });
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
        tabs: {
            display: 'flex',
            gap: '10px',
            marginBottom: '30px',
            borderBottom: '2px solid #ddd',
            paddingBottom: '10px'
        },
        tab: {
            padding: '10px 20px',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0',
            backgroundColor: '#f8f9fa'
        },
        tabActive: {
            backgroundColor: '#007bff',
            color: 'white'
        },
        formContainer: {
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px'
        },
        formTitle: {
            fontSize: '1.3em',
            marginBottom: '20px'
        },
        formGroup: {
            marginBottom: '15px'
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: '500'
        },
        input: {
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
        },
        textarea: {
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            minHeight: '100px'
        },
        buttonGroup: {
            display: 'flex',
            gap: '10px'
        },
        button: {
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        submitButton: {
            backgroundColor: '#28a745',
            color: 'white'
        },
        cancelButton: {
            backgroundColor: '#6c757d',
            color: 'white'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white'
        },
        th: {
            backgroundColor: '#f8f9fa',
            padding: '12px',
            textAlign: 'left',
            borderBottom: '2px solid #ddd'
        },
        td: {
            padding: '12px',
            borderBottom: '1px solid #eee'
        },
        editButton: {
            padding: '5px 10px',
            backgroundColor: '#ffc107',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '5px'
        },
        deleteButton: {
            padding: '5px 10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        loading: {
            textAlign: 'center',
            padding: '50px'
        }
    };

    if (loading) {
        return <div style={styles.loading}>Chargement...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Administration</h1>

            <div style={styles.tabs}>
                <div 
                    style={{...styles.tab, ...(activeTab === 'products' && styles.tabActive)}}
                    onClick={() => setActiveTab('products')}
                >
                    Produits
                </div>
                <div 
                    style={{...styles.tab, ...(activeTab === 'orders' && styles.tabActive)}}
                    onClick={() => setActiveTab('orders')}
                >
                    Commandes
                </div>
                <div 
                    style={{...styles.tab, ...(activeTab === 'users' && styles.tabActive)}}
                    onClick={() => setActiveTab('users')}
                >
                    Utilisateurs
                </div>
            </div>

            {/* Onglet Produits */}
            {activeTab === 'products' && (
                <>
                    <div style={styles.formContainer}>
                        <h3 style={styles.formTitle}>
                            {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                        </h3>
                        <form onSubmit={handleProductSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Nom</label>
                                <input
                                    type="text"
                                    value={productForm.name}
                                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                                    required
                                    style={styles.input}
                                />
                            </div>
                            
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Prix (€)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={productForm.price}
                                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                                    required
                                    style={styles.input}
                                />
                            </div>
                            
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                                    style={styles.textarea}
                                />
                            </div>
                            
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Catégorie</label>
                                <input
                                    type="text"
                                    value={productForm.category}
                                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                                    required
                                    style={styles.input}
                                />
                            </div>
                            
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Image URL</label>
                                <input
                                    type="text"
                                    value={productForm.image}
                                    onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                                    style={styles.input}
                                />
                            </div>
                            
                            <div style={styles.buttonGroup}>
                                <button 
                                    type="submit" 
                                    style={{...styles.button, ...styles.submitButton}}
                                >
                                    {editingProduct ? 'Modifier' : 'Ajouter'}
                                </button>
                                {editingProduct && (
                                    <button 
                                        type="button" 
                                        onClick={resetForm}
                                        style={{...styles.button, ...styles.cancelButton}}
                                    >
                                        Annuler
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Nom</th>
                                <th style={styles.th}>Prix</th>
                                <th style={styles.th}>Catégorie</th>
                                <th style={styles.th}>Stock</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td style={styles.td}>{product.id}</td>
                                    <td style={styles.td}>{product.name}</td>
                                    <td style={styles.td}>{product.price.toFixed(2)} €</td>
                                    <td style={styles.td}>{product.category}</td>
                                    <td style={styles.td}>{product.stock}</td>
                                    <td style={styles.td}>
                                        <button 
                                            onClick={() => handleEditProduct(product)}
                                            style={styles.editButton}
                                        >
                                            Modifier
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteProduct(product.id)}
                                            style={styles.deleteButton}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {/* Onglet Commandes (simplifié) */}
            {activeTab === 'orders' && (
                <div>
                    <p>Gestion des commandes - À implémenter</p>
                </div>
            )}

            {/* Onglet Utilisateurs (simplifié) */}
            {activeTab === 'users' && (
                <div>
                    <p>Gestion des utilisateurs - À implémenter</p>
                </div>
            )}
        </div>
    );
};

export default AdminPage;