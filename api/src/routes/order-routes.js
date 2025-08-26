const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order-controller');

router.post('/orders', orderController.create);
router.get('/orders/:id', orderController.findById);
router.get('/orders', orderController.findAll);
router.put('/orders/:id', orderController.updateStatus);

module.exports = router;
