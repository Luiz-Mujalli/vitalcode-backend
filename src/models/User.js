const { Model, DataTypes } = require('sequelize');

class User extends Model {
    static init(sequelize) {
        return super.init(
            {
                nome: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },

                sobrenome: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },

                data_nascimento: {
                    type: DataTypes.DATEONLY,
                    allowNull: false
                },

                email: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: true
                },

                password_hash: {
                    type: DataTypes.STRING(255),
                    allowNull: false
                },

                foto_key: {
                    type: DataTypes.STRING(255),
                    allowNull: true
                },

                status: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    defaultValue: 'pending'
                }
            },
            {
                sequelize,
                tableName: 'users',
                modelName: 'User'
            }
        );
    }

    static associate(models) {
        this.hasMany(models.CompanyMembership, {
            foreignKey: 'user_id',
            as: 'memberships'
        });

        this.hasOne(models.ClinicalProfile, {
            foreignKey: 'user_id',
            as: 'clinicalProfile'
        });

        this.hasMany(models.Invitation, {
            foreignKey: 'invited_by',
            as: 'sentInvitations'
        });

        this.hasMany(models.AuditLog, {
            foreignKey: 'actor_user_id',
            as: 'performedAuditLogs'
        });

        this.hasMany(models.AuditLog, {
            foreignKey: 'target_user_id',
            as: 'targetedAuditLogs'
        });
    }
}

module.exports = User;