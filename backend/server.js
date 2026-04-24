// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/database');

// Import routes - assurez-vous que ces fichiers exportent bien des routers
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - utilisez les routers importés
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);


// Route de test simple
app.get('/', (req, res) => {
    res.json({ message: 'API E-commerce fonctionne!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Une erreur est survenue!' });
});

const PORT = process.env.PORT || 5000;

// Test database connection
const startServer = async () => {
    try {
        // Test database connection
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📝 API available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('⚠️  Starting server without database connection...');
        
        // Start server even if database fails (for testing)
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} (without database)`);
            console.log(`⚠️  Database connection failed: ${error.message}`);
        });
    }
};

startServer();