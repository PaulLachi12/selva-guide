import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TextInput, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import api from '../services/api';
import { useTheme, useThemedStyles } from '../context/ThemeContext';
import { usePuntoTexto } from '../i18n/contenido';
import { space, radius, shadow } from '../theme';

// Edición rápida de admin sobre un punto: descripción, lat/lng del marcador y tarifa
// base (S/ mínimo de mototaxi para tramo corto). Persiste vía services/api.js.
export default function AdminEditModal({ visible, punto, onClose, onGuardado }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(crearEstilos);
  const tp = usePuntoTexto();
  const [descripcion, setDescripcion] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [tarifaBase, setTarifaBase] = useState('');
  const [guardando, setGuardando] = useState(false);

  React.useEffect(() => {
    if (punto) {
      setDescripcion(punto.descripcionLarga || punto.descripcionCorta || '');
      setLat(String(punto.lat ?? ''));
      setLng(String(punto.lng ?? ''));
      setTarifaBase(String(punto.tarifaBaseS || ''));
    }
  }, [punto]);

  if (!punto) return null;

  const guardar = async () => {
    const nuevaLat = parseFloat(lat);
    const nuevaLng = parseFloat(lng);
    if (Number.isNaN(nuevaLat) || Number.isNaN(nuevaLng)) {
      Alert.alert(t('admin.titulo_alerta'), t('admin.latlng_invalidas'));
      return;
    }
    setGuardando(true);
    try {
      await api.actualizarPunto(punto.id, {
        descripcionLarga: descripcion,
        lat: nuevaLat,
        lng: nuevaLng,
        tarifaBaseS: tarifaBase ? parseFloat(tarifaBase) : undefined,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      onGuardado && onGuardado();
      onClose();
    } catch (e) {
      Alert.alert(t('admin.titulo_alerta'), t('admin.error_guardar'));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.titulo}>{t('editar_lugar')}</Text>
          <Text style={styles.sub}>{tp(punto, 'nombre')}</Text>

          <Text style={styles.label}>{t('admin.descripcion')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{t('admin.lat')}</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={lat} onChangeText={setLat} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{t('admin.lng')}</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={lng} onChangeText={setLng} />
            </View>
          </View>

          <Text style={styles.label}>{t('admin.tarifa_base')}</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={tarifaBase} onChangeText={setTarifaBase} placeholder="3" placeholderTextColor={colors.textSubtle} />

          <View style={styles.acciones}>
            <Pressable onPress={onClose} style={styles.btnCancelar} disabled={guardando}>
              <Text style={styles.btnCancelarTexto}>{t('cancelar')}</Text>
            </Pressable>
            <Pressable onPress={guardar} style={styles.btnGuardar} disabled={guardando}>
              <Text style={styles.btnGuardarTexto}>{guardando ? '...' : t('guardar')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const crearEstilos = (colors) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: space.lg },
  card: { backgroundColor: colors.surface, borderRadius: 22, padding: space.lg, width: '100%', maxWidth: 420, ...shadow.md },
  titulo: { fontSize: 17, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginBottom: space.md },
  label: { fontSize: 12, fontWeight: '600', color: colors.text, marginBottom: 4, marginTop: space.sm },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 12, height: 42, fontSize: 14, color: colors.text },
  textArea: { height: 90, textAlignVertical: 'top', paddingTop: 8 },
  acciones: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: space.lg, gap: space.sm },
  btnCancelar: { paddingHorizontal: 14, paddingVertical: 10 },
  btnCancelarTexto: { color: colors.textMuted, fontWeight: '600' },
  btnGuardar: { backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: radius.sm },
  btnGuardarTexto: { color: colors.onPrimary, fontWeight: '700' },
});
