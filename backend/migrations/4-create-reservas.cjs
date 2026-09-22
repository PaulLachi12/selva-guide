module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reservas', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      turista_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      paquete_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'paquetes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fecha_hora: { type: Sequelize.DATE, allowNull: false },
      personas: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      estado: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'pendiente' },
      lat_origen: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
      lng_origen: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('reservas');
  }
};