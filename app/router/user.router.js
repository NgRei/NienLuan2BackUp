const express = require('express');
const router = express.Router();
const UserController = require('../controller/user.controller');
const OrderController = require('../controller/orders.controller');
const PaymentController = require('../controller/payments.controller');

router.get('/', UserController.index);
router.get('/add', UserController.showAddForm);
router.post('/add', UserController.add);
router.get('/edit/:id', UserController.showEditForm);
router.get('/change-password/:id', UserController.showChangePasswordForm);
router.post('/change-password/:id', UserController.changePassword);
router.post('/edit/:id', UserController.update);
router.get('/delete/:id', UserController.delete);

router.get('/order', OrderController.index);

// Route mới để xem tất cả đơn hàng của một user
router.get('/user-orders/:id', OrderController.showUserOrders);
router.get('/order/:id', OrderController.showOrderForm);
router.get('/order/:id/delete', OrderController.deleteOrder);
router.get('/order/:id/edit', OrderController.showEditOrderForm);
router.post('/order/:id/edit', OrderController.updateOrder);


router.get('/order/:id/payment', PaymentController.showPaymentForm);
// router.get('/order/:id/payment/edit', PaymentController.showEditPaymentForm);
// router.post('/order/:id/payment/edit', PaymentController.updatePayment);



module.exports = router;
