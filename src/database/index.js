const { Sequelize } = require('sequelize');

const databaseConfig = require('../config/database');
const Company = require('../models/Company');
const User = require('../models/User');
const CompanyMembership = require('../models/CompanyMembership');
const ClinicalProfile = require('../models/ClinicalProfile');
const Invitation = require('../models/Invitation');
const EmergencyCredential = require('../models/EmergencyCredential');
const AuditLog = require('../models/AuditLog');

const models = [
    Company,
    User,
    CompanyMembership,
    ClinicalProfile,
    Invitation,
    EmergencyCredential,
    AuditLog
];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models.forEach(model => {
            model.init(this.connection);
        });

        models
            .filter(model => typeof model.associate === 'function')
            .forEach(model => model.associate(this.connection.models));
    }

    async authenticate() {
        await this.connection.authenticate();
    }
}

module.exports = new Database();