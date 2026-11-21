// Imports
const getActiveMembershipService = require('./getActiveMembershipsService');

// =====================================================================================

// Main Function
async function listMyCompaniesService(userId) {
    const memberships = await getActiveMembershipService(userId);

    return memberships.map(membership => ({
        id: membership.company.id,
        nome: membership.company.nome,
        status: membership.company.status,
        membership: {
            id: membership.id,
            role: membership.role
        }
    }));
}

// =====================================================================================

// Export
module.exports = listMyCompaniesService;