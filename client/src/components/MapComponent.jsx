import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IconCheck, IconArrowRight } from './icons';

const POSICION_DEFAULT = [-3.74913, -73.25391];

function crearIconoPincel(nombre, especialidad, activo) {
  const inicial = (nombre || 'G').trim()[0]?.toUpperCase() || 'G';
  const marcado = activo ? 'activo' : '';
  const pulso = activo ? 'on' : '';
  return L.divIcon({
    className: '',
    html: `
      <div class="pin-mundi" title="${nombre}">
        <span class="pin-pulso ${pulso}"></span>
        <span class="pin-circulo ${marcado}">${inicial}</span>
      </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -22]
  });
}

function crearIconoInicial(nombre, inicial) {
  return L.divIcon({
    className: '',
    html: `<div class="pin-inicial">${inicial}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}

export default function MapComponent({
  guias = [],
  guiaResaltadoId = null,
  onGuiaEntrar,
  onGuiaSalir
}) {
  const marcadores = useMemo(() => guias.filter((g) => g.lat && g.lng), [guias]);

  const iconos = useMemo(() => {
    const mapa = new Map();
    marcadores.forEach((g) => {
      mapa.set(g.id, crearIconoPincel(g.usuario?.nombre, g.especialidad, guiaResaltadoId === g.id));
    });
    return mapa;
  }, [marcadores, guiaResaltadoId]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#EFECE6]">
      <MapContainer
        center={POSICION_DEFAULT}
        zoom={13}
        scrollWheelZoom
        className="mapa-sepia h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {marcadores.length === 0 && <Marker position={POSICION_DEFAULT} icon={crearIconoInicial('Guía', 'G')} />}

        {marcadores.map((g) => (
          <Marker
            key={g.id}
            position={[Number(g.lat), Number(g.lng)]}
            icon={iconos.get(g.id)}
            eventHandlers={{
              mouseover: () => onGuiaEntrar?.(g.id),
              mouseout: () => onGuiaSalir?.(g.id)
            }}
          >
            <Tooltip direction="top" offset={[0, -16]} opacity={1}>
              <div className="min-w-[168px]">
                <span className="tooltip-inicial">{g.usuario?.nombre?.[0]?.toUpperCase() || 'G'}</span>
                <div className="font-serif font-bold text-[14px] text-ink leading-tight inline-flex items-center gap-1 ml-1.5">
                  {g.usuario?.nombre}
                  {g.verificado && <IconCheck className="w-3 h-3 text-olive inline" />}
                </div>
                <div className="text-[11px] text-mut mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{g.especialidad || 'Guía local'}</div>
                <span className="tooltip-precio">S/{g.tarifa_hora}/h</span>
              </div>
            </Tooltip>
            <Popup>
              <div className="min-w-[176px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-6 w-6 bg-olive text-card flex items-center justify-center font-mono font-bold text-[10px] rounded-full">
                    {g.usuario?.nombre?.[0]?.toUpperCase() || 'G'}
                  </span>
                  <div className="font-serif font-bold text-[14px] text-ink leading-tight">
                    {g.usuario?.nombre}
                    {g.verificado && <IconCheck className="w-3 h-3 text-olive inline ml-1" />}
                  </div>
                </div>
                <div className="text-[11px] text-mut mb-1.5">{g.especialidad} · {g.idiomas}</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[12px] font-bold text-ink">
                    {g.rating > 0 ? `★ ${Number(g.rating).toFixed(1)}` : 'Nuevo'}
                  </span>
                  <span className="font-mono text-[12px] font-bold text-terracotta">S/{g.tarifa_hora}/h</span>
                </div>
                <Link
                  to={`/guia/${g.id}`}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink hover:text-forest transition group"
                >
                  Ver perfil <IconArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {/* Vigneta sobria de borde — "modo nocturno sutil" */}
      <div className="vigneta pointer-events-none absolute inset-0 z-[500]" aria-hidden="true" />
    </div>
  );
}
