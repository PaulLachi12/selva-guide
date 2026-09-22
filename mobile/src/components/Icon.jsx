import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// Iconos de línea (Ionicons). Usa nombres "-outline" para mantener un estilo uniforme.
export default function Icon({ name, size = 20, color = colors.text, style }) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}
