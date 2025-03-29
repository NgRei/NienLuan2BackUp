const express = require('express');
const router = express.Router();
const ProductController = require('../../controller/product/product.controller');

router.get('/', ProductController.index);

router.get('/xoa/:id', ProductController.delete);

module.exports = router;
