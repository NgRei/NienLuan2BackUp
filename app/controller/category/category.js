const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Cấu hình kết nối database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',  // Thay đổi password nếu có
    database: 'ql_shopmohinh'
});

// API lấy tất cả danh mục
router.get('/categories', (req, res) => {
    const query = 'SELECT * FROM category';  // Thay đổi tên bảng theo database của bạn
    
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({
                error: 'Lỗi khi lấy danh mục',
                details: error
            });
        }
        res.json(results);
    });
});

module.exports = router;
