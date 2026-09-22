import bcrypt from 'bcrypt';
import { Usuario, Guia, Paquete, Reserva, Valoracion, Mensaje, Tracking } from './src/infrastructure/models.js';
import './src/infrastructure/models.js';

const IQUITOS = { lat: -3.74913, lng: -73.25391 };
const JITTER = 0.02;

const coord = () => ({
  lat: IQUITOS.lat + (Math.random() - 0.5) * JITTER * 2,
  lng: IQUITOS.lng + (Math.random() - 0.5) * JITTER * 2
});

const getOrCreateUsuario = async (email, password, nombre, rol) => {
  const existente = await Usuario.findOne({ where: { email } });
  if (existente) return existente;
  const hash = await bcrypt.hash(password, 10);
  return Usuario.create({ email, password: hash, nombre, rol });
};

const getOrCreateGuia = async (usuario, data) => {
  const existente = await Guia.findOne({ where: { usuario_id: usuario.id } });
  if (existente) return existente;
  return Guia.create({ usuario_id: usuario.id, ...data });
};

const getOrCreatePaquete = async (guiaId, data) => {
  const existente = await Paquete.findOne({ where: { guia_id: guiaId, titulo: data.titulo } });
  if (existente) return existente;
  return Paquete.create({ guia_id: guiaId, ...data });
};

const getOrCreateReserva = async (data) => {
  const existente = await Reserva.findOne({ where: { turista_id: data.turista_id, paquete_id: data.paquete_id, fecha_hora: data.fecha_hora } });
  if (existente) return existente;
  return Reserva.create(data);
};

const getOrCreateValoracion = async (data) => {
  const existente = await Valoracion.findOne({ where: { turista_id: data.turista_id, guia_id: data.guia_id, reserva_id: data.reserva_id } });
  if (existente) return;
  await Valoracion.create(data);
};

const getOrCreateMensaje = async (data) => {
  const existente = await Mensaje.findOne({ where: { emisor_id: data.emisor_id, receptor_id: data.receptor_id, contenido: data.contenido } });
  if (existente) return;
  await Mensaje.create(data);
};

