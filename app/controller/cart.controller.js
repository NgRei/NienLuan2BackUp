const CartModel = require('../models/cart.model');

class CartController {
    static async getCart(req, res) {
        try {
            const userId = req.user.userId;
            const cartItems = await CartModel.getCartByUserId(userId);
            
            res.json({
                success: true,
                cart: cartItems
            });
        } catch (error) {
            res.status(500).json({
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
