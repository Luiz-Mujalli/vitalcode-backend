// Import Config
const { Router } = require('express');
const route = Router();

// Import Controller
const InvitationsController = require('../controllers/invitations/InvitationsController');

// Imports Middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeCompany = require('../middlewares/authorizeCompany');
const validateInvitationId = require('../middlewares/validateInvitationId');

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