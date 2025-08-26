const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order-controller');

router.post('/orders', orderController.createCustomerAndOrder);
router.get('/orders/summary', orderController.getSummary);
router.get('/orders/:id', orderController.findById);
router.get('/orders', orderController.findAll);
router.put('/orders/:id/status', orderController.updateStatus);

module.exports = router;
