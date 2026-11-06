module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emergency_credentials', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      membership_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'company_memberships',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      token_hash: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
      },

      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'inactive'
      },

      issued_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      revoked_at: {
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
      'emergency_credentials',
      ['membership_id', 'status'],
      {
        name: 'emergency_credentials_membership_status_idx'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('emergency_credentials');
  }
};
