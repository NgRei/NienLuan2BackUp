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

// GET sản phẩm nổi bật (8 sản phẩm có giá cao nhất)
router.get('/san-pham/noi-bat', async (req, res) => {
    try {
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
             ORDER BY gia DESC
             LIMIT 4`
        );

        console.log(`Tìm thấy ${rows.length} sản phẩm nổi bật`);
        res.json(rows);

    } catch (error) {
        console.error('Lỗi khi truy vấn sản phẩm nổi bật:', error);
        res.status(500).json({
            error: true,
            message: 'Lỗi khi truy vấn database: ' + error.message
        });
    }
});

// GET thông tin danh mục
router.get('/danh-muc/:id', async (req, res) => {
    try {
        const [rows] = await ketnoi.query(
            'SELECT * FROM category WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy danh mục'
            });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Lỗi khi truy vấn danh mục:', error);
        res.status(500).json({
            error: true,
            message: 'Lỗi server: ' + error.message
        });
    }
});

// GET sản phẩm theo danh mục
router.get('/san-pham/danh-muc/:categoryId', async (req, res) => {
    try {
        const [rows] = await ketnoi.query(
            `SELECT * FROM product 
             WHERE category_id = ? AND status = 1 
             ORDER BY id DESC`,
            [req.params.categoryId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Lỗi khi truy vấn sản phẩm theo danh mục:', error);
        res.status(500).json({
            error: true,
            message: 'Lỗi server: ' + error.message
        });
    }
});

// GET chi tiết sản phẩm theo ID - Đổi route thành /product-detail/:id
router.get('/product-detail/:id', async (req, res) => {
    try {
        console.log('Đang lấy chi tiết sản phẩm với ID:', req.params.id); // Debug log

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
             WHERE id = ?`,
            [req.params.id]
        );

        if (rows.length === 0) {
            console.log('Không tìm thấy sản phẩm với ID:', req.params.id);
            return res.status(404).json({
                error: true,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        console.log('Đã tìm thấy sản phẩm:', rows[0]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Lỗi khi truy vấn chi tiết sản phẩm:', error);
        res.status(500).json({
            error: true,
            message: 'Lỗi server: ' + error.message
        });
    }
});

module.exports = router;