const seed = async () => {
  console.log('— Seed SelvaGuide iniciado —');

  // Turistas de prueba (además del demo turista@selva.com)
  const tCarla = await getOrCreateUsuario('carla@test.com', 'turista123', 'Carla Mendoza', 'turista');
  const tPablo = await getOrCreateUsuario('pablo@test.com', 'turista123', 'Pablo Rios', 'turista');
  const tAna = await getOrCreateUsuario('ana@test.com', 'turista123', 'Ana Torres', 'turista');
  const guiaDemo = await Usuario.findOne({ where: { email: 'juan@guia.com' } });

  // Nuevos guías disponibles en el mapa
  const nuevosGuias = [
    {
      email: 'carlos@guia.com', nombre: 'Carlos Tafur', especialidad: 'Aventura', idiomas: 'Español, Inglés',
      tarifa_hora: 40, verificado: true, bio: 'Guía de expediciones en canoa y kayak por el río Itaya y el Amazonas. Nací en Belén y conozco cada remanso de la selva.'
    },
    {
      email: 'rosa@guia.com', nombre: 'Rosa Huamán', especialidad: 'Gastronomía', idiomas: 'Español, Inglés',
      tarifa_hora: 30, verificado: true, bio: 'Cocina amazónica de verdad: juane, tacacho y cecina. Te llevo a los mercados y a la cocina de mi casa.'
    },
    {
      email: 'elias@guia.com', nombre: 'Elías Vásquez', especialidad: 'Avistamiento', idiomas: 'Español, Inglés',
      tarifa_hora: 38, verificado: true, bio: 'Ornitólogo de campo. Más de 300 especies registradas en Allpahuayo-Mishana. Espectaculares atardeceres en el río.'
    },
    {
      email: 'naysha@guia.com', nombre: 'Naysha Pinedo', especialidad: 'Cultural', idiomas: 'Español, Portugués',
      tarifa_hora: 28, verificado: true, bio: 'Historiadora local. Recorridos por Belén, el puerto y la historia viva de Iquitos. Hablo con los abuelos del barrio.'
    },
    {
      email: 'marco@guia.com', nombre: 'Marco Cárdenas', especialidad: 'Senderismo', idiomas: 'Español, Inglés, Portugués',
      tarifa_hora: 45, verificado: true, bio: 'Guía profesional de trekking en la selva baja. Varillales, cochas y caminatas de varios días con total seguridad.'
    }
  ];

  const guiasCreados = [];
  for (const ng of nuevosGuias) {
    const usuario = await getOrCreateUsuario(ng.email, 'guia123', ng.nombre, 'guia');
    const guia = await getOrCreateGuia(usuario, {
      bio: ng.bio, especialidad: ng.especialidad, idiomas: ng.idiomas,
      tarifa_hora: ng.tarifa_hora, ...coord(), disponible: true, verificado: ng.verificado
    });
    guiasCreados.push(guia);
    console.log(`  Guía: ${ng.nombre} (${ng.especialidad}) — disponible`);
  }

  // Tours para los nuevos guías
  const toursNuevos = [
    { guiaIndex: 0, titulo: 'Paseo en canoa por el río Itaya', descripcion: 'Recorre los canales y casas flotantes del barrio de Belén al amanecer con un guía local. Observa la vida ribereña desde el agua.', duracion: 3, precio: 60, capacidad: 5 },
    { guiaIndex: 0, titulo: 'Kayak al atardecer en el Amazonas', descripcion: 'Remada tranquila con vista a la puesta de sol sobre el gran río. Incluye chalecos, remos y explicación de la fauna ribereña.', duracion: 4, precio: 90, capacidad: 4 },
    { guiaIndex: 1, titulo: 'Tour gastronómico: juane, tacacho y cecina', descripcion: 'Mercado de Belén y cocina de casa: prepara el juane envuelto en hojas de bijao y prueba los sabores amazónicos de verdad.', duracion: 3, precio: 55, capacidad: 8 },
    { guiaIndex: 2, titulo: 'Avistamiento de aves en Allpahuayo-Mishana', descripcion: 'Reserva nacional a 25 km de Iquitos. Guacamayos, tucanes y aves endémicas con guía ornitólogo y telescopio.', duracion: 6, precio: 120, capacidad: 4 },
    { guiaIndex: 3, titulo: 'Belén y el puerto: historia viva de Iquitos', descripcion: 'El barrio que cambia con el río. Recorrido por el mercado, los palafitos y las historias de la ciudad fluvial.', duracion: 2, precio: 40, capacidad: 8 },
    { guiaIndex: 3, titulo: 'Quistococha y la leyenda de la ciudad', descripcion: 'Complejo turístico y laguna sagrada. Caminata por la selva de la zona reservada con paradas en el centro de rescate de fauna.', duracion: 5, precio: 80, capacidad: 10 },
    { guiaIndex: 4, titulo: 'Sendero a los lagos de varillal', descripcion: 'Trekking por la terraza firme de la selva baja entre varillales y cochas. Baño en laguna cristalina al final del recorrido.', duracion: 5, precio: 70, capacidad: 6 },
    { guiaIndex: 4, titulo: 'Campamento nocturno en la selva', descripcion: 'Una noche en campamento rústico: cena amazónica, caminata de noche para escuchar la vida nocturna y amanecer en la copa de un árbol.', duracion: 24, precio: 240, capacidad: 6 }
  ];

  const paquetesCreados = [];
  for (const t of toursNuevos) {
    const guia = guiasCreados[t.guiaIndex];
    const paq = await getOrCreatePaquete(guia.id, {
      titulo: t.titulo, descripcion: t.descripcion, duracion: t.duracion, precio: t.precio, capacidad: t.capacidad, estado: 'activo'
    });
    paquetesCreados.push({ paquete: paq, guia });
    console.log(`  Tour: ${t.titulo}`);
  }

  // Reservas de ejemplo en varios estados (para el turista demo)
  const paqueteDelfines = await Paquete.findOne({ where: { titulo: 'Tour Delfines Rosados - Pacaya Samiria' } });
  const guiaJuan = await Guia.findByPk(1);

  if (guiaDemo && paqueteDelfines && guiaJuan) {
    const rEnCurso = await getOrCreateReserva({
      turista_id: guiaDemo.id, paquete_id: paqueteDelfines.id,
      fecha_hora: new Date(Date.now() + 1000 * 60 * 60 * 2), personas: 2, estado: 'en_curso'
    });

    // Puntos de tracking para la reserva en curso
    const tracksExistentes = await Tracking.findOne({ where: { reserva_id: rEnCurso.id } });
    if (!tracksExistentes) {
      const base = coord();
      for (let i = 0; i < 4; i++) {
        const t = new Date(Date.now() - (3 - i) * 30 * 1000);
        await Tracking.create({
          reserva_id: rEnCurso.id,
          lat: base.lat + i * 0.0015,
          lng: base.lng + i * 0.0015,
          timestamp: t
        });
      }
      console.log('  Tracking: 4 puntos para reserva en curso');
    }

    const rConfirmada = await getOrCreateReserva({
      turista_id: guiaDemo.id, paquete_id: paquetesCreados[0].paquete.id,
      fecha_hora: new Date(Date.now() + 1000 * 60 * 60 * 24), personas: 3, estado: 'confirmada'
    });
    const rPendiente = await getOrCreateReserva({
      turista_id: guiaDemo.id, paquete_id: paquetesCreados[2].paquete.id,
      fecha_hora: new Date(Date.now() + 1000 * 60 * 60 * 48), personas: 4, estado: 'pendiente'
    });
    const rCompletada = await getOrCreateReserva({
      turista_id: guiaDemo.id, paquete_id: paquetesCreados[4].paquete.id,
      fecha_hora: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), personas: 2, estado: 'completada'
    });
    console.log('  Reservas demo: en_curso, confirmada, pendiente, completada');

    // Valoraciones (solo para reservas completadas)
    const valData = [
      { turista_id: guiaDemo.id, guia_id: guiaJuan.id, reserva_id: rCompletada.id, estrellas: 5, comentario: 'Experiencia increíble, Juan nos mostró la selva como nadie. 100% recomendado.' },
      { turista_id: tCarla.id, guia_id: guiaJuan.id, reserva_id: rCompletada.id, estrellas: 5, comentario: 'El tour de los delfines fue espectacular y Juan es muy conocedor.' }
    ];
    for (const v of valData) {
      await getOrCreateValoracion(v);
    }
    console.log('  Valoración añadida (credibilidad existente)');

    // Valoraciones para guías nuevos (necesitan reservas completadas)
    const extras = [
      { paqueteIdx: 0, guiaIdx: 0, personas: 2, estrellas: 5, comentario: 'Carlos es increíble, la canoa por el Itaya al amanecer fue el mejor momento del viaje.' },
      { paqueteIdx: 1, guiaIdx: 0, personas: 2, estrellas: 4, comentario: 'Un atardecer que no olvidaré. Solo me gustaría que el kayak tuviera más tiempo de remada.' },
      { paqueteIdx: 2, guiaIdx: 1, personas: 4, estrellas: 5, comentario: 'El juane que preparamos con Rosa estuvo delicioso. Muy auténtico y acogedor.' },
      { paqueteIdx: 3, guiaIdx: 2, personas: 2, estrellas: 5, comentario: 'Vimos guacamayos y tucanes. Elías tiene un ojo increíble para encontrar aves.' },
      { paqueteIdx: 4, guiaIdx: 3, personas: 3, estrellas: 4, comentario: 'Belén es fascinante y Naysha lo explica con mucho cariño por su tierra.' }
    ];
    for (let i = 0; i < extras.length; i++) {
      const e = extras[i];
      const paq = paquetesCreados[e.paqueteIdx]?.paquete;
      const guia = guiasCreados[e.guiaIdx];
      if (!paq || !guia) continue;
      const reserva = await getOrCreateReserva({
        turista_id: guiaDemo.id, paquete_id: paq.id,
        fecha_hora: new Date(Date.now() - 1000 * 60 * 60 * 24 * (8 + i)), personas: e.personas, estado: 'completada'
      });
      await getOrCreateValoracion({ turista_id: guiaDemo.id, guia_id: guia.id, reserva_id: reserva.id, estrellas: e.estrellas, comentario: e.comentario });
      const nombreGuia = (await Usuario.findByPk(guia.usuario_id))?.nombre || `guia ${guia.id}`;
      console.log(`  Valoración: ${nombreGuia} — ${e.estrellas}★`);
    }

    // Mensajes de ejemplo
    const msgData = [
      { emisor_id: guiaDemo.id, receptor_id: guiaJuan.usuario_id, reserva_id: rEnCurso.id, contenido: 'Hola Juan, estamos listos para el tour. ¿A qué hora me recoges?' },
      { emisor_id: guiaJuan.usuario_id, receptor_id: guiaDemo.id, reserva_id: rEnCurso.id, contenido: 'Hola! En 30 minutos paso por tu hotel. Lleva repelente.' },
      { emisor_id: tCarla.id, receptor_id: guiasCreados[2].usuario_id, reserva_id: null, contenido: '¿Tienes disponibilidad para el avistamiento de aves este sábado?' },
      { emisor_id: guiasCreados[2].usuario_id, receptor_id: tCarla.id, reserva_id: null, contenido: 'Sí Carla, sábado a las 5:30 am salimos. Te confirmo el punto de encuentro.' },
      { emisor_id: tPablo.id, receptor_id: guiasCreados[4].usuario_id, reserva_id: null, contenido: 'Hola Marco, ¿el campamento incluye comida?' },
      { emisor_id: guiasCreados[4].usuario_id, receptor_id: tPablo.id, reserva_id: null, contenido: 'Sí, cena y desayuno incluidos. Trae ropa abrigadora para la noche.' }
    ];
    for (const m of msgData) {
      await getOrCreateMensaje(m);
    }
    console.log('  Mensajes de ejemplo añadidos');
  }

  await tAna && null;
  await tAna && await getOrCreateMensaje({
    emisor_id: tAna.id, receptor_id: guiasCreados[3].usuario_id, reserva_id: null,
    contenido: 'Hola Naysha, me interesa el recorrido por Belén para dos personas.'
  });

  console.log('— Seed completado —');
  process.exit(0);
};

seed().catch((e) => {
  console.error('Error en seed:', e);
  process.exit(1);
});