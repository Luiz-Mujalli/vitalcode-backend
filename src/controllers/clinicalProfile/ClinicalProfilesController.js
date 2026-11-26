// Imports
// Imports Método Store
const {
    createClinicalProfileSchema
} = require('../../validators/clinicalProfile/createClinicalProfileSchema');

const createClinicalProfileService = require(
    '../../services/clinicalProfile/createClinicalProfileService'
);

// Imports Método Show
const getMyClinicalProfileService = require(
    '../../services/clinicalProfile/getMyClinicalProfileService'
);

// Imports Método Update
const {
    updateClinicalProfileSchema
} = require('../../validators/clinicalProfile/createClinicalProfileSchema');

const updateClinicalProfileService = require(
    '../../services/clinicalProfile/updateClinicalProfileService'
);

// Imports Método Status
const getClinicalProfileStatusService = require(
    '../../services/clinicalProfile/getClinicalProfileStatusService'
);

// ===============================================================================

// Método Store
exports.store = async (req, res) => {

    const validation = createClinicalProfileSchema.safeParse(
        req.body
    );

    if (!validation.success) {
        return res.status(400).json({
            error: 'Dados da ficha clínica inválidos',
            details: validation.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    try {
        const profile = await createClinicalProfileService({
            userId: req.user.id,
            data: validation.data
        });

        return res.status(201).json({
            message: 'Ficha clínica criada com sucesso',
            data: profile
        });

    } catch (error) {

        if ([403, 409].includes(error.statusCode)) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        console.error(
            'Erro ao criar ficha clínica:',
            error.name
        );

        return res.status(500).json({
            error: 'Erro interno ao criar ficha clínica'
        });
    }
};

// ===============================================================================

// Método Show
exports.show = async (req, res) => {
    try {
        const profile = await getMyClinicalProfileService(
            req.user.id
        );

        return res.status(200).json({
            data: profile
        });

    } catch (error) {
        if ([403, 404].includes(error.statusCode)) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        console.error(
            'Erro ao consultar ficha clínica:',
            error.name
        );

        return res.status(500).json({
            error: 'Erro interno ao consultar ficha clínica'
        });
    }
};

// ===============================================================================

// Método Update
exports.update = async (req, res) => {

    const validation = updateClinicalProfileSchema.safeParse(
        req.body
    );

    if (!validation.success) {
        return res.status(400).json({
            error: 'Dados da ficha clínica inválidos',
            details: validation.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    try {
        const profile = await updateClinicalProfileService({
            userId: req.user.id,
            data: validation.data
        });

        return res.status(200).json({
            message: 'Ficha clínica atualizada com sucesso',
            data: profile
        });

    } catch (error) {

        if ([403, 404].includes(error.statusCode)) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        console.error(
            'Erro ao atualizar ficha clínica:',
            error.name
        );

        return res.status(500).json({
            error: 'Erro interno ao atualizar ficha clínica'
        });
    }
};

// ===============================================================================

// Método Status
exports.status = async (req, res) => {
    try {
        const status = await getClinicalProfileStatusService(
            req.user.id
        );

        return res.status(200).json({
            data: status
        });

    } catch (error) {

        if (error.statusCode === 403) {
            return res.status(403).json({
                error: error.message
            });
        }

        console.error(
            'Erro ao consultar status da ficha clínica:',
            error.name
        );

        return res.status(500).json({
            error: 'Erro interno ao consultar status da ficha clínica'
        });
    }
};
