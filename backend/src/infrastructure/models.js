import sequelize from './config/dataBase.js';
import Usuario from './data_access/Usuario.js';
import Guia from './data_access/Guia.js';
import Paquete from './data_access/Paquete.js';
import Reserva from './data_access/Reserva.js';
import Tracking from './data_access/Tracking.js';
import Valoracion from './data_access/Valoracion.js';
import Mensaje from './data_access/Mensaje.js';

// Usuario 1:1 Guia
Usuario.hasOne(Guia, { foreignKey: 'usuario_id', as: 'guia' });
Guia.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Guia 1:N Paquetes
Guia.hasMany(Paquete, { foreignKey: 'guia_id', as: 'paquetes' });
Paquete.belongsTo(Guia, { foreignKey: 'guia_id', as: 'guia' });

// Paquete 1:N Reservas
Paquete.hasMany(Reserva, { foreignKey: 'paquete_id', as: 'reservas' });
Reserva.belongsTo(Paquete, { foreignKey: 'paquete_id', as: 'paquete' });

// Turista (Usuario) 1:N Reservas
Usuario.hasMany(Reserva, { foreignKey: 'turista_id', as: 'reservas' });
Reserva.belongsTo(Usuario, { foreignKey: 'turista_id', as: 'turista' });

// Reserva 1:N Trackings
Reserva.hasMany(Tracking, { foreignKey: 'reserva_id', as: 'tracking' });
Tracking.belongsTo(Reserva, { foreignKey: 'reserva_id', as: 'reserva' });

// Valoraciones: turista -> guia
Usuario.hasMany(Valoracion, { foreignKey: 'turista_id', as: 'valoraciones' });
Valoracion.belongsTo(Usuario, { foreignKey: 'turista_id', as: 'turista' });
Guia.hasMany(Valoracion, { foreignKey: 'guia_id', as: 'valoraciones' });
Valoracion.belongsTo(Guia, { foreignKey: 'guia_id', as: 'guia' });

// Mensajes
Usuario.hasMany(Mensaje, { foreignKey: 'emisor_id', as: 'emitidos' });
Usuario.hasMany(Mensaje, { foreignKey: 'receptor_id', as: 'recibidos' });
Mensaje.belongsTo(Usuario, { foreignKey: 'emisor_id', as: 'emisor' });
Mensaje.belongsTo(Usuario, { foreignKey: 'receptor_id', as: 'receptor' });

const models = { Usuario, Guia, Paquete, Reserva, Tracking, Valoracion, Mensaje };

export { Usuario, Guia, Paquete, Reserva, Tracking, Valoracion, Mensaje, sequelize };
export default models;