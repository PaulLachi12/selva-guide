import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { IconMountain, IconBoat, IconTemple, IconLeaf, IconPlate, IconCompass, IconClock, IconUsers, IconChat, IconCheck, IconPin, IconCalendar, IconStar } from '../components/icons';

const CAT = { Senderismo: IconMountain, Aventura: IconBoat, Cultural: IconTemple, Naturaleza: IconLeaf, Gastronomía: IconPlate };

const highlights = [
  'Guía local certificado',
  'Seguro incluido',
  'Agua embotellada incluida',
  'Cancelación gratuita hasta 24h',
  'Recojo del hotel disponible',
];

export default function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const toast = useToast();
  const [paquete, setPaquete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantPersonas, setCantPersonas] = useState(2);

  useEffect(() => {
    api.get(`/paquetes/${id}`).then((r) => setPaquete(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-gray-200 border-t-ink rounded-full animate-spin" /></div>;
  if (!paquete) return <div className="text-center py-20 text-gray-500">Tour no encontrado</div>;

  const g = paquete.guia;
  const cat = g?.especialidad || 'Otros';
  const Icon = CAT[cat] || IconCompass;
  const total = paquete.precio * cantPersonas;
  const rating = g?.rating ? Number(g.rating).toFixed(1) : null;

  const handleReservar = () => {
    if (isLoggedIn) {
      navigate(`/reservar/${paquete.id}?personas=${cantPersonas}`);
    } else {
      toast.info('Inicia sesión para reservar', 'Se te redirigirá al login');
      navigate('/login');
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6">
      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div>
          {/* Imagen */}
          <div className="relative border border-sand overflow-hidden mb-5">
            <div className="bg-gradient-to-br from-[#EAE3D4] via-[#F1EDE2] to-[#D9CDB6] h-64 md:h-96 flex items-center justify-center">
              <Icon className="w-28 h-28 text-forest" />
            </div>
            <span className="absolute top-4 left-4 bg-ink text-card text-xs font-bold px-3 py-1.5">{cat}</span>
          </div>

          {/* Título + rating */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink mb-3 leading-tight">{paquete.titulo}</h1>

          <div className="flex flex-wrap items-center gap-2 text-sm mb-6">
            <span className="inline-flex items-center gap-1 bg-gyellow text-black px-2 py-0.5 rounded-lg font-extrabold">
              <IconStar className="w-3.5 h-3.5 fill-black" /> {rating}
            </span>
            <span className="font-semibold text-gray-700">{rating ? 'Excelente' : 'Nuevo en SelvaGuide'}</span>
            <span className="text-gray-400">({g?.total_valoraciones || 0} reseñas)</span>
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1 text-gray-600"><IconClock className="w-4 h-4" /> {paquete.duracion} horas</span>
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1 text-gray-600"><IconUsers className="w-4 h-4" /> Hasta {paquete.capacidad} personas</span>
          </div>

          {/* Descripción */}
          <section className="mb-8">
            <h2 className="text-xl font-extrabold text-ink mb-2">Sobre esta actividad</h2>
            <p className="text-gray-600 leading-relaxed">{paquete.descripcion}</p>
          </section>

          {/* Incluido */}
          <section className="bg-white rounded-2xl border border-grayLine p-6 mb-5">
            <h2 className="text-lg font-extrabold text-ink mb-4">Incluido</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-ggreen shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{h}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Punto de encuentro */}
          <section className="bg-white rounded-2xl border border-grayLine p-6 mb-5">
            <h2 className="text-lg font-extrabold text-ink mb-2">Punto de encuentro</h2>
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <IconPin className="w-4 h-4 text-ink shrink-0 mt-0.5" />
              {g?.direccion ? `${g.direccion} — ${g.ciudad || 'Iquitos'}` : 'Se coordina por mensaje después de reservar'}
            </p>
          </section>

          {/* Guía */}
          <section className="bg-white rounded-2xl border border-grayLine p-6">
            <h2 className="text-lg font-extrabold text-ink mb-3">Tu guía</h2>
            {g && (
              <Link to={`/guia/${g.id}`} className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 -m-2 transition">
                <div className="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center font-bold text-base shrink-0">{g.usuario.nombre?.[0]?.toUpperCase() || 'G'}</div>
                <div>
                  <div className="font-bold text-sm text-ink flex items-center gap-2">
                    {g.usuario.nombre}
                    {g.verificado && <span className="text-[10px] font-bold bg-gyellow text-black px-1.5 py-0.5 rounded">Verificado</span>}
                  </div>
                  <div className="text-xs text-gray-500">{g.especialidad} · <IconChat className="w-3 h-3 inline" /> {g.idiomas}</div>
                </div>
              </Link>
            )}
          </section>
        </div>

        {/* Sidebar reserva */}
        <div className="lg:sticky lg:top-20">
          <div className="bg-white rounded-2xl border border-grayLine shadow-sm p-6">
            <div className="flex items-baseline justify-between mb-1">
              <div>
                <div className="text-xs text-gray-500">desde</div>
                <div className="text-[28px] font-extrabold text-ink leading-tight">S/{paquete.precio}</div>
              </div>
              <div className="text-xs text-gray-500">por persona</div>
            </div>

            <div className="space-y-3 my-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Viajeros</label>
                <select value={cantPersonas} onChange={(e) => setCantPersonas(Number(e.target.value))} className="w-full border border-grayLine rounded-xl px-3 py-3 text-sm font-semibold outline-none focus:border-ink">
                  {Array.from({ length: Math.min(8, Number(paquete.capacidad)) }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 w-full border border-grayLine rounded-xl px-3 py-3 text-sm text-gray-400 bg-gray-50 font-semibold">
                <IconCalendar className="w-4 h-4" /> Seleccionar fecha al reservar
              </div>
            </div>

            <button onClick={handleReservar} className="w-full bg-ink hover:bg-black text-white font-bold py-3.5 rounded-xl transition text-[15px]">
              Reservar ahora
            </button>
            <div className="text-center text-xs text-gray-400 mt-2 mb-4">No se cobra nada hoy</div>

            <div className="pt-4 border-t border-grayLine space-y-2 text-sm">
              <div className="flex justify-between text-gray-500"><span>Por persona</span><span className="font-semibold">S/{paquete.precio}</span></div>
              <div className="flex justify-between text-gray-500"><span>{cantPersonas} persona{cantPersonas > 1 ? 's' : ''}</span><span className="font-semibold">S/{total}</span></div>
              <div className="pt-2 border-t border-grayLine flex justify-between font-extrabold text-ink text-[15px]"><span>Total</span><span>S/{total}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}