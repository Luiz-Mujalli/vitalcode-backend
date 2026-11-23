// Import Config
const { Router } = require('express');
const route = Router();


// Import Controller
const ClinicalProfilesController = require(
    '../controllers/clinicalProfile/ClinicalProfilesController'
);


// Import Middlewares
const authMiddleware = require(
    '../middlewares/authMiddleware'
);

// =====================================================================================

// Rotas POST
route.post(
    '/clinical-profile/me',
    authMiddleware,
    ClinicalProfilesController.store
);

// =====================================================================================

// Rotas GET
route.get(
    '/clinical-profile/me',
    authMiddleware,
    ClinicalProfilesController.show
);

route.get(
    '/clinical-profile/me/status',
    authMiddleware,
    ClinicalProfilesController.status
);

// =====================================================================================

// Rotas PATCH
route.patch(
    '/clinical-profile/me',
    authMiddleware,
    ClinicalProfilesController.update
);

// =====================================================================================

// Export
module.exports = route;
