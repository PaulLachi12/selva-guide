import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  Pressable,
  StyleSheet,
  Alert
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import DrawerMenuModal from '../../src/components/DrawerMenuModal';
import ScreenHeader from '../../src/components/ScreenHeader';
import Icon from '../../src/components/Icon';
import { colors, space, radius, shadow } from '../../src/theme';

const VERDE = colors.primary;
const VERDE_CLARO = colors.primary;
const CREMA = colors.bg;
const BLANCO = colors.surface;
const TINTA = colors.text;
const GRIS = colors.textMuted;
const LINEA = colors.border;

const ZONAS = [
  { id: 'centro', nombre: 'Iquitos Centro & Malecón', desc: 'Belén, Casonas del Caucho, Malecón Tarapacá', tam: '18 MB', paquetes: 4 },
  { id: 'nanay', nombre: 'Ruta Fluvial Nanay & Momón', desc: 'Bellavista Nanay, Serpentario y Padre Cocha', tam: '34 MB', paquetes: 3 },
  { id: 'allpahuayo', nombre: 'Reserva Allpahuayo-Mishana & Nauta', desc: 'Bosque blanco, varillales y Quistococha', tam: '27 MB', paquetes: 3 },
];

const RETOS_PASAPORTE = [
  { id: 'suri', titulo: 'Comer un suri asado', desc: 'En Bellavista Nanay o Mercado de Belén', icono: 'bonfire-outline' },
  { id: 'peke', titulo: 'Navegar en peke-peke', desc: 'Surcar el Nanay o el Itaya en bote tradicional', icono: 'boat-outline' },
  { id: 'juane', titulo: 'Desatar un juane en bijao', desc: 'Tradición gastronómica amazónica con ají de cocona', icono: 'leaf-outline' },
  { id: 'manati', titulo: 'Visitar los manatíes en el CREA', desc: 'Conocer el centro de rescate de fauna silvestre', icono: 'water-outline' },
  { id: 'tarantula', titulo: 'Expedición nocturna en la selva', desc: 'Avistamiento de fauna con linternas de campo', icono: 'moon-outline' },
];

