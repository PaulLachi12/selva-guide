// Narración por voz — usa la Web Speech API (funciona sin conexión con las voces del dispositivo).
let vozElegida = null;

function elegirVoz() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voces = window.speechSynthesis.getVoices();
  if (!voces?.length) return vozElegida;
  vozElegida =
    voces.find((v) => /es-PE/i.test(v.lang)) ||
    voces.find((v) => /es-4/i.test(v.lang)) ||
    voces.find((v) => /^es/i.test(v.lang)) ||
    null;
  return vozElegida;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = elegirVoz;
}

export const narracionSoportada = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

export function hablar(texto, { onStart, onEnd } = {}) {
  if (!narracionSoportada() || !texto) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  const voz = elegirVoz();
  if (voz) u.voice = voz;
  u.lang = voz?.lang || 'es-PE';
  u.rate = 0.98;
  u.pitch = 1;
  if (onStart) u.onstart = onStart;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
  return true;
}

export function detener() {
  if (narracionSoportada()) window.speechSynthesis.cancel();
}

export function hablando() {
  return narracionSoportada() && window.speechSynthesis.speaking;
}
