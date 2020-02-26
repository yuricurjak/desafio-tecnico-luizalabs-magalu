const axios = require('axios');

module.exports = async (id) => {
  const response = await axios({
    method: 'GET',
      url: `${process.env.PRODUCTS_API_ENDPOINT}${id}`,
      headers: {
          'Content-Type': 'application/json',
      }
  });

  return response;
};