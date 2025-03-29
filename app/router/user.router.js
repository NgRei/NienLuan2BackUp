const express = require('express');
const router = express.Router();
const UserController = require('../controller/user.controller');

router.get('/', UserController.index);
router.get('/add', UserController.showAddForm);
router.post('/add', UserController.add);
router.get('/edit/:id', UserController.showEditForm);
router.get('/change-password/:id', UserController.showChangePasswordForm);
router.post('/change-password/:id', UserController.changePassword);
router.post('/edit/:id', UserController.update);
router.get('/delete/:id', UserController.delete);

module.exports = router;
