// Imports
const { rateLimit } = require('express-rate-limit');

// =====================================================================================

// Authentication Rate Limiter
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,

    standardHeaders: 'draft-7',
    legacyHeaders: false,

    skipSuccessfulRequests: true,

    message: {
        error: 'Muitas tentativas de autenticação. Tente novamente mais tarde.'
    }
});

// =====================================================================================

// Export
module.exports = authRateLimiter;
