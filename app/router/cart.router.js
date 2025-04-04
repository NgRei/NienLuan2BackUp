const express = require('express');
const router = express.Router();
const CartController = require('../controller/cart.controller');
const authMiddleware = require('../middlewares/frontend/auth.middleware');

router.use(authMiddleware); // Bảo vệ tất cả routes

router.get('/', CartController.getCart);
router.post('/add', CartController.addToCart);
router.put('/update', CartController.updateQuantity);
router.delete('/remove/:cartId', CartController.removeFromCart);

module.exports = router;
