// Imports
const User = require('../../models/User');
const getActiveMembershipsService = require('../employees/getActiveMembershipsService');
const { verifyPassword } = require('./passwordService');

// =====================================================================================

// Main Function
async function authService({ email, password }) {
    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        return null;
    }

    const passwordIsValid = await verifyPassword(
        user.password_hash,
        password
    );

    if (!passwordIsValid || user.status !== 'active') {
        return null;
    }

    const memberships = await getActiveMembershipsService(user.id);

    return {
        user: {
            id: user.id,
            nome: user.nome,
            sobrenome: user.sobrenome,
            email: user.email
        },
        memberships: memberships.map(membership => ({
            id: membership.id,
            company_id: membership.company_id,
            company_name: membership.company.nome,
            role: membership.role
        }))
    };
}

// =====================================================================================

// Export
module.exports = authService;