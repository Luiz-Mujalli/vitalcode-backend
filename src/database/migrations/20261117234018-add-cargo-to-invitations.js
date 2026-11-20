module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('invitations', 'cargo', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('invitations', 'cargo');
  }
};
