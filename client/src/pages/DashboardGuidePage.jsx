import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';
import { IconPencil, IconPlus, IconWallet, IconChat } from '../components/icons';

export default function DashboardGuidePage() {
  const { usuario } = useAuth();
  const toast = useToast();
  const [perfil, setPerfil] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [paquetes, setPaquetes] = useState([]);
  const [nuevoPaquete, setNuevoPaquete] = useState({ titulo: '', descripcion: '', duracion: 2, precio: '', capacidad: 4 });
  const [msg, setMsg] = useState('');
  const [cargando, setCargando] = useState(true);
  const [accionPendiente, setAccionPendiente] = useState(null); // { reservaId, estado, titulo }

  const cargar = () => {
    api.get('/guias/mi-perfil').then((r) => {
      setPerfil(r.data);
      setForm({ bio: r.data.bio || '', especialidad: r.data.especialidad || '', idiomas: r.data.idiomas || '', tarifa_hora: r.data.tarifa_hora, lat: r.data.lat || '', lng: r.data.lng || '' });
    }).catch(() => {});
    api.get('/reservas/guia').then((r) => setReservas(r.data)).catch(() => {});
    api.get('/paquetes').then((r) => setPaquetes(r.data.filter((p) => p.guia && p.guia.usuario && p.guia.usuario.id === usuario.id))).catch(() => {});
  };

  useEffect(() => { cargar(); setCargando(false); /* eslint-disable-next-line */ }, [usuario.id]);

  if (cargando) {
    return <div className="max-w-4xl mx-auto space-y-4"><div className="skeleton h-7 w-56 rounded-lg" />{[1, 2, 3].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>;
  }

  if (!perfil) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <p className="text-gray-500 mb-4">No tienes perfil de guía</p>
        <button onClick={() => setEdit(true)} className="bg-ink text-white px-5 py-2.5 rounded-xl text-sm font-bold transition hover:bg-black">Crear mi perfil de guía</button>
        {edit && <CrearPerfil />}
      </div>
    );
  }

  const actualizar = async (e) => {
    e.preventDefault();
    try { await api.put('/guias/perfil', form); setMsg('Perfil actualizado'); setEdit(false); toast.success('Perfil actualizado'); cargar(); }
    catch (err) { setMsg('Error: ' + (err.response?.data?.message || 'Error')); toast.error('No se pudo actualizar', err.response?.data?.message); }
  };

  const toggleDisp = async () => {
    try { await api.put('/guias/disponibilidad'); cargar(); toast.success(perfil.disponible ? 'Ya no estás disponible' : '¡Estás en línea!', perfil.disponible ? 'Los turistas ya no te verán en el mapa' : 'Los turistas podrán solicitarte ahora'); }
    catch (err) { toast.error('Error', err.response?.data?.message); }
  };

  const ejecutarEstado = async () => {
    if (!accionPendiente) return;
    const { reservaId, estado } = accionPendiente;
    const etiqueta = estado === 'confirmada' ? 'confirmada' : estado === 'cancelada' ? 'rechazada' : estado === 'en_curso' ? 'iniciada' : estado === 'completada' ? 'completada' : estado;
    try { await api.put(`/reservas/${reservaId}/estado`, { estado }); setMsg(`Reserva ${etiqueta}`); toast.success(`Reserva ${etiqueta}`); cargar(); }
    catch (err) { toast.error('Error', err.response?.data?.message); }
    setAccionPendiente(null);
  };

  const crearPaquete = async (e) => {
    e.preventDefault();
    try { await api.post('/paquetes', { ...nuevoPaquete, precio: Number(nuevoPaquete.precio) }); setMsg('Paquete creado'); setNuevoPaquete({ titulo: '', descripcion: '', duracion: 2, precio: '', capacidad: 4 }); toast.success('¡Tour publicado!'); cargar(); }
    catch (err) { setMsg('Error: ' + (err.response?.data?.message || 'Error')); toast.error('No se pudo publicar', err.response?.data?.message); }
  };

  const input = 'w-full border border-grayLine rounded-xl px-3 py-2 text-sm outline-none focus:border-ink transition font-semibold text-gray-700';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink">Panel de guía</h1>
        <button onClick={toggleDisp} className={`px-4 py-2 rounded-xl text-sm font-bold transition active:scale-95 ${perfil.disponible ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-ink hover:bg-black text-white'}`}>
          {perfil.disponible ? 'Pausar disponibilidad' : 'Activar disponibilidad'}
        </button>
      </div>

      {msg && <div className="bg-gyellow/15 border border-gyellow text-ink text-sm p-3 rounded-xl font-semibold">{msg}</div>}

      {/* Disponibilidad indicator */}
      <div className={`flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl ${perfil.disponible ? 'bg-green-50 text-ggreen' : 'bg-gray-100 text-gray-500'}`}>
        <span className={`relative flex h-2.5 w-2.5`}>
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${perfil.disponible ? 'bg-ggreen' : 'bg-gray-400'}`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${perfil.disponible ? 'bg-ggreen' : 'bg-gray-400'}`} />
        </span>
        {perfil.disponible ? 'Conectado: los turistas pueden solicitarte en el mapa ahora mismo' : 'Desconectado: actívalo para aparecer en el mapa'}
      </div>

      {/* Resumen */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-grayLine p-5 text-center hover:shadow-md transition"><div className="text-3xl font-extrabold text-ink">{reservas.filter((r) => r.estado !== 'cancelada').length}</div><div className="text-sm text-gray-500 font-medium">Reservas activas</div></div>
        <div className="bg-white rounded-2xl border border-grayLine p-5 text-center hover:shadow-md transition"><div className="text-3xl font-extrabold text-ink">{paquetes.length}</div><div className="text-sm text-gray-500 font-medium">Tours publicados</div></div>
        <div className="bg-white rounded-2xl border border-grayLine p-5 text-center hover:shadow-md transition"><div className="text-3xl font-extrabold text-ink">S/{perfil.tarifa_hora}</div><div className="text-sm text-gray-500 font-medium">Tarifa por hora</div></div>
      </div>

      {/* Perfil */}
      <section className="bg-white rounded-2xl border border-grayLine p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-extrabold text-ink">Mi perfil</h2>
          <button onClick={() => setEdit(!edit)} className="text-ink text-sm hover:underline font-bold inline-flex items-center gap-1">{edit ? 'Cancelar' : <><IconPencil className="w-3.5 h-3.5" /> Editar</>}</button>
        </div>
        {edit ? (
          <form onSubmit={actualizar} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className={input} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold text-gray-600 mb-1">Especialidad</label><input value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} className={input} /></div>
              <div><label className="block text-sm font-bold text-gray-600 mb-1">Idiomas</label><input value={form.idiomas} onChange={(e) => setForm({ ...form, idiomas: e.target.value })} className={input} /></div>
              <div><label className="block text-sm font-bold text-gray-600 mb-1">Tarifa (S/hora)</label><input type="number" step="0.01" value={form.tarifa_hora} onChange={(e) => setForm({ ...form, tarifa_hora: e.target.value })} className={input} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-sm font-bold text-gray-600 mb-1">Lat</label><input type="number" step="any" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} className={input} /></div>
                <div><label className="block text-sm font-bold text-gray-600 mb-1">Lng</label><input type="number" step="any" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} className={input} /></div>
              </div>
            </div>
            <button type="submit" className="bg-ink hover:bg-black text-white px-5 py-2 rounded-xl text-sm transition font-bold">Guardar</button>
          </form>
        ) : (
          <div>
            <p className="text-gray-600 text-sm">{perfil.bio}</p>
            <div className="flex flex-wrap gap-2 mt-3 text-sm">
              <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold">{perfil.especialidad}</span>
              <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold"><IconChat className="w-3.5 h-3.5" /> {perfil.idiomas}</span>
              <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold"><IconWallet className="w-3.5 h-3.5" /> S/{perfil.tarifa_hora}/h</span>
            </div>
          </div>
        )}
      </section>

      {/* Crear paquete */}
      <section className="bg-white rounded-2xl border border-grayLine p-6">
        <h2 className="font-extrabold text-ink mb-4 inline-flex items-center gap-2"><IconPlus className="w-4 h-4" /> Crear nuevo tour</h2>
        <form onSubmit={crearPaquete} className="grid md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-bold text-gray-600 mb-1">Título</label><input required value={nuevoPaquete.titulo} onChange={(e) => setNuevoPaquete({ ...nuevoPaquete, titulo: e.target.value })} className={input} placeholder="Ej: Tour delfines rosados" /></div>
          <div><label className="block text-sm font-bold text-gray-600 mb-1">Precio (S/)</label><input required type="number" step="0.01" min="1" value={nuevoPaquete.precio} onChange={(e) => setNuevoPaquete({ ...nuevoPaquete, precio: e.target.value })} className={input} /></div>
          <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-600 mb-1">Descripción</label><textarea required value={nuevoPaquete.descripcion} onChange={(e) => setNuevoPaquete({ ...nuevoPaquete, descripcion: e.target.value })} rows={2} className={input} /></div>
          <div><label className="block text-sm font-bold text-gray-600 mb-1">Duración (horas)</label><input type="number" min="1" value={nuevoPaquete.duracion} onChange={(e) => setNuevoPaquete({ ...nuevoPaquete, duracion: e.target.value })} className={input} /></div>
          <div><label className="block text-sm font-bold text-gray-600 mb-1">Capacidad (personas)</label><input type="number" min="1" value={nuevoPaquete.capacidad} onChange={(e) => setNuevoPaquete({ ...nuevoPaquete, capacidad: e.target.value })} className={input} /></div>
          <div className="md:col-span-2"><button type="submit" className="bg-ink hover:bg-black text-white px-6 py-2.5 rounded-xl text-sm transition font-bold">Publicar paquete</button></div>
        </form>
      </section>

      {/* Reservas */}
      <section>
        <h2 className="font-extrabold text-ink mb-4">Reservas recibidas</h2>
        <div className="space-y-3">
          {reservas.length === 0 && <p className="text-gray-400 text-center py-4 text-sm">Sin reservas por ahora</p>}
          {reservas.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-grayLine p-4 flex flex-wrap items-center justify-between gap-3 hover:shadow-md transition">
              <div>
                <div className="font-bold text-ink text-sm">{r.paquete?.titulo}</div>
                <div className="text-xs text-gray-500 mt-1">Turista: {r.turista?.nombre} · {r.personas} pers.</div>
                <div className="text-xs text-gray-400">{new Date(r.fecha_hora).toLocaleString('es-PE')}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' : r.estado === 'confirmada' ? 'bg-blue-100 text-blue-700' : r.estado === 'en_curso' ? 'bg-gray-100 text-gray-700' : r.estado === 'completada' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.estado}</span>
                {r.estado === 'pendiente' && (<>
                  <button onClick={() => setAccionPendiente({ reservaId: r.id, estado: 'confirmada' })} className="text-xs bg-ink hover:bg-black text-white px-3 py-1.5 rounded-lg font-bold transition active:scale-95">Aceptar</button>
                  <button onClick={() => setAccionPendiente({ reservaId: r.id, estado: 'cancelada' })} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-bold transition active:scale-95">Rechazar</button>
                </>)}
                {r.estado === 'confirmada' && <button onClick={() => setAccionPendiente({ reservaId: r.id, estado: 'en_curso' })} className="text-xs bg-ink hover:bg-black text-white px-3 py-1.5 rounded-lg font-bold transition active:scale-95">Iniciar tour</button>}
                {r.estado === 'en_curso' && <button onClick={() => setAccionPendiente({ reservaId: r.id, estado: 'completada' })} className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg font-bold transition active:scale-95">Completar</button>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ConfirmDialog
        open={!!accionPendiente}
        title={accionPendiente?.estado === 'cancelada' ? 'Rechazar reserva' : accionPendiente?.estado === 'confirmada' ? 'Aceptar reserva' : 'Cambiar estado de reserva'}
        message={`Estás por ${accionPendiente?.estado === 'cancelada' ? 'rechazar' : 'actualizar a: ' + (accionPendiente?.estado || '')} esta reserva. El turista será notificado.`}
        confirmLabel="Confirmar"
        tone={accionPendiente?.estado === 'cancelada' ? 'danger' : 'default'}
        onConfirm={ejecutarEstado}
        onCancel={() => setAccionPendiente(null)}
      />
    </div>
  );
}

