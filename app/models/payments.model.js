const { ketnoi } = require('../../connect-mySQL');

class PaymentModel {
    static async getPaymentById(id) {
        const [payments] = await ketnoi.query('SELECT * FROM payments WHERE id = ?', [id]);
        return payments[0];
    }

    static async getPaymentByOrderId(orderId) {
        const [payments] = await ketnoi.query('SELECT * FROM payments WHERE order_id = ?', [orderId]);
        return payments[0];
    }
}

module.exports = PaymentModel;
