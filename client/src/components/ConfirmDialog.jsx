import { IconX } from './icons';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', tone = 'danger', onConfirm, onCancel }) {
  if (!open) return null;
  const toneStyles = tone === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-forest hover:bg-forest2 text-card';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-card border border-sand shadow-xl w-full max-w-sm p-6 animate-in">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-ink transition">
          <IconX className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-extrabold text-ink mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2.5 rounded-sm text-sm font-semibold border border-sand hover:bg-papalt transition text-gray-700">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${toneStyles}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}