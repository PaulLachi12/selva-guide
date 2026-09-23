// Store centralizado para puntos turísticos, calles y reseñas en Selva Guía • Iquitos

let listeners = [];

export const PUNTOS_INICIALES = [
  // --- CALLES Y PLAZAS HISTÓRICAS DE IQUITOS (Para búsqueda por calle/dirección) ---
  {
    id: 101,
    nombre: 'Plaza de Armas de Iquitos',
    categoria: 'turistico',
    subcategoria: 'Plaza Central / Histórico',
    calle: 'Jr. Napo / Jr. Putumayo / Jr. Arica / Jr. Prospero',
    direccion: 'Plaza de Armas, Centro de Iquitos',
    lat: -3.7492,
    lng: -73.2439,
    distancia: '0 km (Centro)',
    acceso: 'A pie en el centro de la ciudad',
    costo: 'Acceso libre',
    dificultad: 'Muy fácil',
    horario: '24 horas',
    telefono: '+51965842100',
    descripcionCorta: 'Corazón histórico de Iquitos, frente a la Iglesia Matriz y la Casa de Fierro de Gustave Eiffel.',
    descripcionLarga: 'La plaza principal de Iquitos rodeada de construcciones de la época del caucho. Alberga el Obelisco a los Héroes, piletas circulares iluminadas por la noche y acceso inmediato a la histórica Casa de Fierro diseñada por Gustave Eiffel.',
    recomendaciones: 'Ideal para pasear al atardecer, tomar un helado de aguaje o camu camu y fotografiar la Iglesia Matriz.',
    audio: 'La Plaza de Armas de Iquitos es el corazón de la capital loretana, testigo del esplendor del caucho y punto de partida de toda expedición amazónica.',
    rating: 4.8,
    resenas: [
      { id: 201, autor: 'Mateo L.', rating: 5, comentario: 'Hermosa de noche con las luces y la brisa.', fecha: 'Hace 2 días' }
    ]
  },
  {
    id: 102,
    nombre: 'Malecón Tarapacá (Bulevar de Iquitos)',
    categoria: 'turistico',
    subcategoria: 'Paseo Peatonal / Vista al Río',
    calle: 'Malecon Tarapaca',
    direccion: 'Malecón Tarapacá cuadras 1 a 4',
    lat: -3.7475,
    lng: -73.2425,
    distancia: '0.2 km de Plaza de Armas',
    acceso: 'A pie desde la Plaza de Armas hacia el río',
    costo: 'Acceso libre',
    dificultad: 'Muy fácil',
    horario: 'Abierto 24 horas',
    telefono: '+51965842100',
    descripcionCorta: 'El balcón de la ciudad frente al río Itaya, casonas coloniales con azulejos importados de Portugal.',
    descripcionLarga: 'Construido a finales del siglo XIX durante el auge del caucho. Su paseo peatonal arbolado ofrece vistas panorámicas impresionantes hacia el río Itaya y la confluencia con el Amazonas. Flanqueado por mansiones con azulejos traídos de Europa.',
    recomendaciones: 'Visitar entre 5:30 PM y 8:00 PM para contemplar el atardecer amazónico con brisa fresca.',
    audio: 'El Malecón Tarapacá es el mirador legendario de Iquitos. Desde aquí los antiguos barones del caucho veían zarpar los vapores transatlánticos cargados de goma hacia Europa.',
    rating: 4.9,
    resenas: [
      { id: 202, autor: 'Lucía S.', rating: 5, comentario: 'El mejor lugar para ver la puesta de sol con un café.', fecha: 'Ayer' }
    ]
  },
  {
    id: 103,
    nombre: 'Plaza 28 de Julio',
    categoria: 'turistico',
    subcategoria: 'Plaza Cívica / Recreación',
    calle: 'Av. Grau / Calle Bermudez / Jr. San Martin',
    direccion: 'Av. Grau cdra 4 con Calle Bermúdez',
    lat: -3.7544,
    lng: -73.2501,
    distancia: '0.9 km de Plaza de Armas',
    acceso: 'A pie o mototaxi (S/ 2.50)',
    costo: 'Acceso libre',
    dificultad: 'Fácil',
    horario: '24 horas',
    telefono: '+51965842100',
    descripcionCorta: 'La plaza más grande de Iquitos, rodeada de comercios y paradero de colectivos a Nauta y Quistococha.',
    descripcionLarga: 'La plaza cívica más amplia de la ciudad, con fuentes de agua y juegos infantiles. Es el punto de conexión estratégico donde se toman los colectivos y mototaxis para la Carretera Iquitos-Nauta, Quistococha y el CREA.',
    recomendaciones: 'Lugar clave para tomar transporte terrestre económico hacia el sur de la ciudad.',
    audio: 'Plaza 28 de Julio, centro neurálgico del transporte local y espacio de recreación favorito de las familias iquiteñas.',
    rating: 4.5,
    resenas: []
  },
  {
    id: 104,
    nombre: 'Jirón Próspero (Calle Comercial Principal)',
    categoria: 'recreativo',
    subcategoria: 'Comercio / Bancos / Artesanías',
    calle: 'Jiron Prospero',
    direccion: 'Jr. Próspero cuadras 1 al 10',
    lat: -3.7510,
    lng: -73.2458,
    distancia: 'Centro financiero',
    acceso: 'A pie desde Plaza de Armas',
    costo: 'Acceso libre',
    dificultad: 'Muy fácil',
    horario: 'Tiendas 8:30 AM - 9:00 PM',
    telefono: '+51965842100',
    descripcionCorta: 'La arteria comercial más concurrida de Iquitos con bancos, agencias y tiendas.',
    descripcionLarga: 'La calle principal de la economía de Iquitos. Concentra la mayor cantidad de cajeros automáticos, casas de cambio formales, agencias de viaje, farmacias y tiendas de recuerdos amazónicos.',
    recomendaciones: 'Usa los cajeros automáticos en esta calle por mayor seguridad de día.',
    audio: 'Jirón Próspero es la columna vertebral del comercio y la vida urbana de Iquitos, conectando la Plaza de Armas con el distrito de Belén.',
    rating: 4.4,
    resenas: []
  },

  // --- TURÍSTICO / NATURALEZA ---
  {
    id: 1,
    nombre: 'Parque Zoológico Quistococha',
    categoria: 'turistico',
    subcategoria: 'Familiar / Naturaleza',
    calle: 'Carretera Iquitos Nauta Km 14',
    direccion: 'Carretera Iquitos-Nauta Km 14.5, San Juan Bautista',
    lat: -3.824,
    lng: -73.340,
    distancia: '14 km (Carretera Iquitos-Nauta)',
    acceso: 'Mototaxi o colectivo desde Plaza 28 de Julio (~30 min)',
    costo: 'Entrada S/ 10 adultos, S/ 5 niños',
    dificultad: 'Baja (Paseo familiar)',
    horario: 'Mar - Dom 9:00 AM - 4:30 PM',
    telefono: '+51965842100',
    descripcionCorta: 'Playa de arena blanca Tunchi Playa, animales rescatados y paiches gigantes.',
    descripcionLarga: 'Complejo turístico y zoológico icónico alrededor del lago Quistococha. Cuenta con la famosa Tunchi Playa de arena blanca y agua dulce natural, criaderos de paiches gigantes (Arapaima gigas), manatíes, delfines, felinos rescatados y senderos botánicos en selva alta.',
    recomendaciones: 'Llevar traje de baño para la laguna, repelente contra mosquitos y protector solar. Probar el pescado fresco en los quioscos locales a orilla del lago.',
    audio: 'Bienvenidos al Complejo Quistococha. Esta hermosa laguna de aguas oscuras rodeada de vegetación alberga especies rescatadas como el manatí amazónico y el imponente paiche. Disfruten de Tunchi Playa, un balneario natural de arena blanca en el corazón de la Amazonía.',
    rating: 4.7,
    resenas: [
      { id: 101, autor: 'Carlos P.', rating: 5, comentario: 'Tunchi playa es increíble con los niños, agua fresca y rica comida.', fecha: 'Hace 3 días' },
      { id: 102, autor: 'Valeria M.', rating: 4, comentario: 'Ver a los paiches de más de 2 metros cuando los alimentan es una experiencia única.', fecha: 'Hace 1 semana' }
    ]
  },
  {
    id: 2,
    nombre: 'Reserva Nacional Allpahuayo-Mishana',
    categoria: 'turistico',
    subcategoria: 'Ecoturismo / Conservación',
    calle: 'Carretera Iquitos Nauta Km 26',
    direccion: 'Km 26 Carretera Iquitos-Nauta',
    lat: -3.874,
    lng: -73.430,
    distancia: '26 km de Iquitos',
    acceso: 'Auto / colectivo por la carretera Nauta + caminata por senderos',
    costo: 'Entrada S/ 15 nacionales, S/ 30 extranjeros',
    dificultad: 'Media (Caminata en bosque virgen)',
    horario: 'Lun - Dom 8:00 AM - 4:00 PM',
    telefono: '+51987654321',
    descripcionCorta: 'Bosques sobre arena blanca varillales y aves endémicas como la perlita de Iquitos.',
    descripcionLarga: 'Famosa por sus bosques de varillal que crecen sobre arena blanca con una concentración asombrosa de especies de aves y plantas que no existen en ninguna otra parte de la Tierra. Hogar de la perlita de Iquitos (Polioptila clemencei) y el mono tocón negro.',
    recomendaciones: 'Ir obligatoriamente con guía local certificado. Llevar botas de trekking o de jebe, impermeable ligero y binoculares para observación de aves.',
    audio: 'Allpahuayo Mishana es un tesoro ecológico mundial. Su suelo de arena de cuarzo blanco genera un ecosistema de varillales único en la Amazonía, donde viven aves que solo existen en este bosque protegido.',
    rating: 4.9,
    resenas: [
      { id: 103, autor: 'Elena R.', rating: 5, comentario: 'Pudimos avistar la perlita de Iquitos con nuestro guía. Experiencia inolvidable.', fecha: 'Hace 4 días' }
    ]
  },
  {
    id: 3,
    nombre: 'Pasaje Paquito y Mercado de Belén',
    categoria: 'turistico',
    subcategoria: 'Turismo / Cultura',
    tarifaDesdePlaza: 'S/ 3.00 - S/ 4.00',
    calle: 'Pasaje Paquito / Calle Ramirez Hurtado',
    direccion: 'Baja al Río Itaya, Distrito de Belén',
    lat: -3.758,
    lng: -73.246,
    distancia: 'En la ribera este de Iquitos (1.5 km del centro)',
    acceso: 'A pie hasta la bajada y peke-peke por el río Itaya',
    costo: 'Paseo en bote S/ 20 - 30 por hora negociable',
    dificultad: 'Baja - Moderada',
    horario: 'Recomendable de 6:00 AM a 1:00 PM',
    telefono: '+51944556677',
    descripcionCorta: 'La Venecia Amazónica, medicina tradicional, lianas de ayahuasca y casas sobre pilotes.',
    descripcionLarga: 'Comunidad vibrante levantada sobre pilotes de madera de balsa que flotan durante la época de creciente del río Itaya y reposan sobre tierra en vaciante. En tierra firme se ubica el Pasaje Paquito, epicentro de la medicina tradicional amazónica donde se expenden raíces, cortezas como uña de gato, aceite de copaiba y preparados sagrados de ayahuasca.',
    recomendaciones: 'Visitar de preferencia por la mañana. Ir en compañía de un guía local o botero de confianza. Cuidar pertenencias y pedir permiso antes de fotografiar a los pobladores.',
    audio: 'Belén, conocida como la Venecia de la Amazonía. Durante los meses de lluvia, las casas y escuelas flotan libremente sobre el agua. Aquí en el Pasaje Paquito confluye el saber ancestral de chamanes y curanderos de toda la cuenca.',
    rating: 4.6,
    resenas: [
      { id: 104, autor: 'Mateo S.', rating: 5, comentario: 'Un paseo en peke-peke entre las casas de madera te cambia la perspectiva del río.', fecha: 'Ayer' }
    ]
  },
  {
    id: 4,
    nombre: 'Centro de Rescate Amazónico (CREA)',
    categoria: 'turistico',
    tarifaDesdePlaza: 'S/ 20.00 - S/ 25.00',
    subcategoria: 'Conservación / Rescate de Fauna',
    calle: 'Carretera Iquitos Nauta Km 13.5',
    direccion: 'Carretera Iquitos-Nauta Km 13.5',
    lat: -3.840,
    lng: -73.355,
    distancia: '13.5 km Carretera Iquitos-Nauta',
    acceso: 'Mototaxi desde el centro (25 min)',
    costo: 'Adultos S/ 20, Niños S/ 10',
    dificultad: 'Muy fácil / Accesible',
    horario: 'Mar - Dom 9:00 AM - 3:30 PM',
    telefono: '+51939112233',
    descripcionCorta: 'Centro de Rescate Amazónico dedicado a rehabilitar manatíes y fauna silvestre.',
    descripcionLarga: 'Institución pionera en la Amazonía peruana dedicada al rescate, rehabilitación y liberación de manatíes amazónicos (Trichechus inunguis), nutrias gigantes, tortugas taricayas y monos víctimas del tráfico ilegal. Permite alimentarlos con biberón bajo supervisión médica.',
    recomendaciones: 'Ideal para familias. Respeta rigurosamente las normas de no tocar a los animales sin autorización médica de los biólogos.',
    audio: 'El CREA es un santuario de esperanza para la fauna amazónica. Aquí científicos y voluntarios devuelven la vida a manatíes huérfanos y concientizan a las comunidades ribereñas sobre la protección de la biodiversidad.',
    rating: 4.9,
    resenas: [
      { id: 105, autor: 'Luciana G.', rating: 5, comentario: 'Darle el biberón a los manatíes bebés fue el mejor recuerdo de nuestro viaje.', fecha: 'Hace 2 días' }
    ]
  },
  {
    id: 5,
    nombre: 'Embarcadero Bellavista Nanay',
    categoria: 'turistico',
    subcategoria: 'Gastronomía Fluvial & Embarcadero',
    calle: 'Av. La Marina / Calle Nanay',
    direccion: 'Final de la Av. La Marina, Punchana',
    lat: -3.725,
    lng: -73.244,
    distancia: '5 km al norte de la Plaza de Armas',
    acceso: 'Mototaxi (S/ 4 - 6, 12 min)',
    costo: 'Acceso libre. Botes peke-peke desde S/ 15 - 40',
    dificultad: 'Baja',
    horario: 'Todos los días 7:00 AM - 6:00 PM',
    telefono: '+51978224466',
    descripcionCorta: 'Punto de partida en peke-peke, degustación de suri a la parrilla y pez doncella.',
    descripcionLarga: 'El puerto tradicional del norte de la ciudad a orillas del río Nanay de aguas negras. Es el punto de partida hacia el río Momón, Padre Cocha y el Serpentario. Su famoso bulevar gastronómico ofrece brochetas de suri asado, doncella frita, cecina con tacacho y refresco de aguaje.',
    recomendaciones: 'Atrévete a probar el suri en brocheta recién salido del carbón. Contrata botes con chalecos salvavidas reglamentarios.',
    audio: 'Bellavista Nanay es el punto de encuentro entre la ciudad y los ríos. Aquí se siente el aroma a humo de leña, plátano asado y el murmullo de los motores peke-peke surcando las tranquilas aguas oscuras del Nanay.',
    rating: 4.8,
    resenas: [
      { id: 106, autor: 'Javier B.', rating: 5, comentario: 'El suri a la brasa superó mis expectativas, ¡sabe delicioso!', fecha: 'Hace 5 días' }
    ]
  },

  // --- DEPORTIVO / EXTREMO / CAMPO ---
  {
    id: 6,
    nombre: 'Ruta de Cuatrimotos y Trochas Nauta',
    categoria: 'deportivo',
    subcategoria: 'Aventura / Off-Road',
    calle: 'Carretera Iquitos Nauta Km 30',
    direccion: 'Km 30 Carretera Iquitos-Nauta',
    lat: -3.900,
    lng: -73.300,
    distancia: '30 km Carretera Iquitos-Nauta',
    acceso: 'Transporte privado o tour contratado',
    costo: 'Circuitos desde S/ 120 por persona',
    dificultad: 'Alta / Adrenalina',
    horario: 'Tours diarios 8:30 AM y 2:00 PM',
    telefono: '+51955883322',
    descripcionCorta: 'Aventura en lodo, barriales y selva secundaria en cuatrimotos todoterreno.',
    descripcionLarga: 'Circuito de adrenalina diseñado a través de trochas accidentadas, cruce de quebradas selváticas y charcos de lodo arcilloso. Guiado por instructores expertos en mecánicas de selva con paradas en miradores de vegetación primaria.',
    recomendaciones: 'Ropa de cambio completa indispensable, zapatillas que se puedan ensuciar, repelente y lentes de protección contra barro.',
    audio: 'Prepárense para la emoción extrema en la selva. La ruta de cuatrimotos pondrá a prueba su destreza conduciendo sobre lodo amazónico, raíces y senderos salvajes rodeados de densa vegetación.',
    rating: 4.8,
    resenas: [
      { id: 107, autor: 'Gonzalo K.', rating: 5, comentario: 'Pura adrenalina, salimos empapados en barro pero con una sonrisa enorme.', fecha: 'Hace 6 días' }
    ]
  },
  {
    id: 7,
    nombre: 'Caminatas Nocturnas: Tarántulas y Serpientes',
    categoria: 'deportivo',
    subcategoria: 'Aventura Nocturna / Biodiversidad',
    calle: 'Carretera a Zungarococha',
    direccion: 'Sector Zungarococha / Llanchama',
    lat: -3.785,
    lng: -73.310,
    distancia: '18 km (Sector Zungarococha / Llanchama)',
    acceso: 'En vehículo 4x4 o bote según temporada',
    costo: 'S/ 90 - 150 por persona con linternas frontales',
    dificultad: 'Media / Exigente',
    horario: 'Salidas 6:30 PM - 10:30 PM',
    telefono: '+51977665544',
    descripcionCorta: 'Expedición en oscuridad con linternas para ver tarántulas pollito, ranas y serpientes.',
    descripcionLarga: 'La selva se transforma cuando se oculta el sol. Caminata guiada con biólogos y guías nativos rastreando tarántulas de madriguera, serpientes loro machaco, ranas venenosas de dardo y mamíferos nocturnos guiados por el coro de insectos amazónicos.',
    recomendaciones: 'Llevar linterna potente (de preferencia frontal), pantalones largos impermeables, camisa manga larga y repelente fuerte.',
    audio: 'Al caer la noche en la selva, el 80% de la fauna despierta. En esta caminata sentirán la vibración de la selva viva bajo las estrellas, observando criaturas fascinantes en su hábitat nocturno.',
    rating: 4.9,
    resenas: [
      { id: 108, autor: 'Diana F.', rating: 5, comentario: 'Vimos 3 especies de tarántulas gigantes y una rana de cristal. El guía nativo un maestro.', fecha: 'Hace 1 semana' }
    ]
  },

  // --- GASTRONOMÍA: ALTA GAMA / GOURMET ---
  {
    id: 8,
    nombre: 'Al Frío y al Fuego (Restaurante Flotante)',
    categoria: 'gastronomico',
    subcategoria: 'Alta Gama / Gourmet',
    calle: 'Rio Itaya frente a Malecon',
    direccion: 'Sobre el Río Itaya (Embarque en Calle Próspero cdra 1)',
    lat: -3.738,
    lng: -73.238,
    distancia: 'Sobre el río Itaya (Frente a la ciudad)',
    acceso: 'Bote privado gratuito desde el embarcadero de Calle Próspero',
    costo: 'Platos de S/ 45 a S/ 110',
    dificultad: 'Fácil / Experiencia VIP',
    horario: 'Mar - Dom 12:00 PM - 11:00 PM',
    telefono: '+51965778899',
    descripcionCorta: 'Restaurante flotante con piscina, comida amazónica de autor, paiche y cecina gourmet.',
    descripcionLarga: 'Emblemático restaurante flotante con piscina central ubicado sobre las aguas del río Itaya. Ofrece gastronomía amazónica de autor con presentaciones vanguardistas de paiche a la parrilla, tiraditos de doncella con salsa de cocona y cócteles de camu camu con pisco.',
    recomendaciones: 'Reservar para el atardecer (5:30 PM) para ver la puesta de sol sobre el río con un trago exótico.',
    audio: 'Al Frío y al Fuego es la máxima expresión de la cocina amazónica contemporánea, un oasis flotante que combina tradición e innovación con vista panorámica a la inmensidad del río.',
    rating: 4.9,
    resenas: [
      { id: 109, autor: 'Rodrigo T.', rating: 5, comentario: 'El paiche en costra de castaña amazónica es de otro planeta.', fecha: 'Ayer' }
    ]
  },

  // --- GASTRONOMÍA: INTERMEDIO / TERRAZAS ---
  {
    id: 9,
    nombre: 'Dawn on the Amazon Café',
    categoria: 'gastronomico',
    subcategoria: 'Intermedio / Terrazas y Río',
    calle: 'Malecon Maldonado 185',
    direccion: 'Malecón Maldonado 185 frente al río Itaya',
    lat: -3.746,
    lng: -73.245,
    distancia: 'Malecón Maldonado 185',
    acceso: 'A pie en el Malecón céntrico',
    costo: 'Platos S/ 25 - 55',
    dificultad: 'Muy fácil',
    horario: 'Lun - Dom 8:00 AM - 10:00 PM',
    telefono: '+51981223344',
    descripcionCorta: 'Terraza frente al río, jugos de camu camu, ensalada de chonta fresca y cafés selectos.',
    descripcionLarga: 'Acogedora terraza en el malecón histórico con vistas privilegiadas del río Itaya. Especializado en cocina fusión, opciones vegetarianas de la selva, ensaladas de chonta fresca (palmito) y cócteles amazónicos.',
    recomendaciones: 'Pide el batido de camu camu fresco de la mañana o el sándwich de cecina desmechada.',
    audio: 'Relájate con la brisa fluvial en Dawn on the Amazon, el punto preferido de viajeros de todo el mundo para disfrutar de café orgánico y chonta fresca mirando los barcos pasar.',
    rating: 4.7,
    resenas: [
      { id: 110, autor: 'Sofia L.', rating: 5, comentario: 'Hermosa vista y la ensalada de chonta súper fresca.', fecha: 'Hace 3 días' }
    ]
  },
  {
    id: 10,
    nombre: 'Restaurante Fitzcarrald',
    categoria: 'gastronomico',
    subcategoria: 'Intermedio / Terrazas y Río',
    calle: 'Malecon Maldonado con Napo',
    direccion: 'Malecón Maldonado esquina con Calle Napo',
    lat: -3.748,
    lng: -73.244,
    distancia: 'Malecón Maldonado con Napo',
    acceso: 'A pie en el malecón central',
    costo: 'Platos S/ 30 - 65',
    dificultad: 'Muy fácil',
    horario: 'Lun - Dom 11:30 AM - 11:00 PM',
    telefono: '+51944112255',
    descripcionCorta: 'Homenaje a la época del caucho, tacacho con cecina clásico y costillas al ají charapita.',
    descripcionLarga: 'Nombrado en honor a la célebre película y magnate del caucho, situado en una casona histórica de estilo colonial frente al río. Platos tradicionales generosos como tacacho con cecina y chorizo artesanal, ceviche de paiche y lomo saltado con chonta.',
    recomendaciones: 'Mesa exterior en la noche para disfrutar de la música en vivo y la brisa del malecón.',
    audio: 'Historia viva de Iquitos y del caucho en Fitzcarrald. Su cocina honra los ingredientes milenarios con el sabor inconfundible del ají charapita.',
    rating: 4.6,
    resenas: [
      { id: 111, autor: 'Manuel H.', rating: 4, comentario: 'El tacacho con cecina es abundante y de excelente sabor.', fecha: 'Hace 5 días' }
    ]
  },

  // --- GASTRONOMÍA: POPULAR VIVENCIAL ---
  {
    id: 11,
    nombre: 'Puestos Tradicionales del Mercado de Belén',
    categoria: 'gastronomico',
    subcategoria: 'Regional / Popular Vivencial',
    calle: 'Calle 9 de Diciembre / Ramirez Hurtado',
    direccion: 'Mercado de Belén (Sector Alto)',
    lat: -3.754,
    lng: -73.248,
    distancia: 'Mercado de Belén (Zona alta)',
    acceso: 'A pie o mototaxi (S/ 2.50)',
    costo: 'Platos desde S/ 5 a S/ 15',
    dificultad: 'Moderada (Mucha afluencia)',
    horario: 'Todos los días 6:00 AM - 1:00 PM',
    telefono: '+51999887766',
    descripcionCorta: 'Juanes de arroz en hoja de bijao, patarashca al carbón, chilcano de carachama y masato.',
    descripcionLarga: 'El corazón latente de la cocina popular de Iquitos. Puestos vivenciales donde las cocineras locales preparan juanes envueltos en hoja de bijao humeantes, patarashca de pescado amazónico asado en hojas, chilcano nutritivo de carachama y masato fermentado de yuca.',
    recomendaciones: 'Ir temprano (7:00 a 10:00 AM). Llevar dinero en efectivo en billetes chicos y probar la patarashca recién salida de la brasa.',
    audio: 'El Mercado de Belén es la cuna del sabor popular loretano. Aquí los aromas a bijao, carbón y culantro del monte cuentan la historia del campesino y del pescador amazónico.',
    rating: 4.8,
    resenas: [
      { id: 112, autor: 'Patricia V.', rating: 5, comentario: 'El juane original de gallina de chacra con su ají de cocona no tiene comparación.', fecha: 'Ayer' }
    ]
  },
  {
    id: 501,
    nombre: 'Alquiler de Motos Leo',
    categoria: 'transporte',
    subcategoria: 'Alquiler de Vehículos',
    calle: 'Calle Morona esq. Tacna',
    direccion: 'Calle Morona esquina con Tacna, Centro de Iquitos',
    lat: -3.7488,
    lng: -73.2465,
    distancia: '0.3 km de Plaza de Armas',
    acceso: 'A pie desde el centro',
    costo: 'S/ 35.00 - S/ 50.00 por día',
    dificultad: 'Fácil',
    horario: 'Todos los días 7:00 AM - 8:00 PM',
    telefono: '+51965842100',
    descripcionCorta: 'Renta tu propia moto para moverte libremente por Iquitos y salir hasta la carretera Iquitos-Nauta.',
    descripcionLarga: 'Alquiler de Motos Leo ofrece motos en buen estado por día completo, ideales para explorar el centro de Iquitos a tu ritmo o aventurarte por la carretera Iquitos-Nauta. Incluye casco y una breve inducción de manejo.',
    recomendaciones: 'Llevar brevete o licencia de conducir y una copia de tu documento de identidad para el depósito de garantía.',
    audio: 'Alquiler de Motos Leo, en la calle Morona con Tacna, te da la libertad de recorrer Iquitos y sus alrededores manejando tu propia moto.',
    rating: 4.7,
    resenas: [
      { id: 501, autor: 'Renzo A.', rating: 5, comentario: 'Motos en buen estado y precio justo por día.', fecha: 'Hace 3 días' }
    ]
  },
  {
    id: 502,
    nombre: 'Casa de Fierro',
    categoria: 'turistico',
    subcategoria: 'Patrimonio / Arquitectura',
    calle: 'Jr. Próspero con Jr. Putumayo',
    direccion: 'Plaza de Armas de Iquitos',
    lat: -3.7494,
    lng: -73.2437,
    distancia: '0 km (Centro)',
    acceso: 'A pie en el centro de la ciudad',
    costo: 'Acceso a fachada libre',
    dificultad: 'Muy fácil',
    horario: '24 horas (fachada)',
    telefono: '+51965842100',
    descripcionCorta: 'Edificio de planchas de hierro atribuido a Gustave Eiffel, símbolo de la época del caucho.',
    descripcionLarga: 'Construida con planchas de hierro traídas de Europa durante el auge del caucho, la Casa de Fierro es uno de los símbolos arquitectónicos más reconocidos de Iquitos y de la Amazonía peruana.',
    recomendaciones: 'Visitar de día para fotografiar los detalles de las planchas metálicas y combinarlo con un paseo por la Plaza de Armas.',
    audio: 'La Casa de Fierro es un testimonio de hierro del esplendor cauchero que convirtió a Iquitos en una ciudad cosmopolita en plena selva.',
    rating: 4.6,
    resenas: []
  },
  {
    id: 503,
    nombre: 'Museo de Culturas Indígenas Amazónicas',
    categoria: 'turistico',
    subcategoria: 'Cultural / Museo',
    calle: 'Jr. Málaga',
    direccion: 'Malecón Tarapacá, Centro de Iquitos',
    lat: -3.7479,
    lng: -73.2429,
    distancia: '0.1 km del Malecón Tarapacá',
    acceso: 'A pie desde el Malecón Tarapacá',
    costo: 'Entrada S/ 15.00 aprox.',
    dificultad: 'Muy fácil',
    horario: 'Lunes a sábado, 9:00 AM - 6:00 PM',
    telefono: '+51965842100',
    descripcionCorta: 'Colección de artesanía, vestimenta y objetos rituales de los pueblos indígenas de la Amazonía peruana.',
    descripcionLarga: 'Museo que reúne piezas originales de diversos pueblos amazónicos (Bora, Huitoto, Shipibo, entre otros), con explicaciones sobre su cosmovisión, vestimenta ceremonial y objetos de uso cotidiano.',
    recomendaciones: 'Reservar una hora para el recorrido y aprovechar la tienda de artesanías a la salida.',
    audio: 'El Museo de Culturas Indígenas Amazónicas acerca al visitante a la cosmovisión de los pueblos originarios de Loreto.',
    rating: 4.5,
    resenas: []
  },
  {
    id: 504,
    nombre: 'Casa Morey',
    categoria: 'turistico',
    subcategoria: 'Patrimonio / Arquitectura',
    calle: 'Malecón Tarapacá',
    direccion: 'Malecón Tarapacá, Centro de Iquitos',
    lat: -3.7472,
    lng: -73.2422,
    distancia: '0.2 km del Malecón Tarapacá',
    acceso: 'A pie desde el Malecón Tarapacá',
    costo: 'Acceso a fachada libre / hotel boutique',
    dificultad: 'Muy fácil',
    horario: '24 horas (fachada)',
    telefono: '+51965842100',
    descripcionCorta: 'Antigua mansión cauchera con fachada de azulejos portugueses, hoy convertida en hotel boutique.',
    descripcionLarga: 'Una de las mansiones más elegantes de la época del caucho, con azulejos traídos de Portugal e Italia. Hoy funciona como hotel boutique y conserva gran parte de su arquitectura original.',
    recomendaciones: 'Ideal para fotografiar la fachada al atardecer, junto con las demás casonas del Malecón Tarapacá.',
    audio: 'Casa Morey conserva en sus azulejos el lujo que trajo el caucho a orillas del río Amazonas.',
    rating: 4.6,
    resenas: []
  },
  {
    id: 505,
    nombre: 'Isla de los Monos',
    categoria: 'turistico',
    subcategoria: 'Naturaleza / Fauna',
    calle: 'Río Amazonas (acceso fluvial)',
    direccion: 'Isla de los Monos, Río Amazonas',
    lat: -3.8283,
    lng: -73.3706,
    distancia: '~30 km de Iquitos (vía fluvial)',
    acceso: 'Bote desde el embarcadero (aprox. 45 min - 1 h)',
    costo: 'Tour desde S/ 60.00 por persona',
    dificultad: 'Fácil',
    horario: 'Tours diurnos, 8:00 AM - 4:00 PM',
    telefono: '+51965842100',
    descripcionCorta: 'Santuario donde monos rescatados viven en semi-libertad rodeados de bosque inundable.',
    descripcionLarga: 'Refugio en una isla del Amazonas donde conviven distintas especies de monos rescatados del tráfico de fauna, en un entorno de bosque inundable. Los visitantes pueden observarlos e interactuar de cerca bajo supervisión.',
    recomendaciones: 'Llevar bloqueador solar, repelente y no dar de comer a los monos sin autorización del guía.',
    audio: 'La Isla de los Monos es un refugio de segunda oportunidad para primates rescatados en plena Amazonía.',
    rating: 4.7,
    resenas: []
  },
  {
    id: 506,
    nombre: 'Mariposario Pilpintuwasi & Padre Cocha',
    tarifaDesdePlaza: 'S/ 5.00 - S/ 7.00 hasta Bellavista Nanay + bote',
    categoria: 'turistico',
    subcategoria: 'Naturaleza / Fauna',
    calle: 'Padre Cocha (acceso fluvial)',
    direccion: 'Padre Cocha, frente a Bellavista Nanay',
    lat: -3.7267,
    lng: -73.2775,
    distancia: '~15 min en bote desde Bellavista Nanay',
    acceso: 'Bote desde el Embarcadero Bellavista Nanay',
    costo: 'Entrada S/ 20.00 aprox.',
    dificultad: 'Fácil',
    horario: 'Todos los días 9:00 AM - 4:30 PM',
    telefono: '+51965842100',
    descripcionCorta: 'Criadero de mariposas amazónicas que también alberga animales rescatados como el jaguar Pancho.',
    descripcionLarga: 'Pilpintuwasi (\'Casa de las mariposas\' en quechua) cría decenas de especies de mariposas amazónicas y alberga además otros animales rescatados: jaguares, tapires, monos y aves, en un recorrido guiado por senderos de selva.',
    recomendaciones: 'Combinar la visita con Bellavista Nanay y llevar cámara: las mariposas son más activas en horas de sol.',
    audio: 'Pilpintuwasi es un santuario donde la Amazonía protege a sus mariposas y a la fauna que el tráfico ilegal dejó sin hogar.',
    rating: 4.8,
    resenas: []
  },
  {
    id: 507,
    nombre: 'Puente Nanay y Mirador',
    categoria: 'turistico',
    subcategoria: 'Mirador / Vista al Río',
    calle: 'Puente Nanay (Carretera Iquitos - Bellavista)',
    direccion: 'Puente sobre el río Nanay, norte de Iquitos',
    lat: -3.7080,
    lng: -73.2630,
    distancia: '~5 km de Plaza de Armas',
    acceso: 'Mototaxi desde el centro (15 min)',
    tarifaDesdePlaza: 'S/ 5.00 - S/ 7.00',
    costo: 'Acceso libre',
    dificultad: 'Fácil',
    horario: 'Mejor al atardecer (5:30 PM - 6:30 PM)',
    telefono: '+51965842100',
    descripcionCorta: 'Vista panorámica sobre el río Nanay, ideal para ver el atardecer amazónico.',
    descripcionLarga: 'El puente más largo del Perú cruza el río Nanay y une Iquitos con las comunidades del norte. Desde su mirador se ve el río, la selva inundable y los botes que llegan a Bellavista Nanay, con atardeceres de colores intensos.',
    recomendaciones: 'Ir al atardecer, llevar repelente y agua. Acordar con el mototaxista el regreso o la espera.',
    audio: 'El Puente Nanay conecta Iquitos con la otra orilla del río. Desde aquí el horizonte de selva y agua se tiñe de naranja cada tarde.',
    rating: 4.7,
    resenas: []
  },
  {
    id: 508,
    nombre: 'Museo Barco Histórico Ayapua',
    categoria: 'turistico',
    subcategoria: 'Museo / Historia del Caucho',
    tieneAudioGuia: true,
    calle: 'Plaza Castilla / Malecón Maldonado',
    direccion: 'Plaza Castilla, cerca del Malecón de Iquitos',
    lat: -3.7446,
    lng: -73.2455,
    distancia: '~0.7 km de Plaza de Armas',
    acceso: 'A pie o mototaxi corto desde la Plaza de Armas',
    tarifaDesdePlaza: 'S/ 3.00 - S/ 4.00',
    costo: 'Entrada S/ 20 aprox.',
    dificultad: 'Muy fácil',
    horario: 'Todos los días 9:00 AM - 7:00 PM',
    telefono: '+51965842100',
    descripcionCorta: 'Barco a vapor de 1906, de la época del caucho, convertido en museo flotante.',
    descripcionLarga: 'El Ayapua es un barco construido en Alemania a inicios del siglo XX que navegó el Amazonas durante el boom del caucho. Hoy es un museo flotante que muestra cómo se vivía y comerciaba en la Amazonía de esa época.',
    recomendaciones: 'Combinar con el Malecón y la Casa de Fierro. La visita dura unos 45 minutos.',
    audio: 'A bordo del Ayapua viajamos a la época del caucho, cuando los vapores unían Iquitos con Europa y el río era la única carretera.',
    rating: 4.7,
    resenas: []
  }
];

