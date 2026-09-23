import { useTranslation } from 'react-i18next';

// Texto de un punto turístico en el idioma activo. Usa la traducción de
// "puntos.<id>.<campo>" y, si no existe, el texto original en español.
export function usePuntoTexto() {
  const { t } = useTranslation();
  return (punto, campo) =>
    punto ? t(`puntos.${punto.id}.${campo}`, { defaultValue: punto[campo] ?? '' }) : '';
}
