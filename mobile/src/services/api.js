import axios from 'axios';
import { obtenerPuntos, agregarPunto, agregarResenaAPunto, actualizarPunto } from '../data/puntosData';

// Capa de servicio desacoplada: hoy (`MODO_LOCAL = true`) resuelve contra puntosData.js
// (array en memoria), con la MISMA forma de API async que tendría un backend real
// (Supabase / Firebase / Node-Express). Para conectar el backend real: poner
// MODO_LOCAL = false, definir BASE_URL, y cada función ya tiene su llamada Axios
// comentada lista para usar — el resto de la app (componentes) no cambia,
// porque todos consumen este archivo, nunca puntosData.js directamente.
const MODO_LOCAL = true;
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.selvaguide.example.com';

const cliente = axios.create({ baseURL: BASE_URL, timeout: 10000 });

export function setTokenAuth(token) {
  if (token) cliente.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete cliente.defaults.headers.common.Authorization;
}

export const api = {
  async getPuntos() {
    if (MODO_LOCAL) return obtenerPuntos();
    const { data } = await cliente.get('/puntos');
    return data;
  },

  async crearPunto(punto) {
    if (MODO_LOCAL) return agregarPunto(punto);
    const { data } = await cliente.post('/puntos', punto);
    return data;
  },

  // Modo Admin: editar descripción, coordenadas del marcador o tarifa base de mototaxi
  async actualizarPunto(puntoId, cambios) {
    if (MODO_LOCAL) return actualizarPunto(puntoId, cambios);
    const { data } = await cliente.patch(`/puntos/${puntoId}`, cambios);
    return data;
  },

  async agregarResena(puntoId, resena) {
    if (MODO_LOCAL) return agregarResenaAPunto(puntoId, resena);
    const { data } = await cliente.post(`/puntos/${puntoId}/resenas`, resena);
    return data;
  },

  // --- Auth: sin backend propio todavía; documentado para cuando exista ---
  async loginConProveedorToken(proveedor, tokenProveedor) {
    if (MODO_LOCAL) throw new Error('Backend de auth no configurado (MODO_LOCAL=true)');
    const { data } = await cliente.post('/auth/social', { proveedor, token: tokenProveedor });
    return data; // { token, usuario }
  },
};

export default api;
