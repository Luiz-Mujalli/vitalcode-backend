// Imports
const crypto = require('crypto');
const { Transaction } = require('sequelize');

const { connection: sequelize } = require('../database');

const Invitation = require('../models/Invitation');
const Company = require('../models/Company');
const CompanyMembership = require('../models/CompanyMembership');
const User = require('../models/User');

// =====================================================================================

// Error Treatment Function
function httpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}

// =====================================================================================

// Main Function
async function acceptInvitationCoreService({
    userId,
    invitationId,
    token
}) {
    if ((invitationId == null) === (token == null)) {
        httpError(400, 'Informe o ID ou o token do convite');
    }

    const tokenHash = token
        ? crypto.createHash('sha256')
            .update(token.toLowerCase())
            .digest('hex')
        : null;

    return sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
    }, async transaction => {

        const invitationLookup = await Invitation.findOne({
            where: tokenHash
                ? { token_hash: tokenHash }
                : { id: invitationId },
            attributes: ['id', 'company_id'],
            transaction
        });

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

        let membership = await CompanyMembership.findOne({
            where: {
                user_id: user.id,
                company_id: company.id
            },
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (membership) {
            if (membership.status === 'active') {
                httpError(
                    409,
                    'Usuário já possui vínculo ativo com esta empresa'
                );
            }

            membership.role = 'employee';
            membership.status = 'active';
            membership.cargo = invitation.cargo;

            await membership.save({ transaction });
        } else {
            membership = await CompanyMembership.create({
                user_id: user.id,
                company_id: company.id,
                cargo: invitation.cargo,
                role: 'employee',
                status: 'active'
            }, { transaction });
        }

        invitation.status = 'accepted',
            invitation.accepted_at = new Date();

        await invitation.save({ transaction });

        return {
            invitation_id: invitation.id,
            company_id: company.id,
            membership_id: membership.id,
            role: membership.role,
            status: membership.status
        };
    });
}

// =====================================================================================

// Export
module.exports = acceptInvitationCoreService;