// Imports
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// Imports - Config
const corsConfig = require('./config/corsConfig');

// Import - Middlewares
const apiRateLimiter = require('./middlewares/rateLimit/apiRateLimiter');
const notFoundMiddleware = require('./middlewares/errors/notFoundMiddleware');
const errorMiddleware = require('./middlewares/errors/errorMiddleware');

// Import - Routes
const HealthRoutes = require('./routes/HealthRoutes');
const CompaniesRoutes = require('./routes/CompaniesRoutes');
const AuthRoutes = require('./routes/AuthRoutes');
const EmployeesRoutes = require('./routes/EmployeesRoutes');
const InvitationsRoutes = require('./routes/InvitationsRoutes');
const ClinicalProfilesRoutes = require('./routes/ClinicalProfilesRoutes');
const CredentialsRoutes = require('./routes/CredentialsRoutes');
const EmergencyRoutes = require('./routes/EmergencyRoutes');

// =====================================================================================

// App
const app = express();

// =====================================================================================

// Security Middlewares
app.disable('x-powered-by');

app.use(helmet());
app.use(cors(corsConfig));
app.use(apiRateLimiter);

// =====================================================================================

// Request Body Middlewares
app.use(express.urlencoded({
    extended: true,
    limit: '100kb'
}));

app.use(express.json({
    limit: '100kb'
}));

// =====================================================================================

// Routes
app.use(HealthRoutes);
app.use(CompaniesRoutes);
app.use(AuthRoutes);
app.use(EmployeesRoutes);
app.use(InvitationsRoutes);
app.use(ClinicalProfilesRoutes);
app.use(CredentialsRoutes);
app.use(EmergencyRoutes);

// =====================================================================================

// Error Treatment Middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// =====================================================================================

// Export
module.exports = app;