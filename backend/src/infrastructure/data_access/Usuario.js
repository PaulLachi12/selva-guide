import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  nombre: { type: DataTypes.STRING(120), allowNull: false },
  telefono: { type: DataTypes.STRING(20), allowNull: true },
  foto: { type: DataTypes.STRING(255), allowNull: true },
  rol: { type: DataTypes.ENUM('turista', 'guia', 'admin'), allowNull: false, defaultValue: 'turista' }
}, { tableName: 'usuarios' });

export default Usuario;