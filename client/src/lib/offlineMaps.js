// Mapas sin conexión: descarga tiles a Cache Storage (misma caché del service worker).
const CACHE = 'mapas-voyager';
const SUBDOMINIOS = ['a', 'b', 'c', 'd'];
const PLANTILLA =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';

export const urlTile = (z, x, y) =>
  PLANTILLA.replace('{s}', SUBDOMINIOS[(x + y) % SUBDOMINIOS.length])
    .replace('{z}', z)
    .replace('{x}', x)
    .replace('{y}', y);

function lon2tile(lon, zoom) {
  return Math.floor(((lon + 180) / 360) * 2 ** zoom);
}
function lat2tile(lat, zoom) {
  const r = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** zoom
  );
}

export function tilesDeZona({ bounds, minZoom, maxZoom, maxTiles = 600 }) {
  const urls = [];
  for (let z = minZoom; z <= maxZoom && urls.length < maxTiles; z++) {
    const x1 = lon2tile(bounds.west, z);
    const x2 = lon2tile(bounds.east, z);
    const y1 = lat2tile(bounds.north, z);
    const y2 = lat2tile(bounds.south, z);
    for (let x = x1; x <= x2 && urls.length < maxTiles; x++) {
      for (let y = y1; y <= y2 && urls.length < maxTiles; y++) {
        urls.push(urlTile(z, x, y));
      }
    }
  }
  return urls;
}

export async function descargarTiles(urls, onProgress) {
  const cache = await caches.open(CACHE);
  let ok = 0;
  let fallos = 0;
  for (let i = 0; i < urls.length; i++) {
    try {
      const ya = await cache.match(urls[i]);
      if (!ya) {
        const resp = await fetch(urls[i], { mode: 'cors', cache: 'no-cache' });
        if (resp.ok) await cache.put(urls[i], resp.clone());
      }
      ok++;
    } catch {
      fallos++;
    }
    if (onProgress) onProgress(i + 1, urls.length, ok, fallos);
  }
  return { ok, fallos, total: urls.length };
}

export async function contarTiles() {
  try {
    const cache = await caches.open(CACHE);
    const keys = await cache.keys();
    return keys.length;
  } catch {
    return 0;
  }
}

export async function borrarTiles() {
  try {
    return await caches.delete(CACHE);
  } catch {
    return false;
  }
}
