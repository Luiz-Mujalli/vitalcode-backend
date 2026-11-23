// Imports
const { Op } = require('sequelize');

const Invitation = require('../../models/Invitation');
const Company = require('../../models/Company');
const User = require('../../models/User');

// =====================================================================================

// Main Function
async function listMyInvitationService({ userId }) {
    const user = await User.findByPk(userId, {
        attributes: ['id', 'email', 'status']
    });

    if (!user || user.status !== 'active') {
        const error = new Error('Usuário não está ativo');
        error.statusCode = 403;
        throw error;
    }

    const invitations = await Invitation.findAll({
        where: {
            email: user.email.trim().toLowerCase(),
            status: 'pending',
            expires_at: {
                [Op.gt]: new Date()
            }
        },
        attributes: [
            'id',
            'company_id',
            'invited_by',
            'cargo',
            'status',
            'expires_at',
            'created_at'
        ],
        order: [['created_at', 'DESC']]
    });

    const companyIds = [
        ...new Set(invitations.map(invitation => invitation.company_id))
    ];

    const inviterIds = [
        ...new Set(invitations.map(invitation => invitation.invited_by))
    ];

    const [companies, inviters] = await Promise.all([
        Company.findAll({
            where: {
                id: companyIds,
                status: 'active'
            },
            attributes: ['id', 'nome']
        }),
        User.findAll({
            where: { id: inviterIds },
            attributes: ['id', 'nome', 'sobrenome']
        })
    ]);

    const companyMap = new Map(
        companies.map(company => [String(company.id), company])
    );

    const inviterMap = new Map(
        inviters.map(inviter => [String(inviter.id), inviter])
    );

    return invitations
        .filter(invitation =>
            companyMap.has(String(invitation.company_id))
        )
        .map(invitation => {
            const company = companyMap.get(String(invitation.company_id));
            const inviter = inviterMap.get(String(invitation.invited_by));

            return {
                id: invitation.id,
                company: {
                    id: company.id,
                    nome: company.nome
                },
                cargo: invitation.cargo,
                invited_by: inviter
                    ? {
                        nome: inviter.nome,
                        sobrenome: inviter.sobrenome
                    }
                    : null,
                status: invitation.status,
                expires_at: invitation.expires_at
            };
        });
}

// =====================================================================================

// Export
module.exports = listMyInvitationService;