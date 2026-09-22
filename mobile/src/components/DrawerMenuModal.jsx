import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';
import { colors, radius, space } from '../theme';

const SECCIONES = [
  {
    titulo: 'Explorar',
    items: [
      { label: 'Mapa', sub: 'Lugares cerca de ti', icon: 'map-outline', ruta: '/(tabs)' },
      { label: 'Gastronomía', sub: 'Restaurantes y mercados', icon: 'restaurant-outline', ruta: '/(tabs)/gastronomia' },
      { label: 'Rutas y experiencias', sub: 'Tours y excursiones', icon: 'compass-outline', ruta: '/(tabs)/experiencias' },
      { label: 'Reseñas', sub: 'Opiniones de viajeros', icon: 'star-outline', ruta: '/(tabs)/resenas' },
    ],
  },
  {
    titulo: 'Tu viaje',
    items: [
      { label: 'Mochila', sub: 'Contenido disponible sin conexión', icon: 'cloud-download-outline', ruta: '/(tabs)/mochila' },
      { label: 'Ayuda y tarifas', sub: 'Emergencias y precios de transporte', icon: 'medkit-outline', ruta: '/(tabs)/emergencia' },
    ],
  },
  {
    titulo: 'Administración',
    items: [
      { label: 'Agregar lugar', sub: 'Publicar un nuevo punto en el mapa', icon: 'add-circle-outline', ruta: '/admin/nuevo-punto' },
    ],
  },
];

export default function DrawerMenuModal({ visible, onClose, rutaActual }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const navegar = (ruta) => {
    onClose();
    router.push(ruta);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.drawer, { paddingTop: insets.top + space.lg }]}>
          <View style={styles.header}>
            <View style={styles.logo}>
              <Icon name="leaf" size={18} color={colors.onPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.appTitle}>Selva Guía</Text>
              <Text style={styles.appSub}>Iquitos, Loreto</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10} style={styles.btnClose}>
              <Icon name="close" size={22} color={colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: space.xl }} showsVerticalScrollIndicator={false}>
            {SECCIONES.map((sec) => (
              <View key={sec.titulo} style={{ marginTop: space.lg }}>
                <Text style={styles.seccion}>{sec.titulo.toUpperCase()}</Text>
                {sec.items.map((item) => {
                  const activo = rutaActual === item.ruta;
                  return (
                    <Pressable
                      key={item.ruta}
                      onPress={() => navegar(item.ruta)}
                      style={({ pressed }) => [styles.item, activo && styles.itemActivo, pressed && { opacity: 0.6 }]}
                    >
                      <Icon name={item.icon} size={20} color={activo ? colors.primary : colors.textMuted} />
                      <View style={{ flex: 1, marginLeft: space.md }}>
                        <Text style={[styles.label, activo && { color: colors.primary }]}>{item.label}</Text>
                        <Text style={styles.sub}>{item.sub}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + space.md }]}>
            <Text style={styles.footerText}>Versión 1.0.0</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(16,24,20,0.45)' },
  drawer: { width: '80%', maxWidth: 320, height: '100%', backgroundColor: colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    paddingBottom: space.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space.md,
  },
  appTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  appSub: { fontSize: 13, color: colors.textMuted, marginTop: 1 },
  btnClose: { padding: 4 },
  seccion: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: colors.textSubtle,
    paddingHorizontal: space.lg,
    marginBottom: space.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    marginHorizontal: space.sm,
    borderRadius: radius.md,
  },
  itemActivo: { backgroundColor: colors.primarySoft },
  label: { fontSize: 15, fontWeight: '600', color: colors.text },
  sub: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  footer: {
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  footerText: { fontSize: 12, color: colors.textSubtle },
});
