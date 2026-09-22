// Catálogo de flora y fauna — contenido local para funcionar sin conexión.
// Los campos `narra` son textos que se leen con síntesis de voz (Web Speech API).

const ICONO = {
  mamifero: 'mamifero',
  ave: 'ave',
  reptil: 'reptil',
  arbol: 'arbol',
  flor: 'flor',
  planta: 'planta'
};

export const CATALOGO = [
  {
    id: 'delfin-rosado',
    nombre: 'Delfín rosado',
    cientifico: 'Inia geoffrensis',
    tipo: 'Fauna',
    icono: ICONO.mamifero,
    nombres: ['Boto', 'Tucuxi', 'Delfín del Amazonas'],
    habitat: 'Ríos y lagunas de aguas turbias de la Amazonía',
    datos: [
      ['Peso', 'Hasta 185 kg'],
      ['Longitud', '2.0 – 2.7 m'],
      ['Esperanza de vida', '20 – 35 años'],
      ['Estado', 'Vulnerable']
    ],
    descripcion:
      'El delfín rosado habita los ríos turbios de la cuenca amazónica. Su color rosado se intensifica con la edad y, a diferencia de los delfines marinos, nada girando el cuello porque sus vértebras cervicales no están fusionadas.',
    datoCurioso:
      'Al nadar entre los troncos sumergidos de la cocha, el delfín rosado usa la ecolocación como cámara 3D: emite clics que rebotan y le dibujan el río en la oscuridad.',
    narra:
      'Soy el delfín rosado del río Amazonas. Los locales me llaman bufeo colorado. Nado entre los troncos sumergidos con mi ecolocación, y mi color rosado se vuelve más intenso con los años.',
    coord: [-3.77143, -73.29877]
  },
  {
    id: 'victoria-regia',
    nombre: 'Victoria regia',
    cientifico: 'Victoria amazonica',
    tipo: 'Flora',
    icono: ICONO.flor,
    nombres: ['Irupé', 'Loto gigante', 'Hoja de agua'],
    habitat: 'Aguas calmadas y someras de cochas y afluentes',
    datos: [
      ['Diámetro de hoja', 'Hasta 2.5 m'],
      ['Flor', 'Blanca la 1.ª noche, rosa la 2.ª'],
      ['Floración', 'Noche, hasta 2 noches'],
      ['Estado', 'No evaluado']
    ],
    descripcion:
      'Sus hojas circulares flotantes pueden superar los dos metros y soportar el peso de un niño pequeño. La flor se abre de noche: blanca la primera noche y rosada la segunda, cuando las polillas la polinizan.',
    datoCurioso:
      'Una hoja joven puede crecer hasta 20 centímetros por noche, desplegándose como un acordeón desde la superficie del agua.',
    narra:
      'Soy la Victoria regia, la reina de las cochas amazónicas. Mi hoja gigante llega a medir más de dos metros y mi flor se abre de noche, cambiando de color para invitar a las polillas.',
    coord: [-3.8265, -73.3266]
  },
  {
    id: 'tucan-pico-negro',
    nombre: 'Tucán de pico negro',
    cientifico: 'Ramphastos ambiguus',
    tipo: 'Fauna',
    icono: ICONO.ave,
    nombres: ['Tucán', 'Dios te dé'],
    habitat: 'Dosel de bosque húmedo y várzea',
    datos: [
      ['Tamaño', 'Hasta 50 cm'],
      ['Pico', 'Hasta 1/3 del cuerpo'],
      ['Peso', '600 – 700 g'],
      ['Alimentación', 'Frutas, insectos, huevos']
    ],
    descripcion:
      'El tucán usa su pico largo y liviano para alcanzar frutos en ramas delgadas y para termorregular: el pico se enfría o calienta como radiador. Vive en parejas o pequeñas bandadas que aletean entre el dosel.',
    datoCurioso:
      'Su pico, aunque enorme, pesa muy poco: está formado por una estructura de queratina con cavidades internas que lo hacen ligero y resistente.',
    narra:
      'Soy el tucán de pico negro. Mi pico enorme es ligero como una pluma y me ayuda a enfriarme cuando el sol de la selva aprieta en el dosel.',
    coord: [-3.8265, -73.3266]
  },
  {
    id: 'otorongo',
    nombre: 'Otorongo (Jaguar)',
    cientifico: 'Panthera onca',
    tipo: 'Fauna',
    icono: ICONO.mamifero,
    nombres: ['Yaguar', 'Jaguar', 'Tigre americano'],
    habitat: 'Bosque tropical y várzea cerca del agua',
    datos: [
      ['Peso', 'Hasta 120 kg (macho)'],
      ['Longitud', '1.5 – 2.4 m'],
      ['Mordida', 'La más fuerte entre felinos'],
      ['Estado', 'Casi amenazado']
    ],
    descripcion:
      'El otorongo es el felino más grande de América y un excelente nadador: cruza ríos y lagunas para cazar. Su mordida perfora caparazones de tortugas e incluso cráneos de caimanes. Es solitario y territorial.',
    datoCurioso:
      'A diferencia de otros grandes felinos, el otorongo no evita el agua y es capaz de nadar largas distancias persiguiendo presas dentro de la cocha.',
    narra:
      'Soy el otorongo, el señor de la selva. Mi mordida es la más poderosa entre los felinos y nado los ríos como si fueran mi casa, buscando mi territorio.',
    coord: [-3.8265, -73.3266]
  },
  {
    id: 'lupuna',
    nombre: 'Lupuna',
    cientifico: 'Ceiba pentandra',
    tipo: 'Flora',
    icono: ICONO.arbol,
    nombres: ['Ceiba', 'Capitán de la selva', 'Yanay puma'],
    habitat: 'Bosque de tierra firme y várzea alta',
    datos: [
      ['Altura', 'Hasta 70 m'],
      ['Tronco', '1.5 – 3 m de diámetro'],
      ['Contrafuertes', 'Hasta 6 m de alto'],
      ['Especie', 'Emblemática de la Amazonía']
    ],
    descripcion:
      'La lupuna es un árbol gigante que se alza por encima del dosel, con tronco gris y grandes contrafuertes que la anclan a la tierra. Para muchas comunidades es el "capitán de la selva" y guardián espiritual del bosque.',
    datoCurioso:
      'Sus semillas viajan por el viento dentro de una fibra algodonosa llamada kapok, que flota sobre las corrientes de aire a centenares de metros.',
    narra:
      'Soy la lupuna, el capitán de la selva. Desde mis setenta metros de altura veo pasar las nubes y escucho a las aves construir sus nidos en mi copa.',
    coord: [-3.8265, -73.3266]
  },
  {
    id: 'anaconda',
    nombre: 'Anaconda verde',
    cientifico: 'Eunectes murinus',
    tipo: 'Fauna',
    icono: ICONO.reptil,
    nombres: ['Serpiente de agua', 'Yakumama mamma'],
    habitat: 'Cochas, ríos lentos y pantanos',
    datos: [
      ['Longitud', 'Hasta 8 m (récord ~10 m)'],
      ['Peso', 'Hasta 100+ kg'],
      ['Alimentación', 'Pescados, aves, mamíferos'],
      ['Estado', 'Preocupación menor']
    ],
    descripcion:
      'La anaconda verde es una de las serpientes más pesadas del mundo y vive casi siempre dentro del agua. Mata por constricción: aprieta su presa en cada espiración hasta detener la circulación y luego la traga entera.',
    datoCurioso:
      'Puede permanecer horas sumergida casi inmóvil, con los ojos sobre la superficie, camuflada entre la vegetación flotante de la cocha.',
    narra:
      'Soy la anaconda verde, la dama de las aguas. Paseo lenta por las cochas y controlo mi temperatura tomando el sol en los troncos que flotan.',
    coord: [-3.8265, -73.3266]
  },
  {
    id: 'guacamayo-rojo',
    nombre: 'Guacamayo rojo',
    cientifico: 'Ara macao',
    tipo: 'Fauna',
    icono: ICONO.ave,
    nombres: ['Ara, Guacamaya colorada'],
    habitat: 'Bosque alto y collpas (barrancos de arcilla)',
    datos: [
      ['Tamaño', 'Hasta 90 cm'],
      ['Peso', 'Hasta 1.2 kg'],
      ['Vuelo', '49 km/h en picada'],
      ['Pareja', 'De por vida']
    ],
    descripcion:
      'Los guacamayos rojos forman parejas que duran toda la vida. Se reúnen en las collpas —barrancos de arcilla de las orillas— para comer tierra que neutraliza las toxinas de las frutas verdes del bosque.',
    datoCurioso:
      'Pueden aprender docenas de palabras y reconocer su reflejo; su cerebro procesa colores en cielo, vegetación y frutos con una precisión sorprendente.',
    narra:
      'Soy el guacamayo rojo. Vuelo en pareja con mi compañero de toda la vida hasta la collpa, donde comemos arcilla para calmar las toxinas de la selva.',
    coord: [-3.8265, -73.3266]
  },
  {
    id: 'sangre-de-grado',
    nombre: 'Sangre de grado',
    cientifico: 'Croton lechleri',
    tipo: 'Flora',
    icono: ICONO.planta,
    nombres: ['Sangre de drago', 'Agua espectáculo'],
    habitat: 'Bosque secundario y chacras (cultivos)',
    datos: [
      ['Látex', 'Rojo, coagulante'],
      ['Altura', 'Hasta 18 m'],
      ['Uso', 'Medicinal tradicional'],
      ['Origen', 'Nativa amazónica']
    ],
    descripcion:
      'Al cortar su corteza brota un látex rojo intenso como la sangre: por eso su nombre. Comunidades amazónicas lo usan desde siempre para cicatrizar heridas, úlceras y problemas digestivos.',
    datoCurioso:
      'Su resina roja es tan biodisponible que hoy se estudia en laboratorios de todo el mundo como base de ungüentos y protectores gastrointestinales.',
    narra:
      'Soy la sangre de grado. Dentro de mi corteza guardo un látex rojo que las comunidades usan desde siglos para curar heridas y consuelos del estómago.',
    coord: [-3.8265, -73.3266]
  }
];

export const BUSCAR_CATALOGO = (q = '') => {
  const texto = q.trim().toLowerCase();
  if (!texto) return CATALOGO;
  return CATALOGO.filter((e) =>
    [e.nombre, e.cientifico, e.tipo, ...(e.nombres || []), e.habitat]
      .join(' ')
      .toLowerCase()
      .includes(texto)
  );
};

export const POR_ID = (id) => CATALOGO.find((e) => e.id === id) || null;