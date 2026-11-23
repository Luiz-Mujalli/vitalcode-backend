// Imports
const { UniqueConstraintError } = require('sequelize');

const ClinicalProfile = require('../../models/ClinicalProfile');
const User = require('../../models/User');

// ===============================================================================

// Error Treatment Function
function httpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}

// ===============================================================================

// Main Function
async function createClinicalProfileService({
    userId,
    data
}) {
    const user = await User.findByPk(userId, {
        attributes: ['id', 'status']
    });

    if (!user || user.status !== 'active') {
        httpError(403, 'Usuário não está ativo');
    }

    const existingProfile = await ClinicalProfile.findOne({
        where: { user_id: user.id },
        attributes: ['id']
    });

    if (existingProfile) {
        httpError(409, 'Usuário já possui ficha clínica');
    }

    try {
        const profile = await ClinicalProfile.create({
            ...data,
            user_id: user.id
        });

        return {
            id: profile.id,
            user_id: profile.user_id,
            tipo_sanguineo: profile.tipo_sanguineo,
            alergias: profile.alergias,
            medicamentos: profile.medicamentos,
            doencas: profile.doencas,
            cirurgias: profile.cirurgias,
            contato_emergencia_nome: profile.contato_emergencia_nome,
            contato_emergencia_telefone: profile.contato_emergencia_telefone,
            created_at: profile.created_at,
            updated_at: profile.updated_at
        };

    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            httpError(409, 'Usuário já possui ficha clínica');
        }

        throw error;
    }
}

// ===============================================================================

// Export
module.exports = createClinicalProfileService;