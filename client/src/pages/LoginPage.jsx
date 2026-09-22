import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { IconBolt } from '../components/icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.usuario);
      toast.success(`¡Bienvenido, ${data.usuario.nombre}!`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      toast.error('No pudimos iniciar sesión', err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const rellenar = (mail, pass) => {
    setEmail(mail);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white rounded-2xl border border-grayLine shadow-sm p-8 animate-in">
        <h1 className="text-2xl font-extrabold text-ink mb-2">Iniciar sesión</h1>
        <p className="text-gray-500 text-sm mb-6">Accede para reservar tours y explorar la selva</p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4 animate-in">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-grayLine rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gyellow focus:border-ink outline-none transition"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-grayLine rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gyellow focus:border-ink outline-none transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink hover:bg-black text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 rounded-xl border border-grayLine bg-slateSoft p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><IconBolt className="w-3.5 h-3.5" /> Cuentas demo (clic para rellenar)</p>
          <div className="flex flex-wrap gap-2">
            {[['turista@selva.com', 'turista123', 'Turista'], ['juan@guia.com', 'guia123', 'Guía'], ['admin@selva.com', 'admin123', 'Admin']].map(([mail, pass, label]) => (
              <button key={label} type="button" onClick={() => rellenar(mail, pass)} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-grayLine bg-white hover:border-ink hover:bg-white transition">
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-ink underline font-semibold">Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
}