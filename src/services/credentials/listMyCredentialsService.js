
// Imports
const { Op } = require('sequelize');

const CompanyMembership = require('../../models/CompanyMembership');
const EmergencyCredential = require('../../models/EmergencyCredential');

// =====================================================================================

// Error Treatment Function
function httpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}

// =====================================================================================

// Main Function
async function listMyCredentialsService({
    userId,
    companyId
}) {

    // Validate Membership
    const membership = await CompanyMembership.findOne({
        where: {
            user_id: userId,
            company_id: companyId,
            role: {
                [Op.in]: ['admin', 'employee']
            },
            status: 'active'
        },
        attributes: ['id']
    });

    if (!membership) {
        httpError(403, 'Vínculo empresarial inválido');
    }

    // Find Credentials
    const credentials = await EmergencyCredential.findAll({
        where: {
            membership_id: membership.id
        },
        attributes: [
            'id',
            'membership_id',
            'status',
            'issued_at',
            'revoked_at'
        ],
        order: [
            ['issued_at', 'DESC'],
            ['id', 'DESC']
        ]
    });

    // Return Credentials
    return credentials;
}

// =====================================================================================

// Export
module.exports = listMyCredentialsService;
