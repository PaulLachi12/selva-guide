module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      email: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      nombre: { type: Sequelize.STRING(120), allowNull: false },
      telefono: { type: Sequelize.STRING(20), allowNull: true },
      foto: { type: Sequelize.STRING(255), allowNull: true },
      rol: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'turista' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('usuarios');
  }
};