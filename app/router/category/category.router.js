const express = require('express');
const router = express.Router();
const CategoryController = require('../../controller/category/category.controller');

// Hiển thị danh sách danh mục
router.get('/danh-muc', (req, res) => {
    console.log('Đã nhận request GET /danh-muc');
    CategoryController.index(req, res);
});

// Xóa danh mục
router.get('/xoa-danh-muc/:id', (req, res) => {
    console.log('Đã nhận request GET /xoa-danh-muc/:id');
    CategoryController.delete(req, res);
});

module.exports = router;
