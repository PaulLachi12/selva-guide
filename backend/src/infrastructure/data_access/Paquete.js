import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';

const Paquete = sequelize.define('Paquete', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  guia_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'guias', key: 'id' } },
  titulo: { type: DataTypes.STRING(150), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  duracion: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  capacidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  estado: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'activo' }
}, { tableName: 'paquetes' });

export default Paquete;