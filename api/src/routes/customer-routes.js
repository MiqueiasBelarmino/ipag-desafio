const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customer-controller');

router.post('/customers', customersController.create);
router.get('/customers/:id', customersController.findById);
router.get('/customers', customersController.findAll);
router.put('/customers/:id', customersController.update);
router.delete('/customers/:id', customersController.remove);

module.exports = router;
