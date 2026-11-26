// Imports - Método show
const getEmergencyInformationService = require(
    '../../services/credentials/getEmergencyInformationService'
);

// =====================================================================================

// Método show
exports.show = async (req, res) => {
    try {
        const emergencyInformation =
            await getEmergencyInformationService({
                token: req.emergencyToken
            });

        return res.status(200).json({
            data: emergencyInformation
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        console.error(
            'Error retrieving emergency information:',
            error.name
        );

        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
};
