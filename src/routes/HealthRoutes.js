const { Router } = require('express');
const route = Router();
const HealthController = require('../controllers/HealthController');

route.get('/health', HealthController.index);

module.exports = route;