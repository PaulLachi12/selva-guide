import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { IconChat } from '../components/icons';

export default function ConversationsPage() {
  const [conversaciones, setConversaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/mensajes/conversaciones').then((r) => setConversaciones(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-2xl mx-auto space-y-3"><div className="skeleton h-7 w-52 rounded-lg" />{[1, 2, 3].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto animate-in">
      <h1 className="text-2xl font-extrabold text-ink mb-6 flex items-center gap-2"><IconChat className="w-5 h-5" /> Conversaciones</h1>

      {conversaciones.length === 0 && (
        <div className="text-center text-gray-400 py-16 bg-white rounded-2xl border border-grayLine">
          <IconChat className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="font-semibold text-gray-500">Aún no tienes conversaciones</p>
        </div>
      )}

      <div className="space-y-3">
        {conversaciones.map((c) => (
          <Link
            key={c.otro_id}
            to={`/chat/${c.otro_id}`}
            className="block bg-white rounded-2xl border border-grayLine p-4 hover:shadow-md hover:border-gray-300 transition group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-ink flex items-center justify-center text-white font-bold group-hover:bg-black transition">
                  {c.otro_nombre?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-gray-800">{c.otro_nombre}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{c.ultimo_mensaje}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">{new Date(c.fecha).toLocaleDateString('es-PE')}</div>
                {c.cantidad_no_leidos > 0 && (
                  <div className="bg-ggreen text-white text-xs w-5 h-5 rounded-full flex items-center justify-center ml-auto mt-1 font-bold">
                    {c.cantidad_no_leidos}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}