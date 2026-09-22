import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';

const Tracking = sequelize.define('Tracking', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reserva_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'reservas', key: 'id' } },
  lat: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
  lng: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
  timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { tableName: 'tracking' });

export default Tracking;