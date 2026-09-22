import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';

const Mensaje = sequelize.define('Mensaje', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  emisor_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'usuarios', key: 'id' } },
  receptor_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'usuarios', key: 'id' } },
  reserva_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'reservas', key: 'id' } },
  contenido: { type: DataTypes.TEXT, allowNull: false },
  leido: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { tableName: 'mensajes' });

export default Mensaje;