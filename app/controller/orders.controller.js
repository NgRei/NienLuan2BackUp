const OrderModel = require('../models/orders.model');
const UserModel = require('../models/user.model');
const ProductModel = require('../models/product.model');

class OrderController {
    static async index(req, res) {
        const status = req.query.status || '';
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const result = await OrderModel.getAllOrders(page, limit, status);
        res.render('user/order', { orders: result.data, status, query: req.query, pagination: {
            total: result.total,
            totalPages: result.totalPages,
            currentPage: result.currentPage,
            limit
        }});
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
            
            // Lấy tất cả sản phẩm trong đơn hàng
            const orderItems = await OrderModel.getOrderItems(order.id);
            
            // Tính và cập nhật tổng tiền
            const calculatedTotal = await OrderModel.calculateOrderTotal(order.id);
            
            const user = await UserModel.findById(order.user_id);   
            const status = order.status == 1 ? 'Đã thanh toán' : 'Chưa thanh toán';
            
            res.render('user/order_detail', {
                user,
                order,
                orderItems,
                order_date: order.order_date,
                status,
                notes: order.notes,
                shipping_address: order.shipping_address,
                total_amount: calculatedTotal || order.total_amount, // Sử dụng giá trị đã tính
                query: req.query
            });
        } catch (error) {
            console.log(error);
            res.redirect('/user/order');
        }
    }
    static async deleteOrder(req, res) {
        try {
            const result = await OrderModel.deleteOrder(req.params.id);
            
            if (!result.success) {
                return res.status(400).send(result.message);
            }
            
            // Thông báo thành công và chuyển hướng
            // Nếu bạn sử dụng flash messages:
            // req.flash('success', result.message);
            
            res.redirect('/user/order');
        } catch (error) {
            console.error('Lỗi khi xóa đơn hàng:', error);
            res.status(500).send('Đã xảy ra lỗi khi xóa đơn hàng');
        }
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
    static async createOrder(req, res) {
        try {
            // Tạo đơn hàng mới
            const orderData = {
                user_id: req.session.user.id,
                order_date: new Date(),
                order_status: 'pending',
                shipping_address: req.body.shipping_address,
                notes: req.body.notes,
                total_amount: 0 // Sẽ được cập nhật sau khi thêm sản phẩm
            };
            
            const order = await OrderModel.createOrder(orderData);
            
            // Thêm sản phẩm vào đơn hàng
            const productIds = Array.isArray(req.body.product_id) ? req.body.product_id : [req.body.product_id];
            const quantities = Array.isArray(req.body.quantity) ? req.body.quantity : [req.body.quantity];
            
            for (let i = 0; i < productIds.length; i++) {
                await OrderModel.addProductToOrder(order.id, productIds[i], quantities[i] || 1);
            }
            
            res.redirect(`/user/order/${order.id}`);
        } catch (error) {
            console.log(error);
            res.redirect('/user/order');
        }
    }
    static async getOrderDetailsApi(req, res) {
        console.log('=== GET ORDER DETAILS API CALLED ===');
        console.log('Order ID:', req.params.id);
        try {
            const orderId = req.params.id;
            const order = await OrderModel.getOrderById(orderId);
            
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đơn hàng'
                });
            }
            
            // Lấy chi tiết đơn hàng
            const orderItems = await OrderModel.getOrderItems(orderId);
            
            console.log('Order items retrieved:', orderItems);
            
            return res.json({
                success: true,
                order: {
                    ...order,
                    items: orderItems
                }
            });
        } catch (error) {
            console.error('Error getting order:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin đơn hàng'
            });
        }
    }
}

module.exports = OrderController;
