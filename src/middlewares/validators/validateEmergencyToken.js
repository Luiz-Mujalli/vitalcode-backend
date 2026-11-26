// Main Function
function validateEmergencyToken(req, res, next) {

    // Get Emergency Token
    const token = req.params.token;

    // Validate Emergency Token
    if (
        typeof token !== 'string' ||
        !/^[a-f0-9]{64}$/.test(token)
    ) {
        return res.status(404).json({
            error: 'Credencial emergencial indisponível'
        });
    }

    // Set Emergency Token
    req.emergencyToken = token;

    return next();
}

// =====================================================================================

// Export
module.exports = validateEmergencyToken;
