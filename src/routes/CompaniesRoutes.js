// Import Config
const { Router } = require('express');
const route = Router();

// Import Controller
const CompaniesController = require('../controllers/companies/CompaniesController');

// Import Middleware
const authMiddleware = require('../middlewares/auth/authMiddleware');

// =====================================================================================

// Rotas POST
route.post('/companies/register', CompaniesController.register);

// =====================================================================================

// Rotas GET
route.get('/companies/my', authMiddleware, CompaniesController.myCompanies);

// =====================================================================================

// Export
module.exports = route;