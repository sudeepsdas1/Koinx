require('dotenv').config();
const app = require('./app');
const connectDatabase = require('./config/database');
require('./job/fetchData');
const { fetchCryptoData } = require('./services/cryptoService');

const PORT = process.env.PORT || 3000;

connectDatabase();
 


// Manually run the fetch function
fetchCryptoData().then(() => {
  console.log('Manual fetch completed');
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
