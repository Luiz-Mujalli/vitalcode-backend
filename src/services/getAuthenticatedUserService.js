const User = require('../models/User');
const getActiveMembershipsService = require('./getActiveMembershipsService');

async function getAuthenticatedUserService(userId) {
    const user = await User.findByPk(userId);

    if (!user || user.status !== 'active') {
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

module.exports = getAuthenticatedUserService;