const express = require('express');
const router = express.Router();
const LoginController = require('../controller/login.controller');

router.get('/login', LoginController.showLoginForm);
router.post('/login', LoginController.handleLogin);
router.get('/logout', LoginController.logout);

module.exports = router;

