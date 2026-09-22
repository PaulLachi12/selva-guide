module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('paquetes', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      guia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'guias', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      titulo: { type: Sequelize.STRING(150), allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      duracion: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      precio: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      capacidad: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      estado: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'activo' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('paquetes');
  }
};