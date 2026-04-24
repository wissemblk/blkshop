const mysql = require('mysql2/promise')

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
})

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname

  try {
    // Products
    if (req.method === 'GET' && pathname === '/api/products') {
      const [rows] = await db.query('SELECT * FROM products')
      return res.json(rows)
    }

    // Single product
    if (req.method === 'GET' && pathname.startsWith('/api/products/')) {
      const id = pathname.split('/').pop()
      const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id])
      return res.json(rows[0])
    }

    // Users
    if (req.method === 'GET' && pathname === '/api/users') {
      const [rows] = await db.query('SELECT * FROM users')
      return res.json(rows)
    }

    // Orders
    if (req.method === 'GET' && pathname === '/api/orders') {
      const [rows] = await db.query('SELECT * FROM orders')
      return res.json(rows)
    }

    res.status(404).json({ error: 'Route not found' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error', details: err.message })
  }
}