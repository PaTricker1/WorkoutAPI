const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML page when accessing the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Make sure the HTML file is in the 'public' folder
});

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
