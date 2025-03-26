const mysql = require('mysql2/promise');

// Cấu hình kết nối với nhiều tùy chọn bền vững hơn
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ql_shopmohinh', // Tên database của bạn
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // Số kết nối tối đa ở trạng thái idle
    idleTimeout: 60000, // Thời gian timeout cho idle connections (ms)
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Kiểm tra kết nối khi khởi tạo pool
const testPool = async () => {
    try {
        const conn = await pool.getConnection();
        console.log('✅ Kết nối pool thành công');
        conn.release();
        return true;
    } catch (err) {
        console.error('❌ Lỗi kết nối pool:', err);
        return false;
    }
};

module.exports = {
    ketnoi: pool,
    testPool
};