let puntosLocales = [...PUNTOS_INICIALES];

// Tipo de cambio referencial solo para orientar al turista (no es tasa oficial de cambio).
const TIPO_CAMBIO_REF = 3.75;

// true entre 10:00 PM y 5:00 AM (recargo nocturno de mototaxi)
export function esHorarioNocturno(fecha = new Date()) {
  const h = fecha.getHours();
  return h >= 22 || h < 5;
}

// Tarifas EXCLUSIVAS de Mototaxi (único transporte soportado por la app), según distancia (metros).
// Incluye conversión referencial a USD y recargo nocturno (10 PM - 5 AM).
export function tarifaMototaxi(distanciaMetros, fecha = new Date()) {
  const km = distanciaMetros / 1000;
  let min, max, tramo, tramoKey;
  if (km < 3) { min = 3; max = 4; tramo = 'Corto (< 3 km)'; tramoKey = 'corto'; }
  else if (km <= 6) { min = 5; max = 7; tramo = 'Medio (3 - 6 km)'; tramoKey = 'medio'; }
  else { min = 8; max = 12; tramo = 'Largo (> 6 km)'; tramoKey = 'largo'; }

  const nocturno = esHorarioNocturno(fecha);
  const recargo = nocturno ? 1 : 0; // +S/ 1.00 - S/ 2.00, se muestra el mínimo del rango
  const recargoMax = nocturno ? 2 : 0;
  const minFinal = min + recargo;
  const maxFinal = max + recargoMax;

  const etiquetaBase = km > 12
    ? `S/ ${minFinal}.00 - S/ ${maxFinal + Math.round(km - 12)}.00+`
    : `S/ ${minFinal}.00 - S/ ${maxFinal}.00${km > 6 ? '+' : ''}`;

  const usdMin = (minFinal / TIPO_CAMBIO_REF).toFixed(2);
  const usdMax = (maxFinal / TIPO_CAMBIO_REF).toFixed(2);

  return {
    min: minFinal,
    max: maxFinal,
    tramo,
    tramoKey,
    nocturno,
    etiqueta: etiquetaBase,
    etiquetaUsd: `~$${usdMin} - $${usdMax} USD`,
    etiquetaCompleta: `${etiquetaBase} (${'~$'}${usdMin} - $${usdMax} USD)${nocturno ? ' · incluye recargo nocturno' : ''}`,
  };
}

