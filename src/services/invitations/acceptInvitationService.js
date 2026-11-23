// Imports
const acceptInvitationCoreService = require('./acceptInvitationCoreService');

// =====================================================================================

// Main Function
async function acceptInvitationService({ userId, token }) {
    return acceptInvitationCoreService({
        userId,
        token
    });
}

// =====================================================================================

// Export
module.exports = acceptInvitationService;