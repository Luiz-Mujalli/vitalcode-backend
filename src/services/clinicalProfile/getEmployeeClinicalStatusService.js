// Imports
const CompanyMembership = require(
    '../../models/CompanyMembership'
);

const ClinicalProfile = require(
    '../../models/ClinicalProfile'
);

const isClinicalProfileComplete = require(
    '../../utils/isClinicalProfileComplete'
);

// ===============================================================================

// Error Treatment Function
function httpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}

// ===============================================================================

// Main Function
async function getEmployeeClinicalStatusService({
    employeeId,
    companyId
}) {
    const parsedEmployeeId = Number(employeeId);

    if (
        !Number.isSafeInteger(parsedEmployeeId) ||
        parsedEmployeeId <= 0
    ) {
        httpError(400, 'Identificador do funcionário inválido');
    }

    const membership = await CompanyMembership.findOne({
        where: {
            user_id: parsedEmployeeId,
            company_id: companyId,
            role: 'employee',
            status: 'active'
        },
        attributes: ['user_id']
    });

    if (!membership) {
        httpError(404, 'Funcionário não encontrado');
    }

    const profile = await ClinicalProfile.findOne({
        where: {
            user_id: parsedEmployeeId
        },
        attributes: [
            'alergias',
            'medicamentos',
            'doencas',
            'cirurgias',
            'contato_emergencia_nome',
            'contato_emergencia_telefone'
        ]
    });

    return {
        employee_id: parsedEmployeeId,
        clinical_profile_complete:
            isClinicalProfileComplete(profile)
    };
}

// ===============================================================================

// Export
module.exports = getEmployeeClinicalStatusService;
