const express = require('express');
const router = express.Router();
const productController = require('../../controller/product/product.controller');

// Hiển thị danh sách danh mục
router.get('/san-pham', productController.index);

// Xử lý xóa danh mục
router.get('/xoa-san-pham/:id', productController.delete);


module.exports = router;
