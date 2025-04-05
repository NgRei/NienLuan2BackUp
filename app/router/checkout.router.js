const express = require('express');
const router = express.Router();
const CheckoutController = require('../controller/product/api controller/checkout.controller');
const authMiddleware = require('../middlewares/frontend/auth.middleware');

// Chỉ giữ lại route checkout, xóa các route cart
router.post('/process', authMiddleware, CheckoutController.createOrder);

module.exports = router;
        