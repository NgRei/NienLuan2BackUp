const express = require('express');
const router = express.Router();
const editCategoryController = require('../../controller/category/edit-category.controller');

// Hiển thị trang chỉnh sửa danh mục
router.get('/danh-muc/chinh-sua/:id', editCategoryController.showFormEdit);

// Xử lý chỉnh sửa danh mục
router.post('/danh-muc/chinh-sua/:id', editCategoryController.update);

module.exports = router;