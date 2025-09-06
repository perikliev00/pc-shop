const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/user/orderController');

// Allow both guest and logged-in users to access order details
router.get('/order-details', orderController.getOrderDetails);

module.exports = router;