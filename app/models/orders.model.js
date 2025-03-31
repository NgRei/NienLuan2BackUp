const { ketnoi } = require('../../connect-mySQL');

class OrderModel {
    static async getOrderById(id) {
        
        const [orders] = await ketnoi.query('SELECT * FROM orders WHERE id = ?', [id]);
        
        return orders[0];
        
    }

    static async getAllOrders() {
        const [orders] = await ketnoi.query('SELECT * FROM orders');
        return orders;
    }

    static async getOrdersByUserId(userId) {
        const [orders] = await ketnoi.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return orders;
    }
}

module.exports = OrderModel;
