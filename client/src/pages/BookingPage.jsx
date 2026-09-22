import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { IconPin, IconCalendar, IconClock, IconUsers, IconCheck, IconArrowLeft } from '../components/icons';

export default function BookingPage() {
  const { paqueteId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [paquete, setPaquete] = useState(null);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('09:00');
  const [personas, setPersonas] = useState(2);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ubicando, setUbicando] = useState(false);
  const [reservado, setReservado] = useState(false);

  useEffect(() => {
    api.get(`/paquetes/${paqueteId}`).then((r) => setPaquete(r.data)).catch(() => {});
    window.scrollTo({ top: 0 });
  }, [paqueteId]);

  const usarMiUbicacion = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalización no disponible', 'Tu navegador no la soporta');
      return;
    }
    setUbicando(true);
    toast.info('Buscando tu ubicación...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setUbicando(false);
        toast.success('Ubicación detectada', 'El guía sabrá dónde recogerte');
      },
      () => {
        setUbicando(false);
        toast.error('No pude obtener tu ubicación', 'Escríbela manualmente');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fechaHora = `${fecha}T${hora}:00`;
      const { data } = await api.post('/reservas', {
        paquete_id: Number(paqueteId),
        fecha_hora: fechaHora,
        personas: Number(personas),
        lat_origen: lat ? Number(lat) : null,
        lng_origen: lng ? Number(lng) : null
      });
      setReservado(true);
      toast.success('¡Reserva enviada!', 'El guía confirmará tu solicitud pronto');
      setTimeout(() => navigate('/mis-viajes'), 1400);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al hacer la reserva');
      toast.error('No se pudo reservar', err.response?.data?.message);
      setLoading(false);
    }
  };

  const inputCls = 'w-full border border-grayLine rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gyellow focus:border-ink outline-none transition';

  if (!paquete) {
    return <div className="max-w-2xl mx-auto py-8"><div className="skeleton h-6 w-64 rounded mb-4" /><div className="skeleton h-96 rounded-2xl" /></div>;
  }

  const guia = paquete.guia;

  return (
    <div className="max-w-2xl mx-auto animate-in">
      <Link to={`/tour/${paquete.id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-ink transition mb-4 font-semibold">
        <IconArrowLeft className="w-4 h-4" /> Volver al tour
      </Link>
      <h1 className="text-2xl font-extrabold text-ink mb-1">Reservar tour</h1>
      <p className="text-gray-500 mb-6">
        <span className="font-semibold text-ink">{paquete.titulo}</span> · S/{paquete.precio} por persona · {paquete.duracion} h
      </p>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4 animate-in">{error}</div>}

      {reservado ? (
        <div className="bg-green-50 border border-ggreen/30 rounded-2xl p-8 text-center">
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-ggreen text-white"><IconCheck className="w-7 h-7" /></span>
          <h2 className="text-lg font-extrabold text-ink mb-1">¡Solicitud enviada!</h2>
          <p className="text-sm text-gray-600">Te redirigimos a Mis Viajes para seguir el estado.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-grayLine shadow-sm p-6 space-y-5">
          {guia && (
            <div className="flex items-center gap-3 rounded-xl bg-slateSoft p-3 -mt-1">
              <div className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center font-bold shrink-0">{guia.usuario.nombre?.[0]?.toUpperCase()}</div>
              <div>
                <div className="text-sm font-bold text-ink">Guía: {guia.usuario.nombre}</div>
                <div className="text-xs text-gray-500">{guia.especialidad} · {guia.idiomas}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5"><IconCalendar className="w-4 h-4 text-gray-400" /> Fecha</label>
              <input type="date" required value={fecha} min={new Date().toISOString().split('T')[0]} onChange={(e) => setFecha(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5"><IconClock className="w-4 h-4 text-gray-400" /> Hora</label>
              <input type="time" required value={hora} onChange={(e) => setHora(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5"><IconUsers className="w-4 h-4 text-gray-400" /> Número de personas</label>
            <input type="number" min={1} max={paquete.capacidad} value={personas} onChange={(e) => setPersonas(e.target.value)} className={inputCls} />
            <p className="text-xs text-gray-400 mt-1.5">Capacidad máxima: {paquete.capacidad} personas</p>
          </div>

          <div className="rounded-2xl border border-grayLine bg-slateSoft p-4">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-gray-700">Tu punto de partida (opcional)</label>
              <button type="button" onClick={usarMiUbicacion} disabled={ubicando} className="text-xs bg-ink hover:bg-black text-white px-3 py-2 rounded-lg transition inline-flex items-center gap-1.5 disabled:opacity-50">
                <IconPin className="w-3.5 h-3.5" /> {ubicando ? 'Ubicando...' : 'Usar mi ubicación'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Latitud</label>
                <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="-3.74913" className="w-full border border-grayLine rounded-lg px-3 py-2 text-sm outline-none focus:border-ink transition" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Longitud</label>
                <input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="-73.25391" className="w-full border border-grayLine rounded-lg px-3 py-2 text-sm outline-none focus:border-ink transition" />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-grayLine">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-semibold">Total estimado</span>
              <span className="text-2xl font-extrabold text-ink">S/{Number(paquete.precio) * Number(personas || 1)}</span>
            </div>
            <button type="submit" disabled={loading || reservado} className="w-full bg-ink hover:bg-black text-white font-bold py-3.5 rounded-xl transition disabled:opacity-50">
              {loading ? 'Enviando solicitud...' : `Reservar · S/${Number(paquete.precio) * Number(personas || 1)}`}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">El guía recibirá tu solicitud y la confirmará. No se cobra nada hoy.</p>
          </div>
        </form>
      )}
    </div>
  );
}