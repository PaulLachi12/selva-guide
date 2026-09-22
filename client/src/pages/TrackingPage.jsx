import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSocket } from '../hooks/useSocket';
import 'leaflet/dist/leaflet.css';
import { IconPin, IconArrowLeft, IconCheck } from '../components/icons';

const STYLE = { fontSize: '12px' };

const posInicial = [-3.74913, -73.25391];

export default function TrackingPage() {
  const { id } = useParams(); // reserva_id
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const socket = useSocket();
  const toast = useToast();
  const [puntos, setPuntos] = useState([]);

  useEffect(() => {
    api.get(`/tracking/${id}`).then((r) => setPuntos(r.data.map((p) => [Number(p.lat), Number(p.lng)]))).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      if (String(data.reserva_id) === String(id)) {
        setPuntos((p) => [...p, [Number(data.lat), Number(data.lng)]]);
      }
    };
    socket.on('tracking_position', handler);
    return () => socket.off('tracking_position', handler);
  }, [socket, id]);

  return (
    <div className="max-w-4xl mx-auto animate-in">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold text-ink flex items-center gap-2"><IconPin className="w-5 h-5" /> Tracking en vivo</h1>
        <div className="flex items-center gap-3">
          {usuario.rol === 'guia' && (
            <>
              <span className="text-sm text-gray-500 hidden sm:inline">Enviar ubicación (simulación):</span>
              <button
                onClick={() => {
                  const lat = posInicial[0] + (Math.random() - 0.5) * 0.01;
                  const lng = posInicial[1] + (Math.random() - 0.5) * 0.01;
                  api.post('/tracking', { reserva_id: Number(id), lat, lng }).then((r) => {
                    setPuntos((p) => [...p, [lat, lng]]);
                    socket?.emit('tracking_update', { reserva_id: id, lat, lng });
                    toast.success('Posición enviada', 'El turista ahora ve tu ubicación');
                  }).catch(() => toast.error('No se pudo registrar', 'Intenta de nuevo'));
                }}
                className="bg-ink hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold transition inline-flex items-center gap-1.5"
              >
                <IconPin className="w-4 h-4" /> Simular movimiento
              </button>
            </>
          )}
          <button onClick={() => navigate(-1)} className="text-ink text-sm hover:underline inline-flex items-center gap-1 font-semibold"><IconArrowLeft className="w-4 h-4" /> Volver</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-grayLine shadow-sm overflow-hidden h-[60vh] relative">
        <MapContainer center={puntos[puntos.length - 1] || posInicial} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {puntos.length > 0 && (
            <>
              <Marker position={puntos[0]} icon={new L.Icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                <Popup><div style={STYLE}>Punto de inicio</div></Popup>
              </Marker>
              <Polyline positions={puntos} color="#1A1A1A" weight={4} />
              <Marker position={puntos[puntos.length - 1]} icon={new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                <Popup><div style={STYLE}>Ubicación actual</div></Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-grayLine shadow-sm p-4 flex items-center gap-3">
        {puntos.length > 0 ? <IconCheck className="w-4 h-4 text-ggreen" /> : <IconPin className="w-4 h-4 text-gray-400" />}
        <div className="text-sm text-gray-600">
          {puntos.length === 0
            ? 'El guía aún no ha registrado posición. Esperando datos en tiempo real...'
            : `${puntos.length} punto${puntos.length === 1 ? '' : 's'} registrado${puntos.length === 1 ? '' : 's'} — la ruta se actualiza en vivo`}
        </div>
      </div>
    </div>
  );
}