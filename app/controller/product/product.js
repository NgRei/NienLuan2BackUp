const express = require('express');
const router = express.Router();
const { ketnoi } = require('../../../connect-mySQL');

// Đổi route để khớp với cấu trúc thư mục
router.get('/san-pham', async (req, res) => {  // Thay đổi route từ /api/products thành /san-pham
    try {
        console.log('Đang lấy danh sách sản phẩm...'); // Debug log

        const [rows] = await ketnoi.query(
            `SELECT 
                id,
                name,
                category_id,
                gia,
                so_luong,
                hang_san_xuat,
                noi_xuat_xu,
                nam_san_xuat,
                mota,
                hinh_anh,
                status
             FROM product 
             WHERE status = 1 
             ORDER BY id DESC`
        );

        console.log(`Tìm thấy ${rows.length} sản phẩm`); // Debug log
        res.json(rows);

    } catch (error) {
        console.error('Lỗi khi truy vấn sản phẩm:', error);
        res.status(500).json({
            error: true,
            message: 'Lỗi khi truy vấn database: ' + error.message
        });
    }
});

// GET sản phẩm theo category
router.get('/api/products/category/:categoryId', async (req, res) => {
    try {
        const [rows] = await ketnoi.query(
            `SELECT p.*, c.category_name 
             FROM product p 
             LEFT JOIN category c ON p.category_id = c.id 
             WHERE p.category_id = ? AND p.status = 1`,
            [req.params.categoryId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route test
router.get('/test', async (req, res) => {
    try {
        const [result] = await ketnoi.query('SELECT 1 as test');  // Sử dụng ketnoi
        res.json({
            success: true,
            message: 'Kết nối database thành công',
            data: result[0]
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Lỗi kết nối database: ' + error.message
        });
    }
});

module.exports = router;
