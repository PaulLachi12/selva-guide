import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { IconMountain, IconBoat, IconTemple, IconLeaf, IconPlate, IconCompass, IconCheck, IconChat, IconWallet, IconStar, IconClock, IconUsers, IconArrowRight } from '../components/icons';

const CAT = { Senderismo: IconMountain, Aventura: IconBoat, Cultural: IconTemple, Naturaleza: IconLeaf, Gastronomía: IconPlate };

export default function GuideProfilePage() {
  const { id } = useParams();
  const [guia, setGuia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/guias/${id}`).then((r) => setGuia(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-gray-200 border-t-ink rounded-full animate-spin" /></div>;
  if (!guia) return <div className="text-center py-20 text-gray-500">Guía no encontrado</div>;

  const { usuario, rating, total_valoraciones, valoraciones } = guia;
  const IconCat = CAT[guia.especialidad] || IconCompass;

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
<div className="bg-card border border-sand overflow-hidden mb-8">
          <div className="bg-gradient-to-br from-[#22302A] via-[#2C3E35] to-[#1B2822] h-32 md:h-40 flex items-center justify-center relative">
            <IconCat className="w-16 h-16 text-card/20" />
          </div>
        <div className="px-6 pb-6 flex flex-col md:flex-row gap-4 -mt-10 md:-mt-12 relative z-10">
          <div className="flex items-end shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white shadow-md flex items-center justify-center border-4 border-white overflow-hidden">
              <div className="w-full h-full bg-ink flex items-center justify-center text-white text-3xl font-extrabold">{usuario.nombre?.[0]?.toUpperCase() || 'G'}</div>
            </div>
          </div>
          <div className="flex-1 pt-2">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-extrabold text-ink">{usuario.nombre}</h1>
              {guia.verificado && <span className="inline-flex items-center gap-1 text-black text-xs font-bold bg-gyellow px-2 py-0.5 rounded"><IconCheck className="w-3 h-3" /> Verificado</span>}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2">
              <span className="inline-flex items-center gap-1 font-semibold text-ink bg-gray-50 rounded px-2 py-0.5 text-xs"><IconCat className="w-3 h-3" /> {guia.especialidad}</span>
              <span className="inline-flex items-center gap-1"><IconChat className="w-3.5 h-3.5 text-gray-400" /> {guia.idiomas}</span>
              <span className="inline-flex items-center gap-1"><IconWallet className="w-3.5 h-3.5 text-gray-400" /> S/{guia.tarifa_hora}/h</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">{guia.bio}</p>
          </div>
          <div className="flex md:flex-col items-center md:items-end gap-3 shrink-0 md:pt-10">
            <div className="flex items-center gap-1.5 bg-gyellow rounded-lg px-2.5 py-1.5">
              <IconStar className="w-4 h-4 fill-black" />
              <span className="text-lg font-extrabold text-black leading-none">{rating || 'Nuevo'}</span>
            </div>
            <div className="text-xs text-gray-400 font-semibold">{total_valoraciones} reseña{total_valoraciones === 1 ? '' : 's'}</div>
            <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${guia.disponible ? 'bg-green-50 text-ggreen' : 'bg-gray-100 text-gray-400'}`}>
              {guia.disponible ? 'Disponible' : 'No disponible'}
            </div>
          </div>
        </div>
      </div>

      {/* Tours */}
      <section>
        <h2 className="text-lg font-extrabold text-ink mb-4">Tours de {usuario.nombre} <span className="text-sm font-normal text-gray-400">({guia.paquetes.length})</span></h2>
        <div className="space-y-3">
          {guia.paquetes.map((paq) => (
            <Link key={paq.id} to={`/tour/${paq.id}`} className="block bg-white rounded-2xl border border-grayLine hover:shadow-md hover:border-gray-300 transition p-5 group">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="sm:w-44 h-28 bg-gradient-to-br from-[#EAE3D4] via-[#F1EDE2] to-[#D9CDB6] flex items-center justify-center shrink-0 border border-sand"><IconBoat className="w-10 h-10 text-forest" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-flex items-center gap-1 bg-gyellow text-black px-1.5 py-0.5 rounded text-xs font-extrabold"><IconStar className="w-3 h-3 fill-black" /> {paq.guia?.rating ? Number(paq.guia.rating).toFixed(1) : 'Nuevo'}</span>
                  </div>
                  <h3 className="text-base font-bold text-ink group-hover:underline">{paq.titulo}</h3>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1.5 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1"><IconClock className="w-3.5 h-3.5" /> {paq.duracion}h</span>
                    <span className="text-gray-300">·</span>
                    <span className="inline-flex items-center gap-1"><IconUsers className="w-3.5 h-3.5" /> {paq.capacidad} personas</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{paq.descripcion}</p>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-ink">S/{paq.precio}</div>
                    <div className="text-[10px] text-gray-400">por persona</div>
                  </div>
                  <span className="text-sm font-bold text-ink inline-flex items-center gap-1">Ver tour <IconArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </div>
            </Link>
          ))}
          {guia.paquetes.length === 0 && <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-grayLine"><IconBoat className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">Este guía aún no tiene tours publicados</p></div>}
        </div>
      </section>

      {/* Valoraciones */}
      <section className="mt-10">
        <h2 className="text-lg font-extrabold text-ink mb-4">Valoraciones <span className="text-sm font-normal text-gray-400">({valoraciones.length})</span></h2>
        <div className="space-y-3">
          {valoraciones.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl border border-grayLine p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center text-xs font-bold shrink-0">{v.turista?.nombre?.[0]?.toUpperCase() || '?'}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-ink">{v.turista.nombre}</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => <IconStar key={s} className={`w-3.5 h-3.5 ${s <= v.estrellas ? 'text-ochre fill-ochre' : 'text-gray-200'}`} />)}
                    </div>
                  </div>
                  {v.comentario && <p className="text-sm text-gray-600 leading-relaxed">{v.comentario}</p>}
                </div>
              </div>
            </div>
          ))}
          {valoraciones.length === 0 && <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-grayLine"><IconChat className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">Este guía aún no tiene valoraciones</p></div>}
        </div>
      </section>
    </div>
  );
}