const { ketnoi } = require('../../connect-mySQL');

class OrderModel {
    static async getOrderById(id) {
        
        const [orders] = await ketnoi.query('SELECT * FROM orders WHERE id = ?', [id]);
        
        return orders[0];
        
    }

    static async getAllOrders(page, limit, status) {
        const offset = (page - 1) * limit;
        let ordersQuery, totalQuery, queryParams;
        
        if (status === '') {
            // Nếu không có status được chọn, hiển thị tất cả đơn hàng
            ordersQuery = 'SELECT * FROM orders ORDER BY order_date DESC LIMIT ?, ?';
            totalQuery = 'SELECT COUNT(*) as total FROM orders';
            queryParams = [offset, limit];
        } else {
            // Nếu có status, lọc theo status
            ordersQuery = 'SELECT * FROM orders WHERE order_status = ? ORDER BY order_date DESC LIMIT ?, ?';
            totalQuery = 'SELECT COUNT(*) as total FROM orders WHERE order_status = ?';
            queryParams = [status, offset, limit];
        }
        
        const [orders] = await ketnoi.query(ordersQuery, queryParams);
        const [totalResult] = await ketnoi.query(totalQuery, status === '' ? [] : [status]);
        
        return {
            data: orders,
            total: totalResult[0].total, // Sử dụng tên cột 'total' đã chỉ định trong truy vấn
            currentPage: page,
            totalPages: Math.ceil(totalResult[0].total / limit)
        };
    }

    static async getOrdersByUserId(userId) {
        const [orders] = await ketnoi.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return orders;
    }

    static async deleteOrder(id) {
        // Bước 1: Kiểm tra xem đơn hàng có trạng thái 'cancelled' không
        const [orders] = await ketnoi.query(
            'SELECT * FROM orders WHERE id = ? AND order_status = "cancelled"', 
            [id]
        );
        
        // Nếu không tìm thấy đơn hàng hoặc trạng thái không phải cancelled
        if (orders.length === 0) {
            return { success: false, message: 'Chỉ được phép xóa đơn hàng đã bị hủy' };
        }
        
        // Bước 2: Xóa đơn hàng
        await ketnoi.query('DELETE FROM orders WHERE id = ?', [id]);
        
        return { success: true, id: id, message: 'Đơn hàng đã được xóa thành công' };
    }
}

module.exports = OrderModel;
