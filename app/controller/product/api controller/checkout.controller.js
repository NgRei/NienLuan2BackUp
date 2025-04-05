const OrderModel = require('../../../models/orders.model');
const ProductModel = require('../../../models/product.model');
const CartModel = require('../../../models/cart.model');
const { ketnoi } = require('../../../../connect-mySQL');

class CheckoutController {
    // Hiển thị trang checkout
    static async showCheckout(req, res) {
        try {
            // Lấy user từ token đã được decode trong middleware
            const userId = req.user.id;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized access'
                });
            }

            const cartItems = req.body.cartItems || [];
            
            let totalAmount = 0;
            const products = [];

            for (const item of cartItems) {
                const product = await ProductModel.findById(item.product_id);
                if (product) {
                    products.push({
                        ...product,
                        quantity: item.quantity,
                        subtotal: product.price * item.quantity
                    });
                    totalAmount += product.price * item.quantity;
                }
            }

            res.status(200).json({
                success: true,
                data: {
                    products,
                    totalAmount,
                    user: req.user
                }
            });
        } catch (error) {
            console.error('Checkout error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    // Xử lý đơn hàng khi người dùng submit form checkout
    static async createOrder(req, res) {
        const connection = await ketnoi.getConnection();
        
        try {
            await connection.beginTransaction();
            
            const userId = req.user.userId;
            const { shipping_address, payment_method, notes } = req.body;
            
            // Lấy giỏ hàng từ database
            const cartItems = await CartModel.getCartByUserId(userId);
            
            if (!cartItems || cartItems.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Giỏ hàng trống'
                });
            }
            
            // Tính tổng tiền
            const total_amount = cartItems.reduce((sum, item) => 
                sum + (item.gia * item.quantity), 0
            );
            
            // Thêm vào đầu phương thức createOrder
            console.log("Debug auth user:", req.user);
            console.log("Database connection:", ketnoi ? "Connected" : "Not connected");

            // Trước khi INSERT, kiểm tra user
            const [userExists] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
            console.log("User exists check:", userExists);
            
            if (userExists.length === 0) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'User không tồn tại trong hệ thống'
                });
            }

            // Log thông tin debug
            console.log('Debug order data:', { 
                userId, 
                total_amount,
                shipping_address,
                payment_method,
                notes 
            });

            // Sau đó mới insert
            const [orderResult] = await connection.query(
                `INSERT INTO orders (user_id, total_amount, shipping_address, 
                order_date, order_status, notes) 
                VALUES (?, ?, ?, NOW(), 'pending', ?)`,
                [userId, total_amount, shipping_address, notes]
            );
            
            const orderId = orderResult.insertId;
            
            // Thêm từng sản phẩm vào bảng order_items
            for (const item of cartItems) {
                await connection.query(
                    `INSERT INTO order_items (order_id, product_id, quantity, price) 
                    VALUES (?, ?, ?, ?)`,
                    [orderId, item.product_id, item.quantity, item.gia]
                );
            }
            
            // THÊM MỚI: Tạo payment record
            await connection.query(
                `INSERT INTO payments (order_id, payment_amount, payment_method, payment_status, payment_date) 
                 VALUES (?, ?, ?, 'pending', NOW())`,
                [orderId, total_amount, payment_method]
            );
            
            // Xóa giỏ hàng
            await connection.query('DELETE FROM carts WHERE user_id = ?', [userId]);
            
            // Commit transaction
            await connection.commit();
            
            // Trả về kết quả
            res.json({
                success: true,
                orderId: orderId,
                message: 'Đặt hàng thành công'
            });
            
        } catch (error) {
            // Rollback nếu có lỗi
            await connection.rollback();
            console.error('Checkout error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xử lý đơn hàng'
            });
        } finally {
            // Trả connection về pool
            connection.release();
        }
    }

    // Lấy thông tin đơn hàng chi tiết
    static async getOrderDetails(req, res) {
        console.log('=== GET ORDER DETAILS API CALLED ===');
        console.log('Request params:', req.params);
        console.log('Auth user:', req.user);
        console.log('Request headers:', req.headers);
        
        try {
            const orderId = req.params.id;
            console.log(`Looking for order with ID: ${orderId}`);
            
            const userId = req.user.userId;
            console.log(`User ID from token: ${userId}`);

            // Lấy thông tin đơn hàng
            console.log('Fetching order from database...');
            const order = await OrderModel.getOrderById(orderId);
            
            console.log('Order from database:', order);
            
            if (!order) {
                console.log('Order not found in database');
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đơn hàng'
                });
            }

            // Kiểm tra xem đơn hàng có thuộc về người dùng không
            console.log(`Comparing order.user_id (${order.user_id}) with userId (${userId})`);
            if (order.user_id !== userId) {
                console.log('Access denied: Order belongs to different user');
                return res.status(403).json({
                    success: false,
                    message: 'Bạn không có quyền xem đơn hàng này'
                });
            }

            // Lấy chi tiết các sản phẩm trong đơn hàng
            console.log('Fetching order items...');
            const items = await OrderModel.getOrderItems(orderId);
            console.log('Order items:', items);

            // Trả về kết quả
            console.log('Sending successful response with order data');
            res.json({
                success: true,
                order: {
                    ...order,
                    items
                }
            });
        } catch (error) {
            console.error('ERROR in getOrderDetails:', error);
            console.error('Error stack:', error.stack);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy thông tin đơn hàng',
                error: error.message
            });
        }
    }
}

module.exports = CheckoutController;
