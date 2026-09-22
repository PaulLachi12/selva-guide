import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet
} from 'react-native';
import { obtenerPuntos } from '../../src/data/puntosData';
import DetallePuntoModal from '../../src/components/DetallePuntoModal';
import DrawerMenuModal from '../../src/components/DrawerMenuModal';
import ScreenHeader from '../../src/components/ScreenHeader';
import Icon from '../../src/components/Icon';
import { colors, space, radius, shadow } from '../../src/theme';

const VERDE_N = colors.primary;
const VERDE_B = colors.primary;
const BLANCO = colors.surface;
const TINTA = colors.text;
const GRIS = colors.textMuted;
const CREMA = colors.bg;

export default function ExperienciasScreen() {
  const puntos = obtenerPuntos();
  const experiencias = puntos.filter(
    (p) => p.categoria === 'deportivo' || p.categoria === 'turistico'
  );

  const [filtro, setFiltro] = useState('todas');
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const filtrados = experiencias.filter((p) => {
    if (filtro === 'todas') return true;
    if (filtro === 'extremo') return p.categoria === 'deportivo';
    if (filtro === 'naturaleza') return p.categoria === 'turistico';
    return true;
  });

  const abrirDetalle = (p) => {
    setPuntoSeleccionado(p);
    setModalVisible(true);
  };

  return (
    <View style={styles.contenedor}>
      {/* Header con botón Drawer */}
      <View style={styles.header}>
        <ScreenHeader embedded title="Rutas y experiencias" subtitle="Excursiones, paseos por el río y selva" onMenu={() => setDrawerVisible(true)} />
      </View>

      {/* Filtros */}
      <View style={styles.filtrosRow}>
        {[
          { key: 'todas', label: 'Todas las Rutas' },
          { key: 'extremo', label: 'Adrenalina / Off-Road' },
          { key: 'naturaleza', label: 'Naturaleza & Reserva' },
        ].map((f) => {
          const act = filtro === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFiltro(f.key)}
              style={[styles.btnFiltro, act && styles.btnFiltroActivo]}
            >
              <Text style={[styles.filtroTexto, act && styles.filtroTextoActivo]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {filtrados.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => abrirDetalle(item)}
            style={styles.card}
          >
            <View style={styles.cardTop}>
              <View style={[styles.badge, item.categoria === 'deportivo' ? styles.badgeExtremo : styles.badgeNaturaleza]}>
                <Text style={styles.badgeTexto}>
                  {item.categoria === 'deportivo' ? ' Adrenalina' : ' Naturaleza'}
                </Text>
              </View>
              <Text style={styles.dificultadTexto}>Nivel: {item.dificultad}</Text>
            </View>

            <Text style={styles.cardTitulo}>{item.nombre}</Text>
            <Text style={styles.cardDesc}>{item.descripcionCorta}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoItem}>⏱ {item.horario || 'Diario'}</Text>
              <Text style={styles.infoItem}>{item.distancia}</Text>
            </View>

            <View style={styles.footerCard}>
              <Text style={styles.costoTexto}>{item.costo}</Text>
              <Text style={styles.btnAccion}>Explorar ruta →</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Modal Detalle */}
      <DetallePuntoModal
        visible={modalVisible}
        punto={puntoSeleccionado}
        onClose={() => setModalVisible(false)}
      />

      {/* Drawer Menú Lateral */}
      <DrawerMenuModal
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        rutaActual="/(tabs)/experiencias"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: CREMA,
  },
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
    fontSize: 20,
    fontWeight: '700',
    color: BLANCO,
  },
  headerSub: {
    fontSize: 12,
    color: '#A7F3D0',
    marginTop: 4,
  },
  filtrosRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: BLANCO,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  btnFiltro: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    marginRight: 8,
  },
  btnFiltroActivo: {
    backgroundColor: VERDE_B,
  },
  filtroTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filtroTextoActivo: {
    color: BLANCO,
  },
  scroll: {
    flex: 1,
  },
  card: {
    backgroundColor: BLANCO,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeExtremo: {
    backgroundColor: '#FFE4E6',
  },
  badgeNaturaleza: {
    backgroundColor: '#DCFCE7',
  },
  badgeTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },
  dificultadTexto: {
    fontSize: 11,
    color: GRIS,
  },
  cardTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: TINTA,
    marginTop: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: GRIS,
    marginTop: 4,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 14,
  },
  infoItem: {
    fontSize: 12,
    color: '#334155',
  },
  footerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceMuted,
    paddingTop: 10,
  },
  costoTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: VERDE_N,
  },
  btnAccion: {
    fontSize: 12,
    fontWeight: '700',
    color: VERDE_B,
  },
});
