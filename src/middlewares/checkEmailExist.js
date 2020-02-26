const Customer = require('../models/customer');

module.exports = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next();
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return next(); 
    }
    return res.status(422).send('customer already exists');
  } catch (err) {
    return res.status(400).send(err.message);
  }
};