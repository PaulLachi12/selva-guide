import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';

const Guia = sequelize.define('Guia', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'usuarios', key: 'id' } },
  bio: { type: DataTypes.TEXT, allowNull: true },
  especialidad: { type: DataTypes.STRING(150), allowNull: true },
  idiomas: { type: DataTypes.STRING(200), allowNull: true },
  tarifa_hora: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  lat: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
  lng: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
  disponible: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  verificado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { tableName: 'guias' });

export default Guia;