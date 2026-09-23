import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';
import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';
import { IDIOMAS } from '../i18n/locales';
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
];

const ITEM_ADMIN = { label: 'Agregar lugar', sub: 'Publicar un nuevo punto en el mapa', icon: 'add-circle-outline', ruta: '/admin/nuevo-punto' };

export default function DrawerMenuModal({ visible, onClose, rutaActual }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { usuario, esAdmin, cerrarSesion, cambiarIdioma, activarModoAdmin } = useAuth();
  const [loginVisible, setLoginVisible] = useState(false);
  const [selectorIdiomaVisible, setSelectorIdiomaVisible] = useState(false);

  const navegar = (ruta) => {
    onClose();
    router.push(ruta);
  };

  const idiomaActual = IDIOMAS.find((i) => i.code === i18n.language) || IDIOMAS[0];

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
            <View style={{ marginTop: space.lg }}>
              <Text style={styles.seccion}>PERFIL</Text>

              <Pressable
                style={styles.item}
                onPress={() => (usuario ? cerrarSesion() : setLoginVisible(true))}
              >
                <Icon name={usuario ? 'log-out-outline' : 'log-in-outline'} size={20} color={colors.textMuted} />
                <View style={{ flex: 1, marginLeft: space.md }}>
                  <Text style={styles.label}>{usuario ? t('cerrar_sesion') : t('iniciar_sesion')}</Text>
                  <Text style={styles.sub}>{usuario ? (usuario.nombre + (esAdmin ? ' · Admin' : '')) : 'Apple, Google o invitado'}</Text>
                </View>
              </Pressable>

              <Pressable style={styles.item} onPress={() => setSelectorIdiomaVisible((v) => !v)}>
                <Icon name="language-outline" size={20} color={colors.textMuted} />
                <View style={{ flex: 1, marginLeft: space.md }}>
                  <Text style={styles.label}>{t('idioma_pais')}</Text>
                  <Text style={styles.sub}>{idiomaActual.flag} {idiomaActual.label} · {idiomaActual.pais}</Text>
                </View>
                <Icon name={selectorIdiomaVisible ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSubtle} />
              </Pressable>

              {selectorIdiomaVisible && IDIOMAS.map((idm) => (
                <Pressable
                  key={idm.code}
                  style={[styles.item, { paddingLeft: space.xl }]}
                  onPress={() => { cambiarIdioma(idm.code, idm.pais); setSelectorIdiomaVisible(false); }}
                >
                  <Text style={{ fontSize: 16 }}>{idm.flag}</Text>
                  <Text style={[styles.label, { marginLeft: space.md, flex: 1 }]}>{idm.label}</Text>
                  {idm.code === idiomaActual.code && <Icon name="checkmark" size={16} color={colors.primary} />}
                </Pressable>
              ))}

              {usuario && !esAdmin && (
                <Pressable style={styles.item} onPress={activarModoAdmin}>
                  <Icon name="shield-checkmark-outline" size={20} color={colors.textMuted} />
                  <Text style={[styles.label, { marginLeft: space.md }]}>Activar {t('modo_admin')} (demo)</Text>
                </Pressable>
              )}
            </View>

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

            {esAdmin && (
              <View style={{ marginTop: space.lg }}>
                <Text style={styles.seccion}>ADMINISTRACIÓN</Text>
                <Pressable
                  key={ITEM_ADMIN.ruta}
                  onPress={() => navegar(ITEM_ADMIN.ruta)}
                  style={styles.item}
                >
                  <Icon name={ITEM_ADMIN.icon} size={20} color={colors.textMuted} />
                  <View style={{ flex: 1, marginLeft: space.md }}>
                    <Text style={styles.label}>{ITEM_ADMIN.label}</Text>
                    <Text style={styles.sub}>{ITEM_ADMIN.sub}</Text>
                  </View>
                </Pressable>
              </View>
            )}
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + space.md }]}>
            <Text style={styles.footerText}>Versión 1.0.0</Text>
          </View>
        </View>
      </View>

      <LoginModal visible={loginVisible} onClose={() => setLoginVisible(false)} />
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
