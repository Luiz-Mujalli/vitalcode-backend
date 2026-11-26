
// Imports - Método store
const issueEmergencyCredentialService = require(
    '../../services/credentials/issueEmergencyCredentialService'
);

// Imports - Método index
const listMyCredentialsService = require(
    '../../services/credentials/listMyCredentialsService'
);

// Imports - Método revoke
const revokeEmergencyCredentialService = require(
    '../../services/credentials/revokeEmergencyCredentialService'
);

// =====================================================================================

// Método store
exports.store = async (req, res) => {
    try {
        const credential = await issueEmergencyCredentialService({
            userId: req.user.id,
            companyId: req.company.id
        });

        res.set('Cache-Control', 'no-store');

        return res.status(201).json({
            data: credential
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        console.error('Error issuing emergency credential:', error.name);

        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
};

// =====================================================================================

// Método index
exports.index = async (req, res) => {
    try {
        const credentials = await listMyCredentialsService({
            userId: req.user.id,
            companyId: req.company.id
        });

        res.set('Cache-Control', 'no-store');

        return res.status(200).json({
            data: credentials
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        console.error('Error listing credentials:', error.name);

        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
};

// =====================================================================================

// Método revoke
exports.revoke = async (req, res) => {
    try {
        const credential = await revokeEmergencyCredentialService({
            userId: req.user.id,
            companyId: req.company.id,
            credentialId: req.credentialId
        });

        res.set('Cache-Control', 'no-store');

        return res.status(200).json({
            data: credential
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        console.error('Error revoking credential:', error.name);

        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
};
