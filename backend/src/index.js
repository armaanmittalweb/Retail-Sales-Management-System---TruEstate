const express = require('express');
const cors = require('cors');
const path = require('path');
const { loadSalesData } = require('./utils/csvLoader');
const { initSalesService } = require('./services/salesService');
const salesRoutes = require('./routes/salesRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/sales', salesRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err.statusCode) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const dataPath = path.join(__dirname, '..', 'data', 'sales.csv');

loadSalesData(dataPath)
  .then((records) => {
    initSalesService(records);
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to load sales data:', err);
    process.exit(1);
  });
