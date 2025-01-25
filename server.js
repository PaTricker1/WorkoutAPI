const express = require('express');
const path = require('path');
const { Pool } = require('pg'); // Import PostgreSQL client
const app = express();

const PORT = process.env.PORT || 3000;

// Database connection settings (ensure DATABASE_URL is set in your environment)
const pool = new Pool({
  connectionString: 'postgresql://my_db_z1pe_user:OEOHLH9H2tB3c616yUIOMBOLYCcV10Y7@dpg-cu9tjqjqf0us73c50580-a.oregon-postgres.render.com/my_db_z1pe', // Render sets DATABASE_URL automatically
  ssl: {
    rejectUnauthorized: false, // For secure connections to Render-hosted PostgreSQL
  },
});

// Middleware to serve static files and parse JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve the index.html file at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // Query the current timestamp
    res.status(200).json({ message: 'Database connected!', timestamp: result.rows[0] });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Failed to connect to the database.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
