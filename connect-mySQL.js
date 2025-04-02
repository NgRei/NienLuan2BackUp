const mysql = require('mysql2/promise');

// Cấu hình kết nối database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Thay đổi nếu có password khác
    database: 'ql_shopmohinh',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Hàm kiểm tra kết nối pool
const testPool = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Kết nối pool database thành công');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Lỗi kết nối pool database:', error);
        return false;
    }
};

// Export cả pool và hàm test
module.exports = {
    ketnoi: pool,
    testPool: testPool  // Đảm bảo export testPool như một function
};