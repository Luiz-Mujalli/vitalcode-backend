module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      company_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      actor_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      target_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      action: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      resource_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      resource_id: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },

      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },

      user_agent: {
        type: Sequelize.STRING(512),
        allowNull: true,
      },

      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex(
      'audit_logs',
      ['company_id', 'created_at'],
      {
        name: 'audit_logs_company_created_idx'
      }
    );

    await queryInterface.addIndex(
      'audit_logs',
      ['actor_user_id', 'created_at'],
      {
        name: 'audit_logs_actor_created_idx'
      }
    );

    await queryInterface.addIndex(
      'audit_logs',
      ['target_user_id', 'created_at'],
      {
        name: 'audit_logs_target_created_idx'
      }
    );

    await queryInterface.addIndex(
      'audit_logs',
      ['resource_type', 'resource_id'],
      {
        name: 'audit_logs_resource_idx'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('audit_logs');
  }
};
