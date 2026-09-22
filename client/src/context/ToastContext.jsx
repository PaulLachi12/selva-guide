import { createContext, useContext, useState, useCallback } from 'react';
import { IconCheck, IconX, IconBolt } from '../components/icons';

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

let counter = 0;

const TOAST_STYLES = {
  success: { icon: IconCheck, frame: 'border-ggreen text-ggreen bg-green-50', bar: 'bg-ggreen' },
  error: { icon: IconX, frame: 'border-red-400 text-red-600 bg-red-50', bar: 'bg-red-500' },
  info: { icon: IconBolt, frame: 'border-gyellow text-ink bg-slatesoft border', bar: 'bg-gyellow' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback((type, title, message) => {
    const id = ++counter;
    setToasts((t) => [...t, { id, type, title, message }]);
    setTimeout(() => dismiss(id), 4000);
    return id;
  }, [dismiss]);

  const toast = {
    success: (title, message) => push('success', title, message),
    error: (title, message) => push('error', title, message),
    info: (title, message) => push('info', title, message),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[150] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => {
          const s = TOAST_STYLES[t.type] || TOAST_STYLES.info;
          const Icon = s.icon;
          return (
            <div key={t.id} role="status" className={`toast-enter pointer-events-auto relative overflow-hidden flex items-start gap-3 border rounded-xl bg-white p-4 shadow-xl ${s.frame.split(' ').filter(Boolean).slice(0, 2).join(' ')} bg-white`}>
              <span className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full shrink-0 ${s.frame.split(' ').filter((c) => c.startsWith('text') || c.startsWith('bg-')).join(' ')}`}>
                <Icon className="w-3.5 h-3.5" />
              </span>
              <div className="flex-1">
                {t.title && <p className="text-sm font-bold text-ink">{t.title}</p>}
                {t.message && <p className="text-sm text-gray-600">{t.message}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} aria-label="Cerrar" className="text-gray-400 hover:text-ink transition shrink-0">
                <IconX className="w-4 h-4" />
              </button>
              <span className={`absolute bottom-0 left-0 h-1 w-full ${s.bar} toast-timer`} />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}