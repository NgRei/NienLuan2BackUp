const express = require('express');
const router = express.Router();
const editCategoryController = require('../../controller/category/edit-category.controller');

// Sửa route để match với URL /danh-muc/chinh-sua/:id
router.get('/:id', editCategoryController.showFormEdit);
router.post('/:id', editCategoryController.update);

module.exports = router;