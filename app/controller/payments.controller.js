const PaymentModel = require('../models/payments.model');
const OrderModel = require('../models/orders.model');
const UserModel = require('../models/user.model');
class PaymentController {
    static async showPaymentForm(req, res) {
        try {
            const orders = await OrderModel.getOrderById(req.params.id);
            
            if (!orders) {
                return res.status(404).send('Không tìm thấy đơn hàng');
            }

            const payments = await PaymentModel.getPaymentByOrderId(orders.id);
            
            if (!payments) {
                return res.render('user/payment.ejs', { 
                    orders, 
                    payments: {
                        payment_date: 'Chưa có',
                        payment_method: 'Chưa có',
                        amount: 'Chưa có',
                        status: 'Chưa thanh toán'
                    },
                    user: null
                });
            }
            
            const user = await UserModel.findById(orders.user_id);
            
            res.render('user/payment.ejs', { 
                orders, 
                payments,
                user
            });  
        
        } catch (error) {
            console.log(error);
            res.redirect('/user/order/' + req.params.id);
        }
    }
}

module.exports = PaymentController;
