// Imports
const crypto = require('crypto');

const { Op, Transaction } = require('sequelize');

const { connection: sequelize } = require('../../database');

const Company = require('../../models/Company');
const Invitation = require('../../models/Invitation');
const User = require('../../models/User');
const CompanyMembership = require('../../models/CompanyMembership');

// =====================================================================================

// Main Function
async function createInvitationService({
    companyId,
    invitedBy,
    email,
    cargo
}) {
    return sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
    }, async (transaction) => {

        const company = await Company.findOne({
            where: {
                id: companyId,
                status: 'active'
            },
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!company) {
            const error = new Error(
                'Empresa não encontrada ou inativa'
            );
            error.statusCode = 403;
            throw error;
        }

        const user = await User.findOne({
            where: { email },
            transaction
        });

        if (user) {
            const existingMembership = await CompanyMembership.findOne({
                where: {
                    user_id: user.id,
                    company_id: companyId,
                    status: 'active'
                },
                transaction
            });

            if (existingMembership) {
                const error = new Error(
                    'Usuário já possui vínculo ativo com essa empresa'
                );
                error.statusCode = 409;
                throw error;
            }
        }

        const existingInvitation = await Invitation.findOne({
            where: {
                company_id: companyId,
                email,
                status: 'pending',
                expires_at: {
                    [Op.gt]: new Date()
                }
            },
            transaction
        });

        if (existingInvitation) {
            const error = new Error(
                'Já existe um convite pendente para este e-mail'
            );
            error.statusCode = 409;
            throw error;
        }

        const token = crypto.randomBytes(32).toString('hex');

        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const expiresAt = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );


        const invitation = await Invitation.create({
            company_id: companyId,
            invited_by: invitedBy,
            email,
            cargo: cargo ?? null,
            token_hash: tokenHash,
            status: 'pending',
            expires_at: expiresAt
        }, { transaction });

        return {
            id: invitation.id,
            email: invitation.email,
            cargo: invitation.cargo,
            status: invitation.status,
            expires_at: invitation.expires_at,
            token
        };
    });
}

// =====================================================================================

// Export
module.exports = createInvitationService;