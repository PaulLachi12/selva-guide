import { ScrollView, Text, View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../src/components/Icon';
import { useTheme, useThemedStyles } from '../src/context/ThemeContext';
import { space, radius } from '../src/theme';

const SECCIONES = ['datos', 'ubicacion', 'fotos', 'cuenta', 'terceros', 'derechos', 'contacto'];

export default function PrivacidadScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(crearEstilos);

  return (
    <View style={[styles.contenedor, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} accessibilityLabel={t('privacidad.volver')}>
          <Icon name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.titulo}>{t('privacidad.titulo')}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: insets.bottom + space.xl }}>
        <Text style={styles.intro}>{t('privacidad.intro')}</Text>
        {SECCIONES.map((k) => (
          <View key={k} style={styles.card}>
            <Text style={styles.seccionTitulo}>{t(`privacidad.${k}_titulo`)}</Text>
            <Text style={styles.texto}>{t(`privacidad.${k}_texto`)}</Text>
          </View>
        ))}
        <Text style={styles.fecha}>{t('privacidad.actualizado')}</Text>
      </ScrollView>
    </View>
  );
}

const crearEstilos = (colors) => StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingVertical: space.md },
  titulo: { fontSize: 20, fontWeight: '700', color: colors.text, flexShrink: 1 },
  intro: { fontSize: 14, color: colors.textMuted, lineHeight: 20, marginBottom: space.lg },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: space.lg, marginBottom: space.md },
  seccionTitulo: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: space.xs },
  texto: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  fecha: { fontSize: 12, color: colors.textSubtle, textAlign: 'center', marginTop: space.md },
});
