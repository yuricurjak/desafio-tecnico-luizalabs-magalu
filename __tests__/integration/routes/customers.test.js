const Customer = require('../../../src/models/customer');
const setup = require('../../../src/app');
const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
let app;
let request;

describe('Routes: Customers', () => {
  const defaultId = '56cb91bdc3464f14678934ca';
  const defaultIdProduct = 'ec92cbdd-b7e6-e2c2-a0e8-70ae001cb3d8';
  const defaultToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoieXVyaSIsImVtYWlsIjoieXVyaWN1cmpha0Bob3RtYWlsLmNvbSIsImlhdCI6MTU4MjY3MTU2OSwiZXhwIjoxNTgzMjc2MzY5fQ.vMuN1VUKZG-DfGh3y7GtVQ5ZnhF_WkEEfexyGCGLn5w';
  const defaultProductsList = [{
    id: defaultIdProduct,
    price: 200,
    image: 'https://cdn.luizaLabs.com/example-image.png',
    title: 'fake-name',
    reviewScore: 4.5
  }];
  const defaultCustomer = {
    __v: 0,
    _id: defaultId,
    name: 'Default customer',
    email: 'customer@mail.com',
    productsList: defaultProductsList
  };
  const expectCustomer = {
    _id: defaultId,
    name: 'Default customer',
    email: 'customer@mail.com',
    productsList: defaultProductsList
  };
  before(async () => {
    app = await setup();
    request = supertest(app);
  });

  after(async () => await app.database.connection.close());

  beforeEach(async () => {
    await Customer.deleteMany();

    const customer = new Customer(defaultCustomer);
    return await customer.save();
  });

  afterEach(async() => await Customer.deleteMany());

  describe('GET /customers', () => {
    context('when the customer list is requested', () => {
      it('should return a list of customers', async () => {
        const response = await request.get('/customers').set({'authorization': defaultToken});
      
        expect(response.body).to.eql([defaultCustomer]);
      });
    });
    

    context('when an id is epecifidied', () => {
      it('should return 200 with one customer', async () => {
        const response = await request.get(`/customers/${defaultId}`).set({'authorization': defaultToken});

        expect(response.body).to.eql(expectCustomer);
      });
    });
  });

  describe('POST /customers', () => {
    context('when a customer is added', () => {
      it('should return 201 status code', async () => {
        const customId = '56cb91bdc3464f146789dabc'
        const body = Object.assign({}, defaultCustomer, { _id: customId }, { email: 'fakemail@mail.com' }); 
        
        const response = await request.post('/customers').set({'authorization': defaultToken}).send(body);

        expect(response.status).to.eql(201);
      });
    });
  });

  describe('PUT /customers', () => {
    context('when a customer is updated', () => {
      it('should return 200 status code', async () => {
        const bodyUpdate = { name: 'custom name' };
        const response = await request.put(`/customers/${defaultId}`).set({'authorization': defaultToken}).send(bodyUpdate);
        
        expect(response.status).to.eql(200);
      });
    });
  });

  describe('DELETE /customers', () => {
    context('when a customer is deleted', () => {
      it('should return 200 status code', async () => {
        const response = await request.delete(`/customers/${defaultId}`).set({'authorization': defaultToken});

        expect(response.status).to.eql(200);
      });
    });
  });

  describe('GET /customers/:id/products', () => {
    context('when only the product list is requested', () => {
      it('should return a customer products list', async () => {
        const response = await request.get(`/customers/${defaultId}/products`).set({'authorization': defaultToken});

        expect(response.status).to.eql(200);
        expect(response.body).to.eql(defaultProductsList);
      });
    });
  });

  describe('POST /customers/:id/products', () => {
    context('when a new product is added in productList', () => {
      it('should return 200 status code', async () => {
        const body = {
          id: 'c5af1ede-b5e2-44a6-a9b5-2869fe58d82b',
          price: 24.9,
          brand: 'epoch magia',
          image: 'http://challenge-api.luizalabs.com/images/ec92cbdd-b7e6-e2c2-a0e8-70ae001cb3d8.jpg',
          title: 'Sylvanian Families Bebê Ovelha com Triciclo',
          reviewScore: 4.5
        };
        const response = await request.post(`/customers/${defaultId}/products`).set({'authorization': defaultToken}).send(body);

        expect(response.status).to.eql(200);
      });
    });
  });

  describe('DELETE /customers/:idCustomer/products/:idProduct', () => {
    context('when a product is removed in productList', async () => {
      it('should return 200 status code', async () => {
        const response = await request.delete(`/customers/${defaultId}/products/${defaultIdProduct}`).set({'authorization': defaultToken});

        expect(response.status).to.eql(200);
      });
    });
  });

});