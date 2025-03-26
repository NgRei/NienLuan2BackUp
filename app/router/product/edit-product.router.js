const express = require('express');
const router = express.Router();
const { upload } = require('../../../index'); // Import middleware upload
const editProductController = require('../../controller/product/edit-product.controller');

// Hiển thị trang chỉnh sửa danh mục
router.get('/sua-san-pham/:id', editProductController.showFormEdit);

// Xử lý chỉnh sửa danh mục
router.post('/san-pham/chinh-sua/:id', upload.single('hinh_anh'), editProductController.update);

module.exports = router;