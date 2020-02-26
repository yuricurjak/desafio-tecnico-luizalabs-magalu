class CustomersController {
  constructor(Customer) {
    this.Customer = Customer;
  }

  async read(req, res) {
    try {
      const customers = await this.Customer.find({});
      res.status(200).send(customers);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  async readById(req, res) {
    try {
      const { id } = req.params;
      const customer = await this.Customer.findById(id, '-__v');
      res.status(200).send(customer);
    } catch (err) {
      res.status(404).send(err.message);
    }
  }

  async create(req, res) {
    try {
      const customer = new this.Customer(req.body);
      await customer.save();
      res.status(201).send();
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      await this.Customer.updateOne({ _id: id }, req.body);
      res.status(200).send();
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.Customer.deleteOne({ _id: id });
      res.status(200).send();
    } catch (err) {
      res.status(400).send(err.send);
    }
  }

  async readCustomerProducts(req, res) {
    try {
      const { id } = req.params;
      const { productsList } = await this.Customer.findById(id, 'productsList -_id');
      res.status(200).send(productsList);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  async addProduct(req, res) {
    try {
      const { id } = req.params;
      await this.Customer.updateOne({ _id: id }, { $push: { productsList: req.body } });
      res.status(200).send();
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  async removeProduct(req, res) {
    try {
      const { customerId, productId } = req.params;
      await this.Customer.updateOne({ _id: customerId }, { $pull: { productsList: { id: productId } } });
      res.status(200).send();
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

}

module.exports = CustomersController;