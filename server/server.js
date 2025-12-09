// server.js
const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');

app.use(cors());

app.get('/api/data', (req, res) => {
  const query = req.query.query || 'default'; // fallback only if empty
  res.json({
    message: `You searched for "${query}"`,
    items: [query, query.toUpperCase(), query.length]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});