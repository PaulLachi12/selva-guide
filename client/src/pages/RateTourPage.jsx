import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { IconCheck, IconStar } from '../components/icons';

export default function RateTourPage() {
  const { id } = useParams(); // reserva_id
  const navigate = useNavigate();
  const toast = useToast();
  const [reserva, setReserva] = useState(null);
  const [estrellas, setEstrellas] = useState(5);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    api.get('/reservas/mias').then((r) => {
      const encontrada = r.data.find((x) => String(x.id) === String(id));
      if (encontrada) setReserva(encontrada);
    }).catch(() => {});
  }, [id]);

  if (!reserva) {
    return <div className="max-w-lg mx-auto py-10"><div className="skeleton h-7 w-40 rounded-lg mb-4" /><div className="skeleton h-96 rounded-2xl" /></div>;
  }

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await api.post('/valoraciones', {
        guia_id: reserva.paquete.guia.id,
        reserva_id: Number(id),
        estrellas,
        comentario
      });
      toast.success('¡Valoración guardada!', 'Gracias por ayudar a otros viajeros');
      setTimeout(() => navigate('/mis-viajes'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al valorar');
      toast.error('No se pudo guardar', err.response?.data?.message);
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto animate-in">
      <h1 className="text-2xl font-extrabold text-ink mb-1">Valorar tour</h1>
      <p className="text-gray-500 mb-6 font-medium">{reserva.paquete.titulo} · Guía {reserva.paquete.guia?.usuario?.nombre}</p>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4 animate-in">{error}</div>}

      <form onSubmit={enviar} className="bg-white rounded-2xl border border-grayLine shadow-sm p-6 space-y-5">
        <div className="text-center">
          <div className="flex justify-center items-center gap-1.5 mb-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setEstrellas(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                className={`transition hover:scale-125 active:scale-95 ${(hover || estrellas) >= n && n <= (hover || estrellas) ? 'text-gyellow' : 'text-gray-200'}`}
                aria-label={`${n} estrellas`}
              >
                <IconStar className={`w-9 h-9 ${n <= (hover || estrellas) ? 'fill-[#FFC936]' : ''}`} />
              </button>
            ))}
          </div>
          <p className="text-sm font-semibold text-gray-500">{hover || estrellas} de 5 estrellas</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Comentario</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
            placeholder="Cuéntanos cómo fue tu experiencia con el guía..."
            className="w-full border border-grayLine rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-gyellow focus:border-ink transition"
          />
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="w-full bg-ink hover:bg-black text-white font-bold py-3 rounded-xl transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {guardando ? 'Guardando...' : <><IconCheck className="w-4 h-4" /> Enviar valoración</>}
        </button>
      </form>
    </div>
  );
}