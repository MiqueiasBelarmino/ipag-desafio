const express = require('express');
const router = express.Router();
const notificationLogController = require('../controllers/notification-log-controller');

router.post('/notifications/log', notificationLogController.create);
router.get('/notifications/logs/:id', notificationLogController.findById);
router.get('/notifications/logs', notificationLogController.findAll);
router.get('/notifications/logs/:id/order', notificationLogController.findByOrderId);

module.exports = router;
