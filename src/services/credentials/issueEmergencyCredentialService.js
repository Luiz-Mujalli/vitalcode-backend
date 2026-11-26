
// Imports
const { Transaction, Op } = require('sequelize');

const { connection: sequelize } = require('../../database');

const User = require('../../models/User');
const Company = require('../../models/Company');
const CompanyMembership = require('../../models/CompanyMembership');
const ClinicalProfile = require('../../models/ClinicalProfile');
const EmergencyCredential = require('../../models/EmergencyCredential');
const AuditLog = require('../../models/AuditLog');

const isClinicalProfileComplete = require(
    '../../utils/isClinicalProfileComplete'
);

const {
    generateEmergencyToken,
    hashEmergencyToken
} = require('../../utils/emergencyToken');

const generateEmergencyQRCode = require(
    '../../utils/generateEmergencyQRCode'
);

// =====================================================================================

// Constants
const MAX_ACTIVE_CREDENTIALS = 2;

// =====================================================================================

// Error Treatment Function
function httpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}

// =====================================================================================

// Main Function
async function issueEmergencyCredentialService({
    userId,
    companyId
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

            // Validate Clinical Profile
            const profile = await ClinicalProfile.findOne({
                where: {
                    user_id: userId
                },
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!isClinicalProfileComplete(profile)) {
                httpError(409, 'Ficha clínica incompleta');
            }

            // Validate Active Credentials Limit
            const activeCredentialsCount =
                await EmergencyCredential.count({
                    where: {
                        membership_id: membership.id,
                        status: 'active'
                    },
                    transaction
                });

            if (activeCredentialsCount >= MAX_ACTIVE_CREDENTIALS) {
                httpError(
                    409,
                    'Limite de credenciais ativas atingido'
                );
            }

            // Generate Token
            const token = generateEmergencyToken();
            const tokenHash = hashEmergencyToken(token);

            // Generate Emergency QR Code
            const emergencyQRCode = await generateEmergencyQRCode(token);

            // Create Emergency Credential
            const credential = await EmergencyCredential.create({
                membership_id: membership.id,
                token_hash: tokenHash,
                status: 'active',
                issued_at: new Date(),
                revoked_at: null
            }, {
                transaction
            });

            // Register Audit Log
            await AuditLog.create({
                company_id: company.id,
                actor_user_id: user.id,
                target_user_id: user.id,
                action: 'credential.issued',
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
                revoked_at: credential.revoked_at,
                emergency_url: emergencyQRCode.emergency_url,
                qr_code: emergencyQRCode.qr_code
            };
        }
    );
}

// =====================================================================================

// Export
module.exports = issueEmergencyCredentialService;
