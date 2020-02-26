module.exports = async (req, res, next) => {
  const { productsList } = req.body;
  if (!productsList) {
    return next();
  }
  
  return res.status(422).send('you cannot replace the product list');
};