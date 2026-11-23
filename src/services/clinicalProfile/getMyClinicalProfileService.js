// Imports
const ClinicalProfile = require('../../models/ClinicalProfile');
const User = require('../../models/User');

// ===============================================================================

// Main Function
async function getMyClinicalProfileService(userId) {

    const user = await User.findByPk(userId, {
        attributes: ['id', 'status']
    });

    if (!user || user.status !== 'active') {
        const error = new Error('Usuário não está ativo');
        error.statusCode = 403;
        throw error;
    }

    const profile = await ClinicalProfile.findOne({
        where: {
            user_id: user.id
        },
        attributes: [
            'id',
            'user_id',
            'tipo_sanguineo',
            'alergias',
            'medicamentos',
            'doencas',
            'cirurgias',
            'contato_emergencia_nome',
            'contato_emergencia_telefone',
            'created_at',
            'updated_at'
        ]
    });

    if (!profile) {
        const error = new Error('Ficha clínica não encontrada');
        error.statusCode = 404;
        throw error;
    }

    return profile;
}

// ===============================================================================

// Export
module.exports = getMyClinicalProfileService;
