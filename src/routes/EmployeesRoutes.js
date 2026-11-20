const { Router } = require('express');

const route = Router();

const EmployeesController = require('../controllers/EmployeesController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeCompany = require('../middlewares/authorizeCompany');

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

module.exports = route;