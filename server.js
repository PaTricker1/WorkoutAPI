const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const app = express();

const PORT = process.env.PORT || 3000;

// Database connection setup
const pool = new Pool({
  connectionString: 'postgresql://my_db_z1pe_user:OEOHLH9H2tB3c616yUIOMBOLYCcV10Y7@dpg-cu9tjqjqf0us73c50580-a.oregon-postgres.render.com/my_db_z1pe',
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10, // Maximum number of connections
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Timeout if connection takes longer than 2 seconds
});

// Log connection errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client:', err);
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Health check endpoint
app.get('/api/db-check', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.status(200).json({ message: 'Database connection successful!', result: result.rows });
  } catch (err) {
    console.error('Database connection failed:', err);
    res.status(500).json({ error: 'Database connection failed.' });
  }
});

// Insert data into database
app.post('/api/workouts', async (req, res) => {
  const workoutsData = req.body;
  console.log('Received data:', workoutsData);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const workout of workoutsData) {
      const [
        den,
        nazov_cviku,
        rep1,
        weight1,
        rep2,
        weight2,
        rep3,
        weight3,
        rep4,
        weight4,
      ] = workout;

      console.log('Inserting workout data:', {
        den,
        nazov_cviku,
        rep1,
        weight1,
        rep2,
        weight2,
        rep3,
        weight3,
        rep4,
        weight4,
      });

      await client.query(
        `INSERT INTO f.Workouts (den, nazov_cviku, rep1, weight1, rep2, weight2, rep3, weight3, rep4, weight4) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [den, nazov_cviku, rep1, weight1, rep2, weight2, rep3, weight3, rep4, weight4]
      );
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Data successfully inserted!' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Failed to insert data.' });
  } finally {
    client.release();
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
