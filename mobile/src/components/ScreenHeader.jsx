import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';
import { space } from '../theme';
import { useTheme, useThemedStyles } from '../context/ThemeContext';

// Cabecera estándar de pantalla: botón de menú, título y subtítulo opcional.
export default function ScreenHeader({ title, subtitle, onMenu, right, embedded = false }) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(crearEstilos);
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + space.sm }, embedded && { paddingHorizontal: 0, paddingBottom: space.sm }]}>
      <View style={styles.row}>
        {onMenu ? (
          <Pressable onPress={onMenu} hitSlop={10} style={styles.menu} accessibilityLabel={t('comun.abrir_menu')}>
            <Icon name="menu" size={24} color={colors.text} />
          </Pressable>
        ) : null}
        <View style={{ flex: 1 }} />
        {right}
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const crearEstilos = (colors) => StyleSheet.create({
  wrap: {
    backgroundColor: colors.bg,
    paddingHorizontal: space.lg,
    paddingBottom: space.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 40 },
  menu: { marginLeft: -2, padding: 2 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, letterSpacing: -0.5, marginTop: space.xs },
  subtitle: { fontSize: 15, color: colors.textMuted, marginTop: 2 },
});
