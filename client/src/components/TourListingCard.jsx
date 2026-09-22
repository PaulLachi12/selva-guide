import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconMountain, IconBoat, IconTemple, IconLeaf, IconPlate, IconWave, IconCompass, IconStar, IconClock, IconHeart, IconArrowRight } from './icons';
import { useToast } from '../context/ToastContext';

const CAT = { Senderismo: IconMountain, Aventura: IconBoat, Cultural: IconTemple, Naturaleza: IconLeaf, Gastronomía: IconPlate, 'Avistamiento': IconWave };

const leerFavoritos = () => {
  try { return JSON.parse(localStorage.getItem('sg_favoritos') || '[]'); } catch { return []; }
};

export default function TourListingCard({ paquete }) {
  const toast = useToast();
  const g = paquete.guia;
  const cat = g?.especialidad || 'Otros';
  const Icon = CAT[cat] || IconCompass;
  const spots = Number(paquete.capacidad);
  const rating = g?.rating ? Number(g.rating) : null;
  const esTop = rating && rating >= 4.5;

  const [favorito, setFavorito] = useState(() => leerFavoritos().includes(paquete.id));

  const toggleFavorito = (e) => {
    e.preventDefault();
    const lista = leerFavoritos();
    const existe = lista.includes(paquete.id);
    const nueva = existe ? lista.filter((x) => x !== paquete.id) : [...lista, paquete.id];
    localStorage.setItem('sg_favoritos', JSON.stringify(nueva));
    setFavorito(!existe);
    if (!existe) toast.success('Añadido a favoritos', paquete.titulo);
    else toast.info('Quitado de favoritos', paquete.titulo);
  };

  const reseñasTexto =
    g?.total_valoraciones > 0
      ? g.total_valoraciones >= 1000 ? `${(g.total_valoraciones / 1000).toFixed(1).replace('.0', '')}k` : String(g.total_valoraciones)
      : null;

  return (
    <article className="group flex flex-col sm:flex-row gap-6 py-6 sm:py-7">
      {/* Imagen */}
      <Link to={`/tour/${paquete.id}`} className="relative block overflow-hidden shrink-0 aspect-[16/10] sm:aspect-[4/3] sm:w-48 md:w-56 bg-[#EAE3D4]">
        <div className="patron-selva absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-smooth group-hover:scale-[1.03]">
          <Icon className="w-12 h-12 text-forest/70 transition-transform duration-500 ease-smooth group-hover:scale-105" />
        </div>

        <span className={`stamp absolute top-3 left-3 px-2 py-0.5 ${esTop ? 'bg-forest text-white' : 'bg-white/90 text-ink border border-sand'}`}>
          {esTop ? '★ Bestseller' : 'Grupo pequeño'}
        </span>

        <button
          onClick={toggleFavorito}
          aria-label={favorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          className={`absolute top-3 right-3 h-7 w-7 flex items-center justify-center transition btn-press ${favorito ? 'text-terracotta' : 'text-ink/40 hover:text-ink'}`}
        >
          <IconHeart className={`h-4 w-4 ${favorito ? 'fill-current' : ''}`} />
        </button>
      </Link>

      {/* Contenido */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="eyebrow text-[10px] text-mut mb-1.5">
          Iquitos · <span className="text-terracotta">{cat}</span>
        </div>

        <h3 className="font-serif text-[21px] leading-snug text-ink transition-colors duration-300 ease-smooth">
          <Link to={`/tour/${paquete.id}`} className="link-underline group-hover:text-olive">{paquete.titulo}</Link>
        </h3>

        <p className="text-[14px] text-mut leading-relaxed mt-1.5 mb-3 max-w-2xl line-clamp-2">{paquete.descripcion}</p>

        <div className="meta-dots mb-4">
          <span>{paquete.duracion} h</span>
          <span>Español</span>
          <span>Hasta {spots} pers.</span>
        </div>

        {g && (
          <div className="flex items-center gap-2 text-[13px] text-mut mb-4">
            <span className="h-5 w-5 bg-forest text-white flex items-center justify-center text-[9px] font-bold shrink-0 transition-colors duration-300 ease-smooth group-hover:bg-terracotta">
              {g.usuario.nombre?.[0]?.toUpperCase() || 'G'}
            </span>
            <Link to={`/guia/${g.id}`} className="font-semibold text-ink transition-colors duration-300 ease-smooth truncate group-hover:text-terracotta">{g.usuario.nombre}</Link>
            <span className="text-sm font-semibold text-ink transition-colors duration-300 group-hover:text-terracotta ml-1">·</span>
            <Link to={`/tour/${paquete.id}`} className="hidden sm:inline-flex items-center gap-1 font-medium text-ink transition-colors duration-300 group-hover:text-olive">
              Ver detalles <IconArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4 border-t border-sand border-dashed">
          <div>
            {rating ? (
              <span className="font-mono text-[14px] font-bold text-ink">
                ★ {rating.toFixed(1)}{reseñasTexto && <span className="font-sans font-medium text-mut text-[12px]"> ({reseñasTexto})</span>}
              </span>
            ) : (
              <span className="stamp text-[9px] text-mut">Nueva experiencia</span>
            )}
          </div>
          <div className="text-right leading-none">
            <span className="stamp block text-[8px] text-mut mb-1">Desde</span>
            <span className="font-serif text-[20px] font-bold text-ink bg-pap px-2 py-0.5">S/{paquete.precio}</span>
            <span className="block text-[10px] text-mut mt-1">por persona</span>
          </div>
        </div>
      </div>

      {/* Cintra CTA en escritorio (flotante a la derecha del precio) */}
      <div className="hidden lg:flex flex-col justify-end shrink-0 pl-2">
        <Link to={`/tour/${paquete.id}`} className="group/cta btn-press inline-flex items-center gap-2 border border-sand text-ink hover:border-olive hover:text-olive text-[13px] font-semibold px-4 py-2 whitespace-nowrap">
          Ver experiencia
          <IconArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/cta:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}