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
import { useTranslation } from 'react-i18next';
import { useThemedStyles } from '../../src/context/ThemeContext';
import { usePuntoTexto } from '../../src/i18n/contenido';

const FILTROS = ['todas', 'extremo', 'naturaleza'];

export default function ExperienciasScreen() {
  const { t } = useTranslation();
  const tp = usePuntoTexto();
  const styles = useThemedStyles(crearEstilos);
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
        <ScreenHeader embedded title={t('rutas.titulo')} subtitle={t('rutas.subtitulo')} onMenu={() => setDrawerVisible(true)} />
      </View>

      {/* Filtros */}
      <View style={styles.filtrosRow}>
        {FILTROS.map((key) => {
          const f = { key, label: t(`rutas.filtro_${key}`) };
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
                <Text style={styles.badgeTexto} numberOfLines={1}>
                  {item.categoria === 'deportivo' ? t('rutas.badge_adrenalina') : t('rutas.badge_naturaleza')}
                </Text>
              </View>
            </View>

            <Text style={styles.cardTitulo} numberOfLines={2} ellipsizeMode="tail">{tp(item, 'nombre')}</Text>
            <Text style={styles.cardDesc} numberOfLines={2} ellipsizeMode="tail">{tp(item, 'descripcionCorta')}</Text>

            <View style={styles.footerCard}>
              <View style={styles.infoRow}>
                <Text style={[styles.costoTexto, styles.textoFlexible]} numberOfLines={1} ellipsizeMode="tail">
                  {tp(item, 'costo')}
                </Text>
                <Text style={[styles.infoItem, styles.textoFlexible, { textAlign: 'right' }]} numberOfLines={1} ellipsizeMode="tail">
                  {tp(item, 'distancia')}
                </Text>
              </View>
              <Text style={styles.infoItem} numberOfLines={1} ellipsizeMode="tail">⏱ {tp(item, 'horario') || t('rutas.diario')}</Text>
              <Pressable
                onPress={() => abrirDetalle(item)}
                style={styles.btnAccion}
              >
                <Text style={styles.btnAccionTexto}>{t('rutas.explorar_como_llegar')}</Text>
              </Pressable>
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

const crearEstilos = (colors) => StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  btnMenu: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
  },
  btnMenuTexto: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '700',
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  headerSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  filtrosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
    padding: 12,
    backgroundColor: colors.surface,
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
    backgroundColor: colors.primary,
  },
  filtroTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  filtroTextoActivo: {
    color: colors.onPrimary,
  },
  scroll: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.surface,
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
    backgroundColor: colors.dangerSoft,
  },
  badgeNaturaleza: {
    backgroundColor: colors.primarySoft,
  },
  badgeTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  cardTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  textoFlexible: {
    flexShrink: 1,
  },
  infoItem: {
    fontSize: 12,
    color: colors.text,
  },
  footerCard: {
    gap: 6,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceMuted,
    paddingTop: 10,
  },
  costoTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  btnAccion: {
    width: '100%',
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  btnAccionTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.onPrimary,
  },
});
