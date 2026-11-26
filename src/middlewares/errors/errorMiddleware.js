// Main Function
function errorMiddleware(error, req, res, next) {

    // Validate Response Status
    if (res.headersSent) {
        return next(error);
    }

    // Handle Invalid JSON
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({
            error: 'JSON inválido'
        });
    }

    // Handle Request Body Limit
    if (error.type === 'entity.too.large') {
        return res.status(413).json({
            error: 'Corpo da requisição excede o limite permitido'
        });
    }

    // Handle Invalid URL Parameters
    if (error instanceof URIError) {
        return res.status(400).json({
            error: 'Parâmetros da URL inválidos'
        });
    }

    // Register Unexpected Error
    console.error(
        'Unexpected API error:',
        error.name
    );

    // Return Internal Server Error
    return res.status(500).json({
        error: 'Erro interno do servidor'
    });
}

// =====================================================================================

// Export
module.exports = errorMiddleware;
