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
import { useTheme, useThemedStyles } from '../../src/context/ThemeContext';
import { usePuntoTexto } from '../../src/i18n/contenido';

// Diccionario visual de platos amazónicos. Textos en gastro.platos.<id>.<campo>
const DICCIONARIO_PLATOS = [
  { id: 'juane', icono: 'leaf-outline' },
  { id: 'tacacho', icono: 'flame-outline' },
  { id: 'paiche', icono: 'fish-outline' },
  { id: 'patarashca', icono: 'leaf-outline' },
  { id: 'chonta', icono: 'nutrition-outline' },
  { id: 'suri', icono: 'bonfire-outline' },
  { id: 'camucamu', icono: 'cafe-outline' },
];

const NIVELES = [
  { key: 'todos', icon: 'restaurant-outline' },
  { key: 'alta', icon: 'diamond-outline' },
  { key: 'intermedio', icon: 'boat-outline' },
  { key: 'popular', icon: 'storefront-outline' },
];

export default function GastronomiaScreen() {
  const { t } = useTranslation();
  const tp = usePuntoTexto();
  const { colors } = useTheme();
  const styles = useThemedStyles(crearEstilos);
  const puntos = obtenerPuntos();
  const gastronomicos = puntos.filter((p) => p.categoria === 'gastronomico');

  const [vistaActual, setVistaActual] = useState('lugares'); // 'lugares' o 'diccionario'
  const [nivelSeleccionado, setNivelSeleccionado] = useState('todos');
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const filtrados = gastronomicos.filter((p) => {
    if (nivelSeleccionado === 'todos') return true;
    if (nivelSeleccionado === 'alta') return p.subcategoria.includes('Alta Gama');
    if (nivelSeleccionado === 'intermedio') return p.subcategoria.includes('Intermedio');
    if (nivelSeleccionado === 'popular') return p.subcategoria.includes('Popular');
    return true;
  });

  const abrirDetalle = (punto) => {
    setPuntoSeleccionado(punto);
    setModalVisible(true);
  };

  return (
    <View style={styles.contenedor}>
      {/* Header con botón Drawer */}
      <View style={styles.header}>
        <ScreenHeader embedded title={t('gastro.titulo')} subtitle={t('gastro.subtitulo')} onMenu={() => setDrawerVisible(true)} />

        {/* Selector de Pestaña Principal: Lugares vs Diccionario */}
        <View style={styles.tabSelector}>
          <Pressable
            onPress={() => setVistaActual('lugares')}
            style={[styles.tabBtn, vistaActual === 'lugares' && styles.tabBtnActivo]}
          >
            <Text style={[styles.tabBtnTexto, vistaActual === 'lugares' && styles.tabBtnTextoActivo]}>{t('gastro.tab_lugares')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setVistaActual('diccionario')}
            style={[styles.tabBtn, vistaActual === 'diccionario' && styles.tabBtnActivo]}
          >
            <Text style={[styles.tabBtnTexto, vistaActual === 'diccionario' && styles.tabBtnTextoActivo]}>{t('gastro.tab_platos')}
            </Text>
          </Pressable>
        </View>
      </View>

      {vistaActual === 'lugares' ? (
        <>
          {/* Selector de Niveles con Altura Compacta Natural */}
          <View style={styles.nivelesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}
            >
              {NIVELES.map((n) => {
                const act = nivelSeleccionado === n.key;
                return (
                  <Pressable
                    key={n.key}
                    onPress={() => setNivelSeleccionado(n.key)}
                    style={[styles.nivelChip, act && styles.nivelChipActivo]}
                  >
                    <Icon name={n.icon} size={16} color={act ? colors.onPrimary : colors.textMuted} />
                    <Text style={[styles.nivelTexto, act && styles.nivelTextoActivo]}>
                      {t(`gastro.nivel_${n.key}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Lista de Restaurantes Escroleable */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
            showsVerticalScrollIndicator={true}
          >
            {filtrados.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => abrirDetalle(item)}
                style={styles.card}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.badgeNivel}>
                    <Text style={styles.badgeNivelTexto}>{tp(item, 'subcategoria')}</Text>
                  </View>
                  <Text style={styles.ratingText}>{item.rating || 4.8}</Text>
                </View>

                <Text style={styles.cardTitulo}>{tp(item, 'nombre')}</Text>
                <Text style={styles.cardDesc}>{tp(item, 'descripcionCorta')}</Text>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                  <Text style={styles.cardCosto}>{tp(item, 'costo')}</Text>
                  <Text style={styles.btnVer}>{t('gastro.ver_platos_audio')}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : (
        /* Diccionario Visual de Comida Amazónica Escroleable */
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.introDiccionario}>
            <Text style={styles.introTitulo}>{t('gastro.intro_titulo')}</Text>
            <Text style={styles.introSub}>
              {t('gastro.intro_sub')}
            </Text>
          </View>

          {DICCIONARIO_PLATOS.map((plato) => (
            <View key={plato.id} style={styles.cardPlato}>
              <View style={styles.platoTop}>
                <View style={styles.platoIcono}><Icon name={plato.icono} size={22} color={colors.accent} /></View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.platoTitulo}>{t(`gastro.platos.${plato.id}.nombre`)}</Text>
                  <Text style={styles.platoAudacia}>{t('gastro.audacia', { nivel: t(`gastro.platos.${plato.id}.audacia`) })}</Text>
                </View>
              </View>

              <Text style={styles.platoQueEs}>{t(`gastro.platos.${plato.id}.queEs`)}</Text>

              <View style={styles.tipPlato}>
                <Text style={styles.tipPlatoLabel}>{t('gastro.como_se_disfruta')}</Text>
                <Text style={styles.tipPlatoTexto}>{t(`gastro.platos.${plato.id}.comoComer`)}</Text>
              </View>

              <Text style={styles.platoPrecio}>{t('gastro.precio_aprox', { precio: t(`gastro.platos.${plato.id}.precioAprox`) })}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal de Detalle */}
      <DetallePuntoModal
        visible={modalVisible}
        punto={puntoSeleccionado}
        onClose={() => setModalVisible(false)}
      />

      {/* Drawer Menú Lateral */}
      <DrawerMenuModal
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        rutaActual="/(tabs)/gastronomia"
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
    marginTop: 2,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 10,
    padding: 4,
    marginTop: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActivo: {
    backgroundColor: colors.surface,
  },
  tabBtnTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabBtnTextoActivo: {
    color: colors.primary,
    fontWeight: '700',
  },
  nivelesContainer: {
    height: 52,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    justifyContent: 'center',
  },
  nivelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    height: 36,
  },
  nivelChipActivo: {
    backgroundColor: colors.primary,
  },
  nivelIcon: {
    marginRight: 6,
  },
  nivelTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  nivelTextoActivo: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeNivel: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeNivelTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.star,
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
  divider: {
    height: 1,
    backgroundColor: colors.surfaceMuted,
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCosto: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  btnVer: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },

  // Estilos del Diccionario
  introDiccionario: {
    backgroundColor: colors.primarySoft,
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  introTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  introSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  cardPlato: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  platoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  platoIcono: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  platoAudacia: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '700',
    marginTop: 2,
  },
  platoQueEs: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
    marginBottom: 8,
  },
  tipPlato: {
    backgroundColor: colors.bg,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
  },
  tipPlatoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 2,
  },
  tipPlatoTexto: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
  platoPrecio: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
