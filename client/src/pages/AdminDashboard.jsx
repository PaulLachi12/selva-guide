import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { IconUsers, IconCompass, IconCalendar, IconClock, IconWallet, IconCheck } from '../components/icons';

export default function AdminDashboard() {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [guias, setGuias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const cargar = () => {
    api.get('/admin/stats').then((r) => setStats(r.data)).catch(() => {});
    api.get('/admin/guias').then((r) => setGuias(r.data)).catch(() => {});
    api.get('/admin/usuarios').then((r) => setUsuarios(r.data)).catch(() => {});
  };

  useEffect(cargar, []);

  const toggleVerificado = async (id, actual) => {
    try {
      await api.put(`/admin/guias/${id}/verificacion`, { verificado: !actual });
      cargar();
    } catch (err) {
      toast.error('No se pudo actualizar', err.response?.data?.message || 'Error del servidor');
    }
  };

  if (!stats) return <div className="text-center py-20 text-gray-500">Cargando panel admin...</div>;

  const cards = [
    { label: 'Usuarios', valor: stats.total_usuarios, Icon: IconUsers },
    { label: 'Guías', valor: stats.total_guias, Icon: IconCompass },
    { label: 'Reservas', valor: stats.total_reservas, Icon: IconCalendar },
    { label: 'Pendientes', valor: stats.reservas_pendientes, Icon: IconClock },
    { label: 'Ingresos (S/)', valor: 'S/' + stats.ingresos, Icon: IconWallet }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-brand-700">Panel de administración</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="mx-auto w-9 h-9 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center mb-2">
              <c.Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-brand-600">{c.valor}</div>
            <div className="text-xs text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="font-bold text-lg text-brand-700 mb-4">Guías ({guias.length})</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-brand-700">
              <tr>
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-left px-4 py-3">Especialidad</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3">Verificado</th>
                <th className="text-right px-4 py-3">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {guias.map((g) => (
                <tr key={g.id}>
                  <td className="px-4 py-3 font-medium">{g.usuario.nombre}</td>
                  <td className="px-4 py-3 text-gray-500">{g.especialidad || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${g.disponible ? 'bg-brand-50 text-brand-700' : 'bg-gray-100 text-gray-500'}`}>
                      {g.disponible ? 'Disponible' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {g.verificado
                      ? <span className="inline-flex items-center gap-1 bg-brand-100 text-brand-700 text-xs px-2 py-1 rounded-full"><IconCheck className="w-3 h-3" /> Verificado</span>
                      : <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Sin verificar</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleVerificado(g.id, g.verificado)}
                      className="text-xs text-brand-600 hover:underline"
                    >
                      {g.verificado ? 'Quitar verificación' : 'Verificar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-lg text-brand-700 mb-4">Usuarios ({usuarios.length})</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-brand-700">
              <tr>
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium">{u.nombre}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      u.rol === 'admin' ? 'bg-forest text-card' :
                      u.rol === 'guia' ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {u.rol}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}