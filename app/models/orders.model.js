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
        
        // Bước 2: Bắt đầu transaction để đảm bảo toàn vẹn dữ liệu
        const connection = await ketnoi.getConnection();
        await connection.beginTransaction();
        
        try {
            // Bước 3: Xóa các mục trong order_items liên quan đến đơn hàng
            await connection.query('DELETE FROM order_items WHERE order_id = ?', [id]);
            
            // Bước 4: Xóa đơn hàng
            await connection.query('DELETE FROM orders WHERE id = ?', [id]);
            
            // Xác nhận transaction
            await connection.commit();
            
            return { success: true, id: id, message: 'Đơn hàng đã được xóa thành công' };
        } catch (error) {
            // Nếu có lỗi, hoàn tác transaction
            await connection.rollback();
            console.error("Lỗi khi xóa đơn hàng:", error);
            return { success: false, message: 'Đã xảy ra lỗi khi xóa đơn hàng' };
        } finally {
            // Trả connection về pool
            connection.release();
        }
    }

    static async calculateOrderTotal(orderId) {
        const [result] = await ketnoi.query(
            `SELECT SUM(price * quantity) as total 
             FROM order_items 
             WHERE order_id = ?`,
            [orderId]
        );
        
        const total = result[0].total || 0;
        
        // Cập nhật tổng tiền trong bảng orders
        await ketnoi.query(
            'UPDATE orders SET total_amount = ? WHERE id = ?',
            [total, orderId]
        );
        
        return total;
    }

    static async addProductToOrder(orderId, productId, quantity = 1) {
        // Lấy giá sản phẩm từ bảng product
        const [products] = await ketnoi.query(
            'SELECT gia FROM product WHERE id = ?',
            [productId]
        );
        
        if (products.length === 0) {
            throw new Error('Không tìm thấy sản phẩm');
        }
        
        const price = products[0].gia;
        
        // Thêm sản phẩm vào order_items
        await ketnoi.query(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [orderId, productId, quantity, price]
        );
        
        // Cập nhật tổng tiền trong orders
        const total = await this.calculateOrderTotal(orderId);
        await ketnoi.query(
            'UPDATE orders SET total_amount = ? WHERE id = ?',
            [total, orderId]
        );
        
        return { success: true };
    }

    static async getOrderItems(orderId) {
        const [items] = await ketnoi.query(
            `SELECT oi.*, p.name, p.mota, p.hinh_anh
             FROM order_items oi
             JOIN product p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [orderId]
        );
        
        return items;
    }
}

module.exports = OrderModel;
