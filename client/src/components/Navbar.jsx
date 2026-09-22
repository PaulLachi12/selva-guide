import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { IconCompass, IconSearch, IconMenu, IconX } from './icons';

export default function Navbar() {
  const { usuario, logout, isLoggedIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [perfilOpen, setPerfilOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cerrarTodo = () => { setMenuOpen(false); setPerfilOpen(false); };

  const handleLogout = () => {
    logout();
    cerrarTodo();
    toast.success('Sesión cerrada', 'Vuelve pronto a la selva');
    navigate('/');
  };

  const buscar = (e) => {
    e.preventDefault();
    cerrarTodo();
    navigate('/');
    setTimeout(() => searchRef.current?.focus(), 100);
  };

  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setMenuOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navCls = ({ isActive }) =>
    `px-1 py-1.5 font-semibold text-[13px] transition border-b ${isActive ? 'border-ink text-ink' : 'border-transparent text-mut hover:text-ink'}`;

  const enlacesEscritorio = isLoggedIn && (
    <div className="hidden md:flex items-center gap-5 text-[13px]">
      <NavLink to="/mis-viajes" className={navCls}>Mis Viajes</NavLink>
      <NavLink to="/conversaciones" className={navCls}>Mensajes</NavLink>
      {usuario.rol === 'guia' && <NavLink to="/dashboard-guia" className={navCls}>Panel Guía</NavLink>}
      {usuario.rol === 'admin' && <NavLink to="/admin" className={navCls}>Admin</NavLink>}
    </div>
  );

  const enlacesMoviles = (
    <div className="md:hidden flex flex-col gap-1 text-[14px]">
      <NavLink to="/mis-viajes" onClick={cerrarTodo} className={({ isActive }) => `py-2 px-3 transition ${isActive ? 'text-ink font-semibold' : 'text-mut hover:text-ink'}`}>Mis Viajes</NavLink>
      <NavLink to="/conversaciones" onClick={cerrarTodo} className={({ isActive }) => `py-2 px-3 transition ${isActive ? 'text-ink font-semibold' : 'text-mut hover:text-ink'}`}>Mensajes</NavLink>
      {usuario.rol === 'guia' && <NavLink to="/dashboard-guia" onClick={cerrarTodo} className={({ isActive }) => `py-2 px-3 transition ${isActive ? 'text-ink font-semibold' : 'text-mut hover:text-ink'}`}>Panel Guía</NavLink>}
      {usuario.rol === 'admin' && <NavLink to="/admin" onClick={cerrarTodo} className={({ isActive }) => `py-2 px-3 transition ${isActive ? 'text-ink font-semibold' : 'text-mut hover:text-ink'}`}>Admin</NavLink>}
    </div>
  );

  return (
    <nav className={`sticky top-0 z-50 bg-pap/95 backdrop-blur transition-all duration-300 ${scrolled ? 'border-b border-sand' : 'border-b border-transparent'}`}>
      <div className="max-w-[1100px] mx-auto px-5">
        <div className="flex items-center justify-between h-14">
          <Link to="/" onClick={cerrarTodo} className="flex items-center gap-2 shrink-0 btn-press">
            <IconCompass className="w-5 h-5 text-forest" />
            <span className="font-serif text-[17px] font-bold tracking-tight text-ink">SelvaGuide</span>
          </Link>

          {/* Buscador escritorio */}
          <form onSubmit={buscar} className="hidden lg:block flex-1 max-w-sm mx-6">
            <div className="flex items-center gap-2 border-b border-sand pb-1.5 text-sm text-mut hover:border-ink focus-within:border-ink transition">
              <IconSearch className="w-4 h-4" />
              <input
                ref={searchRef}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar tours y guías"
                className="flex-1 outline-none bg-transparent text-ink placeholder:text-gray-400 text-[13px]"
              />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-5">
            {enlacesEscritorio}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setPerfilOpen(!perfilOpen)}
                  className="h-8 w-8 bg-forest text-card font-serif text-sm font-bold flex items-center justify-center hover:bg-forest2 btn-press transition"
                  aria-label="Menú de usuario"
                >
                  {usuario.nombre?.[0]?.toUpperCase() || 'U'}
                </button>
                {perfilOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setPerfilOpen(false)} />
                    <div className="absolute right-0 mt-2 z-50 bg-pap border border-sand shadow-md w-56 py-1 animate-in origin-top-right">
                      <div className="px-4 py-3 border-b border-sand">
                        <p className="font-serif font-bold text-ink text-[13px] truncate">{usuario.nombre}</p>
                        <p className="text-[11px] text-mut">{usuario.rol === 'guia' ? 'Guía certificado' : usuario.rol}</p>
                      </div>
                      <Link to={usuario.rol === 'guia' ? '/dashboard-guia' : '/mis-viajes'} onClick={() => setPerfilOpen(false)} className="block w-full text-left px-4 py-2.5 text-[13px] text-mut hover:text-ink transition">Mi panel</Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-[13px] text-red-600 hover:text-red-700 transition">Cerrar sesión</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-[13px] font-semibold text-mut hover:text-ink transition">Iniciar sesión</Link>
                <Link to="/registro" className="border border-sand text-ink hover:border-ink px-4 py-1.5 text-[13px] font-semibold transition btn-press">Regístrate</Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 -mr-2 text-ink"
            aria-label="Abrir menú"
          >
            {menuOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-sand bg-pap px-5 py-4 flex flex-col gap-4 text-sm animate-in">
          <form onSubmit={buscar}>
            <div className="flex items-center gap-2 border-b border-sand pb-2 text-mut focus-within:border-ink transition">
              <IconSearch className="w-4 h-4" />
              <input
                ref={searchRef}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar tours en Iquitos"
                className="flex-1 outline-none bg-transparent text-ink placeholder:text-gray-400 text-[14px]"
              />
            </div>
          </form>
          {isLoggedIn ? (
            <div className="flex items-center justify-between border-b border-sand pb-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 bg-forest text-card flex items-center justify-center font-serif text-xs font-bold">{usuario.nombre?.[0]?.toUpperCase()}</div>
                <span className="font-semibold text-ink text-[13px] truncate">{usuario.nombre}</span>
              </div>
              <button onClick={handleLogout} className="text-red-600 font-semibold text-[13px]">Salir</button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-b border-sand pb-4">
              <Link to="/login" onClick={cerrarTodo} className="flex-1 text-center border border-sand py-2 font-semibold text-[13px] text-mut hover:text-ink hover:border-ink transition">Iniciar sesión</Link>
              <Link to="/registro" onClick={cerrarTodo} className="flex-1 text-center bg-forest text-card py-2 font-semibold text-[13px] hover:bg-forest2 transition">Regístrate</Link>
            </div>
          )}
          {isLoggedIn && enlacesMoviles}
        </div>
      )}
    </nav>
  );
}