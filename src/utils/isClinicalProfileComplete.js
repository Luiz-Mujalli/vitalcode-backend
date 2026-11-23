const requiredFields = [
    'alergias',
    'medicamentos',
    'doencas',
    'cirurgias',
    'contato_emergencia_nome',
    'contato_emergencia_telefone'
];

function isClinicalProfileComplete(profile) {
    if (!profile) {
        return false;
    }

    return requiredFields.every(field => {
        const value = profile[field];

        return (
            typeof value === 'string' &&
            value.trim().length > 0
        );
    });
}

module.exports = isClinicalProfileComplete;
