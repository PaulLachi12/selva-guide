// Sistema de diseño de Selva Guía: colores, espacios, radios y tipografía.
// Usa siempre estos valores en lugar de colores sueltos en cada pantalla.

export const colors = {
  primary: '#1F4D3A', // verde selva
  primaryDark: '#163829',
  primarySoft: '#E8F0EB',
  accent: '#B8612F', // terracota / arcilla del río
  accentSoft: '#F6EBE3',
  danger: '#B42318',
  dangerSoft: '#FEF3F2',
  warning: '#B54708',
  star: '#D29A2B',

  bg: '#F7F6F2',
  surface: '#FFFFFF',
  surfaceMuted: '#F2F1EC',
  border: '#E6E3DB',

  text: '#1A1D1B',
  textMuted: '#5F6660',
  textSubtle: '#8C928D',
  onPrimary: '#FFFFFF',
};

// Color por categoría de punto (mapa, chips, etiquetas)
export const categoryColors = {
  turistico: '#1F4D3A',
  gastronomico: '#B8612F',
  deportivo: '#9A3D3D',
  recreativo: '#2F5E88',
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

export const type = {
  title: { fontSize: 22, fontWeight: '700', color: colors.text, letterSpacing: -0.3 },
  heading: { fontSize: 17, fontWeight: '600', color: colors.text },
  body: { fontSize: 15, color: colors.text, lineHeight: 21 },
  small: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '600', color: colors.textMuted, letterSpacing: 0.4 },
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
};
