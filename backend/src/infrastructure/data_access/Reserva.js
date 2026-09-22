import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';

const Reserva = sequelize.define('Reserva', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  turista_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'usuarios', key: 'id' } },
  paquete_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'paquetes', key: 'id' } },
  fecha_hora: { type: DataTypes.DATE, allowNull: false },
  personas: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  estado: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'pendiente' },
  lat_origen: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
  lng_origen: { type: DataTypes.DECIMAL(10, 7), allowNull: true }
}, { tableName: 'reservas' });

export default Reserva;