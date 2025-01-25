const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// List of allowed IPs
const allowedIPs = ['95.102.2.133', '192.168.1.64']; // Replace with your device and phone IPs

// Middleware to restrict access by IP
app.use((req, res, next) => {
  const clientIP = req.ip.replace('::ffff:', ''); // Handle IPv4-mapped IPv6 addresses
  console.log(`Request from IP: ${clientIP}`);
  
  if (allowedIPs.includes(clientIP)) {
    next(); // Allow the request
  } else {
    res.status(403).send('Access Denied: Unauthorized IP');
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route for inserting workout data
app.post('/api/workouts', async (req, res) => {
  try {
    const data = req.body;
    console.log('Received data:', data);

    for (const workout of data) {
      await pool.query(
        'INSERT INTO workouts (den, nazov_cviku, rep1, weight1, rep2, weight2, rep3, weight3, rep4, weight4) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        workout
      );
    }
    res.json({ success: true, message: 'Data inserted successfully!' });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
