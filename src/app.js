// IMPORTS
const express = require('express');
const app = express();
const HealthRoutes = require('./routes/HealthRoutes');
const CompaniesRoutes = require('./routes/CompaniesRoutes');
const AuthRoutes = require('./routes/AuthRoutes');
const EmployeesRoutes = require('./routes/EmployeesRoutes');
const InvitationsRoutes = require('./routes/InvitationsRoutes');

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROTAS
app.use(HealthRoutes);
app.use(CompaniesRoutes);
app.use(AuthRoutes);
app.use(EmployeesRoutes);
app.use(InvitationsRoutes);

module.exports = app;