const { Router } = require('express');

const route = Router();

const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/authMiddleware');


route.post('/auth/login', AuthController.login)

route.get('/auth/me', authMiddleware, AuthController.me);

module.exports = route;