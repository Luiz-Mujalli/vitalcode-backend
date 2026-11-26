// Imports
const { rateLimit } = require('express-rate-limit');

// =====================================================================================

// API Rate Limiter
const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,

    standardHeaders: 'draft-7',
    legacyHeaders: false,

    // Emergency Routes Have Their Own Rate Limiter
    skip: (req) => {
        return req.path.startsWith('/emergency/');
    },

    message: {
        error: 'Limite de requisições atingido. Tente novamente mais tarde.'
    }
});

// =====================================================================================

// Export
module.exports = apiRateLimiter;
