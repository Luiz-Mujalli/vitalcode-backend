// Imports
const crypto = require('crypto');
const { Transaction, UniqueConstraintError } = require('sequelize');

const { connection: sequelize } = require('../database');

const Invitation = require('../models/Invitation');
const Company = require('../models/Company');
const User = require('../models/User');

const { hashPassword } = require('../services/passwordService');

// =====================================================================================

// Error Treatment Function
function conflict(message) {
    const error = new Error(message);
    error.statusCode = 409;
    throw error;
}

// =====================================================================================

// Main Function
async function registerInvitedUserService(data) {
    const {
        token,
        nome,
        sobrenome,
        data_nascimento,
        email,
        password
    } = data;

    const tokenHash = crypto
        .createHash('sha256')
        .update(token.toLowerCase())
        .digest('hex');

    const passwordHash = await hashPassword(password);

    try {
        return await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
        }, async transaction => {

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

            if (
                !invitation ||
                invitation.status !== 'pending' ||
                new Date(invitation.expires_at) <= new Date()
            ) {
                conflict('Convite inválido, expirado ou indisponível');
            }

            if (
                invitation.email.trim().toLowerCase() !== email
            ) {
                conflict('Os dados não correspondem ao convite');
            }

            const existingUser = await User.findOne({
                where: { email },
                transaction
            });

            if (existingUser) {
                conflict('Já existe uma conta para este e-mail. Faça login.');
            }

            const user = await User.create({
                nome,
                sobrenome,
                data_nascimento,
                email,
                password_hash: passwordHash,
                status: 'active'
            }, { transaction });

            return {
                id: user.id,
                nome: user.nome,
                sobrenome: user.sobrenome,
                email: user.email,
                status: user.status,
                invitation_pending: true
            };
        });
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            conflict('Já existe uma conta para este e-mail. Faça login.');
        }

        throw error;
    }
}

// =====================================================================================

// Export
module.exports = registerInvitedUserService;