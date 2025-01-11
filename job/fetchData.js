const { fetchCryptoData } = require('../services/cryptoService');
const cron = require('node-cron');

cron.schedule('0 */2 * * *', fetchCryptoData);