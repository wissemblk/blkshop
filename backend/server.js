// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Configure CORS properly for Vercel + Railway
const allowedOrigins = [
  'https://blkshop.vercel.app', // Your Vercel frontend URL
  'http://localhost:5173', // Local Vite dev
  'http://localhost:3000' // Local React dev
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint for Vercel
app.get('/api/health', async (req, res) => {
  try {
    const connected = await pool.testConnection();
    res.json({ 
      status: 'ok', 
      database: connected ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Route de test simple
app.get('/', (req, res) => {
    res.json({ 
        message: 'API E-commerce fonctionne!',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            cart: '/api/cart',
            orders: '/api/orders',
            health: '/api/health'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Une erreur est survenue!' });
});

// Only use app.listen() when running locally
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    
    const startServer = async () => {
        try {
            const connection = await pool.getConnection();
            console.log('✅ Database connected successfully');
            connection.release();
            
            app.listen(PORT, () => {
                console.log(`🚀 Server running on port ${PORT}`);
            });
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            app.listen(PORT, () => {
                console.log(`🚀 Server running on port ${PORT} (without database)`);
            });
        }
    };
    
    startServer();
}

// Export for Vercel (important!)
module.exports = app;