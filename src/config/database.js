
// Imports
require('dotenv').config();

// =====================================================================================

// Database Configuration
module.exports = {
    dialect: 'mariadb',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,

    // Disable SQL Logging
    logging: false,

    // Models Configuration
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },

    // Dialect Configuration
    dialectOptions: {
        timezone: 'America/Sao_Paulo',
    },

    timezone: 'America/Sao_Paulo',
};
