import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';
import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';
import { IDIOMAS } from '../i18n/locales';
import { useTheme, useThemedStyles } from '../context/ThemeContext';
import { radius, space } from '../theme';

const SECCIONES = [
  {
    titulo: 'menu.sec_explorar',
    items: [
      { label: 'menu.mapa', sub: 'menu.mapa_sub', icon: 'map-outline', ruta: '/(tabs)' },
      { label: 'menu.gastronomia', sub: 'menu.gastronomia_sub', icon: 'restaurant-outline', ruta: '/(tabs)/gastronomia' },
      { label: 'menu.experiencias', sub: 'menu.experiencias_sub', icon: 'compass-outline', ruta: '/(tabs)/experiencias' },
      { label: 'menu.resenas', sub: 'menu.resenas_sub', icon: 'star-outline', ruta: '/(tabs)/resenas' },
    ],
  },
  {
    titulo: 'menu.sec_viaje',
    items: [
      { label: 'menu.mochila', sub: 'menu.mochila_sub', icon: 'cloud-download-outline', ruta: '/(tabs)/mochila' },
      { label: 'menu.ayuda', sub: 'menu.ayuda_sub', icon: 'medkit-outline', ruta: '/(tabs)/emergencia' },
      { label: 'menu.privacidad', sub: 'menu.privacidad_sub', icon: 'shield-outline', ruta: '/privacidad' },
    ],
  },
];

const ITEM_ADMIN = { label: 'menu.agregar_lugar', sub: 'menu.agregar_lugar_sub', icon: 'add-circle-outline', ruta: '/admin/nuevo-punto' };

const MODOS = [
  { key: 'sistema', label: 'menu.tema_sistema', icon: 'phone-portrait-outline' },
  { key: 'claro', label: 'menu.tema_claro', icon: 'sunny-outline' },
  { key: 'oscuro', label: 'menu.tema_oscuro', icon: 'moon-outline' },
];

export default function DrawerMenuModal({ visible, onClose, rutaActual }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { usuario, esAdmin, cerrarSesion, cambiarIdioma, activarModoAdmin } = useAuth();
  const [loginVisible, setLoginVisible] = useState(false);
  const [selectorIdiomaVisible, setSelectorIdiomaVisible] = useState(false);
  const [selectorTemaVisible, setSelectorTemaVisible] = useState(false);
  const { colors, modo, setModo } = useTheme();
  const styles = useThemedStyles(crearEstilos);
  const modoActual = MODOS.find((m) => m.key === modo) || MODOS[0];

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
              <Text style={styles.appTitle}>{t('menu.app_titulo')}</Text>
              <Text style={styles.appSub}>{t('menu.app_sub')}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10} style={styles.btnClose} accessibilityLabel={t('menu.cerrar')}>
              <Icon name="close" size={22} color={colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: space.xl }} showsVerticalScrollIndicator={false}>
            <View style={{ marginTop: space.lg }}>
              <Text style={styles.seccion}>{t('menu.sec_perfil').toUpperCase()}</Text>

              <Pressable
                style={styles.item}
                onPress={() => (usuario ? cerrarSesion() : setLoginVisible(true))}
              >
                <Icon name={usuario ? 'log-out-outline' : 'log-in-outline'} size={20} color={colors.textMuted} />
                <View style={{ flex: 1, marginLeft: space.md }}>
                  <Text style={styles.label}>{usuario ? t('cerrar_sesion') : t('iniciar_sesion')}</Text>
                  <Text style={styles.sub}>{usuario ? (usuario.nombre + (esAdmin ? ` · ${t('menu.admin')}` : '')) : t('menu.login_sub')}</Text>
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

              <Pressable style={styles.item} onPress={() => setSelectorTemaVisible((v) => !v)}>
                <Icon name="contrast-outline" size={20} color={colors.textMuted} />
                <View style={{ flex: 1, marginLeft: space.md }}>
                  <Text style={styles.label}>{t('menu.apariencia')}</Text>
                  <Text style={styles.sub}>{t(modoActual.label)}</Text>
                </View>
                <Icon name={selectorTemaVisible ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSubtle} />
              </Pressable>

              {selectorTemaVisible && MODOS.map((m) => (
                <Pressable
                  key={m.key}
                  style={[styles.item, { paddingLeft: space.xl }]}
                  onPress={() => { setModo(m.key); setSelectorTemaVisible(false); }}
                >
                  <Icon name={m.icon} size={16} color={colors.textMuted} />
                  <Text style={[styles.label, { marginLeft: space.md, flex: 1 }]}>{t(m.label)}</Text>
                  {m.key === modo && <Icon name="checkmark" size={16} color={colors.primary} />}
                </Pressable>
              ))}

              {usuario && !esAdmin && (
                <Pressable style={styles.item} onPress={activarModoAdmin}>
                  <Icon name="shield-checkmark-outline" size={20} color={colors.textMuted} />
                  <Text style={[styles.label, { marginLeft: space.md }]}>{t('menu.activar_admin', { modo: t('modo_admin') })}</Text>
                </Pressable>
              )}
            </View>

            {SECCIONES.map((sec) => (
              <View key={sec.titulo} style={{ marginTop: space.lg }}>
                <Text style={styles.seccion}>{t(sec.titulo).toUpperCase()}</Text>
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
                        <Text style={[styles.label, activo && { color: colors.primary }]}>{t(item.label)}</Text>
                        <Text style={styles.sub}>{t(item.sub)}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))}

            {esAdmin && (
              <View style={{ marginTop: space.lg }}>
                <Text style={styles.seccion}>{t('menu.sec_admin').toUpperCase()}</Text>
                <Pressable
                  key={ITEM_ADMIN.ruta}
                  onPress={() => navegar(ITEM_ADMIN.ruta)}
                  style={styles.item}
                >
                  <Icon name={ITEM_ADMIN.icon} size={20} color={colors.textMuted} />
                  <View style={{ flex: 1, marginLeft: space.md }}>
                    <Text style={styles.label}>{t(ITEM_ADMIN.label)}</Text>
                    <Text style={styles.sub}>{t(ITEM_ADMIN.sub)}</Text>
                  </View>
                </Pressable>
              </View>
            )}
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + space.md }]}>
            <Text style={styles.footerText}>{t('menu.version', { version: '1.0.0' })}</Text>
          </View>
        </View>
      </View>

      <LoginModal visible={loginVisible} onClose={() => setLoginVisible(false)} />
    </Modal>
  );
}

const crearEstilos = (colors) => StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
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
