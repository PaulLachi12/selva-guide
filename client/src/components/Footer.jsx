import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconCompass, IconSend, IconShield, IconWallet, IconGlobe } from './icons';
import { useToast } from '../context/ToastContext';

const Social = ({ label, children }) => (
  <a href="#" onClick={(e) => e.preventDefault()} aria-label={label} className="text-mut hover:text-ink transition text-[13px]">
    {children}
  </a>
);

export default function Footer() {
  const toast = useToast();
  const [email, setEmail] = useState('');

  const suscribir = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmail('');
    toast.success('Suscripción confirmada', 'Recibirás novedades de la Amazonía');
  };

  return (
    <footer className="border-t border-sand mt-12">
      <div className="max-w-[1100px] mx-auto px-5 py-14">
        {/* Newsletter inline */}
        <div className="border-b border-sand pb-10 mb-10">
          <div className="max-w-lg">
            <p className="eyebrow text-terracotta mb-2">Correo de la selva</p>
            <h3 className="font-serif text-[22px] font-bold text-ink leading-snug mb-4">Reciba novedades y ofertas de nuestros guías locales</h3>
            <form onSubmit={suscribir} className="flex items-end gap-3">
              <div className="flex-1 border-b border-sand focus-within:border-ink transition pb-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full bg-transparent text-[14px] outline-none text-ink placeholder:text-gray-400"
                />
              </div>
              <button type="submit" className="btn-press border border-sand text-ink hover:border-ink text-[13px] font-semibold px-5 py-2 transition">
                Suscribir
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <IconCompass className="w-4 h-4 text-forest" />
              <span className="font-serif text-[15px] font-bold text-ink">SelvaGuide</span>
            </div>
            <p className="text-[13px] text-mut leading-relaxed mb-4">Tours con guías locales certificados en la Amazonía peruana.</p>
            <div className="flex gap-4">
              <Social label="Instagram">IG</Social>
              <Social label="Facebook">FB</Social>
              <Social label="YouTube">YT</Social>
            </div>
          </div>
          <div>
            <p className="eyebrow text-mut mb-4">Explorar</p>
            <div className="space-y-2.5 text-[13px]">
              <Link to="/" className="block text-mut hover:text-ink transition link-underline">Tours en Iquitos</Link>
              <Link to="/" className="block text-mut hover:text-ink transition link-underline">Guías locales</Link>
              <Link to="/registro" className="block text-mut hover:text-ink transition link-underline">Hazte guía</Link>
            </div>
          </div>
          <div>
            <p className="eyebrow text-mut mb-4">Cuenta</p>
            <div className="space-y-2.5 text-[13px]">
              <Link to="/login" className="block text-mut hover:text-ink transition link-underline">Iniciar sesión</Link>
              <Link to="/registro" className="block text-mut hover:text-ink transition link-underline">Crear cuenta</Link>
              <Link to="/mis-viajes" className="block text-mut hover:text-ink transition link-underline">Mis viajes</Link>
            </div>
          </div>
          <div>
            <p className="eyebrow text-mut mb-4">Por qué SelvaGuide</p>
            <div className="space-y-2.5 text-[13px]">
              <p className="flex items-center gap-2 text-mut"><IconShield className="w-3.5 h-3.5 text-forest shrink-0" /> Guías verificados</p>
              <p className="flex items-center gap-2 text-mut"><IconWallet className="w-3.5 h-3.5 text-forest shrink-0" /> Pago sin adelantos</p>
              <p className="flex items-center gap-2 text-mut"><IconGlobe className="w-3.5 h-3.5 text-forest shrink-0" /> Soporte en español</p>
            </div>
          </div>
        </div>
        <div className="border-t border-sand mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
          <span>© 2026 SelvaGuide · Iquitos, Perú</span>
          <div className="flex gap-5">
            <span className="cursor-pointer hover:text-ink transition">Términos</span>
            <span className="cursor-pointer hover:text-ink transition">Privacidad</span>
            <span className="cursor-pointer hover:text-ink transition">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}