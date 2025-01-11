const express = require('express');
const cryptoRoutes = require('./routes/cryptoRoute');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use('/api', cryptoRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;