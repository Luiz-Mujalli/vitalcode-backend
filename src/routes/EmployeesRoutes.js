// Import Config
const { Router } = require('express');
const route = Router();

// Import Controller
const EmployeesController = require('../controllers/employees/EmployeesController');

// Imports Middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeCompany = require('../middlewares/authorizeCompany');

// ==================================================================================

// Rotas GET
route.get('/companies/:companyId/employees',
    authMiddleware,
    authorizeCompany(['admin']),
    EmployeesController.index
);

route.get('/companies/:companyId/employees/:employeeId',
    authMiddleware,
    authorizeCompany(['admin']),
    EmployeesController.show
);

route.get(
    '/companies/:companyId/employees/:employeeId/clinical-status',
    authMiddleware,
    authorizeCompany(['admin']),
    EmployeesController.clinicalStatus
);

// =====================================================================================

// Export
module.exports = route;