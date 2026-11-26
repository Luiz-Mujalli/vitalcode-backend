// Config
require('dotenv').config();

// =====================================================================================

// Imports - Método login
const jwt = require('jsonwebtoken');
const loginSchema = require('../../validators/auth/loginSchema');
const authService = require('../../services/auth/authService');

// Imports - Método me
const getAuthenticatedUserService = require('../../services/employees/getAuthenticatedUserService');

// ===========================================================================================================

// Método login
exports.login = async (req, res) => {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            error: 'Dados de login inválidos.',
            details: validation.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    try {
        const result = await authService(validation.data);

        if (!result) {
            return res.status(401).json({
                error: 'E-mail ou senha inválidos'
            });
        }

        const token = jwt.sign(
            {},
            process.env.JWT_SECRET,
            {
                subject: String(result.user.id),
                expiresIn: '1h',
                algorithm: 'HS256'
            }
        );

        return res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: result.user,
            memberships: result.memberships
        });

    } catch (error) {
        console.error('Erro ao realizar login: ', error.name);

        return res.status(500).json({
            error: 'Erro interno ao realizar login'
        });
    }
};

// ===========================================================================================================

// Método me
exports.me = async (req, res) => {
    try {
        const result = await getAuthenticatedUserService(
            req.user.id
        );

        if (!result) {
            return res.status(401).json({
                error: 'Usuário não autorizado'
            });
        }

        return res.status(200).json({
            data: result
        });

    } catch (error) {
        console.error('Erro ao consultar usuário autenticado: ', error.name);

        return res.status(500).json({
            error: 'Erro interno ao consultar usuário'
        });
    }
};