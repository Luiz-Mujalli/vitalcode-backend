const crypto = require('crypto');
const { Transaction } = require('sequelize');

const { connection: sequelize } = require('../database');

const Invitation = require('../models/Invitation');
const Company = require('../models/Company');
const CompanyMembership = require('../models/CompanyMembership');
const User = require('../models/User');

function conflict(message) {
    const error = new Error(message);
    error.statusCode = 409;
    throw error;
}

async function acceptInvitationService({ userId, token }) {
    const tokenHash = crypto
        .createHash('sha256')
        .update(token.toLowerCase())
        .digest('hex');

    return sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
    }, async (transaction) => {

        const invitationLookup = await Invitation.findOne({
            where: { token_hash: tokenHash },
            attributes: ['id', 'company_id'],
            transaction
        });

        if (!invitationLookup) {
            conflict('Convite inválido ou indisponível');
        }

        const company = await Company.findByPk(
            invitationLookup.company_id,
            {
                transaction,
                lock: transaction.LOCK.UPDATE
            }
        );

        if (!company || company.status !== 'active') {
            conflict('Convite inválido ou indisponível');
        }

        const invitation = await Invitation.findByPk(
            invitationLookup.id,
            {
                transaction,
                lock: transaction.LOCK.UPDATE
            }
        );

        if (!invitation) {
            conflict('Convite inválido ou indisponível')
        }

        if (invitation.status !== 'pending') {
            conflict('Convite não está pendente');
        }

        if (new Date(invitation.expires_at) <= new Date()) {
            conflict('Convite expirado');
        }

        const user = await User.findByPk(userId, {
            transaction
        });

        if (!user || user.status !== 'active') {
            conflict('Usuário não está ativo');
        }

        if (
            user.email.trim().toLowerCase() !==
            invitation.email.trim().toLowerCase()
        ) {
            const error = new Error(
                'Este convite não pertence ao usuário autenticado'
            );
            error.statusCode = 403;
            throw error;
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
                conflict('Usuário já possui um vínculo ativo com esta empresa');
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

        invitation.status = 'accepted';
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

module.exports = acceptInvitationService;