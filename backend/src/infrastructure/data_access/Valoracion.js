import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';

const Valoracion = sequelize.define('Valoracion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  turista_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'usuarios', key: 'id' } },
  guia_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'guias', key: 'id' } },
  reserva_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'reservas', key: 'id' } },
  estrellas: { type: DataTypes.INTEGER, allowNull: false },
  comentario: { type: DataTypes.TEXT, allowNull: true }
}, { tableName: 'valoraciones' });

export default Valoracion;