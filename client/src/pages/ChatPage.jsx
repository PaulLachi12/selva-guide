import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSocket } from '../hooks/useSocket';
import { IconChat, IconArrowLeft, IconCheck, IconSend } from '../components/icons';

function DobleCheck({ visto }) {
  return (
    <span className={`inline-flex -ml-1 ${visto ? 'text-sky-300' : 'text-white/50'}`} aria-label={visto ? 'Visto' : 'Enviado'}>
      <IconCheck className="w-3 h-3" />
      <IconCheck className="w-3 h-3 -ml-1.5 translate-x-[-2px]" />
    </span>
  );
}

export default function ChatPage() {
  const { otroId } = useParams();
  const { usuario } = useAuth();
  const socket = useSocket();
  const toast = useToast();
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const [otro, setOtro] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get(`/mensajes/${otroId}`)
      .then((r) => {
        setMensajes(r.data);
        const otroNom = r.data.find((m) => String(m.emisor_id) === String(otroId))?.emisor?.nombre;
        if (otroNom) setOtro({ nombre: otroNom });
      })
      .catch(() => {});
  }, [otroId]);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      if (String(msg.emisor_id) === String(otroId) || String(msg.receptor_id) === String(otroId)) {
        setMensajes((m) => [...m, msg]);
      }
    };
    socket.on('chat_new_message', handler);
    return () => socket.off('chat_new_message', handler);
  }, [socket, otroId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim() || enviando) return;
    const contenido = texto.trim();
    setTexto('');
    setEnviando(true);
    try {
      const { data } = await api.post('/mensajes', { receptor_id: otroId, contenido });
      setMensajes((m) => [...m, data]);
    } catch (err) {
      setTexto(contenido);
      toast.error('No se pudo enviar', err.response?.data?.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in">
      <div className="bg-white rounded-2xl border border-grayLine shadow-sm overflow-hidden">
        <div className="bg-ink text-white px-5 py-3 flex items-center justify-between">
          <h1 className="font-semibold flex items-center gap-2"><IconChat className="w-4 h-4" /> {otro?.nombre || 'Conversación'}</h1>
          <Link to="/mis-viajes" className="text-white/70 text-sm hover:text-white hover:underline inline-flex items-center gap-1 transition"><IconArrowLeft className="w-4 h-4" /> Mis viajes</Link>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {mensajes.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-10">Sin mensajes todavía, saluda a tu acompañante</p>
          )}
          {mensajes.map((m, i) => {
            const esMio = String(m.emisor_id) === String(usuario.id);
            return (
              <div key={i} className={`flex items-end gap-2 ${esMio ? 'justify-end' : 'justify-start'}`}>
                {!esMio && (
                  <div className="w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center text-[10px] font-extrabold shrink-0">
                    {(m.emisor?.nombre || '?')?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${esMio ? 'bg-ink text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm'}`}>
                  {!esMio && <div className="font-semibold text-xs mb-1 opacity-60">{m.emisor?.nombre}</div>}
                  <div className="break-words">{m.contenido}</div>
                  <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${esMio ? 'text-white/60' : 'text-gray-400'}`}>
                    {esMio && <DobleCheck visto={!!m.leido} />}
                    {new Date(m.createdAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={enviar} className="p-3 border-t border-grayLine flex gap-2">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 border border-grayLine rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gyellow focus:border-ink transition"
          />
          <button type="submit" disabled={enviando || !texto.trim()} className="btn-press bg-ink hover:bg-black disabled:opacity-40 text-white px-4 py-2 rounded-xl text-sm font-semibold transition inline-flex items-center justify-center" aria-label="Enviar mensaje">
            {enviando ? '...' : <IconSend className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}