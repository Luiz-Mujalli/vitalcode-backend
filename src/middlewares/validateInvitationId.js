// Main Function
function validateInvitationId(req, res, next) {
    const id = req.params.invitationId;

    if (!/^[1-9]\d*$/.test(id) ||
        !Number.isSafeInteger(Number(id)) ||
        Number(id) > 2147483647) {
        return res.status(400).json({
            error: 'ID do convite inválido'
        });
    }

    next();
}

// =====================================================================================

// Export
module.exports = validateInvitationId;