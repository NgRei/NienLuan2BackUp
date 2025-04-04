const db = require('../../connect-mySQL').ketnoi;

class CartModel {
    static async getCartByUserId(userId) {
        try {
            const [rows] = await db.query(`
                SELECT c.*, p.name, p.gia, p.hinh_anh 
                FROM carts c
                JOIN product p ON c.product_id = p.id
                WHERE c.user_id = ?
            `, [userId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async addToCart(userId, productId, quantity) {
        try {
            // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
            const [existing] = await db.query(
                'SELECT * FROM carts WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );

            if (existing.length > 0) {
                // Nếu có rồi thì cập nhật số lượng
                await db.query(
                    'UPDATE carts SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                    [quantity, userId, productId]
                );
            } else {
                // Nếu chưa có thì thêm mới
                await db.query(
                    'INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)',
                    [userId, productId, quantity]
                );
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async updateQuantity(cartId, quantity) {
        try {
            await db.query(
                'UPDATE carts SET quantity = ? WHERE id = ?',
                [quantity, cartId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async removeFromCart(cartId) {
        try {
            await db.query('DELETE FROM carts WHERE id = ?', [cartId]);
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async clearCart(userId) {
        try {
            await db.query('DELETE FROM carts WHERE user_id = ?', [userId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CartModel;
