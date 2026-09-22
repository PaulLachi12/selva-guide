module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('guias', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      bio: { type: Sequelize.TEXT, allowNull: true },
      especialidad: { type: Sequelize.STRING(150), allowNull: true },
      idiomas: { type: Sequelize.STRING(200), allowNull: true },
      tarifa_hora: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      lat: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
      lng: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
      disponible: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      verificado: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('guias');
  }
};