import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet
} from 'react-native';
import { obtenerPuntos, suscribirPuntos } from '../../src/data/puntosData';
import DetallePuntoModal from '../../src/components/DetallePuntoModal';
import DrawerMenuModal from '../../src/components/DrawerMenuModal';
import ScreenHeader from '../../src/components/ScreenHeader';
import Icon from '../../src/components/Icon';
import { useTranslation } from 'react-i18next';
import { useThemedStyles } from '../../src/context/ThemeContext';
import { usePuntoTexto } from '../../src/i18n/contenido';

export default function ResenasScreen() {
  const { t } = useTranslation();
  const tp = usePuntoTexto();
  const styles = useThemedStyles(crearEstilos);
  const [puntos, setPuntos] = useState(obtenerPuntos());
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    return suscribirPuntos((nuevos) => setPuntos(nuevos));
  }, []);

  // Extraer todas las reseñas con referencia al lugar
  const todasResenas = [];
  puntos.forEach((p) => {
    if (p.resenas && p.resenas.length > 0) {
      p.resenas.forEach((r) => {
        todasResenas.push({
          ...r,
          lugarId: p.id,
          lugarNombre: tp(p, 'nombre'),
          lugarCategoria: p.categoria,
          puntoCompleto: p,
        });
      });
    }
  });

  const abrirLugar = (punto) => {
    setPuntoSeleccionado(punto);
    setModalVisible(true);
  };

  return (
    <View style={styles.contenedor}>
      {/* Header con botón Drawer */}
      <View style={styles.header}>
        <ScreenHeader embedded title={t('resenas.titulo')} subtitle={t('resenas.subtitulo')} onMenu={() => setDrawerVisible(true)} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {todasResenas.map((resena, index) => (
          <View key={`${resena.id}-${index}`} style={styles.card}>
            <Pressable
              onPress={() => abrirLugar(resena.puntoCompleto)}
              style={styles.lugarBadge}
            >
              <Text style={styles.lugarNombre} numberOfLines={1}>
                 {resena.lugarNombre}
              </Text>
              <Text style={styles.lugarLink}>{t('resenas.ver_lugar')}</Text>
            </Pressable>

            <View style={styles.autorRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{resena.autor.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.autorNombre}>{resena.autor}</Text>
                <Text style={styles.fecha}>{resena.fecha || t('resenas.reciente')}</Text>
              </View>
              <Text style={styles.ratingStars}>{'★'.repeat(resena.rating || 5)}</Text>
            </View>

            <Text style={styles.comentario}>"{resena.comentario}"</Text>
          </View>
        ))}
      </ScrollView>

      {/* Modal Detalle Lugar */}
      <DetallePuntoModal
        visible={modalVisible}
        punto={puntoSeleccionado}
        onClose={() => setModalVisible(false)}
      />

      {/* Drawer Menú Lateral */}
      <DrawerMenuModal
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        rutaActual="/(tabs)/resenas"
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
  lugarBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  lugarNombre: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
  },
  lugarLink: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 8,
  },
  autorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  autorNombre: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  fecha: {
    fontSize: 11,
    color: colors.textMuted,
  },
  ratingStars: {
    fontSize: 14,
    color: colors.star,
  },
  comentario: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
    fontStyle: 'italic',
  },
});
