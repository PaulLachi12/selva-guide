// Rutas guiadas con puntos de interés (POIs) para GPS.
// Coordenadas aproximadas de Iquitos y alrededores.

export const RUTAS = [
  {
    id: 'centro-historico',
    nombre: 'Centro histórico de Iquitos',
    zona: 'Iquitos — Centro',
    dificultad: 'Fácil',
    duracion: '60 – 90 min',
    distanciaKm: 1.6,
    icono: 'templo',
    descripcion:
      'Un paseo a pie por el corazón de la ciudad: plazas, casonas de la fiebre del caucho y el malecón frente al río Itaya.',
    puntos: [
      {
        id: 'plaza-armas',
        nombre: 'Plaza de Armas',
        lat: -3.7483,
        lng: -73.2445,
        radioM: 60,
        info: 'Corazón de Iquitos, rodeada de palmeras y de la Catedral. Punto de partida ideal.',
        narra: 'Estás en la Plaza de Armas de Iquitos. A tu alrededor, las palmeras y la catedral cuentan la historia de la ciudad que creció con la fiebre del caucho.'
      },
      {
        id: 'casa-fierro',
        nombre: 'Casa de Fierro',
        lat: -3.7479,
        lng: -73.2477,
        radioM: 50,
        info: 'Estructura de hierro diseñada por Gustave Eiffel, traída pieza por pieza desde Europa.',
        narra: 'La Casa de Fierro fue diseñada por Gustave Eiffel y llegó desarmada desde Europa. Cada remache que ves viajó miles de kilómetros hasta esta esquina de la Amazonía.'
      },
      {
        id: 'malecon-tarapaca',
        nombre: 'Malecón Tarapacá',
        lat: -3.7477,
        lng: -73.2520,
        radioM: 80,
        info: 'Bulevar junto al río Itaya, con vista a la ciudad baja y atardeceres sobre el agua.',
        narra: 'Caminas por el Malecón Tarapacá, frente al río Itaya. Al atardecer, el agua se vuelve dorada y las embarcaciones regresan a puerto.'
      },
      {
        id: 'iglesia-matriz',
        nombre: 'Iglesia Matriz',
        lat: -3.7494,
        lng: -73.2452,
        radioM: 50,
        info: 'Templo principal de la ciudad, con arquitectura neogótica y neocolonial.',
        narra: 'La Iglesia Matriz se levanta sobre la plaza. Su arquitectura mezcla el neogótico con el neocolonial, testigo del paso de muchos viajeros.'
      }
    ]
  },
  {
    id: 'belen-venecia',
    nombre: 'Belén, la Venecia amazónica',
    zona: 'Iquitos — Belén',
    dificultad: 'Media',
    duracion: '90 – 120 min',
    distanciaKm: 2.1,
    icono: 'bote',
    descripcion:
      'El barrio más auténtico de Iquitos: casas sobre pilotes, mercado flotante y la vida junto al río Amazonas.',
    puntos: [
      {
        id: 'mercado-belen',
        nombre: 'Mercado de Belén',
        lat: -3.7599,
        lng: -73.2434,
        radioM: 80,
        info: 'Mercado tradicional donde se venden frutas amazónicas, pescados y productos medicinales.',
        narra: 'El Mercado de Belén es un festival de aromas: camu camu, arazá, paiche y decenas de plantas medicinales que las vendedoras conocen por nombre propio.'
      },
      {
        id: 'pasaje-paquito',
        nombre: 'Pasaje Paquito',
        lat: -3.7580,
        lng: -73.2450,
        radioM: 50,
        info: 'Callejón célebre por sus brebajes medicinales y "siete raíces".',
        narra: 'En el Pasaje Paquito se ofrecen brebajes para todo: fuerza, memoria, amor. Los curanderos locales preparan aquí sus recetas de siete raíces.'
      },
      {
        id: 'belen-flotante',
        nombre: 'Belén flotante',
        lat: -3.7630,
        lng: -73.2400,
        radioM: 100,
        info: 'Zona de casas construidas sobre balsas y pilotes, que suben y bajan con el río.',
        narra: 'Llegaste al Belén flotante. Estas casas suben y bajan con la creciente del río Amazonas: la ciudad se adapta, no lucha contra el agua.'
      }
    ]
  },
  {
    id: 'quistococha',
    nombre: 'Quistococha y el bosque',
    zona: 'Quistococha',
    dificultad: 'Media',
    duracion: '2 – 3 h',
    distanciaKm: 3.2,
    icono: 'hoja',
    descripcion:
      'Bosque, laguna y centro de rescate de fauna a pocos kilómetros de Iquitos. Ideal para iniciar en la selva.',
    puntos: [
      {
        id: 'laguna-quistococha',
        nombre: 'Laguna de Quistococha',
        lat: -3.8280,
        lng: -73.3240,
        radioM: 120,
        info: 'Laguna de aguas oscuras rodeada de aguaje y vegetación de várzea.',
        narra: 'La laguna de Quistococha aparece entre los aguajes. Sus aguas oscuras reflejan el cielo y esconden peces, tortugas y la victoria regia flotando.'
      },
      {
        id: 'centro-rescate',
        nombre: 'Centro de rescate de fauna',
        lat: -3.8265,
        lng: -73.3266,
        radioM: 100,
        info: 'Espacio de conservación con especies rescatadas del tráfico de animales.',
        narra: 'Este centro rescata animales del tráfico ilegal: manatíes, otorongos y aves que, tras recuperarse, vuelven poco a poco a la libertad.'
      },
      {
        id: 'dosel-quistococha',
        nombre: 'Sendero del dosel',
        lat: -3.8248,
        lng: -73.3228,
        radioM: 80,
        info: 'Sendero interpretativo entre árboles gigantes y lianas.',
        narra: 'Avanzas por el sendero del dosel. Fíjate en las lianas y en el sonido del bosque: cada canto es un mensaje, cada hoja es un refugio.'
      }
    ]
  }
];

export const RUTA_POR_ID = (id) => RUTAS.find((r) => r.id === id) || null;

// Distancia en metros entre dos coordenadas (Haversine)
export function distanciaM([lat1, lng1], [lat2, lng2]) {
  const R = 6371000;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Rumbo (bearing) en grados desde el punto 1 al 2
export function rumbo([lat1, lng1], [lat2, lng2]) {
  const rad = (d) => (d * Math.PI) / 180;
  const deg = (r) => (r * 180) / Math.PI;
  const y = Math.sin(rad(lng2 - lng1)) * Math.cos(rad(lat2));
  const x =
    Math.cos(rad(lat1)) * Math.sin(rad(lat2)) -
    Math.sin(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(rad(lng2 - lng1));
  return (deg(Math.atan2(y, x)) + 360) % 360;
}