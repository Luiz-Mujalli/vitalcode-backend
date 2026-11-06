module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invitations', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      invited_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      token_hash: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
      },

      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'pending'
      },

      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      accepted_at: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex(
      'invitations',
      ['company_id', 'email'],
      {
        name: 'invitations_company_email_idx',
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('invitations');
  }
};
