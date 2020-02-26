const Customer = require('../models/customer');
const requestApiProduct = require('../services/requestProductsApi');

module.exports = async (req, res, next) => {
try {
  const { id: customerId } = req.params;
  const { id: productId } = req.body;
  if (!productId) {
    return res.status(422).send('malformed body');
  }

  const customer = await Customer.findOne({ _id: customerId });
  if (!customer) {
    return res.status(422).send('customer not exist');
  }

  const alreadyExists = customer.productsList.some((product) => product.id === productId);

  if (alreadyExists) {
    return res.status(422).send('product already exists in customer product list');
  }

  const { status } = await requestApiProduct(productId);
  if (status !== 200) {
    return res.status(422).send('product not exists in API products');
  }

  return next();
  } catch (err) {
    return res.status(400).send(err.message);
  }
};