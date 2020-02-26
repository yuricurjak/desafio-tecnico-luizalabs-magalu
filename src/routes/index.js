const express = require('express');
const router = express.Router();
const customerRoutes = require('./customers');

router.use('/customers', customerRoutes);
router.get('/', (req, res) => res.send('Hello Word'));

module.exports = router;