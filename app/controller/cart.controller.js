const CartModel = require('../models/cart.model');

class CartController {
    static async getCart(req, res) {
        try {
            console.log('Getting cart...');
            console.log('User:', req.user);

            const userId = req.user.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Không có thông tin user ID'
                });
            }

            const cartItems = await CartModel.getCartByUserId(userId);
            console.log('Cart items found:', cartItems);

            return res.status(200).json({
                success: true,
                cart: cartItems
            });
        } catch (error) {
            console.error('Cart fetch error:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin giỏ hàng'
            });
        }
    }

    static async addToCart(req, res) {
        try {
            const userId = req.user.userId;
            const { productId, quantity } = req.body;

            await CartModel.addToCart(userId, productId, quantity);
            
            res.json({
                success: true,
                message: 'Thêm vào giỏ hàng thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm vào giỏ hàng'
            });
        }
    }

    static async updateQuantity(req, res) {
        try {
            const { cartId, quantity } = req.body;
            await CartModel.updateQuantity(cartId, quantity);
            
            res.json({
                success: true,
                message: 'Cập nhật số lượng thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật số lượng'
            });
        }
    }

    static async removeFromCart(req, res) {
        try {
            const { cartId } = req.params;
            await CartModel.removeFromCart(cartId);
            
            res.json({
                success: true,
                message: 'Xóa sản phẩm thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa sản phẩm'
            });
        }
    }
}

module.exports = CartController;
