const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, `../../../config/${process.env.NODE_ENV}.env`) 
});
const CustomersController = require('../../../src/controllers/customers');
const sinon = require('sinon');
const Customer = require('../../../src/models/customer');

describe('Controllers: Customers', () => {
  const defaultRequest = {
    params: {}
  };
  const defaultId = '56cb91bdc3464f14678934ca';
  const defaultCustomers = [{
    _id: defaultId,
    name: 'fake-name',
    email: 'fake-email@mail.com',
    productsList: []
  }];

  describe('read() customers', () => {
    it('should return a list of custumers', async () => {
       const response = {
        status: sinon.stub(),
        send: sinon.spy()
      };
      
      response.status.withArgs(200).returns(response);
      Customer.find = sinon.stub();
      Customer.find.withArgs({}).resolves(defaultCustomers);

      const customersController = new CustomersController(Customer);
      await customersController.read(defaultRequest, response);
      sinon.assert.calledWith(response.send, defaultCustomers);
    });

    context('when an error occurs', () => {
      it('should return 400 status code', async () => {
        const response = {
          status: sinon.stub(),
          send: sinon.spy()
        };
        
        response.status.withArgs(400).returns(response);
        Customer.find = sinon.stub();
        Customer.find.withArgs({}).rejects({ message: 'ERROR' });
  
        const customersController = new CustomersController(Customer);
        await customersController.read(defaultRequest, response);
        sinon.assert.calledWith(response.status, 400);
        sinon.assert.calledWith(response.send, 'ERROR');
      });
    });
  });

  describe('readById() customer', () => {
    it('should return one customer', async () => {
      const fakeId = 'fake-id';
      const request = {
        params: {
          id: fakeId
        }
      };
      const response = {
        status: sinon.stub(),
        send: sinon.spy()
      };

      response.status.withArgs(200).returns(response);
      Customer.findById = sinon.stub();
      Customer.findById.withArgs(fakeId).resolves(defaultCustomers);

      const customersController = new CustomersController(Customer);
      await customersController.readById(request, response);
      sinon.assert.calledWith(response.send, defaultCustomers); 
    });
    
    context('when customer not found', () => {
      it('should 404 status code', async () => {
        const fakeId = 'fake-id';
      const request = {
        params: {
          id: fakeId
        }
      };
      const response = {
        status: sinon.stub(),
        send: sinon.spy()
      };

      response.status.withArgs(404).returns(response);
      Customer.findById = sinon.stub();
      Customer.findById.withArgs(fakeId).rejects({message: 'customer not found'});

      const customersController = new CustomersController(Customer);
      await customersController.readById(request, response);
      sinon.assert.calledWith(response.send, 'customer not found'); 
      });
    });
  });

  describe('create() customer', () => {
    it('should return 201 status code', async () => {
      const request = Object.assign({}, defaultRequest, { body: defaultCustomers[0] });
      const response = {
        status: sinon.stub(),
        send: sinon.spy()
      };

      response.status.withArgs(201).returns(response);
      Customer.prototype.save = sinon.stub();
      Customer.prototype.save.withArgs().resolves(defaultCustomers);

      const customersController = new CustomersController(Customer);
      await customersController.create(request, response);
      sinon.assert.calledWith(response.status, 201); 
    });
  });

  describe('update() customer', () => {
    it('should return 200 status code', async () => {
      const updateCustomer = {
        _id: defaultId,
        name: 'John Doe',
        email: 'a@a.com',
        productsList: [{
          id: 'fake-product-id',
          price: 200,
          image: 'https://cdn.luizaLabs.com/example-image.png',
          title: 'fake-name',
          reviewScore: 4.5
        }]
      };
      const request = {
        params: {
          id: defaultId
        },
        body: { 
          name: 'John Doe',
          email: 'a@a.com',
          productsList: [{
          id: 'fake-product-id',
          price: 200,
          image: 'https://cdn.luizaLabs.com/example-image.png',
          title: 'fake-name',
          reviewScore: 4.5
        }]
        }
      };

      const response = {
        status: sinon.stub(),
        send: sinon.spy()
      };
      
      response.status.withArgs(200).returns(response);
      Customer.updateOne = sinon.stub();
      Customer.updateOne.withArgs({ _id: defaultId }, request.body).resolves(updateCustomer);

      const customersController = new CustomersController(Customer);
      await customersController.update(request, response);
      sinon.assert.calledWith(response.status, 200);
    });
  });

  describe('delete() customer', () => {
    it('should return 200 status code', async () => {
      const fakeId ='fake-id';
      const request = {
        params: {
          id: fakeId
        }
      };
      const response = {
        status: sinon.stub(),
        send: sinon.spy()
      };

      response.status.withArgs(200).returns(response);
      Customer.deleteOne = sinon.stub();
      Customer.deleteOne.withArgs({ _id: fakeId }).resolves();

      const customersController = new CustomersController(Customer);
      await customersController.delete(request, response);
      sinon.assert.calledWith(response.status, 200);
    });
  });

  describe('readCustomerProducts()', () => {
    it('should return a customer products list', async () => {
      const fakeId = 'fake-id';
      const fakeProd = [{
        id: 'fake-product-id',
        price: 200,
        image: 'https://cdn.luizaLabs.com/example-image.png',
        title: 'fake-name',
        reviewScore: 4.5
      }];
      const request = {
        params: {
          id: fakeId
        }
      };
      const response = {
        status: sinon.stub(),
        send: sinon.spy()
      };

      response.status.withArgs(200).returns(response);
      Customer.findById = sinon.stub();
      Customer.findById.withArgs(fakeId).resolves({productsList: fakeProd});

      const customersController = new CustomersController(Customer);
      await customersController.readCustomerProducts(request, response);
      sinon.assert.calledWith(response.send, fakeProd);
    });
  });

  describe('addProduct()', () => {
    it('should return 200 status code', async () => {
      const fakeId = 'fake-id';
      const request = {
        params: {
          id: fakeId
        },
        body: {
          id: 'fake-product-id',
          price: 200,
          image: 'https://cdn.luizaLabs.com/example-image.png',
          title: 'fake-name',
          reviewScore: 4.5
        }
      };
      const response = {
        status: sinon.stub(),
        send: sinon.spy()
      };

      response.status.withArgs(200).returns(response);
      Customer.updateOne = sinon.stub();
      Customer.updateOne.withArgs({ _id: fakeId }, { $push: { productsList: request.body } }).resolves();

      const customersController = new CustomersController(Customer);
      await customersController.addProduct(request, response);
      sinon.assert.calledWith(response.status, 200);
    });
  });

  describe('deleteProduct', () => {
    it('should return 200 status code', async () => {
      const fakeId = 'fake-id';
      const request = {
        params: {
          customerId: fakeId,
          productId: fakeId
        }
      };
      const response = {
        status: sinon.stub(),
        send: sinon.spy()
      };
      response.status.withArgs(200).returns(response);
      Customer.updateOne = sinon.stub();
      Customer.updateOne.withArgs({ _id: fakeId }, { $pull: { productsList: { id: fakeId } } }).resolves();

      const customersController = new CustomersController(Customer);
      await customersController.removeProduct(request, response);
      sinon.assert.calledWith(response.status, 200);

    });
  });



});