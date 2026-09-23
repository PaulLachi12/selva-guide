// Verifica las traducciones de la app:
// 1. es, en, fr y pt tienen exactamente las mismas claves de interfaz.
// 2. Cada t('clave') usada en el código existe en los 4 idiomas.
// Uso: node scripts/check-i18n.js  (sale con código 1 si hay errores)
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const IDIOMAS = ['es', 'en', 'fr', 'pt'];
const locales = Object.fromEntries(
  IDIOMAS.map((l) => [l, JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/i18n/locales', `${l}.json`), 'utf8'))])
);

// Las fichas de lugares ("puntos") usan el español como respaldo, así que no se exigen iguales.
const aplanar = (obj, prefijo = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? aplanar(v, `${prefijo}${k}.`) : [`${prefijo}${k}`]
  );
const clavesUi = (l) => new Set(aplanar(locales[l]).filter((k) => !k.startsWith('puntos.')));

const errores = [];
const base = clavesUi('es');
for (const l of IDIOMAS.slice(1)) {
  const otras = clavesUi(l);
  for (const k of base) if (!otras.has(k)) errores.push(`${l}: falta "${k}"`);
  for (const k of otras) if (!base.has(k)) errores.push(`${l}: sobra "${k}" (no existe en es)`);
}

const archivos = [];
const recorrer = (dir) => {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) recorrer(p);
    else if (/\.(jsx?|tsx?)$/.test(f)) archivos.push(p);
  }
};
recorrer(path.join(RAIZ, 'app'));
recorrer(path.join(RAIZ, 'src'));

const obtener = (obj, clave) => clave.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
for (const archivo of archivos) {
  const codigo = fs.readFileSync(archivo, 'utf8');
  for (const [, clave] of codigo.matchAll(/\bt\(\s*'([\w.]+)'/g)) {
    for (const l of IDIOMAS) {
      if (obtener(locales[l], clave) === undefined) {
        errores.push(`${path.relative(RAIZ, archivo)}: "${clave}" no existe en ${l}`);
      }
    }
  }
}

if (errores.length) {
  console.error(`Traducciones con errores (${errores.length}):\n` + errores.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`Traducciones OK: ${base.size} claves en ${IDIOMAS.join(', ')}; ${archivos.length} archivos revisados.`);
