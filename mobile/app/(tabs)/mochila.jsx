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
import { useTranslation } from 'react-i18next';
import { useTheme, useThemedStyles } from '../../src/context/ThemeContext';

// Textos en mochila.zonas.<id>.* y mochila.retos.<id>.*

const ZONAS = [
  { id: 'centro', tam: '18 MB', paquetes: 4 },
  { id: 'nanay', tam: '34 MB', paquetes: 3 },
  { id: 'allpahuayo', tam: '27 MB', paquetes: 3 },
];

const RETOS_PASAPORTE = [
  { id: 'suri', icono: 'bonfire-outline' },
  { id: 'peke', icono: 'boat-outline' },
  { id: 'juane', icono: 'leaf-outline' },
  { id: 'manati', icono: 'water-outline' },
  { id: 'tarantula', icono: 'moon-outline' },
];

export default function MochilaScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(crearEstilos);
  const db = useSQLiteContext();
  const [descargadas, setDescargadas] = useState({ centro: true });
  const [retosCompletados, setRetosCompletados] = useState({ juane: true });
  const [drawerVisible, setDrawerVisible] = useState(false);

  const alternarDescarga = (id, valor) => {
    const nuevo = { ...descargadas, [id]: valor };
    setDescargadas(nuevo);
    if (valor) {
      Alert.alert(t('mochila.descarga_titulo'), t('mochila.descarga_msg', { zona: t(`mochila.zonas.${id}.nombre`) }));
    }
  };

  const alternarReto = (id) => {
    const nuevo = { ...retosCompletados, [id]: !retosCompletados[id] };
    setRetosCompletados(nuevo);
  };

  const limpiarCache = () => {
    setDescargadas({});
    Alert.alert(t('mochila.cache_titulo'), t('mochila.cache_msg'));
  };

  const progreso = (Object.values(descargadas).filter(Boolean).length / ZONAS.length) * 100;
  const progresoRetos = Object.values(retosCompletados).filter(Boolean).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <ScreenHeader embedded title={t('mochila.titulo')} subtitle={t('mochila.subtitulo')} onMenu={() => setDrawerVisible(true)} />
        </View>

        {/* TARJETA 1: ESTADO DEL ALMACENAMIENTO OFFLINE */}
        <View style={styles.tarjeta}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tarjetaTitulo}>{t('mochila.almacenamiento_titulo')}</Text>
              <Text style={styles.tarjetaDesc}>
                {t('mochila.zonas_listas', { listas: Object.values(descargadas).filter(Boolean).length, total: ZONAS.length })}
              </Text>
            </View>
            <Pressable onPress={limpiarCache} style={styles.btnLimpiar}>
              <Text style={styles.btnLimpiarTexto}>{t('mochila.liberar')}</Text>
            </Pressable>
          </View>
          <View style={styles.barraFondo}>
            <View style={[styles.barraProgreso, { width: `${progreso}%` }]} />
          </View>
        </View>

        {/* SECCIÓN ZONAS DESCARGABLES */}
        <Text style={styles.seccionTitulo}>{t('mochila.paquetes_titulo')}</Text>
        {ZONAS.map((z) => {
          const act = !!descargadas[z.id];
          return (
            <View key={z.id} style={styles.tarjetaZona}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.zonaNombre}>{t(`mochila.zonas.${z.id}.nombre`)}</Text>
                <Text style={styles.zonaDesc}>{t(`mochila.zonas.${z.id}.desc`)}</Text>
                <Text style={styles.zonaTam}>
                   {t('mochila.tam_circuitos', { tam: z.tam, n: z.paquetes })}
                </Text>
              </View>
              <Switch
                value={act}
                onValueChange={(v) => alternarDescarga(z.id, v)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={act ? colors.primary : colors.surface}
              />
            </View>
          );
        })}

        {/* TARJETA 2: PASAPORTE SELVA GUÍA (GAMIFICACIÓN) */}
        <Text style={[styles.seccionTitulo, { marginTop: 22 }]}>
           {t('mochila.pasaporte_titulo', { hechos: progresoRetos, total: RETOS_PASAPORTE.length })}
        </Text>
        <Text style={styles.seccionNota}>
          {t('mochila.pasaporte_nota')}
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
                    {t(`mochila.retos.${reto.id}.titulo`)}
                  </Text>
                  <Text style={styles.retoDesc}>{t(`mochila.retos.${reto.id}.desc`)}</Text>
                </View>
                <View style={[styles.checkCircle, completado && styles.checkCircleActivo]}>
                  <Text style={{ color: completado ? colors.onPrimary : colors.textSubtle, fontWeight: '700', fontSize: 12 }}>
                    {completado ? '' : '○'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* TIP DE CONEXIÓN */}
        <View style={styles.tipBox}>
          <Text style={styles.tipTitulo}>{t('mochila.tip_titulo')}</Text>
          <Text style={styles.tipTexto}>
            {t('mochila.tip_texto')}
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

const crearEstilos = (colors) => StyleSheet.create({
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  headerSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  tarjeta: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tarjetaTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  tarjetaDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  btnLimpiar: {
    backgroundColor: colors.dangerSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnLimpiarTexto: {
    color: colors.danger,
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
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  seccionTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 4,
  },
  seccionNota: {
    fontSize: 12,
    color: colors.textMuted,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tarjetaZona: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  zonaNombre: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  zonaDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  zonaTam: {
    fontSize: 11,
    color: colors.primary,
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
    color: colors.text,
  },
  retoCompletado: {
    textDecorationLine: 'line-through',
    color: colors.textSubtle,
  },
  retoDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tipBox: {
    backgroundColor: colors.primarySoft,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  tipTitulo: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  tipTexto: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
});
