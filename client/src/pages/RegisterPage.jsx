import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { IconCompass } from '../components/icons';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', nombre: '', rol: 'turista' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/registro', form);
      login(data.token, data.usuario);
      toast.success('¡Cuenta creada!', 'Bienvenido a SelvaGuide');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar');
      toast.error('No pudimos crear tu cuenta', err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full border border-grayLine rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gyellow focus:border-ink outline-none transition';

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white rounded-2xl border border-grayLine shadow-sm p-8 animate-in">
        <h1 className="text-2xl font-extrabold text-ink mb-2">Crear cuenta</h1>
        <p className="text-gray-500 text-sm mb-6">Regístrate como turista o guía</p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4 animate-in">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre completo</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => update('nombre', e.target.value)}
              className={inputCls}
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className={inputCls}
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              className={inputCls}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">¿Cómo quieres registrarte?</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => update('rol', 'turista')}
                className={`flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm transition ${
                  form.rol === 'turista' ? 'border-ink bg-gray-50 text-ink shadow-sm' : 'border-gray-200 hover:border-gray-400 text-gray-500'
                }`}
              >
                <span className="inline-flex items-center gap-1.5"><IconCompass className="w-4 h-4" /> Turista</span>
              </button>
              <button
                type="button"
                onClick={() => update('rol', 'guia')}
                className={`flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm transition ${
                  form.rol === 'guia' ? 'border-ink bg-gray-50 text-ink shadow-sm' : 'border-gray-200 hover:border-gray-400 text-gray-500'
                }`}
              >
                <span className="inline-flex items-center gap-1.5"><IconCompass className="w-4 h-4" /> Guía</span>
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink hover:bg-black text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-ink underline font-semibold">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}