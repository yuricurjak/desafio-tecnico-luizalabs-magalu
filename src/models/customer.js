const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  productsList: {
    type: [],
    required: false,
    default: []
  }
});

const Customers = model('Customers', schema);

module.exports = Customers;