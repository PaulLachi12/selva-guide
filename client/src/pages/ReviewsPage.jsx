import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { IconArrowLeft, IconStar } from '../components/icons';

export default function ReviewsPage() {
  const { guiaId } = useParams();
  const navigate = useNavigate();
  const [valoraciones, setValoraciones] = useState([]);
  const [guiaNombre, setGuiaNombre] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/valoraciones/guia/${guiaId}`),
      api.get(`/guias/${guiaId}`)
    ])
      .then(([v, g]) => {
        setValoraciones(v.data);
        setGuiaNombre(g.data.usuario.nombre);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [guiaId]);

  if (loading) return <div className="text-center py-20 text-gray-500">Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-700">Valoraciones de {guiaNombre}</h1>
        <button onClick={() => navigate(-1)} className="text-brand-600 text-sm hover:underline inline-flex items-center gap-1"><IconArrowLeft className="w-3.5 h-3.5" /> Volver</button>
      </div>

      {valoraciones.length === 0 && (
        <div className="text-center text-gray-400 py-16">Aún no hay valoraciones para este guía</div>
      )}

      <div className="space-y-3">
        {valoraciones.map((v) => (
          <div key={v.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <IconStar
                  key={s}
                  className={`w-4 h-4 ${s <= v.estrellas ? 'text-amber-400' : 'text-gray-200'}`}
                />
              ))}
              <span className="text-gray-500 text-sm ml-2 font-medium">{v.turista.nombre}</span>
            </div>
            {v.comentario && <p className="text-gray-600 mt-2">{v.comentario}</p>}
            <p className="text-xs text-gray-400 mt-2">{new Date(v.createdAt).toLocaleDateString('es-PE')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}