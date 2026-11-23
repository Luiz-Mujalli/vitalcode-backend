// Imports
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
async function updateClinicalProfileService({ userId, data }) {

    const user = await User.findByPk(userId, {
        attributes: ['id', 'status']
    });

    if (!user || user.status !== 'active') {
        httpError(403, 'Usuário não está ativo');
    }

    const profile = await ClinicalProfile.findOne({
        where: { user_id: user.id }
    });

    if (!profile) {
        httpError(404, 'Ficha clínica não encontrada');
    }

    await profile.update(data, {
        fields: Object.keys(data)
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
}

// ===============================================================================

// Export
module.exports = updateClinicalProfileService;
