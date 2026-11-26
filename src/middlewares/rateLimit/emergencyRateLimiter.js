// Imports
const { rateLimit } = require('express-rate-limit');

// =====================================================================================

// Emergency Rate Limiter
const emergencyRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 60,

    standardHeaders: 'draft-7',
    legacyHeaders: false,

    message: {
        error: 'Muitas solicitações. Tente novamente em instantes.'
    }
});

// =====================================================================================

// Export
module.exports = emergencyRateLimiter;
