// Import Config
const { Router } = require('express');
const route = Router();

// Import Controller
const AuthController = require('../controllers/auth/AuthController');

// Import Middleware
const authMiddleware = require('../middlewares/authMiddleware');

// =====================================================================================

// Rotas POST
route.post('/auth/login', AuthController.login)

// =====================================================================================

// Rotas GET
route.get('/auth/me', authMiddleware, AuthController.me);

// =====================================================================================

// Export
module.exports = route;