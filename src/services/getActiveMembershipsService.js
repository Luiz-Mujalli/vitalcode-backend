const Company = require('../models/Company');
const CompanyMembership = require('../models/CompanyMembership');

async function getActiveMembershipService(userId) {
    const memberships = await CompanyMembership.findAll({
        where: {
            user_id: userId,
            status: 'active'
        },
        include: [{
            model: Company,
            as: 'company',
            where: {
                status: 'active'
            },
            required: true
        }]
    });

    return memberships;
}

module.exports = getActiveMembershipService;