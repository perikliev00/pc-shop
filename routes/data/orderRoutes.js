const express = require('express');
const router = express.Router();
const unifiedOrderController = require('../../controllers/data/unifiedOrderController');

// Unified order routes that work for both logged-in and guest users
router.post('/api/order', unifiedOrderController.createOrder);
router.get('/api/order-details', unifiedOrderController.getOrderDetails);

module.exports = router;
