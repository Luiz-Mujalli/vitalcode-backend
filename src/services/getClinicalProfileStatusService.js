// Imports
const User = require('../models/User');
const ClinicalProfile = require('../models/ClinicalProfile');
const isClinicalProfileComplete = require(
    '../utils/isClinicalProfileComplete'
);

// ===============================================================================

// Main Function
async function getClinicalProfileStatusService(userId) {

    const user = await User.findByPk(userId, {
        attributes: ['id', 'status']
    });

    if (!user || user.status !== 'active') {
        const error = new Error('Usuário não está ativo');
        error.statusCode = 403;
        throw error;
    }

    const profile = await ClinicalProfile.findOne({
        where: { user_id: user.id },
        attributes: [
            'alergias',
            'medicamentos',
            'doencas',
            'cirurgias',
            'contato_emergencia_nome',
            'contato_emergencia_telefone'
        ]
    });

    const isComplete = isClinicalProfileComplete(profile);

    return {
        clinical_profile_exists: Boolean(profile),
        clinical_profile_complete: isComplete,
        credential_eligible: isComplete
    };
}

// ===============================================================================

// Export
module.exports = getClinicalProfileStatusService;
