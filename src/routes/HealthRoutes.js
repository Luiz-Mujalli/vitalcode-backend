// Import Config
const { Router } = require('express');
const route = Router();

// Import Controller
const HealthController = require('../controllers/HealthController');

// =====================================================================================

// Rotas GET
route.get('/health', HealthController.index);

// =====================================================================================

// Export
module.exports = route;