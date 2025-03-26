const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const addProductController = require('../../controller/product/add-product.controller');

// Hiển thị form thêm sản phẩm
router.get('/them-san-pham', addProductController.showForm);

// Xử lý thêm sản phẩm
router.post('/them-san-pham', upload.single('hinh_anh'), addProductController.create);

module.exports = router;