import { Alert, Linking } from 'react-native';
import * as Location from 'expo-location';
import i18n from '../i18n';

// Muestra una explicación antes del diálogo del sistema. Resuelve true si el usuario acepta.
function explicar(titulo: string, mensaje: string): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(titulo, mensaje, [
      { text: i18n.t('permisos.ahora_no'), style: 'cancel', onPress: () => resolve(false) },
      { text: i18n.t('permisos.continuar'), onPress: () => resolve(true) },
    ], { cancelable: true, onDismiss: () => resolve(false) });
  });
}

// Estado actual de la ubicación sin mostrar ningún diálogo.
export async function ubicacionConcedida(): Promise<boolean> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

// Pide la ubicación "mientras se usa la app" solo cuando hace falta (al trazar una ruta).
// Devuelve true si está concedida. Nunca pide ubicación en segundo plano.
export async function pedirUbicacion(): Promise<boolean> {
  const actual = await Location.getForegroundPermissionsAsync();
  if (actual.status === 'granted') return true;

  if (!actual.canAskAgain) {
    Alert.alert(i18n.t('permisos.ubicacion_titulo'), i18n.t('permisos.ubicacion_bloqueada'), [
      { text: i18n.t('permisos.ahora_no'), style: 'cancel' },
      { text: i18n.t('permisos.abrir_ajustes'), onPress: () => Linking.openSettings() },
    ]);
    return false;
  }

  const acepta = await explicar(i18n.t('permisos.ubicacion_titulo'), i18n.t('permisos.ubicacion_explicacion'));
  if (!acepta) return false;
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}
