import { Text } from 'react-native';

const GLYPH = (g) => ({ color = '#1A1610', size = 18, ...rest }) => (
  <Text style={{ color, fontSize: size, fontFamily: 'Georgia', lineHeight: size + 2 }} {...rest}>
    {g}
  </Text>
);

export const IconSearch = GLYPH('\u2726'); // ✦
export const IconChat = GLYPH('\u2758 \u2758 \u2758'); // chat
export const IconShield = GLYPH('\u2726');
export const IconWallet = GLYPH('\u2090'); // ₐ monedas
export const IconGlobe = GLYPH('\u2637'); // ☷
export const IconClock = GLYPH('\u25CB'); // ○
export const IconCheck = GLYPH('\u2713'); // ✓
export const IconMap = GLYPH('\u2630'); // ☰
export const IconCalendar = GLYPH('\u25A3'); // ▣
export const IconChevronDown = GLYPH('\u25BE'); // ▾
export const IconArrowRight = GLYPH('\u2192'); // →
export const IconCompass = GLYPH('\u2727'); // ✧
export const IconSigloLit = GLYPH('\u221E'); // ∞
export const IconMountain = GLYPH('\u25B2'); // ▲
export const IconBoat = GLYPH('\u25BC'); // ▼
export const IconTemple = GLYPH('\u25A6'); // ▦
export const IconLeaf = GLYPH('\u2698'); // ⚘
export const IconPlate = GLYPH('\u263D'); // ☽
export const IconWave = GLYPH('\u223C'); // ∼
export const IconStar = GLYPH('\u2605'); // ★
export const IconPin = GLYPH('\u25B2');
export const IconUsers = GLYPH('\u2682'); // ⚂
export const IconArrowLeft = GLYPH('\u2190'); // ←
