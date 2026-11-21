// Imports
const { Model, DataTypes } = require('sequelize');

// =====================================================================================

// Main Class
class Company extends Model {
    static init(sequelize) {
        return super.init(
            {
                nome: {
                    type: DataTypes.STRING(150),
                    allowNull: false,
                },
                cnpj: {
                    type: DataTypes.STRING(14),
                    allowNull: false,
                    unique: true
                },
                status: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    defaultValue: 'pending'
                }
            },
            {
                sequelize,
                tableName: 'companies',
                modelName: 'Company'
            }
        );
    }

    static associate(models) {
        this.hasMany(models.CompanyMembership, {
            foreignKey: 'company_id',
            as: 'memberships'
        });

        this.hasMany(models.Invitation, {
            foreignKey: 'company_id',
            as: 'invitations'
        });

        this.hasMany(models.AuditLog, {
            foreignKey: 'company_id',
            as: 'auditLogs'
        });
    }
}

// =====================================================================================

// Export
module.exports = Company;