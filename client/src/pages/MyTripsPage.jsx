import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';
import { IconCompass, IconCalendar, IconUsers, IconPin, IconStar, IconChat } from '../components/icons';

const ESTADOS = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  confirmada: { label: 'Confirmada', color: 'bg-blue-100 text-blue-700' },
  en_curso: { label: 'En curso', color: 'bg-green-100 text-green-700' },
  completada: { label: 'Completada', color: 'bg-gray-100 text-gray-600' },
  cancelada: { label: 'Cancelada', color: 'bg-red-100 text-red-700' }
};

function EstadoBadge({ estado }) {
  const e = ESTADOS[estado] || { label: estado, color: 'bg-gray-100 text-gray-500' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${e.color}`}>{e.label}</span>;
}

export default function MyTripsPage() {
  const { usuario } = useAuth();
  const toast = useToast();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aCancelar, setACancelar] = useState(null);

  const cargar = () => {
    api
      .get(usuario.rol === 'guia' ? '/reservas/guia' : '/reservas/mias')
      .then((r) => setReservas(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(cargar, [usuario.rol]);

  const cancelar = async () => {
    try {
      await api.put(`/reservas/${aCancelar}/estado`, { estado: 'cancelada' });
      toast.success('Reserva cancelada', 'El guía será notificado');
      cargar();
    } catch (err) {
      toast.error('No se pudo cancelar', err.response?.data?.message);
    } finally {
      setACancelar(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="skeleton h-7 w-48 rounded-lg" />
        {[1, 2, 3].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-in">
      <h1 className="text-2xl font-extrabold text-ink mb-6">
        {usuario.rol === 'guia' ? 'Reservas de tus tours' : 'Mis viajes'}
      </h1>

      {reservas.length === 0 && (
        <div className="text-center text-gray-400 py-16 bg-white rounded-2xl border border-grayLine">
          <IconCompass className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="mb-4 font-semibold text-gray-500">Aún no tienes reservas</p>
          <Link to="/" className="text-ink underline font-semibold">Explorar tours</Link>
        </div>
      )}

      <div className="space-y-4">
        {reservas.map((r) => {
          const info = {
            titulo: r.paquete?.titulo,
            guiaNombre: r.paquete?.guia?.usuario?.nombre,
            guiaId: r.paquete?.guia?.usuario?.id,
            turistaId: r.turista?.id,
            turistaNombre: r.turista?.nombre,
            fecha: r.fecha_hora
          };
          return (
            <div key={r.id} className="bg-white rounded-2xl border border-grayLine hover:shadow-md hover:border-gray-300 transition p-5 group">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-ink group-hover:underline">{info.titulo || 'Tour'}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {usuario.rol === 'guia' ? `Turista: ${info.turistaNombre}` : `Guía: ${info.guiaNombre}`}
                  </p>
                  <p className="text-sm text-gray-500 inline-flex items-center gap-1.5">
                    <IconCalendar className="w-3.5 h-3.5 text-gray-400" /> {new Date(info.fecha).toLocaleString('es-PE')}
                    <span className="mx-0.5">•</span>
                    <IconUsers className="w-3.5 h-3.5 text-gray-400" /> {r.personas} personas
                  </p>
                </div>
                <EstadoBadge estado={r.estado} />
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-grayLine">
                {r.estado === 'pendiente' && usuario.rol === 'turista' && (
                  <button
                    onClick={() => setACancelar(r.id)}
                    className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg transition"
                  >
                    Cancelar reserva
                  </button>
                )}
                {r.estado === 'en_curso' && (
                  <Link
                    to={`/tracking/${r.id}`}
                    className="text-xs bg-ink hover:bg-black text-white font-semibold px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1.5"
                  >
                    <IconPin className="w-3.5 h-3.5" /> Ver tracking en vivo
                  </Link>
                )}
                {r.estado === 'completada' && usuario.rol === 'turista' && (
                  <Link
                    to={`/valorar/${r.id}`}
                    className="text-xs bg-gray-800 hover:bg-black text-white font-semibold px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1.5"
                  >
                    <IconStar className="w-3.5 h-3.5" /> Valorar tour
                  </Link>
                )}
                {((usuario.rol === 'guia' && info.turistaId) || (usuario.rol === 'turista' && info.guiaId)) && (
                  <Link
                    to={`/chat/${usuario.rol === 'guia' ? info.turistaId : info.guiaId}`}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1.5"
                  >
                    <IconChat className="w-3.5 h-3.5" /> Chatear
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={!!aCancelar}
        title="Cancelar reserva"
        message="Estás a punto de cancelar esta reserva. Esta acción no se puede deshacer."
        confirmLabel="Sí, cancelar"
        onConfirm={cancelar}
        onCancel={() => setACancelar(null)}
      />
    </div>
  );
}