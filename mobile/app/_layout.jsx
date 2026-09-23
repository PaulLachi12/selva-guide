import { Suspense } from 'react';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import { Stack } from 'expo-router';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n';
import { AuthProvider } from '../src/context/AuthContext';

async function migrar(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS guia (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      especialidad TEXT NOT NULL,
      disponible INTEGER NOT NULL DEFAULT 1,
      precio NUMERIC NOT NULL DEFAULT 0,
      duracion INTEGER NOT NULL DEFAULT 4,
      telefono TEXT,
      foto TEXT,
      resena TEXT
    );
    CREATE TABLE IF NOT EXISTS paquete (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      categoria TEXT,
      precio NUMERIC NOT NULL DEFAULT 0,
      duracion INTEGER NOT NULL DEFAULT 4,
      guia_id INTEGER,
      lat NUMERIC,
      lng NUMERIC,
      FOREIGN KEY (guia_id) REFERENCES guia (id)
    );
  `);

  const cg = await db.getFirstAsync('SELECT COUNT(*) AS n FROM guia');
  if (!cg || cg.n === 0) {
    await db.withTransactionAsync(async () => {
      await db.runAsync(`INSERT INTO guia (nombre, especialidad, disponible, precio, duracion, telefono, resena) VALUES
        ('Juan del Aguila Miranda', 'Senderismo', 1, 70, 6, '+51987654321', 'Nacido en el rio Napo. Conoce cada raiz del sendero Ampiyacu y cuenta historias de los arboles como nadie.'),
        ('Maria Chuqui Torres', 'Navegacion', 1, 85, 8, '+51965432100', 'Capitan de rio con 12 anos remando el Amazonas. Sabe leer las corrientes y a los delfines grises.'),
        ('Pedro Yumbato Inuma', 'Cultural', 1, 60, 4, '+51932109876', 'Maestro de la ceramica nativa. Descendiente de la tradicion Kukama, comparte ritos y leyendas de la cosmovision amazonica.'),
        ('Rosa Doig Vargas', 'Gastronomia', 1, 90, 5, '+51910203040', 'Chef de la cocina amazonica 100% local. Del juane a la chonta, de la mano de la abuela y el abuelo.'),
        ('Carlos Ahuite Arevalo', 'Aventura', 1, 75, 9, '+51977889900', 'Expedicionario del cauce de los delfines rosados. Kayak, avistamiento y selva profunda sin miedo.')
      `);
    });
  }

  const cp = await db.getFirstAsync('SELECT COUNT(*) AS n FROM paquete');
  if (!cp || cp.n === 0) {
    await db.withTransactionAsync(async () => {
      await db.runAsync(`INSERT INTO paquete (titulo, descripcion, categoria, precio, duracion, guia_id, lat, lng) VALUES
        ('Caminata al Sendero Ampiyacu', 'Caminata editorial de 6 horas por la trocha del rio, siguiendo huellas que Juan conoce de memoria.', 'Senderismo', 190, 6, 1, -3.4833, -72.0333),
        ('Navegando el Amazonas', 'Travesia en bote por las curvas del gran rio. Delfines grises y rosados al amanecer, con Maria.', 'Navegacion', 260, 8, 2, -3.7487, -73.2492),
        ('Tarde ritual con Pedro', 'El maestro ceramista abre su taller: barro del rio, leyendas Kukama y una pieza para llevar.', 'Cultural', 120, 4, 3, -4.0915, -70.0316),
        ('Cocina de la abuela amazonica', 'Con Rosa: recolectar chonta, envolver juane en bijao y cocinar a la lena.', 'Gastronomia', 180, 5, 4, -3.1422, -74.2497),
        ('Expedicion kayak al cano', 'Remo por caletas escondidas con Carlos. Monos, aguas que cambian de color con la marea.', 'Aventura', 220, 9, 5, -12.0464, -77.0428)
      `);
    });
  }
}

export default function Layout() {
  return (
    <Suspense fallback={
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F1EA' }}>
        <ActivityIndicator size="large" color="#1B4332" />
        <Text style={{ marginTop: 12, fontFamily: 'Georgia', fontSize: 14, color: '#0E1D17' }}>Preparando SelvaGuide...</Text>
      </View>
    }>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <SQLiteProvider databaseName="selvaguide.db" onInit={migrar} useSuspense>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F1EA" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F4F1EA' } }} />
          </SQLiteProvider>
        </AuthProvider>
      </I18nextProvider>
    </Suspense>
  );
}
