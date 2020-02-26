const router = require('express').Router();
const Customer = require('../models/customer');
const CustomersController = require('../controllers/customers');
const checkEmailExist = require('../middlewares/checkEmailExist');
const checkProductsList = require('../middlewares/checkProductsList');
const checkProduct = require('../middlewares/checkProduct');

const customerController = new CustomersController(Customer);

router.get('/', (req, res) => customerController.read(req, res));
router.get('/:id', (req, res) => customerController.readById(req, res));
router.get('/:id/products', (req, res) => customerController.readCustomerProducts(req, res));
router.post('/', checkEmailExist, (req, res) => customerController.create(req, res));
router.post('/:id/products', checkProduct, (req, res) => customerController.addProduct(req, res));
router.put('/:id', checkProductsList, (req, res) => customerController.update(req, res));
router.delete('/:id', (req, res) => customerController.delete(req, res));
router.delete('/:customerId/products/:productId', (req, res) => customerController.removeProduct(req, res));

module.exports = router;