import es from './locales/es.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';

// Textos de UI y contenido de puntos (clave "puntos.<id>.<campo>") por idioma.
export const recursos = {
  es: { translation: es },
  en: { translation: en },
  fr: { translation: fr },
  pt: { translation: pt },
};

export const IDIOMAS = [
  { code: 'es', label: 'Español', pais: 'Perú', flag: '🇵🇪' },
  { code: 'en', label: 'English', pais: 'United States', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', pais: 'France', flag: '🇫🇷' },
  { code: 'pt', label: 'Português', pais: 'Brasil', flag: '🇧🇷' },
];

// Conversión referencial: Sol peruano (S/) es la base real de cobro en Iquitos.
// Esto NO reemplaza tarifaMototaxi() (que sigue devolviendo Soles); es solo
// el símbolo/tasa a mostrar según el país del turista.
export const MONEDA_POR_IDIOMA = {
  es: { simbolo: 'S/', tasa: 1, codigo: 'PEN' },
  en: { simbolo: '$', tasa: 1 / 3.75, codigo: 'USD' },
  fr: { simbolo: '€', tasa: 1 / 4.05, codigo: 'EUR' },
  pt: { simbolo: 'R$', tasa: 1 / 0.72, codigo: 'BRL' },
};
