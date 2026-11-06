const { Model, DataTypes } = require('sequelize');

class Invitation extends Model {
    static init(sequelize) {
        return super.init(
            {
                company_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                invited_by: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                email: {
                    type: DataTypes.STRING(255),
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
                    defaultValue: 'pending'
                },

                expires_at: {
                    type: DataTypes.DATE,
                    allowNull: false
                },

                accepted_at: {
                    type: DataTypes.DATE,
                    allowNull: true
                },
            },
            {
                sequelize,
                tableName: 'invitations',
                modelName: 'Invitation'
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Company, {
            foreignKey: 'company_id',
            as: 'company'
        });

        this.belongsTo(models.User, {
            foreignKey: 'invited_by',
            as: 'inviter'
        });
    }
}

module.exports = Invitation;