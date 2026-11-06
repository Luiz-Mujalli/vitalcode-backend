const { Model, DataTypes } = require('sequelize');

class ClinicalProfile extends Model {
    static init(sequelize) {
        return super.init(
            {
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    unique: true
                },

                tipo_sanguineo: {
                    type: DataTypes.STRING(3),
                    allowNull: true
                },

                alergias: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },

                medicamentos: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                doencas: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                cirurgias: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },

                contato_emergencia_nome: {
                    type: DataTypes.STRING(150),
                    allowNull: true
                },

                contato_emergencia_telefone: {
                    type: DataTypes.STRING(20),
                    allowNull: true
                },
            },
            {
                sequelize,
                tableName: 'clinical_profiles',
                modelName: 'ClinicalProfile'
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    }
}

module.exports = ClinicalProfile;