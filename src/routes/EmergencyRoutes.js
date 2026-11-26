// Import Config
const { Router } = require('express');

// Import Controller
const EmergencyController = require(
    '../controllers/emergency/EmergencyController'
);

// Import Middlewares
const emergencyResponseHeaders = require(
    '../middlewares/security/emergencyResponseHeaders'
);
const emergencyRateLimiter = require(
    '../middlewares/rateLimit/emergencyRateLimiter'
);
const validateEmergencyToken = require(
    '../middlewares/validators/validateEmergencyToken'
);

// =====================================================================================

// Router
const router = new Router();

// =====================================================================================

// Emergency Routes
router.get(
    '/emergency/:token',
    emergencyResponseHeaders,
    emergencyRateLimiter,
    validateEmergencyToken,
    EmergencyController.show
);

// =====================================================================================

// Export
module.exports = router;
