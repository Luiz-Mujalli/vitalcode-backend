// Imports
const { Transaction } = require('sequelize');

const { connection: sequelize } = require('../../database');

const Invitation = require('../../models/Invitation');
const Company = require('../../models/Company');
const User = require('../../models/User');

// =====================================================================================

// Error Treatment function
function httpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}

// =====================================================================================

// Main Function
async function declineInvitationService({
    userId,
    invitationId
}) {
    return sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
    }, async transaction => {

        const invitationLookup = await Invitation.findByPk(
            invitationId,
            {
                attributes: ['id', 'company_id'],
                transaction
            }
        );

        if (!invitationLookup) {
            httpError(409, 'Convite inválido ou indisponível');
        }

        const company = await Company.findByPk(
            invitationLookup.company_id,
            {
                transaction,
                lock: transaction.LOCK.UPDATE
            }
        );

        if (!company || company.status !== 'active') {
            httpError(409, 'Convite inválido ou indisponível');
        }

        const invitation = await Invitation.findByPk(
            invitationLookup.id,
            {
                transaction,
                lock: transaction.LOCK.UPDATE
            }
        );

        if (!invitation || invitation.company_id !== company.id) {
            httpError(409, 'Convite inválido ou indisponível');
        }

        const user = await User.findByPk(userId, {
            transaction
        });

        if (!user || user.status !== 'active') {
            httpError(403, 'Usuário não está ativo');
        }

        if (
            user.email.trim().toLowerCase() !==
            invitation.email.trim().toLowerCase()
        ) {
            httpError(
                403,
                'Este convite não pertence ao usuário autenticado'
            );
        }

        if (invitation.status !== 'pending') {
            httpError(409, 'Convite não está pendente');
        }

        if (new Date(invitation.expires_at) <= new Date()) {
            httpError(409, 'Convite expirado');
        }

        invitation.status = 'declined';

        await invitation.save({ transaction });

        return {
            invitation_id: invitation.id,
            company_id: company.id,
            status: invitation.status
        };
    });
}

// =====================================================================================

// Export
module.exports = declineInvitationService;