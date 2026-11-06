module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('company_memberships', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      cargo: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      role: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'employee'
      },

      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'active'
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });

    await queryInterface.addIndex(
      'company_memberships',
      ['user_id', 'company_id'],
      {
        unique: true,
        name: 'company_memberships_user_company_unique',
      }
    );

    await queryInterface.addIndex(
      'company_memberships',
      ['company_id', 'status'],
      {
        name: 'company_memberships_company_status_idx',
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('company_memberships');
  }
};
