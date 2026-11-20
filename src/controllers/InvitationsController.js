const createInvitationSchema = require('../validators/createInvitationSchema');
const createInvitationService = require('../services/createInvitationService');
const acceptInvitationSchema = require('../validators/acceptInvitationSchema');
const acceptInvitationService = require('../services/acceptInvitationService');

exports.store = async (req, res) => {
    const validation = createInvitationSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            error: 'Dados do convite inválidos',
            details: validation.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    try {
        const invitation = await createInvitationService({
            companyId: req.company.id,
            invitedBy: req.user.id,
            ...validation.data
        });

        return res.status(201).json({
            message: 'Convite criado com sucesso',
            data: invitation
        });

    } catch (error) {
        if ([403, 409].includes(error.statusCode)) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        console.error('Erro ao criar convite: ', error);

        return res.status(500).json({
            error: 'Erro interno ao criar convite'
        });
    }
};

exports.accept = async (req, res) => {
    const validation = acceptInvitationSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            error: 'Dados de aceitação inválidos',
            details: validation.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    try {
        const result = await acceptInvitationService({
            userId: req.user.id,
            token: validation.data.token
        });

        return res.status(200).json({
            message: 'Convite aceito com sucesso',
            data: result
        });

    } catch (error) {
        if ([403, 409].includes(error.statusCode)) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        console.error('Erro ao aceitar convite: ', error);

        return res.status(500).json({
            error: 'Erro interno ao aceitar convite'
        });
    }
};