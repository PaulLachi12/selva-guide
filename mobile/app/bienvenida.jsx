import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Storage from 'expo-sqlite/kv-store';
import Icon from '../src/components/Icon';
import { useTheme, useThemedStyles } from '../src/context/ThemeContext';
import { radius, space } from '../src/theme';

const TARJETAS = [
  { key: 'clima', icon: 'partly-sunny-outline' },
  { key: 'moneda', icon: 'cash-outline' },
  { key: 'moverse', icon: 'bicycle-outline' },
  { key: 'evitar', icon: 'warning-outline' },
];

const TELEFONOS = [
  { key: 'poltur', numero: '(065) 231152', tel: '065231152' },
  { key: 'policia', numero: '105', tel: '105' },
  { key: 'bomberos', numero: '116', tel: '116' },
  { key: 'samu', numero: '106', tel: '106' },
];

const CLAVE_BIENVENIDA = 'bienvenida_vista';

export default function Bienvenida() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(crearEstilos);

  const ir = async (params) => {
    try { await Storage.setItem(CLAVE_BIENVENIDA, '1'); } catch (e) { /* no bloquea la navegación */ }
    // Desde el menú ya hay un mapa debajo: volver a él en vez de apilar otro.
    const ir = router.canGoBack() ? router.navigate : router.replace;
    ir(params ? { pathname: '/(tabs)', params } : '/(tabs)');
  };

  const llamar = (tel) => { Linking.openURL(`tel:${tel}`).catch(() => {}); };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.logo}>
          <Icon name="leaf" size={22} color={colors.onPrimary} />
        </View>
        <Text style={styles.titulo}>{t('bienvenida.titulo')}</Text>
        <Text style={styles.subtitulo}>{t('bienvenida.subtitulo')}</Text>

        {TARJETAS.map((c) => (
          <View key={c.key} style={styles.card}>
            <View style={styles.iconBox}>
              <Icon name={c.icon} size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitulo}>{t(`bienvenida.${c.key}_t`)}</Text>
              <Text style={styles.cardTexto}>{t(`bienvenida.${c.key}_d`)}</Text>
            </View>
          </View>
        ))}

        <View style={[styles.card, styles.cardEmergencia]}>
          <View style={[styles.iconBox, { backgroundColor: colors.dangerSoft }]}>
            <Icon name="call-outline" size={20} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitulo}>{t('bienvenida.emergencias_t')}</Text>
            <Text style={styles.cardTexto}>{t('bienvenida.emergencias_d')}</Text>
            {TELEFONOS.map((f) => (
              <Pressable
                key={f.key}
                onPress={() => llamar(f.tel)}
                accessibilityRole="button"
                accessibilityLabel={t('bienvenida.llamar_a', { nombre: t(`bienvenida.${f.key}`) })}
                style={({ pressed }) => [styles.telFila, pressed && { opacity: 0.6 }]}
              >
                <Text style={styles.telNombre}>{t(`bienvenida.${f.key}`)}</Text>
                <Text style={styles.telNumero}>{f.numero}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.md }]}>
        <Pressable
          style={({ pressed }) => [styles.btn, styles.btnPrimario, pressed && { opacity: 0.8 }]}
          onPress={() => ir({ destino: '101', origen: 'aeropuerto' })}
        >
          <Icon name="airplane-outline" size={18} color={colors.onPrimary} />
          <Text style={[styles.btnTexto, { color: colors.onPrimary }]}>{t('bienvenida.btn_aeropuerto')}</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.btn, styles.btnSecundario, pressed && { opacity: 0.8 }]}
          onPress={() => ir({ categoria: 'servicios' })}
        >
          <Icon name="briefcase-outline" size={18} color={colors.primary} />
          <Text style={[styles.btnTexto, { color: colors.primary }]}>{t('bienvenida.btn_kit')}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.btnLink, pressed && { opacity: 0.6 }]} onPress={() => ir(null)}>
          <Text style={styles.btnLinkTexto}>{t('bienvenida.btn_explorar')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const crearEstilos = (colors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: space.lg, paddingBottom: space.xl },
  logo: {
    width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginTop: space.md,
  },
  titulo: { fontSize: 26, fontWeight: '700', color: colors.text, marginTop: space.md },
  subtitulo: { fontSize: 15, color: colors.textMuted, marginTop: space.xs, marginBottom: space.lg },
  card: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: space.md, marginBottom: space.md, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  cardEmergencia: { borderColor: colors.danger },
  iconBox: {
    width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center', marginRight: space.md,
  },
  cardTitulo: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardTexto: { fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: 2 },
  telFila: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: space.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, marginTop: space.xs,
  },
  telNombre: { fontSize: 14, color: colors.text, flex: 1, marginRight: space.sm },
  telNumero: { fontSize: 15, fontWeight: '700', color: colors.danger },
  footer: {
    paddingHorizontal: space.lg, paddingTop: space.md, backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border,
  },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: space.md, borderRadius: radius.md, marginBottom: space.sm,
  },
  btnPrimario: { backgroundColor: colors.primary },
  btnSecundario: { backgroundColor: colors.primarySoft },
  btnTexto: { fontSize: 15, fontWeight: '700', marginLeft: space.sm },
  btnLink: { alignItems: 'center', paddingVertical: space.sm },
  btnLinkTexto: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
});
