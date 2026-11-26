// Main Function
function emergencyResponseHeaders(req, res, next) {

    // Prevent Response Caching
    res.set('Cache-Control', 'no-store');

    // Prevent Search Engine Indexing
    res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');

    // Prevent Referrer Information Leakage
    res.set('Referrer-Policy', 'no-referrer');

    return next();
}

// =====================================================================================

// Export
module.exports = emergencyResponseHeaders;
