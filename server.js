const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // Query the current timestamp
    res.status(200).json({ message: 'Database connected!', timestamp: result.rows[0] });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Failed to connect to the database.' });
  }
});
