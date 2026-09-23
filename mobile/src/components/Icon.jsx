import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Iconos de línea (Ionicons). Usa nombres "-outline" para mantener un estilo uniforme.
export default function Icon({ name, size = 20, color, style }) {
  const { colors } = useTheme();
  return <Ionicons name={name} size={size} color={color || colors.text} style={style} />;
}
