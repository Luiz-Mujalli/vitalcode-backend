// Imports
const { Transaction, Op } = require('sequelize');

const { connection: sequelize } = require('../../database');

const User = require('../../models/User');
const Company = require('../../models/Company');
const CompanyMembership = require('../../models/CompanyMembership');
const EmergencyCredential = require('../../models/EmergencyCredential');
const AuditLog = require('../../models/AuditLog');

// =====================================================================================

// Error Treatment Function
function httpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}

// =====================================================================================

// Main Function
async function revokeEmergencyCredentialService({
    userId,
    companyId,
    credentialId
}) {
    return sequelize.transaction(
        {
            isolationLevel:
                Transaction.ISOLATION_LEVELS.READ_COMMITTED
        },
        async transaction => {

            // Validate Company
            const company = await Company.findByPk(companyId, {
                attributes: ['id', 'status'],
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!company || company.status !== 'active') {
                httpError(403, 'Empresa não está ativa');
            }

            // Validate User
            const user = await User.findByPk(userId, {
                attributes: ['id', 'status'],
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!user || user.status !== 'active') {
                httpError(403, 'Usuário não está ativo');
            }

            // Validate Membership
            const membership = await CompanyMembership.findOne({
                where: {
                    user_id: userId,
                    company_id: companyId,
                    role: {
                        [Op.in]: ['admin', 'employee']
                    },
                    status: 'active'
                },
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!membership) {
                httpError(403, 'Vínculo empresarial inválido');
            }

            // Find Credential
            const credential = await EmergencyCredential.findOne({
                where: {
                    id: credentialId,
                    membership_id: membership.id
                },
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!credential) {
                httpError(404, 'Credencial não encontrada');
            }

            // Validate Credential Status
            if (credential.status !== 'active') {
                httpError(409, 'Credencial não está ativa');
            }

            // Revoke Credential
            await credential.update({
                status: 'revoked',
                revoked_at: new Date()
            }, {
                transaction
            });

            // Register Audit Log
            await AuditLog.create({
                company_id: company.id,
                actor_user_id: user.id,
                target_user_id: user.id,
                action: 'credential.revoked',
                resource_type: 'emergency_credential',
                resource_id: String(credential.id)
            }, {
                transaction
            });

            // Return Credential
            return {
                id: credential.id,
                membership_id: credential.membership_id,
                status: credential.status,
                issued_at: credential.issued_at,
                revoked_at: credential.revoked_at
            };
        }
    );
}

// =====================================================================================

// Export
module.exports = revokeEmergencyCredentialService;
