const mysql = require('mysql2/promise');

// Cấu hình kết nối database
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ql_shopmohinh',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Hàm kiểm tra kết nối pool
async function testPool() {
    try {
        const connection = await pool.getConnection();
        console.log('Kết nối pool database thành công');
        connection.release();
        return true;
    } catch (error) {
        console.error('Lỗi kết nối pool database:', error);
        return false;
    }
}

// Export pool dưới tên ketnoi và hàm testPool
module.exports = {
    ketnoi: pool,
    testPool
};