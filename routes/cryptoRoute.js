const express = require('express');
const Crypto = require('../model/crypto');
const asyncWrapper = require('../utils/asyncWrapper');
const router = express.Router();

const COINS = ['bitcoin', 'matic-network', 'ethereum'];

router.get('/stats', asyncWrapper(async (req, res) => {
  const { coin } = req.query;

  if (!COINS.includes(coin)) {
    return res.status(400).json({ error: 'Invalid coin' });
  }

  const latestData = await Crypto.findOne({ coin }).sort({ timestamp: -1 });

  if (!latestData) {
    return res.status(404).json({ error: 'Data not found' });
  }

  res.json({
    price: latestData.price,
    marketCap: latestData.marketCap,
    '24hChange': latestData.change24h,
  });
}));

router.get('/deviation', asyncWrapper(async (req, res) => {
  const { coin } = req.query;

  console.log(`Received request for coin: ${coin}`);

  if (!COINS.includes(coin)) {
    console.log('Invalid coin provided:', coin);
    return res.status(400).json({ error: 'Invalid coin' });
  }

  // Fetch the latest 100 records for the specified coin
  const records = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100);

  if (records.length === 0) {
    console.log('No records found for coin:', coin);
    return res.status(404).json({ error: 'Insufficient data' });
  }

  // Log the records fetched from the database (for debugging)
  console.log(`Fetched ${records.length} records for ${coin}`);

  const prices = records.map(record => record.price);

  // Calculate the mean price
  const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
  console.log(`Mean price: ${mean}`);

  // Calculate the variance
  const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / prices.length;
  console.log(`Variance: ${variance}`);

  // Calculate the standard deviation
  const standardDeviation = Math.sqrt(variance);
  console.log(`Standard deviation: ${standardDeviation}`);

  // Send the result back to the client
  res.json({ deviation: parseFloat(standardDeviation.toFixed(2)) });
}));

module.exports = router;