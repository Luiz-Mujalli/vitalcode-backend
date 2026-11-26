// Import Config
const { Router } = require('express');
const route = Router();

// Import Controller
const AuthController = require('../controllers/auth/AuthController');

// Import Middleware
const authMiddleware = require('../middlewares/auth/authMiddleware');
const authRateLimiter = require(
    '../middlewares/rateLimit/authRateLimiter'
);

// =====================================================================================

// Rotas POST
route.post('/auth/login', authRateLimiter, AuthController.login)

// =====================================================================================

// Rotas GET
route.get('/auth/me', authMiddleware, AuthController.me);

// =====================================================================================

// Export
module.exports = route;