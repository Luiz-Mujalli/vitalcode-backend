// Imports
const CompanyMembership = require('../../models/CompanyMembership');
const User = require('../../models/User');

// =====================================================================================

// Main Function
async function getCompanyEmployeeService(companyId, employeeId) {
    const membership = await CompanyMembership.findOne({
        where: {
            company_id: companyId,
            user_id: employeeId
        },
        attributes: [
            'id',
            'cargo',
            'role',
            'status'
        ],
        include: [{
            model: User,
            as: 'user',
            attributes: [
                'id',
                'nome',
                'sobrenome',
                'email',
                'status'
            ],
            required: true
        }]
    });

    if (!membership) {
        return null;
    }

    return {
        membership_id: membership.id,
        cargo: membership.cargo,
        role: membership.role,
        membership_status: membership.status,
        user: {
            id: membership.user.id,
            nome: membership.user.nome,
            sobrenome: membership.user.sobrenome,
            email: membership.user.email,
            status: membership.user.status
        }
    };
}

// =====================================================================================

// Export
module.exports = getCompanyEmployeeService;