function CrearPerfil() {
  const [form, setForm] = useState({ bio: '', especialidad: '', idiomas: '', tarifa_hora: 40 });
  const [msg, setMsg] = useState('');
  const input = 'w-full border border-grayLine rounded-xl px-3 py-2 text-sm outline-none focus:border-ink transition font-semibold text-gray-700';

  const crear = async (e) => {
    e.preventDefault();
    try { await api.post('/guias/perfil', { ...form, tarifa_hora: Number(form.tarifa_hora) }); setMsg('Perfil creado'); window.location.reload(); }
    catch (err) { setMsg('Error: ' + (err.response?.data?.message || 'Error')); }
  };

  return (
    <form onSubmit={crear} className="bg-white rounded-2xl border border-grayLine p-6 mt-4 text-left space-y-4">
      {msg && <div className="text-sm text-ink font-semibold">{msg}</div>}
      <div><label className="block text-sm font-bold text-gray-600 mb-1">Bio</label><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className={input} required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-bold text-gray-600 mb-1">Especialidad</label><input value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} className={input} required /></div>
        <div><label className="block text-sm font-bold text-gray-600 mb-1">Idiomas</label><input value={form.idiomas} onChange={(e) => setForm({ ...form, idiomas: e.target.value })} className={input} required /></div>
      </div>
      <div><label className="block text-sm font-bold text-gray-600 mb-1">Tarifa por hora (S/)</label><input type="number" step="0.01" min="1" value={form.tarifa_hora} onChange={(e) => setForm({ ...form, tarifa_hora: e.target.value })} className={input} required /></div>
      <button type="submit" className="bg-ink hover:bg-black text-white px-5 py-2 rounded-xl text-sm transition font-bold">Crear mi perfil</button>
    </form>
  );
}