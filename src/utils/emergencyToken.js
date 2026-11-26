
// Imports
const crypto = require('crypto');

// =====================================================================================

// Generate Emergency Token
function generateEmergencyToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Hash Emergency Token
function hashEmergencyToken(token) {
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
}

// =====================================================================================

// Export
module.exports = {
    generateEmergencyToken,
    hashEmergencyToken
};
