
// Imports
const { Transaction } = require('sequelize');

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
async function deactivateEmployeeService({
    actorUserId,
    companyId,
    employeeId
}) {

    // Validate Employee ID
    if (!Number.isSafeInteger(employeeId) || employeeId <= 0) {
        httpError(400, 'Identificador do funcionário inválido');
    }

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

            // Validate Administrator
            const actor = await User.findByPk(actorUserId, {
                attributes: ['id', 'status'],
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!actor || actor.status !== 'active') {
                httpError(403, 'Usuário não está ativo');
            }

            // Validate Administrator Membership
            const adminMembership = await CompanyMembership.findOne({
                where: {
                    user_id: actorUserId,
                    company_id: companyId,
                    role: 'admin',
                    status: 'active'
                },
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!adminMembership) {
                httpError(403, 'Permissão insuficiente');
            }

            // Find Employee Membership
            const employeeMembership = await CompanyMembership.findOne({
                where: {
                    user_id: employeeId,
                    company_id: companyId,
                    role: 'employee'
                },
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!employeeMembership) {
                httpError(
                    404,
                    'Funcionário não encontrado nesta empresa'
                );
            }

            // Validate Membership Status
            if (employeeMembership.status !== 'active') {
                httpError(409, 'Vínculo empresarial não está ativo');
            }

            // Find Active Credentials
            const activeCredentials = await EmergencyCredential.findAll({
                where: {
                    membership_id: employeeMembership.id,
                    status: 'active'
                },
                attributes: ['id'],
                order: [['id', 'ASC']],
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            // Deactivate Employee Membership
            await employeeMembership.update({
                status: 'inactive'
            }, {
                transaction
            });

            // Revoke Active Credentials
            const revokedAt = new Date();

            await EmergencyCredential.update({
                status: 'revoked',
                revoked_at: revokedAt
            }, {
                where: {
                    membership_id: employeeMembership.id,
                    status: 'active'
                },
                transaction
            });

            // Register Membership Audit Log
            await AuditLog.create({
                company_id: companyId,
                actor_user_id: actorUserId,
                target_user_id: employeeId,
                action: 'membership.deactivated',
                resource_type: 'company_membership',
                resource_id: String(employeeMembership.id),
                metadata: {
                    revoked_credentials_count: activeCredentials.length
                }
            }, {
                transaction
            });

            // Register Credentials Audit Logs
            if (activeCredentials.length > 0) {

                const auditLogs = activeCredentials.map(credential => ({
                    company_id: companyId,
                    actor_user_id: actorUserId,
                    target_user_id: employeeId,
                    action: 'credential.revoked',
                    resource_type: 'emergency_credential',
                    resource_id: String(credential.id),
                    metadata: {
                        reason: 'membership_deactivated'
                    }
                }));

                await AuditLog.bulkCreate(auditLogs, {
                    transaction
                });
            }

            // Return Deactivated Membership
            return {
                employee_id: employeeId,
                membership_id: employeeMembership.id,
                status: employeeMembership.status,
                revoked_credentials_count: activeCredentials.length
            };
        }
    );
}

// =====================================================================================

// Export
module.exports = deactivateEmployeeService;
