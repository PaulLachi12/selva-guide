const bcrypt = require('bcrypt');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('turista123', 10);
    const passwordGuideHash = await bcrypt.hash('guia123', 10);
    const adminHash = await bcrypt.hash('admin123', 10);

    const usuarios = [
      { email: 'turista@selva.com', password: passwordHash, nombre: 'Turista Demo', telefono: null, foto: null, rol: 'turista', createdAt: new Date(), updatedAt: new Date() },
      { email: 'admin@selva.com', password: adminHash, nombre: 'Administrador', telefono: null, foto: null, rol: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { email: 'juan@guia.com', password: passwordGuideHash, nombre: 'Juan del Águila', telefono: null, foto: null, rol: 'guia', createdAt: new Date(), updatedAt: new Date() },
      { email: 'mari@guia.com', password: passwordGuideHash, nombre: 'María del Lago', telefono: null, foto: null, rol: 'guia', createdAt: new Date(), updatedAt: new Date() },
      { email: 'pedro@guia.com', password: passwordGuideHash, nombre: 'Pedro Curuya', telefono: null, foto: null, rol: 'guia', createdAt: new Date(), updatedAt: new Date() }
    ];

    await queryInterface.bulkInsert('usuarios', usuarios);

    const allUsers = await queryInterface.sequelize.query('SELECT id, email FROM usuarios', { type: queryInterface.sequelize.QueryTypes.SELECT });
    const idByEmail = Object.fromEntries(allUsers.map(u => [u.email, u.id]));

    const guias = [
      { usuario_id: idByEmail['juan@guia.com'], bio: 'Guía nativo de Iquitos, 10 años llevando turistas a la Reserva Pacaya Samiria. Especialista en avistamiento de delfines rosados.', especialidad: 'Avistamiento de delfines', idiomas: 'español, inglés', tarifa_hora: 45, lat: -3.749130, lng: -73.253907, disponible: true, verificado: true, createdAt: new Date(), updatedAt: new Date() },
      { usuario_id: idByEmail['mari@guia.com'], bio: 'Nacida en la comunidad de Santa María de Nanay. Guía de aventura y senderismo, conoce las plantas medicinales de la selva.', especialidad: 'Senderismo y plantas medicinales', idiomas: 'español, kukama', tarifa_hora: 35, lat: -3.745600, lng: -73.250900, disponible: true, verificado: true, createdAt: new Date(), updatedAt: new Date() },
      { usuario_id: idByEmail['pedro@guia.com'], bio: 'Guía de pesca deportiva y visitas a comunidades indígenas. Conocedor de la historia de Belén y el mercado flotante.', especialidad: 'Pesca y comunidades', idiomas: 'español, shiwilu', tarifa_hora: 40, lat: -3.752300, lng: -73.256100, disponible: false, verificado: false, createdAt: new Date(), updatedAt: new Date() }
    ];

    await queryInterface.bulkInsert('guias', guias);

    const allGuides = await queryInterface.sequelize.query('SELECT id, especialidad, usuario_id FROM guias', { type: queryInterface.sequelize.QueryTypes.SELECT });
    const guideIdByEmail = {};
    for (const g of allGuides) {
      const u = await queryInterface.sequelize.query('SELECT email FROM usuarios WHERE id = :id', { replacements: { id: g.usuario_id }, type: queryInterface.sequelize.QueryTypes.SELECT });
      guideIdByEmail[u[0].email] = g.id;
    }

    const paquetes = [
      { guia_id: guideIdByEmail['juan@guia.com'], titulo: 'Tour Delfines Rosados - Pacaya Samiria', descripcion: 'Recorrido de día completo por la Reserva Nacional Pacaya Samiria en busca de delfines rosados y grises. Incluye lancha y refrigerio.', duracion: 8, precio: 180, capacidad: 4, estado: 'activo', createdAt: new Date(), updatedAt: new Date() },
      { guia_id: guideIdByEmail['mari@guia.com'], titulo: 'Senderismo y plantas medicinales', descripcion: 'Caminata guiada por los alrededores de Iquitos descubriendo la flora amazónica y sus usos medicinales tradicionales.', duracion: 4, precio: 70, capacidad: 6, estado: 'activo', createdAt: new Date(), updatedAt: new Date() },
      { guia_id: guideIdByEmail['pedro@guia.com'], titulo: 'Tour histórico Belén y mercados', descripcion: 'Visita guiada al barrio de Belén, mercado flotante y casco histórico de Iquitos.', duracion: 2, precio: 50, capacidad: 8, estado: 'activo', createdAt: new Date(), updatedAt: new Date() }
    ];

    await queryInterface.bulkInsert('paquetes', paquetes);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('paquetes', null, {});
    await queryInterface.bulkDelete('guias', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};