export function obtenerPuntos() {
  return puntosLocales;
}

export function agregarPunto(nuevoPunto) {
  puntosLocales = [nuevoPunto, ...puntosLocales];
  listeners.forEach(fn => fn(puntosLocales));
  return puntosLocales;
}

// Edición rápida de admin: descripción, ubicación del marcador o tarifa base (S/ mínimo de mototaxi).
// Hoy muta el array en memoria (mismo patrón que agregarResenaAPunto); cuando exista backend real
// basta con reemplazar el cuerpo de esta función por una llamada a la API (ver services/api.js).
export function actualizarPunto(puntoId, cambios) {
  puntosLocales = puntosLocales.map((p) => (p.id === puntoId ? { ...p, ...cambios } : p));
  listeners.forEach((fn) => fn(puntosLocales));
  return puntosLocales.find((p) => p.id === puntoId);
}

export function agregarResenaAPunto(puntoId, resena) {
  puntosLocales = puntosLocales.map(p => {
    if (p.id === puntoId) {
      const resenas = [resena, ...(p.resenas || [])];
      return { ...p, resenas };
    }
    return p;
  });
  listeners.forEach(fn => fn(puntosLocales));
  return puntosLocales;
}

export function suscribirPuntos(callback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(fn => fn !== callback);
  };
}
