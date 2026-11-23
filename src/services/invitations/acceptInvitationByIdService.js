// Imports
const acceptInvitationCoreService = require('./acceptInvitationCoreService');

// =====================================================================================

// Main Function
async function acceptInvitationByIdService({
    userId,
    invitationId
}) {
    return acceptInvitationCoreService({
        userId,
        invitationId
    });
}

// =====================================================================================

// Export
module.exports = acceptInvitationByIdService;