const express = require('express');
const router = express.Router();
const AddCategoryController = require('../../controller/category/add-category.controller');

// Hiển thị form thêm danh mục
router.get('/', AddCategoryController.showForm);

// Xử lý thêm danh mục - sử dụng instance method
router.post('/', AddCategoryController.create);

module.exports = router;
