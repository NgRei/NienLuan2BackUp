const OrderModel = require('../models/orders.model');
const UserModel = require('../models/user.model');
class OrderController {
    static async index(req, res) {
        const orders = await OrderModel.getAllOrders();
        res.render('user/order', { orders, query: req.query });
    }
    static async getOrderById(req, res) {
        const order = await OrderModel.getOrderById(req.params.id);
        res.render('orders/detail', { order, query: req.query });
    }
    static async getAllOrders(req, res) {
        const orders = await OrderModel.getAllOrders();
        res.render('orders/index', { orders, query: req.query });
    }
    static async showUserOrders(req, res) {
        try {
            const userId = req.params.id;
            const user = await UserModel.findById(userId);
            
            if (!user) {
                return res.status(404).send('Không tìm thấy người dùng');
            }
            
            let orders = await OrderModel.getOrdersByUserId(userId);
            if (req.query.status) {
                orders = orders.filter(order => order.order_status === req.query.status);
            }
            
            res.render('user/order', { orders, user, query: req.query });
        } catch (error) {
            console.log(error);
            res.redirect('/user');
        }
    }
    static async showOrderForm(req, res) {
        try {
            const order = await OrderModel.getOrderById(req.params.id);
            
            if (!order) {
                return res.status(404).send('Không tìm thấy đơn hàng');
            }
            
            const user = await UserModel.findById(order.user_id);   
            const status = order.status == 1 ? 'Đã thanh toán' : 'Chưa thanh toán';
            
            res.render('user/order_detail', {
                user,
                order,
                order_date: order.order_date,
                status,
                notes: order.notes,
                shipping_address: order.shipping_address,
                total_amount: order.total_amount,
                query: req.query
            });
        } catch (error) {
            console.log(error);
            res.redirect('/user');
        }
    }
    static async deleteOrder(req, res) {
        const order = await OrderModel.deleteOrder(req.params.id);
        res.redirect('/user/order');
    }
    static async showEditOrderForm(req, res) {
        const order = await OrderModel.getOrderById(req.params.id);
        const user = await UserModel.findById(req.params.id);
        res.render('user/order', { order, user, query: req.query });
    }
    static async updateOrder(req, res) {
        const order = await OrderModel.updateOrder(req.params.id, req.body);
        res.redirect('/user/order');
    }
}

module.exports = OrderController;
