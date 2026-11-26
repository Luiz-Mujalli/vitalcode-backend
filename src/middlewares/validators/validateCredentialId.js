// Main Function
function validateCredentialId(req, res, next) {

    // Validate Credential ID
    const credentialId = Number(req.params.credentialId);

    if (
        !/^\d+$/.test(req.params.credentialId) ||
        !Number.isSafeInteger(credentialId) ||
        credentialId <= 0
    ) {
        return res.status(400).json({
            error: 'ID da credencial inválido'
        });
    }

    // Set Credential ID
    req.credentialId = credentialId;

    return next();
}

// =====================================================================================

// Export
module.exports = validateCredentialId;