export default function MochilaScreen() {
  const db = useSQLiteContext();
  const [descargadas, setDescargadas] = useState({ centro: true });
  const [retosCompletados, setRetosCompletados] = useState({ juane: true });
  const [drawerVisible, setDrawerVisible] = useState(false);

  const alternarDescarga = (id, valor) => {
    const nuevo = { ...descargadas, [id]: valor };
    setDescargadas(nuevo);
    if (valor) {
      Alert.alert('Descarga completada', `La zona "${id}" ha sido guardada en SQLite para uso sin señal.`);
    }
  };

  const alternarReto = (id) => {
    const nuevo = { ...retosCompletados, [id]: !retosCompletados[id] };
    setRetosCompletados(nuevo);
  };

  const limpiarCache = () => {
    setDescargadas({});
    Alert.alert('Caché liberada', 'Se ha limpiado el almacenamiento local offline.');
  };

  const progreso = (Object.values(descargadas).filter(Boolean).length / ZONAS.length) * 100;
  const progresoRetos = Object.values(retosCompletados).filter(Boolean).length;

  return (
    <View style={{ flex: 1, backgroundColor: CREMA }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <ScreenHeader embedded title="Mochila" subtitle="Contenido sin conexión y tu progreso" onMenu={() => setDrawerVisible(true)} />
        </View>

        {/* TARJETA 1: ESTADO DEL ALMACENAMIENTO OFFLINE */}
        <View style={styles.tarjeta}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tarjetaTitulo}>Almacenamiento Offline en SQLite</Text>
              <Text style={styles.tarjetaDesc}>
                {Object.values(descargadas).filter(Boolean).length} de {ZONAS.length} zonas listas sin señal
              </Text>
            </View>
            <Pressable onPress={limpiarCache} style={styles.btnLimpiar}>
              <Text style={styles.btnLimpiarTexto}>Liberar</Text>
            </Pressable>
          </View>
          <View style={styles.barraFondo}>
            <View style={[styles.barraProgreso, { width: `${progreso}%` }]} />
          </View>
        </View>

        {/* SECCIÓN ZONAS DESCARGABLES */}
        <Text style={styles.seccionTitulo}>Paquetes de Mapas y Rutas</Text>
        {ZONAS.map((z) => {
          const act = !!descargadas[z.id];
          return (
            <View key={z.id} style={styles.tarjetaZona}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.zonaNombre}>{z.nombre}</Text>
                <Text style={styles.zonaDesc}>{z.desc}</Text>
                <Text style={styles.zonaTam}>
                   {z.tam} • {z.paquetes} circuitos con GPS
                </Text>
              </View>
              <Switch
                value={act}
                onValueChange={(v) => alternarDescarga(z.id, v)}
                trackColor={{ false: '#CBD5E1', true: VERDE_CLARO }}
                thumbColor={act ? VERDE : '#FFFFFF'}
              />
            </View>
          );
        })}

        {/* TARJETA 2: PASAPORTE SELVA GUÍA (GAMIFICACIÓN) */}
        <Text style={[styles.seccionTitulo, { marginTop: 22 }]}>
           Pasaporte Amazónico ({progresoRetos}/{RETOS_PASAPORTE.length} Retos)
        </Text>
        <Text style={styles.seccionNota}>
          Marca cada experiencia vivida para ganar tus sellos de explorador:
        </Text>

        <View style={styles.tarjeta}>
          {RETOS_PASAPORTE.map((reto, idx) => {
            const completado = !!retosCompletados[reto.id];
            return (
              <Pressable
                key={reto.id}
                onPress={() => alternarReto(reto.id)}
                style={[styles.retoFila, idx > 0 && styles.retoBorde]}
              >
                <View style={styles.retoIcono}><Icon name={reto.icono} size={20} color={colors.primary} /></View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.retoTitulo, completado && styles.retoCompletado]}>
                    {reto.titulo}
                  </Text>
                  <Text style={styles.retoDesc}>{reto.desc}</Text>
                </View>
                <View style={[styles.checkCircle, completado && styles.checkCircleActivo]}>
                  <Text style={{ color: completado ? BLANCO : colors.textSubtle, fontWeight: '700', fontSize: 12 }}>
                    {completado ? '' : '○'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* TIP DE CONEXIÓN */}
        <View style={styles.tipBox}>
          <Text style={styles.tipTitulo}>Modo Avión Activado:</Text>
          <Text style={styles.tipTexto}>
            Los mapas descargados y los audios funcionarán incluso si navegas en medio del río
            Amazonas sin ningún chip o señal telefónica.
          </Text>
        </View>
      </ScrollView>

      {/* Drawer Menú Lateral */}
      <DrawerMenuModal
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        rutaActual="/(tabs)/mochila"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  btnMenu: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  btnMenuTexto: {
    fontSize: 20,
    color: BLANCO,
    fontWeight: '700',
  },
  headerTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: BLANCO,
  },
  headerSub: {
    fontSize: 12,
    color: '#A8E6D9',
    marginTop: 2,
  },
  tarjeta: {
    backgroundColor: BLANCO,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: LINEA,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tarjetaTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: TINTA,
  },
  tarjetaDesc: {
    fontSize: 12,
    color: GRIS,
    marginTop: 2,
  },
  btnLimpiar: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnLimpiarTexto: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '700',
  },
  barraFondo: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginTop: 12,
  },
  barraProgreso: {
    height: 6,
    backgroundColor: VERDE_CLARO,
    borderRadius: 3,
  },
  seccionTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: TINTA,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 4,
  },
  seccionNota: {
    fontSize: 12,
    color: GRIS,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tarjetaZona: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BLANCO,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: LINEA,
  },
  zonaNombre: {
    fontSize: 14,
    fontWeight: '700',
    color: TINTA,
  },
  zonaDesc: {
    fontSize: 11,
    color: GRIS,
    marginTop: 2,
  },
  zonaTam: {
    fontSize: 11,
    color: VERDE,
    fontWeight: '600',
    marginTop: 4,
  },
  retoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  retoBorde: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceMuted,
  },
  retoIcono: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retoTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: TINTA,
  },
  retoCompletado: {
    textDecorationLine: 'line-through',
    color: colors.textSubtle,
  },
  retoDesc: {
    fontSize: 11,
    color: GRIS,
    marginTop: 1,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActivo: {
    backgroundColor: VERDE,
    borderColor: VERDE,
  },
  tipBox: {
    backgroundColor: colors.primarySoft,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: VERDE,
  },
  tipTitulo: {
    fontSize: 12,
    fontWeight: '700',
    color: VERDE,
    marginBottom: 2,
  },
  tipTexto: {
    fontSize: 11,
    color: '#065F46',
    lineHeight: 16,
  },
});
