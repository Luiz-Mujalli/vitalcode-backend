const { Router } = require('express');

const route = Router();

const CompaniesController = require('../controllers/CompaniesController');
const authMiddleware = require('../middlewares/authMiddleware');
// const authorizeCompany = require('../middlewares/authorizeCompany');

route.post('/companies/register', CompaniesController.register);

route.get('/companies/my', authMiddleware, CompaniesController.myCompanies);

module.exports = route;