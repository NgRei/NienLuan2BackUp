const express = require('express');
const router = express.Router();
const addCategoryController = require('../controller/add-category.controller');

// Hiển thị form thêm danh mục
router.get('/them-danh-muc', addCategoryController.showForm);

// Xử lý thêm danh mục
router.post('/them-danh-muc', addCategoryController.create);

module.exports = router;
