// Imports
const express = require('express');
const app = express();
const HealthRoutes = require('./routes/HealthRoutes');
const CompaniesRoutes = require('./routes/CompaniesRoutes');
const AuthRoutes = require('./routes/AuthRoutes');
const EmployeesRoutes = require('./routes/EmployeesRoutes');
const InvitationsRoutes = require('./routes/InvitationsRoutes');

// =====================================================================================


// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// =====================================================================================

// Routes
app.use(HealthRoutes);
app.use(CompaniesRoutes);
app.use(AuthRoutes);
app.use(EmployeesRoutes);
app.use(InvitationsRoutes);

// =====================================================================================

// Export
module.exports = app;