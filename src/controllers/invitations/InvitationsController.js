// Imports - Método store
const createInvitationSchema = require('../../validators/invitations/createInvitationSchema');
const createInvitationService = require('../../services/invitations/createInvitationService');

// Imports - Método accept
const acceptInvitationSchema = require('../../validators/invitations/acceptInvitationSchema');
const acceptInvitationService = require('../../services/invitations/acceptInvitationService');

// Imports - Método register
const registerInvitedUserSchema = require('../../validators/auth/registerInvitedUserSchema');
const registerInvitedUserService = require('../../services/auth/registerInvitedUserService');

// Imports - Método myInvitations
const listMyInvitationService = require('../../services/invitations/listMyInvitationService');

// Import - Método acceptById
const acceptInvitationByIdService = require('../../services/invitations/acceptInvitationByIdService');

// Import - Método decline
const declineInvitationService = require('../../services/invitations/declineInvitationService');

// ============================================================================================

// Método store
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

        console.error('Erro ao criar convite: ', error.name);

        return res.status(500).json({
            error: 'Erro interno ao criar convite'
        });
    }
};

// ============================================================================================

// Método accept
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

        console.error('Erro ao aceitar convite: ', error.name);

        return res.status(500).json({
            error: 'Erro interno ao aceitar convite'
        });
    }
};

// ============================================================================================

// Método register
exports.register = async (req, res) => {
    const validation = registerInvitedUserSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            error: 'Dados de cadastro inválidos',
            details: validation.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    try {
        const user = await registerInvitedUserService(validation.data);

        return res.status(201).json({
            message: 'Conta criada com sucesso. Faça login para aceitar o convite.',
            data: user
        });

    } catch (error) {
        if ([403, 409].includes(error.statusCode)) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        console.error('Erro ao cadastrar funcionário convidado: ', error.name);

        return res.status(500).json({
            error: 'Erro interno ao cadastrar funcionário'
        });
    }
};

// ============================================================================================

// Método myInvitations
exports.myInvitations = async (req, res) => {
    try {
        const invitations = await listMyInvitationService({
            userId: req.user.id
        });

        return res.status(200).json({
            message: 'Convites consultados com sucesso',
            data: invitations
        });

    } catch (error) {
        if (error.statusCode === 403) {
            return res.status(403).json({
                error: error.message
            });
        }

        console.error('Erro ao listar convites: ', error.name);

        return res.status(500).json({
            error: 'Erro interno ao consultar convites'
        });
    }
};

// ============================================================================================

// Método acceptById
exports.acceptById = async (req, res) => {
    try {
        const result = await acceptInvitationByIdService({
            userId: req.user.id,
            invitationId: Number(req.params.invitationId)
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

        console.error('Erro ao aceitar convite por ID: ', error.name);

        return res.status(500).json({
            error: 'Erro interno ao aceitar convite'
        });
    }
};

// ============================================================================================

// Método decline
exports.decline = async (req, res) => {
    try {
        const result = await declineInvitationService({
            userId: req.user.id,
            invitationId: Number(req.params.invitationId)
        });

        return res.status(200).json({
            message: 'Convite recusado com sucesso',
            data: result
        });
    } catch (error) {
        if ([403, 409].includes(error.statusCode)) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        console.error('Erro ao recustar convite: ', error.name);

        return res.status(500).json({
            error: 'Erro interno ao recusar convite'
        });
    }
};
