const express = require('express');
const router = express.Router();
const CategoryController = require('../../controller/category/category.controller');

// Hiển thị danh sách danh mục
router.get('/', CategoryController.index);

// Xóa danh mục - sửa lại route để match với URL /danh-muc/xoa/:id
router.get('/xoa/:id', CategoryController.delete);

module.exports = router;
