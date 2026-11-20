const { Router } = require('express');

const route = Router();

const InvitationsController = require('../controllers/InvitationsController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeCompany = require('../middlewares/authorizeCompany');

route.post(
    '/companies/:companyId/invitations',
    authMiddleware,
    authorizeCompany(['admin']),
    InvitationsController.store
);

route.post(
    '/invitations/accept',
    authMiddleware,
    InvitationsController.accept
);

module.exports = route;