// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controller/auth.controller');
const authMiddleware = require('../middlewares/frontend/auth.middleware');
router.post('/login', AuthController.login);
router.put('/profile', authMiddleware, AuthController.updateProfile);

module.exports = router;