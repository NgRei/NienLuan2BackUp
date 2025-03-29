const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const AddProductController = require('../../controller/product/add-product.controller');

// Hiển thị form thêm sản phẩm
router.get('/', AddProductController.showForm);

// Xử lý thêm sản phẩm
router.post('/', upload.single('hinh_anh'), AddProductController.create);

module.exports = router;