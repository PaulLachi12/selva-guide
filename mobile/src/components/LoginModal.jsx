import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../context/AuthContext';
import GlassView from './GlassView';
import Icon from './Icon';
import { colors, space, radius, shadow } from '../theme';

// Pantalla de login estilo iOS: San Francisco es la fuente de sistema por defecto en
// RN/iOS (no requiere fontFamily explícito), glass + sombras suaves, safe area del notch.
export default function LoginModal({ visible, onClose }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { loginConApple, loginConGoogle, entrarComoInvitado } = useAuth();
  const [cargando, setCargando] = useState(null); // 'apple' | 'google' | 'invitado' | null

  const manejar = async (tipo, accion) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setCargando(tipo);
    try {
      await accion();
      onClose();
    } finally {
      setCargando(null);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <GlassView tint="dark" style={StyleSheet.absoluteFill} pointerEvents="none" />
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={[styles.card, { paddingBottom: insets.bottom + space.lg }]}>
          <View style={styles.handle} />

          <Text style={styles.titulo}>Selva Guía</Text>
          <Text style={styles.subtitulo}>Iquitos, Loreto</Text>

          <Pressable
            onPress={() => manejar('apple', loginConApple)}
            style={[styles.btn, styles.btnApple]}
            disabled={!!cargando}
          >
            {cargando === 'apple' ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <>
                <Icon name="logo-apple" size={18} color={colors.onPrimary} />
                <Text style={styles.btnTextoOscuro}>{t('continuar_apple')}</Text>
              </>
            )}
          </Pressable>

          <Pressable
            onPress={() => manejar('google', loginConGoogle)}
            style={[styles.btn, styles.btnGoogle]}
            disabled={!!cargando}
          >
            {cargando === 'google' ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <>
                <Icon name="logo-google" size={18} color={colors.text} />
                <Text style={styles.btnTextoClaro}>{t('continuar_google')}</Text>
              </>
            )}
          </Pressable>

          <Pressable
            onPress={() => manejar('invitado', entrarComoInvitado)}
            style={styles.btnInvitado}
            disabled={!!cargando}
          >
            {cargando === 'invitado' ? (
              <ActivityIndicator color={colors.textMuted} />
            ) : (
              <Text style={styles.btnInvitadoTexto}>{t('explorar_invitado')}</Text>
            )}
          </Pressable>

          <Text style={styles.nota}>
            {Platform.OS === 'ios'
              ? 'Apple/Google: demo local mientras se configuran las credenciales OAuth.'
              : 'Apple/Google: demo local (disponibles al configurar credenciales OAuth).'}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    ...shadow.md,
  },
  handle: {
    alignSelf: 'center',
    width: 45,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginBottom: space.lg,
  },
  titulo: { fontSize: 24, fontWeight: '700', color: colors.text, textAlign: 'center' },
  subtitulo: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: space.xl },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    height: 52,
    borderRadius: radius.md,
    marginBottom: space.md,
    ...shadow.sm,
  },
  btnApple: { backgroundColor: '#000' },
  btnGoogle: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  btnTextoOscuro: { color: colors.onPrimary, fontWeight: '600', fontSize: 16 },
  btnTextoClaro: { color: colors.text, fontWeight: '600', fontSize: 16 },
  btnInvitado: { alignItems: 'center', paddingVertical: space.md },
  btnInvitadoTexto: { color: colors.textMuted, fontWeight: '600', fontSize: 14, textDecorationLine: 'underline' },
  nota: { fontSize: 11, color: colors.textSubtle, textAlign: 'center', marginTop: space.sm },
});
