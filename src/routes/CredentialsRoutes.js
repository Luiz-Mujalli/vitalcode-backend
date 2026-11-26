// Imports
const { Router } = require('express');

// Import Controller
const CredentialsController = require(
    '../controllers/credentials/CredentialsController'
);

// Import Middlewares
const authMiddleware = require('../middlewares/auth/authMiddleware');
const authorizeCompany = require('../middlewares/auth/authorizeCompany');
const validateCredentialId = require('../middlewares/validators/validateCredentialId');

// =====================================================================================

// Router
const router = new Router();

// =====================================================================================

// Credentials Routes POST
router.post(
    '/companies/:companyId/credentials',
    authMiddleware,
    authorizeCompany(['admin', 'employee']),
    CredentialsController.store
);

// Credentials Routes GET
router.get(
    '/companies/:companyId/credentials',
    authMiddleware,
    authorizeCompany(['admin', 'employee']),
    CredentialsController.index
);

// Credentials Routes PATCH
router.patch(
    '/companies/:companyId/credentials/:credentialId/revoke',
    authMiddleware,
    authorizeCompany(['admin', 'employee']),
    validateCredentialId,
    CredentialsController.revoke
);

// =====================================================================================

// Export
module.exports = router;
