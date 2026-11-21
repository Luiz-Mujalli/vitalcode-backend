// Imports
const { Model, DataTypes } = require('sequelize');

// =====================================================================================

// Main Class
class AuditLog extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.BIGINT,
                    primaryKey: true,
                    autoIncrement: true
                },

                company_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                },

                actor_user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                },

                target_user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                },

                action: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },

                resource_type: {
                    type: DataTypes.STRING(50),
                    allowNull: false
                },

                resource_id: {
                    type: DataTypes.STRING(64),
                    allowNull: true
                },

                ip_address: {
                    type: DataTypes.STRING(45),
                    allowNull: true
                },

                user_agent: {
                    type: DataTypes.STRING(512),
                    allowNull: true
                },

                metadata: {
                    type: DataTypes.JSON,
                    allowNull: true
                },
            },
            {
                sequelize,
                tableName: 'audit_logs',
                modelName: 'AuditLog',

                timestamps: true,
                createdAt: 'created_at',
                updatedAt: false
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Company, {
            foreignKey: 'company_id',
            as: 'company'
        });

        this.belongsTo(models.User, {
            foreignKey: 'actor_user_id',
            as: 'actor'
        });

        this.belongsTo(models.User, {
            foreignKey: 'target_user_id',
            as: 'target'
        });
    }
}

// =====================================================================================

// Export
module.exports = AuditLog;