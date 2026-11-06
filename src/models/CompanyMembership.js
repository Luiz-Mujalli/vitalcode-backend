const { Model, DataTypes } = require('sequelize');

class CompanyMembership extends Model {
    static init(sequelize) {
        return super.init(
            {
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                company_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                cargo: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },

                role: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    defaultValue: 'employee'
                },

                status: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    defaultValue: 'active'
                }
            },
            {
                sequelize,
                tableName: 'company_memberships',
                modelName: 'CompanyMembership'
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

        this.belongsTo(models.Company, {
            foreignKey: 'company_id',
            as: 'company'
        });

        this.hasMany(models.EmergencyCredential, {
            foreignKey: 'membership_id',
            as: 'credentials'
        });
    }
}

module.exports = CompanyMembership;