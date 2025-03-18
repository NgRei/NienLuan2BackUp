const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category.controller');

// Hiển thị danh sách danh mục
router.get('/danh-muc', categoryController.index);

// Xử lý xóa danh mục
router.get('/xoa-danh-muc/:id', categoryController.delete);

module.exports = router;
