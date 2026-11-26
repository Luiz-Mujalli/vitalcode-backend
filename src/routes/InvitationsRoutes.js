// Import Config
const { Router } = require('express');
const route = Router();

// Import Controller
const InvitationsController = require('../controllers/invitations/InvitationsController');

// Imports Middlewares
const authMiddleware = require('../middlewares/auth/authMiddleware');
const authorizeCompany = require('../middlewares/auth/authorizeCompany');
const validateInvitationId = require('../middlewares/validators/validateInvitationId');

// ====================================================================================

// Rotas POST
route.post(
    '/companies/:companyId/invitations',
    authMiddleware,
    authorizeCompany(['admin']),
    InvitationsController.store
);

route.post(
    '/invitations/register',
    InvitationsController.register
);

route.post(
    '/invitations/accept',
    authMiddleware,
    InvitationsController.accept
);

route.post(
    '/invitations/:invitationId/accept',
    authMiddleware,
    validateInvitationId,
    InvitationsController.acceptById
);

route.post(
    '/invitations/:invitationId/decline',
    authMiddleware,
    validateInvitationId,
    InvitationsController.decline
);

// ====================================================================================

// Rotas GET
route.get(
    '/invitations/my',
    authMiddleware,
    InvitationsController.myInvitations
);

// =====================================================================================

// Export
module.exports = route;