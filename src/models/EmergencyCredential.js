const { Model, DataTypes } = require('sequelize');

class EmergencyCredential extends Model {
    static init(sequelize) {
        return super.init(
            {
                membership_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                token_hash: {
                    type: DataTypes.STRING(64),
                    allowNull: false,
                    unique: true
                },

                status: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    defaultValue: 'inactive'
                },

                issued_at: {
                    type: DataTypes.DATE,
                    allowNull: false
                },

                revoked_at: {
                    type: DataTypes.DATE,
                    allowNull: true
                },
            },
            {
                sequelize,
                tableName: 'emergency_credentials',
                modelName: 'EmergencyCredential'
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.CompanyMembership, {
            foreignKey: 'membership_id',
            as: 'membership'
        });
    }
}

module.exports = EmergencyCredential;