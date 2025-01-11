const axios = require('axios');
const Crypto = require('../model/crypto');
const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price';
const COINS = ['bitcoin', 'matic-network', 'ethereum'];
const VS_CURRENCY = 'usd';

const fetchCryptoData = async () => {
  try {
    const response = await axios.get(COINGECKO_URL, {
      params: {
        ids: COINS.join(','),
        vs_currencies: VS_CURRENCY,
        include_market_cap: true,
        include_24hr_change: true,
      },
    });

    const data = response.data;

    for (const coin of COINS) {
      const record = new Crypto({
        coin,
        price: data[coin][VS_CURRENCY],
        marketCap: data[coin][`${VS_CURRENCY}_market_cap`],
        change24h: data[coin][`${VS_CURRENCY}_24h_change`],
      });

      await record.save();
    }

    console.log('Cryptocurrency data updated');
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error.message);
  }
};

module.exports = { fetchCryptoData };
