// Main Function
function notFoundMiddleware(req, res) {

    return res.status(404).json({
        error: 'Rota não encontrada'
    });
}

// =====================================================================================

// Export
module.exports = notFoundMiddleware;
