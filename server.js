// server.js
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: 'your_db_user',
  host: 'your_host',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

app.use(express.json());

app.post('/api/workouts', async (req, res) => {
    const workouts = req.body;
    
    try {
        for (const workout of workouts) {
            const { date, exerciseName, rep1, weight1, rep2, weight2, rep3, weight3, rep4, weight4 } = workout;

            await pool.query(
                'INSERT INTO workouts (den, nazov_cviku, rep1, weight1, rep2, weight2, rep3, weight3, rep4, weight4) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                [date, exerciseName, rep1, weight1, rep2, weight2, rep3, weight3, rep4, weight4]
            );
        }

        res.status(200).json({ message: 'Data successfully inserted into the database!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error inserting data into the database' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
