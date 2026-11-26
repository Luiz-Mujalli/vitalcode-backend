// Imports
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// =====================================================================================

// Main Function
async function authMiddleware(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            error: 'Token de autenticação não informado'
        });
    }

    const [scheme, token, extra] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token || extra) {
        return res.status(401).json({
            error: 'Formato de autenticação inválido'
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ['HS256'] }
        );

        const userId = Number(decoded.sub);

        if (!Number.isSafeInteger(userId) || userId <= 0) {
            return res.status(401).json({
                error: 'Token Inválido'
            });
        }

        const user = await User.findByPk(userId);

        if (!user || user.status !== 'active') {
            return res.status(401).json({
                error: 'Usuário não autorizado'
            });
        }

        req.user = {
            id: user.id,
            email: user.email
        };

        return next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: 'Token inválido ou expirado'
            });
        }

        console.error('Erro no middleware de autenticação: ', error.name);

        return res.status(500).json({
            error: 'Erro interno de autenticação'
        });
    }
}

// =====================================================================================

// Export
module.exports = authMiddleware;