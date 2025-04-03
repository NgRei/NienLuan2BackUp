const express = require('express');
const router = express.Router();
const { ketnoi } = require('../../../connect-mySQL');

// API lấy tất cả danh mục
router.get('/categories', async (req, res) => {
    try {
        console.log('Fetching categories...');
        const [rows] = await ketnoi.query(
            'SELECT * FROM category WHERE status = 1'
        );
        
        console.log('Found categories:', rows?.length);

        // Nếu không có dữ liệu
        if (!rows || rows.length === 0) {
            console.log('No categories found');
            return res.json([]);
        }

        // Map ảnh theo ID thay vì tên
        const categoriesWithImages = rows.map(category => ({
            ...category,
            image: `/images/AnhDanhMuc/${category.id}.png`  
        }));

        console.log('Returning categories with images');
        // Trả về kết quả
        return res.json(categoriesWithImages);

    } catch (error) {
        console.error('Error in /categories:', error);
        return res.status(500).json([]);  // Return empty array on error
    }
});

module.exports = router;
