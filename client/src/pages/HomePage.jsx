import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TourListingCard from '../components/TourListingCard';
import MapComponent from '../components/MapComponent';
import { IconSearch, IconChat, IconShield, IconWallet, IconGlobe, IconClock, IconMap, IconCalendar, IconChevronDown, IconArrowRight } from '../components/icons';

const PASOS = [
  { Icon: IconSearch, titulo: 'Encuentre su guía', texto: 'Explore el mapa, compare perfiles, valoraciones y tarifas de los guías que están en línea.' },
  { Icon: IconChat, titulo: 'Chatee y confirme', texto: 'Escríbale directamente, aclare sus dudas y confirme la reserva en cuestión de minutos.' },
  { Icon: IconShield, titulo: 'Viva y valore', texto: 'Disfrute el recorrido con seguimiento en vivo y deje su reseña para otros viajeros.' },
];

const CAMPO = 'block w-full bg-transparent text-ink text-[14px] outline-none placeholder:text-gray-400 font-medium';

const selloCategoria = (label) => (label || '').toUpperCase();

export default function HomePage() {
  const [guias, setGuias] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ categoria: 'todas', precioMax: 0, duracion: 0, soloDisponibles: false, texto: '' });
  const [destino, setDestino] = useState('Iquitos, Perú');
  const [fecha, setFecha] = useState('');
  const [guiaResaltadaId, setGuiaResaltadaId] = useState(null);
  const [catAbierta, setCatAbierta] = useState(false);
  const [vista, setVista] = useState('lista');
  const refCategoria = useRef(null);

  useEffect(() => {
    Promise.all([api.get('/guias?disponible=true'), api.get('/paquetes')])
      .then(([g, p]) => { setGuias(g.data); setPaquetes(p.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const cerrar = (e) => { if (refCategoria.current && !refCategoria.current.contains(e.target)) setCatAbierta(false); };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);

  const disponibles = guias.filter((g) => g.disponible);

  const aplicarFiltros = (list) => list.filter((paq) => {
    const g = paq.guia;
    if (filtros.soloDisponibles && g && !g.disponible) return false;
    if (filtros.categoria !== 'todas' && g?.especialidad !== filtros.categoria) return false;
    if (filtros.precioMax > 0 && paq.precio > filtros.precioMax) return false;
    if (filtros.duracion > 0 && paq.duracion > filtros.duracion) return false;
    if (filtros.texto && !`${paq.titulo} ${paq.descripcion} ${g?.usuario?.nombre || ''}`.toLowerCase().includes(filtros.texto.toLowerCase())) return false;
    return true;
  });

  const categorias = [...new Set(paquetes.map((p) => p.guia?.especialidad).filter(Boolean))];
  const contadorCategoria = (label) => paquetes.filter((p) => p.guia?.especialidad === label).length;

  const buscar = (e) => {
    e.preventDefault();
    setFiltros((f) => ({ ...f, texto: destino }));
    document.getElementById('tours')?.scrollIntoView({ behavior: 'smooth' });
  };

  const elegirCategoria = (label) => {
    setFiltros((f) => ({ ...f, categoria: f.categoria === label ? 'todas' : label }));
    document.getElementById('tours')?.scrollIntoView({ behavior: 'smooth' });
  };

  const limpiar = () => setFiltros({ categoria: 'todas', precioMax: 0, duracion: 0, soloDisponibles: false, texto: '' });
  const tieneFiltrosActivos = filtros.categoria !== 'todas' || filtros.soloDisponibles || filtros.precioMax > 0 || filtros.duracion > 0;
  const filtrosKey = `${filtros.categoria}|${filtros.precioMax}|${filtros.duracion}|${filtros.soloDisponibles}|${filtros.texto}|${destino}`;
  const resultados = aplicarFiltros(paquetes || []);

  if (loading) {
    return (
      <div>
        <div className="border-b border-sand px-5 pt-20 pb-16">
          <div className="max-w-[800px] mx-auto space-y-5">
            <div className="skeleton h-3 w-48" />
            <div className="skeleton h-14 w-3/4" />
            <div className="skeleton h-[1px] w-full" />
          </div>
        </div>
        <div className="max-w-[1100px] mx-auto px-5 py-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-6 py-7">
              <div className="skeleton w-56 aspect-[4/3] shrink-0" />
              <div className="flex-1 space-y-3 pt-1">
                <div className="skeleton h-3 w-32" />
                <div className="skeleton h-6 w-2/3" />
                <div className="skeleton h-4 w-full max-w-md" />
                <div className="skeleton h-3 w-40 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* HERO + BUSCADOR FLAT */}
      <section className="border-b border-sand">
        <div className="max-w-[800px] mx-auto px-5 pt-20 pb-16 md:pt-24 md:pb-20 text-center">
          <p className="eyebrow text-terracotta mb-5 inline-flex items-center gap-3">
            <span className="inline-block h-px w-6 bg-terracotta/40" />
            Amazonía peruana
            <span className="inline-block h-px w-6 bg-terracotta/40" />
          </p>
          <h1 className="font-serif text-[40px] md:text-[52px] font-semibold leading-[1.08] tracking-tight text-ink mb-5">
            Guías locales certificados, cuando los necesite
          </h1>
          <p className="text-mut text-[17px] leading-relaxed mb-12">
            Solicite un guía al instante en el mapa, converse con él y recorra la selva con seguridad.
          </p>

          {/* Barra única de búsqueda: Destino | Fecha | Categoría | Buscar */}
          <form onSubmit={buscar} className="max-w-3xl mx-auto text-left">
            <div className="flex flex-col md:flex-row md:items-stretch bg-[#F4F1EA] border border-grayLine shadow-[0_12px_32px_rgba(34,34,34,0.07)] divide-y md:divide-y-0 md:divide-x divide-grayLine">
              <label className="flex-1 flex flex-col gap-1.5 p-5">
                <span className="eyebrow text-[9px] text-mut">Destino</span>
                <input value={destino} onChange={(e) => setDestino(e.target.value)} className={`${CAMPO} text-[15px]`} placeholder="¿A dónde vamos?" />
              </label>

              <label className="flex-1 flex flex-col gap-1.5 p-5">
                <span className="eyebrow text-[9px] text-mut">Fecha</span>
                <div className="relative">
                  <IconCalendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-forest pointer-events-none" />
                  <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={`${CAMPO} input-fecha pl-6 text-[15px]`} />
                </div>
              </label>

              <div className="flex-1 flex flex-col justify-center gap-1.5 p-5 relative" ref={refCategoria}>
                <span className="eyebrow text-[9px] text-mut">Categoría</span>
                <button type="button" onClick={() => setCatAbierta((v) => !v)} className="group flex items-center justify-between gap-2 text-left">
                  <span className={`${CAMPO} truncate ${filtros.categoria === 'todas' ? 'text-mut' : 'text-ink'}`}>
                    {selloCategoria(filtros.categoria === 'todas' ? 'Todas' : filtros.categoria)}
                  </span>
                  <IconChevronDown className={`w-4 h-4 text-mut shrink-0 transition-transform duration-300 ${catAbierta ? 'rotate-180' : ''}`} />
                </button>
                {catAbierta && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-2 bg-[#F4F1EA] border border-grayLine shadow-[0_16px_40px_rgba(34,34,34,0.10)] animate-in origin-top">
                    {(['todas', ...categorias]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => { setFiltros((f) => ({ ...f, categoria: c })); setCatAbierta(false); }}
                        className={`flex w-full items-center justify-between gap-3 text-left px-5 py-2.5 text-[13px] font-semibold transition-colors duration-200 ${filtros.categoria === c ? 'text-ink bg-papalt' : 'text-mut hover:text-ink hover:bg-papalt'}`}
                      >
                        {selloCategoria(c)}
                        <span className="font-mono text-[10px] text-gray-400">{contadorCategoria(c)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="group/btn md:self-stretch flex items-center justify-center gap-2 bg-forest text-cream font-semibold text-[15px] tracking-wide px-8 py-4 transition-all duration-300 ease-smooth hover:bg-forest2 hover:pl-9"
              >
                Buscar
                <IconArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>
          </form>

          {/* Confianza */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-[12px] text-mut">
            <span className="inline-flex items-center gap-1.5"><IconShield className="w-3.5 h-3.5 text-forest" /> Guías verificados</span>
            <span className="text-sand hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1.5"><IconWallet className="w-3.5 h-3.5 text-forest" /> Sin adelantos</span>
            <span className="text-sand hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1.5"><IconClock className="w-3.5 h-3.5 text-forest" /> Cancelación libre</span>
            <span className="text-sand hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1.5"><IconGlobe className="w-3.5 h-3.5 text-forest" /> En español</span>
          </div>
        </div>
      </section>

      {/* EXPERIENCIAS — un solo conjunto de filtros (chips) + split list/mapa */}
      <section id="tours" className="max-w-[1100px] mx-auto px-5 pt-14 pb-16 scroll-mt-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="eyebrow text-terracotta mb-2">Experiencias</p>
            <h2 className="font-serif text-[26px] md:text-[30px] font-semibold text-ink">{resultados.length} experiencias {tieneFiltrosActivos ? 'seleccionadas' : 'disponibles'}</h2>
          </div>
          <span className="text-[12px] font-mono text-mut hidden sm:block">Cancelación gratuita</span>
        </div>

        {/* Chips de categoría — estado activo carbón/crema */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          {(['todas', ...categorias]).map((c) => {
            const activo = filtros.categoria === c;
            return (
              <button key={c} onClick={() => elegirCategoria(c)} className={`chip ${activo ? 'chip-activo' : ''}`}>
                {selloCategoria(c)}
                {c !== 'todas' && <span className="chip-count">{contadorCategoria(c)}</span>}
              </button>
            );
          })}
          {tieneFiltrosActivos && (
            <button onClick={limpiar} className="chip chip-limpiar">Limpiar</button>
          )}
        </div>

        {/* Toggle Lista/Mapa solo en móvil */}
        <div className="lg:hidden inline-flex items-center gap-1 border border-grayLine bg-pap p-1 mb-6 shadow-sm">
          <button
            onClick={() => setVista('lista')}
            className={`px-5 py-1.5 text-[12px] font-semibold tracking-wide transition-all duration-250 ${vista === 'lista' ? 'bg-ink text-cream' : 'text-mut hover:text-ink'}`}
          >
            Lista
          </button>
          <button
            onClick={() => setVista('mapa')}
            className={`inline-flex items-center gap-1.5 px-5 py-1.5 text-[12px] font-semibold tracking-wide transition-all duration-250 ${vista === 'mapa' ? 'bg-ink text-cream' : 'text-mut hover:text-ink'}`}
          >
            <IconMap className="w-3.5 h-3.5" /> Mapa
          </button>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-10 items-start">
          {/* Lista editorial */}
          <div className={vista === 'mapa' ? 'hidden lg:block' : ''}>
            {resultados.length === 0 ? (
              <div className="py-16 text-center text-mut animate-in">
                <IconSearch className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                <p className="mb-3 font-medium">No encontramos experiencias con esos filtros</p>
                <button onClick={limpiar} className="text-terracotta text-[13px] font-semibold underline decoration-1 underline-offset-4 hover:text-ink transition">Limpiar filtros</button>
              </div>
            ) : (
              <div key={filtrosKey} className="divide-y divide-grayLine fade-up">
                {resultados.map((paq) => (
                  <div
                    key={paq.id}
                    onMouseEnter={() => setGuiaResaltadaId(paq.guia?.id || null)}
                    onMouseLeave={() => setGuiaResaltadaId(null)}
                  >
                    <TourListingCard paquete={paq} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mapa sticky — pines conectados a la lista */}
          <div id="mapa" className={`${vista === 'lista' ? 'hidden lg:block' : 'block'} lg:sticky lg:top-16 scroll-mt-20`}>
            <p className="eyebrow text-terracotta mb-3 flex items-center gap-2">
              <IconMap className="w-3.5 h-3.5 text-forest" /> Guías en línea
            </p>
            <div className="border border-sand bg-pap h-[72vh] lg:h-[560px]">
              <MapComponent
                guias={guias}
                guiaResaltadaId={guiaResaltadaId}
                onGuiaEntrar={setGuiaResaltadaId}
                onGuiaSalir={() => setGuiaResaltadaId(null)}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5 text-[11px] font-mono text-mut">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full border border-forest bg-forest/20" /> {disponibles.length} guías disponibles</span>
              <span className="text-forest font-semibold">{guias.length} en el mapa</span>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA — editorial plano */}
      <section className="border-t border-sand">
        <div className="max-w-[1100px] mx-auto px-5 py-16">
          <p className="eyebrow text-terracotta mb-3">Así de fácil</p>
          <h2 className="font-serif text-[26px] md:text-[30px] font-bold text-ink mb-12">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-0 md:gap-12">
            {PASOS.map(({ Icon, titulo, texto }, i) => (
              <div key={titulo} className="py-7 border-t border-sand md:border-t-0 md:pt-0 md:first:pl-0">
                <span className="block font-serif text-[44px] font-bold text-sand mb-4 select-none">{['01', '02', '03'][i]}</span>
                <h3 className="font-serif text-[18px] font-bold text-ink mb-2">{titulo}</h3>
                <p className="text-[14px] text-mut leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}