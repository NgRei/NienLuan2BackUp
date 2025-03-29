const express = require('express');
const router = express.Router();
const { upload } = require('../../../index'); // Import middleware upload
const EditProductController = require('../../controller/product/edit-product.controller');

// Hiển thị trang chỉnh sửa danh mục
router.get('/:id', EditProductController.showFormEdit);

// Xử lý chỉnh sửa danh mục
router.post('/:id', upload.single('hinh_anh'), EditProductController.update);

module.exports = router;