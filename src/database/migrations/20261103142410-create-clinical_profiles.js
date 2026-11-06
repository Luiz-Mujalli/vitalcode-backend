module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clinical_profiles', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      tipo_sanguineo: {
        type: Sequelize.STRING(3),
        allowNull: true,
      },

      alergias: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      medicamentos: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      doencas: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      cirurgias: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      contato_emergencia_nome: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      contato_emergencia_telefone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('clinical_profiles');
  }
};
