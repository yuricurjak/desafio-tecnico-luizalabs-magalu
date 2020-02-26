const axios = require('axios');

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      return res.status(401).send('no token provided');
    }

    const parts = authorization.split(' ');

    if (!(parts.length === 2)) {
      return res.status(401).send('token error');
    }

    const [ authType, token ] = parts;

    if (!(/^Bearer$/).test(authType)) {
      return res.status(401).send('token malformatted');
    }

    const response = await axios({
    method: 'GET',
    url: process.env.AUTH_ENDPOINT,
    headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
    }
    });

    if (response.status !== 200) {
      return res.status(401).send('invalid token');
    }

    next();
  } catch (err) {
    return res.status(401).send(err.message);
  }
};