// Utilidades de navegación: instrucciones paso a paso (OSRM) y apps externas.
import { Linking, Alert } from 'react-native';

export const AEROPUERTO = { latitude: -3.7847, longitude: -73.3088 };

export function formatearDistanciaPaso(m) {
  if (!m || m < 1) return '';
  if (m < 1000) return `${Math.round(m / 10) * 10 || Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

// Convierte los steps de OSRM en { tipo, modificador, nombre, distancia, lat, lng }
export function extraerPasos(route) {
  const pasos = [];
  (route?.legs || []).forEach((leg) => {
    (leg.steps || []).forEach((s) => {
      const [lng, lat] = s.maneuver?.location || [];
      pasos.push({
        tipo: s.maneuver?.type || 'continue',
        modificador: s.maneuver?.modifier || 'straight',
        nombre: s.name || '',
        distancia: s.distance || 0,
        lat,
        lng,
      });
    });
  });
  return pasos;
}

const MODS = ['left', 'right', 'slight left', 'slight right', 'sharp left', 'sharp right', 'straight', 'uturn'];
const clavMod = (m) => (MODS.includes(m) ? m.replace(' ', '_') : 'straight');

export function iconoPaso(paso) {
  const { tipo, modificador: m = '' } = paso;
  if (tipo === 'arrive') return 'flag-outline';
  if (tipo === 'depart') return 'navigate-outline';
  if (tipo === 'roundabout' || tipo === 'rotary' || tipo === 'roundabout turn') return 'sync-outline';
  if (m === 'uturn') return 'return-down-back-outline';
  if (m.includes('left')) return 'arrow-back-outline';
  if (m.includes('right')) return 'arrow-forward-outline';
  return 'arrow-up-outline';
}

// Texto traducido de una maniobra. Claves bajo nav.*
export function textoPaso(t, paso) {
  const mod = t(`nav.mod.${clavMod(paso.modificador)}`);
  const calle = paso.nombre;
  const dist = formatearDistanciaPaso(paso.distancia);
  const en = (base) => (calle ? t('nav.en_calle', { accion: base, calle }) : base);
  switch (paso.tipo) {
    case 'depart':
      return calle ? t('nav.salir_por', { calle }) : t('nav.salir');
    case 'arrive':
      return t('nav.llegaste');
    case 'roundabout':
    case 'rotary':
    case 'roundabout turn':
      return en(t('nav.rotonda'));
    case 'merge':
      return en(t('nav.incorporate', { dir: mod }));
    case 'fork':
      return en(t('nav.bifurcacion', { dir: mod }));
    case 'end of road':
      return en(t('nav.fin_via', { dir: mod }));
    case 'new name':
    case 'continue':
    default:
      if (paso.modificador === 'straight' || !paso.modificador) {
        return calle ? t('nav.sigue_recto_por', { calle }) : t('nav.sigue_recto', { dist });
      }
      if (paso.modificador === 'uturn') return en(t('nav.da_vuelta'));
      return en(t('nav.gira', { dir: mod }));
  }
}

// Distancia aproximada en metros entre dos coordenadas.
export function distanciaMetros(a, b) {
  const R = 6371000;
  const rad = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * rad;
  const dLng = (b.longitude - a.longitude) * rad;
  const x = dLng * Math.cos(((a.latitude + b.latitude) / 2) * rad);
  return Math.sqrt(x * x + dLat * dLat) * R;
}

export function distanciaMinimaARuta(pos, coords) {
  let min = Infinity;
  for (let i = 0; i < coords.length; i++) {
    const d = distanciaMetros(pos, coords[i]);
    if (d < min) min = d;
  }
  return min;
}

// Índice del próximo paso (maniobra más cercana aún no superada).
export function indicePasoActual(pos, pasos) {
  if (!pasos?.length) return -1;
  let mejor = 0;
  let min = Infinity;
  pasos.forEach((p, i) => {
    if (p.lat == null) return;
    const d = distanciaMetros(pos, { latitude: p.lat, longitude: p.lng });
    if (d < min) { min = d; mejor = i; }
  });
  // Si ya pasamos cerca de esa maniobra, la siguiente es la próxima.
  return min < 25 && mejor < pasos.length - 1 ? mejor + 1 : mejor;
}

export function urlGoogleMaps(destino, origen) {
  let url = `https://www.google.com/maps/dir/?api=1&destination=${destino.lat},${destino.lng}&travelmode=driving`;
  if (origen) url += `&origin=${origen.latitude},${origen.longitude}`;
  return url;
}

export function abrirExterna(url, t) {
  Linking.openURL(url).catch(() => {
    Alert.alert(t('nav.error_titulo'), t('nav.error_abrir'));
  });
}
